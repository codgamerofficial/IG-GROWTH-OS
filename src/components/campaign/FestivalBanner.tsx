'use client';

// =============================================================================
// PujaHop Kolkata: Reusable Festival Story & Campaign Banner
// Visual identity: National Geographic x Monocle x Bengali Editorial
// =============================================================================

import React from 'react';
import Image from 'next/image';
import { usePujaHop } from '@/context/PujaHopContext';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';

export type FestivalBannerTheme =
  | 'story' // "পুজো শুধু মণ্ডপ নয়, এটা কলকাতার গল্প।"
  | 'metro' // "Metro. Walk. Explore. Experience."
  | 'heritage' // "North to South, Every Pandal Tells a Story."
  | 'sharadiya'; // "শারদীয়া শুভেচ্ছা"

interface FestivalBannerProps {
  theme?: FestivalBannerTheme;
  className?: string;
}

export function FestivalBanner({ theme = 'story', className = '' }: FestivalBannerProps) {
  const { setWizardOpen, setActiveTab } = usePujaHop();

  const configs = {
    story: {
      image: '/images/palace-pandal-reflection.jpg',
      headline_bn: 'পুজো শুধু মণ্ডপ নয়, এটা কলকাতার গল্প।',
      headline_en: "Experience Kolkata's Durga Puja Like Never Before",
      subtitle:
        'প্রতিটি গলির আলো, ঢাকের আওয়াজ আর ভেজা রাজপথের প্রতিবিম্ব — তোমার এক দিনের ভ্রমণে পুরো কলকাতা জেগে ওঠে।',
      badge: 'Editorial Story',
      ctaText: 'Discover Iconic Pandals',
      action: () => setActiveTab('pandals'),
    },
    metro: {
      image: '/images/kolkata-tram-metro.jpg',
      headline_bn: 'ট্রাম, মেট্রো আর উৎসবের রাজপথ',
      headline_en: 'Metro. Walk. Explore. Experience.',
      subtitle:
        'Smart routes for a magical Puja journey. Traffic jam এড়িয়ে মেট্রো আর হাঁটার সবচেয়ে নির্ভুল কম্বিনেশন।',
      badge: 'Transit Intelligence',
      ctaText: 'Plan Transit Route',
      action: () => setWizardOpen(true),
    },
    heritage: {
      image: '/images/hooghly-river-night.jpg',
      headline_bn: 'উত্তর থেকে দক্ষিণ — প্রতি মণ্ডপে এক নতুন কাহিনী',
      headline_en: 'From North to South Kolkata, Every Pandal Tells a Story',
      subtitle:
        'শোভাবাজার থেকে একডালিয়া — বনেদি বাড়ির ইতিহাস আর আধুনিক থিম আর্টের এক অভূতপূর্ব মিলনমেলা।',
      badge: 'Heritage Trail',
      ctaText: 'View Heritage Pandals',
      action: () => setActiveTab('explore'),
    },
    sharadiya: {
      image: '/images/sharadiya-vintage-lamp.jpg',
      headline_bn: 'শারদীয়া শুভেচ্ছা',
      headline_en: 'May the Divine Lights Guide Every Step of Your Journey',
      subtitle:
        'মায়ের আগমনে আলোতে চমকে উঠুক তোমার প্রতিটি পথ। PujaHop এর সাথে এক দিনে কলকাতার সেরা অভিজ্ঞতা গ্রহণ করো।',
      badge: 'Festive Greeting',
      ctaText: 'Create Your Itinerary',
      action: () => setWizardOpen(true),
    },
  };

  const current = configs[theme];

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-amber-500/20 bg-[#09090B] shadow-2xl ${className}`}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 items-center">
        {/* Visual Column */}
        <div className="relative h-64 md:h-80 lg:h-96 md:col-span-6 lg:col-span-7 overflow-hidden">
          <Image
            src={current.image}
            alt={current.headline_en}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#09090B] via-transparent to-transparent md:hidden" />
          <div className="absolute inset-0 hidden md:block bg-gradient-to-r from-transparent via-[#09090B]/30 to-[#09090B]" />
        </div>

        {/* Text Editorial Column */}
        <div className="p-6 md:p-8 lg:p-10 md:col-span-6 lg:col-span-5 space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-[11px] font-semibold text-amber-300">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>{current.badge}</span>
          </div>

          <h2 className="font-bengali text-2xl sm:text-3xl font-extrabold text-[#FFF7E8] leading-snug">
            {current.headline_bn}
          </h2>

          <p className="font-serif italic text-sm sm:text-base text-amber-200/90 font-medium">
            {current.headline_en}
          </p>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            {current.subtitle}
          </p>

          <div className="pt-2">
            <button
              onClick={current.action}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#E53935] hover:from-[#E53935] hover:to-[#D6A84F] text-white font-bold px-5 py-3 text-xs sm:text-sm shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
            >
              <span>{current.ctaText}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
