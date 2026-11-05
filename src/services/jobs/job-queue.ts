// =============================================================================
// RIIQX — Master Asynchronous Job Engine & Event-Driven Queue
// Reliable Long-Running Operations • Zero Fabricated Progress • Event Telemetry
// =============================================================================

import { EventEmitter } from 'node:events';
import fs from 'node:fs';
import path from 'node:path';
import { AIJobRecord, JobStatus, JobStageEvent } from '../ai/types';

class JobEventQueue extends EventEmitter {}
const jobEvents = new JobEventQueue();

export class JobQueue {
  private static jobsMap: Map<string, AIJobRecord> = new Map();
  private static storageDir = path.join(process.cwd(), 'AI Video Editor', 'metadata', 'jobs');

  static {
    // Ensure persistence directory exists
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      } else {
        // Hydrate recent jobs from disk
        const files = fs.readdirSync(this.storageDir).filter((f) => f.endsWith('.json'));
        for (const file of files.slice(-50)) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(this.storageDir, file), 'utf-8'));
            if (data.id) this.jobsMap.set(data.id, data);
          } catch {}
        }
      }
    } catch {}
  }

  /**
   * Enqueue a new long-running job
   */
  public static createJob(
    userId: string,
    jobType: AIJobRecord['jobType'],
    payload: Record<string, any>
  ): AIJobRecord {
    const id = `job_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    const now = new Date().toISOString();

    const record: AIJobRecord = {
      id,
      userId,
      jobType,
      status: 'queued',
      progressPct: 0,
      stageMessage: 'Job queued for background processing...',
      stageHistory: [
        {
          stage: 'queued',
          message: 'Job submitted and registered in queue',
          timestamp: now,
          progressPct: 0,
        },
      ],
      payload,
      createdAt: now,
      updatedAt: now,
    };

    this.jobsMap.set(id, record);
    this.persistJob(record);
    jobEvents.emit(`job:${id}`, record);
    jobEvents.emit('job:created', record);

    return record;
  }

  /**
   * Update job status and record an authentic progress stage event
   */
  public static updateStage(
    jobId: string,
    stage: string,
    message: string,
    progressPct?: number,
    metadata?: Record<string, any>
  ): AIJobRecord {
    const job = this.jobsMap.get(jobId);
    if (!job) throw new Error(`Job '${jobId}' not found in queue.`);

    const now = new Date().toISOString();
    if (job.status === 'queued') {
      job.status = 'running';
      job.startedAt = job.startedAt || now;
    }

    if (progressPct !== undefined) {
      job.progressPct = Math.min(100, Math.max(0, progressPct));
    }

    job.stageMessage = message;
    job.updatedAt = now;

    const event: JobStageEvent = {
      stage,
      message,
      timestamp: now,
      progressPct: job.progressPct,
      metadata,
    };
    job.stageHistory.push(event);

    this.persistJob(job);
    jobEvents.emit(`job:${jobId}`, job);
    jobEvents.emit(`stage:${jobId}`, event);

    return job;
  }

  /**
   * Mark job as completed with verified result payload
   */
  public static completeJob(jobId: string, result: Record<string, any>): AIJobRecord {
    const job = this.jobsMap.get(jobId);
    if (!job) throw new Error(`Job '${jobId}' not found in queue.`);

    const now = new Date().toISOString();
    job.status = 'completed';
    job.progressPct = 100;
    job.stageMessage = 'Operation completed successfully.';
    job.result = result;
    job.completedAt = now;
    job.updatedAt = now;

    job.stageHistory.push({
      stage: 'completed',
      message: 'Job completed with verified result payload.',
      timestamp: now,
      progressPct: 100,
    });

    this.persistJob(job);
    jobEvents.emit(`job:${jobId}`, job);
    jobEvents.emit('job:completed', job);

    return job;
  }

  /**
   * Mark job as failed with specific error message
   */
  public static failJob(jobId: string, errorMessage: string): AIJobRecord {
    const job = this.jobsMap.get(jobId);
    if (!job) throw new Error(`Job '${jobId}' not found in queue.`);

    const now = new Date().toISOString();
    job.status = 'failed';
    job.errorMessage = errorMessage;
    job.stageMessage = `Failed: ${errorMessage}`;
    job.completedAt = now;
    job.updatedAt = now;

    job.stageHistory.push({
      stage: 'failed',
      message: errorMessage,
      timestamp: now,
      progressPct: job.progressPct,
    });

    this.persistJob(job);
    jobEvents.emit(`job:${jobId}`, job);
    jobEvents.emit('job:failed', job);

    return job;
  }

  /**
   * Cancel an active or queued job
   */
  public static cancelJob(jobId: string, reason = 'User requested cancellation'): AIJobRecord {
    const job = this.jobsMap.get(jobId);
    if (!job) throw new Error(`Job '${jobId}' not found in queue.`);

    const now = new Date().toISOString();
    job.status = 'cancelled';
    job.stageMessage = `Cancelled: ${reason}`;
    job.completedAt = now;
    job.updatedAt = now;

    job.stageHistory.push({
      stage: 'cancelled',
      message: reason,
      timestamp: now,
      progressPct: job.progressPct,
    });

    this.persistJob(job);
    jobEvents.emit(`job:${jobId}`, job);
    jobEvents.emit('job:cancelled', job);

    return job;
  }

  /**
   * Retrieve a job by ID
   */
  public static getJob(jobId: string): AIJobRecord | null {
    return this.jobsMap.get(jobId) || null;
  }

  /**
   * List jobs for a specific user, sorted newest first
   */
  public static listJobs(userId?: string, limit = 20): AIJobRecord[] {
    const all = Array.from(this.jobsMap.values());
    const filtered = userId ? all.filter((j) => j.userId === userId) : all;
    return filtered
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  /**
   * Subscribe to real-time updates for a job
   */
  public static onJobUpdate(jobId: string, listener: (job: AIJobRecord) => void): () => void {
    const eventName = `job:${jobId}`;
    jobEvents.on(eventName, listener);
    return () => {
      jobEvents.off(eventName, listener);
    };
  }

  /**
   * Persist job to local disk storage
   */
  private static persistJob(job: AIJobRecord): void {
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      }
      const filePath = path.join(this.storageDir, `${job.id}.json`);
      fs.writeFileSync(filePath, JSON.stringify(job, null, 2), 'utf-8');
    } catch (err: any) {
      console.warn(`[JobQueue] Failed to persist job ${job.id}:`, err.message);
    }
  }
}

