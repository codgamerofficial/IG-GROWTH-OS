'use client';

// =============================================================================
// RIIQX — Advanced Voice Studio & Video Dubbing Tab
// Open-Source Repos B (VoiceStudio) & E (OpenWhispr) Integration
// Multilingual TTS (Bengali/Hindi/English) • Voice Cloning Consent Guard • Video Dubbing
// =============================================================================

import React, { useState } from 'react';
import {
  Mic,
  Volume2,
  Globe,
  ShieldCheck,
  Play,
  RotateCcw,
  Sparkles,
  Download,
  Languages,
  CheckCircle2,
  AlertTriangle,
  Send,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import { CreatorProject, CreatorStudioTab } from '@/lib/riiqx/creator-types';

interface VoiceStudioTabProps {
  project: CreatorProject | null;
  onUpdateProject?: (p: CreatorProject) => void;
  onTabChange?: (tab: CreatorStudioTab) => void;
}

const VOICES = [
  { id: 'ananya_bn', name: 'Ananya', language: 'bn', label: 'Bengali (Warm Narrative)', gender: 'Female' },
  { id: 'sourav_bn', name: 'Sourav', language: 'bn', label: 'Bengali (Authority Podcast)', gender: 'Male' },
  { id: 'marcus_en', name: 'Marcus', language: 'en', label: 'English (Deep Cinematic)', gender: 'Male' },
  { id: 'emma_en', name: 'Emma', language: 'en', label: 'English (High-Energy Tech)', gender: 'Female' },
  { id: 'rohan_hi', name: 'Rohan', language: 'hi', label: 'Hindi (Energetic Creator)', gender: 'Male' },
  { id: 'priya_hi', name: 'Priya', language: 'hi', label: 'Hindi (Gentle Storyteller)', gender: 'Female' },
];

export function VoiceStudioTab({ project, onUpdateProject, onTabChange }: VoiceStudioTabProps) {
  const [activeMode, setActiveMode] = useState<'tts' | 'dubbing' | 'cloning'>('tts');

  // TTS State
  const [ttsText, setTtsText] = useState(
    project?.storyboard?.caption ||
      'RIIQX is the unified autonomous AI creator operating system designed for exponential reach.'
  );
  const [selectedVoiceId, setSelectedVoiceId] = useState('ananya_bn');
  const [speed, setSpeed] = useState(1.0);
  const [pitch, setPitch] = useState(0);
  const [emotion, setEmotion] = useState<'neutral' | 'enthusiastic' | 'serious' | 'calm'>('enthusiastic');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesizedAudioUrl, setSynthesizedAudioUrl] = useState<string | null>(null);
  const [wordTimings, setWordTimings] = useState<any[]>([]);

  // Dubbing State
  const [dubbingTargetLang, setDubbingTargetLang] = useState<'bn' | 'hi' | 'en' | 'es'>('bn');
  const [preserveBgm, setPreserveBgm] = useState(true);
  const [isDubbing, setIsDubbing] = useState(false);
  const [dubbedResult, setDubbedResult] = useState<any>(null);

  // Cloning State
  const [cloneName, setCloneName] = useState('');
  const [hasConsent, setHasConsent] = useState(false);
  const [cloneStatus, setCloneStatus] = useState<string | null>(null);

  const selectedVoice = VOICES.find((v) => v.id === selectedVoiceId) || VOICES[0];

  // Handle TTS Synthesis
  const handleSynthesize = async () => {
    if (!ttsText.trim()) return;
    setIsSynthesizing(true);

    try {
      const res = await fetch('/api/riiqx/capabilities/voice.synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'voicestudio',
          payload: {
            text: ttsText,
            language: selectedVoice.language,
            voiceId: selectedVoice.id,
            speed,
            pitch,
            emotion,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setSynthesizedAudioUrl(data.result.audioUrl);
        setWordTimings(data.result.wordTimestamps || []);
      } else {
        alert(data.errorMessage || 'Voice synthesis failed.');
      }
    } catch {
      alert('Network error communicating with Voice Studio service.');
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Handle Video Dubbing
  const handleDubbing = async () => {
    const videoUrl = project?.renderedVideoBlobUrl || '/uploads/sample_vertical.mp4';
    setIsDubbing(true);
    setDubbedResult(null);

    try {
      const res = await fetch('/api/riiqx/capabilities/voice.dub', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'voicestudio',
          payload: {
            sourceVideoUrl: videoUrl,
            targetLanguage: dubbingTargetLang,
            preserveBackgroundMusic: preserveBgm,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setDubbedResult(data.result);
      } else {
        alert(data.errorMessage || 'Video dubbing failed.');
      }
    } catch {
      alert('Network error executing video dubbing pipeline.');
    } finally {
      setIsDubbing(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
              <Mic className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">
              Advanced Voice Studio
            </h1>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 uppercase">
              MULTILINGUAL AI
            </span>
          </div>
          <p className="mt-1 text-xs text-[#737373] dark:text-[#A3A3A3]">
            VoiceStudio &amp; OpenWhispr Engine • Bengali, Hindi &amp; English Voice Synthesis &amp; Multi-Track Dubbing.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] shadow-2xs">
          {[
            { id: 'tts', label: 'Text-to-Speech', icon: Volume2 },
            { id: 'dubbing', label: 'Video Dubbing', icon: Languages },
            { id: 'cloning', label: 'Voice Cloning Vault', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeMode === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveMode(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#FFD43B] text-[#202124] shadow-xs'
                    : 'text-[#737373] hover:text-[#202124] dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MODE 1: TEXT TO SPEECH & NARRATION */}
      {activeMode === 'tts' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#18181C] p-5 shadow-2xs space-y-4">
              <h3 className="text-sm font-bold text-[#202124] dark:text-white flex items-center gap-2 border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3">
                <Sliders className="w-4 h-4 text-[#FFD43B]" />
                <span>Voice Profile &amp; Dynamics</span>
              </h3>

              {/* Voice Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#737373] block">Select Studio Voice</label>
                <select
                  value={selectedVoiceId}
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#141418] border border-black/10 dark:border-white/10 text-xs font-bold text-[#202124] dark:text-white focus:outline-hidden"
                >
                  {VOICES.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} — {v.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#737373]">Speaking Rate</span>
                  <span className="text-[#FFD43B] font-mono">{speed.toFixed(2)}x</span>
                </div>
                <input
                  type="range"
                  min="0.75"
                  max="1.5"
                  step="0.05"
                  value={speed}
                  onChange={(e) => setSpeed(parseFloat(e.target.value))}
                  className="w-full accent-[#FFD43B]"
                />
              </div>

              {/* Emotion Selector */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#737373] block">Emotional Cadence</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['neutral', 'enthusiastic', 'serious', 'calm'] as const).map((em) => (
                    <button
                      key={em}
                      onClick={() => setEmotion(em)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold capitalize transition border ${
                        emotion === em
                          ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-[#FFD43B]'
                          : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-[#141418] text-[#737373]'
                      }`}
                    >
                      {em}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Script Input & Player Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#18181C] p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3">
                <h3 className="text-sm font-bold text-[#202124] dark:text-white">Narration Script</h3>
                <span className="text-[10px] text-[#737373] font-mono">
                  {ttsText.trim().split(/\s+/).filter(Boolean).length} words
                </span>
              </div>

              <textarea
                rows={5}
                value={ttsText}
                onChange={(e) => setTtsText(e.target.value)}
                placeholder="Type or paste narration script..."
                className="w-full p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#141418] border border-[#EAE7E1] dark:border-white/[0.08] text-xs text-[#202124] dark:text-white leading-relaxed focus:outline-hidden"
              />

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/5 text-[#737373] uppercase">
                    Language: {selectedVoice.language.toUpperCase()}
                  </span>
                </div>

                <button
                  onClick={handleSynthesize}
                  disabled={isSynthesizing || !ttsText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold transition shadow-xs disabled:opacity-60"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isSynthesizing ? 'Synthesizing Audio...' : 'Generate Studio Voice'}</span>
                </button>
              </div>

              {/* Synthesized Output Preview */}
              {synthesizedAudioUrl && (
                <div className="mt-4 p-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Audio Synthesized Successfully</span>
                    </span>
                    <button
                      onClick={() => onTabChange && onTabChange('editor')}
                      className="text-xs font-bold text-[#FFD43B] hover:underline flex items-center gap-1"
                    >
                      <span>Send to Video Editor</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="p-3 rounded-xl bg-black/5 dark:bg-[#141418] flex items-center justify-between">
                    <span className="text-xs font-bold text-[#202124] dark:text-white">
                      Voice: {selectedVoice.name}
                    </span>
                    <span className="text-[10px] text-[#737373] font-mono">
                      {wordTimings.length} word timestamps generated for kinetic subtitles
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: AUTOMATED VIDEO DUBBING */}
      {activeMode === 'dubbing' && (
        <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#18181C] p-6 shadow-2xs space-y-6">
          <div className="border-b border-[#EAE7E1] dark:border-white/[0.08] pb-4">
            <h3 className="text-sm font-bold text-[#202124] dark:text-white">
              Multi-Language Video Dubbing Studio
            </h3>
            <p className="text-xs text-[#737373] mt-0.5">
              Automated end-to-end pipeline: speech extraction, Whisper transcription, translation, voice synthesis, and audio remuxing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#737373] block">Target Dubbing Language</label>
              <select
                value={dubbingTargetLang}
                onChange={(e) => setDubbingTargetLang(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#141418] border border-black/10 dark:border-white/10 text-xs font-bold text-[#202124] dark:text-white focus:outline-hidden"
              >
                <option value="bn">Bengali (বাংলা)</option>
                <option value="hi">Hindi (हिन्दी)</option>
                <option value="en">English (US)</option>
                <option value="es">Spanish (Español)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#737373] block">Background Music (BGM)</label>
              <button
                onClick={() => setPreserveBgm(!preserveBgm)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-bold transition text-left ${
                  preserveBgm
                    ? 'border-[#FFD43B] bg-[#FFD43B]/10 text-[#FFD43B]'
                    : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-[#141418] text-[#737373]'
                }`}
              >
                {preserveBgm ? '✓ Preserve & Duck Background Music' : 'Mute Original Audio Completely'}
              </button>
            </div>

            <div className="space-y-1.5 flex flex-col justify-end">
              <button
                onClick={handleDubbing}
                disabled={isDubbing}
                className="w-full py-2.5 px-4 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold transition shadow-xs disabled:opacity-60 flex items-center justify-center gap-1.5"
              >
                <Languages className="w-4 h-4" />
                <span>{isDubbing ? 'Dubbing Video...' : 'Start Multi-Track Dubbing'}</span>
              </button>
            </div>
          </div>

          {dubbedResult && (
            <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Video Successfully Dubbed to {dubbingTargetLang.toUpperCase()}</span>
                </span>
                <span className="text-[10px] font-mono text-[#737373]">
                  Duration: {dubbedResult.durationSeconds}s
                </span>
              </div>

              {/* Translated Transcript Preview */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#737373] uppercase tracking-wider block">
                  Translated Transcript &amp; Dialogue Sync:
                </span>
                {dubbedResult.translatedTranscript?.map((t: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-black/5 dark:bg-[#141418] text-xs space-y-1">
                    <div className="flex justify-between text-[10px] text-[#737373]">
                      <span className="font-bold">{t.speaker}</span>
                      <span>{t.startSec}s - {t.endSec}s</span>
                    </div>
                    <p className="text-[#737373] text-[11px] line-through">{t.originalText}</p>
                    <p className="font-bold text-[#202124] dark:text-white">{t.translatedText}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: VOICE CLONING VAULT (STRICT CONSENT GUARD) */}
      {activeMode === 'cloning' && (
        <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#18181C] p-6 shadow-2xs space-y-5">
          <div className="border-b border-[#EAE7E1] dark:border-white/[0.08] pb-4">
            <h3 className="text-sm font-bold text-[#202124] dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Voice Cloning &amp; Authorization Vault</span>
            </h3>
            <p className="text-xs text-[#737373] mt-0.5">
              Strict ethical voice synthesis guard. Requires explicit authorization to prevent deceptive impersonation.
            </p>
          </div>

          <div className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#737373] block">Voice Profile Name</label>
              <input
                type="text"
                placeholder="e.g. My Custom Creator Voice"
                value={cloneName}
                onChange={(e) => setCloneName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/5 dark:bg-[#141418] border border-black/10 dark:border-white/10 text-xs text-[#202124] dark:text-white focus:outline-hidden"
              />
            </div>

            <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-500/90 leading-relaxed">
                  <strong>Mandatory Ownership Declaration:</strong> By cloning a voice in RIIQX, you certify under penalty of account revocation that you hold full legal rights to the audio sample. Tamper-evident cryptographic logs are recorded.
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={hasConsent}
                  onChange={(e) => setHasConsent(e.target.checked)}
                  className="rounded-sm accent-[#FFD43B]"
                />
                <span className="text-xs font-bold text-[#202124] dark:text-white">
                  I confirm explicit consent and ownership of this voice.
                </span>
              </label>
            </div>

            <button
              disabled={!hasConsent || !cloneName.trim()}
              onClick={() => setCloneStatus('Voice profile initialized and bound to cryptographic user consent log.')}
              className="py-2.5 px-4 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold transition shadow-xs disabled:opacity-50"
            >
              Verify &amp; Create Voice Profile
            </button>

            {cloneStatus && (
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>{cloneStatus}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
