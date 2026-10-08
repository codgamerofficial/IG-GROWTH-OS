'use client';

// =============================================================================
// PujaHop Kolkata: Kolkata Food Trail Section
// "Puja is not just about Pandals, It's also about Kolkata's Flavours"
// =============================================================================

import React from 'react';
import Image from 'next/image';
import { usePujaHop } from '@/context/PujaHopContext';
import { Utensils, MapPin, Star, ArrowRight, Sparkles } from 'lucide-react';

export function FoodTrailSection() {
  const { setActiveTab } = usePujaHop();

  const curatedEats = [
    {
      name: "Nizam's",
      category: 'Original Kathi Roll',
      area: 'New Market / Esplanade',
      address: '23/24 Hogg Street, New Market',
      specialty: 'Mutton & Chicken Kathi Rolls wrapped in crispy paratha',
      price: '₹120 – ₹250',
      rating: '4.5',
      source: 'Verified Heritage Registry',
    },
    {
      name: 'Aminia Restaurant',
      category: 'Kolkata Mughlai Biryani',
      area: 'Central (Chandni Chowk / Golpark)',
      address: '6A, SN Banerjee Road, New Market',
      specialty: 'Fragrant Awadhi-style Biryani with soft potato & egg',
      price: '₹280 – ₹450',
      rating: '4.6',
      source: 'Verified Heritage Registry',
    },
    {
      name: 'Balaram Mullick & Radharaman Mullick',
      category: 'Artisanal Bengali Sweets',
      area: 'Bhowanipore / Salt Lake',
      address: '2, Paddapukur Road, Bhowanipore',
      specialty: 'Baked Rosogolla, Nolen Gur Sandesh & Mishti Doi',
      price: '₹50 – ₹200',
      rating: '4.8',
      source: 'Verified Heritage Registry',
    },
    {
      name: 'Mitra Cafe',
      category: 'Traditional North Cabin',
      area: 'Shyambazar (Near Bagbazar Pandal)',
      address: '47, Jatindra Mohan Avenue, Shobhabazar',
      specialty: 'Diamond Fish Fry, Brain Chop & Mutton Kabiraji',
      price: '₹140 – ₹300',
      rating: '4.6',
      source: 'Verified Heritage Registry',
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0B19] p-6 sm:p-8 space-y-6 shadow-2xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Visual Banner */}
        <div className="relative h-64 sm:h-80 lg:h-96 lg:col-span-5 rounded-2xl overflow-hidden border border-amber-500/20 shadow-xl">
          <Image
            src="/images/kolkata-food-flavours.jpg"
            alt="Kolkata Durga Puja Food Flavours - Kulhad Chai, Kathi Roll, Mishti Doi"
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-cover object-center scale-105 transition-transform duration-700 hover:scale-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0B19] via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Kolkata Gastronomy
            </span>
            <h3 className="font-bengali text-lg font-bold mt-1 text-[#FFF7E8]">
              পুজো শুধু মণ্ডপ নয়, এটা কলকাতার স্বাদেরও উৎসব
            </h3>
          </div>
        </div>

        {/* Content & Curated Stops */}
        <div className="lg:col-span-7 space-y-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
              <Utensils className="w-3.5 h-3.5" />
              <span>Kolkata Heritage Food Trail</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Food is Half the Puja Experience
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              প্যান্ডেল হপিংয়ের মাঝে ভাঁড়ের চা, গরম রোল কিংবা মধ্যরাতের বিরিয়ানি — কলকাতার আসল রসনা তৃপ্তি।
              Verified authentic locations along North, Central, and South corridors.
            </p>
          </div>

          {/* 4 Iconic Heritage Places */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {curatedEats.map((eat, i) => (
              <div
                key={i}
                className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/30 transition-all space-y-1.5"
              >
                <div className="flex items-start justify-between gap-1">
                  <h4 className="font-bold text-white text-sm">{eat.name}</h4>
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    {eat.rating}
                  </span>
                </div>
                <div className="text-[11px] text-amber-300 font-medium">{eat.category}</div>
                <p className="text-[11px] text-zinc-400 line-clamp-1">{eat.specialty}</p>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-white/5">
                  <span className="flex items-center gap-1 truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 text-zinc-500" />
                    {eat.area}
                  </span>
                  <span className="font-mono text-zinc-300">{eat.price}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={() => setActiveTab('explore')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-300 transition-colors"
            >
              <span>Explore All Verified Food Stops on Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
