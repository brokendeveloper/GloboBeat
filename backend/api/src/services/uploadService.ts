import pool from '../config/database.js';
import s3Service from './s3Service.js';
import type { Upload, CreateUploadData, UploadStatus } from '../types/index.js';

class UploadService {
  /**
   * Create upload record in database
   * @param uploadData - Upload metadata
   * @returns Created upload record
   */
  async createUpload(uploadData: CreateUploadData): Promise<Upload> {
    const { filename, originalFilename, s3Key, fileSize, mimeType, userId = null } = uploadData;

    const query = `
      INSERT INTO uploads (filename, original_filename, s3_key, file_size, mime_type, status, user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, filename, original_filename, s3_key, file_size, mime_type, status, user_id, created_at, updated_at
    `;

    const values = [filename, originalFilename, s3Key, fileSize, mimeType, 'uploaded', userId];

    try {
      const result = await pool.query<Upload>(query, values);
      const upload = result.rows[0];
      console.log(`✓ Upload record created with ID: ${upload.id}`);
      return upload;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(
        `Failed to create upload record: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get upload by ID
   * @param uploadId - Upload ID
   * @returns Upload record or null if not found
   */
  async getUploadById(uploadId: number): Promise<Upload | null> {
    const query = `
      SELECT id, filename, original_filename, s3_key, file_size, mime_type, status, user_id, created_at, updated_at
      FROM uploads
      WHERE id = $1
    `;

    try {
      const result = await pool.query<Upload>(query, [uploadId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(
        `Failed to fetch upload: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get all uploads with pagination
   * @param limit - Max number of results
   * @param offset - Offset for pagination
   * @returns Array of upload records
   */
  async getAllUploads(limit: number = 100, offset: number = 0): Promise<Upload[]> {
    const query = `
      SELECT id, filename, original_filename, s3_key, file_size, mime_type, status, user_id, created_at, updated_at
      FROM uploads
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await pool.query<Upload>(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(
        `Failed to fetch uploads: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Update upload status
   * @param uploadId - Upload ID
   * @param status - New status
   * @returns Updated upload record
   */
  async updateUploadStatus(
    uploadId: number,
    status: UploadStatus
  ): Promise<Pick<Upload, 'id' | 'status' | 'updated_at'>> {
    const query = `
      UPDATE uploads
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, status, updated_at
    `;

    try {
      const result = await pool.query<Pick<Upload, 'id' | 'status' | 'updated_at'>>(query, [
        status,
        uploadId
      ]);
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(
        `Failed to update upload status: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Process file upload (upload to S3 and save metadata)
   * @param file - Multer file object
   * @param userId - User ID (optional)
   * @returns Created upload record
   */
  async processFileUpload(file: Express.Multer.File, userId?: number | null): Promise<Upload> {
    // 1. Upload to S3
    const { s3Key } = await s3Service.uploadFile(file.buffer, file.originalname, file.mimetype);

    // 2. Sanitize filename
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');

    // 3. Create database record
    const uploadRecord = await this.createUpload({
      filename: sanitizedFilename,
      originalFilename: file.originalname,
      s3Key,
      fileSize: file.size,
      mimeType: file.mimetype,
      userId
    });

    return uploadRecord;
  }
}

export default new UploadService();
