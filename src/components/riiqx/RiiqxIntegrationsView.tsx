'use client';

// =============================================================================
// RIIQX 2.0 — Tools & Plugins Marketplace
// Real Social OAuth 2.0 Handshake • Live Server Probe • AES-256 Token Vault
// YouTube Data API v3 • Meta Graph API v26.0 • Verified Connection Gates
// =============================================================================

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Search,
  Globe,
  Youtube,
  Instagram,
  FileText,
  HardDrive,
  Github,
  MessageSquare,
  Sparkles,
  Check,
  Plus,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Cpu,
  AlertTriangle,
  Activity,
  CheckCircle2,
  XCircle,
  Twitter,
  Linkedin,
  Clock,
} from 'lucide-react';

interface ConnectedAccount {
  id: string;
  provider: string;
  platformAccountId: string;
  accountName: string;
  accountHandle?: string;
  avatarUrl?: string;
  scopes: string[];
  status: 'connected' | 'expired' | 'error' | 'revoked' | 'permission_required';
  platformMetadata: Record<string, unknown>;
  errorMessage?: string;
  lastVerifiedAt?: string;
}

interface PluginItem {
  id: string;
  name: string;
  desc: string;
  category: 'All' | 'Media' | 'Productivity' | 'Developer' | 'Social';
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  providerKey?: 'youtube' | 'instagram' | 'facebook' | 'whatsapp' | 'twitter' | 'linkedin';
  staticConnected?: boolean;
}

