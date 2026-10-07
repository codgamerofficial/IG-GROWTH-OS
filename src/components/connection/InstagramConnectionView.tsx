'use client';

// =============================================================================
// IG GrowthOS: Instagram Connection & Meta OAuth Setup (Section 20 & 21)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import {
  Instagram,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  Lock,
  KeyRound,
  HelpCircle,
  XCircle,
} from 'lucide-react';

export function InstagramConnectionView() {
  const { account, brand, refreshData } = useGrowthOS();
  const [oauthData, setOauthData] = useState<{
    authUrl: string;
    isConfigured: boolean;
    requiredPermissions: string[];
    setupInstructions: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);
  const [healthStatus, setHealthStatus] = useState<{
    status: string;
    message: string;
    latencyMs?: number;
    error?: string;
  } | null>(null);

  useEffect(() => {
    fetch('/api/auth/instagram/url')
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setOauthData(d);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleVerifyHealth = async () => {
    setVerifying(true);
    setHealthStatus(null);
    try {
      const res = await fetch('/api/health/instagram');
      const data = await res.json();
      setHealthStatus({
        status: data.status,
        message: data.message || 'Status check complete.',
        latencyMs: data.latencyMs,
        error: data.error,
      });
      await refreshData();
    } catch (err: any) {
      setHealthStatus({
        status: 'error',
        message: `Health check failed: ${err.message}`,
      });
    } finally {
      setVerifying(false);
    }
  };

  const isConnected = account?.connected === true && account.connection_status === 'CONNECTED';

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <Instagram className="h-6 w-6 text-pink-400" />
          <span>Instagram Connection & Meta API Setup</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Official Meta Graph API authorization, token verification, and real account linking for RIIQX.
        </p>
      </div>

      {/* Connection Status Card */}
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              {isConnected && account?.profile_picture_url ? (
                <img
                  src={account.profile_picture_url}
                  alt={account.username || 'Instagram Profile'}
                  className="h-14 w-14 rounded-full object-cover ring-2 ring-pink-500/50"
                />
              ) : (
                <div className="h-14 w-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500">
                  <Instagram className="h-7 w-7 text-zinc-400" />
                </div>
              )}
              <span
                className={`absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full ring-2 ring-[#111114] ${
                  isConnected ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  {isConnected && account?.username ? `@${account.username}` : '@riiqx.official (Pending Auth)'}
                </h3>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                    isConnected
                      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}
                >
                  {isConnected ? 'CONNECTED ●' : 'BLOCKED — CONFIG REQUIRED ●'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Meta Business Account ID:{' '}
                <code className="text-zinc-300 font-mono">
                  {account?.id || process.env.NEXT_PUBLIC_INSTAGRAM_BUSINESS_ACCOUNT_ID || '17841405309281745'}
                </code>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleVerifyHealth}
              disabled={verifying}
              className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-zinc-300 hover:text-white disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${verifying ? 'animate-spin' : ''}`} />
              <span>{verifying ? 'Checking...' : 'Verify Meta API Health'}</span>
            </button>
            {oauthData?.authUrl && (
              <a
                href={oauthData.authUrl}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Authorize Meta OAuth</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </div>

        {/* Health Check Feedback */}
        {healthStatus && (
          <div
            className={`rounded-xl border p-4 text-xs ${
              healthStatus.status === 'healthy'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold mb-1">
              {healthStatus.status === 'healthy' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-400" />
              )}
              <span>Meta Graph API Diagnostic: {healthStatus.status.toUpperCase()}</span>
              {healthStatus.latencyMs !== undefined && (
                <span className="text-[11px] font-normal opacity-80">({healthStatus.latencyMs}ms)</span>
              )}
            </div>
            <p className="text-zinc-300">{healthStatus.message}</p>
            {healthStatus.error && (
              <p className="mt-1 font-mono text-[11px] text-red-400 bg-black/40 p-2 rounded">
                {healthStatus.error}
              </p>
            )}
          </div>
        )}

        {/* Security Assurance */}
        <div className="rounded-xl bg-white/5 border border-white/5 p-4 flex items-start gap-3 text-xs text-zinc-300">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white">Security & API Privacy Guarantee:</strong>
            <p className="text-zinc-400 leading-relaxed">
              IG GrowthOS connects exclusively via Meta&apos;s official Graph API (v20.0). We never store or ask for your Instagram password, and long-lived tokens are stored strictly server-side with Row Level Security.
            </p>
          </div>
        </div>
      </div>

      {/* Permissions Breakdown */}
      <div className="rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <KeyRound className="h-4 w-4 text-amber-400" />
          <span>Official Meta Graph API Permissions Required</span>
        </h3>
        <p className="text-xs text-zinc-400">
          These scopes are requested during Meta Login to enable publishing, container polling, and insights collection:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {[
            { scope: 'instagram_basic', desc: 'Read basic profile information, account ID, and public media.' },
            { scope: 'instagram_content_publish', desc: 'Publish Reels, carousels, and photos to Instagram Business account.' },
            { scope: 'instagram_manage_insights', desc: 'Read algorithmic reach, impressions, saves, and video views.' },
            { scope: 'instagram_manage_comments', desc: 'Monitor customer questions and trigger automated engagement.' },
            { scope: 'pages_show_list', desc: 'List linked Facebook Pages managing the Instagram Business account.' },
            { scope: 'pages_read_engagement', desc: 'Access page engagement data required for Graph API tokens.' },
          ].map((perm) => (
            <div key={perm.scope} className="rounded-xl border border-white/5 bg-white/5 p-3">
              <code className="text-xs font-bold text-pink-400">{perm.scope}</code>
              <p className="text-[11px] text-zinc-400 mt-1">{perm.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
