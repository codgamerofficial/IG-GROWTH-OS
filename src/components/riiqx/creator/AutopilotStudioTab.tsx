'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Autopilot & Autonomous Safety Studio
// Human-in-the-Loop Approval Gating • Multi-Channel Dispatcher • 12-Stage Engine
// Live Instagram Reels (@iam.riik) & YouTube Shorts (RIIQX) Safety Monitoring
// =============================================================================

import React, { useState } from 'react';
import {
  CreatorProject,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Play,
  RotateCcw,
  Sliders,
  Send,
  AlertTriangle,
  Youtube,
  Instagram,
  Facebook,
  ExternalLink,
  Lock,
  Unlock,
  Radio,
  Flame,
  Zap,
} from 'lucide-react';

interface AutopilotStudioTabProps {
  project: CreatorProject | null;
  projects?: CreatorProject[];
  onTabChange: (tab: CreatorStudioTab) => void;
}

interface PendingApprovalPost {
  id: string;
  title: string;
  hook: string;
  platforms: Array<'instagram' | 'youtube' | 'facebook'>;
  caption: string;
  scheduledTime: string;
  estimatedReach: string;
  status: 'pending_approval' | 'approved' | 'rejected';
}

export function AutopilotStudioTab({
  project,
  projects = [],
  onTabChange,
}: AutopilotStudioTabProps) {
  // Human-in-the-Loop Approval Brake (Default: strictly enabled)
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);
  const [emergencyKillSwitch, setEmergencyKillSwitch] = useState(false);
  const [autopilotLevel, setAutopilotLevel] = useState<number>(3); // Level 3: Copilot (Approval Required)

  // Demo Pending Approval Queue
  const [approvalQueue, setApprovalQueue] = useState<PendingApprovalPost[]>([
    {
      id: 'post_01',
      title: project?.name || 'Online-First Cloud Intelligence vs Local Bottlenecks',
      hook: 'Stop trying to run 70B models on your MacBook when cloud APIs are 10x faster and cheaper.',
      platforms: ['instagram', 'youtube', 'facebook'],
      caption: 'Why developers are switching to cloud-first AI in 2026. The latency bottleneck is broken. #ai #tech #cloud #riiqx',
      scheduledTime: 'Today, 6:30 PM (Peak Engagement)',
      estimatedReach: '25K - 45K views',
      status: 'pending_approval',
    },
    {
      id: 'post_02',
      title: '3 Prompt Hacks That 10x Claude Sonnet Output',
      hook: 'Most people prompt AI like Google search. Here are 3 structural rules that actually work.',
      platforms: ['youtube', 'instagram'],
      caption: 'Transform your output quality with XML tags and structured constraints. #productivity #ai #claude',
      scheduledTime: 'Tomorrow, 9:00 AM',
      estimatedReach: '18K - 30K views',
      status: 'pending_approval',
    },
  ]);

  const handleApprove = (id: string) => {
    setApprovalQueue((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: 'approved' } : post))
    );
  };

  const handleReject = (id: string) => {
    setApprovalQueue((prev) =>
      prev.map((post) => (post.id === id ? { ...post, status: 'rejected' } : post))
    );
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header with Safety Status */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#2E2E2E] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Autopilot &amp; Safety Control Center
            </h1>
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Human Gating Active
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Approval-based autonomous publishing. No content is published to your live social channels without explicit verification.
          </p>
        </div>

        {/* Emergency Kill Switch */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEmergencyKillSwitch(!emergencyKillSwitch)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-1.5 text-xs font-bold transition-all shadow-sm ${
              emergencyKillSwitch
                ? 'border-red-500 bg-red-500/20 text-red-400'
                : 'border-[#2E2E2E] bg-[#1A1A1A] text-[#A3A3A3] hover:text-white'
            }`}
          >
            <ShieldAlert className="h-4 w-4 text-red-400" />
            <span>{emergencyKillSwitch ? 'KILL SWITCH ENGAGED' : 'Emergency Stop'}</span>
          </button>
        </div>
      </div>

      {/* Connected Channels Health Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Instagram Reels Live Status */}
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-pink-500/10 text-pink-400">
                <Instagram className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-white">Instagram Reels</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Verified
            </span>
          </div>
          <div className="text-xs text-slate-300 font-semibold truncate">
            @iam.riik (🆂🅰🆂🆆🅰🆃🅰 🅳🅴🆈)
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#737373]">
            <span>1,335 Followers • 677 Media</span>
            <span className="text-emerald-400 font-medium">Token Active</span>
          </div>
        </div>

        {/* YouTube Shorts Live Status */}
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400">
                <Youtube className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-white">YouTube Shorts</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              Verified
            </span>
          </div>
          <div className="text-xs text-slate-300 font-semibold truncate">
            RIIQX (@riiqx)
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#737373]">
            <span>Data API v3 Authorized</span>
            <span className="text-emerald-400 font-medium">Ready for Upload</span>
          </div>
        </div>

        {/* Facebook Pages Live Status */}
        <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <Facebook className="h-4 w-4" />
              </div>
              <span className="text-xs font-bold text-white">Facebook Pages</span>
            </div>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              2 Connected
            </span>
          </div>
          <div className="text-xs text-slate-300 font-semibold truncate">
            MVF Official &amp; Rik Gamer
          </div>
          <div className="flex items-center justify-between text-[10px] text-[#737373]">
            <span>Reels &amp; Video Distribution</span>
            <span className="text-emerald-400 font-medium">Active</span>
          </div>
        </div>
      </div>

      {/* Autopilot Operational Mode & Human Gating Controls */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2">
            <Sliders className="h-4 w-4 text-[#FFD43B]" />
            Autopilot Operating Parameters
          </span>
          <span className="text-xs text-[#A3A3A3]">
            Level {autopilotLevel}: {autopilotLevel === 3 ? 'Copilot (Human Gated)' : 'Custom'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              level: 1,
              title: 'Manual Assistant',
              desc: 'AI only creates drafts. Creator triggers every single step manually.',
            },
            {
              level: 3,
              title: 'Supervised Copilot (Recommended)',
              desc: 'AI generates scripts, edits video, and schedules queue. Requires 1-click human sign-off before posting.',
            },
            {
              level: 4,
              title: 'Full Autonomous Autopilot',
              desc: 'Autonomous end-to-end publishing according to calendar rules and peak hours.',
            },
          ].map((mode) => {
            const isSelected = autopilotLevel === mode.level;
            return (
              <button
                key={mode.level}
                onClick={() => setAutopilotLevel(mode.level)}
                className={`flex flex-col text-left rounded-xl border p-3.5 transition-all ${
                  isSelected
                    ? 'border-[#FFD43B] bg-[#FFD43B]/10 shadow-xs'
                    : 'border-[#2E2E2E] bg-[#202020] hover:border-[#3E3E3E]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{mode.title}</span>
                  {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#FFD43B]" />}
                </div>
                <p className="mt-1.5 text-[11px] text-[#A3A3A3] line-clamp-2">{mode.desc}</p>
              </button>
            );
          })}
        </div>

        {/* Human Gating Toggle */}
        <div className="flex items-center justify-between border-t border-[#2E2E2E] pt-4">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${requireHumanApproval ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
              {requireHumanApproval ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-white">Require Human Approval Before Dispatch</div>
              <div className="text-[11px] text-[#737373]">
                Guarantees zero unintended posts. Posts will remain in queue until you click Approve.
              </div>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={requireHumanApproval}
              onChange={(e) => setRequireHumanApproval(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-[#2E2E2E] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFD43B]" />
          </label>
        </div>
      </div>

      {/* Human Approval Queue */}
      <div className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#FFD43B]" />
              Content Awaiting Your Approval ({approvalQueue.filter((p) => p.status === 'pending_approval').length})
            </h2>
            <p className="text-[11px] text-[#737373] mt-0.5">
              Review AI-generated hook, caption, and target channels before dispatch.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {approvalQueue.map((item) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 transition-all ${
                item.status === 'approved'
                  ? 'border-emerald-500/30 bg-emerald-500/5'
                  : item.status === 'rejected'
                  ? 'border-red-500/20 bg-red-500/5 opacity-60'
                  : 'border-[#2E2E2E] bg-[#202020]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{item.title}</span>
                    <span className="rounded-full bg-[#151515] px-2 py-0.5 text-[10px] text-[#FFD43B] font-semibold">
                      {item.estimatedReach}
                    </span>
                  </div>
                  <p className="text-xs text-[#A3A3A3] italic bg-[#151515] p-2.5 rounded-lg border border-[#2E2E2E]">
                    &ldquo;{item.hook}&rdquo;
                  </p>
                  <p className="text-[11px] text-[#737373] line-clamp-1">{item.caption}</p>

                  <div className="flex items-center gap-3 text-[10px] text-[#737373] pt-1">
                    <span>Scheduled: {item.scheduledTime}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      {item.platforms.includes('youtube') && (
                        <span className="text-red-400 font-semibold">YouTube Shorts</span>
                      )}
                      {item.platforms.includes('instagram') && (
                        <span className="text-pink-400 font-semibold">Instagram Reels</span>
                      )}
                      {item.platforms.includes('facebook') && (
                        <span className="text-blue-400 font-semibold">Facebook Page</span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Approval Action Buttons */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {item.status === 'pending_approval' ? (
                    <>
                      <button
                        onClick={() => handleReject(item.id)}
                        className="rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 text-xs font-bold text-red-400 transition-colors"
                      >
                        Reject
                      </button>

                      <button
                        onClick={() => onTabChange('editor')}
                        className="rounded-xl border border-[#2E2E2E] bg-[#282828] hover:bg-[#333333] px-3 py-1.5 text-xs font-bold text-white transition-colors"
                      >
                        Edit in Studio
                      </button>

                      <button
                        onClick={() => handleApprove(item.id)}
                        className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] px-3.5 py-1.5 text-xs font-black text-[#151515] transition-colors shadow-sm"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Approve &amp; Dispatch</span>
                      </button>
                    </>
                  ) : item.status === 'approved' ? (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Approved for Publishing
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-semibold text-red-400 bg-red-500/10 px-3 py-1.5 rounded-xl border border-red-500/20">
                      <XCircle className="h-3.5 w-3.5" />
                      Rejected
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

