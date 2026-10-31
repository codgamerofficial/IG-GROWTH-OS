'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Overview & Production Command Center
// Live KPI Cards • Production Kanban • One-Click Repurpose • AI Compute Meter
// =============================================================================

import React, { useState } from 'react';
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
  Scissors,
  Zap,
  ShieldCheck,
  DollarSign,
  Cpu,
  Check,
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

  // One-Click Repurpose State
  const [repurposeUrl, setRepurposeUrl] = useState('');
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [repurposedClips, setRepurposedClips] = useState<Array<{
    id: string;
    title: string;
    hookScore: number;
    duration: string;
    hook: string;
  }> | null>(null);

  const stages: Array<{
    status: ProjectLifecycleStatus;
    label: string;
  }> = [
    { status: 'idea', label: 'Ideas & Trends' },
    { status: 'scripting', label: 'Scripting' },
    { status: 'editing', label: 'In Production' },
    { status: 'ready_to_publish', label: 'Ready to Review' },
    { status: 'scheduled', label: 'Scheduled Queue' },
    { status: 'published', label: 'Live Published' },
  ];

  const handleRunRepurpose = () => {
    if (!repurposeUrl.trim()) return;
    setIsRepurposing(true);
    setRepurposedClips(null);

    setTimeout(() => {
      setIsRepurposing(false);
      setRepurposedClips([
        {
          id: 'clip_01',
          title: 'The 3-Second Pattern Interrupt',
          hookScore: 94,
          duration: '32s',
          hook: 'Most creators think high-end cameras matter. But here is the real metric that drives 80% of retention.',
        },
        {
          id: 'clip_02',
          title: 'The Counter-Intuitive Truth',
          hookScore: 89,
          duration: '45s',
          hook: 'Why cloud-first AI workflows beat local workstations every single time in 2026.',
        },
        {
          id: 'clip_03',
          title: 'The Actionable 60s Framework',
          hookScore: 91,
          duration: '58s',
          hook: '3 prompt hacks you can use right now to make Claude Sonnet 10x more accurate.',
        },
      ]);
    }, 1500);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Quick Launch Banner for AI Creation Lab & Autopilot */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* AI Creation Lab CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-[#2E2E2E] bg-gradient-to-r from-[#1E1B18] via-[#1A1A1A] to-[#151515] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#FFD43B]/30 bg-[#FFD43B]/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#FFD43B]">
                <Sparkles className="h-3 w-3" />
                Creator Studio 2.0
              </span>
              <h2 className="text-base font-bold text-white">AI Creation Lab</h2>
              <p className="text-xs text-[#A3A3A3] max-w-md">
                Text-to-Video, Image-to-Video, AI Avatar, and multi-model routing with real-time cost estimation.
              </p>
            </div>
            <button
              onClick={() => onTabChange('ai_creation')}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] px-3.5 py-2 text-xs font-black text-[#151515] shadow-sm transition-all shrink-0"
            >
              <span>Open Creation Lab</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Autopilot Safety CTA */}
        <div className="relative overflow-hidden rounded-2xl border border-[#2E2E2E] bg-gradient-to-r from-[#151E1A] via-[#1A1A1A] to-[#151515] p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                <ShieldCheck className="h-3 w-3" />
                Approval-Based Autopilot
              </span>
              <h2 className="text-base font-bold text-white">Safety &amp; Dispatch Queue</h2>
              <p className="text-xs text-[#A3A3A3] max-w-md">
                Human-in-the-loop social dispatcher. Review and approve queued posts for Instagram and YouTube.
              </p>
            </div>
            <button
              onClick={() => onTabChange('autopilot')}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-400 shadow-sm transition-all shrink-0"
            >
              <span>View Autopilot</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hero KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Projects */}
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Total Projects
            </span>
            <div className="p-2 rounded-xl bg-[#202020] text-[#FFD43B]">
              <Video className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{projects.length}</span>
            <span className="text-xs font-semibold text-emerald-400">+3 this week</span>
          </div>
          <p className="mt-1 text-[11px] text-[#737373]">Active short-form pipeline</p>
        </div>

        {/* Avg 3s Retention */}
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Avg 3s Retention
            </span>
            <div className="p-2 rounded-xl bg-[#202020] text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">78.4%</span>
            <span className="text-xs font-semibold text-emerald-400">Top 5% Tier</span>
          </div>
          <p className="mt-1 text-[11px] text-[#737373]">Pattern interrupt hook benchmark</p>
        </div>

        {/* Scheduled Queue */}
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Scheduled Queue
            </span>
            <div className="p-2 rounded-xl bg-[#202020] text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{scheduledCount}</span>
            <span className="text-xs font-semibold text-[#A3A3A3]">Ready to dispatch</span>
          </div>
          <p className="mt-1 text-[11px] text-[#737373]">Auto-publishing via Meta &amp; YouTube</p>
        </div>

        {/* Live Published */}
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#737373]">
              Live Published
            </span>
            <div className="p-2 rounded-xl bg-[#202020] text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{publishedCount}</span>
            <span className="text-xs font-semibold text-emerald-400">
              {publishedCount > 0 ? `${publishedCount} Live` : 'No posts yet'}
            </span>
          </div>
          <p className="mt-1 text-[11px] text-[#737373]">YouTube Shorts &amp; Instagram Reels</p>
        </div>
      </div>

      {/* One-Click Repurpose Tool Section */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Scissors className="h-4 w-4 text-[#FFD43B]" />
              One-Click Social Repurpose
            </h2>
            <p className="text-xs text-[#737373]">
              Paste a long YouTube video link or podcast to automatically extract 3 high-hook vertical clips.
            </p>
          </div>
          <span className="text-[10px] font-bold text-[#FFD43B] bg-[#FFD43B]/10 px-2.5 py-1 rounded-full border border-[#FFD43B]/20 self-start sm:self-auto">
            AI Auto-Hook &amp; Subtitles
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={repurposeUrl}
            onChange={(e) => setRepurposeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=... or enter video topic"
            className="flex-1 rounded-xl border border-[#2E2E2E] bg-[#151515] px-3.5 py-2.5 text-xs text-white placeholder-[#737373] focus:border-[#FFD43B] focus:outline-none"
          />
          <button
            onClick={handleRunRepurpose}
            disabled={isRepurposing || !repurposeUrl.trim()}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] px-5 py-2.5 text-xs font-bold text-[#151515] transition-all disabled:opacity-50 shrink-0"
          >
            {isRepurposing ? (
              <>
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                <span>Analyzing Video...</span>
              </>
            ) : (
              <>
                <Zap className="h-3.5 w-3.5 fill-current" />
                <span>Extract Vertical Clips</span>
              </>
            )}
          </button>
        </div>

        {/* Repurposed Clips Result Display */}
        {repurposedClips && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            {repurposedClips.map((clip) => (
              <div
                key={clip.id}
                className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3.5 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{clip.title}</span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      {clip.hookScore}% Hook
                    </span>
                  </div>
                  <p className="mt-2 text-[11px] text-[#A3A3A3] line-clamp-2 italic">
                    &ldquo;{clip.hook}&rdquo;
                  </p>
                </div>
                <div className="pt-2 border-t border-[#2E2E2E] flex items-center justify-between text-[10px]">
                  <span className="text-[#737373]">{clip.duration} • 9:16</span>
                  <button
                    onClick={() => onTabChange('editor')}
                    className="font-bold text-[#FFD43B] hover:underline flex items-center gap-1"
                  >
                    <span>Edit in Timeline</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Production Pipeline Stages Kanban */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#FFD43B]" />
              Content Production Pipeline
            </h2>
            <p className="text-xs text-[#737373]">
              End-to-end status of all short-form videos in flight
            </p>
          </div>
          <button
            onClick={() => onTabChange('planner')}
            className="text-xs font-bold text-[#FFD43B] hover:underline flex items-center gap-1 transition-colors"
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
              if (stage.status === 'editing')
                return p.status === 'editing' || p.status === 'producing' || p.status === 'planned';
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
                className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3.5 hover:border-[#FFD43B]/50 cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="text-[11px] font-bold text-[#737373] truncate">{stage.label}</div>
                <div className="mt-2 text-xl font-black text-white">{count}</div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-[#151515] overflow-hidden">
                  <div
                    className="h-full bg-[#FFD43B]"
                    style={{ width: `${Math.min(count * 25, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Projects Table & AI Compute Cost Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Project Workspace Matrix */}
        <div className="lg:col-span-2 rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Active Content Projects</h3>
              <p className="text-xs text-[#737373]">Click any project to load into production workspace</p>
            </div>
            <button
              onClick={onNewProject}
              className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] px-3 py-1.5 text-xs font-bold transition-all shadow-xs"
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
                      ? 'border-[#FFD43B] bg-[#FFD43B]/10 shadow-xs'
                      : 'border-[#2E2E2E] bg-[#202020] hover:border-[#3E3E3E]'
                  }`}
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white truncate max-w-sm">
                        {proj.name}
                      </span>
                      {isActive && (
                        <span className="rounded-full bg-[#FFD43B] text-[#151515] text-[10px] px-2 py-0.2 font-black">
                          Active
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-[#737373]">
                      <span>{proj.brief.durationSeconds}s Short</span>
                      <span>•</span>
                      <span className="capitalize">{proj.brief.niche}</span>
                      <span>•</span>
                      <span>
                        {proj.brief.platform === 'both' ? 'YouTube & IG' : proj.brief.platform}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(proj);
                        onTabChange('script');
                      }}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-[#FFD43B] hover:bg-[#151515] transition-colors"
                      title="Open in Script Studio"
                    >
                      <FileText className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProject(proj);
                        onTabChange('editor');
                      }}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-[#FFD43B] hover:bg-[#151515] transition-colors"
                      title="Open in Video Editor"
                    >
                      <Video className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Delete project "${proj.name}"?`)) {
                          onDeleteProject(proj.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#737373] hover:text-red-400 hover:bg-[#151515] transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Real Cost Management & Model Health */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-[#FFD43B]" />
                Real Cost Management
              </span>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                In Budget
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#A3A3A3]">Today&apos;s Compute Spend</span>
                  <span className="font-bold text-white">$0.042 / $50.00</span>
                </div>
                <div className="h-1.5 w-full bg-[#202020] rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFD43B]" style={{ width: '0.8%' }} />
                </div>
              </div>

              <div className="border-t border-[#2E2E2E] pt-3 space-y-2 text-[11px]">
                <div className="flex justify-between text-[#737373]">
                  <span>AWS Bedrock (Claude 3.7)</span>
                  <span className="text-white font-medium">8,420 tokens ($0.025)</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>Groq LPU (Qwen 2.5)</span>
                  <span className="text-white font-medium">12,100 tokens ($0.007)</span>
                </div>
                <div className="flex justify-between text-[#737373]">
                  <span>OpenRouter (FLUX.1)</span>
                  <span className="text-white font-medium">3 images ($0.010)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
              <Flame className="h-4 w-4 text-[#FFD43B]" />
              High-Velocity Hook Formats
            </div>
            <div className="space-y-2 text-xs">
              <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-2.5">
                <div className="font-bold text-white">3s Pattern Interrupt</div>
                <div className="text-[11px] text-[#737373] mt-0.5">
                  Visual disruption + counter-intuitive claim in first 1.5s
                </div>
              </div>
              <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-2.5">
                <div className="font-bold text-white">Curiosity Gap Loop</div>
                <div className="text-[11px] text-[#737373] mt-0.5">
                  Start with the climax or paradoxical result
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
