'use client';

// =============================================================================
// RIIQX Creator Studio — Content Planner & Production Kanban
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
    { status: 'idea', title: 'Content Ideas', badgeColor: 'text-amber-400 bg-amber-500/10' },
    { status: 'scripting', title: 'Script Studio', badgeColor: 'text-blue-400 bg-blue-500/10' },
    { status: 'editing', title: 'In Production', badgeColor: 'text-violet-400 bg-violet-500/10' },
    { status: 'ready_to_publish', title: 'Quality Review', badgeColor: 'text-purple-400 bg-purple-500/10' },
    { status: 'scheduled', title: 'Scheduled Queue', badgeColor: 'text-cyan-400 bg-cyan-500/10' },
    { status: 'published', title: 'Live Published', badgeColor: 'text-emerald-400 bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Content Production Planner</h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">
              Visual Workflow Matrix
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Track video assets across all 6 stages of development from initial idea to live audience publishing.
          </p>
        </div>

        <button
          onClick={onNewProject}
          className="flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" />
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
              className="flex flex-col rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-3.5 space-y-3 min-w-[200px]"
            >
              <div className="flex items-center justify-between pb-2 border-b border-[#1E2A4A]/60">
                <span className="text-xs font-bold text-white truncate">{col.title}</span>
                <span
                  className={`rounded-full px-2 py-0.2 text-[10px] font-black ${col.badgeColor}`}
                >
                  {colProjects.length}
                </span>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-[600px] no-scrollbar">
                {colProjects.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => {
                      onSelectProject(p);
                      if (col.status === 'scripting') onTabChange('script');
                      else if (col.status === 'editing') onTabChange('editor');
                      else if (col.status === 'ready_to_publish') onTabChange('metadata');
                      else if (col.status === 'scheduled') onTabChange('queue');
                      else if (col.status === 'published') onTabChange('published');
                    }}
                    className="rounded-xl border border-[#1E2A4A] bg-[#0B132B] p-3 hover:border-violet-500/60 cursor-pointer transition-all shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="capitalize">{p.brief.niche}</span>
                      <span className="font-mono">{p.brief.durationSeconds}s</span>
                    </div>

                    <h4 className="text-xs font-bold text-white line-clamp-2 leading-snug">
                      {p.name}
                    </h4>

                    <div className="flex items-center justify-between pt-1 border-t border-[#1E2A4A]/40 text-[10px]">
                      <span className="flex items-center gap-1 text-slate-400">
                        {p.brief.platform === 'youtube_shorts' ? (
                          <Youtube className="h-3 w-3 text-red-400" />
                        ) : (
                          <Instagram className="h-3 w-3 text-pink-400" />
                        )}
                        <span>Shorts</span>
                      </span>

                      <span className="text-violet-400 font-bold hover:underline">
                        Open →
                      </span>
                    </div>
                  </div>
                ))}

                {colProjects.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#1E2A4A] p-4 text-center text-[11px] text-slate-500">
                    Empty Stage
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
