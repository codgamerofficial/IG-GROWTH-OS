'use client';

// =============================================================================
// PujaHop Kolkata: Festive Soundscape & Dhaak Beats Player (Phase 26)
// Floating ambient audio player with real-time procedural equalizer visualizer
// Official Attribution: Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  soundscapeEngine,
  SOUNDSCAPE_RHYTHMS,
  SoundscapeRhythmId,
} from '@/lib/audio/dhaakSoundscape';
import {
  Music,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Gauge,
  X,
  Sparkles,
  Disc3,
  SlidersHorizontal,
} from 'lucide-react';

export function FestiveSoundscapePlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRhythmId, setCurrentRhythmId] = useState<SoundscapeRhythmId>('ashtami_dhaak');
  const [volume, setVolume] = useState(0.55);
  const [bpm, setBpm] = useState(104);
  const [visualizerLevels, setVisualizerLevels] = useState<number[]>([10, 15, 20, 25, 18, 12, 8]);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const updateVisualizer = () => {
      if (soundscapeEngine.getIsPlaying()) {
        const data = soundscapeEngine.getVisualizerData();
        const sampled: number[] = [];
        const step = Math.max(1, Math.floor(data.length / 8));
        for (let i = 0; i < 8; i++) {
          const val = data[i * step] || 0;
          sampled.push(Math.max(12, Math.round((val / 255) * 100)));
        }
        setVisualizerLevels(sampled);
      } else {
        setVisualizerLevels([8, 10, 12, 10, 8, 6, 8, 10]);
      }
      animRef.current = requestAnimationFrame(updateVisualizer);
    };

    animRef.current = requestAnimationFrame(updateVisualizer);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  const handleTogglePlay = () => {
    const nextState = soundscapeEngine.toggle(currentRhythmId);
    setIsPlaying(nextState);
  };

  const handleSelectRhythm = (id: SoundscapeRhythmId) => {
    setCurrentRhythmId(id);
    const r = SOUNDSCAPE_RHYTHMS.find((x) => x.id === id);
    if (r) setBpm(r.defaultBpm);
    if (isPlaying) {
      soundscapeEngine.start(id);
    } else {
      soundscapeEngine.setRhythm(id);
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    soundscapeEngine.setVolume(v);
  };

  const handleBpmChange = (b: number) => {
    setBpm(b);
    soundscapeEngine.setBpm(b);
  };

  const currentRhythm = SOUNDSCAPE_RHYTHMS.find((r) => r.id === currentRhythmId)!;

  return (
    <>
      {/* FLOATING TRIGGER BUTTON */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-3.5 py-2.5 rounded-full shadow-2xl backdrop-blur-md transition-all duration-300 border ${
            isPlaying
              ? 'bg-gradient-to-r from-amber-500/90 to-rose-600/90 text-white border-amber-400 shadow-rose-950/60 scale-105 animate-pulse'
              : 'bg-[#121124]/90 text-zinc-300 hover:text-white border-white/15 hover:border-amber-500/40'
          }`}
          title="Toggle Dhaak & Festive Soundscape"
        >
          {isPlaying ? (
            <Disc3 className="w-5 h-5 animate-spin text-amber-200" />
          ) : (
            <Music className="w-4 h-4 text-amber-400" />
          )}

          {/* Equalizer mini preview */}
          <div className="flex items-end gap-0.5 h-4 w-6 px-0.5">
            {visualizerLevels.slice(0, 4).map((lvl, idx) => (
              <span
                key={idx}
                className="w-1 rounded-full bg-amber-300 transition-all duration-75"
                style={{ height: `${isPlaying ? Math.max(15, lvl) : 25}%` }}
              />
            ))}
          </div>

          <span className="text-xs font-bold hidden sm:inline">
            {isPlaying ? 'Dhaak Playing' : 'Festive Dhaak'}
          </span>
        </button>
      </div>

      {/* EXPANDABLE SOUNDSCAPE MODAL / DRAWER */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:bottom-20 sm:right-6 z-50 w-[92vw] max-w-sm rounded-3xl bg-[#0E0C1F]/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl p-5 space-y-4 animate-in fade-in zoom-in-95 duration-200 text-white">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Music className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-white">Festive Soundscape</h3>
                <p className="text-[10px] text-amber-300 font-medium">উৎসবের ঢাক ও শঙ্খের ধ্বনি</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Spectrum Equalizer Display */}
          <div className="p-3.5 rounded-2xl bg-[#090814] border border-white/5 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-zinc-400">
              <span className="font-semibold text-amber-400">Web Audio Procedural Engine</span>
              <span>100% Offline • Zero Data</span>
            </div>
            <div className="flex items-end justify-between h-12 gap-1 px-1">
              {visualizerLevels.map((lvl, idx) => (
                <div
                  key={idx}
                  className="flex-1 rounded-t-sm transition-all duration-75"
                  style={{
                    height: `${isPlaying ? lvl : 15}%`,
                    background: `linear-gradient(to top, #d97706, #f43f5e)`,
                  }}
                />
              ))}
            </div>
            <div className="text-center text-xs font-bold text-white pt-1">
              {currentRhythm.title}
            </div>
          </div>

          {/* Main Controls: Play/Pause */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleTogglePlay}
              className="p-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white shadow-xl shadow-rose-950/50 transition-all hover:scale-105"
            >
              {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
            </button>
          </div>

          {/* Rhythm Presets */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
              Choose Festive Atmosphere:
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {SOUNDSCAPE_RHYTHMS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => handleSelectRhythm(r.id)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    currentRhythmId === r.id
                      ? 'bg-amber-500/20 border-amber-500 text-white font-bold'
                      : 'bg-white/5 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <div className="line-clamp-1 text-[11px]">{r.title}</div>
                  <div className="text-[9px] text-amber-300 opacity-80 mt-0.5">{r.title_bn}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Sliders: Volume & Tempo */}
          <div className="space-y-2.5 pt-1 text-xs">
            {/* Volume */}
            <div className="flex items-center gap-2">
              {volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-zinc-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-amber-400" />
              )}
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => handleVolumeChange(Number(e.target.value))}
                className="w-full accent-amber-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-zinc-400 w-8 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>

            {/* Tempo BPM */}
            <div className="flex items-center gap-2">
              <Gauge className="w-3.5 h-3.5 text-rose-400" />
              <input
                type="range"
                min="60"
                max="160"
                step="2"
                value={bpm}
                onChange={(e) => handleBpmChange(Number(e.target.value))}
                className="w-full accent-rose-500 h-1.5 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-zinc-400 w-8 text-right">{bpm}BPM</span>
            </div>
          </div>

          {/* Official Creator Credit Footer */}
          <div className="pt-2 border-t border-white/10 text-center">
            <p className="text-[10px] text-zinc-500 font-medium">
              PujaHop Kolkata • Created & Conceptualized by{' '}
              <strong className="text-amber-400">Saswata Dey (Riik)</strong>
            </p>
          </div>
        </div>
      )}
    </>
  );
}
