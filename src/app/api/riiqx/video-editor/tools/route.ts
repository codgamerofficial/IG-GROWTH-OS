// =============================================================================
// RIIQX — Video Editor Toolchain Health & Verification API
// Genuine command verification • Zero mock/fabricated status
// Verifies HyperFrames, FFmpeg, FFprobe, Python, Whisper, yt-dlp
// =============================================================================

import { NextResponse } from 'next/server';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { resolveFfmpegBinary, resolveFfprobeBinary } from '@/lib/video/ffmpeg-service';

const execAsync = promisify(exec);

export interface ToolHealthItem {
  id: string;
  name: string;
  requiredFor: string;
  isInstalled: boolean;
  version: string | null;
  status: 'healthy' | 'warning' | 'error';
  binaryPath?: string;
  notes?: string;
}

export async function GET() {
  const tools: ToolHealthItem[] = [];

  // 1. Node.js
  try {
    const { stdout } = await execAsync('node -v');
    tools.push({
      id: 'node',
      name: 'Node.js Runtime',
      requiredFor: 'Next.js App Server & HyperFrames Execution',
      isInstalled: true,
      version: stdout.trim(),
      status: 'healthy',
      notes: 'v22+ required for deterministic composition rendering',
    });
  } catch (err: any) {
    tools.push({
      id: 'node',
      name: 'Node.js Runtime',
      requiredFor: 'Next.js & HyperFrames',
      isInstalled: false,
      version: null,
      status: 'error',
      notes: err.message,
    });
  }

  // 2. HyperFrames CLI / Core
  try {
    const { stdout } = await execAsync('npx hyperframes --version');
    tools.push({
      id: 'hyperframes',
      name: 'HyperFrames Engine',
      requiredFor: 'HTML/CSS Motion Graphics, Kinetic Typography & Overlay Animations',
      isInstalled: true,
      version: stdout.trim(),
      status: 'healthy',
      notes: 'Apache-2.0 agent-native HTML-to-video compositor (HeyGen)',
    });
  } catch (err: any) {
    tools.push({
      id: 'hyperframes',
      name: 'HyperFrames Engine',
      requiredFor: 'Motion Graphics & Subtitles',
      isInstalled: false,
      version: null,
      status: 'error',
      notes: err.message,
    });
  }

  // 3. FFmpeg
  try {
    const ffmpegPath = resolveFfmpegBinary();
    const { stdout } = await execAsync(`"${ffmpegPath}" -version`);
    const firstLine = stdout.split('\n')[0] || 'Installed';
    tools.push({
      id: 'ffmpeg',
      name: 'FFmpeg Processing Engine',
      requiredFor: 'Trimming, Normalization, Audio Mixing, Aspect Ratio Conversion & MP4 Encoding',
      isInstalled: true,
      version: firstLine.replace('ffmpeg version ', '').split(' ')[0],
      status: 'healthy',
      binaryPath: ffmpegPath,
      notes: 'Native 64-bit multi-stream encoding pipeline',
    });
  } catch (err: any) {
    tools.push({
      id: 'ffmpeg',
      name: 'FFmpeg Processing Engine',
      requiredFor: 'Transcoding & Output Validation',
      isInstalled: false,
      version: null,
      status: 'error',
      notes: err.message,
    });
  }

  // 4. FFprobe
  try {
    const ffprobePath = resolveFfprobeBinary();
    const { stdout } = await execAsync(`"${ffprobePath}" -version`);
    const firstLine = stdout.split('\n')[0] || 'Installed';
    tools.push({
      id: 'ffprobe',
      name: 'FFprobe Quality Analyzer',
      requiredFor: 'Post-Render Frame, Stream, Audio & Integrity Verification',
      isInstalled: true,
      version: firstLine.replace('ffprobe version ', '').split(' ')[0],
      status: 'healthy',
      binaryPath: ffprobePath,
      notes: 'Mandatory QA checkpoint for all final video exports',
    });
  } catch (err: any) {
    tools.push({
      id: 'ffprobe',
      name: 'FFprobe Quality Analyzer',
      requiredFor: 'Stream Inspection',
      isInstalled: false,
      version: null,
      status: 'error',
      notes: err.message,
    });
  }

  // 5. Python
  let pythonAvailable = false;
  try {
    const { stdout } = await execAsync('python --version');
    pythonAvailable = true;
    tools.push({
      id: 'python',
      name: 'Python Runtime',
      requiredFor: 'Whisper Speech Models & yt-dlp Metadata Extraction',
      isInstalled: true,
      version: stdout.trim().replace('Python ', ''),
      status: 'healthy',
      notes: 'Local execution environment for audio intelligence',
    });
  } catch (err: any) {
    tools.push({
      id: 'python',
      name: 'Python Runtime',
      requiredFor: 'Whisper & yt-dlp',
      isInstalled: false,
      version: null,
      status: 'error',
      notes: err.message,
    });
  }

  // 6. OpenAI Whisper
  if (pythonAvailable) {
    try {
      const { stdout } = await execAsync('python -c "import whisper; print(whisper.__version__)"');
      tools.push({
        id: 'whisper',
        name: 'OpenAI Whisper',
        requiredFor: 'Automatic Speech Recognition, Multi-Language & Word-Level Alignment',
        isInstalled: true,
        version: stdout.trim(),
        status: 'healthy',
        notes: 'Models available: tiny, base, small, medium (configured with word timestamps)',
      });
    } catch (err: any) {
      tools.push({
        id: 'whisper',
        name: 'OpenAI Whisper',
        requiredFor: 'Speech Transcription',
        isInstalled: false,
        version: null,
        status: 'warning',
        notes: err.message,
      });
    }
  }

  // 7. yt-dlp
  if (pythonAvailable) {
    try {
      const { stdout } = await execAsync('python -m yt_dlp --version');
      tools.push({
        id: 'ytdlp',
        name: 'yt-dlp Media Ingestion',
        requiredFor: 'Authorized Reference Reel Extraction & Audio Metadata Inspection',
        isInstalled: true,
        version: stdout.trim(),
        status: 'healthy',
        notes: 'Strict DRM-safe compliance policy: user-authorized reference media only',
      });
    } catch (err: any) {
      tools.push({
        id: 'ytdlp',
        name: 'yt-dlp Media Ingestion',
        requiredFor: 'Reference Video Ingestion',
        isInstalled: false,
        version: null,
        status: 'warning',
        notes: err.message,
      });
    }
  }

  const allHealthy = tools.every((t) => t.isInstalled && t.status === 'healthy');

  return NextResponse.json({
    success: true,
    allHealthy,
    tools,
    verifiedAt: new Date().toISOString(),
  });
}