export function RiiqxIntegrationsView() {
  const { providerHealth } = useRiiqx();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [testingAccountId, setTestingAccountId] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ id: string; success: boolean; latencyMs?: number; message?: string } | null>(null);
  const [noticeMessage, setNoticeMessage] = useState<{ type: 'success' | 'warning' | 'error'; text: string } | null>(null);

  // Check URL searchParams on mount for callback notifications
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const status = params.get('connection_status');
      const provider = params.get('provider');
      const msg = params.get('message');
      const accountName = params.get('account_name');

      if (status === 'success') {
        setNoticeMessage({
          type: 'success',
          text: `Successfully authorized ${provider ? provider.toUpperCase() : 'account'}${
            accountName ? ` (${accountName})` : ''
          }! Tokens securely encrypted with AES-256-GCM.`,
        });
        fetchAccounts();
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (status === 'warning') {
        setNoticeMessage({
          type: 'warning',
          text: msg || 'Connected Facebook Page(s), but no linked Instagram Professional account was found.',
        });
        fetchAccounts();
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (status === 'error') {
        setNoticeMessage({
          type: 'error',
          text: msg || `Failed to complete ${provider || ''} authorization.`,
        });
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  // Fetch real connected accounts from backend
  const fetchAccounts = async () => {
    setIsLoadingAccounts(true);
    try {
      const res = await fetch('/api/social/accounts', { cache: 'no-store' });
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        setConnectedAccounts(data.accounts);
      }
    } catch (err) {
      console.error('Failed to load connected accounts:', err);
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleConnectOAuth = (provider: string) => {
    window.location.href = `/api/social/oauth/authorize?provider=${provider}`;
  };

  const handleTestConnection = async (account: ConnectedAccount) => {
    setTestingAccountId(account.id);
    setTestResult(null);
    try {
      const res = await fetch(`/api/social/accounts/${account.id}/test`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTestResult({
          id: account.id,
          success: true,
          latencyMs: data.latencyMs,
          message: `Live probe verified (${data.latencyMs}ms)`,
        });
        await fetchAccounts();
      } else {
        setTestResult({
          id: account.id,
          success: false,
          message: data.error || 'Connection probe failed.',
        });
        await fetchAccounts();
      }
    } catch (err: unknown) {
      setTestResult({
        id: account.id,
        success: false,
        message: err instanceof Error ? err.message : 'Network test error',
      });
    } finally {
      setTestingAccountId(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    if (!confirm('Are you sure you want to disconnect this account? Stored OAuth tokens will be securely wiped.')) {
      return;
    }
    try {
      const res = await fetch(`/api/social/accounts?id=${accountId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await fetchAccounts();
        setNoticeMessage({ type: 'success', text: 'Account disconnected and credentials revoked.' });
      }
    } catch {
      setNoticeMessage({ type: 'error', text: 'Failed to disconnect account.' });
    }
  };

  const plugins: PluginItem[] = [
    {
      id: 'youtube',
      name: 'YouTube',
      desc: 'YouTube Data API v3: shorts uploads, live channel metadata & analytics',
      category: 'Social',
      icon: Youtube,
      color: 'bg-[#FF4D4F]/15 text-[#FF4D4F]',
      providerKey: 'youtube',
    },
    {
      id: 'instagram',
      name: 'Instagram',
      desc: 'Meta Graph API v26.0: Professional Reels publishing, container polling & insights',
      category: 'Social',
      icon: Instagram,
      color: 'bg-[#FF6B5E]/15 text-[#FF6B5E]',
      providerKey: 'instagram',
    },
    {
      id: 'websearch',
      name: 'Web Search',
      desc: 'Real-time internet search with verified sources & footnotes',
      category: 'Productivity',
      icon: Globe,
      color: 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B]',
      staticConnected: true,
    },
    {
      id: 'facebook',
      name: 'Facebook Pages',
      desc: 'Meta Graph API: Direct Page video and Reel distribution',
      category: 'Social',
      icon: MessageSquare,
      color: 'bg-blue-500/15 text-blue-500',
      providerKey: 'facebook',
    },
    {
      id: 'twitter',
      name: 'X / Twitter',
      desc: 'Twitter API v2: Automated tweet publishing, media threads & analytics',
      category: 'Social',
      icon: Twitter,
      color: 'bg-[#202124]/15 text-[#202124] dark:bg-white/15 dark:text-white',
      providerKey: 'twitter',
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      desc: 'LinkedIn Marketing API: Professional UGC video & article distribution',
      category: 'Social',
      icon: Linkedin,
      color: 'bg-[#0A66C2]/15 text-[#0A66C2]',
      providerKey: 'linkedin',
    },
    {
      id: 'gdrive',
      name: 'Google Drive',
      desc: 'Cloud storage integration for video clips and raw footage',
      category: 'Productivity',
      icon: HardDrive,
      color: 'bg-[#16865D]/15 text-[#16865D]',
      staticConnected: true,
    },
    {
      id: 'github',
      name: 'GitHub',
      desc: 'Automated Git sync for Agent prompts and Code Studio',
      category: 'Developer',
      icon: Github,
      color: 'bg-[#202124] text-white dark:bg-white dark:text-[#202124]',
      staticConnected: true,
    },
    {
      id: 'canva',
      name: 'Canva',
      desc: 'Dynamic thumbnail templates and social banner generator',
      category: 'Media',
      icon: Sparkles,
      color: 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B]',
      staticConnected: false,
    },
    {
      id: 'figma',
      name: 'Figma',
      desc: 'Vector design and design-system tokens sync',
      category: 'Developer',
      icon: Sparkles,
      color: 'bg-[#FF6B5E]/20 text-[#FF6B5E]',
      staticConnected: false,
    },
    {
      id: 'notion',
      name: 'Notion',
      desc: 'Editorial calendars and script workspace synchronization',
      category: 'Productivity',
      icon: FileText,
      color: 'bg-[#FAF9F6] dark:bg-[#151515] text-[#202124] dark:text-white',
      staticConnected: false,
    },
  ];

  const categories = ['All', 'Social', 'Media', 'Productivity', 'Developer'];

  const filteredPlugins = plugins.filter((p) => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#0C0C0E] p-4 sm:p-6 lg:p-8 space-y-6 transition-colors">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        {/* Notice Banner */}
        {noticeMessage && (
          <div
            className={`p-4 rounded-2xl border text-xs sm:text-sm font-semibold flex items-center justify-between animate-in fade-in duration-300 ${
              noticeMessage.type === 'success'
                ? 'bg-[#16865D]/10 border-[#16865D]/30 text-[#16865D]'
                : noticeMessage.type === 'warning'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-[#FF4D4F]/10 border-[#FF4D4F]/30 text-[#FF4D4F]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {noticeMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16865D]" />
              ) : noticeMessage.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-[#FF4D4F]" />
              )}
              <span>{noticeMessage.text}</span>
            </div>
            <button
              onClick={() => setNoticeMessage(null)}
              className="text-xs opacity-70 hover:opacity-100 font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <Cpu className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202124] dark:text-white">
                Tools &amp; Plugins Marketplace
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] mt-1.5">
              Connect your official YouTube, Meta Instagram, and cloud tools with genuine OAuth 2.0 PKCE security.
            </p>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-[#737373] dark:text-[#A3A3A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search plugins..."
              className="w-full pl-9 pr-4 py-2 rounded-2xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-xs text-[#202124] dark:text-white placeholder-[#737373] dark:placeholder-[#A3A3A3] focus:outline-none focus:border-[#FFD43B] shadow-2xs transition-colors"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-[#FFD43B] text-[#202124] shadow-xs'
                  : 'bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-[#737373] dark:text-[#A3A3A3] hover:text-[#202124] dark:hover:text-white hover:border-[#FFD43B]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Plugins Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlugins.map((plugin) => {
            const Icon = plugin.icon;

            // Find matching connected account for social providers
            const matchedAccount = plugin.providerKey
              ? connectedAccounts.find((a) => a.provider === plugin.providerKey)
              : null;

            const isConnected = plugin.providerKey
              ? Boolean(matchedAccount && matchedAccount.status === 'connected')
              : plugin.staticConnected;
            const hasAuthIssue = Boolean(matchedAccount && matchedAccount.status !== 'connected');
            const isTesting = Boolean(matchedAccount && testingAccountId === matchedAccount.id);
            const currentTestResult = matchedAccount && testResult?.id === matchedAccount.id ? testResult : null;

            return (
              <div
                key={plugin.id}
                className="p-5 rounded-3xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs hover:border-[#FFD43B] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${plugin.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {isConnected ? (
                      <div className="flex items-center gap-1.5">
                        <span className="flex items-center gap-1 text-[11px] font-bold px-3 py-1 rounded-full bg-[#16865D]/15 text-[#16865D] border border-[#16865D]/30">
                          <Check className="w-3 h-3" />
                          <span>Connected</span>
                        </span>
                      </div>
                    ) : plugin.providerKey ? (
                      <button
                        onClick={() => handleConnectOAuth(plugin.providerKey!)}
                        className="flex items-center gap-1 text-[11px] font-bold px-3.5 py-1 rounded-full bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] transition-colors shadow-xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>{hasAuthIssue ? 'Reconnect' : 'Connect'}</span>
                      </button>
                    ) : (
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-[#737373]">
                        Available
                      </span>
                    )}
                  </div>

                  <div className="mt-3.5">
                    <h3 className="text-sm font-bold text-[#202124] dark:text-white flex items-center justify-between">
                      <span>{plugin.name}</span>
                      {matchedAccount?.avatarUrl && (
                        <Image
                          src={matchedAccount.avatarUrl}
                          alt={matchedAccount.accountName}
                          width={20}
                          height={20}
                          unoptimized
                          className="w-5 h-5 rounded-full border border-[#EAE7E1] object-cover"
                        />
                      )}
                    </h3>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed">
                      {plugin.desc}
                    </p>

                    {matchedAccount && (
                      <div className="mt-2.5 pt-2 border-t border-[#EAE7E1] dark:border-[#2E2E2E] space-y-1">
                        <p className="text-[11px] font-bold text-[#202124] dark:text-white truncate">
                          {matchedAccount.accountName}{' '}
                          {matchedAccount.accountHandle && (
                            <span className="font-normal text-[#FF6B5E]">({matchedAccount.accountHandle})</span>
                          )}
                        </p>
                        <p className="text-[10px] text-[#737373] font-mono">
                          ID: {matchedAccount.platformAccountId}
                        </p>
                        {matchedAccount.status !== 'connected' && (
                          <div className="mt-1.5 p-2 rounded-xl text-[10px] font-medium bg-[#FF4D4F]/10 text-[#FF4D4F] border border-[#FF4D4F]/30 flex items-center gap-1.5">
                            <Activity className="w-3 h-3 shrink-0" />
                            <span>
                              {matchedAccount.errorMessage || 'Authorization expired. Please click Reconnect.'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {currentTestResult && (
                      <div
                        className={`mt-2 p-2 rounded-xl text-[10px] font-semibold flex items-center gap-1.5 ${
                          currentTestResult.success
                            ? 'bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/30'
                            : 'bg-[#FF4D4F]/10 text-[#FF4D4F] border border-[#FF4D4F]/30'
                        }`}
                      >
                        <Activity className="w-3 h-3 shrink-0" />
                        <span>{currentTestResult.message}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3.5 border-t border-[#EAE7E1] dark:border-[#2E2E2E] flex items-center justify-between text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#16865D]" />
                    <span>OAuth 2.0 PKCE</span>
                  </span>

                  {matchedAccount && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleTestConnection(matchedAccount)}
                        disabled={isTesting}
                        className="text-xs font-semibold text-[#FF6B5E] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                        <span>Test</span>
                      </button>
                      <button
                        onClick={() => handleDisconnect(matchedAccount.id)}
                        className="text-xs font-semibold text-[#FF4D4F] hover:underline"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
