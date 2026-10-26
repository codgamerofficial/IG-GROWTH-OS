'use client';

// =============================================================================
// RIIQX — Deep Research & Verified Citations Workspace
// SearXNG Multi-Engine Integration • Citation Footnotes • Zero Fabrication
// =============================================================================

import React, { useState } from 'react';
import { Search, Globe, ExternalLink, ShieldCheck, ArrowRight } from 'lucide-react';
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
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="border-b border-[#1E2A4A] pb-4">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Deep Research &amp; Citations</h1>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Multi-Engine Privacy-Preserving Search • Verifiable Source Citations • Factual Validation
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3.5 top-3 h-4 w-4 text-[#64748B]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter technical query or research topic..."
                className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] py-2.5 pl-10 pr-3 text-xs text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 hover:brightness-110 transition disabled:opacity-50"
            >
              <Search className="h-4 w-4" />
              <span>{loading ? 'Searching...' : 'Execute Research'}</span>
            </button>
          </div>
        </form>

        {/* Citations List */}
        {result && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span>Verified Sources ({result.citations.length})</span>
              <span className="font-mono text-[10px]">Executed: {new Date(result.executedAt).toLocaleTimeString()}</span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {result.citations.map((c, i) => (
                <div
                  key={c.id}
                  className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 space-y-2 hover:border-[#2D4170] transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 font-mono text-[10px] font-bold border border-cyan-500/20">
                        {i + 1}
                      </span>
                      <h4 className="text-xs font-bold text-white">{c.title}</h4>
                    </div>
                    <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                      {(c.confidenceScore * 100).toFixed(0)}% Confidence
                    </span>
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed">{c.snippet}</p>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-mono text-[10px] text-[#64748B]">{c.domain}</span>
                    <a
                      href={c.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[11px] font-semibold text-cyan-400 hover:underline"
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
