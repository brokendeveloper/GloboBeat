import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';
import upload from '../config/multer.js';

const router = Router();

/**
 * @route   POST /api/upload
 * @desc    Upload a file to S3
 * @access  Public (will be protected with JWT later)
 */
router.post('/', upload.single('file'), (req, res, next) => {
  uploadController.uploadFile(req, res, next);
});

/**
 * @route   GET /api/upload/:id
 * @desc    Get upload details by ID
 * @access  Public (will be protected with JWT later)
 */
router.get('/:id', (req, res, next) => {
  uploadController.getUpload(req, res, next);
});

/**
 * @route   GET /api/uploads
 * @desc    List all uploads with pagination
 * @access  Public (will be protected with JWT later)
 */
router.get('/', (req, res, next) => {
  uploadController.listUploads(req, res, next);
});

export default router;
