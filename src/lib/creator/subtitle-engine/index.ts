// =============================================================================
// RIIQX Creator Studio — Subtitle & Kinetic Caption Engine
// SRT / WebVTT Generation • Word-Level Timestamps • Safe Margin Padding
// =============================================================================

import { SubtitleCue, CaptionPreset } from '../types';

/**
 * Generates subtitle cues timed evenly across the total video duration
 */
export function generateSubtitleCues(
  sentences: string[],
  totalDurationSeconds: number
): SubtitleCue[] {
  if (sentences.length === 0) return [];

  const cueDuration = totalDurationSeconds / sentences.length;

  return sentences.map((text, idx) => {
    const startTime = idx * cueDuration;
    const endTime = (idx + 1) * cueDuration;
    const words = text.trim().split(/\s+/);
    // Highlight the first 2 words for punchy hooks
    const highlightWords = words.slice(0, 2);

    return {
      id: `cue_${idx + 1}`,
      startTime: Number(startTime.toFixed(2)),
      endTime: Number(endTime.toFixed(2)),
      text: text.trim(),
      highlightWords,
    };
  });
}

/**
 * Exports subtitle cues to official WebVTT string format
 */
export function formatWebVTT(cues: SubtitleCue[]): string {
  let vtt = 'WEBVTT\n\n';

  cues.forEach((cue, i) => {
    const start = formatTimestamp(cue.startTime);
    const end = formatTimestamp(cue.endTime);
    vtt += `${i + 1}\n${start} --> ${end}\n${cue.text}\n\n`;
  });

  return vtt;
}

/**
 * Exports subtitle cues to official SubRip (.srt) format
 */
export function formatSRT(cues: SubtitleCue[]): string {
  let srt = '';

  cues.forEach((cue, i) => {
    const start = formatTimestamp(cue.startTime).replace('.', ',');
    const end = formatTimestamp(cue.endTime).replace('.', ',');
    srt += `${i + 1}\n${start} --> ${end}\n${cue.text}\n\n`;
  });

  return srt;
}

function formatTimestamp(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.floor((seconds % 1) * 1000);

  return `${h.toString().padStart(2, '0')}:${m
    .toString()
    .padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
}

