import { Router } from 'express';
import detectionController from '../controllers/detectionController.js';

const router = Router();

/**
 * @route   GET /api/detections/pending
 * @desc    Get all detections pending validation
 * @access  Public (will be protected with JWT later)
 */
router.get('/pending', (req, res, next) => {
  detectionController.getPendingValidations(req, res, next);
});

/**
 * @route   POST /api/detections/batch-validate
 * @desc    Batch validate multiple detections
 * @access  Public (will be protected with JWT later)
 */
router.post('/batch-validate', (req, res, next) => {
  detectionController.batchValidate(req, res, next);
});

/**
 * @route   GET /api/detections/:id
 * @desc    Get detection by ID
 * @access  Public (will be protected with JWT later)
 */
router.get('/:id', (req, res, next) => {
  detectionController.getDetection(req, res, next);
});

/**
 * @route   PATCH /api/detections/:id/validate
 * @desc    Validate a detection (confirm or reject)
 * @access  Public (will be protected with JWT later)
 */
router.patch('/:id/validate', (req, res, next) => {
  detectionController.validateDetection(req, res, next);
});

export default router;
