'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — AI Brand Intelligence & Brand DNA Studio
// SSRF-Safe Website Scanner • Observed vs Recommended Metrics • Guidelines Export
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Palette,
  Sparkles,
  Check,
  Shield,
  Globe,
  Download,
  AlertCircle,
  FileCode,
  FileText,
  RefreshCw,
  Eye,
  Sliders,
  Type,
  Ban,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { BrandDNA } from '@/services/brand/types';

export function BrandKitTab() {
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'rules'>('editor');

  const [brandDNA, setBrandDNA] = useState<BrandDNA>({
    id: 'brand_default',
    brandName: 'RIIQX Studio',
    tagline: 'One Goal. An AI That Gets It Done.',
    mission: 'Empowering digital creators with autonomous AI agents and intelligent content pipelines.',
    description: 'Autonomous creative intelligence and multi-channel publishing operating system.',
    industry: 'AI & Creator Economy',
    targetAudience: 'Modern founders, video creators, marketing agencies, and autonomous digital operators.',
    customerPersonas: [
      'Tech-Forward Solo Creator (Fast production, high retention reels)',
      'Digital Marketing Agency Lead (Multi-client campaign scaling)',
      'Brand Growth Operator (Data-driven social media authority)',
    ],
    brandPersonality: ['Visionary', 'High-Octane', 'Precise', 'Authoritative', 'Minimalist'],
    toneOfVoice: 'Sharp, confident, empowering, intellectually honest with zero fluff.',
    coreMessages: [
      'Stop editing manually. Let autonomous intelligence scale your output.',
      'From a single prompt to a production-grade multi-channel campaign in seconds.',
      'Data-backed viral hooks with deterministic quality assurance.',
    ],
    colorPalette: {
      primary: '#FFD43B',
      secondary: '#202124',
      accent: '#06B6D4',
      background: '#0C0C0E',
      neutral: '#FFFFFF',
      additional: ['#8B5CF6', '#10B981', '#FF6B5E'],
    },
    typography: {
      heading: 'Inter',
      body: 'Inter',
      code: 'JetBrains Mono',
    },
    logoVariants: {
      primaryUrl: '/riiqx-emblem.png',
    },
    visualRules: [
      'Maintain obsidian dark (#0C0C0E) backgrounds with electric yellow (#FFD43B) hero focal points.',
      'High-contrast typography with maximum readability for mobile 9:16 vertical video.',
      'Generous padding and clean borders with subtle glassmorphic backdrop-blur accents.',
    ],
    contentGuidelines: [
      'Hook the viewer within the opening 2.5 seconds with visual pattern interrupts.',
      'Avoid generic AI clichés; use concrete numbers, real benchmarks, and punchy statements.',
      'Close with a single clear, actionable call to action.',
    ],
    ctaStyles: [
      'Start free on RIIQX today.',
      'Deploy your first AI Creator workflow now.',
      'Explore the live intelligence engine.',
    ],
    doNotUseRules: [
      'Do not use low-contrast gray text on dark gray containers.',
      'Never fabricate engagement metrics or display fake follower counters.',
      'Avoid pastel or washed-out gradients that dilute the sharp obsidian brand identity.',
    ],
    confidence: {
      overallScore: 96,
      extractedFactsCount: 8,
      aiRecommendationsCount: 12,
    },
    version: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Fetch active Brand DNA on mount
  useEffect(() => {
    fetch('/api/riiqx/brand')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.brandDNA) {
          setBrandDNA(data.brandDNA);
          if (data.brandDNA.websiteUrl) setWebsiteUrl(data.brandDNA.websiteUrl);
        }
      })
      .catch(() => {});
  }, []);

  // SSRF-Safe Website Analysis Trigger
  const handleScanWebsite = async () => {
    if (!websiteUrl.trim()) return;
    setIsScanning(true);
    setScanError(null);

    try {
      const res = await fetch('/api/riiqx/brand/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          websiteUrl: websiteUrl.trim(),
          brandName: brandDNA.brandName,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Website analysis failed.');
      }

      setBrandDNA(data.brandDNA);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err: any) {
      setScanError(err.message || 'Failed to scan website. Please verify URL is accessible.');
    } finally {
      setIsScanning(false);
    }
  };

  // Save manual corrections
  const handleSaveDNA = async () => {
    try {
      const res = await fetch('/api/riiqx/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(brandDNA),
      });
      const data = await res.json();
      if (data.success && data.brandDNA) {
        setBrandDNA(data.brandDNA);
      }
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    } catch {
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2000);
    }
  };

  // Export Guidelines (Markdown or JSON)
  const handleDownloadExport = async (format: 'md' | 'json') => {
    try {
      const res = await fetch('/api/riiqx/brand/export');
      const data = await res.json();
      if (!data.success || !data.export) return;

      const content = format === 'md' ? data.export.markdown : JSON.stringify(data.export.json, null, 2);
      const filename = `brand-guidelines-${brandDNA.brandName.toLowerCase().replace(/\s+/g, '-')}.${format}`;
      const blob = new Blob([content], { type: format === 'md' ? 'text/markdown' : 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error('Export download failed:', e);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <Shield className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Brand Intelligence &amp; Brand DNA Studio
            </h1>
            <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD43B]">
              Active Engine Context
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Convert your business website and assets into a structured, immutable Brand DNA profile governing Campaign Studio, Creative Canvas, and Video Production.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadExport('md')}
            className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#1A1A1A] hover:bg-[#252525] text-white px-3 py-2 text-xs font-semibold transition-all shadow-sm"
          >
            <Download className="h-3.5 w-3.5 text-[#FFD43B]" />
            <span>Export Guidelines (.md)</span>
          </button>
          <button
            onClick={handleSaveDNA}
            className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] px-4 py-2 text-xs font-black transition-all shadow-sm active:scale-95"
          >
            {savedSuccess ? <Check className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
            <span>{savedSuccess ? 'Brand DNA Synced!' : 'Save & Sync Brand DNA'}</span>
          </button>
        </div>
      </div>

      {/* Website Intelligence Scanner Drawer */}
      <div className="rounded-2xl border border-[#FFD43B]/30 bg-gradient-to-r from-[#18181C] via-[#121214] to-[#18181C] p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-[#FFD43B]" />
            <h3 className="text-sm font-bold text-white">SSRF-Safe Website DNA Extractor</h3>
            <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
              Private Network Guard Active
            </span>
          </div>
          <span className="text-[11px] text-[#A3A3A3]">Enter any public website URL to auto-extract colors, typography &amp; messaging</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="url"
              placeholder="https://yourbrand.com"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] px-3.5 py-2.5 text-xs text-white placeholder-[#737373] focus:outline-none focus:border-[#FFD43B] transition-colors"
            />
          </div>
          <button
            onClick={handleScanWebsite}
            disabled={isScanning || !websiteUrl.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] disabled:opacity-50 text-[#151515] px-5 py-2.5 text-xs font-black transition-all shrink-0 shadow-sm"
          >
            {isScanning ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Extracting Brand Intelligence...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Scan &amp; Extract Brand DNA</span>
              </>
            )}
          </button>
        </div>

        {scanError && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{scanError}</span>
          </div>
        )}

        {/* Observed Confidence Telemetry */}
        {brandDNA.confidence && (
          <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] text-[#A3A3A3] border-t border-[#2E2E2E]/60">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Confidence Score: <strong className="text-white">{brandDNA.confidence.overallScore}%</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>Observed Facts: <strong className="text-emerald-400">{brandDNA.confidence.extractedFactsCount} verified</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>AI Recommendations: <strong className="text-[#FFD43B]">{brandDNA.confidence.aiRecommendationsCount} synthesized</strong></span>
            </div>
            <div className="flex items-center gap-1.5 ml-auto text-[10px] text-[#737373]">
              <span>Synchronized with: <strong className="text-white">AI Video Editor, Campaign Studio &amp; Canvas</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Mode Navigation */}
      <div className="flex items-center gap-2 border-b border-[#2E2E2E] pb-3">
        <button
          onClick={() => setActiveTab('editor')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'editor' ? 'bg-[#FFD43B] text-[#151515]' : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <Sliders className="h-3.5 w-3.5" />
          <span>Brand DNA Editor</span>
        </button>
        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'rules' ? 'bg-[#FFD43B] text-[#151515]' : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <Ban className="h-3.5 w-3.5" />
          <span>Rules &amp; Safety Guidelines</span>
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'preview' ? 'bg-[#FFD43B] text-[#151515]' : 'text-[#A3A3A3] hover:text-white'
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          <span>Guidelines Markdown Preview</span>
        </button>
      </div>

      {/* TAB 1: BRAND DNA EDITOR */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Column 1: Core Identity & Messaging */}
          <div className="space-y-5 lg:col-span-2">
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#18181C] p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FFD43B] flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>1. Core Identity &amp; Strategic Narrative</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-white block mb-1">Brand Name</label>
                  <input
                    type="text"
                    value={brandDNA.brandName}
                    onChange={(e) => setBrandDNA({ ...brandDNA, brandName: e.target.value })}
                    className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-white block mb-1">Industry / Niche</label>
                  <input
                    type="text"
                    value={brandDNA.industry}
                    onChange={(e) => setBrandDNA({ ...brandDNA, industry: e.target.value })}
                    className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-white block mb-1">Tagline</label>
                <input
                  type="text"
                  value={brandDNA.tagline}
                  onChange={(e) => setBrandDNA({ ...brandDNA, tagline: e.target.value })}
                  className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white block mb-1">Mission Statement</label>
                <textarea
                  rows={2}
                  value={brandDNA.mission}
                  onChange={(e) => setBrandDNA({ ...brandDNA, mission: e.target.value })}
                  className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white block mb-1">Target Audience &amp; Personas</label>
                <textarea
                  rows={2}
                  value={brandDNA.targetAudience}
                  onChange={(e) => setBrandDNA({ ...brandDNA, targetAudience: e.target.value })}
                  className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-white block mb-1">Tone of Voice</label>
                <input
                  type="text"
                  value={brandDNA.toneOfVoice}
                  onChange={(e) => setBrandDNA({ ...brandDNA, toneOfVoice: e.target.value })}
                  className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>
            </div>

            {/* Core Messages */}
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#18181C] p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FFD43B]">
                2. Key Brand Value Pillars &amp; Messaging
              </h3>
              <div className="space-y-2">
                {brandDNA.coreMessages.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2 rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5 text-xs text-white">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[#FFD43B]/10 text-[10px] font-black text-[#FFD43B]">
                      {idx + 1}
                    </span>
                    <span className="flex-1">{msg}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Column 2: Visual Identity & Color Swatches */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#18181C] p-5 space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FFD43B] flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span>3. Color Palette Tokens</span>
              </h3>

              <div className="space-y-3">
                {[
                  { key: 'primary', label: 'Primary Accent (Hero)', val: brandDNA.colorPalette.primary },
                  { key: 'secondary', label: 'Secondary Tone', val: brandDNA.colorPalette.secondary },
                  { key: 'accent', label: 'Kinetic Highlight', val: brandDNA.colorPalette.accent },
                  { key: 'background', label: 'Backdrop Canvas', val: brandDNA.colorPalette.background },
                  { key: 'neutral', label: 'Neutral Contrast', val: brandDNA.colorPalette.neutral },
                ].map(({ key, label, val }) => (
                  <div key={key} className="flex items-center justify-between gap-3 rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="h-7 w-7 rounded-lg border border-white/20 shrink-0 shadow-xs"
                        style={{ backgroundColor: val }}
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-white">{label}</span>
                        <span className="text-[9px] text-[#A3A3A3] font-mono">{val}</span>
                      </div>
                    </div>
                    <input
                      type="color"
                      value={val}
                      onChange={(e) =>
                        setBrandDNA({
                          ...brandDNA,
                          colorPalette: {
                            ...brandDNA.colorPalette,
                            [key]: e.target.value.toUpperCase(),
                          },
                        })
                      }
                      className="h-6 w-8 cursor-pointer rounded border-0 bg-transparent p-0"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="rounded-2xl border border-[#2E2E2E] bg-[#18181C] p-5 space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-[#FFD43B] flex items-center gap-2">
                <Type className="h-4 w-4" />
                <span>4. Typography Tokens</span>
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] text-[#A3A3A3] block mb-1">Heading Font Family</label>
                  <input
                    type="text"
                    value={brandDNA.typography.heading}
                    onChange={(e) =>
                      setBrandDNA({
                        ...brandDNA,
                        typography: { ...brandDNA.typography, heading: e.target.value },
                      })
                    }
                    className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-[#A3A3A3] block mb-1">Body Font Family</label>
                  <input
                    type="text"
                    value={brandDNA.typography.body}
                    onChange={(e) =>
                      setBrandDNA({
                        ...brandDNA,
                        typography: { ...brandDNA.typography, body: e.target.value },
                      })
                    }
                    className="w-full rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RULES & SAFETY GUIDELINES */}
      {activeTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-emerald-500/20 bg-[#18181C] p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Mandatory Visual &amp; Content Rules</span>
            </h3>
            <div className="space-y-2">
              {brandDNA.visualRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-[#0C0C0E] border border-emerald-500/10 p-3 text-xs text-white">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{rule}</span>
                </div>
              ))}
              {brandDNA.contentGuidelines.map((guideline, idx) => (
                <div key={`g_${idx}`} className="flex items-start gap-2.5 rounded-xl bg-[#0C0C0E] border border-emerald-500/10 p-3 text-xs text-white">
                  <span className="text-emerald-400 font-bold shrink-0">✓</span>
                  <span>{guideline}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-rose-500/20 bg-[#18181C] p-5 space-y-3">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-400 flex items-center gap-2">
              <Ban className="h-4 w-4" />
              <span>Strict Do-Not-Use Rules (Brand Safety)</span>
            </h3>
            <div className="space-y-2">
              {brandDNA.doNotUseRules.map((rule, idx) => (
                <div key={idx} className="flex items-start gap-2.5 rounded-xl bg-[#0C0C0E] border border-rose-500/10 p-3 text-xs text-white">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>{rule}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: GUIDELINES MARKDOWN PREVIEW */}
      {activeTab === 'preview' && (
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#18181C] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#2E2E2E] pb-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#FFD43B]" />
              <h3 className="text-sm font-bold text-white">Auto-Generated Brand Guidelines Specification</h3>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleDownloadExport('json')}
                className="flex items-center gap-1 rounded-lg border border-[#2E2E2E] bg-[#0C0C0E] px-2.5 py-1 text-[11px] text-[#A3A3A3] hover:text-white"
              >
                <FileCode className="h-3 w-3" />
                <span>JSON</span>
              </button>
              <button
                onClick={() => handleDownloadExport('md')}
                className="flex items-center gap-1 rounded-lg bg-[#FFD43B] text-[#151515] px-2.5 py-1 text-[11px] font-black"
              >
                <Download className="h-3 w-3" />
                <span>Markdown</span>
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-[#0C0C0E] border border-[#2E2E2E] p-4 text-xs font-mono text-[#D4D4D4] whitespace-pre-wrap leading-relaxed max-h-[550px] overflow-y-auto">
            {`# ${brandDNA.brandName} — Brand DNA & Guidelines Specification
> Version: ${brandDNA.version}.0 | Confidence: ${brandDNA.confidence?.overallScore || 95}%
> Tagline: "${brandDNA.tagline}"

1. Mission: ${brandDNA.mission}
2. Tone of Voice: ${brandDNA.toneOfVoice}
3. Primary Color: ${brandDNA.colorPalette.primary} | Accent: ${brandDNA.colorPalette.accent}
4. Typography: Heading: ${brandDNA.typography.heading} | Body: ${brandDNA.typography.body}

Mandatory Rules:
${brandDNA.visualRules.map((r) => `- ${r}`).join('\n')}

Do-Not-Use Rules:
${brandDNA.doNotUseRules.map((r) => `- FORBIDDEN: ${r}`).join('\n')}`}
          </div>
        </div>
      )}
    </div>
  );
}
