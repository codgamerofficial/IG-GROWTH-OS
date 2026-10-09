'use client';

// =============================================================================
// PujaHop Kolkata: Editorial Photo Moments Gallery
// Section 32: National Geographic x Monocle x Bengali Cultural Heritage
// =============================================================================

import React from 'react';
import Image from 'next/image';
import { Camera, MapPin, Sparkles } from 'lucide-react';

export function PhotoMomentsSection() {
  const moments = [
    {
      title: 'Kumartuli: The Birth of the Goddess',
      title_bn: 'মৃৎশিল্পীর তুলির টান ও ঐতিহ্যের সূচনা',
      area: 'Kumartuli, North Kolkata',
      image: '/images/kumartuli-tradition.jpg',
      caption: 'Centuries-old lanes along the Hooghly where straw, clay, and reverence take immortal form.',
    },
    {
      title: 'Illuminated Palace Pandals of Kolkata',
      title_bn: 'আলো আর স্থাপত্যের মায়াবী প্রতিচ্ছবি',
      area: 'Bidhan Sarani & Salt Lake Corridor',
      image: '/images/palace-pandal-reflection.jpg',
      caption: 'When wet tarmac reflects glowing domes and lakh of revelers walk through fairy-tale arches.',
    },
    {
      title: 'Heritage Tramway at Festival Twilight',
      title_bn: 'কলকাতার শতাব্দীপ্রাচীন ট্রাম ও উৎসবের আলো',
      area: 'College Street & Esplanade',
      image: '/images/kolkata-tram-metro.jpg',
      caption: 'Asia’s oldest electric tram gliding past illuminated pandal gates and bookstalls.',
    },
    {
      title: 'Ganga Reflections & Howrah Bridge Silhouette',
      title_bn: 'গঙ্গার বুকে আলোর রোশনাই ও হাওড়া ব্রিজ',
      area: 'Babu Ghat & Hooghly Riverfront',
      image: '/images/hooghly-river-night.jpg',
      caption: 'The mighty Hooghly flowing gently under midnight lights as dhakis drum on riverbanks.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold mb-1">
            <Camera className="w-3.5 h-3.5" />
            <span>Kolkata Cultural Editorial</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Moments That Define Kolkata’s Puja
          </h2>
          <p className="font-bengali text-xs sm:text-sm text-zinc-400">
            মণ্ডপের গণ্ডি ছাড়িয়ে শহরের প্রতিটি কোণে জেগে থাকা উৎসবের দৃশ্যকাব্য
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {moments.map((m, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121124] hover:border-amber-400/40 transition-all duration-500 hover:-translate-y-1 shadow-lg"
          >
            <div className="relative h-80 sm:h-96 w-full overflow-hidden">
              <Image
                src={m.image}
                alt={m.title}
                fill
                unoptimized
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-center scale-105 transition-transform duration-700 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C1C] via-[#0E0C1C]/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-1.5 text-white">
              <div className="flex items-center gap-1 text-[10px] text-amber-300 font-medium">
                <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                <span className="truncate">{m.area}</span>
              </div>
              <h3 className="font-bold text-sm leading-snug text-[#FFF7E8] group-hover:text-amber-300 transition-colors">
                {m.title}
              </h3>
              <p className="font-bengali text-xs text-amber-200/80 font-medium">
                {m.title_bn}
              </p>
              <p className="text-[11px] text-zinc-300 line-clamp-2 pt-1 border-t border-white/10 leading-relaxed">
                {m.caption}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
