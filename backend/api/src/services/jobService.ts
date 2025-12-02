import pool from '../config/database.js';
import crypto from 'crypto';
import type { Job, JobStatus } from '../types/index.js';

class JobService {
  /**
   * Generate a unique job ID
   */
  private generateJobId(): string {
    return crypto.randomUUID();
  }

  /**
   * Create a new job for processing
   */
  async createJob(uploadId: number): Promise<Job> {
    const jobId = this.generateJobId();
    
    const query = `
      INSERT INTO jobs (id, upload_id, status)
      VALUES ($1, $2, 'pending')
      RETURNING id, upload_id, status, created_at, updated_at
    `;

    try {
      const result = await pool.query<Job>(query, [jobId, uploadId]);
      console.log(`✓ Job created with ID: ${jobId}`);
      return result.rows[0];
    } catch (error) {
      console.error('Database error creating job:', error);
      throw new Error(`Failed to create job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get job by ID
   */
  async getJobById(jobId: string): Promise<Job | null> {
    const query = `
      SELECT id, upload_id, status, created_at, updated_at
      FROM jobs
      WHERE id = $1
    `;

    try {
      const result = await pool.query<Job>(query, [jobId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get job by upload ID
   */
  async getJobByUploadId(uploadId: number): Promise<Job | null> {
    const query = `
      SELECT id, upload_id, status, created_at, updated_at
      FROM jobs
      WHERE upload_id = $1
      ORDER BY created_at DESC
      LIMIT 1
    `;

    try {
      const result = await pool.query<Job>(query, [uploadId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update job status
   */
  async updateJobStatus(jobId: string, status: JobStatus): Promise<Job | null> {
    const query = `
      UPDATE jobs
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING id, upload_id, status, created_at, updated_at
    `;

    try {
      const result = await pool.query<Job>(query, [status, jobId]);
      return result.rows[0] || null;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to update job: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get all jobs with pagination
   */
  async getAllJobs(limit: number = 100, offset: number = 0): Promise<Job[]> {
    const query = `
      SELECT id, upload_id, status, created_at, updated_at
      FROM jobs
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    try {
      const result = await pool.query<Job>(query, [limit, offset]);
      return result.rows;
    } catch (error) {
      console.error('Database error:', error);
      throw new Error(`Failed to fetch jobs: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export default new JobService();
