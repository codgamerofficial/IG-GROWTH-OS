'use client';

// =============================================================================
// RIIQX — Universal Creative Asset Catalog & Media Hub
// Cross-Module Asset Browser • Multi-Category Filtering • 1-Click Timeline Bridge
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  FolderOpen,
  UploadCloud,
  Film,
  Image as ImageIcon,
  FileText,
  Palette,
  Layers,
  Sparkles,
  ShoppingBag,
  Trash2,
  Copy,
  Check,
  Search,
  ExternalLink,
  RefreshCw,
  Video,
} from 'lucide-react';
import { CreatorProject, CreatorStudioTab } from '@/lib/riiqx/creator-types';
import { CreativeAssetItem, CreativeAssetCategory } from '@/services/assets/asset-service';

interface AIAssetsTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
  onTabChange?: (tab: CreatorStudioTab) => void;
}

export function AIAssetsTab({ onTabChange }: AIAssetsTabProps) {
  const [assets, setAssets] = useState<CreativeAssetItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchCatalogAssets();
  }, [selectedCategory]);

  const fetchCatalogAssets = async () => {
    setLoading(true);
    try {
      const url =
        selectedCategory === 'all'
          ? '/api/riiqx/assets'
          : `/api/riiqx/assets?category=${selectedCategory}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.assets)) {
          setAssets(data.assets);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch asset catalog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyUrl = (url?: string, id?: string) => {
    if (!url) return;
    navigator.clipboard.writeText(url);
    if (id) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredAssets = assets.filter((asset) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      asset.name.toLowerCase().includes(q) ||
      asset.category.toLowerCase().includes(q) ||
      asset.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const categories: Array<{ id: string; label: string; icon: React.ElementType }> = [
    { id: 'all', label: 'All Assets', icon: FolderOpen },
    { id: 'videos', label: 'Videos', icon: Film },
    { id: 'campaign_assets', label: 'Campaign Copy & Storyboards', icon: FileText },
    { id: 'product_images', label: 'Product Renders', icon: ShoppingBag },
    { id: 'brand_profiles', label: 'Brand Kits', icon: Palette },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn select-none">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#27272A] bg-[#121215] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-[#FFD43B]/10 border border-[#FFD43B]/30 flex items-center justify-center text-[#FFD43B]">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">
                Universal Creative Asset Catalog
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/30">
                Shared Hub
              </span>
            </div>
            <p className="text-xs text-[#9E9EA4] mt-0.5">
              Unified cross-module repository indexing videos, storyboards, product scenes, and brand profiles.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchCatalogAssets}
            title="Refresh Catalog"
            className="p-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-[#A1A1AA] hover:text-white transition"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#FFD43B] text-black font-semibold shadow-md shadow-[#FFD43B]/10'
                    : 'bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[#27272A]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-[#71717A]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets by tag, name..."
            className="w-full rounded-lg bg-[#18181B] border border-[#27272A] pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#71717A] focus:outline-none focus:border-[#FFD43B]"
          />
        </div>
      </div>

      {/* Assets Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#71717A] flex items-center justify-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin text-[#FFD43B]" />
          <span>Hydrating Creative Catalog...</span>
        </div>
      ) : filteredAssets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredAssets.map((asset) => {
            const isVideo = asset.category === 'videos' || asset.mimeType?.includes('video');
            const isImage = asset.category === 'product_images' || asset.mimeType?.includes('image');

            return (
              <div
                key={asset.id}
                className="rounded-xl border border-[#27272A] bg-[#121215] overflow-hidden hover:border-[#3F3F46] transition flex flex-col justify-between shadow-lg"
              >
                {/* Visual Thumbnail / Preview Header */}
                <div className="relative aspect-video bg-[#0C0C0E] border-b border-[#1E1E22] flex items-center justify-center overflow-hidden">
                  {isImage && asset.publicUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={asset.publicUrl}
                      alt={asset.name}
                      className="w-full h-full object-contain p-2"
                    />
                  ) : isVideo ? (
                    <div className="flex flex-col items-center gap-2 text-purple-400">
                      <Film className="h-8 w-8 opacity-80" />
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white">
                        MP4 9:16 HD
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-[#FFD43B]">
                      <FileText className="h-8 w-8 opacity-80" />
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/70 text-white">
                        {asset.category.replace('_', ' ')}
                      </span>
                    </div>
                  )}

                  <span className="absolute top-2 left-2 text-[9px] font-mono px-2 py-0.5 rounded bg-black/80 text-[#D4D4D8] border border-white/10 uppercase">
                    {asset.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-3.5 space-y-2 flex-1">
                  <h4 className="text-xs font-semibold text-white truncate" title={asset.name}>
                    {asset.name}
                  </h4>

                  <div className="flex items-center justify-between text-[10px] font-mono text-[#71717A]">
                    <span>{(asset.fileSizeBytes / 1024).toFixed(1)} KB</span>
                    <span>{new Date(asset.createdAt).toLocaleDateString()}</span>
                  </div>

                  {asset.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {asset.tags.slice(0, 3).map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#18181B] border border-[#27272A] text-[#A1A1AA]"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="p-2.5 px-3 border-t border-[#1E1E22] bg-[#151518] flex items-center justify-between gap-2">
                  {asset.publicUrl ? (
                    <button
                      onClick={() => handleCopyUrl(asset.publicUrl, asset.id)}
                      className="flex items-center gap-1 text-[11px] text-[#A1A1AA] hover:text-white transition"
                    >
                      {copiedId === asset.id ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <span className="text-[10px] text-[#71717A] italic">Catalog Indexed</span>
                  )}

                  {isVideo && onTabChange && (
                    <button
                      onClick={() => onTabChange('editor')}
                      className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 transition font-medium"
                    >
                      <Video className="h-3 w-3" />
                      <span>Timeline</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-[#27272A] bg-[#121215] space-y-3">
          <FolderOpen className="h-8 w-8 text-[#71717A] mx-auto" />
          <h3 className="text-sm font-bold text-white">No Assets Found</h3>
          <p className="text-xs text-[#71717A]">
            Generate creative copy in Campaign Studio, commercial scenes in Product Studio, or render vertical videos to populate your universal catalog.
          </p>
        </div>
      )}
    </div>
  );
}
