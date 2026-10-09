'use client';

// =============================================================================
// PujaHop Kolkata: Metro Intelligence Layer View (Section 9)
// Kolkata Metro Lines • Stations • Interchanges • Date-Aware Puja Night Timetable
// =============================================================================

import React, { useState } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { getMetroOperatingSchedule } from '@/lib/data/kolkata-metro';
import {
  Train,
  Clock,
  Layers,
  ArrowRight,
  Sparkles,
  MapPin,
  Compass,
} from 'lucide-react';

export function MetroView() {
  const { metroLines, metroStations, selectedDate, setSelectedPandal, pandals } = usePujaHop();
  const [selectedLine, setSelectedLine] = useState<string>('all');

  const schedule = getMetroOperatingSchedule(selectedDate);

  const filteredStations = metroStations.filter(
    (s) => selectedLine === 'all' || s.line_id === selectedLine
  );

  return (
    <div className="px-3 py-4 sm:p-6 md:p-8 max-w-7xl mx-auto space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <Train className="w-7 h-7 text-emerald-400 shrink-0" />
            <span>Kolkata Metro Intelligence</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Official Kolkata Metro Railway lines, station connections, interchanges, and special Puja night services.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-zinc-300 text-xs font-semibold self-start md:self-auto">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{schedule.statusLabel}</span>
        </div>
      </div>

      {/* TIMETABLE NOTICE BOX WITH REAL SOURCE CITATION */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#121124] border border-white/10 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <Train className="w-4 h-4 shrink-0" />
            <span>Kolkata Metro Schedule ({selectedDate})</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono">
            Source: {schedule.source}
          </span>
        </div>
        <p className="text-xs text-zinc-300 leading-relaxed">{schedule.notes}</p>
        <div className="flex flex-wrap gap-3 sm:gap-4 text-xs text-zinc-400 pt-1 border-t border-white/5">
          <span>
            Operating Hours: <strong className="text-white">06:50 – {schedule.lastTrainTime}</strong>
          </span>
          <span>
            Headway: <strong className="text-white">~{schedule.frequencyMinutes} min peak frequency</strong>
          </span>
          <span>
            Interchange Hub: <strong className="text-amber-400">Esplanade (Blue & Green Lines)</strong>
          </span>
          <span>
            Verified: <strong className="text-zinc-300">09 Oct 2026</strong>
          </span>
        </div>
      </div>

      {/* LINE SELECTOR TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar max-w-full">
        <button
          onClick={() => setSelectedLine('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
            selectedLine === 'all'
              ? 'bg-white/20 text-white font-bold'
              : 'bg-white/5 text-zinc-400 hover:text-white'
          }`}
        >
          All Operational Lines
        </button>

        {metroLines.map((line) => (
          <button
            key={line.id}
            onClick={() => setSelectedLine(line.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              selectedLine === line.id
                ? 'bg-rose-600 text-white font-bold shadow-md'
                : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: line.color }} />
            <span>{line.name.split('(')[0].trim()}</span>
          </button>
        ))}
      </div>

      {/* STATIONS LIST GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStations.map((station) => (
          <div
            key={station.id}
            className="p-5 rounded-2xl bg-[#121124] border border-white/10 hover:border-emerald-500/30 transition-all space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-white text-base">{station.name}</h3>
                <p className="text-xs text-emerald-300 font-medium">{station.name_bn}</p>
              </div>

              {station.is_interchange && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  INTERCHANGE
                </span>
              )}
            </div>

            <div className="text-xs text-zinc-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>{station.line_name}</span>
            </div>

            {/* Nearest Pandals Linked */}
            <div className="pt-2 border-t border-white/5 space-y-1.5">
              <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                Nearest Pandals within walking distance:
              </div>

              {station.nearest_pandals.length > 0 ? (
                <div className="space-y-1">
                  {station.nearest_pandals.map((pandalName) => {
                    const match = pandals.find((p) => p.name === pandalName);
                    return (
                      <div
                        key={pandalName}
                        onClick={() => match && setSelectedPandal(match)}
                        className="text-xs text-zinc-200 hover:text-amber-300 cursor-pointer flex items-center justify-between p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <span className="truncate">🪔 {pandalName}</span>
                        {match && (
                          <span className="text-[10px] font-mono text-zinc-400 ml-2">
                            {match.walking_distance}m
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-[11px] text-zinc-500 italic">No major blockbuster pandal within 1km.</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
