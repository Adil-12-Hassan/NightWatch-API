import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import User from '../models/User.model';
import Video from '../models/Video.model';

// GET /api/users/:id — public profile
export const getUserProfile = async (req: AuthRequest, res: Response) => {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

// PUT /api/users/me — update own profile
export const updateMyProfile = async (req: AuthRequest, res: Response) => {
    const { username, avatar } = req.body;

    const updated = await User.findByIdAndUpdate(
        req.user!.id,
        { username, avatar },
        { new: true, runValidators: true }
    ).select('-password');

    res.json(updated);
};

// GET /api/users/me/videos — my uploaded videos
export const getMyVideos = async (req: AuthRequest, res: Response) => {
    const videos = await Video.find({ owner: req.user!.id })
        .sort({ createdAt: -1 });
    res.json(videos);
};