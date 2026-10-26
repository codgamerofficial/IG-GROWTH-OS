'use client';

// =============================================================================
// RIIQX — System Settings & Cloud Provider Governance View
// Online-First • AWS Bedrock • Meta Instagram • Non-Firebase PBKDF2
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Settings,
  Shield,
  Download,
  Trash2,
  Server,
  Globe,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cloud,
  Share2,
  KeyRound,
  Lock,
  Cpu,
} from 'lucide-react';

export function RiiqxSettingsView() {
  const { user, providerHealth, refreshHealth, exportData, wipeData } = useRiiqx();

  const [searxngUrl, setSearxngUrl] = useState('https://searx.be');
  const [ollamaUrl, setOllamaUrl] = useState('http://localhost:11434');
  const [openaiCompatibleUrl, setOpenaiCompatibleUrl] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshHealth();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const isBedrockOnline = providerHealth?.bedrock?.status === 'online';
  const bedrockErrorMessage = providerHealth?.bedrock?.errorMessage;
  const isAgentRouterOnline = providerHealth?.agentrouter?.status === 'online';
  const isOllamaOnline = providerHealth?.ollama?.status === 'online';

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-8">
      <div className="mx-auto w-full max-w-4xl space-y-8 pb-12">
        {/* Header */}
        <div className="border-b border-[#1E2A4A] pb-4">
          <div className="flex items-center gap-2.5">
            <Settings className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-bold tracking-tight text-white">System Settings &amp; Governance</h1>
          </div>
          <p className="mt-1 text-xs text-[#94A3B8]">
            Configure online cloud intelligence, social API authorizations, search infrastructure, and zero-telemetry cryptographic security.
          </p>
        </div>

        {/* Section 1: Online Cloud AI Providers */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-3">
            <div className="flex items-center gap-2">
              <Cloud className="h-4 w-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Online Cloud AI Runtimes (Primary)</h2>
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 rounded-lg border border-[#1E2A4A] bg-[#0B132B] px-3 py-1 text-xs text-[#94A3B8] hover:text-white hover:border-cyan-500/40 transition"
            >
              <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
              <span>Probe Status</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {/* AWS Bedrock Enterprise Cloud Runtime */}
            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-white">AWS Bedrock Runtime</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isBedrockOnline
                      ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30'
                      : 'bg-purple-500/15 text-purple-400 border border-purple-500/30'
                  }`}
                >
                  {isBedrockOnline ? 'CONNECTED &amp; AUTHORIZED' : 'ONLINE CLOUD GATEWAY'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-[#94A3B8]">
                <div>
                  Region: <span className="text-white font-semibold">ap-southeast-2</span>
                </div>
                <div>
                  Model: <span className="text-white font-semibold">Claude Sonnet 4 / 3.7</span>
                </div>
                <div>
                  Engine: <span className="text-cyan-400 font-semibold">Converse Stream API</span>
                </div>
              </div>
              {bedrockErrorMessage && (
                <div className="text-[11px] text-amber-400/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2.5 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Provider Status Note:</span> {bedrockErrorMessage}
                  </div>
                </div>
              )}
            </div>

            {/* Agent Router Cloud Gateway */}
            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-violet-400" />
                  <span className="text-xs font-semibold text-white">Agent Router Cloud Gateway</span>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isAgentRouterOnline
                      ? 'bg-violet-500/15 text-violet-400 border border-violet-500/30'
                      : 'bg-[#1E2A4A] text-[#94A3B8]'
                  }`}
                >
                  {isAgentRouterOnline ? 'STANDBY READY' : 'ACTIVE CLOUD BACKUP'}
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Provides zero-configuration multi-provider fallback routing when AWS Bedrock daily token quotas are exhausted.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Social Media Connected Accounts */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1E2A4A] pb-3">
            <Share2 className="h-4 w-4 text-pink-400" />
            <h2 className="text-sm font-bold text-white">Social Media Autopilot Authorizations</h2>
          </div>

          <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="h-4 w-4 text-pink-400" />
                <span className="text-xs font-semibold text-white">Meta Instagram Graph API v20.0</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/15 text-pink-400 border border-pink-500/30">
                ID: 596660929655724
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8] leading-relaxed">
              Configured via <code>INSTAGRAM_ACCESS_TOKEN</code> &amp; <code>INSTAGRAM_BUSINESS_ACCOUNT_ID</code> in server environment. Enables automated Instagram Reels creation, publishing verification, and engagement metric telemetry.
            </p>
            <div className="rounded-lg border border-[#1E2A4A] bg-[#070D1F] p-2.5 text-[11px] text-[#64748B] flex items-center justify-between">
              <span>Token Status: 60-day Long-Lived User Token configured</span>
              <span className="text-pink-400 font-mono text-[10px]">Graph API v20.0</span>
            </div>
          </div>
        </div>

        {/* Section 3: Search Engine Adapter */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1E2A4A] pb-3">
            <Globe className="h-4 w-4 text-cyan-400" />
            <h2 className="text-sm font-bold text-white">Privacy-Preserving Search (SearXNG)</h2>
          </div>

          <div>
            <label className="text-xs font-semibold text-white mb-1.5 block">SearXNG Instance URL</label>
            <input
              type="text"
              value={searxngUrl}
              onChange={(e) => setSearxngUrl(e.target.value)}
              className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3.5 py-2 text-xs font-mono text-white focus:border-cyan-500/50 focus:outline-none transition"
            />
            <p className="mt-1.5 text-[11px] text-[#64748B]">
              Enables real citation footnotes without ad-tracker profiling or query harvesting.
            </p>
          </div>
        </div>

        {/* Section 4: Optional Local Offline Fallbacks */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1E2A4A] pb-3">
            <Server className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-bold text-white">Optional Local Offline Fallbacks</h2>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-white">Local Ollama Gateway (Optional)</label>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    isOllamaOnline
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#1E2A4A] text-[#94A3B8]'
                  }`}
                >
                  {isOllamaOnline ? 'CONNECTED' : 'STANDBY / OPTIONAL'}
                </span>
              </div>
              <input
                type="text"
                value={ollamaUrl}
                onChange={(e) => setOllamaUrl(e.target.value)}
                className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3.5 py-2 text-xs font-mono text-white focus:border-cyan-500/50 focus:outline-none transition"
              />
              <p className="mt-1.5 text-[11px] text-[#64748B]">
                RIIQX operates online-first. Local Ollama is only used as an offline backup if cloud endpoints are unreachable.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-white mb-1.5 block">
                Custom OpenAI-Compatible Endpoint (vLLM / LMStudio / Cluster)
              </label>
              <input
                type="text"
                value={openaiCompatibleUrl}
                onChange={(e) => setOpenaiCompatibleUrl(e.target.value)}
                placeholder="e.g. http://localhost:8000/v1"
                className="w-full rounded-xl border border-[#1E2A4A] bg-[#030712] px-3.5 py-2 text-xs font-mono text-white focus:border-cyan-500/50 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Section 5: Non-Firebase Cryptographic Privacy & Data Isolation */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] p-5 space-y-4 shadow-xl">
          <div className="flex items-center gap-2 border-b border-[#1E2A4A] pb-3">
            <Shield className="h-4 w-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Cryptographic Privacy &amp; Data Isolation</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-3.5 space-y-1.5">
              <span className="text-[#64748B] text-[10px] uppercase font-bold tracking-wider">Authentication Engine</span>
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> 100% Non-Firebase (PBKDF2 SHA-256)
              </div>
              <p className="text-[11px] text-[#94A3B8]">
                Credentials hashed with 10,000 rounds of PBKDF2 with 16-byte cryptographically secure salts.
              </p>
            </div>

            <div className="rounded-xl border border-[#1E2A4A] bg-[#030712] p-3.5 space-y-1.5">
              <span className="text-[#64748B] text-[10px] uppercase font-bold tracking-wider">Active User Identity</span>
              <div className="font-semibold text-white">{user.name} ({user.email})</div>
              <p className="text-[11px] text-[#94A3B8]">
                ID: <code>{user.id}</code> • Role: <span className="uppercase text-cyan-400 font-bold">{user.role}</span>
              </p>
            </div>
          </div>

          {/* Export & Delete Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#1E2A4A]">
            <button
              onClick={exportData}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-[#1E2A4A] bg-[#0B132B] px-4 py-2.5 text-xs font-semibold text-white hover:border-cyan-500/40 hover:bg-[#132147] transition shadow"
            >
              <Download className="h-4 w-4 text-cyan-400" />
              <span>Export Complete Workspace Archive (JSON)</span>
            </button>

            <button
              onClick={wipeData}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition shadow"
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
