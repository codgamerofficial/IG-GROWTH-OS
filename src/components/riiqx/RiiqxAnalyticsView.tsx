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
  Facebook,
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

  // Facebook Pages Discovery Modal State
  const [isPagesModalOpen, setIsPagesModalOpen] = useState<boolean>(false);
  const [discoveredPages, setDiscoveredPages] = useState<any[]>([]);
  const [isDiscoveringPages, setIsDiscoveringPages] = useState<boolean>(false);
  const [pagesActionMessage, setPagesActionMessage] = useState<string | null>(null);

  // Instagram Profile Telemetry Sync Modal State
  const [isIgSyncModalOpen, setIsIgSyncModalOpen] = useState<boolean>(false);
  const [selectedIgAccount, setSelectedIgAccount] = useState<any | null>(null);
  const [igFollowersInput, setIgFollowersInput] = useState<string>('');
  const [igMediaInput, setIgMediaInput] = useState<string>('');
  const [igBioInput, setIgBioInput] = useState<string>('');
  const [isSavingIgTelemetry, setIsSavingIgTelemetry] = useState<boolean>(false);
  const [igSyncSuccessMsg, setIgSyncSuccessMsg] = useState<string | null>(null);
  const [igSyncErrorMsg, setIgSyncErrorMsg] = useState<string | null>(null);

  // Cross-Account Comparison State
  const [compareAccountAId, setCompareAccountAId] = useState<string>('');
  const [compareAccountBId, setCompareAccountBId] = useState<string>('');

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

  const handleSaveIgTelemetry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIgAccount) return;
    setIsSavingIgTelemetry(true);
    setIgSyncErrorMsg(null);
    setIgSyncSuccessMsg(null);

    try {
      const res = await fetch('/api/social/accounts/instagram/telemetry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedIgAccount.id,
          followersCount: igFollowersInput.trim() !== '' ? Number(igFollowersInput) : undefined,
          mediaCount: igMediaInput.trim() !== '' ? Number(igMediaInput) : undefined,
          bio: igBioInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setIgSyncSuccessMsg(data.message || 'Instagram profile metrics verified & saved!');
        await fetchLiveAnalytics();
        setTimeout(() => {
          setIsIgSyncModalOpen(false);
          setIgSyncSuccessMsg(null);
        }, 1500);
      } else {
        setIgSyncErrorMsg(data.error || 'Failed to save telemetry.');
      }
    } catch (err: any) {
      setIgSyncErrorMsg(err.message || 'Network error.');
    } finally {
      setIsSavingIgTelemetry(false);
    }
  };

  const fetchDiscoveredPages = useCallback(async () => {
    setIsDiscoveringPages(true);
    setPagesActionMessage(null);
    try {
      const res = await fetch('/api/social/pages');
      const data = await res.json();
      if (res.ok && Array.isArray(data.pages)) {
        setDiscoveredPages(data.pages);
      }
    } catch (err) {
      console.error('[fetchDiscoveredPages] error:', err);
    } finally {
      setIsDiscoveringPages(false);
    }
  }, []);

  const handleTogglePageConnection = async (page: any) => {
    try {
      if (page.isConnected) {
        const res = await fetch(`/api/social/pages?pageId=${page.id}`, { method: 'DELETE' });
        const data = await res.json();
        if (data.success) {
          setPagesActionMessage(`Page "${page.name}" disconnected.`);
          fetchDiscoveredPages();
          fetchLiveAnalytics();
        }
      } else {
        const res = await fetch('/api/social/pages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pageId: page.id }),
        });
        const data = await res.json();
        if (data.success) {
          setPagesActionMessage(`Page "${page.name}" connected and activated.`);
          fetchDiscoveredPages();
          fetchLiveAnalytics();
        }
      }
    } catch {
      setPagesActionMessage('Network error toggling page connection.');
    }
  };

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
              {accounts.some((a) => a.platform === 'youtube') && (
                <optgroup label="YouTube Channels">
                  {accounts
                    .filter((a) => a.platform === 'youtube')
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        YouTube: @{acc.username}
                      </option>
                    ))}
                </optgroup>
              )}
              {accounts.some((a) => a.platform === 'instagram') && (
                <optgroup label="Instagram Accounts">
                  {accounts
                    .filter((a) => a.platform === 'instagram')
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        Instagram: @{acc.username}
                      </option>
                    ))}
                </optgroup>
              )}
              {accounts.some((a) => a.platform === 'facebook') && (
                <optgroup label="Facebook Pages">
                  {accounts
                    .filter((a) => a.platform === 'facebook')
                    .map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        Facebook: {acc.displayName || `@${acc.username}`}
                      </option>
                    ))}
                </optgroup>
              )}
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
              <button
                onClick={() => setSelectedPlatform('facebook')}
                title="Meta Facebook Pages"
                className={`p-1.5 rounded-xl transition ${
                  selectedPlatform === 'facebook'
                    ? 'bg-[#1877F2]/20 text-[#1877F2]'
                    : 'text-[#737373] hover:text-[#1877F2]'
                }`}
              >
                <Facebook className="w-4 h-4" />
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
                    const isIg = acc.platform === 'instagram';
                    const isFb = acc.platform === 'facebook';
                    const Icon = isYt ? Youtube : isFb ? Facebook : Instagram;
                    const iconColor = isYt ? 'text-[#FF4D4F]' : isFb ? 'text-[#1877F2]' : 'text-[#FF6B5E]';
                    const isConnected = acc.connectionStatus === 'connected';

                    const primaryMetric = acc.metrics.subscribers || acc.metrics.followers;
                    const primaryLabel = isYt ? 'Subscribers' : isFb ? 'Page Followers' : 'Followers';
                    const isPrimaryCached = primaryMetric?.status === 'CACHED';

                    let secondaryMetric = acc.metrics.totalViews;
                    let secondaryLabel = 'Channel Views';

                    if (
                      isYt &&
                      (secondaryMetric?.value === null || secondaryMetric?.value === undefined) &&
                      acc.metrics.publishedContentCount?.value !== null &&
                      acc.metrics.publishedContentCount?.value !== undefined
                    ) {
                      secondaryMetric = acc.metrics.publishedContentCount;
                      secondaryLabel = 'Published Videos';
                    } else if (!isYt) {
                      secondaryMetric = acc.metrics.publishedContentCount;
                      secondaryLabel = isFb ? 'Published Posts' : 'Media Posts';
                    }
                    const isSecondaryCached = secondaryMetric?.status === 'CACHED';

                    return (
                      <div
                        key={acc.id}
                        className="p-5 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#18181C] space-y-3 flex flex-col justify-between"
                      >
                        <div className="space-y-3">
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
                              <div className="text-[10px] text-[#737373] flex items-center justify-between">
                                <span>{primaryLabel}</span>
                                {isPrimaryCached && (
                                  <span className="text-[8px] font-bold text-amber-500 uppercase">Cached</span>
                                )}
                              </div>
                              <div className="text-base font-black text-[#202124] dark:text-white">
                                {primaryMetric?.value !== null && primaryMetric?.value !== undefined ? (
                                  primaryMetric.value.toLocaleString()
                                ) : isIg ? (
                                  <button
                                    onClick={() => {
                                      setSelectedIgAccount(acc);
                                      setIgFollowersInput('');
                                      setIgMediaInput('');
                                      setIsIgSyncModalOpen(true);
                                    }}
                                    className="text-xs font-semibold text-[#FFD43B] hover:underline flex items-center gap-1"
                                  >
                                    <span>Sync Live</span>
                                    <SlidersHorizontal className="w-3 h-3" />
                                  </button>
                                ) : (
                                  'Not Available'
                                )}
                              </div>
                            </div>

                            <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#141418]">
                              <div className="text-[10px] text-[#737373] flex items-center justify-between">
                                <span>{secondaryLabel}</span>
                                {isSecondaryCached && (
                                  <span className="text-[8px] font-bold text-amber-500 uppercase">Cached</span>
                                )}
                              </div>
                              <div className="text-base font-black text-[#202124] dark:text-white">
                                {secondaryMetric?.value !== null && secondaryMetric?.value !== undefined ? (
                                  secondaryMetric.value.toLocaleString()
                                ) : isIg ? (
                                  <button
                                    onClick={() => {
                                      setSelectedIgAccount(acc);
                                      setIgFollowersInput('');
                                      setIgMediaInput('');
                                      setIsIgSyncModalOpen(true);
                                    }}
                                    className="text-xs font-semibold text-[#FFD43B] hover:underline flex items-center gap-1"
                                  >
                                    <span>Sync Live</span>
                                    <SlidersHorizontal className="w-3 h-3" />
                                  </button>
                                ) : (
                                  'Not Available'
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Actions & Warnings */}
                        <div className="space-y-2 pt-1">
                          {/* Instagram Verified Profile Telemetry Sync Action */}
                          {isIg && isConnected && (
                            <button
                              onClick={() => {
                                setSelectedIgAccount(acc);
                                setIgFollowersInput(
                                  primaryMetric?.value !== null && primaryMetric?.value !== undefined
                                    ? String(primaryMetric.value)
                                    : ''
                                );
                                setIgMediaInput(
                                  secondaryMetric?.value !== null && secondaryMetric?.value !== undefined
                                    ? String(secondaryMetric.value)
                                    : ''
                                );
                                setIsIgSyncModalOpen(true);
                              }}
                              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[11px] font-bold transition"
                            >
                              <SlidersHorizontal className="w-3 h-3" />
                              <span>Verify / Sync Profile Metrics</span>
                            </button>
                          )}
                          {/* Reconnect Action if Expired */}
                          {!isConnected && (
                            <a
                              href={
                                isYt
                                  ? '/api/social/oauth/authorize?provider=youtube'
                                  : '/api/social/oauth/authorize?provider=meta'
                              }
                              className="flex items-center justify-center gap-1.5 w-full py-1.5 px-3 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] text-[11px] font-bold shadow-xs transition"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>Reconnect Channel</span>
                            </a>
                          )}

                          {/* Connection Warning Note */}
                          {!isConnected && (
                            <div className="p-2 rounded-xl text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 flex items-start gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                              <span>
                                OAuth access token expired. Click Reconnect Channel above to resume live telemetry.
                              </span>
                            </div>
                          )}

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
                        className="flex items-center justify-between p-3 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.05] hover:border-[#FFD43B] bg-[#FAF9F6] dark:bg-[#18181C] cursor-pointer transition gap-3"
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                          {item.thumbnailUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.thumbnailUrl}
                              alt=""
                              className="w-12 h-12 rounded-xl object-cover shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center shrink-0">
                              <Video className="w-5 h-5 text-[#737373]" />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-[#202124] dark:text-white truncate">
                              {item.title || item.caption || 'Untitled Asset'}
                            </div>
                            <div className="text-[10px] text-[#737373] flex items-center gap-2 mt-0.5">
                              <span className="uppercase font-mono">{item.contentType}</span>
                              <span>•</span>
                              <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>

                        <div className="text-right shrink-0 whitespace-nowrap pl-2">
                          <div className="text-xs font-black text-[#202124] dark:text-white whitespace-nowrap">
                            {item.views !== null ? `${item.views.toLocaleString()} views` : `${item.likes ?? 0} likes`}
                          </div>
                          <div className="text-[10px] text-[#737373] whitespace-nowrap">{item.comments ?? 0} comments</div>
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
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => {
                    setIsPagesModalOpen(true);
                    fetchDiscoveredPages();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#1877F2]/10 text-[#1877F2] border border-[#1877F2]/20 hover:bg-[#1877F2]/20 text-xs font-bold transition shadow-2xs"
                >
                  <Facebook className="w-3.5 h-3.5" />
                  <span>Discover &amp; Manage Facebook Pages</span>
                </button>
                <button
                  onClick={() => setActiveTab('integrations')}
                  className="px-3.5 py-2 rounded-2xl bg-[#FFD43B] text-[#202124] text-xs font-bold shadow-xs hover:bg-[#FFD43B]/90 transition"
                >
                  + Connect Another Channel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {accounts.map((acc) => {
                const isYt = acc.platform === 'youtube';
                const isIg = acc.platform === 'instagram';
                const isFb = acc.platform === 'facebook';
                const Icon = isYt ? Youtube : isFb ? Facebook : Instagram;
                const isConnected = acc.connectionStatus === 'connected';

                const primaryMetric = acc.metrics.subscribers || acc.metrics.followers;
                const primaryLabel = isYt ? 'Subscribers' : isFb ? 'Page Followers' : 'Followers';
                const isPrimaryCached = primaryMetric?.status === 'CACHED';

                return (
                  <div
                    key={acc.id}
                    className="p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {acc.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={acc.avatarUrl}
                              alt=""
                              className="w-11 h-11 rounded-full object-cover border border-black/10 dark:border-white/10"
                            />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center font-bold">
                              <Icon className={`w-5 h-5 ${isYt ? 'text-[#FF4D4F]' : isFb ? 'text-[#1877F2]' : 'text-[#FF6B5E]'}`} />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-[#202124] dark:text-white">
                                {acc.displayName || `@${acc.username}`}
                              </h3>
                              <span className="text-[10px] font-mono text-[#737373]">
                                (@{acc.username})
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#737373] flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {acc.platform} • {acc.accountType}
                              </span>
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            isConnected
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                          }`}
                        >
                          {isConnected ? 'AUTHENTICATED' : 'REAUTH NEEDED'}
                        </span>
                      </div>

                      {/* Primary Metrics Summary */}
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                          <span className="text-[10px] text-[#737373] flex items-center justify-between">
                            <span>{primaryLabel}</span>
                            {isPrimaryCached && (
                              <span className="text-[8px] font-bold text-amber-500 uppercase">Cached</span>
                            )}
                          </span>
                          <span className="font-mono font-bold text-base text-[#202124] dark:text-white">
                            {primaryMetric?.value !== null && primaryMetric?.value !== undefined
                              ? primaryMetric.value.toLocaleString()
                              : 'Not Available'}
                          </span>
                        </div>
                        <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                          <span className="text-[10px] text-[#737373] block">Published Content</span>
                          <span className="font-mono font-bold text-base text-[#202124] dark:text-white">
                            {acc.metrics.publishedContentCount?.value !== null &&
                            acc.metrics.publishedContentCount?.value !== undefined
                              ? acc.metrics.publishedContentCount.value.toLocaleString()
                              : '—'}
                          </span>
                        </div>
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
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                          <span className="text-[10px] text-[#737373] block">Token Expiration</span>
                          <span className="font-mono text-[11px] text-[#202124] dark:text-white">
                            {acc.tokenExpiresAt ? new Date(acc.tokenExpiresAt).toLocaleDateString() : 'Long-Lived'}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C]">
                          <span className="text-[10px] text-[#737373] block">Data Coverage</span>
                          <span className="font-mono text-[11px] text-[#202124] dark:text-white">
                            Last {acc.historicalDataCoverageDays} Days
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Reconnect Action if Expired */}
                    {!isConnected && (
                      <div className="pt-3 border-t border-black/5 dark:border-white/[0.05] space-y-2">
                        <a
                          href={
                            isYt
                              ? '/api/social/oauth/authorize?provider=youtube'
                              : '/api/social/oauth/authorize?provider=meta'
                          }
                          className="flex items-center justify-center gap-1.5 w-full py-2 px-3 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] text-xs font-bold shadow-xs transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reconnect Channel</span>
                        </a>
                        <p className="text-[10px] text-amber-500 bg-amber-500/10 p-2 rounded-xl border border-amber-500/20">
                          OAuth access token expired. Re-authenticate above to resume live API polling.
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-[#202124] dark:text-white">
                  Cross-Account Comparative Analytics
                </h2>
                <p className="text-xs text-[#737373]">
                  Side-by-side performance evaluation across YouTube, Instagram, and Facebook.
                </p>
              </div>

              {/* Dynamic Account Pair Selector */}
              {accounts.length >= 2 && (
                <div className="flex flex-wrap items-center gap-2 p-2 rounded-2xl bg-white/80 dark:bg-[#141418]/80 border border-[#EAE7E1] dark:border-white/[0.08] shadow-2xs">
                  <select
                    value={compareAccountAId || accounts[0]?.id}
                    onChange={(e) => setCompareAccountAId(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-[#18181C] text-xs font-bold text-[#202124] dark:text-white border border-black/10 dark:border-white/10 focus:outline-hidden"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.platform.toUpperCase()}: {a.displayName || `@${a.username}`}
                      </option>
                    ))}
                  </select>
                  <span className="text-xs font-black text-[#FFD43B] px-1">VS</span>
                  <select
                    value={compareAccountBId || accounts[1]?.id}
                    onChange={(e) => setCompareAccountBId(e.target.value)}
                    className="px-2.5 py-1.5 rounded-xl bg-black/5 dark:bg-[#18181C] text-xs font-bold text-[#202124] dark:text-white border border-black/10 dark:border-white/10 focus:outline-hidden"
                  >
                    {accounts.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.platform.toUpperCase()}: {a.displayName || `@${a.username}`}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Dynamic Comparison Card for the chosen pair */}
            {(() => {
              const accountA = accounts.find((a) => a.id === (compareAccountAId || accounts[0]?.id)) || accounts[0];
              const accountB = accounts.find((a) => a.id === (compareAccountBId || accounts[1]?.id)) || accounts[1];

              if (!accountA || !accountB || accountA.id === accountB.id) {
                return (
                  <div className="p-8 rounded-3xl bg-white/80 dark:bg-[#141418]/80 border border-[#EAE7E1] dark:border-white/[0.08] text-center text-xs text-[#737373]">
                    Please select two distinct channels to view comparative analytics.
                  </div>
                );
              }

              const isYtA = accountA.platform === 'youtube';
              const isFbA = accountA.platform === 'facebook';
              const IconA = isYtA ? Youtube : isFbA ? Facebook : Instagram;

              const isYtB = accountB.platform === 'youtube';
              const isFbB = accountB.platform === 'facebook';
              const IconB = isYtB ? Youtube : isFbB ? Facebook : Instagram;

              const valAudienceA = accountA.metrics.followers?.value ?? accountA.metrics.subscribers?.value ?? null;
              const valAudienceB = accountB.metrics.followers?.value ?? accountB.metrics.subscribers?.value ?? null;

              const valPostsA = accountA.metrics.publishedContentCount?.value ?? null;
              const valPostsB = accountB.metrics.publishedContentCount?.value ?? null;

              const valViewsA = accountA.metrics.totalViews?.value ?? null;
              const valViewsB = accountB.metrics.totalViews?.value ?? null;

              const valLikesA = accountA.metrics.totalLikes?.value ?? null;
              const valLikesB = accountB.metrics.totalLikes?.value ?? null;

              const valCommentsA = accountA.metrics.totalComments?.value ?? null;
              const valCommentsB = accountB.metrics.totalComments?.value ?? null;

              const valEngagementA = accountA.metrics.avgEngagementRate?.value ?? null;
              const valEngagementB = accountB.metrics.avgEngagementRate?.value ?? null;

              const dynamicMetrics = [
                {
                  name: 'Audience (Followers / Subs)',
                  valA: valAudienceA,
                  valB: valAudienceB,
                  unit: '',
                },
                {
                  name: 'Published Content Assets',
                  valA: valPostsA,
                  valB: valPostsB,
                  unit: '',
                },
                {
                  name: 'Total Channel / Post Views',
                  valA: valViewsA,
                  valB: valViewsB,
                  unit: '',
                },
                {
                  name: 'Tracked Interactions (Likes)',
                  valA: valLikesA,
                  valB: valLikesB,
                  unit: '',
                },
                {
                  name: 'Tracked Comments',
                  valA: valCommentsA,
                  valB: valCommentsB,
                  unit: '',
                },
                {
                  name: 'Average Engagement Rate',
                  valA: valEngagementA,
                  valB: valEngagementB,
                  unit: '%',
                },
              ];

              return (
                <div className="p-6 rounded-3xl bg-white/80 dark:bg-[#141418]/80 backdrop-blur-md border border-[#EAE7E1] dark:border-white/[0.08] shadow-sm space-y-6">
                  {/* Channels Headers */}
                  <div className="grid grid-cols-2 gap-4 pb-4 border-b border-black/5 dark:border-white/[0.05]">
                    <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <IconA className={`w-5 h-5 ${isYtA ? 'text-[#FF4D4F]' : isFbA ? 'text-[#1877F2]' : 'text-[#FF6B5E]'}`} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-[#737373] block">
                          Channel A • {accountA.platform.toUpperCase()}
                        </span>
                        <span className="text-sm font-black text-[#202124] dark:text-white">
                          {accountA.displayName || `@${accountA.username}`}
                        </span>
                        <span className="text-[10px] text-[#737373] block">@{accountA.username}</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                        <IconB className={`w-5 h-5 ${isYtB ? 'text-[#FF4D4F]' : isFbB ? 'text-[#1877F2]' : 'text-[#FF6B5E]'}`} />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-[#737373] block">
                          Channel B • {accountB.platform.toUpperCase()}
                        </span>
                        <span className="text-sm font-black text-[#202124] dark:text-white">
                          {accountB.displayName || `@${accountB.username}`}
                        </span>
                        <span className="text-[10px] text-[#737373] block">@{accountB.username}</span>
                      </div>
                    </div>
                  </div>

                  {/* Comparative Metrics Table */}
                  <div className="space-y-2.5">
                    {dynamicMetrics.map((m) => {
                      const isWinnerA = m.valA !== null && m.valB !== null && m.valA > m.valB;
                      const isWinnerB = m.valA !== null && m.valB !== null && m.valB > m.valA;

                      return (
                        <div
                          key={m.name}
                          className="flex items-center justify-between p-3.5 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.05] bg-[#FAF9F6] dark:bg-[#18181C]"
                        >
                          <div className="text-xs font-bold text-[#202124] dark:text-white w-2/5">
                            {m.name}
                          </div>

                          <div
                            className={`text-center font-mono font-bold text-xs w-1/4 ${
                              isWinnerA ? 'text-emerald-400 font-black' : 'text-[#202124] dark:text-white'
                            }`}
                          >
                            {m.valA !== null ? `${m.valA.toLocaleString()}${m.unit}` : '—'}
                            {isWinnerA && (
                              <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                LEADER
                              </span>
                            )}
                          </div>

                          <div
                            className={`text-right font-mono font-bold text-xs w-1/4 ${
                              isWinnerB ? 'text-emerald-400 font-black' : 'text-[#202124] dark:text-white'
                            }`}
                          >
                            {m.valB !== null ? `${m.valB.toLocaleString()}${m.unit}` : '—'}
                            {isWinnerB && (
                              <span className="ml-1 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                LEADER
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
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
                  onClick={() => setActiveTab('chat')}
                  className="font-bold text-[#FFD43B] hover:underline"
                >
                  Open AI Agent Chat to plan or schedule content →
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

        {/* Facebook Pages Discovery & Management Modal */}
        {isPagesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="w-full max-w-2xl rounded-3xl bg-white dark:bg-[#141418] border border-[#EAE7E1] dark:border-white/[0.08] p-6 shadow-2xl space-y-5 max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center">
                    <Facebook className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#202124] dark:text-white">
                      Discover &amp; Manage Facebook Pages
                    </h3>
                    <p className="text-[11px] text-[#737373]">
                      Official Meta Graph API v26.0 • Discovered Administered Pages
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={fetchDiscoveredPages}
                    disabled={isDiscoveringPages}
                    className="p-1.5 rounded-xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-xs font-bold text-[#202124] dark:text-white transition flex items-center gap-1"
                    title="Rescan Meta Graph API"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isDiscoveringPages ? 'animate-spin text-[#FFD43B]' : ''}`} />
                    <span className="text-[11px] hidden sm:inline">Refresh Discovery</span>
                  </button>
                  <button
                    onClick={() => setIsPagesModalOpen(false)}
                    className="p-1.5 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Action Message Feedback */}
              {pagesActionMessage && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center justify-between">
                  <span>{pagesActionMessage}</span>
                  <button onClick={() => setPagesActionMessage(null)} className="text-[10px] hover:underline">
                    Dismiss
                  </button>
                </div>
              )}

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isDiscoveringPages ? (
                  <div className="py-12 text-center text-xs text-[#737373] animate-pulse">
                    Querying Meta Graph API v26.0 for administered Facebook Pages...
                  </div>
                ) : discoveredPages.length === 0 ? (
                  <div className="py-10 text-center space-y-2 text-xs text-[#737373]">
                    <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                    <p className="font-bold text-[#202124] dark:text-white">No Facebook Pages Found</p>
                    <p className="text-[11px] max-w-md mx-auto">
                      Ensure your Meta account has granted the `pages_show_list`, `pages_manage_posts`, and `pages_read_engagement` scopes in Integrations.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {discoveredPages.map((page) => (
                      <div
                        key={page.id}
                        className="p-4 rounded-2xl border border-[#EAE7E1] dark:border-white/[0.08] bg-[#FAF9F6] dark:bg-[#18181C] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {page.avatarUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={page.avatarUrl}
                              alt=""
                              className="w-10 h-10 rounded-full object-cover border border-black/10 dark:border-white/10"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-[#1877F2]/10 text-[#1877F2] flex items-center justify-center font-bold">
                              <Facebook className="w-5 h-5" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-[#202124] dark:text-white">
                                {page.name}
                              </h4>
                              {page.username && (
                                <span className="text-[10px] text-[#737373] font-mono">
                                  @{page.username}
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#737373] mt-0.5">
                              <span>Category: {page.category || 'General'}</span>
                              <span>•</span>
                              <span className="font-mono">Page ID: {page.id}</span>
                              <span>•</span>
                              <span className="font-bold text-emerald-400">
                                {page.followersCount.toLocaleString()} followers
                              </span>
                            </div>
                            {page.linkedInstagramAccount && (
                              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-[#FF6B5E]">
                                <Instagram className="w-3 h-3" />
                                <span>Linked to Instagram: @{page.linkedInstagramAccount.username}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => handleTogglePageConnection(page)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                              page.isConnected
                                ? 'bg-black/5 dark:bg-white/5 text-[#FF4D4F] hover:bg-[#FF4D4F]/10 border border-[#FF4D4F]/20'
                                : 'bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] shadow-xs'
                            }`}
                          >
                            {page.isConnected ? 'Disconnect' : 'Connect Page'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-[#EAE7E1] dark:border-white/[0.08] flex items-center justify-between text-[11px] text-[#737373]">
                <span>Connected pages are automatically ingested into Social Intelligence OS telemetry.</span>
                <button
                  onClick={() => setIsPagesModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-black/5 dark:bg-white/5 text-xs font-bold text-[#202124] dark:text-white hover:bg-black/10 dark:hover:bg-white/10"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Instagram Real Profile Telemetry Sync Modal */}
        {isIgSyncModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
            <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#141418] border border-[#EAE7E1] dark:border-white/[0.08] p-6 shadow-2xl space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-white/[0.08] pb-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#FF6B5E]/10 text-[#FF6B5E] flex items-center justify-center">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#202124] dark:text-white">
                      Verify &amp; Sync Instagram Metrics
                    </h3>
                    <p className="text-[11px] text-[#737373]">
                      Connected Creator @{selectedIgAccount?.username || 'iam.riik'} • Zero Simulation
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsIgSyncModalOpen(false)}
                  className="p-1.5 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status alerts */}
              {igSyncSuccessMsg && (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{igSyncSuccessMsg}</span>
                </div>
              )}

              {igSyncErrorMsg && (
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{igSyncErrorMsg}</span>
                </div>
              )}

              <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.05] text-xs text-[#737373] space-y-1">
                <div className="font-semibold text-[#202124] dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authentic Data Verification</span>
                </div>
                <p className="text-[11px]">
                  If your personal or creator Instagram profile is not linked to a Facebook Page inside Meta Business Suite, Meta Graph API cannot auto-read your follower stats. Enter your real numbers below to sync genuine analytics without simulated mock data.
                </p>
              </div>

              <form onSubmit={handleSaveIgTelemetry} className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-[#737373] block mb-1">
                    Instagram Follower Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1500"
                    value={igFollowersInput}
                    onChange={(e) => setIgFollowersInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] text-sm font-bold text-[#202124] dark:text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#737373] block mb-1">
                    Published Media / Posts Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 45"
                    value={igMediaInput}
                    onChange={(e) => setIgMediaInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#18181C] border border-[#EAE7E1] dark:border-white/[0.08] text-sm font-bold text-[#202124] dark:text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsIgSyncModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-[#737373] hover:text-[#202124] dark:hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSavingIgTelemetry}
                    className="px-5 py-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-black text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSavingIgTelemetry ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Telemetry...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Save &amp; Sync Metrics</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
