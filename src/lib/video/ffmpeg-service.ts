// =============================================================================
// RIIQX Master Video Processing Engine — FFmpeg & FFprobe Service
// Native 64-bit Binary Pipeline • Zero Fake Execution • Production Grade
// =============================================================================

import ffmpeg from 'fluent-ffmpeg';
import fs from 'node:fs';
import path from 'node:path';

export function resolveFfmpegBinary(): string {
  const isWin = process.platform === 'win32';
  const arch = process.arch === 'x64' ? 'x64' : 'ia32';
  const binName = isWin ? 'ffmpeg.exe' : 'ffmpeg';
  const localPath = path.join(
    process.cwd(),
    'node_modules',
    '@ffmpeg-installer',
    `${process.platform}-${arch}`,
    binName
  );
  if (fs.existsSync(localPath)) return localPath;
  try {
    const installer = eval("require")('@ffmpeg-installer/ffmpeg');
    if (installer && installer.path) return installer.path;
  } catch {}
  return isWin ? 'ffmpeg.exe' : 'ffmpeg';
}

export function resolveFfprobeBinary(): string {
  const isWin = process.platform === 'win32';
  const arch = process.arch === 'x64' ? 'x64' : 'ia32';
  const binName = isWin ? 'ffprobe.exe' : 'ffprobe';
  const localPath = path.join(
    process.cwd(),
    'node_modules',
    '@ffprobe-installer',
    `${process.platform}-${arch}`,
    binName
  );
  if (fs.existsSync(localPath)) return localPath;
  try {
    const installer = eval("require")('@ffprobe-installer/ffprobe');
    if (installer && installer.path) return installer.path;
  } catch {}
  return isWin ? 'ffprobe.exe' : 'ffprobe';
}

// Configure static binary paths
ffmpeg.setFfmpegPath(resolveFfmpegBinary());
ffmpeg.setFfprobePath(resolveFfprobeBinary());

export interface VideoStreamMetadata {
  durationSeconds: number;
  width: number;
  height: number;
  fps: number;
  bitrateKbps: number;
  videoCodec: string;
  audioCodec: string;
  hasAudio: boolean;
  audioChannels: number;
  aspectRatio: string;
  fileSizeBytes: number;
}

export interface QualityCheckResult {
  isValid: boolean;
  durationSeconds: number;
  width: number;
  height: number;
  videoCodec: string;
  audioCodec?: string;
  fileSizeBytes: number;
  isPlayable: boolean;
  errors: string[];
}

export class FFmpegService {
  /**
   * Probe video file and extract exhaustive stream metadata
   */
  public static async probeMedia(filePath: string): Promise<VideoStreamMetadata> {
    if (!fs.existsSync(filePath)) {
      throw new Error(`Media file not found on disk at: ${filePath}`);
    }

    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
          return reject(new Error(`FFprobe inspection failed: ${err.message}`));
        }

        const vStream = metadata.streams.find((s) => s.codec_type === 'video');
        const aStream = metadata.streams.find((s) => s.codec_type === 'audio');

        if (!vStream) {
          return reject(new Error('No valid video stream found in media file.'));
        }

        // Calculate accurate frame rate
        let fps = 30;
        if (vStream.r_frame_rate) {
          const parts = vStream.r_frame_rate.split('/');
          if (parts.length === 2 && Number(parts[1]) > 0) {
            fps = Math.round(Number(parts[0]) / Number(parts[1]));
          }
        }

        const width = vStream.width || 720;
        const height = vStream.height || 1280;
        const durationSeconds = Number(metadata.format.duration || vStream.duration || 0);
        const bitrateKbps = Math.round(Number(metadata.format.bit_rate || 0) / 1000);

        let aspect = '9:16';
        const ratio = width / height;
        if (ratio > 1.6) aspect = '16:9';
        else if (ratio >= 0.9 && ratio <= 1.1) aspect = '1:1';
        else if (ratio >= 0.75 && ratio <= 0.85) aspect = '4:5';

