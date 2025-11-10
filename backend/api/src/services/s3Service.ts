import { PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import s3Client, { S3_CONFIG } from '../config/s3.js';
import type { S3UploadResult } from '../types/index.js';

class S3Service {
  /**
   * Upload file to S3
   * @param fileBuffer - File buffer
   * @param originalFilename - Original filename
   * @param mimeType - MIME type
   * @returns S3 upload result with key and bucket
   */
  async uploadFile(
    fileBuffer: Buffer,
    originalFilename: string,
    mimeType: string
  ): Promise<S3UploadResult> {
    const fileId = uuidv4();
    const timestamp = Date.now();
    const sanitizedFilename = originalFilename.replace(/[^a-zA-Z0-9._-]/g, '_');
    const s3Key = `uploads/${fileId}-${timestamp}-${sanitizedFilename}`;

    const uploadParams = {
      Bucket: S3_CONFIG.bucketName,
      Key: s3Key,
      Body: fileBuffer,
      ContentType: mimeType,
      Metadata: {
        originalFilename: originalFilename,
        uploadId: fileId,
        uploadedAt: new Date().toISOString()
      }
    };

    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      console.log(`✓ File uploaded to S3: ${s3Key}`);

      return {
        s3Key,
        bucket: S3_CONFIG.bucketName
      };
    } catch (error) {
      console.error('S3 upload error:', error);
      throw new Error(
        `Failed to upload file to S3: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get file from S3
   * @param s3Key - S3 object key
   * @returns File buffer
   */
  async getFile(s3Key: string): Promise<Buffer> {
    const params = {
      Bucket: S3_CONFIG.bucketName,
      Key: s3Key
    };

    try {
      const response = await s3Client.send(new GetObjectCommand(params));
      const chunks: Uint8Array[] = [];

      if (response.Body instanceof Readable) {
        for await (const chunk of response.Body) {
          chunks.push(chunk);
        }
      }

      return Buffer.concat(chunks);
    } catch (error) {
      console.error('S3 download error:', error);
      throw new Error(
        `Failed to download file from S3: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Generate S3 URL (not signed, for display purposes)
   * @param s3Key - S3 object key
   * @returns S3 object URL
   */
  getFileUrl(s3Key: string): string {
    return `https://${S3_CONFIG.bucketName}.s3.${S3_CONFIG.region}.amazonaws.com/${s3Key}`;
  }
}

export default new S3Service();
