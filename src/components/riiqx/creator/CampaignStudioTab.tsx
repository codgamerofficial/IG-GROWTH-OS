'use client';

// =============================================================================
// RIIQX — Master AI Campaign Studio UI Component
// Multi-Platform Omnichannel Generation • Brand DNA Injection • Video Bridge
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Megaphone,
  Plus,
  Send,
  Video,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  Target,
  BarChart2,
  RefreshCw,
  ExternalLink,
  Sliders,
  ChevronRight,
  Palette,
  Hash,
  Tv,
  Film,
  Compass,
} from 'lucide-react';
import {
  CampaignProject,
  CampaignAssetItem,
  CampaignObjective,
  CampaignPlatform,
  AssetApprovalStatus,
} from '@/services/campaigns/types';
import { BrandDNA } from '@/services/brand/types';

export function CampaignStudioTab() {
  const [campaigns, setCampaigns] = useState<CampaignProject[]>([]);
  const [activeCampaign, setActiveCampaign] = useState<CampaignProject | null>(null);
  const [brandDNA, setBrandDNA] = useState<BrandDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [generationStage, setGenerationStage] = useState('');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [copiedAssetId, setCopiedAssetId] = useState<string | null>(null);
  const [pushingVideoId, setPushingVideoId] = useState<string | null>(null);
  const [videoSuccessToast, setVideoSuccessToast] = useState<{
    show: boolean;
    projectId?: string;
    storyboardId?: string;
  }>({ show: false });

  // Drawer / Modal State
  const [showNewModal, setShowNewModal] = useState(false);
  const [formName, setFormName] = useState('Q4 Velocity Creator Campaign');
  const [formObjective, setFormObjective] = useState<CampaignObjective>('product_launch');
  const [formPlatforms, setFormPlatforms] = useState<CampaignPlatform[]>([
    'instagram',
    'youtube',
    'facebook',
    'tiktok',
    'linkedin',
  ]);
  const [formDuration, setFormDuration] = useState(14);
  const [formOffer, setFormOffer] = useState('Early access to autonomous AI video engine');
  const [formCTA, setFormCTA] = useState('Deploy your first agent today');
  const [formInstructions, setFormInstructions] = useState('');

  // Fetch initial brand DNA and campaigns
  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Brand DNA
      const brandRes = await fetch('/api/riiqx/brand');
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        if (brandData.success && brandData.brand) {
          setBrandDNA(brandData.brand);
        }
      }

      // 2. Fetch Campaigns
      const campRes = await fetch('/api/riiqx/campaigns');
      if (campRes.ok) {
        const campData = await campRes.json();
        if (campData.success && Array.isArray(campData.campaigns)) {
          setCampaigns(campData.campaigns);
          if (campData.campaigns.length > 0) {
            setActiveCampaign(campData.campaigns[0]);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load initial campaign studio data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Platform toggle helper in modal
  const togglePlatform = (p: CampaignPlatform) => {
    setFormPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  // Generate new campaign
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setGenerating(true);
    setGenerationStage('Injecting Brand DNA & analyzing audience pillars...');

    try {
      setTimeout(() => setGenerationStage('Synthesizing cross-platform retention hooks...'), 1200);
      setTimeout(() => setGenerationStage('Building 9:16 vertical video & feed briefs...'), 2400);

      const res = await fetch('/api/riiqx/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formName,
          objective: formObjective,
          targetPlatforms: formPlatforms,
          durationDays: formDuration,
          offerDetails: formOffer,
          callToAction: formCTA,
          userInstructions: formInstructions,
        }),
      });

      const data = await res.json();
      if (data.success && data.campaign) {
        setCampaigns((prev) => [data.campaign, ...prev]);
        setActiveCampaign(data.campaign);
        setShowNewModal(false);
      } else {
        alert(data.error || 'Failed to generate campaign');
      }
    } catch (err: any) {
      console.error('Campaign generation failed:', err);
      alert('Generation error: ' + err.message);
    } finally {
      setGenerating(false);
      setGenerationStage('');
    }
  };

  // Copy copy to clipboard
  const handleCopy = (asset: CampaignAssetItem) => {
    const textToCopy = `${asset.title}\n\nHook:\n${asset.hookText}\n\nBody:\n${asset.contentBody}\n\nCall To Action:\n${asset.callToAction}\n\n${asset.hashtags.join(' ')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedAssetId(asset.id);
    setTimeout(() => setCopiedAssetId(null), 2000);
  };

  // Update asset copy or status
  const handleUpdateAsset = async (
    assetId: string,
    updates: Partial<CampaignAssetItem>
  ) => {
    if (!activeCampaign) return;

    // Optimistic local update
    const updatedAssets = activeCampaign.assets.map((a) =>
      a.id === assetId ? { ...a, ...updates, updatedAt: new Date().toISOString() } : a
    );
    const updatedCampaign = { ...activeCampaign, assets: updatedAssets };
    setActiveCampaign(updatedCampaign);
    setCampaigns((prev) => prev.map((c) => (c.id === updatedCampaign.id ? updatedCampaign : c)));

    try {
      await fetch(`/api/riiqx/campaigns/${activeCampaign.id}/asset`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId, ...updates }),
      });
    } catch (err) {
      console.warn('Failed to persist asset update:', err);
    }
  };

  // Push asset to AI Video Editor
  const handleSendToVideoEditor = async (assetId: string) => {
    if (!activeCampaign) return;
    setPushingVideoId(assetId);

    try {
      const res = await fetch(`/api/riiqx/campaigns/${activeCampaign.id}/push-video`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId }),
      });

      const data = await res.json();
      if (data.success && data.bridge) {
        // Update local asset status to in_production
        handleUpdateAsset(assetId, { approvalStatus: 'in_production' });
        setVideoSuccessToast({
          show: true,
          projectId: data.bridge.projectId,
          storyboardId: data.bridge.storyboardId,
        });
        setTimeout(() => setVideoSuccessToast({ show: false }), 6000);
      } else {
        alert(data.error || 'Failed to bridge asset to video editor');
      }
    } catch (err: any) {
      alert('Video bridge error: ' + err.message);
    } finally {
      setPushingVideoId(null);
    }
  };

  // Filtered assets
  const filteredAssets = activeCampaign?.assets.filter((a) => {
    if (selectedPlatformFilter === 'all') return true;
    return a.platform === selectedPlatformFilter;
  }) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Banner / Brand Context Telemetry */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#27272A] bg-[#121215] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-[#FFD43B]/10 border border-[#FFD43B]/30 flex items-center justify-center text-[#FFD43B]">
            <Megaphone className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">AI Campaign Studio</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/30">
                Brand-Synced
              </span>
            </div>
            <p className="text-xs text-[#9E9EA4] mt-0.5">
              Omnichannel multi-platform campaign engine grounded directly in your Brand DNA.
            </p>
          </div>
        </div>

        {/* Brand DNA Quick Indicators */}
        <div className="flex items-center gap-3">
          {brandDNA ? (
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#27272A] bg-[#18181B] text-xs">
              <Palette className="h-3.5 w-3.5 text-[#06B6D4]" />
              <span className="text-[#A1A1AA]">Brand:</span>
              <span className="font-semibold text-white">{brandDNA.brandName}</span>
              <div
                className="w-3 h-3 rounded-full border border-white/20 ml-1"
                style={{ backgroundColor: brandDNA.colorPalette.primary }}
                title={`Primary Color: ${brandDNA.colorPalette.primary}`}
              />
              <span className="text-[10px] text-emerald-400 font-mono">
                {brandDNA.confidence?.overallScore || 95}% DNA
              </span>
            </div>
          ) : (
            <div className="text-xs text-[#71717A] italic">Brand DNA hydrating...</div>
          )}

          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-semibold text-xs transition shadow-md shadow-[#FFD43B]/10"
          >
            <Plus className="h-4 w-4" />
            <span>New Campaign</span>
          </button>
        </div>
      </div>

      {/* Video Bridge Notification Toast */}
      {videoSuccessToast.show && (
        <div className="p-4 rounded-xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 flex items-center justify-between shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
            <div>
              <p className="text-xs font-semibold">Video Project & Storyboard Created!</p>
              <p className="text-[11px] text-emerald-400/80">
                Hook, scenes, and brand tokens synchronized to{' '}
                <span className="font-mono text-white">AI Video Editor</span> workspace.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono bg-emerald-900/60 px-2 py-0.5 rounded border border-emerald-500/30">
              {videoSuccessToast.storyboardId}
            </span>
          </div>
        </div>
      )}

      {/* Active Campaign Selector Bar */}
      {campaigns.length > 0 && (
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 border-b border-[#27272A]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider">
              Campaigns ({campaigns.length}):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {campaigns.map((camp) => (
                <button
                  key={camp.id}
                  onClick={() => setActiveCampaign(camp)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 whitespace-nowrap ${
                    activeCampaign?.id === camp.id
                      ? 'bg-[#27272A] text-white border border-[#FFD43B]/40'
                      : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                  }`}
                >
                  <Target className="h-3.5 w-3.5 text-[#FFD43B]" />
                  <span>{camp.name}</span>
                  <span className="text-[10px] font-mono text-[#71717A]">
                    {camp.assets?.length || 0} assets
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchInitialData}
              title="Refresh"
              className="p-1.5 rounded-lg hover:bg-[#27272A] text-[#71717A] hover:text-white transition"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Active Campaign Detail View */}
      {activeCampaign ? (
        <div className="space-y-6">
          {/* Strategy & Narrative Overview Banner */}
          <div className="p-5 rounded-xl border border-[#27272A] bg-[#121215] space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#1E1E22]">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold text-white">{activeCampaign.name}</h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {activeCampaign.objective.replace('_', ' ')}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/10 text-purple-400 border border-purple-500/30">
                    {activeCampaign.durationDays} Days Duration
                  </span>
                </div>
                <p className="text-xs text-[#A1A1AA] mt-1 italic">
                  &quot;{activeCampaign.strategyOverview}&quot;
                </p>
              </div>

              {/* KPI Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {activeCampaign.keyPerformanceIndicators?.map((kpi, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#18181B] border border-[#27272A] text-[11px] text-[#D4D4D8]"
                  >
                    <BarChart2 className="h-3 w-3 text-[#FFD43B]" />
                    <span>{kpi}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4 Content Pillars */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Compass className="h-4 w-4 text-[#FFD43B]" />
                <h3 className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
                  4 Core Content Pillars
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {activeCampaign.contentPillars?.map((pillar, idx) => (
                  <div
                    key={pillar.id || idx}
                    className="p-3.5 rounded-lg border border-[#27272A] bg-[#18181B]/70 hover:border-[#3F3F46] transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-[#71717A]">
                          Pillar 0{idx + 1}
                        </span>
                        <span className="text-[10px] font-medium text-[#06B6D4] px-1.5 py-0.5 rounded bg-[#06B6D4]/10">
                          {pillar.targetEmotion}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-white mt-1.5">{pillar.name}</h4>
                      <p className="text-[11px] text-[#A1A1AA] mt-1 line-clamp-2">
                        {pillar.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-[#27272A]/50 flex flex-wrap gap-1">
                      {pillar.recommendedFormats?.map((fmt, i) => (
                        <span
                          key={i}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-[#27272A] text-[#D4D4D8]"
                        >
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Platform Filters Bar */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-xs text-[#71717A] mr-2">Filter Platform:</span>
              {['all', 'instagram', 'youtube', 'facebook', 'tiktok', 'linkedin'].map((plat) => (
                <button
                  key={plat}
                  onClick={() => setSelectedPlatformFilter(plat)}
                  className={`px-3 py-1 rounded-md text-xs font-medium capitalize transition ${
                    selectedPlatformFilter === plat
                      ? 'bg-[#FFD43B] text-black font-semibold'
                      : 'bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[#27272A]'
                  }`}
                >
                  {plat}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#71717A]">
              Showing {filteredAssets.length} of {activeCampaign.assets.length} assets
            </div>
          </div>

          {/* Campaign Creative Assets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredAssets.map((asset) => {
              const isVideoFormat =
                asset.platform === 'instagram' ||
                asset.platform === 'youtube' ||
                asset.platform === 'tiktok' ||
                asset.assetType.includes('script') ||
                asset.assetType.includes('hook');

              return (
                <div
                  key={asset.id}
                  className="rounded-xl border border-[#27272A] bg-[#121215] flex flex-col justify-between overflow-hidden hover:border-[#3F3F46] transition shadow-lg"
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-[#1E1E22] flex items-center justify-between bg-[#151518]">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-7 w-7 rounded-md flex items-center justify-center text-xs ${
                          asset.platform === 'instagram'
                            ? 'bg-pink-500/10 text-pink-400 border border-pink-500/20'
                            : asset.platform === 'youtube'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                            : asset.platform === 'linkedin'
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : asset.platform === 'tiktok'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {isVideoFormat ? <Film className="h-3.5 w-3.5" /> : <Tv className="h-3.5 w-3.5" />}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">{asset.title}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[10px] font-mono capitalize text-[#A1A1AA]">
                            {asset.platform}
                          </span>
                          <span className="text-[10px] text-[#71717A]">•</span>
                          <span className="text-[10px] font-mono text-[#A1A1AA]">
                            {asset.assetType.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <button
                      onClick={() =>
                        handleUpdateAsset(asset.id, {
                          approvalStatus:
                            asset.approvalStatus === 'approved' ? 'draft' : 'approved',
                        })
                      }
                      title="Click to toggle approval"
                      className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wide border transition flex items-center gap-1 ${
                        asset.approvalStatus === 'approved'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                          : asset.approvalStatus === 'in_production'
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                          : 'bg-[#27272A] text-[#A1A1AA] border-[#3F3F46]'
                      }`}
                    >
                      {asset.approvalStatus === 'approved' && <Check className="h-3 w-3" />}
                      {asset.approvalStatus === 'in_production' && <Clock className="h-3 w-3" />}
                      <span>{asset.approvalStatus.replace('_', ' ')}</span>
                    </button>
                  </div>

                  {/* Card Content Body */}
                  <div className="p-4 space-y-4 flex-1">
                    {/* Hook Section */}
                    {asset.hookText && (
                      <div className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-[#FFD43B] uppercase tracking-wider flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            3-Second Hook
                          </span>
                          <span className="text-[9px] font-mono text-[#71717A]">
                            {asset.hookText.length} chars
                          </span>
                        </div>
                        <p className="text-xs font-medium text-white leading-relaxed">
                          &quot;{asset.hookText}&quot;
                        </p>
                      </div>
                    )}

                    {/* Main Script / Body */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider">
                        Script / Content Copy
                      </label>
                      <textarea
                        value={asset.contentBody}
                        onChange={(e) => handleUpdateAsset(asset.id, { contentBody: e.target.value })}
                        rows={5}
                        className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#FFD43B]/60 font-sans leading-relaxed resize-none"
                      />
                    </div>

                    {/* Visual & B-Roll Instructions (if video format) */}
                    {(asset.visualDirections || asset.bRollSuggestions) && (
                      <div className="p-3 rounded-lg bg-[#0F0F12] border border-[#202025] space-y-2 text-[11px]">
                        {asset.visualDirections && (
                          <div>
                            <span className="text-[10px] font-semibold text-[#06B6D4] uppercase tracking-wider block">
                              Visual Direction:
                            </span>
                            <span className="text-[#A1A1AA]">{asset.visualDirections}</span>
                          </div>
                        )}
                        {asset.bRollSuggestions && (
                          <div>
                            <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider block">
                              B-Roll Suggestion:
                            </span>
                            <span className="text-[#A1A1AA]">{asset.bRollSuggestions}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Call to Action & Hashtags */}
                    <div className="space-y-2 pt-2 border-t border-[#1E1E22]">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-[#71717A] uppercase">CTA:</span>
                        <span className="text-xs font-medium text-[#FFD43B]">
                          {asset.callToAction}
                        </span>
                      </div>

                      {asset.hashtags?.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {asset.hashtags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[10px] font-mono text-[#06B6D4] bg-[#06B6D4]/10 px-1.5 py-0.5 rounded"
                            >
                              {tag.startsWith('#') ? tag : `#${tag}`}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-3 border-t border-[#1E1E22] bg-[#151518] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopy(asset)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#323238] text-white text-xs transition"
                    >
                      {copiedAssetId === asset.id ? (
                        <>
                          <Check className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-[#A1A1AA]" />
                          <span>Copy Text</span>
                        </>
                      )}
                    </button>

                    {/* Send to Video Editor Bridge Button */}
                    {isVideoFormat && (
                      <button
                        onClick={() => handleSendToVideoEditor(asset.id)}
                        disabled={pushingVideoId === asset.id}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD43B]/10 hover:bg-[#FFD43B]/20 border border-[#FFD43B]/40 text-[#FFD43B] text-xs font-medium transition disabled:opacity-50"
                      >
                        {pushingVideoId === asset.id ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            <span>Building Video Storyboard...</span>
                          </>
                        ) : (
                          <>
                            <Video className="h-3.5 w-3.5" />
                            <span>Send to Video Editor</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-[#27272A] bg-[#121215] space-y-4">
          <div className="h-12 w-12 rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 flex items-center justify-center text-[#FFD43B] mx-auto">
            <Megaphone className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No Campaigns Generated Yet</h3>
            <p className="text-xs text-[#A1A1AA] max-w-md mx-auto mt-1">
              Create your first omnichannel campaign. The AI will pull in your active Brand DNA,
              synthesize 4 content pillars, and output scripts for Reels, Shorts, and Feed.
            </p>
          </div>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-semibold text-xs transition"
          >
            Create First Campaign
          </button>
        </div>
      )}

      {/* New Campaign Modal Drawer */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl rounded-2xl border border-[#27272A] bg-[#121215] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-[#FFD43B]/10 border border-[#FFD43B]/30 flex items-center justify-center text-[#FFD43B]">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">New Omnichannel Campaign</h3>
                  <p className="text-xs text-[#71717A]">
                    Powered by RIIQX AI Multi-Channel Strategy Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[#71717A] hover:text-white transition p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Campaign Name
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Creator OS Q4 Launch"
                  required
                  className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    Objective
                  </label>
                  <select
                    value={formObjective}
                    onChange={(e) => setFormObjective(e.target.value as CampaignObjective)}
                    className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  >
                    <option value="product_launch">Product Launch</option>
                    <option value="brand_awareness">Brand Awareness</option>
                    <option value="sales_promotion">Sales Promotion</option>
                    <option value="seasonal">Seasonal / Holiday</option>
                    <option value="social_engagement">Viral Social Engagement</option>
                    <option value="lead_generation">Lead Generation</option>
                    <option value="product_education">Product Education</option>
                    <option value="influencer">Influencer Collaboration</option>
                    <option value="festival">Festival Campaign</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min={3}
                    max={90}
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
              </div>

              {/* Target Platforms */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1.5">
                  Target Platforms
                </label>
                <div className="flex flex-wrap gap-2">
                  {(['instagram', 'youtube', 'facebook', 'tiktok', 'linkedin', 'twitter'] as CampaignPlatform[]).map(
                    (p) => (
                      <button
                        type="button"
                        key={p}
                        onClick={() => togglePlatform(p)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition flex items-center gap-1.5 ${
                          formPlatforms.includes(p)
                            ? 'bg-[#FFD43B] text-black font-semibold'
                            : 'bg-[#18181B] text-[#71717A] border border-[#27272A]'
                        }`}
                      >
                        {formPlatforms.includes(p) && <Check className="h-3 w-3" />}
                        <span>{p}</span>
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Offer Details */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Key Offer or Angle
                </label>
                <input
                  type="text"
                  value={formOffer}
                  onChange={(e) => setFormOffer(e.target.value)}
                  placeholder="e.g. 50% Early Access or Free Audit"
                  className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              {/* Call to Action */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Call to Action (CTA)
                </label>
                <input
                  type="text"
                  value={formCTA}
                  onChange={(e) => setFormCTA(e.target.value)}
                  placeholder="e.g. Click link in bio to test it live"
                  className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              {/* Custom Instructions */}
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Specific Creator Instructions (Optional)
                </label>
                <textarea
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  rows={2}
                  placeholder="e.g. Focus heavily on fast pacing and relatable creator burnout hooks."
                  className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B] resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#27272A] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  disabled={generating}
                  className="px-4 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-[#A1A1AA] text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating || formPlatforms.length === 0}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-semibold text-xs transition disabled:opacity-50"
                >
                  {generating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>{generationStage || 'Generating...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      <span>Generate Campaign</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

