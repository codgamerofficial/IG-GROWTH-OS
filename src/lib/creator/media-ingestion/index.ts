// =============================================================================
// RIIQX Creator Studio — Media Ingestion Pipeline
// Mobile Camera Roll • iPhone Photos • Android Gallery • Drag-and-Drop
// File Type / Size Validation • Safe Object URLs • Client Thumbnail Generation
// =============================================================================

import { IngestedMediaFile, MediaMimeType } from '../types';

export const MAX_VIDEO_SIZE_BYTES = 250 * 1024 * 1024; // 250 MB
export const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB

export const SUPPORTED_VIDEO_FORMATS: MediaMimeType[] = [
  'video/mp4',
  'video/quicktime',
  'video/webm',
];

export const SUPPORTED_IMAGE_FORMATS: MediaMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
];

export interface ValidationResult {
  valid: boolean;
  mediaType?: 'image' | 'video';
  error?: string;
}

/**
 * Validates file format, mime type, and maximum upload bounds
 */
export function validateMediaFile(file: {
  name: string;
  size: number;
  type: string;
}): ValidationResult {
  const ext = file.name.split('.').pop()?.toLowerCase();
  const mime = file.type.toLowerCase();

  const isVideo =
    SUPPORTED_VIDEO_FORMATS.includes(mime as MediaMimeType) ||
    ['mp4', 'mov', 'webm', 'm4v'].includes(ext || '');

  const isImage =
    SUPPORTED_IMAGE_FORMATS.includes(mime as MediaMimeType) ||
    ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'].includes(ext || '');

  if (!isVideo && !isImage) {
    return {
      valid: false,
      error: `Unsupported file type: '${file.name}'. Please upload MP4, MOV, WebM, JPG, PNG, or WebP.`,
    };
  }

  if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
    return {
      valid: false,
      error: `Video size exceeds 250MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please compress before upload.`,
    };
  }

  if (isImage && file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size exceeds 25MB limit (${(file.size / (1024 * 1024)).toFixed(1)}MB).`,
    };
  }

  return {
    valid: true,
    mediaType: isVideo ? 'video' : 'image',
  };
}

/**
 * Creates an IngestedMediaFile record from a browser File object
 */
export function createIngestedMedia(
  file: File,
  objectUrl: string,
  thumbnailUrl?: string
): IngestedMediaFile {
  const isVideo = file.type.startsWith('video') || /\.(mp4|mov|webm)$/i.test(file.name);
  return {
    id: `media_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: file.name,
    sizeBytes: file.size,
    mimeType: file.type || (isVideo ? 'video/mp4' : 'image/jpeg'),
    mediaType: isVideo ? 'video' : 'image',
    localUrl: objectUrl,
    thumbnailUrl: thumbnailUrl || objectUrl,
    uploadedAt: new Date().toISOString(),
  };
}

