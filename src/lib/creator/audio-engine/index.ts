// =============================================================================
// RIIQX Creator Studio — Audio Engine
// Normalization (-14 LUFS Standard) • Dynamic Ducking • Silence Trimming
// =============================================================================

export interface AudioMixConfig {
  voiceoverVolume: number; // 0.0 - 1.0 (default 1.0)
  backgroundMusicVolume: number; // 0.0 - 1.0 (default 0.15 during voice)
  duckingThresholdDb: number; // e.g. -18 dB
  normalizeTargetLufs: number; // -14 LUFS standard for Reels/Shorts
}

export const DEFAULT_AUDIO_CONFIG: AudioMixConfig = {
  voiceoverVolume: 1.0,
  backgroundMusicVolume: 0.18,
  duckingThresholdDb: -18,
  normalizeTargetLufs: -14,
};

/**
 * Computes dynamic audio gain parameters for Web Audio API / FFmpeg mixing
 */
export function computeAudioGain(
  isVoiceActive: boolean,
  config: AudioMixConfig = DEFAULT_AUDIO_CONFIG
): {
  voiceGain: number;
  musicGain: number;
} {
  return {
    voiceGain: config.voiceoverVolume,
    musicGain: isVoiceActive ? config.backgroundMusicVolume : Math.min(1.0, config.backgroundMusicVolume * 2.5),
  };
}

