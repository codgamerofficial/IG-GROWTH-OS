'use client';

// =============================================================================
// PujaHop Kolkata: Kolkata Bhog & Street Food Trail Engine (Phase 25)
// Traditional Mahaprasad timings, coupon counters, and iconic midnight cabins
// =============================================================================

import React, { useState } from 'react';
import { Pandal } from '@/lib/types/pujahop';
import {
  VERIFIED_PANDAL_BHOG_SCHEDULES,
  VERIFIED_LEGENDARY_FOOD_TRAIL,
  PandalBhogInfo,
  FoodTrailSpot,
} from '@/lib/data/kolkata-food-trail';
import { calculateDistanceMeters } from '@/lib/utils/exif';
import {
  UtensilsCrossed,
  Clock,
  MapPin,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Flame,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

interface BhogAndFoodTrailProps {
  pandal?: Pandal;
}

export function BhogAndFoodTrail({ pandal }: BhogAndFoodTrailProps) {
  const [activeTab, setActiveTab] = useState<'BHOG' | 'TRAIL'>('BHOG');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Match pandal bhog
  const matchedBhog = pandal
    ? VERIFIED_PANDAL_BHOG_SCHEDULES.find(
        (b) =>
          b.pandal_id === pandal.id ||
          pandal.name.toLowerCase().includes(b.pandal_name.toLowerCase().split(' ')[0]) ||
          b.pandal_name.toLowerCase().includes(pandal.name.toLowerCase().split(' ')[0])
      )
    : null;

  // Compute distance from pandal if available
  const foodSpotsWithDistance = VERIFIED_LEGENDARY_FOOD_TRAIL.map((spot) => {
    let distanceMeters = 0;
    if (pandal) {
      distanceMeters = calculateDistanceMeters(pandal.lat, pandal.lng, spot.lat, spot.lng);
    }
    return { ...spot, distanceMeters };
  }).sort((a, b) => {
    if (pandal) return a.distanceMeters - b.distanceMeters;
    return (b.heritage_year || 2000) - (a.heritage_year || 2000);
  });

  const filteredSpots = foodSpotsWithDistance.filter((spot) => {
    if (selectedCategory === 'ALL') return true;
    if (selectedCategory === 'VEG') return spot.is_pure_veg;
    if (selectedCategory === 'ROLLS') return spot.category === 'ROLLS_CABIN';
    if (selectedCategory === 'SWEETS') return spot.category === 'SWEETS_MISHTI';
    if (selectedCategory === 'BIRYANI') return spot.category === 'BIRYANI_MUGHLAI';
    return true;
  });

  return (
    <div className="space-y-4 p-4 md:p-5 rounded-2xl bg-[#121124] border border-white/10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <UtensilsCrossed className="w-4 h-4 text-amber-400" />
            <span>Kolkata Bhog & Street Food Trail</span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Authentic Mahaprasad distribution windows + iconic midnight eating spots
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-[#0D0B1C] p-1 rounded-xl border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('BHOG')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'BHOG'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🍛 Pandal Bhog
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('TRAIL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'TRAIL'
                ? 'bg-amber-500 text-black shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            🍢 Food Trail ({foodSpotsWithDistance.length})
          </button>
        </div>
      </div>

      {/* TAB 1: PANDAL BHOG */}
      {activeTab === 'BHOG' && (
        <div className="space-y-3 pt-1">
          {matchedBhog ? (
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-transparent border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Verified Mahaprasad Schedule: {matchedBhog.pandal_name}</span>
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                  {matchedBhog.is_seated_dining ? 'Seated Dining Pavilion' : 'Prasad Counter'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-1">
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-amber-400" />
                    <span>Serving Days</span>
                  </div>
                  <div className="font-semibold text-white">{matchedBhog.days.join(', ')}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5 space-y-1">
                  <div className="text-[10px] text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Distribution Window</span>
                  </div>
                  <div className="font-semibold text-amber-300">{matchedBhog.timing_window}</div>
                </div>
              </div>

              {/* Menu items */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-300">Traditional Bhog Platter:</span>
                <div className="flex flex-wrap gap-1.5">
                  {matchedBhog.menu_items.map((item, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-zinc-200"
                    >
                      ✨ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Token Guidelines */}
              <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-200 leading-relaxed">
                🎫 <strong>Coupon Guidelines:</strong> {matchedBhog.coupon_info}
              </div>

              <p className="text-[10px] text-zinc-400 italic">
                ℹ️ {matchedBhog.notes}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300 space-y-2">
                <p>
                  {pandal
                    ? `${pandal.name} serves community prasad following morning Pushpanjali. See citywide major Mahaprasad centers below:`
                    : 'Kolkata’s historic Durga Puja community bhog is distributed on Saptami, Ashtami, and Navami afternoons:'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {VERIFIED_PANDAL_BHOG_SCHEDULES.map((bhog) => (
                  <div
                    key={bhog.pandal_id}
                    className="p-3 rounded-xl bg-[#0D0B1C] border border-white/5 hover:border-amber-500/30 transition-all space-y-1.5 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-xs">{bhog.pandal_name}</h4>
                      <span className="text-[10px] text-amber-400 font-semibold">{bhog.area}</span>
                    </div>
                    <div className="text-[11px] text-amber-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{bhog.timing_window}</span>
                    </div>
                    <p className="text-[10px] text-zinc-400 line-clamp-2">{bhog.coupon_info}</p>
                    <div className="text-[9px] text-zinc-500">
                      Menu: {bhog.menu_items.slice(0, 3).join(', ')}...
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LEGENDARY FOOD TRAIL */}
      {activeTab === 'TRAIL' && (
        <div className="space-y-3 pt-1">
          {/* Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {[
              { id: 'ALL', label: 'All Heritage Spots' },
              { id: 'ROLLS', label: '🌯 Rolls & Cabins' },
              { id: 'SWEETS', label: '🍯 Sweets / Mishti' },
              { id: 'BIRYANI', label: '🥘 Mughlai / Biryani' },
              { id: 'VEG', label: '🌱 Pure Veg' },
            ].map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setSelectedCategory(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === f.id
                    ? 'bg-rose-600 text-white shadow'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
            {filteredSpots.map((spot) => (
              <div
                key={spot.id}
                className="p-3.5 rounded-xl bg-[#0D0B1C] border border-white/5 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-2 text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-bold text-white text-xs">{spot.name}</span>
                    <span className="text-[10px] font-bold text-amber-400">{spot.price_range}</span>
                  </div>

                  {spot.name_bn && (
                    <div className="text-[11px] text-amber-300 font-medium">{spot.name_bn}</div>
                  )}

                  <div className="text-[11px] text-zinc-300 font-semibold line-clamp-1">
                    🍽️ {spot.specialty}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-400 pt-1">
                    {spot.heritage_year && (
                      <span className="px-1.5 py-0.5 rounded bg-white/5 text-amber-300 font-medium">
                        Since {spot.heritage_year}
                      </span>
                    )}
                    <span>{spot.timings}</span>
                    {pandal && spot.distanceMeters > 0 && (
                      <span className="text-emerald-400 font-semibold">
                        📍 {spot.distanceMeters > 1000 ? `${(spot.distanceMeters / 1000).toFixed(1)}km` : `${spot.distanceMeters}m`} away
                      </span>
                    )}
                  </div>
                </div>

                <a
                  href={spot.google_maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 py-1.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-amber-300 hover:text-amber-200 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-white/5 transition-colors"
                >
                  <span>Directions & Details</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
