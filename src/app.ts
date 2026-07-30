import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth.routes';
import videoRoutes from './routes/video.routes';
import userRoutes from './routes/user.routes';
import reportRoutes from './routes/report.routes';
import adminRoutes from './routes/admin.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

app.get('/', (_req, res) => {
    res.json({ message: 'Backend is running' });
});

app.get('/api', (_req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);

app.use(errorHandler);

export default app;
