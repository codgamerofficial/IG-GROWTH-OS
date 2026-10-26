'use client';

// =============================================================================
// PujaHop Kolkata: Master Editorial Footer
// Section 53: Cultural identity, verified data sources disclosure & legal notice
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { Logo } from '@/components/brand/Logo';
import { ShieldCheck, Heart, Sparkles, MapPin, Compass } from 'lucide-react';

export function Footer() {
  const { setActiveTab, setWizardOpen, setSosOpen, pandals } = usePujaHop();

  return (
    <footer className="w-full border-t border-white/10 bg-[#070611] text-zinc-400 py-12 px-4 sm:px-6 md:px-8 mt-12">
      <div className="max-w-7xl mx-auto space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand & Manifesto Column */}
          <div className="md:col-span-5 space-y-3">
            <Logo variant="horizontal" size="md" showTagline={true} />
            <p className="font-bengali text-xs sm:text-sm text-amber-200/90 leading-relaxed pt-2">
              “পুজো শুধু মণ্ডপ নয়, এটা একটা শহরের গল্প।”
            </p>
            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              PujaHop Kolkata is a real-data driven Durga Puja one-day itinerary companion.
              Built with mathematical route consistency, honest uncertainty reporting, and authentic
              Bengali cultural identity.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono pt-1">
              <span>Verified Directory:</span>
              <strong className="text-amber-400">{pandals.length} Official Pandals</strong>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="md:col-span-3 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Navigation</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Explore Map & Amenities
                </button>
              </li>
              <li>
                <button
                  onClick={() => setWizardOpen(true)}
                  className="hover:text-amber-400 transition-colors"
                >
                  One-Day Route Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('metro')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Kolkata Metro Schedule
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('pandals')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Pandal Directory & Themes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('passport')}
                  className="hover:text-amber-400 transition-colors"
                >
                  Digital Puja Passport
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('about')}
                  className="hover:text-amber-400 transition-colors text-amber-300/90 font-medium"
                >
                  About &amp; Cultural Story
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSosOpen(true)}
                  className="text-rose-400 hover:text-rose-300 transition-colors font-semibold"
                >
                  Emergency Contacts (112 / 1073)
                </button>
              </li>
            </ul>
          </div>

          {/* Sourced Provenance Registry */}
          <div className="md:col-span-4 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Authoritative Data Sources</span>
            </h4>
            <div className="space-y-2 text-[11px] text-zinc-400 bg-white/5 p-3.5 rounded-2xl border border-white/5">
              <div className="flex items-start justify-between gap-2">
                <span>Calendar Dates:</span>
                <span className="text-zinc-200 font-semibold text-right">WB Gov SAHAJ Portal</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span>Traffic Restrictions:</span>
                <span className="text-zinc-200 font-semibold text-right">Kolkata Police Lalbazar</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span>Metro Operating Hours:</span>
                <span className="text-zinc-200 font-semibold text-right">Kolkata Metro Railway</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span>Walking Geometry:</span>
                <span className="text-zinc-200 font-semibold text-right">OpenStreetMap &amp; OSRM</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span>Live Weather:</span>
                <span className="text-zinc-200 font-semibold text-right">Open-Meteo API</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Official Creator Attribution */}
        <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="space-y-1 text-center md:text-left">
            <div className="text-white font-medium flex items-center justify-center md:justify-start gap-1.5">
              <span>© 2026 PujaHop Kolkata.</span>
              <span className="text-zinc-600 hidden sm:inline">•</span>
              <span className="text-amber-400 font-semibold">
                Created &amp; Conceptualized by Saswata Dey (Riik)
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              An independent cultural-tech experience by Saswata Dey (Riik).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-[11px] text-zinc-500">
            <span className="text-zinc-400">Honest Unknown &gt; Fake Certainty</span>
            <span>•</span>
            <span className="text-zinc-400">Current Data &gt; Old Static Data</span>
            <span>•</span>
            <button
              onClick={() => setActiveTab('about')}
              className="text-amber-400/90 hover:text-amber-300 transition-colors font-medium underline underline-offset-2"
            >
              Creator &amp; Story
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
