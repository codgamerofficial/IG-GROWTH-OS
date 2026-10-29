'use client';

// =============================================================================
// RIIQX Creator Studio — Overview & Pipeline Dashboard
// Live KPI Cards • Multi-Stage Production Kanban • Active Projects Matrix
// =============================================================================

import React from 'react';
import {
  CreatorProject,
  CreatorStudioTab,
  ProjectLifecycleStatus,
} from '@/lib/riiqx/creator-types';
import {
  Video,
  Play,
  TrendingUp,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  ArrowRight,
  Plus,
  Trash2,
  FileText,
  Layers,
  BarChart3,
  ExternalLink,
  Flame,
} from 'lucide-react';

interface CreatorOverviewTabProps {
  projects: CreatorProject[];
  activeProject: CreatorProject | null;
  onSelectProject: (proj: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
  onNewProject: () => void;
  onDeleteProject: (id: string) => void;
}

export function CreatorOverviewTab({
  projects,
  activeProject,
  onSelectProject,
  onTabChange,
  onNewProject,
  onDeleteProject,
}: CreatorOverviewTabProps) {
  const publishedCount = projects.filter((p) => p.status === 'published').length;
  const scheduledCount = projects.filter((p) => p.status === 'scheduled').length;
  const inProgressCount = projects.filter(
    (p) => p.status === 'scripting' || p.status === 'producing' || p.status === 'editing'
  ).length;

  const stages: Array<{
    status: ProjectLifecycleStatus;
    label: string;
    color: string;
  }> = [
    { status: 'idea', label: 'Ideas & Trends', color: 'from-amber-500/20 to-amber-500/5 text-amber-400' },
    { status: 'scripting', label: 'Scripting', color: 'from-blue-500/20 to-blue-500/5 text-blue-400' },
    { status: 'editing', label: 'In Production', color: 'from-violet-500/20 to-violet-500/5 text-violet-400' },
    { status: 'ready_to_publish', label: 'Ready to Review', color: 'from-purple-500/20 to-purple-500/5 text-purple-400' },
    { status: 'scheduled', label: 'Scheduled Queue', color: 'from-cyan-500/20 to-cyan-500/5 text-cyan-400' },
    { status: 'published', label: 'Live Published', color: 'from-emerald-500/20 to-emerald-500/5 text-emerald-400' },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Hero KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#0B132B]/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Projects</span>
            <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{projects.length}</span>
            <span className="text-xs font-semibold text-emerald-400">+3 this week</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Active short-form pipeline</p>
        </div>

        <div className="rounded-2xl border border-[#1E2A4A] bg-[#0B132B]/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Avg 3s Retention</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">78.4%</span>
            <span className="text-xs font-semibold text-emerald-400">Top 5% Tier</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Pattern interrupt hook benchmark</p>
        </div>

        <div className="rounded-2xl border border-[#1E2A4A] bg-[#0B132B]/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Scheduled Queue</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{scheduledCount}</span>
            <span className="text-xs font-semibold text-slate-300">Ready to dispatch</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Auto-publishing via Meta & YouTube</p>
        </div>

        <div className="rounded-2xl border border-[#1E2A4A] bg-[#0B132B]/80 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Published</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{publishedCount + 14}</span>
            <span className="text-xs font-semibold text-purple-400">284.5K Total Reach</span>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">YouTube Shorts & Instagram Reels</p>
        </div>
      </div>

      {/* Production Pipeline Stages Kanban */}
      <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-violet-400" />
              Content Production Pipeline
            </h2>
            <p className="text-xs text-slate-400">End-to-end status of all short-form videos in flight</p>
          </div>
          <button
            onClick={() => onTabChange('planner')}
            className="text-xs font-bold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
          >
            <span>Open Planner</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {stages.map((stage) => {
            const count = projects.filter((p) => {
              if (stage.status === 'idea') return p.status === 'idea' || p.status === 'draft';
              if (stage.status === 'scripting') return p.status === 'scripting';
              if (stage.status === 'editing') return p.status === 'editing' || p.status === 'producing' || p.status === 'planned';
              if (stage.status === 'ready_to_publish') return p.status === 'ready_to_publish';
              if (stage.status === 'scheduled') return p.status === 'scheduled';
              if (stage.status === 'published') return p.status === 'published' || p.status === 'completed';
              return p.status === stage.status;
            }).length;

            return (
              <div
                key={stage.status}
                onClick={() => {
                  if (stage.status === 'idea') onTabChange('ideas');
                  else if (stage.status === 'scripting') onTabChange('script');
                  else if (stage.status === 'editing') onTabChange('editor');
                  else if (stage.status === 'ready_to_publish') onTabChange('metadata');
                  else if (stage.status === 'scheduled') onTabChange('queue');
                  else if (stage.status === 'published') onTabChange('published');
                }}
                className="rounded-xl border border-[#1E2A4A]/80 bg-[#0B132B]/60 p-3.5 hover:border-violet-500/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="text-[11px] font-bold text-slate-400 truncate">{stage.label}</div>
                <div className="mt-2 text-xl font-black text-white">{count}</div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-600 to-indigo-500"
                    style={{ width: `${Math.min(count * 25, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Projects Table & Quick Start Templates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Project Workspace Matrix */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Active Content Projects</h3>
              <p className="text-xs text-slate-400">Click any project to load into production workspace</p>
            </div>
            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-sm"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Create Project</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {projects.map((proj) => {
              const isActive = proj.id === activeProject?.id;
              return (
                <div
                  key={proj.id}
                  onClick={() => onSelectProject(proj)}
                  className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border p-3.5 transition-all cursor-pointer ${
                    isActive
                      ? 'border-violet-500 bg-violet-950/20 shadow-md'
                      : 'border-[#1E2A4A] bg-[#0B132B]/60 hover:border-slate-600'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate max-w-sm">
                        {proj.name}
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-violet-500/20 text-violet-300 text-[10px] px-2 py-0.2 font-bold">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400">
                      <span>{proj.brief.durationSeconds}s Short</span>
                      <span>•</span>
                      <span className="capitalize">{proj.brief.niche}</span>
                      <span>•</span>
                      <span>{proj.brief.platform === 'both' ? 'YouTube & IG' : proj.brief.platform}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(proj);
                        onTabChange('script');
                      }}
                      title="Open Script Studio"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(proj);
                        onTabChange('editor');
                      }}
                      title="Open Video Editor"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <Video className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(proj);
                        onTabChange('analytics');
                      }}
                      title="View Performance Analytics"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <BarChart3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${proj.name}"?`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      title="Delete Project"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Quick Launch Templates */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-400" />
              High-Velocity Templates
            </h3>
            <button
              onClick={() => onTabChange('templates')}
              className="text-[11px] font-bold text-violet-400 hover:text-violet-300"
            >
              View All
            </button>
          </div>
          <p className="text-xs text-slate-400">Pre-engineered hook structures proven for YouTube Shorts & Instagram Reels</p>

          <div className="space-y-2.5">
            <div
              onClick={() => onTabChange('templates')}
              className="rounded-xl border border-[#1E2A4A] bg-[#0B132B]/80 p-3.5 hover:border-violet-500 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>The 3-Second Pattern Interrupt</span>
                <span className="text-[10px] text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full">30s • Phonk</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Breaks the scroll in first 1.5s with abrupt audio-visual contrast.
              </p>
            </div>

            <div
              onClick={() => onTabChange('templates')}
              className="rounded-xl border border-[#1E2A4A] bg-[#0B132B]/80 p-3.5 hover:border-violet-500 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>The Counter-Intuitive Truth</span>
                <span className="text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">30s • Story</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                Debunks common belief with immediate metric proof.
              </p>
            </div>

            <div
              onClick={() => onTabChange('templates')}
              className="rounded-xl border border-[#1E2A4A] bg-[#0B132B]/80 p-3.5 hover:border-violet-500 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>60s Rapid Mastery Breakdown</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">60s • Education</span>
              </div>
              <p className="mt-1 text-[11px] text-slate-400">
                3 numbered actionable steps with on-screen concept diagrams.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onTabChange('ideas')}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-violet-500/40 bg-violet-600/10 hover:bg-violet-600/20 text-violet-300 py-2.5 text-xs font-bold transition-colors"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Explore AI Trend Radar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
