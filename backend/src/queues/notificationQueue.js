import { Queue } from 'bullmq';

const initRedisConnection = () => {
  return {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: process.env.REDIS_PORT || 6379,
    password: process.env.REDIS_PASSWORD || undefined,
  };
};

export const notificationQueue = new Queue('notificationQueue', {
  connection: initRedisConnection(),
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000, // 2s, 4s, 8s
    },
    removeOnComplete: true, // Clean up successful jobs to save memory
    removeOnFail: false,   // Keep failed jobs for inspection
  },
});

/**
 * Utility to add an email job to the queue
 */
export const queueEmailNotification = async (jobData, delay = 0) => {
  try {
    const job = await notificationQueue.add('sendEmailJob', jobData, { delay });
    console.log(`Job added to queue: ${job.id} (Delay: ${delay}ms)`);
    return job;
  } catch (error) {
    console.error('Error adding job to notificationQueue:', error);
    throw error;
  }
};
