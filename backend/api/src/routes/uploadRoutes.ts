import { Router } from 'express';
import uploadController from '../controllers/uploadController.js';
import upload from '../config/multer.js';

const router = Router();

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload de arquivo de mídia
 *     description: |
 *       Faz upload de um arquivo de áudio ou vídeo para processamento.
 *       O arquivo é enviado para o S3 e um job de processamento é criado automaticamente.
 *       
 *       **Formatos suportados:** MP3, WAV, MP4, MOV, AVI
 *       
 *       **Tamanho máximo:** 100MB
 *     tags: [Uploads]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo de áudio ou vídeo para análise
 *     responses:
 *       201:
 *         description: Upload realizado com sucesso
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
 *                   example: Upload realizado com sucesso
 *                 upload:
 *                   $ref: '#/components/schemas/Upload'
 *                 job:
 *                   $ref: '#/components/schemas/Job'
 *             example:
 *               success: true
 *               message: Upload realizado com sucesso
 *               upload:
 *                 id: 1
 *                 filename: "1701234567890-reportagem.mp4"
 *                 original_filename: "reportagem.mp4"
 *                 file_size: 15728640
 *                 mime_type: "video/mp4"
 *                 status: "processing"
 *               job:
 *                 id: "550e8400-e29b-41d4-a716-446655440000"
 *                 upload_id: 1
 *                 status: "pending"
 *       400:
 *         description: Nenhum arquivo enviado ou formato inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Nenhum arquivo enviado"
 *       500:
 *         description: Erro interno no servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', upload.single('file'), (req, res, next) => {
  uploadController.uploadFile(req, res, next);
});

/**
 * @swagger
 * /upload/{id}:
 *   get:
 *     summary: Obter detalhes de um upload
 *     description: Retorna informações detalhadas de um upload específico pelo ID
 *     tags: [Uploads]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do upload
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalhes do upload
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 upload:
 *                   $ref: '#/components/schemas/Upload'
 *       404:
 *         description: Upload não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               success: false
 *               error: "Upload não encontrado"
 */
router.get('/:id', (req, res, next) => {
  uploadController.getUpload(req, res, next);
});

/**
 * @swagger
 * /uploads:
 *   get:
 *     summary: Listar todos os uploads
 *     description: Retorna uma lista paginada de todos os uploads realizados
 *     tags: [Uploads]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Número máximo de resultados por página
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Número de resultados a pular (para paginação)
 *     responses:
 *       200:
 *         description: Lista de uploads
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 uploads:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Upload'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     limit:
 *                       type: integer
 *                       example: 20
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     total:
 *                       type: integer
 *                       example: 45
 */
router.get('/', (req, res, next) => {
  uploadController.listUploads(req, res, next);
});

export default router;
