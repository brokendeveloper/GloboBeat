import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GloboBeat API',
      version: '1.0.0',
      description: `
## Sistema de Identificação Automática de Trilhas Sonoras

API REST para o sistema GloboBeat, que permite:
- Upload de arquivos de áudio/vídeo
- Identificação automática de trilhas sonoras usando ACRCloud, AcoustID e Audfprint
- Validação manual de detecções
- Gerenciamento de jobs de processamento

### Fluxo Principal
1. **Upload**: Envie um arquivo de mídia via \`POST /api/upload\`
2. **Processamento**: O sistema processa o arquivo em background (RabbitMQ + Worker)
3. **Consulta**: Verifique o status via \`GET /api/jobs/:id\` ou \`GET /api/uploads/:uploadId/job\`
4. **Resultados**: Obtenha as trilhas identificadas via \`GET /api/uploads/:uploadId/detections\`
5. **Validação**: Valide as detecções via \`PATCH /api/detections/:id/validate\`

### Tecnologias
- **Backend**: Node.js, Express, TypeScript
- **Banco de Dados**: PostgreSQL 16
- **Storage**: AWS S3
- **Fila**: RabbitMQ
- **Worker**: Python (ACRCloud, AcoustID, Audfprint)
      `,
      contact: {
        name: 'Equipe GloboBeat',
        email: 'suporte@globobeat.com'
      },
      license: {
        name: 'Proprietary',
        url: 'https://globobeat.com/license'
      }
    },
    servers: [
      {
        url: 'http://localhost:3002/api',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'http://localhost:3000/api',
        description: 'Servidor Docker'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Verificação de saúde da API'
      },
      {
        name: 'Uploads',
        description: 'Gerenciamento de uploads de arquivos de mídia'
      },
      {
        name: 'Detections',
        description: 'Gerenciamento de trilhas sonoras detectadas'
      },
      {
        name: 'Jobs',
        description: 'Acompanhamento de jobs de processamento'
      }
    ],
    components: {
      schemas: {
        Upload: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do upload',
              example: 1
            },
            filename: {
              type: 'string',
              description: 'Nome do arquivo no S3',
              example: '1701234567890-reportagem.mp4'
            },
            original_filename: {
              type: 'string',
              description: 'Nome original do arquivo',
              example: 'reportagem.mp4'
            },
            s3_key: {
              type: 'string',
              description: 'Chave do arquivo no S3',
              example: 'uploads/1701234567890-reportagem.mp4'
            },
            file_size: {
              type: 'integer',
              description: 'Tamanho do arquivo em bytes',
              example: 15728640
            },
            mime_type: {
              type: 'string',
              description: 'Tipo MIME do arquivo',
              example: 'video/mp4'
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'error'],
              description: 'Status do processamento',
              example: 'completed'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data da última atualização'
            }
          }
        },
        Job: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'UUID do job',
              example: '550e8400-e29b-41d4-a716-446655440000'
            },
            upload_id: {
              type: 'integer',
              description: 'ID do upload associado',
              example: 1
            },
            status: {
              type: 'string',
              enum: ['pending', 'processing', 'completed', 'failed'],
              description: 'Status do job',
              example: 'completed'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            },
            updated_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Detection: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da detecção',
              example: 45
            },
            job_id: {
              type: 'string',
              format: 'uuid',
              description: 'UUID do job que gerou esta detecção'
            },
            upload_id: {
              type: 'integer',
              description: 'ID do upload associado',
              example: 1
            },
            recognized: {
              type: 'boolean',
              description: 'Se a trilha foi reconhecida',
              example: true
            },
            confidence: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Nível de confiança da detecção',
              example: 'high'
            },
            title: {
              type: 'string',
              nullable: true,
              description: 'Título da música',
              example: 'Billie Jean'
            },
            artist: {
              type: 'string',
              nullable: true,
              description: 'Artista/Intérprete',
              example: 'Michael Jackson'
            },
            album: {
              type: 'string',
              nullable: true,
              description: 'Álbum',
              example: 'Thriller'
            },
            fonte: {
              type: 'string',
              nullable: true,
              description: 'Fonte da identificação',
              enum: ['ACRCloud', 'AcoustID', 'Audfprint'],
              example: 'ACRCloud'
            },
            score: {
              type: 'integer',
              description: 'Score de confiança (0-100)',
              example: 95
            },
            timestamp_start: {
              type: 'string',
              nullable: true,
              description: 'Início do trecho no arquivo',
              example: '00:00:15'
            },
            timestamp_end: {
              type: 'string',
              nullable: true,
              description: 'Fim do trecho no arquivo',
              example: '00:03:45'
            },
            policy: {
              type: 'string',
              nullable: true,
              enum: ['livre', 'restrita', 'unknown'],
              description: 'Política de uso da trilha',
              example: 'restrita'
            },
            gmusic_id: {
              type: 'string',
              nullable: true,
              description: 'ID no catálogo Globo Music',
              example: 'MJ001-T05'
            },
            validated: {
              type: 'boolean',
              nullable: true,
              description: 'Status de validação (null = pendente)',
              example: null
            },
            validated_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Data da validação'
            },
            created_at: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        DetectionStats: {
          type: 'object',
          properties: {
            total: {
              type: 'integer',
              description: 'Total de detecções',
              example: 5
            },
            livre: {
              type: 'integer',
              description: 'Detecções com política livre',
              example: 2
            },
            restrita: {
              type: 'integer',
              description: 'Detecções com política restrita',
              example: 2
            },
            unknown: {
              type: 'integer',
              description: 'Detecções com política desconhecida',
              example: 1
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              example: 'Recurso não encontrado'
            }
          }
        }
      }
    }
  },
  apis: [
    './src/routes/*.ts',
    './src/routes/*.js',
    './dist/routes/*.js'
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export function setupSwagger(app: Application): void {
  // Swagger UI
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #3B82F6 }
    `,
    customSiteTitle: 'GloboBeat API - Documentação',
    customfavIcon: '/favicon.ico'
  }));

  // JSON spec endpoint
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log('📚 Swagger docs available at /api/docs');
}

export default swaggerSpec;
