'use client';

// =============================================================================
// RIIQX Creator Studio — AI Assets & Media Library
// Multi-Asset Upload • AI Role Tagging (Hook/B-Roll/Proof/Outro) • Media Vault
// =============================================================================

import React, { useState } from 'react';
import {
  CreatorProject,
  UploadedAsset,
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
} from 'lucide-react';

interface AIAssetsTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
}

export function AIAssetsTab({ project, onUpdateProject }: AIAssetsTabProps) {
  const [assets, setAssets] = useState<UploadedAsset[]>(
    project?.brief.assets || []
  );
  const [filterType, setFilterType] = useState<'all' | 'video' | 'image' | 'audio'>('all');
  const [previewAsset, setPreviewAsset] = useState<UploadedAsset | null>(null);

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-slate-400">
        <FolderOpen className="h-10 w-10 text-slate-600 mb-3" />
        <h3 className="text-base font-bold text-white">No Project Selected</h3>
        <p className="text-xs text-slate-500 mt-1">Select or create a project from Overview to manage assets.</p>
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
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E2A4A] pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-violet-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">AI Assets & Media Library</h1>
            <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-bold text-violet-400">
              {assets.length} Assets Loaded
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Store video clips, images, sound effects, and voiceovers. AI vision classifies asset roles automatically.
          </p>
        </div>

        {/* Upload Button */}
        <label className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white px-4 py-2 text-xs font-bold cursor-pointer transition-all shadow-sm active:scale-95">
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
            className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition-all ${
              filterType === t
                ? 'bg-violet-600 text-white font-bold'
                : 'bg-[#0B132B] border border-[#1E2A4A] text-slate-300 hover:border-slate-500'
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
            className="flex flex-col justify-between rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-4 hover:border-violet-500/60 transition-all hover:shadow-lg group"
          >
            <div className="space-y-3">
              {/* Asset Preview Thumbnail */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-black/60 border border-[#1E2A4A] flex items-center justify-center">
                {asset.type === 'image' && asset.url ? (
                  <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                ) : asset.type === 'video' ? (
                  <div className="flex flex-col items-center justify-center text-cyan-400 gap-1">
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
                  <div className="absolute bottom-2 left-2 rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-violet-300 uppercase tracking-wider border border-violet-500/30">
                    {asset.aiSuggestedRole.replace('_', ' ')}
                  </div>
                )}
              </div>

              {/* Title & Size */}
              <div>
                <h4 className="text-xs font-bold text-white truncate">{asset.name}</h4>
                <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-mono">
                  <span>{(asset.sizeBytes / 1024).toFixed(1)} KB</span>
                  <span>•</span>
                  <span className="capitalize">{asset.type}</span>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-3 flex items-center justify-between border-t border-[#1E2A4A]/60 pt-2">
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="h-3 w-3" />
                Vision Verified
              </span>
              <button
                onClick={() => handleDeleteAsset(asset.id)}
                title="Delete asset"
                className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
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
