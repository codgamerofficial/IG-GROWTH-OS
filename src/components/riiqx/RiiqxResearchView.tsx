'use client';

// =============================================================================
// RIIQX — Deep Research & Verified Citations Workspace
// iOS-Inspired Design System • Trending Yellow (#FFD43B) & Red/Coral (#FF4D4F)
// Multi-Engine Privacy-Preserving Search • Verifiable Source Citations
// =============================================================================

import React, { useState } from 'react';
import { Search, Globe, ExternalLink, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { executeLiveResearch, SearchQueryResult } from '@/lib/riiqx/search';

export function RiiqxResearchView() {
  const [query, setQuery] = useState('AWS Bedrock Runtime architecture ap-southeast-2');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchQueryResult | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    const data = await executeLiveResearch(query);
    setResult(data);
    setLoading(false);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#151515] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <Search className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">
                Deep Research &amp; Citations
              </h1>
            </div>
            <p className="mt-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
              Multi-Engine Privacy-Preserving Search • Verifiable Source Citations • Factual Validation
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-[#16865D]/10 border border-[#16865D]/30 px-3 py-1 text-xs font-bold text-[#16865D]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Zero Fabrication</span>
          </div>
        </div>

        {/* Search Input Card */}
        <form
          onSubmit={handleSearch}
          className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-4 sm:p-5 shadow-2xs space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-[#737373] dark:text-[#A3A3A3]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter technical query or research topic..."
                className="w-full rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] py-2.5 pl-10 pr-3 text-xs sm:text-sm text-[#202124] dark:text-white placeholder-[#737373] dark:placeholder-[#A3A3A3] focus:border-[#FFD43B] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] px-5 py-2.5 text-xs font-bold text-[#202124] shadow-xs transition disabled:opacity-50"
            >
              <Search className="h-3.5 w-3.5" />
              <span>{loading ? 'Searching...' : 'Execute Research'}</span>
            </button>
          </div>
        </form>

        {/* Citations List */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#737373] dark:text-[#A3A3A3]">
              <span>Verified Sources ({result.citations.length})</span>
              <span className="font-mono text-[10px]">Executed: {new Date(result.executedAt).toLocaleTimeString()}</span>
            </div>

            <div className="grid grid-cols-1 gap-3.5">
              {result.citations.map((c, i) => (
                <div
                  key={c.id}
                  className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-5 space-y-2.5 hover:border-[#FFD43B] shadow-2xs transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] font-mono text-[10px] font-bold border border-[#FFD43B]/40">
                        {i + 1}
                      </span>
                      <h4 className="text-sm font-bold text-[#202124] dark:text-white">{c.title}</h4>
                    </div>
                    <span className="rounded-full bg-[#16865D]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#16865D] border border-[#16865D]/30 shrink-0">
                      {(c.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] leading-relaxed">{c.snippet}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="font-mono text-[10px] text-[#737373] dark:text-[#A3A3A3]">{c.domain}</span>
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
      </div>
    </div>
  );
}
