'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Content Planner & Production Kanban
// Multi-Stage Production Matrix • Platform Badges • Drag & Move Scheduling
// =============================================================================

import React from 'react';
import {
  CreatorProject,
  CreatorStudioTab,
  ProjectLifecycleStatus,
} from '@/lib/riiqx/creator-types';
import {
  CalendarDays,
  Plus,
  Clock,
  Youtube,
  Instagram,
  ArrowRight,
  MoreVertical,
  Layers,
  FileText,
  Video,
} from 'lucide-react';

interface ContentPlannerTabProps {
  projects: CreatorProject[];
  onSelectProject: (proj: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
  onNewProject: () => void;
}

export function ContentPlannerTab({
  projects,
  onSelectProject,
  onTabChange,
  onNewProject,
}: ContentPlannerTabProps) {
  const columns: Array<{
    status: ProjectLifecycleStatus;
    title: string;
    badgeColor: string;
  }> = [
    { status: 'idea', title: 'Content Ideas', badgeColor: 'text-[#FFD43B] bg-[#FFD43B]/10 border border-[#FFD43B]/20' },
    { status: 'scripting', title: 'Script Studio', badgeColor: 'text-blue-400 bg-blue-500/10 border border-blue-500/20' },
    { status: 'editing', title: 'In Production', badgeColor: 'text-[#FF6B5E] bg-[#FF6B5E]/10 border border-[#FF6B5E]/20' },
    { status: 'ready_to_publish', title: 'Quality Review', badgeColor: 'text-amber-400 bg-amber-500/10 border border-amber-500/20' },
    { status: 'scheduled', title: 'Scheduled Queue', badgeColor: 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/20' },
    { status: 'published', title: 'Live Published', badgeColor: 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/20' },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <CalendarDays className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Content Production Planner &amp; Kanban
            </h1>
            <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD43B]">
              Visual Pipeline
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Track video assets across all 6 stages of development from initial idea to live audience publishing.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] px-4 py-2 text-xs font-black transition-all shadow-sm active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Content Plan</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 overflow-x-auto pb-4">
        {columns.map((col) => {
          const colProjects = projects.filter((p) => {
            if (col.status === 'idea') return p.status === 'idea' || p.status === 'draft';
            if (col.status === 'scripting') return p.status === 'scripting';
            if (col.status === 'editing') return p.status === 'editing' || p.status === 'producing' || p.status === 'planned';
            if (col.status === 'ready_to_publish') return p.status === 'ready_to_publish';
            if (col.status === 'scheduled') return p.status === 'scheduled';
            if (col.status === 'published') return p.status === 'published' || p.status === 'completed';
            return p.status === col.status;
          });

          return (
            <div
              key={col.status}
              className="flex flex-col rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-3.5 space-y-3 min-w-[200px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#2E2E2E]">
                <span className="text-xs font-bold text-white truncate">{col.title}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${col.badgeColor}`}
                >
                  {colProjects.length}
                </span>
              </div>

              {/* Cards in this stage */}
              <div className="space-y-2.5 flex-1 min-h-[300px]">
                {colProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj);
                      if (col.status === 'scripting') onTabChange('script');
                      else if (col.status === 'editing') onTabChange('editor');
                      else if (col.status === 'ready_to_publish') onTabChange('metadata');
                      else if (col.status === 'scheduled') onTabChange('queue');
                      else onTabChange('editor');
                    }}
                    className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 space-y-2 hover:border-[#FFD43B]/60 transition-all cursor-pointer shadow-xs hover:shadow-md"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold text-[#FFD43B] uppercase tracking-wider truncate max-w-[120px]">
                        {proj.brief.niche}
                      </span>
                      <div className="flex items-center gap-1 text-[#737373]">
                        {proj.brief.platform === 'both' ? (
                          <>
                            <Youtube className="h-3 w-3 text-red-500" />
                            <Instagram className="h-3 w-3 text-pink-500" />
                          </>
                        ) : proj.brief.platform === 'youtube_shorts' ? (
                          <Youtube className="h-3 w-3 text-red-500" />
                        ) : (
                          <Instagram className="h-3 w-3 text-pink-500" />
                        )}
                      </div>
                    </div>

                    <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">
                      {proj.name}
                    </h4>

                    <div className="flex items-center justify-between border-t border-[#2E2E2E] pt-2 text-[10px] text-[#737373]">
                      <span>{proj.brief.durationSeconds}s</span>
                      <span className="flex items-center gap-1 text-[#FFD43B] font-bold">
                        <span>Open</span>
                        <ArrowRight className="h-2.5 w-2.5" />
                      </span>
                    </div>
                  </div>
                ))}

                {colProjects.length === 0 && (
                  <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-[#2E2E2E] p-4 text-center text-[#737373]">
                    <span className="text-[11px]">No videos in stage</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
