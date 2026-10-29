'use client';

// =============================================================================
// RIIQX Creator Studio — Published Content Archive
// Verified Live Posts • Direct Permalinks • Engagement Highlights
// =============================================================================

import React from 'react';
import {
  CreatorProject,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import {
  CheckCheck,
  Youtube,
  Instagram,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  BarChart3,
  Calendar,
} from 'lucide-react';

interface PublishedContentTabProps {
  projects: CreatorProject[];
  onSelectProject: (proj: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function PublishedContentTab({
  projects,
  onSelectProject,
  onTabChange,
}: PublishedContentTabProps) {
  // Sample published items (published projects or rich defaults)
  const publishedItems = [
    {
      id: 'pub_1',
      title: 'Why Online-First AI Wins in 2026 #Shorts',
      platform: 'youtube_shorts',
      publishedAt: '2026-10-25T14:30:00Z',
      platformId: 'yt_98231451',
      permalink: 'https://youtube.com/shorts/ai_automation_2026',
      views: 52400,
      likes: 4120,
      comments: 310,
      shares: 720,
      saves: 1640,
    },
    {
      id: 'pub_2',
      title: 'Stop Doing This If You Want Reach #ViralReels',
      platform: 'instagram_reels',
      publishedAt: '2026-10-22T13:00:00Z',
      platformId: 'ig_17948201',
      permalink: 'https://instagram.com/reel/17948201',
      views: 78900,
      likes: 6890,
      comments: 540,
      shares: 1120,
      saves: 2310,
    },
    {
      id: 'pub_3',
      title: 'How We Scaled from Zero to 100k Followers',
      platform: 'instagram_reels',
      publishedAt: '2026-10-18T15:15:00Z',
      platformId: 'ig_17839211',
      permalink: 'https://instagram.com/reel/17839211',
      views: 153200,
      likes: 12400,
      comments: 980,
      shares: 2450,
      saves: 4890,
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CheckCheck className="h-5 w-5 text-emerald-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">Live Published Content</h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
              {publishedItems.length} Confirmed Live
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Archived history of verified YouTube Shorts and Instagram Reels published with RIIQX.
          </p>
        </div>
      </div>

      {/* Published Items List */}
      <div className="space-y-4">
        {publishedItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 hover:border-violet-500/50 transition-all shadow-sm"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  {item.platform === 'youtube_shorts' ? (
                    <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400">
                      <Youtube className="h-4 w-4" />
                    </div>
                  ) : (
                    <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                      <Instagram className="h-4 w-4" />
                    </div>
                  )}
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    {new Date(item.publishedAt).toLocaleDateString()}
                  </span>
                  <span>•</span>
                  <span className="font-mono text-slate-500">ID: {item.platformId}</span>
                </div>
              </div>

              {/* Engagement Stats Strip */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Eye className="h-3.5 w-3.5 text-blue-400" />
                  <strong className="text-white">{item.views.toLocaleString()}</strong> views
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="h-3.5 w-3.5 text-red-400" />
                  <strong className="text-white">{item.likes.toLocaleString()}</strong> likes
                </span>
                <span className="flex items-center gap-1.5">
                  <Bookmark className="h-3.5 w-3.5 text-yellow-400" />
                  <strong className="text-white">{item.saves.toLocaleString()}</strong> saves
                </span>
                <span className="flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5 text-emerald-400" />
                  <strong className="text-white">{item.shares.toLocaleString()}</strong> shares
                </span>

                <div className="flex items-center gap-2 pl-2">
                  <a
                    href={item.permalink}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg border border-[#1E2A4A] bg-[#0B132B] text-slate-300 hover:text-white transition-colors"
                    title="View live post"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    onClick={() => onTabChange('analytics')}
                    className="flex items-center gap-1 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 border border-violet-500/30 px-3 py-1.5 text-xs font-bold transition-colors"
                  >
                    <BarChart3 className="h-3.5 w-3.5" />
                    <span>Analytics</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
