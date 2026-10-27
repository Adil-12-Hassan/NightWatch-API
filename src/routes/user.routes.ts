import { Router } from 'express';
import {
    getUserProfile,
    updateMyProfile,
    getMyVideos,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Protected
router.put('/me', protect, updateMyProfile);
router.get('/me/videos', protect, getMyVideos);

// Public
router.get('/:id', getUserProfile);

export default router;