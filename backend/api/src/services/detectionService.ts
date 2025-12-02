import pool from '../config/database.js';
import type { MusicDetection, CreateDetectionData } from '../types/index.js';

class DetectionService {
  /**
   * Get all detections for an upload
   */
  async getDetectionsByUploadId(uploadId: number): Promise<MusicDetection[]> {
    const query = `
      SELECT 
        md.id, md.job_id, md.upload_id, md.recognized, md.confidence,
        md.title, md.artist, md.album, md.fonte, md.score,
        md.timestamp_start, md.timestamp_end, md.policy, md.gmusic_id,
        md.validated, md.validated_at, md.created_at
      FROM music_detections md
      INNER JOIN jobs j ON md.job_id = j.id
      WHERE j.upload_id = $1
      ORDER BY md.created_at DESC
    `;

    try {
      const result = await pool.query<MusicDetection>(query, [uploadId]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch detections: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all detections for a job
   */
  async getDetectionsByJobId(jobId: string): Promise<MusicDetection[]> {
    const query = `
      SELECT 
        id, job_id, upload_id, recognized, confidence,
        title, artist, album, fonte, score,
        timestamp_start, timestamp_end, policy, gmusic_id,
        validated, validated_at, created_at
      FROM music_detections
      WHERE job_id = $1
      ORDER BY created_at DESC
    `;

    try {
      const result = await pool.query<MusicDetection>(query, [jobId]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch detections: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detection by ID
   */
  async getDetectionById(detectionId: number): Promise<MusicDetection | null> {
    const query = `
      SELECT 
        id, job_id, upload_id, recognized, confidence,
        title, artist, album, fonte, score,
        timestamp_start, timestamp_end, policy, gmusic_id,
        validated, validated_at, created_at
      FROM music_detections
      WHERE id = $1
    `;

    try {
      const result = await pool.query<MusicDetection>(query, [detectionId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch detection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all detections pending validation
   */
  async getPendingValidations(limit: number = 100, offset: number = 0): Promise<MusicDetection[]> {
    const query = `
      SELECT 
        id, job_id, upload_id, recognized, confidence,
        title, artist, album, fonte, score,
        timestamp_start, timestamp_end, policy, gmusic_id,
        validated, validated_at, created_at
      FROM music_detections
      WHERE validated IS NULL AND recognized = true
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await pool.query<MusicDetection>(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch pending validations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate a detection (confirm or reject)
   */
  async validateDetection(detectionId: number, validated: boolean): Promise<MusicDetection | null> {
    const query = `
      UPDATE music_detections
      SET validated = $1, validated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING 
        id, job_id, upload_id, recognized, confidence,
        title, artist, album, fonte, score,
        timestamp_start, timestamp_end, policy, gmusic_id,
        validated, validated_at, created_at
    `;

    try {
      const result = await pool.query<MusicDetection>(query, [validated, detectionId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to validate detection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Batch validate detections
   */
  async batchValidate(detectionIds: number[], validated: boolean): Promise<number> {
    const query = `
      UPDATE music_detections
      SET validated = $1, validated_at = CURRENT_TIMESTAMP
      WHERE id = ANY($2)
    `;

    try {
      const result = await pool.query(query, [validated, detectionIds]);
      return result.rowCount || 0;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to batch validate: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get detection statistics for an upload
   */
  async getDetectionStats(uploadId: number): Promise<{ total: number; livre: number; restrita: number; unknown: number }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE policy = 'livre') as livre,
        COUNT(*) FILTER (WHERE policy = 'restrita') as restrita,
        COUNT(*) FILTER (WHERE policy = 'unknown' OR policy IS NULL) as unknown
      FROM music_detections md
      INNER JOIN jobs j ON md.job_id = j.id
      WHERE j.upload_id = $1 AND md.recognized = true
    `;

    try {
      const result = await pool.query(query, [uploadId]);
      const row = result.rows[0];
      return {
        total: parseInt(row.total) || 0,
        livre: parseInt(row.livre) || 0,
        restrita: parseInt(row.restrita) || 0,
        unknown: parseInt(row.unknown) || 0
      };
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to get stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new detection (used by worker or for manual entry)
   */
  async createDetection(data: CreateDetectionData): Promise<MusicDetection> {
    const query = `
      INSERT INTO music_detections 
        (job_id, upload_id, recognized, confidence, title, artist, album, fonte, score, 
         timestamp_start, timestamp_end, policy, gmusic_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING 
        id, job_id, upload_id, recognized, confidence,
        title, artist, album, fonte, score,
        timestamp_start, timestamp_end, policy, gmusic_id,
        validated, validated_at, created_at
    `;

    const values = [
      data.job_id,
      data.upload_id || null,
      data.recognized,
      data.confidence || null,
      data.title || null,
      data.artist || null,
      data.album || null,
      data.fonte || null,
      data.score || 0,
      data.timestamp_start || null,
      data.timestamp_end || null,
      data.policy || 'unknown',
      data.gmusic_id || null
    ];

    try {
      const result = await pool.query<MusicDetection>(query, values);
      return result.rows[0];
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to create detection: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new DetectionService();
