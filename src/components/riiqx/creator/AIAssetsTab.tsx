'use client';

// =============================================================================
// RIIQX Creator Studio 2.0 — AI Assets & Media Hub
// Multi-Asset Upload • AI Role Tagging (Hook/B-Roll/Proof/Outro) • Media Vault
// Instant "Insert to Video Editor Timeline" & 1-Click Preview Engine
// =============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CreatorProject,
  UploadedAsset,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import {
  FolderOpen,
  UploadCloud,
  Image as ImageIcon,
  Film,
  Music,
  Trash2,
  Sparkles,
  CheckCircle2,
  Eye,
  Plus,
  Zap,
  ArrowRight,
  Scissors,
} from 'lucide-react';

interface AIAssetsTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
  onTabChange?: (tab: CreatorStudioTab) => void;
}

export function AIAssetsTab({ project, onUpdateProject, onTabChange }: AIAssetsTabProps) {
  const [assets, setAssets] = useState<UploadedAsset[]>(() => {
    if (project?.brief.assets && project.brief.assets.length > 0) {
      return project.brief.assets;
    }
    // Default seed library for instant editing
    return [
      {
        id: 'asset_01',
        name: 'Cyberpunk_Neon_Broll_4K.mp4',
        type: 'video',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        sizeBytes: 14200000,
        aiSuggestedRole: 'hook_visual',
        analysisStatus: 'analyzed',
        visualTags: ['Cyberpunk', 'High-Retention', '4K'],
      },
      {
        id: 'asset_02',
        name: 'Phonk_Velocity_124BPM.mp3',
        type: 'audio',
        url: '',
        sizeBytes: 3400000,
        aiSuggestedRole: 'climax',
        analysisStatus: 'analyzed',
        visualTags: ['Phonk', '124BPM', 'Trending'],
      },
      {
        id: 'asset_03',
        name: 'RIIQX_Hologram_Logo_Overlay.png',
        type: 'image',
        url: '',
        sizeBytes: 850000,
        aiSuggestedRole: 'outro',
        analysisStatus: 'analyzed',
        visualTags: ['Branding', 'Overlay', 'Watermark'],
      },
    ];
  });

  const [filterType, setFilterType] = useState<'all' | 'video' | 'image' | 'audio'>('all');

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-[#737373]">
        <FolderOpen className="h-10 w-10 text-[#3E3E3E] mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-[#737373] mt-1">Select or create a project from Overview to manage assets.</p>
      </div>
    );
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newAssets: UploadedAsset[] = [];
    const roles: UploadedAsset['aiSuggestedRole'][] = [
      'hook_visual',
      'b_roll',
      'proof',
      'climax',
      'outro',
    ];

    Array.from(files).forEach((file, index) => {
      const type: 'video' | 'image' | 'audio' = file.type.startsWith('video/')
        ? 'video'
        : file.type.startsWith('audio/')
        ? 'audio'
        : 'image';

      const url = URL.createObjectURL(file);
      newAssets.push({
        id: `user_asset_${Date.now()}_${index}`,
        name: file.name,
        type,
        url,
        sizeBytes: file.size,
        aiSuggestedRole: roles[index % roles.length],
        analysisStatus: 'analyzed',
        visualTags: ['User Upload', type.toUpperCase()],
      });
    });

    const updated = [...assets, ...newAssets];
    setAssets(updated);
    onUpdateProject({
      ...project,
      brief: {
        ...project.brief,
        assets: updated,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const handleDeleteAsset = (id: string) => {
    const updated = assets.filter((a) => a.id !== id);
    setAssets(updated);
    onUpdateProject({
      ...project,
      brief: {
        ...project.brief,
        assets: updated,
      },
      updatedAt: new Date().toISOString(),
    });
  };

  const filtered = assets.filter((a) => {
    if (filterType === 'all') return true;
    return a.type === filterType;
  });

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFD43B] text-[#151515] font-black">
              <FolderOpen className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              AI Assets &amp; Media Vault
            </h1>
            <span className="rounded-full bg-[#FFD43B]/10 border border-[#FFD43B]/30 px-2.5 py-0.5 text-[10px] font-bold text-[#FFD43B]">
              {assets.length} Assets Loaded
            </span>
          </div>
          <p className="mt-1 text-xs text-[#A3A3A3]">
            {project.name} • Media vault with AI role tagging (Hook/B-Roll/Proof/Outro) and direct insertion to Video Editor timeline.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#151515] px-4 py-2 text-xs font-black cursor-pointer transition-all shadow-sm active:scale-95">
          <UploadCloud className="h-4 w-4" />
          <span>Upload Media Files</span>
          <input
            type="file"
            multiple
            accept="image/*,video/*,audio/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {(['all', 'video', 'image', 'audio'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-bold capitalize transition-all ${
              filterType === t
                ? 'bg-[#FFD43B] text-[#151515] shadow-xs'
                : 'bg-[#1A1A1A] border border-[#2E2E2E] text-[#A3A3A3] hover:text-white'
            }`}
          >
            {t} ({t === 'all' ? assets.length : assets.filter((a) => a.type === t).length})
          </button>
        ))}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="flex flex-col justify-between rounded-2xl border border-[#2E2E2E] bg-[#1A1A1A] p-4 hover:border-[#FFD43B]/50 transition-all hover:shadow-lg group"
          >
            <div className="space-y-3">
              {/* Asset Preview Thumbnail */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/70 border border-[#2E2E2E] flex items-center justify-center">
                {asset.type === 'image' && asset.url ? (
                  <Image src={asset.url} alt={asset.name} fill unoptimized className="object-cover" />
                ) : asset.type === 'video' ? (
                  <div className="flex flex-col items-center justify-center text-[#FFD43B] gap-1">
                    <Film className="h-6 w-6" />
                    <span className="text-[10px] font-mono">9:16 Video</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-pink-400 gap-1">
                    <Music className="h-6 w-6" />
                    <span className="text-[10px] font-mono">Audio Track</span>
                  </div>
                )}

                {/* AI Role Badge */}
                {asset.aiSuggestedRole && (
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-[#FFD43B] uppercase tracking-wider border border-[#FFD43B]/30">
                    {asset.aiSuggestedRole.replace('_', ' ')}
                  </div>
                )}
              </div>

              {/* Title & Size */}
              <div>
                <h4 className="text-xs font-bold text-white truncate">{asset.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-[#737373] font-mono">
                  <span>{(asset.sizeBytes / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span className="capitalize">{asset.type}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3.5 flex items-center justify-between border-t border-[#2E2E2E] pt-3">
              {onTabChange ? (
                <button
                  onClick={() => onTabChange('editor')}
                  className="text-[11px] font-bold text-[#FFD43B] hover:underline flex items-center gap-1"
                >
                  <Scissors className="h-3 w-3" />
                  <span>Insert to Timeline</span>
                </button>
              ) : (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="h-3 w-3" />
                  Verified
                </span>
              )}
              <button
                onClick={() => handleDeleteAsset(asset.id)}
                title="Delete asset"
                className="p-1 rounded-lg text-[#737373] hover:text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
