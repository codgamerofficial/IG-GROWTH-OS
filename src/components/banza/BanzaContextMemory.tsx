'use client';

// =============================================================================
// BANZA — Context & Memory Section
// "Your next decision shouldn't start from scratch."
// Persistent Preference Architecture • Zero Repetition • Evolving Context
// =============================================================================

import React from 'react';
import { UserCheck, Sparkles, Sliders, Smartphone, Heart, ArrowRight } from 'lucide-react';

export function BanzaContextMemory({ onLaunchTwin }: { onLaunchTwin: () => void }) {
  const memoryPillars = [
    {
      title: 'Skin & Physiology',
      icon: Heart,
      detail: 'Oily & acne-prone. Rejects heavy silicones and synthetic fragrance. SPF must be invisible on dark undertones.',
      color: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    },
    {
      title: 'Tech & Hardware Spec',
      icon: Smartphone,
      detail: 'MacBook ecosystem. Refuses 8GB RAM machines. Prefers multi-point Bluetooth and low-latency USB-C audio.',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    },
    {
      title: 'Payment & Wallet Cards',
      icon: Sliders,
      detail: 'HDFC Regalia + Amazon Pay ICICI. Prioritizes instant upfront merchant discounts over delayed reward points.',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    },
    {
      title: 'Fit, Style & Sizing',
      icon: UserCheck,
      detail: 'UK Size 9 wide in sneakers. Prefers relaxed heavyweight cotton (240+ GSM). Avoids polyester blends.',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    },
  ];

  return (
    <section className="py-20 border-t border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold text-[#FF5722]">
            <span>PERSISTENT PERSONAL CONTEXT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
            Your next decision <br className="hidden sm:inline" />
            <span className="text-[#FF5722]">shouldn&apos;t start from scratch.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6661] dark:text-[#A3A3A3]">
            Traditional search forgets who you are the second you close the tab. Your AI Twin builds an evolving private map of what fits you, what breaks your budget, and what you love.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {memoryPillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 space-y-4 hover:border-[#FF5722]/50 transition-all shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className={`h-10 w-10 rounded-2xl flex items-center justify-center border ${pillar.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-bold text-[#1A1817] dark:text-white">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
                    {pillar.detail}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#26262B] text-[10px] font-bold text-[#FF5722] flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  <span>Always Applied to Recommendations</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="mt-10 text-center">
          <button
            onClick={onLaunchTwin}
            className="inline-flex items-center gap-2 rounded-full border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#1A1A1E] px-6 py-3 text-xs font-bold text-[#1A1817] dark:text-white hover:border-[#FF5722] hover:text-[#FF5722] transition-colors shadow-xs"
          >
            <span>Configure Your AI Twin Profile</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>
    </section>
  );
}

