import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import Video from '../models/Video.model';
import cloudinary, { hasCloudinaryConfig } from '../config/cloudinary';
import { Readable } from 'stream';

const uploadToCloudinary = (buffer: Buffer, folder: string, resourceType: 'video' | 'image') =>
    new Promise<string>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder, resource_type: resourceType },
            (err, result) => (err ? reject(err) : resolve(result!.secure_url))
        );
        Readable.from(buffer).pipe(stream);
    });

export const uploadVideo = async (req: AuthRequest, res: Response) => {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const videoFile = files?.video?.[0];
    const thumbFile = files?.thumbnail?.[0];

    if (!videoFile) return res.status(400).json({ message: 'Video file required' });
    if (!hasCloudinaryConfig)
        return res.status(500).json({ message: 'Cloudinary configuration is missing' });

    const videoUrl = await uploadToCloudinary(videoFile.buffer, 'nightwatch/videos', 'video');
    const thumbnail = thumbFile
        ? await uploadToCloudinary(thumbFile.buffer, 'nightwatch/thumbnails', 'image')
        : '';

    const video = await Video.create({
        title: req.body.title,
        description: req.body.description,
        genre: req.body.genre,
        videoUrl,
        thumbnail,
        owner: req.user!.id,
    });

    res.status(201).json(video);
};

export const getAllVideos = async (_req: AuthRequest, res: Response) => {
    const videos = await Video.find({ isPublished: true })
        .populate('owner', 'username avatar')
        .sort({ createdAt: -1 });
    res.json(videos);
};

export const getVideoById = async (req: AuthRequest, res: Response) => {
    const video = await Video.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },   // views++ automatically
        { new: true }
    ).populate('owner', 'username avatar');
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json(video);
};

export const updateVideo = async (req: AuthRequest, res: Response) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    if (video.owner.toString() !== req.user!.id)
        return res.status(403).json({ message: 'Not your video' });
    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
};

export const deleteVideo = async (req: AuthRequest, res: Response) => {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    if (video.owner.toString() !== req.user!.id && req.user!.role !== 'admin')
        return res.status(403).json({ message: 'Not authorized' });
    await video.deleteOne();
    res.json({ message: 'Video deleted' });
};
