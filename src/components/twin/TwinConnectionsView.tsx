'use client';

// =============================================================================
// RIIQX — Connected Apps & Data Control Center View
// Official OAuth 2.0 PKCE • Scopes & Access Control • Disconnect & Delete Data
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
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Data Control Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Connected Apps &amp; Connectors
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Manage official OAuth integrations. Disconnect anytime and purge synchronized tokens at rest.
          </p>
        </div>
      </div>

      {/* Security Banner */}
      <div className="rounded-3xl border border-[#16865D]/30 bg-[#16865D]/5 p-6 flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#16865D] text-white">
          <Lock className="h-5 w-5" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-[#1A1817] dark:text-white">Hardware AES-256-GCM Vault Protection</h3>
          <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
            All OAuth tokens are encrypted at rest with PBKDF2 key derivation. RIIQX never collects account passwords, banking PINs, or unapproved scopes.
          </p>
        </div>
      </div>

      {/* Connectors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {connectors.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] text-[#FF5722]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                      c.status === 'connected'
                        ? 'bg-[#16865D]/10 text-[#16865D]'
                        : 'bg-[#6B6661]/10 text-[#6B6661]'
                    }`}
                  >
                    {c.status === 'connected' ? 'Connected' : 'Not Connected'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-[#1A1817] dark:text-white">{c.name}</h3>
                  <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] mt-1">{c.description}</p>
                </div>

                <div className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] space-y-1">
                  <span className="text-[10px] font-bold text-[#6B6661] uppercase">Data Categories Accessed:</span>
                  <div className="flex flex-wrap gap-1">
                    {c.dataAccessed.map((d, i) => (
                      <span key={i} className="text-[10px] bg-white dark:bg-[#18181C] px-2 py-0.5 rounded-md font-semibold text-[#1A1817] dark:text-white">
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[#EAE3D9] dark:border-[#26262B] flex items-center justify-between">
                {c.status === 'connected' ? (
                  <button
                    onClick={() => handleDisconnect(c.provider)}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#FF4D4F] hover:underline"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Disconnect &amp; Revoke</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(c.provider)}
                    className="flex items-center gap-1.5 rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white px-4 py-2 text-xs font-bold shadow-xs transition-transform active:scale-95"
                  >
                    <span>Connect Official API</span>
                    <ExternalLink className="h-3.5 w-3.5" />
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
