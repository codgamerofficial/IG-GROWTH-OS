'use client';

// =============================================================================
// PujaHop Kolkata: Emergency SOS Mode (Section 19)
// Instant Access to 112, Kolkata Police Control, 24/7 Hospitals & Ambulance
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { VERIFIED_HOSPITALS, VERIFIED_POLICE_STATIONS } from '@/lib/data/kolkata-amenities';
import {
  X,
  ShieldAlert,
  PhoneCall,
  Hospital as HospIcon,
  Shield,
  MapPin,
  ExternalLink,
} from 'lucide-react';

export function EmergencyModal() {
  const { sosOpen, setSosOpen } = usePujaHop();

  if (!sosOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#1A0C16] border border-rose-500/40 shadow-2xl p-4 sm:p-6 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={() => setSosOpen(false)}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Alert */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400 flex-shrink-0 animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white">Emergency SOS Services</h2>
            <p className="text-xs text-rose-300 font-medium">Kolkata Emergency Helplines & Medical Stations</p>
          </div>
        </div>

        {/* PRIMARY HOTLINES (Phase 28: Official 112, 100, 1073 Traffic, Lalbazar, Ambulance) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
          <a
            href="tel:112"
            className="p-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex flex-col items-center justify-center text-center shadow-lg shadow-rose-950/50 transition-all active:scale-95"
          >
            <PhoneCall className="w-4 h-4 mb-1" />
            <div className="text-lg font-black">112</div>
            <div className="text-[9px] uppercase tracking-wider font-semibold opacity-90">
              National Helpline
            </div>
          </a>

          <a
            href="tel:100"
            className="p-3 rounded-2xl bg-[#2A1222] border border-rose-500/30 hover:border-rose-500/60 text-white flex flex-col items-center justify-center text-center transition-all"
          >
            <Shield className="w-4 h-4 text-rose-400 mb-1" />
            <div className="text-lg font-black text-rose-200">100</div>
            <div className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400">
              Police Emergency
            </div>
          </a>

          <a
            href="tel:1073"
            className="p-3 rounded-2xl bg-[#2A1222] border border-amber-500/30 hover:border-amber-500/60 text-white flex flex-col items-center justify-center text-center transition-all"
          >
            <PhoneCall className="w-4 h-4 text-amber-400 mb-1" />
            <div className="text-lg font-black text-amber-300">1073</div>
            <div className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400">
              Traffic Helpline
            </div>
          </a>

          <a
            href="tel:102"
            className="p-3 rounded-2xl bg-[#2A1222] border border-emerald-500/30 hover:border-emerald-500/60 text-white flex flex-col items-center justify-center text-center transition-all"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400 mb-1" />
            <div className="text-lg font-black text-emerald-300">102 / 108</div>
            <div className="text-[9px] uppercase tracking-wider font-semibold text-zinc-400">
              Ambulance
            </div>
          </a>
        </div>

        {/* 24/7 HOSPITALS LIST */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <HospIcon className="w-4 h-4 text-rose-400" />
            <span>Nearest 24/7 Government & Emergency Hospitals</span>
          </h3>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {VERIFIED_HOSPITALS.map((h) => (
              <div
                key={h.id}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{h.name}</div>
                  <div className="text-[11px] text-zinc-400">{h.address}</div>
                  <div className="text-[10px] text-emerald-400 mt-0.5">
                    ✔ 24/7 Trauma ICU Available • Nearest Metro: {h.nearest_metro}
                  </div>
                </div>
                <a
                  href={`tel:${h.emergency_number}`}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1 flex-shrink-0"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* POLICE STATIONS LIST */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-400" />
            <span>Kolkata Police Division Control Rooms</span>
          </h3>

          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {VERIFIED_POLICE_STATIONS.map((ps) => (
              <div
                key={ps.id}
                className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-bold text-white">{ps.name}</div>
                  <div className="text-[11px] text-zinc-400">{ps.address}</div>
                </div>
                <a
                  href={`tel:${ps.phone.replace(/[^0-9]/g, '')}`}
                  className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1 flex-shrink-0"
                >
                  <PhoneCall className="w-3 h-3" />
                  <span>Call</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
