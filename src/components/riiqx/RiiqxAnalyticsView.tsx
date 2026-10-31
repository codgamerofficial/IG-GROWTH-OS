'use client';

// =============================================================================
// RIIQX — Master Social Media Analytics & Growth Intelligence OS
// Liquid Intelligence Design System • 10-State Provenance Taxonomy
// Real-Time Multi-Account Sync • Content Intelligence • Evidence-Backed AI Growth
// ABSOLUTE RULE: 100% authentic platform data only. Zero simulated metrics.
// =============================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  TrendingUp,
  Youtube,
  Instagram,
  Share2,
  Clock,
  Eye,
  ArrowUpRight,
  ShieldCheck,
  Video,
  Layers,
  Sparkles,
  RefreshCw,
  AlertTriangle,
  Info,
  CheckCircle2,
  Users,
  Search,
  ExternalLink,
  Calendar,
  MessageSquare,
  ThumbsUp,
  Filter,
  BarChart3,
  GitCompare,
  SlidersHorizontal,
  Bot,
  Send,
  HelpCircle,
  X,
  Play,
} from 'lucide-react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  SocialAccountIntelligence,
  ContentIntelligenceItem,
  UnifiedAnalyticsResponse,
  HistoricalMetricSnapshot,
  AIGrowthRecommendation,
  PerformanceForecast,
  FuturePlannedContentItem,
  CrossAccountComparisonResult,
} from '@/lib/riiqx/social/analytics-types';

