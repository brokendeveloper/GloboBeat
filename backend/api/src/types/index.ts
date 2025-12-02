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

// Job types
export interface Job {
  id: string;
  upload_id: number | null;
  status: JobStatus;
  created_at: Date;
  updated_at: Date;
}

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

// Music detection types
export interface MusicDetection {
  id: number;
  job_id: string;
  upload_id: number | null;
  recognized: boolean;
  confidence: string | null;
  title: string | null;
  artist: string | null;
  album: string | null;
  fonte: string | null;
  score: number;
  timestamp_start: string | null;
  timestamp_end: string | null;
  policy: MusicPolicy;
  gmusic_id: string | null;
  validated: boolean | null;
  validated_at: Date | null;
  created_at: Date;
}

export type MusicPolicy = 'livre' | 'restrita' | 'unknown';

export interface CreateDetectionData {
  job_id: string;
  upload_id?: number | null;
  recognized: boolean;
  confidence?: string;
  title?: string;
  artist?: string;
  album?: string;
  fonte?: string;
  score?: number;
  timestamp_start?: string;
  timestamp_end?: string;
  policy?: MusicPolicy;
  gmusic_id?: string;
}

export interface ValidateDetectionData {
  validated: boolean;
}

export interface PaginationMeta {
  limit: number;
  offset: number;
  total?: number;
}
