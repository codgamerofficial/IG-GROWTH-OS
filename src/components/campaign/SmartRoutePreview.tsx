'use client';

// =============================================================================
// PujaHop Kolkata: Smart One-Day Route Preview Timeline
// Layer 3: Travel-App Layer • Honest OSRM distances & Metro transfers
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import {
  Compass,
  MapPin,
  Clock,
  Train,
  ArrowRight,
  Footprints,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export function SmartRoutePreview() {
  const { setWizardOpen, setActiveTab, setSelectedPandal, pandals } = usePujaHop();

  // Curated canonical 5-pandal North Heritage One-Day Trail (Realistic route with accurate metrics)
  const stops = [
    {
      time: '14:00',
      title: 'Start: Shyambazar Metro Station',
      type: 'METRO',
      subtitle: 'Blue Line Gateway • North Kolkata Origin Point',
      leg: '550m walk • ~8 mins',
      dwell: 'Arrival & Gathering',
    },
    {
      time: '14:15',
      title: 'Bagbazar Sarbojanin Durgotsav',
      type: 'PANDAL',
      subtitle: '107+ Years Heritage • Traditional Ekchala Protima',
      pandalSlug: 'bagbazar-sarbojanin',
      leg: '650m walk • ~9 mins',
      dwell: '45 mins darshan & photo',
    },
    {
      time: '15:10',
      title: 'Kumartuli Park Sarbojanin',
      type: 'PANDAL',
      subtitle: 'Artisans Quarter • Historic Clay Crafting Colony',
      pandalSlug: 'kumartuli-park',
      leg: '720m walk • ~10 mins',
      dwell: '40 mins darshan',
    },
    {
      time: '16:05',
      title: 'Sovabazar Rajbari',
      type: 'PANDAL',
      subtitle: 'Raja Nabakrishna Deb (1757) • Classical Bonedi Puja',
      pandalSlug: 'sovabazar-rajbari',
      leg: '850m walk • ~12 mins',
      dwell: '50 mins darshan & courtyard',
    },
    {
      time: '17:15',
      title: 'Hatibagan Sarbojanin',
      type: 'PANDAL',
      subtitle: 'Blockbuster Theme Lighting • Bidhan Sarani Hub',
      pandalSlug: 'hatibagan-sarbojanin',
      leg: '600m walk • ~9 mins',
      dwell: '45 mins darshan',
    },
    {
      time: '18:15',
      title: 'Return: Shyambazar Metro',
      type: 'RETURN',
      subtitle: 'Safe transit link back home or southwards',
      leg: 'Complete loop achieved',
      dwell: 'Journey Concluded',
    },
  ];

  const handlePandalClick = (slug?: string) => {
    if (!slug) return;
    const found = pandals.find((p) => p.slug === slug || p.id === slug);
    if (found) {
      setSelectedPandal(found);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E0C1C] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-[11px] font-semibold text-amber-400 mb-1.5">
            <Compass className="w-3 h-3" />
            <span>Curated One-Day Itinerary Preview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            North Kolkata Classical Heritage Trail
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            5 Verified Pandals • 3.4 km Walking • Zero Traffic Delays • Optimized for Afternoon to Evening
          </p>
        </div>

        <button
          onClick={() => setWizardOpen(true)}
          className="self-start sm:self-auto flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold px-4 py-2.5 text-xs sm:text-sm shadow-lg shadow-rose-950/40 transition-all hover:scale-105 active:scale-95"
        >
          <span>CUSTOMIZE THIS ROUTE</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-amber-500/30 ml-3 sm:ml-4 pl-4 sm:pl-6 space-y-6">
        {stops.map((stop, idx) => {
          const isPandal = stop.type === 'PANDAL';
          const isMetro = stop.type === 'METRO';
          const isReturn = stop.type === 'RETURN';

          return (
            <div key={idx} className="relative group">
              {/* Timeline Node Icon */}
              <div
                className={`absolute -left-[27px] sm:-left-[35px] top-1 w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-[10px] font-bold shadow-md transition-transform group-hover:scale-110 ${
                  isPandal
                    ? 'bg-gradient-to-br from-amber-400 to-rose-600 text-white'
                    : isMetro
                    ? 'bg-emerald-500 text-black'
                    : 'bg-zinc-700 text-zinc-200'
                }`}
              >
                {isPandal ? idx : isMetro ? <Train className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              </div>

              {/* Step Card */}
              <div
                onClick={() => isPandal && handlePandalClick(stop.pandalSlug)}
                className={`p-3.5 sm:p-4 rounded-xl border transition-all ${
                  isPandal
                    ? 'bg-[#151226]/80 hover:bg-[#1A1630] border-white/10 hover:border-amber-400/30 cursor-pointer shadow-sm'
                    : 'bg-white/5 border-white/5'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md">
                      {stop.time}
                    </span>
                    <h3 className="font-bold text-white text-sm sm:text-base group-hover:text-amber-300 transition-colors">
                      {stop.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-medium text-zinc-400">
                    ⏱ {stop.dwell}
                  </span>
                </div>

                <p className="text-xs text-zinc-300 mt-1">{stop.subtitle}</p>

                {stop.leg && (
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center gap-2 text-[11px] text-zinc-400 font-mono">
                    <Footprints className="w-3.5 h-3.5 text-amber-400/80" />
                    <span>Next leg: {stop.leg}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="p-4 rounded-2xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-300">
        <div className="flex items-center gap-4">
          <span>Stops: <strong className="text-white">4 Pandals + 2 Metro Links</strong></span>
          <span>Total Walk: <strong className="text-white">3.4 km (~48 mins)</strong></span>
          <span>Estimated Duration: <strong className="text-white">4h 15m</strong></span>
        </div>

        <button
          onClick={() => setActiveTab('route')}
          className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
        >
          <span>Open Full Interactive Route</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
