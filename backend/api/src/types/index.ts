export interface Upload {
  id: number;
  filename: string;
  original_filename: string;
  s3_key: string;
  file_size: number;
  mime_type: string;
  status: UploadStatus;
  user_id: number | null;
  created_at: Date;
  updated_at: Date;
}

export type UploadStatus = 'uploaded' | 'processing' | 'completed' | 'failed';

export interface CreateUploadData {
  filename: string;
  originalFilename: string;
  s3Key: string;
  fileSize: number;
  mimeType: string;
  userId?: number | null;
}

export interface S3UploadResult {
  s3Key: string;
  bucket: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  limit?: number;
  offset?: number;
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total?: number;
}
