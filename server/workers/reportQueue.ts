import { Queue, Worker, Job } from 'bullmq';
import { processReportJob, type ReportJobPayload } from './reportGenerator.js';
import { updateReport } from '../models/reportStore.js';

// Redis configuration from environment
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const QUEUE_NAME = 'report-generation';

// Parse Redis URL for connection options
const redisConnection = REDIS_URL.startsWith('redis://') 
  ? { url: REDIS_URL }
  : { host: 'localhost', port: 6379 };

// Create the queue
export const reportQueue = new Queue(QUEUE_NAME, {
  connection: redisConnection,
  defaultJobOptions: {
    removeOnComplete: 50, // Keep last 50 completed jobs
    removeOnFail: 100,    // Keep last 100 failed jobs
    attempts: 3,          // Retry up to 3 times
    backoff: {
      type: 'exponential',
      delay: 5000,        // Start with 5 second delay
    },
  },
});

/**
 * Enqueue a report generation job
 */
export async function enqueueReport(payload: ReportJobPayload): Promise<Job> {
  console.log(`Enqueueing report generation job for ${payload.reportId}`);
  
  const job = await reportQueue.add('generate-report', payload, {
    jobId: payload.reportId, // Use reportId as job ID for easier tracking
    delay: 0, // Process immediately
  });

  return job;
}

/**
 * Get job status by report ID
 */
export async function getJobStatus(reportId: string): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress?: number;
  error?: string;
}> {
  try {
    const job = await reportQueue.getJob(reportId);
    
    if (!job) {
      return { status: 'failed', error: 'Job not found' };
    }

    const state = await job.getState();
    const progress = job.progress;

    switch (state) {
      case 'waiting':
      case 'delayed':
        return { status: 'pending' };
      case 'active':
        return { status: 'processing', progress: typeof progress === 'number' ? progress : 0 };
      case 'completed':
        return { status: 'completed', progress: 100 };
      case 'failed':
        return { 
          status: 'failed', 
          error: job.failedReason || 'Unknown error' 
        };
      default:
        return { status: 'pending' };
    }
  } catch (error) {
    console.error('Failed to get job status:', error);
    return { status: 'failed', error: 'Failed to check job status' };
  }
}

/**
 * Create and start the worker
 */
export function createReportWorker(): Worker {
  console.log('Creating report generation worker...');
  
  const worker = new Worker(
    QUEUE_NAME,
    async (job: Job<ReportJobPayload>) => {
      console.log(`Processing report job ${job.id} (${job.data.reportId})`);
      
      try {
        // Update report status to processing
        await updateReport(job.data.reportId, {
          status: 'processing',
          progress: 0,
        });

        // Update progress periodically
        job.updateProgress(10);

        // Process the actual report
        const result = await processReportJob(job.data);
        
        if (result.success) {
          // Update report status to completed
          await updateReport(job.data.reportId, {
            status: 'completed',
            progress: 100,
            s3Key: result.s3Key,
            signedUrl: result.signedUrl,
            pdfPath: result.pdfPath,
            completedAt: new Date().toISOString(),
          });

          job.updateProgress(100);
          console.log(`Report job ${job.id} completed successfully`);
          return result;
        } else {
          // Update report status to failed
          await updateReport(job.data.reportId, {
            status: 'failed',
            error: result.error,
          });

          throw new Error(result.error || 'Report generation failed');
        }
      } catch (error) {
        console.error(`Report job ${job.id} failed:`, error);
        
        // Update report status to failed
        await updateReport(job.data.reportId, {
          status: 'failed',
          error: error instanceof Error ? error.message : String(error),
        });

        throw error;
      }
    },
    {
      connection: redisConnection,
      concurrency: 2, // Process up to 2 reports concurrently
    }
  );

  // Worker event listeners
  worker.on('completed', (job) => {
    console.log(`Report job ${job.id} completed`);
  });

  worker.on('failed', (job, err) => {
    console.error(`Report job ${job?.id} failed:`, err);
  });

  worker.on('error', (error) => {
    console.error('Worker error:', error);
  });

  return worker;
}

/**
 * Close queue and worker connections
 */
export async function closeConnections(): Promise<void> {
  await reportQueue.close();
}

// Initialize worker if this file is run directly or if NODE_ENV indicates worker mode
if (process.env.NODE_ENV === 'worker' || process.argv.includes('--worker')) {
  console.log('Starting report generation worker...');
  createReportWorker();
  
  // Graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('Shutting down worker...');
    await closeConnections();
    process.exit(0);
  });
}