'use client';

// =============================================================================
// RIIQX — Connected Apps & Data Control Center View
// Official OAuth 2.0 PKCE • Scopes & Access Control • Disconnect & Delete Data
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  Boxes,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Trash2,
  ExternalLink,
  Lock,
  Globe,
  Youtube,
  Instagram,
  Check,
  MessageCircle,
} from 'lucide-react';

interface AppConnector {
  id: string;
  name: string;
  provider: string;
  description: string;
  icon: React.ElementType;
  status: 'connected' | 'not_connected' | 'token_expired';
  scopes: string[];
  dataAccessed: string[];
  lastSync?: string;
}

export function TwinConnectionsView() {
  const [connectors, setConnectors] = useState<AppConnector[]>([
    {
      id: 'google_workspace',
      name: 'Google Services',
      provider: 'google',
      description: 'Used for calendar schedule checks and purchase confirmation email OCR parsing.',
      icon: Globe,
      status: 'not_connected',
      scopes: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/calendar.readonly'],
      dataAccessed: ['Display Name', 'Public Avatar', 'Upcoming Event Timestamps'],
    },
    {
      id: 'youtube',
      name: 'YouTube Data API v3',
      provider: 'youtube',
      description: 'Authorized channel analytics and video performance data sync.',
      icon: Youtube,
      status: 'not_connected',
      scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
      dataAccessed: ['Channel Stats', 'Published Video Counts'],
    },
    {
      id: 'meta_instagram',
      name: 'Meta Graph API v26.0',
      provider: 'meta',
      description: 'Instagram Business & Facebook page publishing with verified permissions.',
      icon: Instagram,
      status: 'not_connected',
      scopes: ['instagram_basic', 'pages_show_list'],
      dataAccessed: ['Account Handle', 'Media Insights'],
    },
    {
      id: 'meta_whatsapp',
      name: 'WhatsApp Pocket Twin',
      provider: 'whatsapp',
      description: 'Zero-app shopping twin. Forward Amazon/Flipkart links or checkout screenshots via WhatsApp for instant price truth.',
      icon: MessageCircle,
      status: 'connected',
      scopes: ['whatsapp_business_messaging', 'messages_read_write'],
      dataAccessed: ['Shared Product Links', 'Checkout Screenshots', 'Zero Contact Harvesting'],
    },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkLiveConnections();
  }, []);

  const checkLiveConnections = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/social/accounts');
      if (res.ok) {
        const data = await res.json();
        const liveAccounts = data.accounts || [];

        setConnectors((prev) =>
          prev.map((c) => {
            const found = liveAccounts.find((a: any) => a.provider === c.provider);
            if (found) {
              return {
                ...c,
                status: found.status === 'connected' ? 'connected' : 'token_expired',
                lastSync: found.last_verified_at || new Date().toISOString(),
              };
            }
            return c;
          })
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (provider: string) => {
    window.location.href = `/api/social/oauth/authorize?provider=${provider}&returnUrl=/`;
  };

  const handleDisconnect = async (provider: string) => {
    try {
      await fetch(`/api/social/accounts?provider=${provider}`, { method: 'DELETE' });
      checkLiveConnections();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#09090b] text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8 relative selection:bg-orange-500/30">
      {/* Background Ambient Radial Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
              <Boxes className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-black uppercase tracking-wider text-orange-400">
              Data Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white font-heading mt-2">
            Connected Apps &amp; Connectors
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Manage official OAuth integrations. Disconnect anytime and purge synchronized tokens at rest.
          </p>
        </div>
      </div>

      {/* Security Banner */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/5 backdrop-blur-xl p-6 sm:p-7 flex items-start gap-4 shadow-xl">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-md">
          <Lock className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black text-white font-heading">Hardware AES-256-GCM Vault Protection</h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            All OAuth tokens are encrypted at rest with PBKDF2 key derivation. RIIQX never collects account passwords, banking PINs, or unapproved scopes.
          </p>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectors.map((c) => {
          const Icon = c.icon;
          const isConnected = c.status === 'connected';

          return (
            <div
              key={c.id}
              className={`rounded-3xl border transition-all duration-200 flex flex-col justify-between p-6 sm:p-7 space-y-5 shadow-2xl relative overflow-hidden group hover:-translate-y-1 ${
                isConnected
                  ? 'border-emerald-500/40 bg-zinc-900/70 backdrop-blur-xl ring-1 ring-emerald-500/20'
                  : 'border-white/[0.08] hover:border-white/[0.18] bg-zinc-900/60 backdrop-blur-xl'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-950/80 border border-white/[0.08] text-orange-400 shadow-md">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full font-mono tracking-wider border ${
                      isConnected
                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                        : 'bg-zinc-800 text-zinc-400 border-white/[0.06]'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-heading group-hover:text-orange-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-zinc-300 mt-1 leading-relaxed">
                    {c.description}
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-zinc-950/70 border border-white/[0.06] space-y-1.5">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block font-mono">
                    Data Categories Accessed:
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {c.dataAccessed.map((d, i) => (
                      <span
                        key={i}
                        className="text-[10px] bg-zinc-900 px-2.5 py-1 rounded-lg font-medium text-zinc-300 border border-white/[0.06]"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between">
                {isConnected ? (
                  <button
                    onClick={() => handleDisconnect(c.provider)}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:text-rose-300 transition-colors p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Disconnect &amp; Revoke</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(c.provider)}
                    className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-5 py-2.5 text-xs font-black shadow-lg shadow-orange-500/25 transition-transform active:scale-95 group/btn"
                  >
                    <span>Connect Official API</span>
                    <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
