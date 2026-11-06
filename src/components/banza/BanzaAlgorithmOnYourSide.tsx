'use client';

// =============================================================================
// BANZA — Algorithm on Your Side Section
// "Your Twin works for you. Finally an algorithm on your side."
// Buyer-First Alignment • Zero Ad Kickbacks • Anti-Dark Pattern Guardian
// =============================================================================

import React from 'react';
import { ShieldCheck, EyeOff, Zap, Lock, ArrowRight } from 'lucide-react';

export function BanzaAlgorithmOnYourSide({ onLaunchTwin }: { onLaunchTwin: () => void }) {
  const commitments = [
    {
      title: 'Zero Sponsored Bribes',
      desc: 'Brands cannot pay us to rank higher or recommend their products. When your Twin suggests something, it is solely because it delivers peak value.',
      icon: ShieldCheck,
      badge: '100% Unbiased',
    },
    {
      title: 'Anti-Dark Pattern Guardian',
      desc: 'Detects fake countdown timers, artificially inflated "MRP discounts", and stealth subscription bundles at checkout before you get charged.',
      icon: EyeOff,
      badge: 'Consumer Shield',
    },
    {
      title: 'Cross-Merchant Neutrality',
      desc: 'Whether the lowest price is on Amazon, Flipkart, Myntra, Tata CLiQ, or the brand’s own direct warehouse, your Twin routes you straight to the savings.',
      icon: Zap,
      badge: 'Unconstrained Search',
    },
    {
      title: 'Client-Side Private Memory',
      desc: 'Your skin type, sizing, and bank card preferences are encrypted. We never sell consumer telemetry or browsing habits to advertisers.',
      icon: Lock,
      badge: 'Data Sovereignty',
    },
  ];

  return (
    <section className="py-24 border-t border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors relative overflow-hidden">
      
      {/* Background Accent Lines */}
      <div className="absolute inset-0 bg-[radial-gradient(#FF5722_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold text-[#FF5722]">
            <span>BUYER-FIRST PHILOSOPHY</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
            Your Twin works for you. <br />
            <span className="text-[#FF5722] italic">Finally an algorithm on your side.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6661] dark:text-[#A3A3A3]">
            Every major platform built algorithms to extract maximum attention, inflate ad revenues, and keep you buying. Banza is the exact opposite — software whose only loyalty is to you.
          </p>
        </div>

        {/* 4 Commitments Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {commitments.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-7 space-y-4 shadow-sm hover:border-[#FF5722] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-2xl bg-[#FF5722]/10 text-[#FF5722] flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-[#FAF8F5] dark:bg-[#222226] border border-[#EAE3D9] dark:border-[#2E2E34] px-2.5 py-0.5 text-[10px] font-bold text-[#6B6661] dark:text-[#A3A3A3]">
                    {item.badge}
                  </span>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-lg font-bold text-[#1A1817] dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
