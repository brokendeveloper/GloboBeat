import { S3Client } from '@aws-sdk/client-s3';

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || ''
  }
});

export interface S3Config {
  bucketName: string;
  region: string;
}

export const S3_CONFIG: S3Config = {
  bucketName: process.env.S3_BUCKET_NAME || '',
  region: process.env.AWS_REGION || 'us-east-1'
};

export default s3Client;
