'use client';

// =============================================================================
// PujaHop Kolkata: Bilingual Pandal Audio Story Narrator (Phase 27)
// SpeechSynthesis voice guide • English & Bengali heritage scripts • Artisan credits
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Pandal } from '@/lib/types/pujahop';
import { getStoryForPandal, PandalHeritageStory } from '@/lib/data/pandal-stories';
import {
  Headphones,
  Play,
  Pause,
  RotateCcw,
  Languages,
  Sparkles,
  Palette,
  Lightbulb,
  User,
  Volume2,
} from 'lucide-react';

interface PandalAudioStoryPlayerProps {
  pandal: Pandal;
}

export function PandalAudioStoryPlayer({ pandal }: PandalAudioStoryPlayerProps) {
  const [lang, setLang] = useState<'EN' | 'BN'>('EN');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1.0);
  const [showTranscript, setShowTranscript] = useState(true);

  const story: PandalHeritageStory = getStoryForPandal(pandal.id, pandal.name, pandal.theme);

  useEffect(() => {
    // Stop speech if pandal or language changes
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [pandal.id, lang]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Text-to-speech is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = speechRate;

    // Pick appropriate voice
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'BN') {
      const bnVoice = voices.find(
        (v) => v.lang.toLowerCase().includes('bn') || v.name.toLowerCase().includes('bengali')
      );
      if (bnVoice) utterance.voice = bnVoice;
      utterance.lang = 'bn-IN';
    } else {
      const enVoice =
        voices.find((v) => v.lang === 'en-IN') ||
        voices.find((v) => v.lang.startsWith('en'));
      if (enVoice) utterance.voice = enVoice;
      utterance.lang = 'en-IN';
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handlePlayToggle = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;

    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    } else {
      const narrative = lang === 'EN' ? story.english_narrative : story.bengali_narrative;
      speakText(narrative);
    }
  };

  const handleReset = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  const currentNarrative = lang === 'EN' ? story.english_narrative : story.bengali_narrative;
  const currentTitle = lang === 'EN' ? story.english_title : story.bengali_title;

  return (
    <div className="space-y-4 p-4 md:p-5 rounded-2xl bg-[#121124] border border-amber-500/20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Headphones className="w-4 h-4 text-amber-400" />
            <span>Heritage Audio Guide & Artisan Stories</span>
          </div>
          <h3 className="text-sm md:text-base font-extrabold text-white mt-1">
            {currentTitle}
          </h3>
        </div>

        {/* Language & Speed Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Bengali / English Switcher */}
          <div className="flex items-center bg-[#0D0B1C] p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setLang('EN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                lang === 'EN'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLang('BN')}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                lang === 'BN'
                  ? 'bg-amber-500 text-black shadow'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              বাংলা
            </button>
          </div>

          {/* Speed Toggle */}
          <button
            type="button"
            onClick={() => {
              const rates = [0.85, 1.0, 1.2];
              const nextIdx = (rates.indexOf(speechRate) + 1) % rates.length;
              setSpeechRate(rates[nextIdx]);
            }}
            className="px-2 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-semibold text-zinc-300"
            title="Adjust narration playback rate"
          >
            {speechRate}x
          </button>
        </div>
      </div>

      {/* Artisan & Cultural Credits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
        {story.artisan_credits.idol_maker && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
              <User className="w-3 h-3 text-amber-400" />
              <span>Pratima / Idol Sculptor</span>
            </div>
            <div className="font-bold text-amber-300 truncate">
              {story.artisan_credits.idol_maker}
            </div>
          </div>
        )}

        {story.artisan_credits.concept_designer && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Palette className="w-3 h-3 text-rose-400" />
              <span>Theme Architect</span>
            </div>
            <div className="font-bold text-white truncate">
              {story.artisan_credits.concept_designer}
            </div>
          </div>
        )}

        {story.artisan_credits.lighting_artist && (
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <div className="text-[10px] text-zinc-400 flex items-center gap-1">
              <Lightbulb className="w-3 h-3 text-cyan-400" />
              <span>Chandannagar Lights</span>
            </div>
            <div className="font-bold text-cyan-300 truncate">
              {story.artisan_credits.lighting_artist}
            </div>
          </div>
        )}
      </div>

      {/* Audio Player Control Bar */}
      <div className="p-3.5 rounded-xl bg-[#0D0B1C] border border-white/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePlayToggle}
            className={`p-3 rounded-xl transition-all shadow-md flex items-center justify-center ${
              isPlaying && !isPaused
                ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                : 'bg-amber-500 hover:bg-amber-600 text-black'
            }`}
          >
            {isPlaying && !isPaused ? (
              <Pause className="w-4 h-4 fill-current" />
            ) : (
              <Play className="w-4 h-4 fill-current ml-0.5" />
            )}
          </button>

          {(isPlaying || isPaused) && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white transition-colors"
              title="Stop & Reset Audio"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}

          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>{isPlaying && !isPaused ? 'Playing Voice Guide' : isPaused ? 'Audio Paused' : 'Listen to Heritage Story'}</span>
            </div>
            <div className="text-[10px] text-zinc-400">
              {story.duration_minutes} min narration • Native voice engine
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowTranscript(!showTranscript)}
          className="text-[11px] text-amber-400 hover:underline font-semibold"
        >
          {showTranscript ? 'Hide Script' : 'Read Transcript'}
        </button>
      </div>

      {/* Transcript Text */}
      {showTranscript && (
        <div className="p-4 rounded-xl bg-white/5 border border-white/5 text-xs text-zinc-200 leading-relaxed space-y-2">
          <p className="font-medium">{currentNarrative}</p>
          <div className="pt-2 border-t border-white/5 text-[11px] text-amber-300/90 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Highlight: {story.historical_highlight}</span>
          </div>
        </div>
      )}
    </div>
  );
}
