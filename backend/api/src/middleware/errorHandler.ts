import type { Request, Response, NextFunction } from 'express';
import type { MulterError } from 'multer';

interface CustomError extends Error {
  status?: number;
  code?: string;
}

/**
 * Global error handling middleware
 */
export const errorHandler = (
  err: CustomError | MulterError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Multer file size error
  if ('code' in err && err.code === 'LIMIT_FILE_SIZE') {
    res.status(413).json({
      success: false,
      error: 'File too large',
      message: 'File size exceeds the 100MB limit'
    });
    return;
  }

  // Multer file type error
  if (err.message && err.message.includes('Invalid file type')) {
    res.status(400).json({
      success: false,
      error: 'Invalid file type',
      message: err.message
    });
    return;
  }

  // Database errors
  if ('code' in err && err.code && typeof err.code === 'string' && err.code.startsWith('23')) {
    // PostgreSQL constraint violations
    res.status(409).json({
      success: false,
      error: 'Database constraint violation',
      message: 'The operation violates a database constraint'
    });
    return;
  }

  // AWS S3 errors
  if (err.name === 'NoSuchBucket' || err.name === 'AccessDenied') {
    res.status(500).json({
      success: false,
      error: 'Storage service error',
      message: 'Failed to access storage service'
    });
    return;
  }

  // Default error
  const customErr = err as CustomError;
  res.status(customErr.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.path}`
  });
};
