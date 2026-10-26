// =============================================================================
// RIIQX — Social Media Autopilot Execution & Lifecycle State Engine
// 12-State Machine • Emergency STOP • Rate Limit & Budget Protection
// =============================================================================

import { AutopilotJob, AutopilotJobStatus, AutopilotRule, AutopilotSystemStatus } from './autopilot-types';

const INITIAL_RULES: AutopilotRule[] = [
  {
    id: 'rule_ai_reels_daily',
    name: 'AI Engineering Daily Reels',
    platform: 'instagram_reels',
    niche: 'AI & Full-Stack Engineering',
    targetAudience: 'Developers, Tech Enthusiasts, Founders',
    language: 'en',
    frequencyPerWeek: 7,
    maxDailyPosts: 1,
    timeZone: 'Asia/Kolkata',
    allowedPublishHours: [10, 18],
    requireHumanApproval: false,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rule_tech_shorts_triweekly',
    name: 'Tech Insights YouTube Shorts',
    platform: 'youtube_shorts',
    niche: 'Autonomous Agent Workflows',
    targetAudience: 'Productivity Creators & Indie Hackers',
    language: 'en',
    frequencyPerWeek: 3,
    maxDailyPosts: 1,
    timeZone: 'Asia/Kolkata',
    allowedPublishHours: [12, 19],
    requireHumanApproval: true,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

const INITIAL_JOBS: AutopilotJob[] = [
  {
    id: 'job_001_deepseek_reel',
    ruleId: 'rule_ai_reels_daily',
    ruleName: 'AI Engineering Daily Reels',
    platform: 'instagram_reels',
    topic: 'Why Bedrock Cloud + Local Edge AI is the Winning Hybrid in 2026',
    status: 'scheduled',
    progressPercent: 75,
    scheduledFor: new Date(Date.now() + 3600 * 1000).toISOString(),
    retryCount: 0,
    maxRetries: 3,
    logs: [
      'Job enqueued under rule: AI Engineering Daily Reels',
      'Topic research verified with official documentation',
      '9:16 vertical storyboard generated and subtitles synchronized',
      'Canvas video render validated against safe zone margins',
      'Scheduled for delivery in allowed window (18:00 IST)',
    ],
    createdAt: new Date(Date.now() - 7200 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1800 * 1000).toISOString(),
  },
  {
    id: 'job_002_agentic_shorts',
    ruleId: 'rule_tech_shorts_triweekly',
    ruleName: 'Tech Insights YouTube Shorts',
    platform: 'youtube_shorts',
    topic: '3 Essential Rules for Level 3 AI Autopilot Engines',
    status: 'published',
    progressPercent: 100,
    scheduledFor: new Date(Date.now() - 86400 * 1000).toISOString(),
    publishedUrl: 'https://youtube.com/shorts/sample_riiqx_demo',
    retryCount: 0,
    maxRetries: 3,
    logs: [
      'Job enqueued under rule: Tech Insights YouTube Shorts',
      'Generated Curiosity Gap viral hook',
      'Completed 30s vertical 9:16 render',
      'Published via YouTube Data API v3 container with #Shorts identifier',
    ],
    createdAt: new Date(Date.now() - 90000 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 86400 * 1000).toISOString(),
  },
];

let globalEmergencyStop = false;
let globalRules: AutopilotRule[] = [...INITIAL_RULES];
let globalJobs: AutopilotJob[] = [...INITIAL_JOBS];

export function getAutopilotSystemStatus(): AutopilotSystemStatus {
  return {
    isEmergencyStopped: globalEmergencyStop,
    activeRulesCount: globalRules.filter((r) => r.isActive).length,
    queuedJobsCount: globalJobs.filter((j) => j.status === 'queued' || j.status === 'scheduled').length,
    inProgressJobsCount: globalJobs.filter(
      (j) =>
        j.status !== 'queued' &&
        j.status !== 'scheduled' &&
        j.status !== 'published' &&
        j.status !== 'failed' &&
        j.status !== 'halted'
    ).length,
    publishedTodayCount: globalJobs.filter((j) => j.status === 'published').length,
    timeZone: 'Asia/Kolkata',
  };
}

export function triggerEmergencyStop(): { success: boolean; haltedJobsCount: number } {
  globalEmergencyStop = true;
  let count = 0;
  globalJobs = globalJobs.map((j) => {
    if (j.status !== 'published' && j.status !== 'failed') {
      count++;
      return {
        ...j,
        status: 'halted' as AutopilotJobStatus,
        logs: [...j.logs, `EMERGENCY STOP TRIGGERED: Job halted at ${new Date().toISOString()}`],
        updatedAt: new Date().toISOString(),
      };
    }
    return j;
  });
  return { success: true, haltedJobsCount: count };
}

export function resumeEmergencyStop(): void {
  globalEmergencyStop = false;
}

export function listAutopilotRules(): AutopilotRule[] {
  return globalRules;
}

export function saveAutopilotRule(rule: AutopilotRule): void {
  const existingIdx = globalRules.findIndex((r) => r.id === rule.id);
  if (existingIdx >= 0) {
    globalRules[existingIdx] = rule;
  } else {
    globalRules.push(rule);
  }
}

export function listAutopilotJobs(): AutopilotJob[] {
  return globalJobs;
}

export function createAutopilotJob(ruleId: string, topic?: string): AutopilotJob {
  const rule = globalRules.find((r) => r.id === ruleId) || globalRules[0];
  const targetTopic = topic || `The Future of ${rule.niche} in 2026`;

  const newJob: AutopilotJob = {
    id: `job_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    ruleId: rule.id,
    ruleName: rule.name,
    platform: rule.platform === 'both' ? 'instagram_reels' : rule.platform,
    topic: targetTopic,
    status: globalEmergencyStop ? 'halted' : 'queued',
    progressPercent: 5,
    scheduledFor: new Date(Date.now() + 600 * 1000).toISOString(),
    retryCount: 0,
    maxRetries: 3,
    logs: [
      `Job enqueued under rule: ${rule.name}`,
      `Target topic: "${targetTopic}"`,
      globalEmergencyStop ? 'EMERGENCY STOP is currently active. Job created in halted state.' : 'Ready for pipeline worker.',
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  globalJobs.unshift(newJob);
  return newJob;
}

export function advanceJobState(jobId: string): AutopilotJob | null {
  const job = globalJobs.find((j) => j.id === jobId);
  if (!job) return null;

  if (globalEmergencyStop) {
    job.status = 'halted';
    job.updatedAt = new Date().toISOString();
    return job;
  }

  const stateOrder: AutopilotJobStatus[] = [
    'queued',
    'researching',
    'scripting',
    'storyboarding',
    'voice_generating',
    'rendering',
    'quality_check',
    'scheduled',
    'publishing',
    'published',
  ];

  const currentIdx = stateOrder.indexOf(job.status);
  if (currentIdx >= 0 && currentIdx < stateOrder.length - 1) {
    const nextState = stateOrder[currentIdx + 1];
    job.status = nextState;
    job.progressPercent = Math.round(((currentIdx + 1) / (stateOrder.length - 1)) * 100);
    job.logs.push(`State transitioned to ${nextState} at ${new Date().toISOString()}`);
    job.updatedAt = new Date().toISOString();

    if (nextState === 'published') {
      job.publishedUrl =
        job.platform === 'instagram_reels'
          ? `https://www.instagram.com/reel/${job.id}`
          : `https://youtube.com/shorts/${job.id}`;
    }
  }

  return job;
}
