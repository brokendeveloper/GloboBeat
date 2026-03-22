import type { Request, Response, NextFunction } from 'express';
import jobService from '../services/jobService.js';
import detectionService from '../services/detectionService.js';

class JobController {
  /**
   * Get job status by ID
   * GET /api/jobs/:id
   */
  async getJobStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        res.status(400).json({
          success: false,
          error: 'Job ID required'
        });
        return;
      }

      const job = await jobService.getJobById(id);

      if (!job) {
        res.status(404).json({
          success: false,
          error: 'Job not found'
        });
        return;
      }

      // If job is completed, also return detections count
      let detectionsCount = 0;
      if (job.status === 'completed' && job.upload_id) {
        const detections = await detectionService.getDetectionsByUploadId(job.upload_id);
        detectionsCount = detections.length;
      }

      res.json({
        success: true,
        job: {
          id: job.id,
          upload_id: job.upload_id,
          status: job.status,
          created_at: job.created_at,
          updated_at: job.updated_at
        },
        detectionsCount
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get job status by upload ID
   * GET /api/uploads/:uploadId/job
   */
  async getJobByUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { uploadId } = req.params;

      if (!uploadId || isNaN(Number(uploadId))) {
        res.status(400).json({
          success: false,
          error: 'Invalid upload ID'
        });
        return;
      }

      const job = await jobService.getJobByUploadId(parseInt(uploadId, 10));

      if (!job) {
        res.status(404).json({
          success: false,
          error: 'No job found for this upload'
        });
        return;
      }

      // Get detections count
      let detectionsCount = 0;
      if (job.upload_id) {
        const detections = await detectionService.getDetectionsByUploadId(job.upload_id);
        detectionsCount = detections.length;
      }

      res.json({
        success: true,
        job: {
          id: job.id,
          upload_id: job.upload_id,
          status: job.status,
          created_at: job.created_at,
          updated_at: job.updated_at
        },
        detectionsCount
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new JobController();
