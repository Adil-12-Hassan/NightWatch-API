import { Router } from 'express';
import {
    getUserProfile,
    updateMyProfile,
    getMyVideos,
} from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public
router.get('/:id', getUserProfile);

// Protected
router.put('/me', protect, updateMyProfile);
router.get('/me/videos', protect, getMyVideos);

export default router;