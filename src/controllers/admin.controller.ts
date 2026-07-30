import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Video from '../models/Video.model';
import Report from '../models/Report.model';

// ─── USERS ───────────────────────────────────────────

// GET /api/admin/users — list all users
export const getAllUsers = async (req: AuthRequest, res: Response) => {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
};

// DELETE /api/admin/users/:id — ban or delete user
export const deleteUser = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user!.id)
        return res.status(400).json({ message: 'Cannot delete your own account' });

    await user.deleteOne();
    res.json({ message: 'User deleted successfully' });
};

// PUT /api/admin/users/:id/ban — toggle ban status
export const toggleBanUser = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.isBanned = !user.isBanned;
    await user.save();

    res.json({
        message: user.isBanned ? 'User banned' : 'User unbanned',
        isBanned: user.isBanned,
    });
};

// ─── VIDEOS ──────────────────────────────────────────

// GET /api/admin/videos — list all videos
export const getAllVideosAdmin = async (req: AuthRequest, res: Response) => {
    const videos = await Video.find()
        .populate('owner', 'username email')
        .sort({ createdAt: -1 });
    res.json(videos);
};

// DELETE /api/admin/videos/:id — remove policy violating video
export const deleteVideoAdmin = async (req: AuthRequest, res: Response) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    await video.deleteOne();
    res.json({ message: 'Video removed by admin' });
};

// ─── REPORTS ─────────────────────────────────────────

// GET /api/admin/reports — all submitted reports
export const getAllReports = async (req: AuthRequest, res: Response) => {
    const reports = await Report.find()
        .populate('video', 'title videoUrl')
        .populate('reportedBy', 'username email')
        .sort({ createdAt: -1 });
    res.json(reports);
};

// PUT /api/admin/reports/:id — resolve or dismiss
export const updateReportStatus = async (req: AuthRequest, res: Response) => {
    const { status } = req.body;

    if (!['resolved', 'dismissed'].includes(status))
        return res.status(400).json({ message: 'Invalid status value' });

    const report = await Report.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
    );

    if (!report) return res.status(404).json({ message: 'Report not found' });
    res.json(report);
};