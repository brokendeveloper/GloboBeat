import type { Request, Response, NextFunction } from 'express';
import detectionService from '../services/detectionService.js';

class DetectionController {
  /**
   * Get all detections for an upload
   * GET /api/uploads/:uploadId/detections
   */
  async getDetectionsByUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId || isNaN(Number(uploadId))) {
        res.status(400).json({
          success: false,
          error: 'Invalid upload ID'
        });
        return;
      }

      const detections = await detectionService.getDetectionsByUploadId(parseInt(uploadId, 10));
      const stats = await detectionService.getDetectionStats(parseInt(uploadId, 10));

      res.json({
        success: true,
        detections,
        stats,
        count: detections.length
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all detections pending validation
   * GET /api/detections/pending
   */
  async getPendingValidations(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 100;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      const detections = await detectionService.getPendingValidations(limit, offset);

      res.json({
        success: true,
        detections,
        count: detections.length,
        pagination: { limit, offset }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a detection by ID
   * GET /api/detections/:id
   */
  async getDetection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          error: 'Invalid detection ID'
        });
        return;
      }

      const detection = await detectionService.getDetectionById(parseInt(id, 10));

      if (!detection) {
        res.status(404).json({
          success: false,
          error: 'Detection not found'
        });
        return;
      }

      res.json({
        success: true,
        detection
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Validate a detection (confirm or reject)
   * PATCH /api/detections/:id/validate
   */
  async validateDetection(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { validated } = req.body;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          error: 'Invalid detection ID'
        });
        return;
      }

      if (typeof validated !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'validated must be a boolean'
        });
        return;
      }

      const detection = await detectionService.validateDetection(parseInt(id, 10), validated);

      if (!detection) {
        res.status(404).json({
          success: false,
          error: 'Detection not found'
        });
        return;
      }

      res.json({
        success: true,
        message: validated ? 'Detection confirmed' : 'Detection rejected',
        detection
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Batch validate detections
   * POST /api/detections/batch-validate
   */
  async batchValidate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids, validated } = req.body;

      if (!Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({
          success: false,
          error: 'ids must be a non-empty array'
        });
        return;
      }

      if (typeof validated !== 'boolean') {
        res.status(400).json({
          success: false,
          error: 'validated must be a boolean'
        });
        return;
      }

      const count = await detectionService.batchValidate(ids, validated);

      res.json({
        success: true,
        message: `${count} detection(s) ${validated ? 'confirmed' : 'rejected'}`,
        count
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new DetectionController();
