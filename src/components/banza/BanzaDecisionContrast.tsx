'use client';

// =============================================================================
// BANZA — Decision Contrast Section
// "What you see isn't always what's best for you."
// Sponsored Noise vs. Honest AI Twin Curated Pick
// =============================================================================

import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, XCircle, Sparkles, TrendingDown, ArrowRight } from 'lucide-react';

export function BanzaDecisionContrast({ onLaunchTwin }: { onLaunchTwin: (q: string) => void }) {
  const [activeCategory, setActiveCategory] = useState<'sunscreen' | 'headphones' | 'shoes'>('sunscreen');

  const comparisons = {
    sunscreen: {
      category: 'Sunscreen & Skincare',
      sponsored: {
        title: 'Hype Glow Illuminating Chemical Sunscreen 50ml',
        price: '₹1,250',
        rating: '3.4 ★',
        reason: 'Heavy ad spend on social media. Leaves strong oily white cast and clogs pores in Indian humidity.',
        tags: ['Heavily Sponsored', 'Comedogenic Silicones', 'Strict No-Return'],
      },
      twinPick: {
        title: 'Ultra-Matte Invisible Fluid Sunscreen SPF 50 PA++++',
        price: '₹584 (after 10% UPI offer)',
        rating: '4.8 ★',
        reason: 'Zero white cast, non-comedogenic, formulated for oily/combination Indian skin with modern photostable UV filters.',
        tags: ['Dermatologist Approved', 'Zero White Cast', 'Verified Community Pick'],
      },
      question: 'Which sunscreen is best for oily acne-prone skin in summer?',
    },
    headphones: {
      category: 'Wireless Audio',
      sponsored: {
        title: 'BassMaster Pro Ultra RGB Over-Ear Headset',
        price: '₹4,999',
        rating: '3.6 ★',
        reason: 'Sponsored marketplace placement. Over-boosted muddy bass to mask cheap drivers; earcups tear within 4 months.',
        tags: ['Paid Promotion', 'Fragile Plastic Hinge', 'Overpriced Bass'],
      },
      twinPick: {
        title: 'Sony WH-CH720N Active Noise Cancelling Wireless',
        price: '₹7,990 (Saved ₹4,000 via HDFC card stack)',
        rating: '4.7 ★',
        reason: 'Flagship V1 audio processor, 35hr battery, lightweight 192g build with crystal clear mic for work and gym.',
        tags: ['Integrated V1 Chip', 'Multipoint Bluetooth', 'Best Value ANC'],
      },
      question: 'Find me the best noise-cancelling headphones under ₹8,000.',
    },
    shoes: {
      category: 'Footwear & Daily Wear',
      sponsored: {
        title: 'Trendy Fast-Fashion Chunky Urban Sneakers',
        price: '₹2,999',
        rating: '3.2 ★',
        reason: 'Cheap synthetic PU leather that causes excessive foot sweating; soles separate after first rain exposure.',
        tags: ['Influencer Hype', 'Non-Breathable PU', 'Poor Arch Support'],
      },
      twinPick: {
        title: 'Asics Gel-Contend 8 Breathable Everyday Running Shoes',
        price: '₹2,699 (Cheapest on Tata CLiQ)',
        rating: '4.8 ★',
        reason: 'Orthopedic rearfoot Gel cushioning, breathable jacquard mesh, engineered for long walking and daily standing.',
        tags: ['Rearfoot Gel Tech', 'Ortholite Insole', 'Doctor Recommended'],
      },
      question: 'Best comfortable shoes for daily walking and commute?',
    },
  };

  const current = comparisons[activeCategory];

  return (
    <section className="py-20 border-t border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold text-[#FF5722]">
            <span>COMMERCIAL BIAS VS. CONSUMER TRUTH</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
            What you see isn&apos;t always <br className="hidden sm:inline" />
            <span className="text-[#FF5722]">what&apos;s best for you.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6661] dark:text-[#A3A3A3]">
            Traditional shopping platforms make money by pushing sponsored bids and high-margin products. Your Twin works only for you — filtering out the noise.
          </p>

          {/* Category Tabs */}
          <div className="flex justify-center gap-2 pt-4">
            {(['sunscreen', 'headphones', 'shoes'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${
                  activeCategory === cat
                    ? 'bg-[#1A1817] text-white dark:bg-white dark:text-[#1A1817] shadow-xs'
                    : 'bg-white dark:bg-[#1A1A1E] text-[#6B6661] dark:text-[#A3A3A3] border border-[#EAE3D9] dark:border-[#26262B] hover:text-[#FF5722]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          
          {/* Left: What Platforms Show (Sponsored Trap) */}
          <div className="rounded-3xl border border-red-500/20 bg-red-500/[0.02] dark:bg-red-500/[0.04] p-6 sm:p-8 space-y-5 relative">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-red-500/10 text-red-600 dark:text-red-400 px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                <XCircle className="h-3.5 w-3.5" />
                What Marketplaces Push (Sponsored)
              </span>
              <span className="text-xs font-bold text-[#9E9E9E]">Ad Placed</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1A1817] dark:text-white line-clamp-1">
                {current.sponsored.title}
              </h3>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-[#1A1817] dark:text-white">
                  {current.sponsored.price}
                </span>
                <span className="text-xs font-bold text-red-500">{current.sponsored.rating} (Mixed Reviews)</span>
              </div>
            </div>

            <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
              {current.sponsored.reason}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EAE3D9] dark:border-[#26262B]">
              {current.sponsored.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-red-500/10 text-red-600 dark:text-red-400 px-2.5 py-1 text-[11px] font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: What Your AI Twin Picks (Unbiased Truth) */}
          <div className="rounded-3xl border-2 border-[#FF5722] bg-[#FFFDF9] dark:bg-[#18181C] p-6 sm:p-8 space-y-5 relative shadow-xl shadow-[#FF5722]/5">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-[#FF5722] text-white px-3 py-1 text-xs font-black flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" />
                My Pick For You (AI Twin)
              </span>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                Verified Value
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-[#1A1817] dark:text-white line-clamp-1">
                {current.twinPick.title}
              </h3>
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-black text-[#FF5722]">
                  {current.twinPick.price}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {current.twinPick.rating} (Consensus Pick)
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
              {current.twinPick.reason}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-[#EAE3D9] dark:border-[#26262B]">
              {current.twinPick.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-bold"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => onLaunchTwin(current.question)}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-[#FF5722] hover:bg-[#E64A19] text-white py-3 text-xs font-black shadow-xs transition-transform active:scale-95"
            >
              <span>Ask Twin About This</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
