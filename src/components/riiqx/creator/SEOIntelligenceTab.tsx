'use client';

// =============================================================================
// RIIQX — SEO Intelligence & Search Intent Studio
// Open-Source Repo C (OpenSEO) Integration Architecture
// Keyword Research • Search Volume • Query Clusters • Technical Audit • AI Visibility
// =============================================================================

import React, { useState } from 'react';
import {
  Search,
  TrendingUp,
  Globe,
  Sliders,
  Sparkles,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Plus,
  ArrowRight,
  ShieldAlert,
  Zap,
  BarChart,
  HelpCircle,
  Hash,
} from 'lucide-react';
import { CreatorProject, CreatorStudioTab } from '@/lib/riiqx/creator-types';

interface SEOIntelligenceTabProps {
  project: CreatorProject | null;
  onUpdateProject?: (p: CreatorProject) => void;
  onTabChange?: (tab: CreatorStudioTab) => void;
  onNewProjectFromKeyword?: (keyword: string) => void;
}

interface KeywordItem {
  keyword: string;
  searchVolume: number;
  keywordDifficulty: number;
  cpcUsd: number;
  competitionLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  intent: 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
  relatedQuestions: string[];
}

interface AuditResult {
  url: string;
  domain: string;
  overallScore: number;
  performanceScore: number;
  title: string;
  metaDescription: string;
  hasCanonicalTag: boolean;
  headingsCount: { h1: number; h2: number; h3: number };
  isIndexable: boolean;
  brokenLinksFound: number;
  aiSearchVisibilityScore: number;
  criticalIssues: string[];
  recommendations: Array<{
    category: 'technical' | 'content' | 'performance' | 'ai_sge';
    severity: 'high' | 'medium' | 'low';
    message: string;
  }>;
}

