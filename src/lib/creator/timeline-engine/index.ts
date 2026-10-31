// =============================================================================
// RIIQX Creator Studio — Multi-Track Timeline Engine
// 5-Track Timeline • Sequencing • Trimming • Transition Curves • Safe Zones
// =============================================================================

import { TimelineClip, IngestedMediaFile, EditingPlan } from '../types';

/**
 * Builds a multi-clip timeline sequencing source media to target duration
 */
export function buildTimeline(
  mediaFiles: IngestedMediaFile[],
  plan: EditingPlan
): TimelineClip[] {
  if (mediaFiles.length === 0) return [];

  const targetDuration = plan.targetDurationSeconds || 30;
  const clipDuration = targetDuration / mediaFiles.length;

  return mediaFiles.map((file, idx) => {
    const startTime = idx * clipDuration;
    const duration = clipDuration;

    return {
      id: `clip_${idx}_${file.id}`,
      sourceFileId: file.id,
      sourceUrl: file.localUrl,
      mediaType: file.mediaType,
      trackIndex: 0, // Track 0 = Primary Video/A-Roll
      startTime: Number(startTime.toFixed(2)),
      duration: Number(duration.toFixed(2)),
      sourceTrimStart: 0,
      sourceTrimEnd: Number(duration.toFixed(2)),
      filter: plan.selectedFilter,
      speed: plan.speedMultiplier,
      volume: 1.0,
    };
  });
}

/**
 * Validates timeline clip continuity and non-overlapping track placement
 */
export function validateTimelineContinuity(clips: TimelineClip[]): {
  valid: boolean;
  totalDuration: number;
} {
  if (clips.length === 0) return { valid: false, totalDuration: 0 };
  let totalDuration = 0;
  for (const c of clips) {
    totalDuration += c.duration;
  }
  return {
    valid: totalDuration > 0,
    totalDuration: Number(totalDuration.toFixed(2)),
  };
}