        resolve({
          durationSeconds,
          width,
          height,
          fps,
          bitrateKbps,
          videoCodec: vStream.codec_name || 'h264',
          audioCodec: aStream?.codec_name || 'none',
          hasAudio: Boolean(aStream),
          audioChannels: aStream?.channels || 0,
          aspectRatio: aspect,
          fileSizeBytes: Number(metadata.format.size || 0),
        });
      });
    });
  }

  /**
   * Extract representative keyframe images across target timestamps
   */
  public static async extractKeyframes(
    videoPath: string,
    timestamps: number[],
    outputDir: string
  ): Promise<string[]> {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const framePaths: string[] = [];

    for (let i = 0; i < timestamps.length; i++) {
      const ts = timestamps[i];
      const frameFileName = `frame_${i}_${Math.round(ts)}s.jpg`;
      const frameFilePath = path.join(outputDir, frameFileName);

      await new Promise<void>((resolve, reject) => {
        ffmpeg(videoPath)
          .seekInput(ts)
          .outputOptions(['-vframes 1', '-q:v 2'])
          .output(frameFilePath)
          .on('end', () => {
            framePaths.push(frameFilePath);
            resolve();
          })
          .on('error', (err) => {
            console.warn(`[FFmpegService] Frame extraction at ${ts}s warning:`, err.message);
            resolve(); // continue gracefully
          })
          .run();
      });
    }

    return framePaths;
  }

  /**
   * Extract a single high-quality thumbnail image at a specific timestamp
   */
  public static async extractThumbnail(
    videoPath: string,
    outputPath: string,
    timestampSec: number = 1.0
  ): Promise<string> {
    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    return new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .seekInput(timestampSec)
        .outputOptions(['-vframes 1', '-q:v 2'])
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', () => {
          // Fallback to start of video if requested timestamp is out of range
          ffmpeg(videoPath)
            .seekInput(0)
            .outputOptions(['-vframes 1', '-q:v 2'])
            .output(outputPath)
            .on('end', () => resolve(outputPath))
            .on('error', (err2) => reject(new Error(`FFmpeg thumbnail extraction failed: ${err2.message}`)))
            .run();
        })
        .run();
    });
  }

  /**
   * Trims a video segment with optional speed multiplier and color LUT filter
   */
  public static async trimAndProcessSegment(
    inputPath: string,
    outputPath: string,
    options: {
      inSec: number;
      outSec: number;
      speedMultiplier?: number;
      filter?: 'clean' | 'teal_orange' | 'cyberpunk' | 'noir' | 'vintage' | 'golden_hour';
      targetWidth?: number;
      targetHeight?: number;
    }
  ): Promise<string> {
    const duration = Math.max(0.5, options.outSec - options.inSec);
    const speed = options.speedMultiplier || 1.0;
    const targetW = options.targetWidth || 720;
    const targetH = options.targetHeight || 1280;

    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Build FFmpeg video filter graph
    const videoFilters: string[] = [];

    // 1. Center crop and scale to exact vertical target geometry
    videoFilters.push(`scale=${targetW}:${targetH}:force_original_aspect_ratio=increase,crop=${targetW}:${targetH}`);

    // 2. Speed ramping
    if (speed !== 1.0) {
      const setpts = (1 / speed).toFixed(4);
      videoFilters.push(`setpts=${setpts}*PTS`);
    }

    // 3. Color grading filters
    if (options.filter === 'teal_orange') {
      videoFilters.push('eq=contrast=1.15:brightness=0.02:saturation=1.3');
    } else if (options.filter === 'cyberpunk') {
      videoFilters.push('eq=contrast=1.25:saturation=1.5:gamma_g=0.9:gamma_b=1.2');
    } else if (options.filter === 'noir') {
      videoFilters.push('hue=s=0,eq=contrast=1.3:brightness=-0.05');
    } else if (options.filter === 'vintage') {
      videoFilters.push('eq=contrast=0.95:saturation=0.85:gamma_r=1.1:gamma_b=0.85');
    } else if (options.filter === 'golden_hour') {
      videoFilters.push('eq=contrast=1.1:saturation=1.2:gamma_r=1.15:gamma_b=0.9');
    }

    return new Promise((resolve, reject) => {
      let command = ffmpeg(inputPath)
        .seekInput(options.inSec)
        .duration(duration)
        .videoFilters(videoFilters)
        .outputOptions([
          '-c:v libx264',
          '-preset veryfast',
          '-pix_fmt yuv420p',
          '-c:a aac',
          '-b:a 192k',
          '-avoid_negative_ts make_zero',
        ]);

      if (speed !== 1.0) {
        // Audio speed adjustment filter
        command = command.audioFilters(`atempo=${speed}`);
      }

      command
        .output(outputPath)
        .on('end', () => resolve(outputPath))
        .on('error', (err) => reject(new Error(`FFmpeg segment trim failed: ${err.message}`)))
        .run();
    });
  }

  /**
   * Concatenate multiple edited video segments into a single cohesive video
   */
  public static async concatenateSegments(
    segmentPaths: string[],
    outputPath: string
  ): Promise<string> {
    if (segmentPaths.length === 0) {
      throw new Error('No segments provided for concatenation.');
    }

    if (segmentPaths.length === 1) {
      fs.copyFileSync(segmentPaths[0], outputPath);
      return outputPath;
    }

    const outDir = path.dirname(outputPath);
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    // Create FFmpeg concat list file
    const listFilePath = path.join(outDir, `concat_${Date.now()}.txt`);
    const fileContent = segmentPaths
      .map((p) => `file '${p.replace(/\\/g, '/')}'`)
      .join('\n');
    fs.writeFileSync(listFilePath, fileContent, 'utf-8');

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(listFilePath)
        .inputOptions(['-f concat', '-safe 0'])
        .outputOptions([
          '-c:v libx264',
          '-preset veryfast',
          '-pix_fmt yuv420p',
          '-c:a aac',
          '-b:a 192k',
          '-movflags +faststart',
        ])
        .output(outputPath)
        .on('end', () => {
          try {
            fs.unlinkSync(listFilePath);
          } catch {}
          resolve(outputPath);
        })
        .on('error', (err) => {
          try {
            fs.unlinkSync(listFilePath);
          } catch {}
          reject(new Error(`FFmpeg concatenation failed: ${err.message}`));
        })
        .run();
    });
  }

  /**
   * Run strict quality control on rendered media output
   */
  public static async runQualityCheck(filePath: string): Promise<QualityCheckResult> {
    const errors: string[] = [];

    if (!fs.existsSync(filePath)) {
      return {
        isValid: false,
        durationSeconds: 0,
        width: 0,
        height: 0,
        videoCodec: 'none',
        fileSizeBytes: 0,
        isPlayable: false,
        errors: ['Output file does not exist on disk.'],
      };
    }

    const stat = fs.statSync(filePath);
    if (stat.size < 5000) {
      errors.push(`Output file size too small (${stat.size} bytes), likely corrupted.`);
    }

    try {
      const probe = await this.probeMedia(filePath);
      if (probe.durationSeconds <= 0) {
        errors.push('Output video duration is 0 seconds.');
      }
      if (probe.width <= 0 || probe.height <= 0) {
        errors.push(`Invalid video resolution: ${probe.width}x${probe.height}.`);
      }

      return {
        isValid: errors.length === 0,
        durationSeconds: probe.durationSeconds,
        width: probe.width,
        height: probe.height,
        videoCodec: probe.videoCodec,
        audioCodec: probe.audioCodec,
        fileSizeBytes: stat.size,
        isPlayable: errors.length === 0,
        errors,
      };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Corrupted output stream';
      errors.push(`Integrity verification failed: ${msg}`);
      return {
        isValid: false,
        durationSeconds: 0,
        width: 0,
        height: 0,
        videoCodec: 'none',
        fileSizeBytes: stat.size,
        isPlayable: false,
        errors,
      };
    }
  }
}
