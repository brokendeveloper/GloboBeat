/**
 * GloboBeat API Client
 * Handles all communication with the backend API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

// Types
export interface Upload {
  id: number;
  filename: string;
  original_filename: string;
  s3_key: string;
  file_size: number;
  mime_type: string;
  status: 'uploaded' | 'processing' | 'completed' | 'failed';
  user_id: number | null;
  created_at: string;
  updated_at: string;
}

export interface Job {
  id: string;
  upload_id: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

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
  policy: 'livre' | 'restrita' | 'unknown';
  gmusic_id: string | null;
  validated: boolean | null;
  validated_at: string | null;
  created_at: string;
}

export interface DetectionStats {
  total: number;
  livre: number;
  restrita: number;
  unknown: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface UploadResponse {
  success: boolean;
  message: string;
  upload: {
    id: number;
    filename: string;
    s3Key: string;
    size: number;
    status: string;
    uploadedAt: string;
  };
  job: { id: string; status: string } | null;
}

// API Functions

/**
 * Upload a file to the backend
 */
export async function uploadFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<UploadResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100);
        onProgress(percent);
      }
    });

    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = JSON.parse(xhr.responseText);
          resolve(response);
        } catch {
          reject(new Error('Invalid response from server'));
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText);
          reject(new Error(error.error || 'Upload failed'));
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      }
    });

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    xhr.open('POST', `${API_BASE_URL}/upload`);
    xhr.send(formData);
  });
}

/**
 * Get an upload by ID
 */
export async function getUpload(id: number): Promise<Upload> {
  const response = await fetch(`${API_BASE_URL}/upload/${id}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch upload');
  }
  
  return data.upload;
}

/**
 * Get all uploads
 */
export async function getUploads(limit = 100, offset = 0): Promise<Upload[]> {
  const response = await fetch(`${API_BASE_URL}/uploads?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch uploads');
  }
  
  return data.uploads;
}

/**
 * Get detections for an upload
 */
export async function getDetectionsByUpload(uploadId: number): Promise<{
  detections: MusicDetection[];
  stats: DetectionStats;
}> {
  const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/detections`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch detections');
  }
  
  return {
    detections: data.detections,
    stats: data.stats
  };
}

/**
 * Get all detections pending validation
 */
export async function getPendingValidations(limit = 100, offset = 0): Promise<MusicDetection[]> {
  const response = await fetch(`${API_BASE_URL}/detections/pending?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch pending validations');
  }
  
  return data.detections;
}

/**
 * Validate a single detection
 */
export async function validateDetection(id: number, validated: boolean): Promise<MusicDetection> {
  const response = await fetch(`${API_BASE_URL}/detections/${id}/validate`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ validated })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to validate detection');
  }
  
  return data.detection;
}

/**
 * Batch validate multiple detections
 */
export async function batchValidate(ids: number[], validated: boolean): Promise<number> {
  const response = await fetch(`${API_BASE_URL}/detections/batch-validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ids, validated })
  });
  
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to batch validate');
  }
  
  return data.count;
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ success: boolean; uptime: number }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  const data = await response.json();
  return data;
}

// Job types and functions

export interface JobStatus {
  id: string;
  upload_id: number | null;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
}

export interface JobStatusResponse {
  success: boolean;
  job: JobStatus;
  detectionsCount: number;
}

/**
 * Get job status by job ID
 */
export async function getJobStatus(jobId: string): Promise<JobStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch job status');
  }
  
  return data;
}

/**
 * Get job status by upload ID
 */
export async function getJobByUpload(uploadId: number): Promise<JobStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/uploads/${uploadId}/job`);
  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to fetch job status');
  }
  
  return data;
}

/**
 * Poll for job completion
 */
export async function waitForJobCompletion(
  jobId: string, 
  onStatusChange?: (status: JobStatus) => void,
  maxAttempts = 60,
  intervalMs = 2000
): Promise<JobStatusResponse> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await getJobStatus(jobId);
    
    if (onStatusChange) {
      onStatusChange(result.job);
    }
    
    if (result.job.status === 'completed' || result.job.status === 'failed') {
      return result;
    }
    
    await new Promise(resolve => setTimeout(resolve, intervalMs));
  }
  
  throw new Error('Job timed out');
}
