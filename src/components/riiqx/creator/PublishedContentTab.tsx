'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — Published Content Archive
// Verified Live Posts • Direct Permalinks • Truthful Platform Metrics
// =============================================================================

import React from 'react';
import { CreatorProject, CreatorStudioTab } from '@/lib/riiqx/creator-types';
import {
  CheckCheck,
  Youtube,
  Instagram,
  Facebook,
  ExternalLink,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  BarChart3,
  Calendar,
  Layers,
} from 'lucide-react';

interface PublishedContentTabProps {
  projects: CreatorProject[];
  onSelectProject: (proj: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function PublishedContentTab({
  projects = [],
  onSelectProject,
  onTabChange,
}: PublishedContentTabProps) {
  // Derive live published projects
  const publishedProjects = projects.filter(
    (p) => p.status === 'published' || p.publishingJob?.status === 'published'
  );

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
              {publishedProjects.length} Verified Live
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            Archived history of verified YouTube Shorts, Instagram Reels, and Facebook Page videos published with RIIQX.
          </p>
        </div>
      </div>

      {publishedProjects.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#1A1A1A] border border-dashed border-[#2E2E2E] space-y-3">
          <Layers className="w-10 h-10 text-[#FFD43B] mx-auto opacity-80" />
          <h3 className="text-base font-bold text-white">No Published Content Yet</h3>
          <p className="text-xs text-[#737373] max-w-md mx-auto">
            Once you publish a video reel to YouTube, Instagram, or Facebook, the live post permalink, platform media ID, and verification records will be archived here.
          </p>
          <button
            onClick={() => onTabChange('queue')}
            className="mt-2 px-4 py-2 rounded-xl bg-[#FFD43B] text-[#151515] text-xs font-bold hover:bg-[#FFC928] transition shadow-xs"
          >
            Go to Publishing Queue
          </button>
        </div>
      ) : (
        /* Published Items List */
        <div className="space-y-4">
          {publishedProjects.map((p) => {
            const job = p.publishingJob;
            const effectivePlatform = p.brief?.platform || job?.platform || 'both';
            const isYt = effectivePlatform === 'youtube_shorts';
            const isFb = (effectivePlatform as string) === 'facebook';
            const permalink =
              job?.permalink ||
              (job?.platformMediaId
                ? isYt
                  ? `https://youtube.com/shorts/${job.platformMediaId}`
                  : isFb
                  ? `https://www.facebook.com/videos/${job.platformMediaId}`
                  : `https://instagram.com/reel/${job.platformMediaId}`
                : undefined);

            const perf = p.performance;

            return (
              <div
                key={p.id}
                className="rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-5 space-y-4 hover:border-[#FFD43B]/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2E2E2E] pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#202020]">
                      {isYt ? (
                        <Youtube className="h-5 w-5 text-red-500" />
                      ) : isFb ? (
                        <Facebook className="h-5 w-5 text-blue-500" />
                      ) : (
                        <Instagram className="h-5 w-5 text-pink-500" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white">{p.name}</h3>
                      <div className="flex items-center gap-3 text-[11px] text-[#737373] mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          Published {new Date(job?.publishedAt || p.updatedAt).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span className="capitalize">{isYt ? 'YouTube Short' : isFb ? 'Facebook Video' : 'Instagram Reel'}</span>
                        {job?.platformMediaId && (
                          <>
                            <span>•</span>
                            <span className="font-mono text-emerald-400">ID: {job.platformMediaId}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => {
                        onSelectProject(p);
                        onTabChange('analytics');
                      }}
                      className="flex items-center gap-1.5 rounded-xl border border-[#2E2E2E] bg-[#202020] hover:bg-[#282828] text-white px-3 py-1.5 text-xs font-bold transition-colors"
                    >
                      <BarChart3 className="h-3.5 w-3.5 text-[#FFD43B]" />
                      <span>Deep Analytics</span>
                    </button>
                    {permalink && (
                      <a
                        href={permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl border border-[#2E2E2E] bg-[#202020] text-[#A3A3A3] hover:text-[#FFD43B] transition-colors"
                        title="Open live post"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>

                {/* Engagement Metrics Matrix */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                    <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-blue-400" /> Views
                    </div>
                    <div className="mt-1 text-base font-black text-white">
                      {perf?.views !== undefined ? perf.views.toLocaleString() : 'Live'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                    <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" /> Likes
                    </div>
                    <div className="mt-1 text-base font-black text-white">
                      {perf?.likes !== undefined ? perf.likes.toLocaleString() : 'Active'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                    <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                      <MessageSquare className="h-3 w-3 text-emerald-400" /> Comments
                    </div>
                    <div className="mt-1 text-base font-black text-white">
                      {perf?.comments !== undefined ? perf.comments.toLocaleString() : 'Active'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center">
                    <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                      <Bookmark className="h-3 w-3 text-[#FFD43B]" /> Saves
                    </div>
                    <div className="mt-1 text-base font-black text-white">
                      {perf?.saves !== undefined ? perf.saves.toLocaleString() : 'Active'}
                    </div>
                  </div>

                  <div className="rounded-xl border border-[#2E2E2E] bg-[#202020] p-3 text-center col-span-2 sm:col-span-1">
                    <div className="text-[10px] uppercase font-bold text-[#737373] flex items-center justify-center gap-1">
                      <Share2 className="h-3 w-3 text-pink-400" /> Shares
                    </div>
                    <div className="mt-1 text-base font-black text-white">
                      {perf?.shares !== undefined ? perf.shares.toLocaleString() : 'Active'}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
