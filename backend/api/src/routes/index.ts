import { Router, type Request, type Response } from 'express';
import uploadRoutes from './uploadRoutes.js';
import detectionRoutes from './detectionRoutes.js';
import detectionController from '../controllers/detectionController.js';
import jobController from '../controllers/jobController.js';

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificar saúde da API
 *     description: Retorna o status de funcionamento da API, incluindo uptime e timestamp
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: API funcionando corretamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 service:
 *                   type: string
 *                   example: GloboBeat API
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                   description: Tempo de atividade em segundos
 *                   example: 3600.5
 */
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    service: 'GloboBeat API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

/**
 * @swagger
 * /uploads/{uploadId}/detections:
 *   get:
 *     summary: Listar detecções de um upload
 *     description: Retorna todas as trilhas sonoras identificadas em um upload específico, junto com estatísticas
 *     tags: [Detections]
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do upload
 *         example: 1
 *     responses:
 *       200:
 *         description: Lista de detecções encontradas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 detections:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Detection'
 *                 stats:
 *                   $ref: '#/components/schemas/DetectionStats'
 *       404:
 *         description: Upload não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/uploads/:uploadId/detections', (req, res, next) => {
  detectionController.getDetectionsByUpload(req, res, next);
});

/**
 * Upload routes
 */
router.use('/upload', uploadRoutes);
router.use('/uploads', uploadRoutes);

/**
 * Detection routes
 */
router.use('/detections', detectionRoutes);

/**
 * @swagger
 * /jobs/{id}:
 *   get:
 *     summary: Consultar status de um job
 *     description: Retorna o status atual de um job de processamento e a quantidade de detecções encontradas
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: UUID do job
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *     responses:
 *       200:
 *         description: Status do job
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 detectionsCount:
 *                   type: integer
 *                   description: Número de trilhas identificadas
 *                   example: 3
 *       404:
 *         description: Job não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/jobs/:id', (req, res, next) => {
  jobController.getJobStatus(req, res, next);
});

/**
 * @swagger
 * /uploads/{uploadId}/job:
 *   get:
 *     summary: Consultar job de um upload
 *     description: Retorna o job associado a um upload específico
 *     tags: [Jobs]
 *     parameters:
 *       - in: path
 *         name: uploadId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do upload
 *         example: 1
 *     responses:
 *       200:
 *         description: Job encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *                 detectionsCount:
 *                   type: integer
 *                   example: 3
 *       404:
 *         description: Job não encontrado para este upload
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/uploads/:uploadId/job', (req, res, next) => {
  jobController.getJobByUpload(req, res, next);
});

export default router;
