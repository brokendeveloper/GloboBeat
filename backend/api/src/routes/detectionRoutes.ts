import { Router } from 'express';
import detectionController from '../controllers/detectionController.js';

const router = Router();

/**
 * @swagger
 * /detections/pending:
 *   get:
 *     summary: Listar detecções pendentes de validação
 *     description: |
 *       Retorna todas as trilhas identificadas que ainda não foram validadas.
 *       Útil para a tela de validação em lote.
 *     tags: [Detections]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número máximo de resultados
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset para paginação
 *     responses:
 *       200:
 *         description: Lista de detecções pendentes
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
 *                 count:
 *                   type: integer
 *                   description: Total de detecções pendentes
 *                   example: 12
 */
router.get('/pending', (req, res, next) => {
  detectionController.getPendingValidations(req, res, next);
});

/**
 * @swagger
 * /detections/batch-validate:
 *   post:
 *     summary: Validar múltiplas detecções em lote
 *     description: |
 *       Permite validar (confirmar ou rejeitar) várias detecções de uma vez.
 *       Ideal para processamento em massa na tela de validação.
 *     tags: [Detections]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - ids
 *               - validated
 *             properties:
 *               ids:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 description: Lista de IDs das detecções a validar
 *                 example: [1, 2, 3, 4, 5]
 *               validated:
 *                 type: boolean
 *                 description: true para confirmar, false para rejeitar
 *                 example: true
 *           example:
 *             ids: [1, 2, 3]
 *             validated: true
 *     responses:
 *       200:
 *         description: Validação em lote realizada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "3 detecções validadas com sucesso"
 *                 count:
 *                   type: integer
 *                   description: Número de detecções atualizadas
 *                   example: 3
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "IDs e status de validação são obrigatórios"
 */
router.post('/batch-validate', (req, res, next) => {
  detectionController.batchValidate(req, res, next);
});

/**
 * @swagger
 * /detections/{id}:
 *   get:
 *     summary: Obter detalhes de uma detecção
 *     description: Retorna informações completas de uma trilha sonora detectada
 *     tags: [Detections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da detecção
 *         example: 45
 *     responses:
 *       200:
 *         description: Detalhes da detecção
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 detection:
 *                   $ref: '#/components/schemas/Detection'
 *       404:
 *         description: Detecção não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Detecção não encontrada"
 */
router.get('/:id', (req, res, next) => {
  detectionController.getDetection(req, res, next);
});

/**
 * @swagger
 * /detections/{id}/validate:
 *   patch:
 *     summary: Validar uma detecção individual
 *     description: |
 *       Confirma ou rejeita uma trilha sonora detectada.
 *       - **true**: A trilha foi corretamente identificada
 *       - **false**: A identificação está incorreta
 *     tags: [Detections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da detecção
 *         example: 45
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - validated
 *             properties:
 *               validated:
 *                 type: boolean
 *                 description: Status de validação
 *                 example: true
 *           example:
 *             validated: true
 *     responses:
 *       200:
 *         description: Detecção validada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Detecção validada com sucesso"
 *                 detection:
 *                   $ref: '#/components/schemas/Detection'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Detecção não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch('/:id/validate', (req, res, next) => {
  detectionController.validateDetection(req, res, next);
});

export default router;
