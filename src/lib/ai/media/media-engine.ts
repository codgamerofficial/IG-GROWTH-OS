// =============================================================================
// RIIQX — Local Media Processing Engine
// Real FFmpeg/FFprobe Probe • Local Trimming • Frame Extraction • Zero Fake Files
// =============================================================================

import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execAsync = promisify(exec);

export interface MediaProbeResult {
  isOperational: boolean;
  ffmpegVersion?: string;
  ffprobeVersion?: string;
  diagnostic: string;
}

export interface VideoTrimOptions {
  inputPath: string;
  outputPath: string;
  startSeconds: number;
  durationSeconds: number;
}

export interface FrameExtractionOptions {
  inputPath: string;
  outputImagePath: string;
  timestampSeconds: number;
}

export class LocalMediaEngine {
  private static cachedProbe: MediaProbeResult | null = null;

  /**
   * Empirically verify whether FFmpeg and FFprobe exist on the host OS
   */
  public static async probeHostMediaStack(): Promise<MediaProbeResult> {
    if (this.cachedProbe) return this.cachedProbe;

    try {
      const { stdout: ffmpegOut } = await execAsync('ffmpeg -version', { timeout: 3000 });
      const versionMatch = ffmpegOut.match(/ffmpeg version ([^\s]+)/i);
      const ffmpegVersion = versionMatch ? versionMatch[1] : 'installed';

      let ffprobeVersion = 'unknown';
      try {
        const { stdout: ffprobeOut } = await execAsync('ffprobe -version', { timeout: 3000 });
        const probeMatch = ffprobeOut.match(/ffprobe version ([^\s]+)/i);
        ffprobeVersion = probeMatch ? probeMatch[1] : 'installed';
      } catch {
        ffprobeVersion = 'missing';
      }

      this.cachedProbe = {
        isOperational: true,
        ffmpegVersion,
        ffprobeVersion,
        diagnostic: `Host media tools operational: FFmpeg ${ffmpegVersion}, FFprobe ${ffprobeVersion}`,
      };
      return this.cachedProbe;
    } catch {
      this.cachedProbe = {
        isOperational: false,
        diagnostic:
          'FFmpeg binary is not in system PATH. Video editing falls back to browser-native Canvas / Web Audio processing.',
      };
      return this.cachedProbe;
    }
  }

  /**
   * Extract a still frame from a video file
   */
  public static async extractFrame(options: FrameExtractionOptions): Promise<string> {
    const probe = await this.probeHostMediaStack();
    if (!probe.isOperational) {
      throw new Error(`Media processing aborted: ${probe.diagnostic}`);
    }

    if (!fs.existsSync(options.inputPath)) {
      throw new Error(`Input video file not found at: ${options.inputPath}`);
    }

    const outputDir = path.dirname(options.outputImagePath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const cmd = `ffmpeg -ss ${options.timestampSeconds} -i "${options.inputPath}" -vframes 1 -q:v 2 "${options.outputImagePath}" -y`;
    await execAsync(cmd, { timeout: 10000 });

    if (!fs.existsSync(options.outputImagePath)) {
      throw new Error('FFmpeg executed but frame asset was not created on disk.');
    }

    return options.outputImagePath;
  }

  /**
   * Trim video without re-encoding using stream copy
   */
  public static async trimVideoFast(options: VideoTrimOptions): Promise<string> {
    const probe = await this.probeHostMediaStack();
    if (!probe.isOperational) {
      throw new Error(`Media processing aborted: ${probe.diagnostic}`);
    }

    if (!fs.existsSync(options.inputPath)) {
      throw new Error(`Input video file not found at: ${options.inputPath}`);
    }

    const outputDir = path.dirname(options.outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const cmd = `ffmpeg -ss ${options.startSeconds} -i "${options.inputPath}" -t ${options.durationSeconds} -c copy "${options.outputPath}" -y`;
    await execAsync(cmd, { timeout: 30000 });

    if (!fs.existsSync(options.outputPath)) {
      throw new Error('FFmpeg executed but output trimmed video was not created.');
    }

    return options.outputPath;
  }
}

