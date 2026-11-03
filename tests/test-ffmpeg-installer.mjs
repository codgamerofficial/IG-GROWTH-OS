import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

console.log('FFmpeg binary path:', ffmpegInstaller.path);
console.log('FFprobe binary path:', ffprobeInstaller.path);

try {
  const { stdout: ffmpegOut } = await execFileAsync(ffmpegInstaller.path, ['-version']);
  console.log('✅ FFmpeg Version line 1:', ffmpegOut.split('\n')[0]);
} catch (e) {
  console.error('❌ FFmpeg failed:', e.message);
}

try {
  const { stdout: ffprobeOut } = await execFileAsync(ffprobeInstaller.path, ['-version']);
  console.log('✅ FFprobe Version line 1:', ffprobeOut.split('\n')[0]);
} catch (e) {
  console.error('❌ FFprobe failed:', e.message);
}

