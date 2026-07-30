import { Router } from 'express';
import { createReport } from '../controllers/report.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Only logged in users can report
router.post('/', protect, createReport);

export default router;