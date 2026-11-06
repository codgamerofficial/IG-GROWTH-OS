'use client';

// =============================================================================
// RIIQX — Opportunity Radar & Verified Deals View
// Live Timestamps • Direct Terms • Zero Invented Deals
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
} from 'lucide-react';
import { OpportunityItem } from '@/lib/riiqx/twin-types';

export function TwinOpportunitiesView() {
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Opportunity Radar
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Verified Deals &amp; Merchant Campaigns
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Real-time verified promotional opportunities with verified terms and zero fabricated coupons.
          </p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition-all ${
              selectedCategory === c.id
                ? 'bg-[#FF5722] text-white shadow-xs'
                : 'bg-white dark:bg-[#18181C] text-[#6B6661] dark:text-[#A3A3A3] border border-[#EAE3D9] dark:border-[#26262B] hover:text-[#1A1817] dark:hover:text-white'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <div
            key={opp.id}
            className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#FF5722] transition-colors"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-[#FF5722] tracking-wider">
                  {opp.provider}
                </span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#16865D] bg-[#16865D]/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Verified
                </span>
              </div>
              <h3 className="text-base font-bold text-[#1A1817] dark:text-white">{opp.title}</h3>
              <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">{opp.description}</p>
            </div>

            <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#26262B] space-y-3">
              {opp.terms && (
                <p className="text-[10px] text-[#6B6661] dark:text-[#737373] italic">
                  Terms: {opp.terms}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#16865D]">
                  {opp.discountType === 'percentage' ? `${opp.discountValue}% OFF` : `₹${opp.discountValue} FLAT`}
                </span>
                <a
                  href={opp.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] px-3 py-1.5 text-xs font-bold text-[#1A1817] dark:text-white hover:bg-[#FF5722] hover:text-white transition-colors"
                >
                  <span>Claim Offer</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

