import { Router } from 'express';
import { uploadVideo, getAllVideos, getVideoById, updateVideo, deleteVideo } from '../controllers/video.controller';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();
router.get('/', getAllVideos);
router.get('/:id', getVideoById);
router.post('/', protect, upload.fields([{ name: 'video' }, { name: 'thumbnail' }]), uploadVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);

export default router;