'use client';

// =============================================================================
// BANZA — Community Ask Carousel & Bottom Hero CTA
// "What would you ask your Twin?"
// Real Consumer Prompts • Multi-Category Coverage • Direct Launch Action
// =============================================================================

import React, { useState } from 'react';
import { Sparkles, ArrowRight, MessageSquare, Heart, Smartphone, ShoppingBag, Coffee, Plane } from 'lucide-react';

export function BanzaCommunityAskCarousel({ onLaunchTwin }: { onLaunchTwin: (q?: string) => void }) {
  const categories = [
    {
      id: 'all',
      label: 'All Prompts',
    },
    {
      id: 'beauty',
      label: 'Beauty & Skincare',
    },
    {
      id: 'tech',
      label: 'Gadgets & Tech',
    },
    {
      id: 'fashion',
      label: 'Fashion & Style',
    },
    {
      id: 'lifestyle',
      label: 'Food & Travel',
    },
  ];

  const communityCards = [
    {
      category: 'beauty',
      categoryLabel: 'Beauty & Skincare',
      icon: Heart,
      prompt: 'Can I use this 10% Vitamin C serum if I have active cystic acne breakouts?',
      twinAnswer: 'Skip high-strength pure L-ascorbic acid. Use 5% Ethyl Ascorbic Acid or 10% Azelaic Acid instead to avoid inflammation.',
      userLabel: 'Aarav, 24 • Bangalore',
      tag: 'Skin Safety',
    },
    {
      category: 'tech',
      categoryLabel: 'Gadgets & Tech',
      icon: Smartphone,
      prompt: 'Which iPad model is actually worth buying for college notes under ₹35,000?',
      twinAnswer: 'iPad 10th Gen (64GB) with 1st Gen USB-C Apple Pencil. Wait for Student Unidays discount to get free pencil.',
      userLabel: 'Ria, 20 • Delhi',
      tag: 'Best Value',
    },
    {
      category: 'fashion',
      categoryLabel: 'Fashion & Style',
      icon: ShoppingBag,
      prompt: 'Where can I find heavy 260 GSM boxy oversized tees under ₹999 in India?',
      twinAnswer: 'Bonkers Corner or March Tee (End of Season). Avoid fast-fashion marketplaces where GSM is below 180.',
      userLabel: 'Kabir, 26 • Mumbai',
      tag: 'Fabric Quality',
    },
    {
      category: 'lifestyle',
      categoryLabel: 'Food & Travel',
      icon: Coffee,
      prompt: 'What is the healthiest high-protein meal on Swiggy under 450 calories?',
      twinAnswer: 'Grilled Paneer / Chicken Tikka Bowl from EatFit with zero-mayo dressing. 38g protein, 410 kcal verified.',
      userLabel: 'Pooja, 28 • Hyderabad',
      tag: 'Nutrition Check',
    },
    {
      category: 'tech',
      categoryLabel: 'Gadgets & Tech',
      icon: Smartphone,
      prompt: 'Is Dyson Airwrap worth ₹45,000 or is Shark FlexStyle identical?',
      twinAnswer: 'Shark delivers 90% of curl retention for ₹21,000 less. Buy Dyson only if you have coarse thick hair needing Coanda heat lock.',
      userLabel: 'Sneha, 31 • Pune',
      tag: 'Arbitrage',
    },
    {
      category: 'lifestyle',
      categoryLabel: 'Food & Travel',
      icon: Plane,
      prompt: 'Best weekend getaway near Mumbai for monsoon without heavy landslides?',
      twinAnswer: 'Sula Vineyards (Nashik) or Karjat Riverside villas. Avoid Lonavala ghat bottlenecks on Saturday mornings.',
      userLabel: 'Rohan, 29 • Mumbai',
      tag: 'Travel Verdict',
    },
  ];

  const [activeCategory, setActiveCategory] = useState('all');

  const filtered =
    activeCategory === 'all'
      ? communityCards
      : communityCards.filter((c) => c.category === activeCategory);

  return (
    <section className="py-24 border-t border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold text-[#FF5722]">
            <span>COMMUNITY CROWD WISDOM</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
            What would you <br className="hidden sm:inline" />
            <span className="text-[#FF5722]">ask your Twin?</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6661] dark:text-[#A3A3A3]">
            From what to buy to what to do next. Explore genuine dilemmas and decisions real people solve with their personal AI Twin.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                  activeCategory === c.id
                    ? 'bg-[#1A1817] text-white dark:bg-white dark:text-[#1A1817] shadow-xs'
                    : 'bg-white dark:bg-[#18181C] text-[#6B6661] dark:text-[#A3A3A3] border border-[#EAE3D9] dark:border-[#26262B] hover:text-[#FF5722]'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                onClick={() => onLaunchTwin(card.prompt)}
                className="group rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 space-y-4 shadow-sm hover:border-[#FF5722] hover:shadow-xl hover:shadow-[#FF5722]/5 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-[#FF5722] uppercase tracking-wider flex items-center gap-1.5">
                      <Icon className="h-3.5 w-3.5" />
                      {card.categoryLabel}
                    </span>
                    <span className="rounded-full bg-[#FAF8F5] dark:bg-[#222226] border border-[#EAE3D9] dark:border-[#2E2E34] px-2 py-0.5 text-[10px] font-bold text-[#6B6661] dark:text-[#A3A3A3]">
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#1A1817] dark:text-white group-hover:text-[#FF5722] transition-colors leading-snug">
                    &ldquo;{card.prompt}&rdquo;
                  </h3>

                  <div className="rounded-2xl bg-[#FAF8F5] dark:bg-[#141418] border border-[#EAE3D9] dark:border-[#26262B] p-3 text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
                    <span className="font-bold text-[#1A1817] dark:text-white block mb-0.5">Twin Verdict:</span>
                    {card.twinAnswer}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#26262B] flex items-center justify-between text-[11px] text-[#9E9E9E]">
                  <span>{card.userLabel}</span>
                  <span className="flex items-center gap-1 font-bold text-[#FF5722] group-hover:translate-x-1 transition-transform">
                    <span>Ask this</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Big Bottom Conversion Card (From what to buy to what to do next) */}
        <div className="rounded-[40px] border border-[#FF5722]/30 bg-gradient-to-br from-[#FFF8F3] via-white to-[#FFF1EB] dark:from-[#18181C] dark:via-[#141418] dark:to-[#1C1614] p-8 sm:p-14 text-center space-y-6 shadow-2xl relative overflow-hidden">
          
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="inline-block rounded-full bg-[#FF5722]/10 text-[#FF5722] px-4 py-1 text-xs font-black uppercase tracking-wider">
              From what to buy to what to do next
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
              Before your next decision, <br />
              <span className="text-[#FF5722]">ask your AI Twin.</span>
            </h2>
            <p className="text-sm sm:text-base text-[#6B6661] dark:text-[#A3A3A3] max-w-lg mx-auto">
              Never get tricked by sponsored marketplace ads or paid influencer reviews again. Unlock genuine prices and personalized verdicts today.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onLaunchTwin()}
              className="flex items-center gap-2.5 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white px-8 py-4 text-base font-black shadow-lg shadow-[#FF5722]/30 transition-transform active:scale-95"
            >
              <span>Get started for free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
