'use client';

// =============================================================================
// RIIQX — Header Bar (Cinematic, Modern, High-Contrast)
// One Goal. An AI That Gets It Done.
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxEmblem } from './RiiqxEmblem';
import {
  ChevronDown,
  Plus,
  Sparkles,
  Download,
  Cloud,
  Check,
} from 'lucide-react';

export function RiiqxHeader() {
  const {
    models,
    selectedModel,
    setSelectedModel,
    createNewConversation,
    providerHealth,
    exportData,
  } = useRiiqx();

  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);

  const isBedrockOnline = providerHealth?.bedrock?.status === 'online';

  const handleExport = () => {
    const json = exportData();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `riiqx_workspace_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="relative z-30 flex h-16 w-full items-center justify-between border-b border-[#1E2A4A] bg-[#030712]/95 px-4 backdrop-blur-md sm:px-6">
      {/* Left: Brand & Tagline */}
      <div className="flex items-center gap-3">
        <RiiqxEmblem size={32} glow={true} />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-lg font-black tracking-wider text-white">RIIQX</span>
            <span className="hidden sm:inline-flex rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-400">
              ONLINE FIRST
            </span>
          </div>
          <span className="hidden md:inline text-[11px] font-medium text-[#94A3B8]">
            One Goal. An AI That Gets It Done.
          </span>
        </div>
      </div>

      {/* Center: Online Model Selector */}
      <div className="relative">
        <button
          onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
          className="flex items-center gap-2.5 rounded-xl border border-[#1E2A4A] bg-[#070D1F] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:border-cyan-500/40 hover:bg-[#0B132B]"
        >
          <span
            className={`h-2 w-2 rounded-full ${
              selectedModel.provider === 'bedrock'
                ? isBedrockOnline
                  ? 'bg-emerald-400 animate-pulse'
                  : 'bg-purple-400'
                : 'bg-cyan-400'
            }`}
          />
          <span className="truncate max-w-[140px] sm:max-w-[200px]">{selectedModel.name}</span>
          <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
        </button>

        {isModelDropdownOpen && (
          <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-2 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn">
            <div className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
              Select Online Model
            </div>
            <div className="space-y-1">
              {models.map((m) => {
                const isSelected = m.id === selectedModel.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => {
                      setSelectedModel(m);
                      setIsModelDropdownOpen(false);
                    }}
                    className={`flex w-full items-start justify-between rounded-xl p-2.5 text-left text-xs transition ${
                      isSelected
                        ? 'border border-cyan-500/40 bg-[#0B132B] text-white'
                        : 'text-[#94A3B8] hover:bg-[#0B132B]/60 hover:text-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 font-semibold">
                        <span>{m.name}</span>
                        {m.isOnline && (
                          <span className="rounded bg-cyan-500/10 px-1 py-0.2 text-[9px] text-cyan-400 font-mono">
                            Cloud
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#64748B] line-clamp-1">{m.tag}</p>
                    </div>
                    {isSelected && <Check className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={handleExport}
          title="Export Workspace Data (JSON)"
          className="hidden sm:flex items-center gap-1.5 rounded-xl border border-[#1E2A4A] bg-[#070D1F] px-3 py-1.5 text-xs font-semibold text-[#94A3B8] hover:border-[#2D4170] hover:text-white transition"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Export</span>
        </button>

        <button
          onClick={() => createNewConversation()}
          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 hover:brightness-110 transition active:scale-95"
        >
          <Plus className="h-4 w-4" />
          <span>New Goal</span>
        </button>
      </div>
    </header>
  );
}
