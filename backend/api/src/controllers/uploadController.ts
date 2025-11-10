import type { Request, Response, NextFunction } from 'express';
import uploadService from '../services/uploadService.js';

class UploadController {
  /**
   * Handle file upload
   * POST /api/upload
   */
  async uploadFile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
        return;
      }

      // TODO: Extract user ID from JWT token when authentication is implemented
      const userId = (req as any).user?.id || null;

      // Process upload (S3 + DB)
      const uploadRecord = await uploadService.processFileUpload(req.file, userId);

      res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        upload: {
          id: uploadRecord.id,
          filename: uploadRecord.original_filename,
          s3Key: uploadRecord.s3_key,
          size: uploadRecord.file_size,
          status: uploadRecord.status,
          uploadedAt: uploadRecord.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get upload by ID
   * GET /api/upload/:id
   */
  async getUpload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;

      if (!id || isNaN(Number(id))) {
        res.status(400).json({
          success: false,
          error: 'Invalid upload ID'
        });
        return;
      }

      const upload = await uploadService.getUploadById(parseInt(id, 10));

      if (!upload) {
        res.status(404).json({
          success: false,
          error: 'Upload not found'
        });
        return;
      }

      res.json({
        success: true,
        upload
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all uploads
   * GET /api/uploads
   */
  async listUploads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string, 10) || 100;
      const offset = parseInt(req.query.offset as string, 10) || 0;

      const uploads = await uploadService.getAllUploads(limit, offset);

      res.json({
        success: true,
        uploads,
        count: uploads.length,
        pagination: {
          limit,
          offset
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new UploadController();
