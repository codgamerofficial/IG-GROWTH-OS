'use client';

import React from 'react';
import { NuvexaEmblem } from './NuvexaEmblem';
import { useNuvexa } from '@/context/NuvexaContext';
import { nuvexaBrand } from '@/lib/nuvexa/brand';
import { ChevronDown, ShieldCheck, Wifi, WifiOff, Plus, Download } from 'lucide-react';

export function NuvexaHeader() {
  const {
    selectedModel,
    setSelectedModel,
    models,
    providerHealth,
    createNewConversation,
    activeProject,
    exportData,
  } = useNuvexa();

  const isOllamaOnline = providerHealth?.ollama.status === 'online';

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[#1E2A4A] bg-[#030712]/90 px-4 backdrop-blur-md">
      {/* Brand & Emblem */}
      <div className="flex items-center gap-3">
        <NuvexaEmblem size={32} animate={true} />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-bold tracking-tight text-white">
              {nuvexaBrand.name}
            </span>
            <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 border border-cyan-500/20">
              OPEN WEIGHTS
            </span>
          </div>
          <p className="hidden text-xs text-[#94A3B8] sm:block">
            {nuvexaBrand.tagline}
          </p>
        </div>
      </div>

      {/* Model Selector & Project Badge */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Active Project Badge */}
        {activeProject && (
          <div className="hidden items-center gap-1.5 rounded-lg border border-[#1E2A4A] bg-[#070D1F] px-2.5 py-1 text-xs text-[#94A3B8] md:flex">
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: activeProject.color }} />
            <span className="font-medium text-white">{activeProject.title}</span>
          </div>
        )}

        {/* Model Dropdown */}
        <div className="relative group">
          <div className="flex cursor-pointer items-center gap-2 rounded-lg border border-[#1E2A4A] bg-[#0B132B] px-3 py-1.5 text-xs font-medium text-white transition hover:border-cyan-500/40 hover:bg-[#132147]">
            {isOllamaOnline ? (
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
            ) : (
              <span className="h-2 w-2 rounded-full bg-amber-500" />
            )}
            <span className="max-w-[130px] truncate sm:max-w-[180px]">{selectedModel.name}</span>
            <ChevronDown className="h-3.5 w-3.5 text-[#94A3B8]" />
          </div>

          {/* Dropdown Menu */}
          <div className="invisible absolute right-0 top-full mt-1 w-72 rounded-xl border border-[#1E2A4A] bg-[#0B132B] p-1.5 shadow-2xl opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 z-50">
            <div className="mb-1.5 border-b border-[#1E2A4A] px-2.5 py-1 text-[11px] font-semibold text-[#94A3B8]">
              SELECT OPEN-WEIGHT MODEL
            </div>
            {models.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedModel(m)}
                className={`flex w-full items-start justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                  selectedModel.id === m.id
                    ? 'bg-cyan-500/15 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-[#94A3B8] hover:bg-[#132147] hover:text-white'
                }`}
              >
                <div>
                  <div className="text-white font-medium">{m.name}</div>
                  <div className="text-[10px] text-[#64748B]">{m.tag} • {m.license}</div>
                </div>
                {selectedModel.id === m.id && (
                  <span className="text-xs text-cyan-400">✓</span>
                )}
              </button>
            ))}

            <div className="mt-1.5 border-t border-[#1E2A4A] px-2.5 pt-1.5 text-[10px] text-[#64748B] flex items-center justify-between">
              <span>Local Ollama Status:</span>
              <span className={isOllamaOnline ? 'text-emerald-400 font-semibold flex items-center gap-1' : 'text-amber-400 font-semibold flex items-center gap-1'}>
                {isOllamaOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                {isOllamaOnline ? 'Active' : 'Offline'}
              </span>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <button
          onClick={() => createNewConversation()}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 active:scale-95"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">New Chat</span>
        </button>

        {/* Export Data */}
        <button
          onClick={exportData}
          title="Export User Data (JSON)"
          className="rounded-lg border border-[#1E2A4A] bg-[#0B132B] p-2 text-[#94A3B8] hover:text-white hover:border-cyan-500/40 transition"
        >
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  );
}
