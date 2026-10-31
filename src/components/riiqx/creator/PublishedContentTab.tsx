'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Published Content Archive
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
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <CheckCheck className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              Live Published Content Archive
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              {publishedItems.length} Confirmed Live
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Archived history of verified YouTube Shorts and Instagram Reels published with RIIQX Creator Studio.
          </p>
        </div>
      </div>

      {/* Published Items List */}
      <div className="space-y-4">
        {publishedItems.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4 hover:border-[#FFD43B]/40 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E2E2E] pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#202020]">
                  {item.platform === 'youtube_shorts' ? (
                    <Youtube className="h-5 w-5 text-red-500" />
                  ) : (
                    <Instagram className="h-5 w-5 text-pink-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{item.title}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-[#737373] mt-0.5">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Published {new Date(item.publishedAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="capitalize">{item.platform.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => onTabChange('analytics')}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#202020] hover:bg-[#282828] text-white px-3 py-1.5 text-xs font-bold transition-colors"
                >
                  <BarChart3 className="h-3.5 w-3.5 text-[#FFD43B]" />
                  <span>Deep Analytics</span>
                </button>
                <a
                  href={item.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl border border-[#2E2E2E] bg-[#202020] text-[#A3A3A3] hover:text-[#FFD43B] transition-colors"
                  title="Open live post"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Engagement Metrics Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                  <Eye className="h-3 w-3 text-blue-400" /> Views
                </div>
                <div className="mt-1 text-base font-black text-white">{item.views.toLocaleString()}</div>
              </div>

              <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                  <Heart className="h-3 w-3 text-red-400" /> Likes
                </div>
                <div className="mt-1 text-base font-black text-white">{item.likes.toLocaleString()}</div>
              </div>

              <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                  <MessageSquare className="h-3 w-3 text-emerald-400" /> Comments
                </div>
                <div className="mt-1 text-base font-black text-white">{item.comments.toLocaleString()}</div>
              </div>

              <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                  <Bookmark className="h-3 w-3 text-[#FFD43B]" /> Saves
                </div>
                <div className="mt-1 text-base font-black text-white">{item.saves.toLocaleString()}</div>
              </div>

              <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center col-span-2 sm:col-span-1">
                <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                  <Share2 className="h-3 w-3 text-pink-400" /> Shares
                </div>
                <div className="mt-1 text-base font-black text-white">{item.shares.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
