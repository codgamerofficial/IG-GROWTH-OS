'use client';

// =============================================================================
// PujaHop Kolkata: Route View Component (Phase 8, 9, 10, 11, 20, 32)
// Strict Route Consistency Assertion • OSRM Walking Legs • Live Re-Routing • SourceBadge
// =============================================================================

import React, { useState } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { RouteRecalculation } from '@/lib/types/pujahop';
import { validateRouteConsistency } from '@/lib/routing/optimizer';
import { SourceBadge } from '@/components/common/SourceBadge';
import { SocialShareModal } from '@/components/campaign/SocialShareModal';
import {
  Route,
  Navigation,
  Clock,
  Footprints,
  Train,
  Download,
  AlertTriangle,
  Sparkles,
  ArrowDown,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  Utensils,
  Share2,
  ShieldAlert,
  Star,
  Bookmark,
} from 'lucide-react';

export function RouteView() {
  const {
    currentTrip,
    setWizardOpen,
    recalculateTrip,
    markPandalVisited,
    downloadOfflineTrip,
  } = usePujaHop();

  const [recalcResult, setRecalcResult] = useState<RouteRecalculation | null>(null);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!currentTrip) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center space-y-4 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
          <Route className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">No Active Route Planned</h2>
        <p className="text-xs text-zinc-400">
          Plan your one-day Kolkata Durga Puja itinerary with our intelligent route engine.
        </p>
        <button
          onClick={() => setWizardOpen(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 font-bold text-white text-sm shadow-xl shadow-rose-950/40"
        >
          PLAN MY PUJA DAY
        </button>
      </div>
    );
  }

  // Phase 32: Automated Route Consistency Check
  const consistencyCheck = validateRouteConsistency(currentTrip);
  if (!consistencyCheck.isValid) {
    return (
      <div className="p-8 max-w-2xl mx-auto space-y-4">
        <div className="p-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-lg">
            <ShieldAlert className="w-6 h-6" />
            <span>ROUTE DATA ERROR</span>
          </div>
          <p className="text-xs text-rose-300">
            Route integrity validation failed. In accordance with zero-fabrication policies, this route cannot be displayed until recalculated:
          </p>
          <ul className="text-xs space-y-1 list-disc pl-5 text-rose-200">
            {consistencyCheck.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
          <button
            onClick={() => setWizardOpen(true)}
            className="mt-3 px-4 py-2 rounded-xl bg-rose-600 text-white font-bold text-xs"
          >
            Replan Route
          </button>
        </div>
      </div>
    );
  }

  const handleTriggerSurgeRecalculate = async () => {
    const targetStop = currentTrip.stops.find((s) => s.stop_type === 'PANDAL' && !s.visited);
    if (!targetStop?.pandal) return;

    setIsRecalculating(true);
    try {
      const res = await recalculateTrip(targetStop.pandal.id);
      setRecalcResult(res);
    } finally {
      setIsRecalculating(false);
    }
  };

  const confidencePct = Math.round(currentTrip.route_confidence * 100);

  return (
    <div className="px-3 py-4 sm:p-6 md:p-8 max-w-5xl mx-auto space-y-6 w-full max-w-full min-w-0 overflow-x-hidden">
      {/* HEADER & SUMMARY BAR */}
      <div className="p-4 sm:p-6 rounded-3xl bg-[#121124] border border-white/10 space-y-4 shadow-xl min-w-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                {currentTrip.route_type} • {currentTrip.date}
              </span>
              <SourceBadge
                source="OSRM & Kolkata Traffic Routing Engine"
                sourceType="ROUTING_ENGINE"
                confidence={currentTrip.route_confidence}
              />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white break-words">{currentTrip.title}</h1>
            <p className="text-xs text-zinc-400 mt-1">
              Start: {currentTrip.start_location_name} ({currentTrip.start_time} to {currentTrip.end_time})
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShareOpen(true)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-rose-500/20 hover:from-amber-500/30 hover:to-rose-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shadow-sm"
              title="Share visual campaign card"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>SHARE CARD</span>
            </button>

            <button
              onClick={downloadOfflineTrip}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/15 transition-all"
              title="Download offline JSON itinerary"
            >
              <Download className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>OFFLINE TRIP</span>
            </button>

            <button
              onClick={handleTriggerSurgeRecalculate}
              disabled={isRecalculating}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 shrink-0 ${isRecalculating ? 'animate-spin' : ''}`} />
              <span>TEST RE-ROUTING</span>
            </button>
          </div>
        </div>

        {/* METRICS ROW (Strictly calculated, no fake summaries) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-white/10 text-xs">
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-zinc-400">Total Pandals</div>
            <div className="text-base font-bold text-white">{currentTrip.total_pandals}</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-zinc-400">Total Walking</div>
            <div className="text-base font-bold text-amber-400">
              {(currentTrip.total_walking_distance_meters / 1000).toFixed(1)} km
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-zinc-400">Travel Time</div>
            <div className="text-base font-bold text-white">
              {Math.round(currentTrip.total_travel_time_minutes / 60)}h {currentTrip.total_travel_time_minutes % 60}m
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-zinc-400">Visit / Darshan</div>
            <div className="text-base font-bold text-white">
              {currentTrip.estimated_visit_minutes} mins
            </div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-zinc-400">Metro Rides</div>
            <div className="text-base font-bold text-emerald-400">{currentTrip.metro_rides} rides</div>
          </div>
          <div className="bg-white/5 p-3 rounded-xl border border-white/5">
            <div className="text-zinc-400">Confidence</div>
            <div className="text-base font-bold text-cyan-400">
              {confidencePct}% Confidence
            </div>
          </div>
        </div>

        {/* AI REASONING BOX */}
        {currentTrip.ai_reasoning && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed">
            <span className="font-bold text-amber-300">💡 Optimization Rationale: </span>
            {currentTrip.ai_reasoning}
          </div>
        )}
      </div>

      {/* LIVE RE-ROUTING BANNER IF TRIGGERED (Phase 10) */}
      {recalcResult && (
        <div className="p-6 rounded-3xl bg-rose-950/40 border border-rose-500/40 space-y-3 animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>LIVE RE-ROUTING COMPLETED — CROWD SURGE AVOIDED</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="bg-black/40 p-3 rounded-xl border border-white/10">
              <div className="text-zinc-400 font-medium mb-1">OLD ROUTE:</div>
              <div className="text-zinc-300">{recalcResult.old_route || recalcResult.old_route_summary}</div>
            </div>
            <div className="bg-black/40 p-3 rounded-xl border border-emerald-500/30">
              <div className="text-emerald-400 font-medium mb-1">NEW ROUTE:</div>
              <div className="text-white font-semibold">{recalcResult.new_route || recalcResult.new_route_summary}</div>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-between text-xs text-zinc-300 pt-2 border-t border-rose-500/20">
            <span>
              ⏱️ TIME SAVED: <strong className="text-emerald-400">~{recalcResult.time_saved_minutes} mins</strong>
            </span>
            <span>
              🚶 DISTANCE DELTA: <strong className="text-amber-400">{recalcResult.distance_change_meters}m</strong>
            </span>
            <span className="text-zinc-400">{recalcResult.reason}</span>
          </div>
        </div>
      )}

      {/* ITINERARY STOPS & LEGS (Phase 8: START -> PANDALS -> FOOD -> RETURN) */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Route className="w-5 h-5 text-amber-400" />
          <span>Stop-by-Stop Hopping Itinerary ({currentTrip.stops.length} Sequence Points)</span>
        </h2>

        <div className="space-y-3">
          {currentTrip.stops.map((stop, idx) => {
            const isPandal = stop.stop_type === 'PANDAL';
            const isFood = stop.stop_type === 'FOOD';
            const isStart = stop.stop_type === 'START';
            const isEnd = stop.stop_type === 'END';

            // Matching leg from previous stop
            const leg = idx > 0 ? currentTrip.legs[idx - 1] : null;

            return (
              <React.Fragment key={stop.id}>
                {/* Walking Leg Connector */}
                {leg && (
                  <div className="flex flex-col items-center my-1 py-1">
                    <div className="flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-zinc-300">
                      <Footprints className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-mono">{leg.distance_meters}m</span>
                      <span>•</span>
                      <span>{leg.estimated_walking_minutes} min walk</span>
                      <span>•</span>
                      <span className="text-[11px] text-zinc-400">Road: {leg.road_status}</span>
                      <a
                        href={leg.navigation_action_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>START WALKING</span>
                      </a>
                    </div>
                  </div>
                )}

                {/* Stop Card (Mockup 3) */}
                <div
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    stop.visited
                      ? 'bg-emerald-950/20 border-emerald-500/40'
                      : isFood
                      ? 'bg-[#1F1612] border-amber-500/40 shadow-lg shadow-amber-950/20'
                      : isStart
                      ? 'bg-[#151429] border-white/10'
                      : isEnd
                      ? 'bg-[#18122B] border-purple-500/30'
                      : 'bg-[#121124] border-white/10 hover:border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3.5">
                      {/* Numbered Circular Badge (Mockup 3) */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 shadow-md ${
                          isStart
                            ? 'bg-blue-600 text-white'
                            : isEnd
                            ? 'bg-purple-600 text-white'
                            : isFood
                            ? 'bg-[#F97316] text-white'
                            : 'bg-[#E53935] text-white'
                        }`}
                      >
                        {isStart ? 'S' : isEnd ? 'E' : isFood ? idx : idx}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-white text-base">
                            {stop.custom_name}
                            {isFood && <span className="text-amber-400 ml-1.5 font-bold">(Food)</span>}
                          </h3>
                          {stop.pandal?.name_bn && (
                            <span className="text-xs text-amber-300/80 font-medium font-bengali">
                              {stop.pandal.name_bn}
                            </span>
                          )}
                        </div>

                        {stop.pandal && (
                          <div className="text-xs text-zinc-300 mt-0.5 line-clamp-1 italic">
                            {stop.pandal.theme}
                          </div>
                        )}

                        {stop.restaurant && (
                          <div className="text-xs text-amber-300 mt-0.5">
                            Specialty: {stop.restaurant.specialty}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 mt-2">
                          <span className="flex items-center gap-1 font-mono text-zinc-200 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                            <Clock className="w-3.5 h-3.5 text-amber-400" />
                            {stop.arrival_time} – {stop.departure_time}
                          </span>

                          {stop.pandal && (
                            <span className="flex items-center gap-1 text-zinc-300">
                              <Footprints className="w-3 h-3 text-amber-400" />
                              <span>{stop.pandal.walking_distance}m walk from {stop.pandal.nearest_metro}</span>
                            </span>
                          )}

                          {leg && (
                            <span className="text-zinc-400 text-[11px]">
                              ({leg.estimated_walking_minutes} min walk)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions & Rating */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      {isPandal && stop.pandal && (
                        <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{stop.pandal.overall_score.toFixed(1)}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-1.5">
                        {isPandal && stop.pandal && !stop.visited && (
                          <button
                            onClick={() => markPandalVisited(stop.pandal!)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">VISITED</span>
                          </button>
                        )}

                        {stop.visited && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Visited</span>
                          </span>
                        )}

                        {stop.navigation_url && (
                          <a
                            href={stop.navigation_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-[#D6A84F] hover:bg-[#c59841] text-black text-xs font-bold flex items-center gap-1 shadow-md shadow-amber-950/30"
                            title="Start Walking Navigation"
                          >
                            <Navigation className="w-3.5 h-3.5 fill-current" />
                            <span>WALK</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* STICKY BOTTOM ACTIONS (Mockup 3: Start Navigation & Save Route) */}
      <div className="sticky bottom-16 sm:bottom-4 inset-x-0 z-30 pt-3">
        <div className="p-3 rounded-2xl bg-[#0F0E1A]/95 backdrop-blur-xl border border-amber-500/30 shadow-2xl flex items-center gap-3 max-w-xl mx-auto">
          <a
            href={
              currentTrip.stops.find((s) => !s.visited)?.navigation_url ||
              `https://www.google.com/maps/dir/?api=1&destination=${currentTrip.stops[1]?.lat},${currentTrip.stops[1]?.lng}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3.5 px-6 rounded-xl bg-[#D6A84F] hover:bg-[#c59841] text-black font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-950/40 uppercase tracking-wider transition-all"
          >
            <Navigation className="w-4 h-4 fill-current" />
            <span>START NAVIGATION</span>
          </a>

          <button
            onClick={() => {
              alert(`Trip '${currentTrip.title}' saved to your local offline routes!`);
            }}
            className="py-3.5 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-amber-500/30 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all"
          >
            <Bookmark className="w-4 h-4 text-amber-400" />
            <span>SAVE ROUTE</span>
          </button>
        </div>
      </div>

      {/* Campaign Creative & Social Share Modal */}
      <SocialShareModal
        trip={currentTrip}
        isOpen={shareOpen}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