export function RiiqxAnalyticsView() {
  const { setActiveTab } = useRiiqx();

  // Navigation & Filtering State
  const [activeSubTab, setActiveSubTab] = useState<
    'overview' | 'accounts' | 'content' | 'reels_shorts' | 'compare' | 'calendar' | 'growth_ai' | 'forecasts' | 'assistant'
  >('overview');

  const [selectedAccountId, setSelectedAccountId] = useState<string>('all');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('30d');
  const [contentSearch, setContentSearch] = useState<string>('');

  // Live Data State
  const [analyticsData, setAnalyticsData] = useState<UnifiedAnalyticsResponse | null>(null);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncedText, setLastSyncedText] = useState<string>('Initializing...');
  const [selectedContentDetail, setSelectedContentDetail] = useState<ContentIntelligenceItem | null>(null);

  // Conversational Assistant State
  const [assistantMessage, setAssistantMessage] = useState<string>('');
  const [assistantHistory, setAssistantHistory] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([
    {
      role: 'assistant',
      text: 'Hello! I am your RIIQX Social Intelligence Assistant. I have direct access to your verified social accounts, video views, and historical content metrics. Ask me anything about your channel performance!',
      time: 'Just now',
    },
  ]);
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  // Fetch real analytics from backend
  const fetchLiveAnalytics = useCallback(async () => {
    setIsSyncing(true);
    try {
      const params = new URLSearchParams();
      if (selectedAccountId !== 'all') params.set('accountId', selectedAccountId);
      if (selectedPlatform !== 'all') params.set('platform', selectedPlatform);
      params.set('timeRange', timeRange);

      const res = await fetch(`/api/social/analytics?${params.toString()}`, { cache: 'no-store' });
      const json = await res.json();

      if (res.ok && json.data) {
        setAnalyticsData(json.data);
        setLastSyncedText(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('[RiiqxAnalyticsView] Fetch error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [selectedAccountId, selectedPlatform, timeRange]);

  useEffect(() => {
    fetchLiveAnalytics();
  }, [fetchLiveAnalytics]);

  // Handle Natural Language Query to Assistant
  const handleSendAssistantMessage = async () => {
    if (!assistantMessage.trim() || isAssistantThinking) return;
    const userText = assistantMessage.trim();
    setAssistantMessage('');

    setAssistantHistory((prev) => [
      ...prev,
      { role: 'user', text: userText, time: new Date().toLocaleTimeString() },
    ]);
    setIsAssistantThinking(true);

    try {
      const res = await fetch('/api/social/analytics/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText, accountId: selectedAccountId }),
      });
      const data = await res.json();
      if (res.ok && data.reply) {
        setAssistantHistory((prev) => [
          ...prev,
          { role: 'assistant', text: data.reply, time: new Date().toLocaleTimeString() },
        ]);
      } else {
        setAssistantHistory((prev) => [
          ...prev,
          {
            role: 'assistant',
            text: 'I could not retrieve an answer at this moment. Please verify your connection status in Integrations.',
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    } catch {
      setAssistantHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'Network error communicating with the intelligence service.',
          time: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  // Filtered Content List
  const filteredContentList = useMemo(() => {
    if (!analyticsData?.contentHistory) return [];
    return analyticsData.contentHistory.filter((item) => {
      if (selectedPlatform !== 'all' && item.platform !== selectedPlatform) return false;
      if (selectedAccountId !== 'all' && item.accountId !== selectedAccountId) return false;
      if (contentSearch) {
        const q = contentSearch.toLowerCase();
        const titleMatch = (item.title || '').toLowerCase().includes(q);
        const captionMatch = (item.caption || '').toLowerCase().includes(q);
        const handleMatch = item.accountHandle.toLowerCase().includes(q);
        if (!titleMatch && !captionMatch && !handleMatch) return false;
      }
      return true;
    });
  }, [analyticsData?.contentHistory, selectedPlatform, selectedAccountId, contentSearch]);

  const overview = analyticsData?.overview;
  const accounts = analyticsData?.accounts || [];
  const reelsAndShorts = analyticsData?.reelsAndShorts || [];
  const growthRecs = analyticsData?.growthRecommendations || [];
  const forecasts = analyticsData?.forecasts || [];
  const comparisons = analyticsData?.comparisons || [];
  const futureContent = analyticsData?.futureContent || [];

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#0C0C0E] p-4 sm:p-6 lg:p-8 text-[#202124] dark:text-[#F4F4F6] transition-colors">
      <div className="mx-auto w-full max-w-7xl space-y-6">
        {/* Top Header & Global Filters */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-white/[0.08] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#202124] dark:text-white">
                Social Intelligence OS
              </h1>
              <span className="hidden sm:inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                STRICT DATA INTEGRITY
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#737373] dark:text-[#A1A1AA] mt-1.5">
              <span>All Connected Accounts • Authentic API Telemetry • Zero Simulation</span>
              <span>•</span>
              <span className="font-mono text-[10px]">Synced: {lastSyncedText}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Account Selector Dropdown */}
            <select
              value={selectedAccountId}
              onChange={(e) => setSelectedAccountId(e.target.value)}
              className="px-3 py-2 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] text-xs font-bold text-[#202124] dark:text-white shadow-2xs focus:outline-hidden"
            >
              <option value="all">All Channels ({accounts.length})</option>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.platform.toUpperCase()}: @{acc.username}
                </option>
              ))}
            </select>

            {/* Platform Filter Buttons */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] shadow-2xs">
              <button
                onClick={() => setSelectedPlatform('all')}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold transition ${
                  selectedPlatform === 'all'
                    ? 'bg-[#FFD43B] text-[#202124]'
                    : 'text-[#737373] hover:text-[#202124] dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedPlatform('youtube')}
                title="YouTube Data API v3"
                className={`p-1.5 rounded-xl transition ${
                  selectedPlatform === 'youtube'
                    ? 'bg-[#FF4D4F]/20 text-[#FF4D4F]'
                    : 'text-[#737373] hover:text-[#FF4D4F]'
                }`}
              >
                <Youtube className="w-4 h-4" />
              </button>
              <button
                onClick={() => setSelectedPlatform('instagram')}
                title="Meta Graph API v26.0"
                className={`p-1.5 rounded-xl transition ${
                  selectedPlatform === 'instagram'
                    ? 'bg-[#FF6B5E]/20 text-[#FF6B5E]'
                    : 'text-[#737373] hover:text-[#FF6B5E]'
                }`}
              >
                <Instagram className="w-4 h-4" />
              </button>
            </div>

            {/* Sync Live Button */}
            <button
              onClick={fetchLiveAnalytics}
              disabled={isSyncing}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] text-xs font-bold text-[#202124] dark:text-white hover:border-[#FFD43B] shadow-2xs transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#FFD43B]' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Live'}</span>
            </button>
          </div>
        </div>

        {/* Executive Overview Cards (100% Genuine Metrics) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Audience */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#737373] dark:text-[#A1A1AA]">
              <span>Total Audience</span>
              <Users className="w-4 h-4 text-[#10B981]" />
            </div>
            <div className="text-3xl font-black text-[#202124] dark:text-white tabular-nums">
              {overview?.hasAudienceData ? overview.totalAudience.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-[#737373] dark:text-[#A1A1AA] flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/[0.05]">
              <span>Followers &amp; Subscribers</span>
              <span className="text-[#10B981] font-semibold">Verified API</span>
            </div>
          </div>

          {/* Total Video Views */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#737373] dark:text-[#A1A1AA]">
              <span>Total Channel Views</span>
              <Eye className="w-4 h-4 text-[#FF4D4F]" />
            </div>
            <div className="text-3xl font-black text-[#202124] dark:text-white tabular-nums">
              {overview?.hasViewsData ? overview.totalViews.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-[#737373] dark:text-[#A1A1AA] flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/[0.05]">
              <span>Official YouTube API</span>
              <span className="text-[#10B981] font-semibold">Live</span>
            </div>
          </div>

          {/* Tracked Content Assets */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#737373] dark:text-[#A1A1AA]">
              <span>Published Content</span>
              <Video className="w-4 h-4 text-[#FFD43B]" />
            </div>
            <div className="text-3xl font-black text-[#202124] dark:text-white tabular-nums">
              {overview?.totalPublishedContent ? overview.totalPublishedContent.toLocaleString() : '—'}
            </div>
            <div className="text-[10px] text-[#737373] dark:text-[#A1A1AA] flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/[0.05]">
              <span>Reels, Shorts &amp; Posts</span>
              <span className="text-amber-400 font-semibold">Indexed</span>
            </div>
          </div>

          {/* Tracked Interactions */}
          <div className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[#737373] dark:text-[#A1A1AA]">
              <span>Tracked Interactions</span>
              <ThumbsUp className="w-4 h-4 text-sky-400" />
            </div>
            <div className="text-3xl font-black text-[#202124] dark:text-white tabular-nums">
              {overview?.totalTrackedInteractions ? overview.totalTrackedInteractions.toLocaleString() : '0'}
            </div>
            <div className="text-[10px] text-[#737373] dark:text-[#A1A1AA] flex items-center justify-between pt-1 border-t border-black/5 dark:border-white/[0.05]">
              <span>Likes &amp; Comments Sum</span>
              <span className="text-[#10B981] font-semibold">Direct API</span>
            </div>
          </div>
        </div>

        {/* Master Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[#EAE7E1] dark:border-white/[0.08] pb-2 text-xs font-bold no-scrollbar">
          {[
            { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
            { id: 'accounts', label: `Accounts (${accounts.length})`, icon: ShieldCheck },
            { id: 'content', label: `Content History (${filteredContentList.length})`, icon: Video },
            { id: 'reels_shorts', label: `Reels & Shorts (${reelsAndShorts.length})`, icon: Play },
            { id: 'compare', label: 'Cross-Account Comparison', icon: GitCompare },
            { id: 'calendar', label: `Upcoming Pipeline (${futureContent.length})`, icon: Calendar },
            { id: 'growth_ai', label: `AI Growth Intelligence (${growthRecs.length})`, icon: Sparkles },
            { id: 'forecasts', label: 'Performance Forecasting', icon: TrendingUp },
            { id: 'assistant', label: 'AI Analytics Analyst', icon: Bot },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
                  isActive
                    ? 'bg-[#FFD43B] text-[#202124] shadow-xs'
                    : 'text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* SUBTAB 1: EXECUTIVE OVERVIEW */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            {/* Connected Channels Summary Matrix */}
            <div className="rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3.5">
                <h2 className="text-sm font-bold text-[#202124] dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Authorized Channels &amp; Telemetry Status</span>
                </h2>
                <span className="text-xs text-[#737373] font-mono">
                  {accounts.length} registered channel(s)
                </span>
              </div>

              {accounts.length === 0 ? (
                <div className="py-8 text-center space-y-2">
                  <p className="text-xs text-[#737373]">
                    No social channels connected. Connect YouTube or Instagram in{' '}
                    <button
                      onClick={() => setActiveTab('integrations')}
                      className="font-bold text-[#FFD43B] hover:underline"
                    >
                      Integrations
                    </button>{' '}
                    to activate genuine metrics.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {accounts.map((acc) => {
                    const isYt = acc.platform === 'youtube';
                    const Icon = isYt ? Youtube : Instagram;
                    const iconColor = isYt ? 'text-[#FF4D4F]' : 'text-[#FF6B5E]';
                    const isConnected = acc.connectionStatus === 'connected';

                    return (
                      <div
                        key={acc.id}
                        className="p-5 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#18181C] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            {acc.avatarUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={acc.avatarUrl}
                                alt={acc.displayName}
                                className="w-8 h-8 rounded-full object-cover border border-black/10 dark:border-white/10"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                                <Icon className={`w-4 h-4 ${iconColor}`} />
                              </div>
                            )}
                            <div>
                              <div className="text-xs font-bold text-[#202124] dark:text-white truncate max-w-[130px]">
                                @{acc.username}
                              </div>
                              <div className="text-[10px] text-[#737373] uppercase font-mono">
                                {acc.platform} {acc.accountType}
                              </div>
                            </div>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              isConnected
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            }`}
                          >
                            {isConnected ? 'AUTHENTICATED' : 'REAUTH NEEDED'}
                          </span>
                        </div>

                        {/* Metrics Breakdown */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EAE7E1] dark:border-white/[0.05]">
                          <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141418]">
                            <div className="text-[10px] text-[#737373]">
                              {isYt ? 'Subscribers' : 'Followers'}
                            </div>
                            <div className="text-base font-black text-[#202124] dark:text-white">
                              {acc.metrics.subscribers?.value !== null && acc.metrics.subscribers?.value !== undefined
                                ? acc.metrics.subscribers.value.toLocaleString()
                                : acc.metrics.followers?.value !== null && acc.metrics.followers?.value !== undefined
                                ? acc.metrics.followers.value.toLocaleString()
                                : 'Not Available'}
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141418]">
                            <div className="text-[10px] text-[#737373]">
                              {isYt ? 'Channel Views' : 'Media Posts'}
                            </div>
                            <div className="text-base font-black text-[#202124] dark:text-white">
                              {isYt
                                ? acc.metrics.totalViews?.value !== null && acc.metrics.totalViews?.value !== undefined
                                  ? acc.metrics.totalViews.value.toLocaleString()
                                  : 'Not Available'
                                : acc.metrics.publishedContentCount?.value !== null && acc.metrics.publishedContentCount?.value !== undefined
                                ? acc.metrics.publishedContentCount.value.toLocaleString()
                                : 'Not Available'}
                            </div>
                          </div>
                        </div>

                        {/* Permission Status */}
                        {acc.metrics.reach?.status === 'PERMISSION_MISSING' && (
                          <div className="p-2 rounded-xl text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 flex items-start gap-1.5">
                            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <span>
                              {acc.metrics.reach.statusExplanation ||
                                'Deep account reach requires App Review permissions.'}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Content Format Distribution & Top Content Preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-7 p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-4">
                <h2 className="text-sm font-bold text-[#202124] dark:text-white flex items-center justify-between">
                  <span>Recent Content Activity</span>
                  <button
                    onClick={() => setActiveSubTab('content')}
                    className="text-xs text-[#FFD43B] hover:underline"
                  >
                    View All ({filteredContentList.length}) →
                  </button>
                </h2>

                {filteredContentList.length === 0 ? (
                  <p className="text-xs text-[#737373] py-4">No content items synced yet.</p>
                ) : (
                  <div className="space-y-2.5">
                    {filteredContentList.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedContentDetail(item)}
                        className="flex items-center justify-between p-3 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.05] hover:border-[#FFD43B] bg-[#FAF9F6] dark:bg-[#18181C] cursor-pointer transition"
                      >
                        <div className="flex items-center gap-3">
                          {item.thumbnailUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.thumbnailUrl}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center">
                              <Video className="w-5 h-5 text-[#737373]" />
                            </div>
                          )}
                          <div>
                            <div className="text-xs font-bold text-[#202124] dark:text-white line-clamp-1 max-w-xs sm:max-w-md">
                              {item.title || item.caption || 'Untitled Asset'}
                            </div>
                            <div className="text-[10px] text-[#737373] flex items-center gap-2 mt-0.5">
                              <span className="uppercase font-mono">{item.contentType}</span>
                              <span>•</span>
                              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs font-black text-[#202124] dark:text-white">
                            {item.views !== null ? `${item.views.toLocaleString()} views` : `${item.likes ?? 0} likes`}
                          </div>
                          <div className="text-[10px] text-[#737373]">{item.comments ?? 0} comments</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* AI Growth Highlights */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-3">
                <h2 className="text-sm font-bold text-[#202124] dark:text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#FFD43B]" />
                    <span>Evidence-Backed Growth Insights</span>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('growth_ai')}
                    className="text-xs text-[#FFD43B] hover:underline"
                  >
                    All ({growthRecs.length}) →
                  </button>
                </h2>

                <div className="space-y-2.5 text-xs">
                  {growthRecs.slice(0, 2).map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3.5 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.05] bg-[#FAF9F6] dark:bg-[#18181C] space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-[#202124] dark:text-white block font-bold">
                          {rec.title}
                        </strong>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#FFD43B]/10 text-[#FFD43B]">
                          {rec.confidence} confidence
                        </span>
                      </div>
                      <p className="text-[#737373] dark:text-[#A1A1AA] leading-relaxed">
                        {rec.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: ALL CONNECTED ACCOUNTS */}
        {activeSubTab === 'accounts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-[#202124] dark:text-white">
                  Multi-Account Intelligence Matrix
                </h2>
                <p className="text-xs text-[#737373]">
                  Granular token health, granted scopes, and verified capabilities for every connected social channel.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('integrations')}
                className="px-3.5 py-2 rounded-2xl bg-[#FFD43B] text-[#202124] text-xs font-bold shadow-xs hover:bg-[#FFD43B]/90 transition"
              >
                + Connect Another Channel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((acc) => (
                <div
                  key={acc.id}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {acc.avatarUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={acc.avatarUrl}
                          alt=""
                          className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center font-bold">
                          {acc.username[0]?.toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-sm font-bold text-[#202124] dark:text-white">
                          @{acc.username}
                        </h3>
                        <p className="text-xs text-[#737373]">{acc.displayName}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {acc.connectionStatus.toUpperCase()}
                    </span>
                  </div>

                  {/* Scopes & Permissions */}
                  <div className="space-y-1.5 pt-2 border-t border-black/5 dark:border-white/[0.05]">
                    <div className="text-[10px] font-bold text-[#737373] uppercase tracking-wider">
                      Granted OAuth Permissions
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {acc.grantedScopes.map((scope) => (
                        <span
                          key={scope}
                          className="px-2 py-0.5 rounded-lg bg-black/5 dark:bg-white/5 text-[10px] font-mono text-[#737373] dark:text-[#A1A1AA]"
                        >
                          {scope}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Telemetry Summary */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                    <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                      <span className="text-[10px] text-[#737373] block">Token Expiration</span>
                      <span className="font-mono text-[11px] text-[#202124] dark:text-white">
                        {acc.tokenExpiresAt ? new Date(acc.tokenExpiresAt).toLocaleDateString() : 'Long-Lived'}
                      </span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                      <span className="text-[10px] text-[#737373] block">Data Coverage</span>
                      <span className="font-mono text-[11px] text-[#202124] dark:text-white">
                        Last {acc.historicalDataCoverageDays} Days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 3: CONTENT INTELLIGENCE HISTORY */}
        {activeSubTab === 'content' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#202124] dark:text-white">
                  Content Intelligence Index
                </h2>
                <p className="text-xs text-[#737373]">
                  Unified historical content memory for all videos, Reels, and posts across connected channels.
                </p>
              </div>

              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#737373]" />
                <input
                  type="text"
                  placeholder="Search caption, title, or handle..."
                  value={contentSearch}
                  onChange={(e) => setContentSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 rounded-xl bg-white dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] text-xs text-[#202124] dark:text-white focus:outline-hidden w-full sm:w-64"
                />
              </div>
            </div>

            {filteredContentList.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#737373] rounded-3xl bg-white/80 dark:bg-[#141418]/80 border border-[#EAE7E1] dark:border-white/[0.08]">
                No content items found matching your filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredContentList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedContentDetail(item)}
                    className="p-4 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] hover:border-[#FFD43B] shadow-sm cursor-pointer transition space-y-3"
                  >
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/10 dark:bg-white/5">
                      {item.thumbnailUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={item.thumbnailUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Video className="w-8 h-8 text-[#737373]" />
                        </div>
                      )}
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                        {item.contentType}
                      </span>
                      {item.durationFormatted && (
                        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/80 text-[10px] font-mono text-white">
                          {item.durationFormatted}
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-xs font-bold text-[#202124] dark:text-white line-clamp-2">
                        {item.title || item.caption || 'Untitled Asset'}
                      </div>
                      <div className="text-[10px] text-[#737373] mt-1 flex items-center justify-between">
                        <span>{item.accountHandle}</span>
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-black/5 dark:border-white/[0.05] text-center">
                      <div className="p-2 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                        <span className="text-[10px] text-[#737373] block">
                          {item.views !== null ? 'Views' : 'Likes'}
                        </span>
                        <span className="text-xs font-black text-[#202124] dark:text-white">
                          {item.views !== null ? item.views.toLocaleString() : (item.likes ?? 0).toLocaleString()}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                        <span className="text-[10px] text-[#737373] block">Comments</span>
                        <span className="text-xs font-black text-[#202124] dark:text-white">
                          {(item.comments ?? 0).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 4: REELS & SHORTS */}
        {activeSubTab === 'reels_shorts' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#202124] dark:text-white">
                Short-Form Video Hub (Reels &amp; Shorts)
              </h2>
              <p className="text-xs text-[#737373]">
                Dedicated performance tracking for 9:16 vertical video assets under 60 seconds.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {reelsAndShorts.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedContentDetail(item)}
                  className="p-4 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] hover:border-[#FFD43B] shadow-sm cursor-pointer transition space-y-3"
                >
                  <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black/10 dark:bg-white/5">
                    {item.thumbnailUrl ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={item.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-8 h-8 text-[#737373]" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded-lg bg-black/70 backdrop-blur-md text-[10px] font-bold text-white uppercase">
                      {item.platform}
                    </span>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#202124] dark:text-white line-clamp-2">
                      {item.title || item.caption || 'Short-Form Video'}
                    </p>
                    <div className="text-[10px] text-[#737373] mt-1 flex items-center justify-between">
                      <span>{item.accountHandle}</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 5: CROSS-ACCOUNT COMPARISON */}
        {activeSubTab === 'compare' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#202124] dark:text-white">
                Cross-Account Comparative Analytics
              </h2>
              <p className="text-xs text-[#737373]">
                Side-by-side performance evaluation across distinct platforms and channels.
              </p>
            </div>

            {comparisons.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#141418]/80 border border-[#EAE7E1] dark:border-white/[0.08] text-center text-xs text-[#737373]">
                At least 2 connected accounts required to activate cross-channel comparative analytics.
              </div>
            ) : (
              comparisons.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-black/5 dark:border-white/[0.05]">
                    <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C] text-center">
                      <span className="text-xs uppercase font-mono text-[#737373] block">
                        Channel A ({comp.accountA.platform.toUpperCase()})
                      </span>
                      <span className="text-base font-black text-[#202124] dark:text-white">
                        @{comp.accountA.username}
                      </span>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C] text-center">
                      <span className="text-xs uppercase font-mono text-[#737373] block">
                        Channel B ({comp.accountB.platform.toUpperCase()})
                      </span>
                      <span className="text-base font-black text-[#202124] dark:text-white">
                        @{comp.accountB.username}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {comp.metrics.map((m) => (
                      <div
                        key={m.metricName}
                        className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.05] bg-[#FAF9F6] dark:bg-[#18181C]"
                      >
                        <div className="text-xs font-bold text-[#202124] dark:text-white w-1/3">
                          {m.displayName}
                        </div>

                        <div className="text-center font-mono font-bold text-xs w-1/3 text-emerald-400">
                          {m.valueA !== null ? m.valueA.toLocaleString() : '—'}
                        </div>

                        <div className="text-right font-mono font-bold text-xs w-1/3 text-sky-400">
                          {m.valueB !== null ? m.valueB.toLocaleString() : '—'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SUBTAB 6: UPCOMING PIPELINE & SCHEDULED */}
        {activeSubTab === 'calendar' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#202124] dark:text-white">
                Upcoming Content &amp; Publishing Pipeline
              </h2>
              <p className="text-xs text-[#737373]">
                Drafts and scheduled releases scheduled for YouTube Shorts and Instagram Reels.
              </p>
            </div>

            {futureContent.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#141418]/80 border border-[#EAE7E1] dark:border-white/[0.08] text-center text-xs text-[#737373] space-y-2">
                <p>No future posts currently queued.</p>
                <button
                  onClick={() => setActiveTab('creator')}
                  className="font-bold text-[#FFD43B] hover:underline"
                >
                  Open Creator Studio to schedule a Reel or Short →
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {futureContent.map((f) => (
                  <div
                    key={f.id}
                    className="p-5 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase font-mono">
                        {f.status}
                      </span>
                      <span className="text-xs text-[#737373] font-mono">
                        Target: {new Date(f.plannedPublicationDate).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#202124] dark:text-white line-clamp-2">
                      {f.topic}
                    </h4>
                    <p className="text-xs text-[#737373] line-clamp-2">{f.caption}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 7: AI GROWTH INTELLIGENCE */}
        {activeSubTab === 'growth_ai' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#202124] dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#FFD43B]" />
                <span>Grounded AI Growth Recommendations</span>
              </h2>
              <p className="text-xs text-[#737373]">
                Insights generated by inspecting authentic channel history, top-performing videos, and posting cadence.
              </p>
            </div>

            <div className="space-y-4">
              {growthRecs.map((rec) => (
                <div
                  key={rec.id}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[#202124] dark:text-white">
                      {rec.title}
                    </h3>
                    <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/20">
                      {rec.confidence} confidence
                    </span>
                  </div>

                  <p className="text-xs text-[#737373] dark:text-[#EAE7E1] leading-relaxed font-medium">
                    {rec.recommendation}
                  </p>

                  <div className="p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C] space-y-1.5 border border-black/5 dark:border-white/[0.05]">
                    <span className="text-[10px] font-bold text-[#737373] uppercase tracking-wider block">
                      Authentic Supporting Observations:
                    </span>
                    <ul className="list-disc list-inside space-y-1 text-xs text-[#737373] dark:text-[#A1A1AA]">
                      {rec.supportingObservations.map((obs, i) => (
                        <li key={i}>{obs}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="text-[11px] text-[#10B981] font-semibold pt-1">
                    Suggested Next Action: {rec.suggestedNextAction}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 8: PERFORMANCE FORECASTING */}
        {activeSubTab === 'forecasts' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-bold text-[#202124] dark:text-white">
                Mathematical Performance Forecasts
              </h2>
              <p className="text-xs text-[#737373]">
                Predictive projections derived from regression over stored snapshots. Zero invented trends.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {forecasts.map((fc, i) => (
                <div
                  key={i}
                  className="p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#202124] dark:text-white">
                      {fc.displayName}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        fc.isSufficientData
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}
                    >
                      {fc.isSufficientData ? 'MATHEMATICAL PROJECTION' : 'INSUFFICIENT DATA'}
                    </span>
                  </div>

                  {fc.isSufficientData ? (
                    <div className="space-y-2">
                      <div className="text-3xl font-black text-[#202124] dark:text-white">
                        {fc.forecastValue?.toLocaleString()}
                      </div>
                      <p className="text-xs text-[#737373]">
                        Confidence Interval: {fc.confidenceInterval?.[0]?.toLocaleString()} –{' '}
                        {fc.confidenceInterval?.[1]?.toLocaleString()}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
                      {fc.insufficientDataReason}
                    </div>
                  )}

                  <div className="text-[10px] text-[#737373] space-y-1 pt-2 border-t border-black/5 dark:border-white/[0.05]">
                    <div>Method: {fc.method}</div>
                    <div>Observations: {fc.observationPointsCount} snapshots</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SUBTAB 9: AI ANALYTICS CONVERSATIONAL ASSISTANT */}
        {activeSubTab === 'assistant' && (
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm flex flex-col h-[520px]">
            <div className="flex items-center justify-between pb-3 border-b border-[#EAE7E1] dark:border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-[#FFD43B]" />
                <h3 className="text-sm font-bold text-[#202124] dark:text-white">
                  Conversational Social Intelligence Analyst
                </h3>
              </div>
              <span className="text-[10px] text-[#737373] font-mono">
                Grounded in {filteredContentList.length} indexed records
              </span>
            </div>

            {/* Message Feed */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1">
              {assistantHistory.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-[#FFD43B] text-[#202124] font-medium'
                        : 'bg-[#FAF9F6] dark:bg-[#18181C] text-[#202124] dark:text-white border border-[#EAE7E1] dark:border-white/[0.08] whitespace-pre-wrap'
                    }`}
                  >
                    {msg.text}
                    <span className="block text-[9px] opacity-60 mt-1 text-right">{msg.time}</span>
                  </div>
                </div>
              ))}
              {isAssistantThinking && (
                <div className="flex justify-start">
                  <div className="rounded-2xl px-4 py-2.5 text-xs bg-[#FAF9F6] dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] text-[#737373] animate-pulse">
                    Analyzing channel telemetry and historical content...
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="pt-3 border-t border-[#EAE7E1] dark:border-white/[0.08] flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'Which of my videos got the highest views?' or 'Compare my accounts'..."
                value={assistantMessage}
                onChange={(e) => setAssistantMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendAssistantMessage()}
                className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] text-xs text-[#202124] dark:text-white focus:outline-hidden"
              />
              <button
                onClick={handleSendAssistantMessage}
                disabled={isAssistantThinking || !assistantMessage.trim()}
                className="p-2.5 rounded-2xl bg-[#FFD43B] text-[#202124] hover:bg-[#FFD43B]/90 disabled:opacity-50 transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Content Item Detail Modal */}
        {selectedContentDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#141418] border border-[#EAE7E1] dark:border-white/[0.08] p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3">
                <span className="text-xs uppercase font-mono font-bold text-[#FFD43B]">
                  {selectedContentDetail.platform} • {selectedContentDetail.contentType}
                </span>
                <button
                  onClick={() => setSelectedContentDetail(null)}
                  className="p-1 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {selectedContentDetail.thumbnailUrl && (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black/5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedContentDetail.thumbnailUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <h3 className="text-sm font-bold text-[#202124] dark:text-white">
                  {selectedContentDetail.title || selectedContentDetail.caption || 'Asset Detail'}
                </h3>
                <p className="text-xs text-[#737373] mt-1">
                  Published on {new Date(selectedContentDetail.publishedAt).toLocaleString()}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C]">
                  <span className="text-[10px] text-[#737373] block">Views</span>
                  <span className="text-sm font-black text-[#202124] dark:text-white">
                    {selectedContentDetail.views !== null ? selectedContentDetail.views.toLocaleString() : '—'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C]">
                  <span className="text-[10px] text-[#737373] block">Likes</span>
                  <span className="text-sm font-black text-[#202124] dark:text-white">
                    {(selectedContentDetail.likes ?? 0).toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C]">
                  <span className="text-[10px] text-[#737373] block">Comments</span>
                  <span className="text-sm font-black text-[#202124] dark:text-white">
                    {(selectedContentDetail.comments ?? 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {selectedContentDetail.permalink && (
                <a
                  href={selectedContentDetail.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-[#FFD43B] hover:text-[#202124] text-xs font-bold transition"
                >
                  <span>Open on {selectedContentDetail.platform}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
