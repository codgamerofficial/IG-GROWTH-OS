'use client';

// =============================================================================
// IG GrowthOS: Settings → AI Infrastructure View (Amazon Bedrock)
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Server,
  ShieldCheck,
  ShieldAlert,
  Activity,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Terminal,
} from 'lucide-react';

interface BedrockConnectionResult {
  provider: 'bedrock';
  region: string;
  modelId: string;
  reachable: boolean;
  authorized: boolean;
  inferenceSuccessful: boolean;
  errorCode?: string;
  errorMessage?: string;
  latencyMs?: number;
  outputPreview?: string;
  testedAt: string;
}

interface BedrockConfig {
  region: string;
  provider: string;
  primaryModel: string;
  contentModel: string;
  analyticsModel: string;
  trendModel: string;
  chatModel: string;
  isConfigured: boolean;
  authMethod: string;
}

export function AIInfrastructureView() {
  const [config, setConfig] = useState<BedrockConfig | null>(null);
  const [lastResult, setLastResult] = useState<BedrockConnectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial config and status
  useEffect(() => {
    fetchStatus();
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/ai/bedrock/test');
      const data = await res.json();
      if (data.config) setConfig(data.config);
      if (data.result) setLastResult(data.result);
    } catch (e: any) {
      console.error('Failed to query Bedrock status:', e);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/bedrock/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.config) setConfig(data.config);
      if (data.result) setLastResult(data.result);
    } catch (err: any) {
      setLastResult({
        provider: 'bedrock',
        region: config?.region || 'ap-southeast-2',
        modelId: config?.primaryModel || 'au.anthropic.claude-sonnet-4-6',
        reachable: false,
        authorized: false,
        inferenceSuccessful: false,
        errorCode: 'NETWORK_ERROR',
        errorMessage: err.message,
        testedAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-rose-500" />
            <span>AI Infrastructure & Amazon Bedrock Routing</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Real-time verification of AWS Bedrock Converse runtime, cross-region inference profiles, and model authorization.
          </p>
        </div>

        <button
          onClick={handleTestConnection}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Test Bedrock Connection</span>
        </button>
      </div>

      {/* Real Diagnostic Alert Banner */}
      {lastResult && !lastResult.inferenceSuccessful && (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-rose-200">
                BLOCKED — AWS BEDROCK CONFIGURATION REQUIRED
              </h3>
              <p className="text-xs text-rose-300 leading-relaxed">
                {lastResult.errorMessage || 'Unable to execute inference with the configured Bedrock model.'}
              </p>
              {lastResult.errorCode && (
                <div className="text-[11px] font-mono text-rose-400 mt-2">
                  AWS Error Code: <span className="font-bold">{lastResult.errorCode}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {lastResult?.inferenceSuccessful && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
            <div>
              <h3 className="text-sm font-bold text-emerald-200">
                AWS Bedrock Online & Verified
              </h3>
              <p className="text-xs text-emerald-300">
                Inference succeeded with model <span className="font-mono font-bold">{lastResult.modelId}</span> in {lastResult.latencyMs}ms. Real response preview: &ldquo;{lastResult.outputPreview}&rdquo;
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Infrastructure Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* AWS Region */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>AWS Region</span>
            <Server className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-base font-bold font-mono text-white">
            {config?.region || process.env.NEXT_PUBLIC_AWS_REGION || 'ap-southeast-2'}
          </div>
          <div className="text-[10px] text-zinc-500">Selected Project Region (Sydney)</div>
        </div>

        {/* AI Provider */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>AI Provider</span>
            <Zap className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-base font-bold text-white uppercase tracking-wider">
            {config?.provider || 'Amazon Bedrock'}
          </div>
          <div className="text-[10px] text-zinc-500">Converse API Runtime with Tool-Calling</div>
        </div>

        {/* Bedrock Runtime Status */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Bedrock Runtime Status</span>
            <Activity className="h-4 w-4 text-rose-400" />
          </div>
          <div>
            {lastResult?.reachable ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                ● Reachable (HTTP 200/400)
              </span>
            ) : initialLoading ? (
              <span className="text-xs text-zinc-500">Checking...</span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-bold text-rose-400 border border-rose-500/20">
                ○ Unreachable
              </span>
            )}
          </div>
          <div className="text-[10px] text-zinc-500">
            Network handshake to AWS Bedrock endpoint
          </div>
        </div>

        {/* Model Authorization Status */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Model Authorization Status</span>
            {lastResult?.authorized ? (
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
            ) : (
              <ShieldAlert className="h-4 w-4 text-amber-400" />
            )}
          </div>
          <div>
            {lastResult?.authorized ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                ● Authorized
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-bold text-amber-400 border border-amber-500/20">
                ▲ Pending / Blocked
              </span>
            )}
          </div>
          <div className="text-[10px] text-zinc-500">
            Auth method: <span className="font-mono text-zinc-300">{config?.authMethod || 'IAM_KEYS'}</span>
          </div>
        </div>

        {/* Last Connection Test */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Last Connection Test</span>
            <RefreshCw className="h-4 w-4 text-zinc-400" />
          </div>
          <div className="text-xs font-mono text-zinc-200">
            {lastResult?.testedAt
              ? new Date(lastResult.testedAt).toLocaleTimeString() + ' (' + (lastResult.latencyMs || 0) + 'ms)'
              : 'Not tested yet'}
          </div>
          <div className="text-[10px] text-zinc-500">
            Round-trip server-side test latency
          </div>
        </div>

        {/* Last Error */}
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Last Error</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-xs font-mono text-rose-400 truncate" title={lastResult?.errorCode || 'None'}>
            {lastResult?.errorCode ? `${lastResult.errorCode}` : 'None (No active errors)'}
          </div>
          <div className="text-[10px] text-zinc-500">
            Latest AWS exception received
          </div>
        </div>
      </div>

      {/* Model Routing Architecture */}
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Terminal className="h-4 w-4 text-rose-400" />
          <span>Configured Dynamic Model Routing (Inference Profiles)</span>
        </h3>
        <p className="text-xs text-zinc-400">
          Inference profile IDs are passed directly to Bedrock without automated string mutation.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Primary Model</span>
            <span className="text-xs font-mono font-bold text-white block truncate">
              {config?.primaryModel || 'au.anthropic.claude-sonnet-4-6'}
            </span>
            <span className="text-[10px] text-zinc-500">Master production fallback</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Content Model</span>
            <span className="text-xs font-mono font-bold text-rose-300 block truncate">
              {config?.contentModel || 'au.anthropic.claude-sonnet-4-6'}
            </span>
            <span className="text-[10px] text-zinc-500">Viral ideas, Reel scripts & UGC packages</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Analytics Model</span>
            <span className="text-xs font-mono font-bold text-emerald-300 block truncate">
              {config?.analyticsModel || 'au.anthropic.claude-sonnet-4-6'}
            </span>
            <span className="text-[10px] text-zinc-500">Diagnostic performance reasoning</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Trend Model</span>
            <span className="text-xs font-mono font-bold text-amber-300 block truncate">
              {config?.trendModel || 'au.anthropic.claude-sonnet-4-6'}
            </span>
            <span className="text-[10px] text-zinc-500">High-velocity trend research</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1 sm:col-span-2">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Chat Model</span>
            <span className="text-xs font-mono font-bold text-purple-300 block truncate">
              {config?.chatModel || 'au.anthropic.claude-sonnet-4-6'}
            </span>
            <span className="text-[10px] text-zinc-500">Growth Copilot conversation & 7 DB tool integrations</span>
          </div>
        </div>
      </div>
    </div>
  );
}
