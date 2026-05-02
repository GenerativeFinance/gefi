import { Queue, Worker, QueueScheduler, Job } from "bullmq";
import IORedis from "ioredis";
import reportStore from "../models/reportStore";
import { processReportJob } from "./reportGenerator";

const redisUrl = process.env.REDIS_URL || "redis://127.0.0.1:6379";
const connection = new IORedis(redisUrl, {
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: null,
});

const queueName = "reports";
const queue = new Queue(queueName, { connection });
const scheduler = new QueueScheduler(queueName, { connection });

// Worker consumes jobs and runs processReportJob
const worker = new Worker(
  queueName,
  async (job: Job) => {
    const payload = job.data;
    const reportId = payload.reportId;
    try {
      await reportStore.updateReport(reportId, { 
        status: "processing", 
        progress: 5, 
        updatedAt: new Date().toISOString() 
      });

      // Process the job (renders PDF, uploads to S3 or writes local file)
      const result = await processReportJob({
        reportId: payload.reportId,
        templateId: payload.templateId,
        data: payload.data,
        options: payload.options,
      }, (progress) => {
        // Optional progress callback
        reportStore.updateReport(reportId, { 
          progress, 
          updatedAt: new Date().toISOString() 
        }).catch(() => {});
      });

      if (result.success) {
        await reportStore.updateReport(reportId, {
          status: "completed",
          progress: 100,
          s3Key: result.s3Key || null,
          signedUrl: result.signedUrl || null,
          pdfPath: result.pdfPath || null,
          updatedAt: new Date().toISOString()
        });
      } else {
        await reportStore.updateReport(reportId, {
          status: "failed",
          error: result.error || "Unknown error",
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.error("Worker job error:", err);
      await reportStore.updateReport(reportId, {
        status: "failed",
        error: String(err),
        updatedAt: new Date().toISOString()
      });
      throw err;
    }
  },
  { connection, concurrency: 2 }
);

// Helper to enqueue jobs
async function enqueueReport(payload: any) {
  await queue.add("generate", payload, { 
    attempts: 3, 
    backoff: { type: "exponential", delay: 5000 } 
  });
}

// Initialize Redis connection check
connection.on('connect', () => {
  console.log('📊 Redis connected for report queue');
});

connection.on('error', (err) => {
  console.warn('⚠️ Redis connection error:', err.message);
});

export default { enqueueReport, queue, worker, scheduler };
export { connection };