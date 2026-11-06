'use client';

// =============================================================================
// BANZA — Hero Section
// "Before you decide, ask your AI Twin."
// High-Impact Typography • Interactive Twin Floating Mockup • Instant CTA
// =============================================================================

import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Star } from 'lucide-react';

interface BanzaHeroSectionProps {
  onLaunchTwin: (defaultPrompt?: string) => void;
}

export function BanzaHeroSection({ onLaunchTwin }: BanzaHeroSectionProps) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-[#FF5722]/5 blur-3xl pointer-events-none" />
      <div className="absolute top-10 right-0 h-[450px] w-[450px] rounded-full bg-[#FF7A00]/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold text-[#FF5722]">
              <Sparkles className="h-3.5 w-3.5" />
              <span>THE PERSONAL AI TWIN PLATFORM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading leading-[1.1]">
              Before you decide,{' '}
              <span className="text-[#FF5722] block sm:inline">
                ask your AI Twin.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#6B6661] dark:text-[#A3A3A3] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              When every platform is trying to sell you something, your Twin tells you what&apos;s truly worth it. Unbiased reviews, live price comparisons, and stacked bank discounts.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => onLaunchTwin()}
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white px-8 py-4 text-base font-black shadow-lg shadow-[#FF5722]/25 transition-all active:scale-95"
              >
                <span>Get started</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2 text-xs font-semibold text-[#6B6661] dark:text-[#A3A3A3]">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>100% Private • Zero Sponsored Bias</span>
              </div>
            </div>

            {/* Quick App Badges & Rating */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 border-t border-[#EAE3D9] dark:border-[#26262B]">
              <div className="flex items-center gap-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-[#1A1817] dark:text-white">4.9 / 5</span>
                <span className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">(Consumer Choice)</span>
              </div>
              <div className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">
                ₹27,000+ Average Annual Savings
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hero Smartphone Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer Device Frame */}
              <div className="rounded-[36px] border-4 border-[#1A1817]/10 dark:border-white/10 bg-white dark:bg-[#18181C] p-4 shadow-2xl backdrop-blur-xl space-y-4">
                
                {/* Simulated Chat Header */}
                <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#26262B] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#FF5722] to-[#FF7A00] flex items-center justify-center text-white text-xs font-black">
                      T
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#1A1817] dark:text-white">Your AI Twin</div>
                      <div className="text-[10px] text-emerald-500 font-semibold flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online • Analyzing Live Retailers
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] rounded-full bg-[#FAF8F5] dark:bg-[#202024] px-2 py-0.5 font-bold text-[#6B6661] dark:text-[#A3A3A3]">
                    Personalized
                  </span>
                </div>

                {/* User Bubble */}
                <div className="flex justify-end">
                  <div className="rounded-2xl rounded-tr-xs bg-[#1A1817] dark:bg-white text-white dark:text-[#1A1817] px-4 py-2.5 text-xs font-medium max-w-[85%] leading-relaxed shadow-sm">
                    Suggest a good tote bag for office and commute under ₹3,000.
                  </div>
                </div>

                {/* Twin Interactive Verdict Card */}
                <div
                  onClick={() => onLaunchTwin('Suggest a good tote bag for office and commute under ₹3,000')}
                  className="rounded-3xl border border-[#FF5722]/30 bg-[#FFFDF9] dark:bg-[#202024] p-4 space-y-3 cursor-pointer hover:border-[#FF5722] transition-all shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-[#FF5722]/10 text-[#FF5722] px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider">
                      ★ My Pick For You
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      99% Twin Match
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-[#1A1817] dark:text-white">
                      Structured Vegan Leather Everyday Commuter Tote
                    </h4>
                    <p className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3] line-clamp-2">
                      Water-resistant zippers, reinforced straps, dedicated padded 14&quot; laptop sleeve with zero shoulder strain.
                    </p>
                  </div>

                  {/* Pricing Strip */}
                  <div className="flex items-baseline justify-between rounded-2xl bg-[#FAF8F5] dark:bg-[#161618] p-3 border border-[#EAE3D9] dark:border-[#26262B]">
                    <div>
                      <div className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3]">Cheapest on Amazon:</div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-black text-[#1A1817] dark:text-white">₹2,319</span>
                        <span className="text-xs text-[#9E9E9E] line-through">₹4,499</span>
                      </div>
                    </div>
                    <span className="rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-1 text-xs font-bold">
                      Save ₹2,180 (48% OFF)
                    </span>
                  </div>

                  <div className="text-[11px] text-[#FF5722] font-bold flex items-center justify-between pt-1">
                    <span>Card Stack: Pre-applied HDFC 10% instant off</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>

                {/* Bottom Interactive Prompt Input */}
                <div
                  onClick={() => onLaunchTwin()}
                  className="flex items-center justify-between rounded-full border border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#121214] px-4 py-2.5 text-xs text-[#6B6661] dark:text-[#A3A3A3] cursor-pointer hover:border-[#FF5722] transition-colors"
                >
                  <span>Ask anything before you buy...</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-[#FF5722] text-white">
                    <ArrowRight className="h-3 w-3" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

