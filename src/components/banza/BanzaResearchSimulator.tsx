'use client';

// =============================================================================
// BANZA — Research Simulator Section
// "Hours of research. One question to your Twin."
// Zero Fluff • Real Reddit & Review Consensus • Clickable Live Queries
// =============================================================================

import React, { useState } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Check, X, ShieldAlert } from 'lucide-react';

export function BanzaResearchSimulator({ onLaunchTwin }: { onLaunchTwin: (q: string) => void }) {
  const sampleQueries = [
    {
      q: 'Should I buy iPhone 15 now or wait for 16?',
      verdict: 'Buy iPhone 15 only if price is under ₹52,000 on sale. Otherwise wait.',
      summary: 'iPhone 15 has USB-C and 48MP camera, but lacks Apple Intelligence support. If you plan to keep your phone for 3+ years, the 16’s 8GB RAM is essential.',
      pros: ['USB-C universal port', 'Dynamic Island convenience', 'Great trade-in value'],
      cons: ['No Apple Intelligence (AI) support', 'Locked to 60Hz display refresh'],
      priceFloor: '₹51,999 (Amazon Festive)',
    },
    {
      q: 'Which sunscreen leaves ZERO white cast on brown skin?',
      verdict: 'Minimalist Light Fluid SPF 50 or Dot & Key Watermelon Sunscreen.',
      summary: 'Avoid physical mineral zinc sunscreens; they inevitably look ghostly on deeper Indian undertones. Both of these use modern European chemical filters that absorb completely invisible.',
      pros: ['100% transparent finish', 'Lightweight fluid texture', 'PA++++ UVA protection'],
      cons: ['Reapplication needed every 3 hours outdoors'],
      priceFloor: '₹449 (Nykaa / Brand Direct)',
    },
    {
      q: 'Best mechanical keyboard for Mac under ₹4,000?',
      verdict: 'Keychron C1 Wired or Royal Kludge RK61 with Gateron Brown Switches.',
      summary: 'Most budget mechanical keyboards come with Windows-first keycaps that break Mac muscle memory. Keychron includes physical OS toggle switch and native Command/Option legends.',
      pros: ['Physical Mac/Windows hardware switch', 'Hot-swappable switch sockets', 'High-profile PBT keycaps'],
      cons: ['C1 is wired only; wireless model is ₹1,800 more'],
      priceFloor: '₹3,799 (Meckeys / Amazon)',
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const activeItem = sampleQueries[activeIdx];

  return (
    <section className="py-20 border-t border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold text-[#FF5722]">
            <span>DECISION VELOCITY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
            Hours of research. <br className="hidden sm:inline" />
            <span className="text-[#FF5722]">One question to your Twin.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6661] dark:text-[#A3A3A3]">
            Forget scrolling 15 pages of conflicting customer reviews and sponsored video ads. Your Twin gives you the clear, unambiguous verdict in 3 seconds.
          </p>

          {/* Sample Query Selectors */}
          <div className="flex flex-col sm:flex-row justify-center gap-2 pt-4">
            {sampleQueries.map((item, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIdx(idx)}
                className={`text-left sm:text-center rounded-2xl px-4 py-2.5 text-xs font-bold transition-all border ${
                  activeIdx === idx
                    ? 'bg-[#1A1817] text-white dark:bg-white dark:text-[#1A1817] border-transparent shadow-xs'
                    : 'bg-white dark:bg-[#1A1A1E] text-[#6B6661] dark:text-[#A3A3A3] border-[#EAE3D9] dark:border-[#26262B] hover:border-[#FF5722]'
                }`}
              >
                &ldquo;{item.q}&rdquo;
              </button>
            ))}
          </div>
        </div>

        {/* Live Answer Box */}
        <div className="mt-12 max-w-3xl mx-auto rounded-[32px] border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FF7A00] flex items-center justify-center text-white text-xs font-bold">
                T
              </div>
              <span className="text-xs font-bold text-[#1A1817] dark:text-white">AI Twin Unbiased Verdict</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
              Floor Price: {activeItem.priceFloor}
            </span>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-[#FF5722]">
              {activeItem.verdict}
            </h3>
            <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
              {activeItem.summary}
            </p>
          </div>

          {/* Pros & Cons Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/20 p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="h-4 w-4" /> Why It Wins
              </span>
              <ul className="space-y-1.5 text-xs text-[#1A1817] dark:text-slate-300">
                {activeItem.pros.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl bg-amber-500/[0.06] border border-amber-500/20 p-4 space-y-2">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                <ShieldAlert className="h-4 w-4" /> Trade-offs to Know
              </span>
              <ul className="space-y-1.5 text-xs text-[#1A1817] dark:text-slate-300">
                {activeItem.cons.map((c, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={() => onLaunchTwin(activeItem.q)}
            className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white py-3.5 text-xs font-black shadow-xs transition-transform active:scale-95"
          >
            <span>Ask Your Twin About This Query</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

        </div>

      </div>
    </section>
  );
}

