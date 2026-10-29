'use client';

// =============================================================================
// RIIQX Creator Studio — Publishing & Calendar (Section 9 of Blueprint)
// Month/Week/Day Grid • Upcoming Posts Queue (YouTube, IG, FB, WhatsApp)
// =============================================================================

import React, { useState } from 'react';
import {
  CreatorProject,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  Youtube,
  Instagram,
  Plus,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Share2,
} from 'lucide-react';

interface CalendarTabProps {
  projects: CreatorProject[];
  onSelectProject: (proj: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
  onNewProject: () => void;
}

export function CalendarTab({
  projects,
  onSelectProject,
  onTabChange,
  onNewProject,
}: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState('October 2026');
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1);

  // Exact Upcoming Posts list from Section 9 of Blueprint
  const upcomingPosts = [
    {
      id: 'post_yt_1',
      platform: 'youtube',
      platformName: 'YouTube Short',
      title: 'Travel Vlog',
      scheduledTime: 'Oct 27, 2026 • 10:00 AM',
      icon: Youtube,
      iconColor: 'text-red-600',
      iconBg: 'bg-red-500/10 border-red-500/20',
    },
    {
      id: 'post_ig_1',
      platform: 'instagram',
      platformName: 'Instagram Reel',
      title: 'Finance Tips',
      scheduledTime: 'Oct 28, 2026 • 6:00 PM',
      icon: Instagram,
      iconColor: 'text-pink-600 dark:text-pink-400',
      iconBg: 'bg-pink-500/10 border-pink-500/20',
    },
    {
      id: 'post_fb_1',
      platform: 'facebook',
      platformName: 'Facebook Reel',
      title: 'Motivation',
      scheduledTime: 'Oct 29, 2026 • 12:00 PM',
      icon: Share2,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
    },
    {
      id: 'post_wa_1',
      platform: 'whatsapp',
      platformName: 'WhatsApp Broadcast',
      title: 'New Video Alert',
      scheduledTime: 'Oct 30, 2026 • 8:00 AM',
      icon: MessageCircle,
      iconColor: 'text-[#16865D]',
      iconBg: 'bg-[#16865D]/10 border-[#16865D]/20',
    },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto text-[#171A22] dark:text-white">
      {/* Top Bar with Month & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5E4DE] dark:border-[#2A3347] pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#171A22] dark:text-white">
            Publishing & Calendar
          </h1>
          <p className="text-xs sm:text-sm text-[#777D88] dark:text-slate-400 mt-0.5">
            Cross-platform automated publishing for YouTube Shorts, Reels, Facebook and WhatsApp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Month / Week / Day Switcher (Section 9 of Blueprint) */}
          <div className="flex items-center p-1 rounded-xl bg-white dark:bg-[#1C2230] border border-[#E5E4DE] dark:border-[#2A3347] text-xs font-bold">
            {(['month', 'week', 'day'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`px-3 py-1 rounded-lg capitalize transition ${
                  viewMode === mode
                    ? 'bg-[#6750D8] text-white shadow-2xs'
                    : 'text-[#777D88] hover:text-[#171A22] dark:hover:text-white'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>

          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6750D8] hover:bg-[#5841C5] text-white text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout matching Blueprint Section 9 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Calendar Grid */}
        <div className="lg:col-span-8 rounded-2xl border border-[#E5E4DE] dark:border-[#2A3347] bg-white dark:bg-[#1C2230] overflow-hidden shadow-2xs">
          {/* Calendar Header with Month & Arrows */}
          <div className="px-5 py-3.5 border-b border-[#E5E4DE] dark:border-[#2A3347] flex items-center justify-between">
            <span className="text-sm font-bold text-[#171A22] dark:text-white">
              {currentMonth}
            </span>
            <div className="flex items-center gap-1">
              <button className="p-1 rounded-lg text-[#777D88] hover:text-[#171A22] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button className="p-1 rounded-lg text-[#777D88] hover:text-[#171A22] dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-[#E5E4DE] dark:border-[#2A3347] bg-[#F5F5F0]/60 dark:bg-[#141821]/60 text-center text-xs font-bold text-[#777D88] py-2.5">
            {daysOfWeek.map((day) => (
              <div key={day}>{day}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-[75px] sm:auto-rows-[90px] divide-x divide-y divide-[#E5E4DE] dark:divide-[#2A3347] bg-white dark:bg-[#1C2230]">
            {calendarDays.map((day) => {
              const isToday = day === 27;
              const hasPost = [27, 28, 29, 30].includes(day);

              return (
                <div
                  key={day}
                  className={`p-2 transition-colors flex flex-col justify-between ${
                    isToday ? 'bg-[#6750D8]/5 dark:bg-[#6750D8]/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isToday
                          ? 'flex h-5 w-5 items-center justify-center rounded-full bg-[#6750D8] text-white shadow-xs'
                          : 'text-[#171A22] dark:text-slate-300'
                      }`}
                    >
                      {day}
                    </span>
                    {hasPost && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6750D8]" />
                    )}
                  </div>

                  {hasPost && (
                    <div className="space-y-0.5">
                      <div className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#6750D8]/10 text-[#6750D8] dark:text-[#8B5CF6] truncate border border-[#6750D8]/20">
                        {day === 27 ? 'Travel Vlog' : day === 28 ? 'Finance Tips' : day === 29 ? 'Motivation' : 'Broadcast'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (4 cols): Upcoming Posts Queue (Section 9 of Blueprint) */}
        <div className="lg:col-span-4 rounded-2xl border border-[#E5E4DE] dark:border-[#2A3347] bg-white dark:bg-[#1C2230] p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[#171A22] dark:text-white">
                Upcoming Posts
              </h2>
              <button
                onClick={() => onTabChange('queue')}
                className="text-xs font-bold text-[#6750D8] dark:text-[#8B5CF6] hover:underline"
              >
                View All
              </button>
            </div>

            <div className="space-y-3">
              {upcomingPosts.map((post) => {
                const Icon = post.icon;
                return (
                  <div
                    key={post.id}
                    onClick={() => onTabChange('queue')}
                    className="p-3 rounded-xl bg-[#F5F5F0] dark:bg-[#141821] border border-[#E5E4DE] dark:border-[#2A3347] hover:border-[#6750D8] dark:hover:border-[#6750D8] transition cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center ${post.iconBg}`}>
                        <Icon className={`w-4 h-4 ${post.iconColor}`} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-[#777D88] uppercase tracking-wider block">
                          {post.platformName}
                        </span>
                        <p className="text-xs font-bold text-[#171A22] dark:text-white group-hover:text-[#6750D8] dark:group-hover:text-[#8B5CF6] transition-colors truncate max-w-[140px]">
                          {post.title}
                        </p>
                        <span className="text-[10px] text-[#777D88] dark:text-slate-400">
                          {post.scheduledTime}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={onNewProject}
            className="w-full mt-4 py-2.5 rounded-xl text-xs font-bold text-[#6750D8] dark:text-[#8B5CF6] bg-[#6750D8]/10 hover:bg-[#6750D8]/20 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Schedule New Multi-Platform Reel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
