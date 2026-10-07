'use client';

// =============================================================================
// IG GrowthOS: Overview Command Center Dashboard (Sections 6, 7, 8)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import {
  Users,
  Eye,
  Bookmark,
  Share2,
  Heart,
  TrendingUp,
  Play,
  Instagram,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Clock,
  ArrowUpRight,
  Filter,
} from 'lucide-react';
import { ContentItem } from '@/lib/supabase/types';

export function OverviewView() {
  const {
    brand,
    account,
    aggregates,
    contentItems,
    workflowRunning,
    runTodayWorkflow,
    approveContent,
    rejectContent,
    scheduleContent,
    publishContent,
    setActiveTab,
  } = useGrowthOS();

  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [publishingId, setPublishingId] = useState<string | null>(null);

  const metrics = [
    {
      title: 'Total Reach',
      value: aggregates?.totalReach ? aggregates.totalReach.toLocaleString() : '0',
      change: aggregates?.deltas.reach || '—',
      icon: Eye,
      sparkline: aggregates?.sparkline || [0, 0, 0, 0, 0, 0, 0],
      color: 'from-pink-500 to-rose-500',
    },
    {
      title: 'Engagement Rate',
      value: aggregates?.avgEngagementRate ? `${aggregates.avgEngagementRate}%` : '0.0%',
      change: aggregates?.deltas.engagement || '—',
      icon: Heart,
      sparkline: [0, 0, 0, 0, 0, 0, 0],
      color: 'from-rose-500 to-amber-500',
    },
    {
      title: 'Total Followers',
      value: account?.connected && account?.followers_count ? account.followers_count.toLocaleString() : '—',
      change: account?.connected ? (aggregates?.deltas.followers || '—') : '—',
      icon: Users,
      sparkline: [0, 0, 0, 0, 0, 0, 0],
      color: 'from-indigo-500 to-purple-500',
    },
    {
      title: 'Video Views',
      value: aggregates?.totalViews ? aggregates.totalViews.toLocaleString() : '0',
      change: aggregates?.deltas.views || '—',
      icon: Play,
      sparkline: [0, 0, 0, 0, 0, 0, 0],
      color: 'from-amber-500 to-rose-500',
    },
    {
      title: 'Total Saves',
      value: aggregates?.totalSaves ? aggregates.totalSaves.toLocaleString() : '0',
      change: aggregates?.deltas.saves || '—',
      icon: Bookmark,
      sparkline: [0, 0, 0, 0, 0, 0, 0],
      color: 'from-emerald-500 to-teal-500',
    },
    {
      title: 'Total Shares',
      value: aggregates?.totalShares ? aggregates.totalShares.toLocaleString() : '0',
      change: aggregates?.deltas.shares || '—',
      icon: Share2,
      sparkline: [0, 0, 0, 0, 0, 0, 0],
      color: 'from-cyan-500 to-blue-500',
    },
    {
      title: 'Profile Visits',
      value: aggregates?.totalProfileVisits ? aggregates.totalProfileVisits.toLocaleString() : '0',
      change: aggregates?.deltas.profileVisits || '—',
      icon: TrendingUp,
      sparkline: [0, 0, 0, 0, 0, 0, 0],
      color: 'from-fuchsia-500 to-pink-500',
    },
  ];

  const handlePublish = async (id: string) => {
    try {
      setPublishingId(id);
      const res = await publishContent(id);
      alert(res.message);
    } catch (err: any) {
      alert(`Publishing Error: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-3xl bg-gradient-to-r from-rose-950/40 via-[#151519] to-amber-950/20 border border-white/10 p-6 md:p-8 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Welcome to IG GrowthOS
            </h1>
            <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-semibold text-rose-300 border border-rose-500/30">
              v1.0 Production
            </span>
          </div>
          <p className="text-sm text-zinc-400">
            Your AI-powered Instagram command center for <span className="text-white font-medium">{brand?.name || 'RIIQX'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveTab('ideas')}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-white/10 hover:text-white transition-all"
          >
            Generate Ideas
          </button>
          <button
            onClick={runTodayWorkflow}
            disabled={workflowRunning}
            className="rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-5 py-2.5 text-xs font-semibold text-white shadow-xl shadow-rose-500/25 hover:shadow-rose-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center gap-2"
          >
            {workflowRunning ? (
              <>
                <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Running Workflow...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 fill-white" />
                <span>Run Today&apos;s Workflow</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2. Instagram Account Card (Section 7) */}
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              {account?.connected && account?.profile_picture_url ? (
                <img
                  src={account.profile_picture_url}
                  alt="RIIQX Instagram profile"
                  className="h-16 w-16 rounded-full object-cover ring-2 ring-rose-500/40 shadow-lg"
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400">
                  <Instagram className="h-8 w-8 text-pink-400/80" />
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 h-4 w-4 rounded-full ring-4 ring-[#111114] ${
                  account?.connected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {account?.connected && account?.username ? `@${account.username}` : '@riiqx.official (Pending Auth)'}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold border ${
                    account?.connected
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {account?.connected ? 'Connected ●' : 'BLOCKED — CONFIG REQUIRED ●'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 max-w-md line-clamp-1">
                {account?.connected
                  ? account?.biography || 'High-end streetwear and avant-garde lifestyle.'
                  : 'Meta Graph API credentials not detected. Connect Instagram in Settings to view live profile and enable publishing.'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-zinc-300">
                <span>
                  <strong className="text-white font-semibold">
                    {account?.connected ? account.followers_count?.toLocaleString() : '—'}
                  </strong>{' '}
                  followers
                </span>
                <span>
                  <strong className="text-white font-semibold">
                    {account?.connected ? account.follows_count : '—'}
                  </strong>{' '}
                  following
                </span>
                <span>
                  <strong className="text-white font-semibold">
                    {account?.connected ? account.media_count : '—'}
                  </strong>{' '}
                  posts
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
            {account?.connected ? (
              <>
                <a
                  href={`https://instagram.com/${account.username}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <Instagram className="h-3.5 w-3.5 text-pink-400" />
                  <span>View Instagram</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
                <button
                  onClick={async () => {
                    const res = await fetch('/api/health/instagram');
                    const d = await res.json();
                    alert(`Meta API Status: ${d.status}\n${d.message}`);
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Check Health</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('connection')}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-pink-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Instagram className="h-3.5 w-3.5" />
                <span>Connect Meta Graph API</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Metric Cards with Sparklines (Section 6) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-white tracking-tight">Performance Overview (Last 14 Days)</h2>
          <span className="text-xs text-zinc-400">Official Meta Graph Insights</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((m, idx) => {
            const Icon = m.icon;
            return (
              <div
                key={idx}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-lg hover:border-white/20 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-zinc-400">{m.title}</span>
                  <div className={`p-2 rounded-xl bg-white/5 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-4 w-4 text-rose-400" />
                  </div>
                </div>

                <div className="mt-3 flex items-baseline justify-between">
                  <div className="text-2xl font-bold text-white tracking-tight">{m.value}</div>
                  <div className="flex items-center gap-0.5 text-xs font-semibold text-emerald-400">
                    <ArrowUpRight className="h-3.5 w-3.5" />
                    <span>{m.change}</span>
                  </div>
                </div>

                {/* Mini SVG Sparkline */}
                <div className="mt-3 h-8 w-full">
                  <svg className="h-full w-full overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#EFA3B5"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={m.sparkline
                        .map((val, i) => {
                          const x = (i / (m.sparkline.length - 1)) * 100;
                          const min = Math.min(...m.sparkline);
                          const max = Math.max(...m.sparkline) || 1;
                          const y = 26 - ((val - min) / (max - min || 1)) * 22;
                          return `${x},${y}`;
                        })
                        .join(' ')}
                    />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Today's Content Cards (Section 8) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Today&apos;s Content Queue</h2>
            <p className="text-xs text-zinc-400">Review, approve, and schedule AI-generated packages for RIIQX</p>
          </div>
          <button
            onClick={() => setActiveTab('approvals')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1"
          >
            <span>View All Approvals</span>
            <ExternalLink className="h-3 w-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {contentItems.slice(0, 6).map((item) => {
            const isApproved = item.approval_status === 'APPROVED';
            const isPending = item.approval_status === 'PENDING';
            const isPublished = item.status === 'PUBLISHED';
            const isScheduled = item.status === 'SCHEDULED';

            return (
              <div
                key={item.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-xl hover:border-rose-500/30 transition-all"
              >
                <div>
                  {/* Thumbnail & Badges */}
                  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-zinc-900 mb-4">
                    <img
                      src={item.thumbnail_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5">
                      <span className="rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                        {item.content_type}
                      </span>
                      {item.content_pillar && (
                        <span className="rounded-lg bg-rose-500/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-semibold text-white">
                          {item.content_pillar}
                        </span>
                      )}
                    </div>

                    {/* AI Opportunity Score Badge (Section 11) */}
                    <div className="absolute top-2 right-2 rounded-lg bg-black/80 backdrop-blur-md border border-amber-500/40 px-2 py-0.5 text-right">
                      <span className="text-[10px] text-zinc-400 block leading-none">AI Score</span>
                      <span className="text-xs font-bold text-amber-400 leading-tight">{item.ai_score}/100</span>
                    </div>

                    {/* Status Pill */}
                    <div className="absolute bottom-2 left-2">
                      <span
                        className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          isPublished
                            ? 'bg-emerald-500/90 text-white'
                            : isScheduled
                            ? 'bg-blue-500/90 text-white'
                            : isApproved
                            ? 'bg-purple-500/90 text-white'
                            : isPending
                            ? 'bg-amber-500/90 text-black'
                            : 'bg-zinc-700 text-white'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </div>

                  {/* Title & Hook */}
                  <h3 className="font-bold text-white text-sm line-clamp-1">{item.title}</h3>
                  {item.hook && (
                    <p className="mt-1 text-xs italic text-rose-300/90 line-clamp-2">
                      &ldquo;{item.hook}&rdquo;
                    </p>
                  )}
                  <p className="mt-2 text-xs text-zinc-400 line-clamp-2">{item.caption}</p>
                </div>

                {/* Card Actions */}
                <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-[11px] font-medium text-zinc-300 hover:bg-white/10 hover:text-white"
                  >
                    Preview
                  </button>

                  <div className="flex items-center gap-1.5">
                    {isPending && (
                      <>
                        <button
                          onClick={() => approveContent(item.id)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-300 hover:bg-emerald-500/30"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => rejectContent(item.id, 'Needs more contrast in opening hook')}
                          className="rounded-lg bg-red-500/20 border border-red-500/30 p-1.5 text-red-300 hover:bg-red-500/30"
                          title="Reject"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}

                    {isApproved && !isPublished && (
                      <button
                        onClick={() => handlePublish(item.id)}
                        disabled={publishingId === item.id}
                        className="flex items-center gap-1 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 px-3 py-1.5 text-[11px] font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {publishingId === item.id ? (
                          <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <Play className="h-3 w-3 fill-white" />
                        )}
                        <span>Publish</span>
                      </button>
                    )}

                    {isPublished && (
                      <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Published
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Item Full Preview */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-w-2xl w-full rounded-2xl bg-[#151519] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">
                  {selectedItem.content_type} • {selectedItem.content_pillar}
                </span>
                <h2 className="text-lg font-bold text-white">{selectedItem.title}</h2>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="font-semibold text-zinc-400 block mb-1">0–3s Hook:</span>
                <p className="p-3 rounded-xl bg-white/5 border border-white/5 text-rose-200">
                  {selectedItem.hook}
                </p>
              </div>

              {selectedItem.script && (
                <div>
                  <span className="font-semibold text-zinc-400 block mb-1">Scene Script:</span>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-2 text-zinc-300">
                    {Object.entries(selectedItem.script).map(([key, val]) => (
                      <div key={key}>
                        <strong className="text-zinc-400 uppercase tracking-wider text-[10px]">{key}:</strong>{' '}
                        <span>{typeof val === 'string' ? val : JSON.stringify(val)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="font-semibold text-zinc-400 block mb-1">Caption & Hashtags:</span>
                <p className="p-3 rounded-xl bg-white/5 border border-white/5 text-zinc-300 whitespace-pre-wrap">
                  {selectedItem.caption}
                </p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedItem.hashtags.map((tag, i) => (
                    <span key={i} className="text-[10px] text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-zinc-300 hover:bg-white/10"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
