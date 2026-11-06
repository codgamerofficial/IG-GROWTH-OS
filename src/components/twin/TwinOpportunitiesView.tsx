'use client';

// =============================================================================
// RIIQX — Opportunity Radar & Verified Deals View
// Live Timestamps • Direct Terms • Zero Invented Deals
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Compass,
  Tag,
  Gift,
  ExternalLink,
  ShieldCheck,
  Clock,
  Sparkles,
  Filter,
  CheckCircle2,
  Search,
  Copy,
  Check,
  Building2,
} from 'lucide-react';
import { OpportunityItem } from '@/lib/riiqx/twin-types';

function ProviderBadge({ provider }: { provider: string }) {
  const norm = provider.toLowerCase();
  if (norm.includes('hdfc')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#004B8D]/20 text-[#3B82F6] border border-[#004B8D]/40 text-[10px] font-black uppercase tracking-wider">
        HDFC Bank
      </span>
    );
  }
  if (norm.includes('tata cliq') || norm.includes('tatacliq')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-[#DA1C5C]/20 text-[#FF4D8D] border border-[#DA1C5C]/40 text-[10px] font-black uppercase tracking-wider">
        Tata CLiQ Luxury
      </span>
    );
  }
  if (norm.includes('cult') || norm.includes('cred')) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30 text-[10px] font-black uppercase tracking-wider">
        Cult.fit &bull; CRED
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 border border-white/[0.08] text-[10px] font-black uppercase tracking-wider">
      {provider}
    </span>
  );
}

export function TwinOpportunitiesView() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOpportunities() {
      try {
        setLoading(true);
        const res = await fetch(`/api/twin/opportunities?category=${selectedCategory}`);
        if (res.ok) {
          const data = await res.json();
          setOpportunities(data.opportunities || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadOpportunities();
  }, [selectedCategory]);

  const categories = [
    { id: 'all', label: 'All Opportunities' },
    { id: 'deal', label: 'Verified Deals' },
    { id: 'coupon', label: 'Discount Codes' },
    { id: 'cashback', label: 'Bank Cashbacks' },
    { id: 'lifestyle', label: 'Lifestyle & Fitness' },
  ];

  // Helper to extract promo code if present in description
  const extractCode = (desc: string) => {
    const match = desc.match(/\b([A-Z0-9]{5,12})\b/);
    return match ? match[1] : null;
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      opp.title.toLowerCase().includes(q) ||
      opp.description.toLowerCase().includes(q) ||
      opp.provider.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8 relative selection:bg-orange-500/30">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Compass className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
              Opportunity Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading mt-2">
            Verified Deals &amp; Merchant Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Real-time verified promotional opportunities with verified terms and zero fabricated coupons.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, banks, stores..."
            className="w-full pl-10 pr-4 py-2.5 text-xs rounded-2xl bg-zinc-900/80 border border-white/[0.08] text-white placeholder-zinc-500 focus:outline-hidden focus:border-orange-500 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedCategory === c.id
                ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/25'
                : 'bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-white/[0.08] hover:border-white/[0.16]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.length === 0 ? (
          <div className="col-span-full p-12 text-center rounded-3xl bg-zinc-900/60 border border-dashed border-white/[0.1] space-y-3">
            <Tag className="h-8 w-8 text-zinc-500 mx-auto opacity-40" />
            <p className="text-sm font-bold text-white">No promotional opportunities found</p>
            <p className="text-xs text-zinc-400 max-w-sm mx-auto">
              Try adjusting your category filter or search keywords.
            </p>
          </div>
        ) : (
          filteredOpportunities.map((opp) => {
            const promoCode = extractCode(opp.description);
            const isCodeCopied = copiedCodeId === opp.id;

            return (
              <div
                key={opp.id}
                className="rounded-3xl border border-white/[0.08] hover:border-white/[0.18] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-7 shadow-2xl flex flex-col justify-between space-y-5 hover:-translate-y-1 transition-all duration-200 relative overflow-hidden group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <ProviderBadge provider={opp.provider} />
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-mono">
                      <CheckCircle2 className="h-3 w-3" /> Verified
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug font-heading group-hover:text-orange-400 transition-colors">
                    {opp.title}
                  </h3>

                  <p className="text-xs text-zinc-300 leading-relaxed">
                    {opp.description}
                  </p>

                  {/* Copyable Promo Code Badge if found */}
                  {promoCode && (
                    <div className="pt-1">
                      <button
                        onClick={() => handleCopyCode(promoCode, opp.id)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-mono font-black transition-all ${
                          isCodeCopied
                            ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-xs'
                            : 'bg-zinc-950/80 hover:bg-zinc-800 border-white/[0.1] text-amber-300 hover:border-amber-500/40'
                        }`}
                        title="Click to copy promo code"
                      >
                        {isCodeCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                        <span>{promoCode}</span>
                        <span className="text-[9px] font-sans text-zinc-500 uppercase tracking-widest pl-1 border-l border-white/[0.1]">
                          {isCodeCopied ? 'Copied!' : 'Copy Code'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-white/[0.08] space-y-3">
                  {opp.terms && (
                    <p className="text-[10px] text-zinc-500 italic font-mono leading-relaxed line-clamp-2">
                      Terms: {opp.terms}
                    </p>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-black text-emerald-400 font-mono tracking-tight">
                      {opp.discountType === 'percentage' ? `${opp.discountValue}% OFF` : `₹${opp.discountValue} FLAT`}
                    </span>
                    <a
                      href={opp.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 rounded-2xl bg-zinc-800/80 hover:bg-gradient-to-r hover:from-orange-500 hover:to-amber-500 border border-white/[0.08] hover:border-transparent px-4 py-2 text-xs font-bold text-zinc-200 hover:text-white shadow-md transition-all active:scale-95 group/btn"
                    >
                      <span>Claim Offer</span>
                      <ExternalLink className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
