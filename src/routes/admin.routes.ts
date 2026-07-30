import { Router } from 'express';
import {
    getAllUsers,
    deleteUser,
    toggleBanUser,
    getAllVideosAdmin,
    deleteVideoAdmin,
    getAllReports,
    updateReportStatus,
} from '../controllers/admin.controller';
import { protect } from '../middleware/auth.middleware';
import { adminOnly } from '../middleware/admin.middleware';

const router = Router();

// Double middleware — pehle JWT verify, phir admin check
router.use(protect, adminOnly);

// Users
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/ban', toggleBanUser);

// Videos
router.get('/videos', getAllVideosAdmin);
router.delete('/videos/:id', deleteVideoAdmin);

// Reports
router.get('/reports', getAllReports);
router.put('/reports/:id', updateReportStatus);

export default router;