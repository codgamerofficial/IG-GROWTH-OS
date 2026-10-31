'use client';

// =============================================================================
// RIIQX — Deep Research & Verified Citations Workspace
// Liquid Intelligence Design System • Honest Empty States • Factual Evidence
// =============================================================================

import React, { useState } from 'react';
import {
  Search,
  Globe,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Sparkles,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import { executeLiveResearch, SearchQueryResult } from '@/lib/riiqx/search';

export function RiiqxResearchView() {
  const [query, setQuery] = useState('AWS Bedrock Runtime architecture ap-southeast-2');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchQueryResult | null>(null);

  const suggestedQueries = [
    'AWS Bedrock Claude 3.7 Latency in ap-southeast-2',
    'Meta Graph API v26.0 Reels Publishing Specs',
    'YouTube Shorts 2026 Audience Retention Benchmarks',
    'High-retention 3-second pattern interrupts in short-form video',
  ];

  const handleSearch = async (targetQuery?: string) => {
    const q = targetQuery || query;
    if (!q.trim()) return;
    setLoading(true);
    setQuery(q);
    try {
      const data = await executeLiveResearch(q);
      setResult(data);
    } catch {
      setResult({
        query: q,
        citations: [],
        formattedContext: 'Network or rate-limit exception during search execution.',
        executedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#0C0C0E] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <Search className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">
                Deep Research &amp; Citations
              </h1>
            </div>
            <p className="mt-1.5 text-xs text-[#737373] dark:text-[#A1A1AA]">
              Multi-Engine Privacy-Preserving Search • Verifiable Source Citations • Factual Validation
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 px-3 py-1 text-xs font-bold text-[#10B981]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Fact-Verified Citations</span>
          </div>
        </div>

        {/* Search Input Card */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="rounded-3xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md p-4 sm:p-5 shadow-sm space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-[#737373] dark:text-[#A1A1AA]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter technical query or research topic..."
                className="w-full rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#1C1C20] py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#202124] dark:text-white placeholder-[#737373] dark:placeholder-[#A1A1AA] focus:border-[#FFD43B] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] px-5 py-2.5 text-xs font-bold text-[#202124] shadow-xs transition disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <Search className="h-3.5 w-3.5" />
                  <span>Execute Research</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* State 1: Citations Found */}
        {result && result.citations && result.citations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#737373] dark:text-[#A1A1AA]">
              <span>Verified Sources ({result.citations.length})</span>
              <span className="font-mono text-[10px]">
                Executed: {new Date(result.executedAt).toLocaleTimeString()}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {result.citations.map((c, i) => (
                <div
                  key={c.id || i}
                  className="rounded-3xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md p-5 space-y-2.5 hover:border-[#FFD43B]/50 shadow-sm transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] font-mono text-[10px] font-bold border border-[#FFD43B]/40">
                        {i + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#202124] dark:text-white">{c.title}</h4>
                    </div>
                    <span className="rounded-full bg-[#10B981]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#10B981] border border-[#10B981]/30 shrink-0">
                      {(c.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-[#737373] dark:text-[#A1A1AA] leading-relaxed">
                    {c.snippet}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE7E1] dark:border-white/[0.08]">
                    <span className="font-mono text-[10px] text-[#737373] dark:text-[#A1A1AA]">
                      {c.domain}
                    </span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-[#FF6B5E] hover:underline"
                    >
                      <span>Verify Source</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State 2: Zero Sources Found (Honest Empty State as required by Part 12) */}
        {result && result.citations && result.citations.length === 0 && (
          <div className="rounded-3xl border border-[#F59E0B]/30 bg-[#F59E0B]/10 dark:bg-[#F59E0B]/5 p-6 text-center space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#F59E0B]/20 text-[#F59E0B] flex items-center justify-center mx-auto">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[#202124] dark:text-white">
              Search Completed — 0 Verified Sources Returned
            </h3>
            <p className="text-xs text-[#737373] dark:text-[#A1A1AA] max-w-md mx-auto leading-relaxed">
              No authenticated citations met the minimum 70% confidence threshold for this query. The query may be too specific or require external search credentials.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => handleSearch(suggestedQueries[0])}
                className="px-3.5 py-1.5 rounded-full bg-[#FFD43B] text-[#202124] text-xs font-bold shadow-xs hover:bg-[#FFC928] transition"
              >
                Try: AWS Bedrock Latency
              </button>
              <button
                onClick={() => handleSearch(suggestedQueries[1])}
                className="px-3.5 py-1.5 rounded-full border border-[#EAE7E1] dark:border-white/[0.1] bg-white/70 dark:bg-white/[0.05] text-xs font-semibold text-[#202124] dark:text-white transition"
              >
                Try: Meta Graph v26.0
              </button>
            </div>
          </div>
        )}

        {/* State 3: Initial Suggestions Grid */}
        {!result && !loading && (
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[#737373] dark:text-[#A1A1AA]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD43B]" />
              <span>Recommended Technical Topics</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedQueries.map((suggested, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSearch(suggested)}
                  className="rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-white/70 dark:bg-[#141418]/70 backdrop-blur-md p-4 text-left hover:border-[#FFD43B]/60 transition-all group shadow-2xs"
                >
                  <p className="text-xs font-semibold text-[#202124] dark:text-white group-hover:text-[#FF6B5E] transition-colors">
                    {suggested}
                  </p>
                  <span className="text-[10px] text-[#737373] dark:text-[#A1A1AA] mt-1 inline-block">
                    Click to execute verified research →
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
