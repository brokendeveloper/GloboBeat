import { Router, type Request, type Response } from 'express';
import uploadRoutes from './uploadRoutes.js';

const router = Router();

/**
 * Health check endpoint
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'GloboBeat API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * Upload routes
 */
router.use('/upload', uploadRoutes);
router.use('/uploads', uploadRoutes);

export default router;
