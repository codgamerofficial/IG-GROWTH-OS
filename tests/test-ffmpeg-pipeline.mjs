import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import ffprobeInstaller from '@ffprobe-installer/ffprobe';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'node:fs';
import path from 'node:path';

ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

console.log('Testing fluent-ffmpeg with bundled binaries...');

// Create a 3-second test color video clip with tone using FFmpeg lavfi generator
const outputTestVideo = path.resolve('tests/sample-generated-clip.mp4');

await new Promise((resolve, reject) => {
  ffmpeg()
    .input('color=c=black:s=720x1280:d=3:r=30')
    .inputFormat('lavfi')
    .input('sine=f=440:b=4:d=3')
    .inputFormat('lavfi')
    .outputOptions([
      '-c:v libx264',
      '-pix_fmt yuv420p',
      '-c:a aac',
      '-shortest'
    ])
    .output(outputTestVideo)
    .on('start', (cmd) => console.log('FFmpeg spawn:', cmd))
    .on('progress', (p) => console.log(`Progress: ${Math.round(p.percent || 0)}%`))
    .on('end', () => {
      console.log('✅ FFmpeg render completed successfully!');
      resolve();
    })
    .on('error', (err) => {
      console.error('❌ FFmpeg render error:', err);
      reject(err);
    })
    .run();
});

// Now probe the generated video with ffprobe
await new Promise((resolve, reject) => {
  ffmpeg.ffprobe(outputTestVideo, (err, metadata) => {
    if (err) {
      console.error('❌ FFprobe probe error:', err);
      reject(err);
      return;
    }
    const vStream = metadata.streams.find(s => s.codec_type === 'video');
    const aStream = metadata.streams.find(s => s.codec_type === 'audio');
    console.log('✅ Probe verified:');
    console.log('   Duration:', metadata.format.duration, 'sec');
    console.log('   Resolution:', vStream.width, 'x', vStream.height);
    console.log('   Video Codec:', vStream.codec_name);
    console.log('   Audio Codec:', aStream ? aStream.codec_name : 'none');
    console.log('   File Size:', metadata.format.size, 'bytes');
    resolve();
  });
});
