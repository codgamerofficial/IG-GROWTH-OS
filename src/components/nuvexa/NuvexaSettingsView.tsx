'use client';

import React, { useState } from 'react';
import { useNuvexa } from '@/context/NuvexaContext';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  Server,
  Globe,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cloud,
  Share2,
} from 'lucide-react';

export function NuvexaSettingsView() {
  const { user, providerHealth, refreshHealth, exportData, wipeData } = useNuvexa();

  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [searxngUrl, setSearxngUrl] = useState('https://searx.be');
  const [openaiCompatibleUrl, setOpenaiCompatibleUrl] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshHealth();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isOllamaOnline = providerHealth?.ollama.status === 'online';
  const isBedrockOnline = providerHealth?.bedrock?.status === 'online';
  const bedrockErrorMessage = providerHealth?.bedrock?.errorMessage;

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="border-b border-[#1E2A4A] pb-4">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">System Settings & Governance</h1>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Configure open-weight AI runtimes, search endpoints, and cryptographic account privacy.
          </p>
        </div>

        {/* Section 1: AI Provider Endpoints */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-3">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Open-Weight Runtime Adapters</h2>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-lg border border-[#1E2A4A] bg-[#0B132B] px-3 py-1 text-xs text-[#94A3B8] hover:text-white transition"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Probe Status</span>
            </button>
          </div>

          <div className="space-y-3">
            {/* Ollama URL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-white">Local Ollama Gateway</label>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isOllamaOnline
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isOllamaOnline ? 'CONNECTED' : 'OFFLINE / UNREACHABLE'}
                </span>
              </div>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs font-mono text-white focus:border-cyan-500/50 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-[#64748B]">
                Default: <code>http://localhost:11434</code>. Pull models locally with <code>ollama pull llama3.2</code>.
              </p>
            </div>

            {/* Custom OpenAI-Compatible Endpoint */}
            <div>
              <label className="text-xs font-semibold text-white mb-1 block">
                OpenAI-Compatible Endpoint (vLLM / LMStudio / LocalAI)
              </label>
              <input
                type="text"
                value={openaiCompatibleUrl}
                onChange={(e) => setOpenaiCompatibleUrl(e.target.value)}
                placeholder="e.g. http://localhost:8000/v1"
                className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs font-mono text-white focus:border-cyan-500/50 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-[#64748B]">
                Point to self-hosted vLLM or LMStudio instance for cluster deployment.
              </p>
            </div>

            {/* AWS Bedrock Enterprise Cloud Runtime */}
            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cloud className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-semibold text-white">AWS Bedrock Runtime</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isBedrockOnline
                      ? 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                      : 'bg-[#1E2A4A] text-[#94A3B8]'
                  }`}
                >
                  {isBedrockOnline ? 'CONNECTED & AUTHORIZED' : 'CONFIGURED IN .ENV.LOCAL'}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-[#94A3B8]">
                <div>
                  Region: <span className="text-white">ap-southeast-2</span>
                </div>
                <div>
                  Model: <span className="text-white">Claude Sonnet 4 / 3.7</span>
                </div>
              </div>
              {bedrockErrorMessage && (
                <p className="text-[10px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded p-1.5">
                  Quota Monitor: {bedrockErrorMessage}
                </p>
              )}
            </div>

            {/* Meta Instagram Graph API Integration */}
            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Share2 className="h-4 w-4 text-pink-400" />
                  <span className="text-xs font-semibold text-white">Meta Instagram Graph API</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30">
                  ID: 596660929655724
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Linked via <code>INSTAGRAM_ACCESS_TOKEN</code> &amp; <code>INSTAGRAM_BUSINESS_ACCOUNT_ID</code> in <code>.env.local</code>. Enables Reels container creation &amp; analytics telemetry.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Search Engine Adapter */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2A4A] pb-3">
            <Globe className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Privacy-Preserving Search (SearXNG)</h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-white mb-1 block">SearXNG Instance URL</label>
            <input
              type="text"
              value={searxngUrl}
              onChange={(e) => setSearxngUrl(e.target.value)}
              className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3 py-2 text-xs font-mono text-white focus:border-cyan-500/50 focus:outline-none"
            />
            <p className="mt-1 text-[11px] text-[#64748B]">
              Enables real citation retrieval without commercial search engine tracking.
            </p>
          </div>
        </div>

        {/* Section 3: Non-Firebase Security & Account Isolation */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#1E2A4A] pb-3">
            <Shield className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Cryptographic Privacy & Data Isolation</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-3 space-y-1">
              <span className="text-[#64748B] text-[10px] uppercase font-bold">Authentication Engine</span>
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Non-Firebase (PBKDF2 SHA-256)
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Passphrases are salted and stretched locally with zero external telemetry.
              </p>
            </div>

            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-3 space-y-1">
              <span className="text-[#64748B] text-[10px] uppercase font-bold">Active User Identity</span>
              <div className="font-semibold text-white">{user.name} ({user.email})</div>
              <p className="text-[11px] text-[#94A3B8]">
                ID: <code>{user.id}</code> • Role: <span className="uppercase text-cyan-400">{user.role}</span>
              </p>
            </div>
          </div>

          {/* Export & Delete Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <button
              onClick={exportData}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#1E2A4A] bg-[#0B132B] px-4 py-2.5 text-xs font-semibold text-white hover:border-cyan-500/40 hover:bg-[#132147] transition"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span>Export Complete User Archive (JSON)</span>
            </button>

            <button
              onClick={wipeData}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition"
            >
              <Trash2 className="h-4 w-4" />
              <span>Permanently Wipe All Account Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
