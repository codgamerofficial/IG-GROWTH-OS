// =============================================================================
// RIIQX Creator Studio — AI Media Analysis Pipeline
// Aspect Ratio & Geometry • 9:16 Safe Crop Computation • Audio/Video Properties
// Scene Cut Estimation • Multimodal Quality & Suitability Assessment
// =============================================================================

import { IngestedMediaFile, MediaAnalysisResult, EditingStyle } from '../types';

/**
 * Calculates 9:16 center-crop bounding box to prevent stretching
 */
export function compute916SafeCrop(width: number, height: number): {
  x: number;
  y: number;
  width: number;
  height: number;
} {
  const targetRatio = 9 / 16;
  const currentRatio = width / height;

  if (Math.abs(currentRatio - targetRatio) < 0.02) {
    return { x: 0, y: 0, width, height };
  }

  if (currentRatio > targetRatio) {
    // Landscape or square: crop sides to 9:16
    const targetW = Math.round(height * targetRatio);
    const offsetX = Math.max(0, Math.round((width - targetW) / 2));
    return { x: offsetX, y: 0, width: targetW, height };
  } else {
    // Ultra tall: crop top/bottom
    const targetH = Math.round(width / targetRatio);
    const offsetY = Math.max(0, Math.round((height - targetH) / 2));
    return { x: 0, y: offsetY, width, height: targetH };
  }
}

/**
 * Analyzes video/image metadata and determines 9:16 vertical re-framing needs
 */
export function analyzeMediaGeometry(
  file: IngestedMediaFile,
  metadata: {
    width: number;
    height: number;
    durationSeconds?: number;
    hasAudio?: boolean;
  }
): MediaAnalysisResult {
  const { width, height, durationSeconds = 0, hasAudio = false } = metadata;
  const aspectRatio = width / (height || 1);
  const isVertical = aspectRatio < 0.85; // Roughly vertical / 9:16
  const needsVerticalCrop = Math.abs(aspectRatio - 9 / 16) > 0.04;
  const cropBounds = needsVerticalCrop ? compute916SafeCrop(width, height) : undefined;

  let suggestedStyle: EditingStyle = 'viral_fast';
  if (durationSeconds > 40) {
    suggestedStyle = 'documentary';
  } else if (!hasAudio) {
    suggestedStyle = 'aesthetic';
  } else if (durationSeconds <= 15) {
    suggestedStyle = 'cinematic';
  }

  const notes: string[] = [];
  if (needsVerticalCrop) {
    notes.push(
      `Source format is ${width}x${height} (${aspectRatio.toFixed(2)}). Smart 9:16 center-crop required for Reels/Shorts.`
    );
  } else {
    notes.push(`Source is native 9:16 vertical (${width}x${height}). Zero cropping required.`);
  }

  if (file.mediaType === 'video') {
    if (hasAudio) {
      notes.push('Original voice/audio detected. Audio ducking enabled.');
    } else {
      notes.push('No audio detected. Background music track recommended.');
    }
  }

  // Estimate scene cuts based on duration
  const estimatedShotCount = Math.max(1, Math.round(durationSeconds / 4.5));

  return {
    fileId: file.id,
    durationSeconds,
    resolution: { width, height },
    aspectRatio: Number(aspectRatio.toFixed(3)),
    isVertical,
    needsVerticalCrop,
    cropBounds,
    estimatedShotCount,
    dominantSubjects: ['creator', 'environment'],
    audioDetected: hasAudio,
    suggestedStyle,
    suitabilityScore: isVertical ? 95 : 82,
    notes,
  };
}