export function SEOIntelligenceTab({
  project,
  onUpdateProject,
  onTabChange,
  onNewProjectFromKeyword,
}: SEOIntelligenceTabProps) {
  const [activeMode, setActiveMode] = useState<'keywords' | 'audit'>('keywords');

  // Keyword State
  const [keywordQuery, setKeywordQuery] = useState(
    project?.brief?.topic || 'ai video generator'
  );
  const [countryCode, setCountryCode] = useState('US');
  const [isSearchingKeywords, setIsSearchingKeywords] = useState(false);
  const [keywordResults, setKeywordResults] = useState<KeywordItem[]>([]);
  const [keywordError, setKeywordError] = useState<string | null>(null);

  // Audit State
  const [auditUrl, setAuditUrl] = useState('https://riiqx.vercel.app');
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [auditError, setAuditError] = useState<string | null>(null);

  // Run Keyword Search
  const handleKeywordSearch = async () => {
    if (!keywordQuery.trim()) return;
    setIsSearchingKeywords(true);
    setKeywordError(null);

    try {
      const res = await fetch('/api/riiqx/capabilities/seo.keyword_research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'openseo',
          payload: {
            keyword: keywordQuery.trim(),
            countryCode,
          },
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.result)) {
        setKeywordResults(data.result);
      } else {
        setKeywordError(data.errorMessage || 'Failed to fetch keyword intelligence.');
      }
    } catch (err: any) {
      setKeywordError(err.message || 'Network error querying OpenSEO gateway.');
    } finally {
      setIsSearchingKeywords(false);
    }
  };

  // Run Technical SEO Audit
  const handleRunAudit = async () => {
    if (!auditUrl.trim()) return;
    setIsAuditing(true);
    setAuditError(null);

    try {
      const res = await fetch('/api/riiqx/capabilities/seo.audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: 'openseo',
          payload: {
            targetUrl: auditUrl.trim(),
            checkAiVisibility: true,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        setAuditResult(data.result);
      } else {
        setAuditError(data.errorMessage || 'Failed to audit specified URL.');
      }
    } catch (err: any) {
      setAuditError(err.message || 'Network error running technical audit.');
    } finally {
      setIsAuditing(false);
    }
  };

  // Convert keyword to project
  const handleSelectKeywordForProject = (kw: string) => {
    if (onNewProjectFromKeyword) {
      onNewProjectFromKeyword(kw);
    } else if (onUpdateProject && project) {
      const updated: CreatorProject = {
        ...project,
        name: kw,
        brief: {
          ...project.brief,
          topic: kw,
        },
      };
      onUpdateProject(updated);
      if (onTabChange) onTabChange('script');
    }
  };

  const getDifficultyBadge = (kd: number) => {
    if (kd < 30) return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    if (kd < 60) return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    return 'bg-red-500/10 text-red-400 border-red-500/20';
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#222226] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/30">
              <Search className="h-5 w-5" />
            </span>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                SEO Intelligence & Search Intent Studio
                <span className="rounded-full bg-[#FFD43B]/10 px-2.5 py-0.5 text-xs font-semibold text-[#FFD43B] border border-[#FFD43B]/20">
                  Open-Source Repo C (OpenSEO)
                </span>
              </h1>
              <p className="text-sm text-neutral-400">
                DataForSEO keyword search volume, difficulty clustering, competitor insights & AI Search (SGE) audits.
              </p>
            </div>
          </div>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 rounded-xl bg-[#141418] p-1 border border-[#222226]">
          <button
            onClick={() => setActiveMode('keywords')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeMode === 'keywords'
                ? 'bg-[#FFD43B] text-black shadow-lg font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Search className="h-4 w-4" />
            Keyword Intelligence
          </button>
          <button
            onClick={() => setActiveMode('audit')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              activeMode === 'audit'
                ? 'bg-[#FFD43B] text-black shadow-lg font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Globe className="h-4 w-4" />
            Technical & AI Audit
          </button>
        </div>
      </div>

      {/* Mode 1: Keyword Intelligence */}
      {activeMode === 'keywords' && (
        <div className="mt-8 space-y-6">
          {/* Query Bar */}
          <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={keywordQuery}
                  onChange={(e) => setKeywordQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleKeywordSearch()}
                  placeholder="Enter keyword, niche topic, or competitor query..."
                  className="w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                />
              </div>

              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="rounded-xl border border-[#2B2B30] bg-[#0C0C0E] px-4 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
              >
                <option value="US">United States (US)</option>
                <option value="IN">India (IN)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
              </select>

              <button
                onClick={handleKeywordSearch}
                disabled={isSearchingKeywords || !keywordQuery.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] px-6 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-[#FFE066] transition-all disabled:opacity-50"
              >
                {isSearchingKeywords ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Analyze Search Volume
                  </>
                )}
              </button>
            </div>

            {keywordError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{keywordError}</span>
              </div>
            )}
          </div>

          {/* Results Grid */}
          {keywordResults.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-white">
                  Identified Keyword Clusters & Intent ({keywordResults.length})
                </h3>
                <span className="text-xs text-neutral-400">
                  Data sourced via OpenSEO DataForSEO & SERP Engine
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {keywordResults.map((kw, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col justify-between rounded-2xl border border-[#222226] bg-[#141418] p-5 shadow-lg transition-all hover:border-[#FFD43B]/40"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-base font-bold text-white capitalize">{kw.keyword}</h4>
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold border ${getDifficultyBadge(
                            kw.keywordDifficulty
                          )}`}
                        >
                          KD {kw.keywordDifficulty}%
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="rounded-xl bg-[#0C0C0E] p-2.5 border border-[#222226]">
                          <span className="text-neutral-500 block text-[10px]">Monthly Searches</span>
                          <span className="text-base font-bold text-white font-mono">
                            {kw.searchVolume.toLocaleString()}
                          </span>
                        </div>
                        <div className="rounded-xl bg-[#0C0C0E] p-2.5 border border-[#222226]">
                          <span className="text-neutral-500 block text-[10px]">Est. CPC</span>
                          <span className="text-base font-bold text-[#FFD43B] font-mono">
                            ${kw.cpcUsd.toFixed(2)}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-medium text-neutral-300">
                          Intent: {kw.intent}
                        </span>
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-[11px] font-medium text-neutral-300">
                          Comp: {kw.competitionLevel}
                        </span>
                      </div>

                      {kw.relatedQuestions.length > 0 && (
                        <div className="space-y-1.5 pt-2">
                          <span className="text-[11px] font-semibold text-neutral-400 block">
                            People Also Ask (Video Hooks):
                          </span>
                          {kw.relatedQuestions.map((q, qi) => (
                            <div
                              key={qi}
                              className="text-xs text-neutral-300 flex items-start gap-1.5 bg-[#0C0C0E] p-2 rounded-lg border border-[#222226]"
                            >
                              <HelpCircle className="h-3 w-3 text-[#FFD43B] shrink-0 mt-0.5" />
                              <span className="line-clamp-2">{q}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 mt-4 border-t border-[#222226]">
                      <button
                        onClick={() => handleSelectKeywordForProject(kw.keyword)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#FFD43B] px-3.5 py-2 text-xs font-bold text-black hover:bg-[#FFE066] transition-all"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Create Video Project From Keyword
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Technical & AI Audit */}
      {activeMode === 'audit' && (
        <div className="mt-8 space-y-6">
          {/* Audit URL Input */}
          <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={auditUrl}
                  onChange={(e) => setAuditUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRunAudit()}
                  placeholder="https://yourbrand.com or https://riiqx.vercel.app"
                  className="w-full rounded-xl border border-[#2B2B30] bg-[#0C0C0E] pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#FFD43B] focus:outline-none"
                />
              </div>

              <button
                onClick={handleRunAudit}
                disabled={isAuditing || !auditUrl.trim()}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] px-6 py-2.5 text-sm font-bold text-black shadow-lg hover:bg-[#FFE066] transition-all disabled:opacity-50"
              >
                {isAuditing ? (
                  <>
                    <RotateCcw className="h-4 w-4 animate-spin" />
                    Running Deep Audit...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Audit Technical & AI Readiness
                  </>
                )}
              </button>
            </div>

            {auditError && (
              <div className="mt-3 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{auditError}</span>
              </div>
            )}
          </div>

          {/* Audit Scorecards */}
          {auditResult && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="rounded-2xl border border-[#222226] bg-[#141418] p-5 shadow-xl text-center space-y-2">
                  <span className="text-xs font-semibold text-neutral-400">Technical SEO Score</span>
                  <div className="text-4xl font-extrabold text-emerald-400 font-mono">
                    {auditResult.overallScore}/100
                  </div>
                  <span className="inline-block rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400 border border-emerald-500/20">
                    Excellent Indexability
                  </span>
                </div>

                <div className="rounded-2xl border border-[#222226] bg-[#141418] p-5 shadow-xl text-center space-y-2">
                  <span className="text-xs font-semibold text-neutral-400">Speed & Web Vitals</span>
                  <div className="text-4xl font-extrabold text-[#FFD43B] font-mono">
                    {auditResult.performanceScore}/100
                  </div>
                  <span className="inline-block rounded-full bg-[#FFD43B]/10 px-2 py-0.5 text-xs text-[#FFD43B] border border-[#FFD43B]/20">
                    High Performance
                  </span>
                </div>

                <div className="rounded-2xl border border-[#222226] bg-[#141418] p-5 shadow-xl text-center space-y-2">
                  <span className="text-xs font-semibold text-neutral-400">AI Search Visibility (SGE)</span>
                  <div className="text-4xl font-extrabold text-purple-400 font-mono">
                    {auditResult.aiSearchVisibilityScore}/100
                  </div>
                  <span className="inline-block rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400 border border-purple-500/20">
                    Perplexity & ChatGPT Ready
                  </span>
                </div>
              </div>

              {/* Recommendations */}
              <div className="rounded-2xl border border-[#222226] bg-[#141418] p-6 shadow-xl space-y-4">
                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-[#FFD43B]" />
                  OpenSEO Actionable Recommendations ({auditResult.recommendations.length})
                </h4>

                <div className="space-y-3">
                  {auditResult.recommendations.map((rec, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-[#222226] bg-[#0C0C0E] p-4"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-white capitalize">
                            Category: {rec.category.replace('_', ' ')}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              rec.severity === 'high'
                                ? 'bg-red-500/10 text-red-400'
                                : 'bg-amber-500/10 text-amber-400'
                            }`}
                          >
                            {rec.severity} priority
                          </span>
                        </div>
                        <p className="text-xs text-neutral-300">{rec.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

