'use client';

// =============================================================================
// RIIQX Creator Studio — Multi-Platform Publishing Calendar
// Real Project Pipeline • Cross-Platform Scheduling (Shorts, Reels, FB)
// Truthful Data • Obsidian Dark Theme with #FFD43B Accent
// =============================================================================

import React, { useState } from 'react';
import { CreatorProject, CreatorStudioTab } from '@/lib/riiqx/creator-types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Youtube,
  Instagram,
  Share2,
  Clock,
  ArrowRight,
  Layers,
} from 'lucide-react';

interface CalendarTabProps {
  projects: CreatorProject[];
  onSelectProject: (p: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
  onNewProject: () => void;
}

export function CalendarTab({
  projects = [],
  onSelectProject,
  onTabChange,
  onNewProject,
}: CalendarTabProps) {
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const today = new Date();
  const currentMonth = today.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Total days in current month
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendarDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Derive genuine scheduled or ready projects
  const scheduledProjects = projects.filter(
    (p) =>
      p.status === 'scheduled' ||
      p.publishingJob?.status === 'scheduled' ||
      p.status === 'ready_to_publish' ||
      p.status === 'published'
  );

  const upcomingPosts = scheduledProjects.map((p) => {
    const effectivePlatform = p.brief?.platform || p.publishingJob?.platform || 'both';
    const isYt = effectivePlatform === 'youtube_shorts';
    const isFb = (effectivePlatform as string) === 'facebook';

    const Icon = isYt ? Youtube : isFb ? Share2 : Instagram;
    const platformName = isYt ? 'YouTube Short' : isFb ? 'Facebook Reel' : 'Instagram Reel';
    const iconColor = isYt ? 'text-red-500' : isFb ? 'text-blue-500' : 'text-pink-500';
    const iconBg = isYt
      ? 'bg-red-500/10 border-red-500/20'
      : isFb
      ? 'bg-blue-500/10 border-blue-500/20'
      : 'bg-pink-500/10 border-pink-500/20';

    const timeStr = p.publishingJob?.scheduledTime
      ? new Date(p.publishingJob.scheduledTime).toLocaleDateString([], { month: 'short', day: 'numeric' }) +
        ' • ' +
        new Date(p.publishingJob.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : p.status === 'published'
      ? 'Published Live'
      : 'Ready in Dispatch Queue';

    return {
      id: p.id,
      project: p,
      platform: effectivePlatform,
      platformName,
      title: p.name,
      scheduledTime: timeStr,
      status: p.status,
      icon: Icon,
      iconColor,
      iconBg,
    };
  });

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-[#202124] dark:text-white">
      {/* Top Bar with Month & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <CalendarIcon className="h-4 w-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] dark:text-white">
              Publishing &amp; Content Calendar
            </h1>
          </div>
          <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1">
            Synchronized cross-platform publishing schedule for YouTube Shorts, Instagram Reels &amp; Facebook.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month / Week / Day Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-xs font-bold">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition ${
                  viewMode === mode
                    ? 'bg-[#FFD43B] text-[#151515] shadow-xs'
                    : 'text-[#737373] hover:text-[#202124] dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold transition shadow-xs active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Project</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Calendar Grid */}
        <div className="lg:col-span-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] overflow-hidden shadow-2xs">
          {/* Calendar Header with Month & Arrows */}
          <div className="px-5 py-3.5 border-b border-[#EAE7E1] dark:border-[#2E2E2E] flex items-center justify-between">
            <span className="text-sm font-bold text-[#202124] dark:text-white">
              {currentMonth}
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] text-center text-xs font-bold text-[#737373] py-2.5">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-[75px] sm:auto-rows-[90px] divide-x divide-y divide-[#EAE7E1] dark:divide-[#2E2E2E] bg-white dark:bg-[#202020]">
            {calendarDays.map((day) => {
              const isToday = day === today.getDate();
              // Find any scheduled projects corresponding to this day
              const dayProjects = upcomingPosts.filter((post) => {
                if (post.project.publishingJob?.scheduledTime) {
                  return new Date(post.project.publishingJob.scheduledTime).getDate() === day;
                }
                return false;
              });

              return (
                <div
                  key={day}
                  className={`p-2 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-[#FFD43B]/10 dark:bg-[#FFD43B]/10' : 'hover:bg-slate-50 dark:hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'flex h-5 w-5 items-center justify-center rounded-full bg-[#FFD43B] text-[#151515] shadow-xs'
                          : 'text-[#202124] dark:text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {dayProjects.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FFD43B]" />
                    )}
                  </div>

                  {dayProjects.length > 0 && (
                    <div className="space-y-0.5">
                      {dayProjects.slice(0, 1).map((p) => (
                        <div
                          key={p.id}
                          onClick={() => {
                            onSelectProject(p.project);
                            onTabChange('queue');
                          }}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] truncate border border-[#FFD43B]/40 cursor-pointer"
                        >
                          {p.title}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Posts Queue */}
        <div className="lg:col-span-4 rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#202124] dark:text-white">
                Upcoming &amp; Scheduled Queue
              </h2>
              <button
                onClick={() => onTabChange('queue')}
                className="text-xs font-bold text-[#FFD43B] hover:underline"
              >
                Open Queue
              </button>
            </div>

            {upcomingPosts.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-dashed border-[#EAE7E1] dark:border-[#2E2E2E] space-y-2">
                <Clock className="w-6 h-6 text-[#FFD43B] mx-auto" />
                <p className="text-xs font-bold text-[#202124] dark:text-white">
                  No Posts Currently Scheduled
                </p>
                <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                  Select a video project and schedule publication via the Publishing Queue.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingPosts.map((post) => {
                  const Icon = post.icon;
                  return (
                    <div
                      key={post.id}
                      onClick={() => {
                        onSelectProject(post.project);
                        onTabChange('queue');
                      }}
                      className="p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] hover:border-[#FFD43B]/50 transition cursor-pointer flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${post.iconBg}`}>
                          <Icon className={`w-4 h-4 ${post.iconColor}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                              {post.platformName}
                            </span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full border border-[#FFD43B]/30 text-[#FFD43B] font-mono">
                              {post.status}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-[#202124] dark:text-white group-hover:text-[#FFD43B] transition-colors truncate max-w-[150px]">
                            {post.title}
                          </p>
                          <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3]">
                            {post.scheduledTime}
                          </span>
                        </div>
                      </div>

                      <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 group-hover:text-[#FFD43B] transition-all" />
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={() => onTabChange('queue')}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-[#202124] bg-[#FFD43B] hover:bg-[#FFC928] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage Publishing Queue</span>
          </button>
        </div>
      </div>
    </div>
  );
}
