import { Router, type Request, type Response } from 'express';
import uploadRoutes from './uploadRoutes.js';
import detectionRoutes from './detectionRoutes.js';
import detectionController from '../controllers/detectionController.js';

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

/**
 * Detection routes
 */
router.use('/detections', detectionRoutes);

/**
 * Get detections for a specific upload
 * GET /api/uploads/:uploadId/detections
 */
router.get('/uploads/:uploadId/detections', (req, res, next) => {
  detectionController.getDetectionsByUpload(req, res, next);
});

export default router;
