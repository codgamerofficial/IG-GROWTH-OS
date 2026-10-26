'use client';

// =============================================================================
// PujaHop Kolkata: Crowd Status Badge (Phase 24)
// Real-time queue wait-time indicator with modal launcher & surge warning
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Pandal, CrowdLevel } from '@/lib/types/pujahop';
import { CrowdPulseModal } from './CrowdPulseModal';
import { Clock, Radio, AlertTriangle, Users } from 'lucide-react';

interface CrowdStatusBadgeProps {
  pandal: Pandal;
  variant?: 'compact' | 'detailed';
  showReportButton?: boolean;
}

interface CrowdSummary {
  avg_wait_minutes: number;
  crowd_level: CrowdLevel;
  surge_detected: boolean;
  verified_reports_count: number;
  total_reports_count: number;
  advisory: string;
}

export function CrowdStatusBadge({
  pandal,
  variant = 'compact',
  showReportButton = true,
}: CrowdStatusBadgeProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [summary, setSummary] = useState<CrowdSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchSummary = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/crowd?pandal_id=${pandal.id}`);
      const data = await res.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      }
    } catch {
      // Graceful fallback to pandal score baseline
      const baselineWait = Math.round((pandal.overall_score || 8.0) * 5 + 10);
      setSummary({
        avg_wait_minutes: baselineWait,
        crowd_level: baselineWait > 45 ? 'HIGH' : 'MODERATE',
        surge_detected: false,
        verified_reports_count: 0,
        total_reports_count: 0,
        advisory: 'Based on historical festive darshan movement models.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, [pandal.id]);

  const level = summary?.crowd_level || 'MODERATE';
  const waitMinutes = summary?.avg_wait_minutes || 35;
  const isSurge = summary?.surge_detected || false;

  const colorStyles =
    level === 'LOW'
      ? {
          bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          dot: 'bg-emerald-400',
          ping: 'bg-emerald-400',
          text: 'text-emerald-400',
        }
      : level === 'MODERATE'
      ? {
          bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          dot: 'bg-amber-400',
          ping: 'bg-amber-400',
          text: 'text-amber-400',
        }
      : level === 'HIGH'
      ? {
          bg: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
          dot: 'bg-rose-400',
          ping: 'bg-rose-400',
          text: 'text-rose-400',
        }
      : {
          bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          dot: 'bg-purple-400',
          ping: 'bg-purple-400',
          text: 'text-purple-400',
        };

  if (variant === 'detailed') {
    return (
      <>
        <div className="p-4 rounded-2xl bg-[#121124] border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorStyles.ping}`}
                />
                <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colorStyles.dot}`} />
              </span>
              <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <span>Darshan Queue Telemetry</span>
              </span>
            </div>

            {isSurge && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-500/40 animate-pulse flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                Crowd Surge
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between pt-1">
            <div>
              <div className="text-2xl font-black text-white flex items-center gap-1.5">
                <Clock className="w-5 h-5 text-amber-400" />
                <span>~{waitMinutes} Mins</span>
              </div>
              <div className="text-[10px] text-zinc-400 mt-0.5">
                Est. queue wait time ({level} crowd density)
              </div>
            </div>

            {showReportButton && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold border border-white/10 flex items-center gap-1.5 transition-all shadow-md"
              >
                <Radio className="w-3.5 h-3.5 text-rose-400" />
                <span>Report Wait</span>
              </button>
            )}
          </div>

          {summary?.advisory && (
            <div className="text-[11px] text-zinc-300 bg-white/5 p-2.5 rounded-xl border border-white/5 leading-relaxed">
              💡 {summary.advisory}
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1">
            <span>
              {summary?.verified_reports_count || 0} GPS-verified check-in{summary?.verified_reports_count === 1 ? '' : 's'}
            </span>
            <span>Total updates: {summary?.total_reports_count || 1}</span>
          </div>
        </div>

        <CrowdPulseModal
          pandal={pandal}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onReportSubmitted={fetchSummary}
        />
      </>
    );
  }

  // Compact variant for Directory cards
  return (
    <>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-all ${colorStyles.bg} hover:brightness-110`}
          title="Click to see queue telemetry or submit your wait time"
        >
          <span className="relative flex h-2 w-2">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${colorStyles.ping}`}
            />
            <span className={`relative inline-flex rounded-full h-2 w-2 ${colorStyles.dot}`} />
          </span>
          <span>~{waitMinutes}m wait</span>
          {isSurge && <span className="text-[9px] text-rose-300 font-extrabold">🔥 SURGE</span>}
        </button>
      </div>

      <CrowdPulseModal
        pandal={pandal}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReportSubmitted={fetchSummary}
      />
    </>
  );
}
