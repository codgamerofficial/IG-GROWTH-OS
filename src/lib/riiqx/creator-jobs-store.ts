// =============================================================================
// RIIQX Creator Studio 2.0 — Durable Generation Job Store
// Server-Side Persistence • Web & Mobile Synchronized • Zero Session Loss
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { getSafeTempFilePath } from './temp-storage';

export type JobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'cancelled';

export interface CreatorGenerationJob {
  jobId: string;
  userId?: string;
  projectId: string;
  type:
    | 'text_to_video'
    | 'image_to_video'
    | 'text_to_image'
    | 'ai_avatar'
    | 'talking_photo'
    | 'repurpose'
    | 'script_generation'
    | 'hook_generation';
  modelId: string;
  status: JobStatus;
  progressPercent: number;
  prompt: string;
  negativePrompt?: string;
  aspectRatio: '9:16' | '16:9' | '1:1' | '4:5';
  durationSeconds?: number;
  outputUrl?: string;
  thumbnailUrl?: string;
  mediaType: 'image' | 'video' | 'script' | 'audio';
  estimatedCost: number;
  actualCost?: number;
  costTier: 'free_tier' | 'commercial' | 'unknown';
  errorMessage?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

const JOBS_FILE_NAME = 'creator_generation_jobs.json';

function getJobsFilePath(): string {
  return getSafeTempFilePath(JOBS_FILE_NAME);
}

function readJobsFile(): CreatorGenerationJob[] {
  try {
    const filePath = getJobsFilePath();
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('[CreatorJobsStore] Failed to read jobs file, returning empty:', err);
    return [];
  }
}

function writeJobsFile(jobs: CreatorGenerationJob[]): void {
  try {
    const filePath = getJobsFilePath();
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(jobs, null, 2), 'utf-8');
  } catch (err) {
    console.error('[CreatorJobsStore] Failed to persist jobs file:', err);
  }
}

export function createGenerationJob(
  params: Omit<CreatorGenerationJob, 'jobId' | 'status' | 'progressPercent' | 'createdAt' | 'updatedAt'>
): CreatorGenerationJob {
  const jobs = readJobsFile();
  const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newJob: CreatorGenerationJob = {
    ...params,
    jobId,
    status: 'queued',
    progressPercent: 5,
    createdAt: now,
    updatedAt: now,
  };

  jobs.unshift(newJob);
  writeJobsFile(jobs);
  return newJob;
}

export function getGenerationJob(jobId: string): CreatorGenerationJob | null {
  const jobs = readJobsFile();
  return jobs.find((j) => j.jobId === jobId) || null;
}

export function updateGenerationJob(
  jobId: string,
  updates: Partial<CreatorGenerationJob>
): CreatorGenerationJob | null {
  const jobs = readJobsFile();
  const idx = jobs.findIndex((j) => j.jobId === jobId);
  if (idx === -1) return null;

  const now = new Date().toISOString();
  const current = jobs[idx];
  const updated: CreatorGenerationJob = {
    ...current,
    ...updates,
    updatedAt: now,
    ...(updates.status === 'completed' || updates.status === 'failed'
      ? { completedAt: now }
      : {}),
  };

  jobs[idx] = updated;
  writeJobsFile(jobs);
  return updated;
}

export function listGenerationJobs(projectId?: string): CreatorGenerationJob[] {
  const jobs = readJobsFile();
  if (projectId) {
    return jobs.filter((j) => j.projectId === projectId);
  }
  return jobs;
}
