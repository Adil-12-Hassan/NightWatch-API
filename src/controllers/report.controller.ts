import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Report from '../models/Report.model';

// POST /api/reports — report a video
export const createReport = async (req: AuthRequest, res: Response) => {
    const { videoId, reason } = req.body;

    if (!videoId || !reason)
        return res.status(400).json({ message: 'Video ID and reason are required' });

    // Ek user ek video ko baar baar report na kar sake
    const existing = await Report.findOne({
        video: videoId,
        reportedBy: req.user!.id,
    });

    if (existing)
        return res.status(400).json({ message: 'You already reported this video' });

    const report = await Report.create({
        video: videoId,
        reportedBy: req.user!.id,
        reason,
    });
    res.status(201).json(report);
};