import { Worker } from 'bullmq';
import { sendEmail } from '../utils/sendEmail.js';

const initRedisConnection = () => {
  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  };
};

export const startNotificationWorker = () => {
  const worker = new Worker(
    'notificationQueue',
    async (job) => {
      console.log(`Processing job ${job.id} of type ${job.name}`);

      if (job.name === 'sendEmailJob') {
        const { to, subject, templateType, data } = job.data;
        
        try {
          await sendEmail({ to, subject, templateType, data });
          console.log(`Job ${job.id} completed successfully.`);
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error.message);
          throw error; // Let BullMQ handle retries
        }
      }
    },
    {
      connection: initRedisConnection(),
      concurrency: 5, // Process 5 jobs concurrently
    }
  );

  worker.on('failed', (job, err) => {
    console.error(`Worker Event [Failed] - Job ${job.id} has failed with ${err.message}`);
  });

  worker.on('error', (err) => {
    console.error('Worker Event [Error] - BullMQ Error:', err);
  });

  console.log('Notification Worker started listening to queue.');
};
