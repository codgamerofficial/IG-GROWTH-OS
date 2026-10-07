'use client';

// =============================================================================
// IG GrowthOS: Visual Content Calendar (Section 29)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Play,
  Copy,
  Plus,
} from 'lucide-react';
import { ContentItem } from '@/lib/supabase/types';

export function CalendarView() {
  const { contentItems, setActiveTab } = useGrowthOS();
  const [viewMode, setViewMode] = useState<'Month' | 'Week' | 'List'>('Month');

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <CalendarIcon className="h-6 w-6 text-rose-400" />
            <span>Content Calendar</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Visual publication timeline, scheduled batches, and publishing status.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-white/5 border border-white/10 p-1">
            {(['Month', 'Week', 'List'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                  viewMode === mode ? 'bg-rose-500 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={() => setActiveTab('studio')}
            className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-500 shadow-lg shadow-rose-600/20"
          >
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </button>
        </div>
      </div>

      {/* Calendar List View */}
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white mb-2">Upcoming Scheduled & Published Releases</h3>

        <div className="divide-y divide-white/5">
          {contentItems.map((item) => {
            const isPublished = item.status === 'PUBLISHED';
            const isScheduled = item.status === 'SCHEDULED';
            const isApproved = item.approval_status === 'APPROVED';

            return (
              <div
                key={item.id}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.01] px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10">
                    <span className="text-[10px] font-bold text-zinc-400 uppercase text-center leading-tight">
                      {item.content_type}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <span
                        className={`rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                          isPublished
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : isScheduled
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            : isApproved
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-zinc-700/50 text-zinc-300'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{item.hook || item.caption}</p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-zinc-500">
                      {item.scheduled_at && (
                        <span className="flex items-center gap-1 text-indigo-400 font-medium">
                          <Clock className="h-3 w-3" />
                          <span>Scheduled: {new Date(item.scheduled_at).toLocaleDateString()}</span>
                        </span>
                      )}
                      {item.published_at && (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Published: {new Date(item.published_at).toLocaleDateString()}</span>
                        </span>
                      )}
                      <span>Pillar: {item.content_pillar}</span>
                      <span>Score: {item.ai_score}/100</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => setActiveTab('approvals')}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-zinc-300 hover:text-white"
                  >
                    Manage
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
