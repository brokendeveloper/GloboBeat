import amqp, { Channel, Connection } from 'amqplib';

class QueueService {
  private connection: Connection | null = null;
  private channel: Channel | null = null;
  private readonly queueName = 'preprocessing';

  /**
   * Connect to RabbitMQ
   */
  async connect(): Promise<void> {
    try {
      const host = process.env.RABBITMQ_HOST || 'localhost';
      const user = process.env.RABBITMQ_USER || 'guest';
      const pass = process.env.RABBITMQ_PASS || 'guest';
      
      const url = `amqp://${user}:${pass}@${host}`;
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();
      
      // Ensure queue exists
      await this.channel.assertQueue(this.queueName, { durable: true });
      
      console.log('✓ Connected to RabbitMQ');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      // Don't throw - allow API to work without queue in dev mode
    }
  }

  /**
   * Publish a job to the preprocessing queue
   */
  async publishJob(jobId: string, fileKey: string): Promise<boolean> {
    if (!this.channel) {
      console.warn('RabbitMQ not connected, job not queued');
      return false;
    }

    try {
      const message = JSON.stringify({
        job_id: jobId,
        file_key: fileKey
      });

      this.channel.sendToQueue(
        this.queueName,
        Buffer.from(message),
        { persistent: true }
      );

      console.log(`✓ Job ${jobId} published to queue`);
      return true;
    } catch (error) {
      console.error('Failed to publish job:', error);
      return false;
    }
  }

  /**
   * Close connection
   */
  async close(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
      }
      if (this.connection) {
        await this.connection.close();
      }
      console.log('RabbitMQ connection closed');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

export default new QueueService();
