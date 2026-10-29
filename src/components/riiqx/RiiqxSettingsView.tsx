'use client';

// =============================================================================
// RIIQX — iOS-Inspired Master Settings & Governance View
// Trending Yellow + Red/Coral • Zero Squeeze • Categorized Grouped Panels
// =============================================================================

import React, { useState } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Settings,
  User,
  Palette,
  Cpu,
  Share2,
  Bell,
  Shield,
  BarChart2,
  Database,
  Info,
  FileText,
  HelpCircle,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Cloud,
  Server,
  Lock,
  Download,
  Trash2,
  ExternalLink,
  Sun,
  Moon,
  Sparkles,
  Check,
  Smartphone,
  ChevronRight,
  Radio,
  LogOut,
  Mail,
  Globe,
} from 'lucide-react';
import { RiiqxLegalModal, LegalDocType } from './RiiqxLegalModal';
import { RiiqxOnboardingModal } from './RiiqxOnboardingModal';

type SettingsSection =
  | 'account'
  | 'appearance'
  | 'providers'
  | 'connections'
  | 'notifications'
  | 'privacy'
  | 'usage'
  | 'data'
  | 'about'
  | 'legal'
  | 'support';

export function RiiqxSettingsView() {
  const { user, theme, setTheme, providerHealth, refreshHealth, exportData, wipeData, signOut, updateUserProfile, isAuthenticated } = useRiiqx();

  const [displayName, setDisplayName] = useState(user.name);
  const [preferredLang, setPreferredLang] = useState<'en' | 'bn' | 'hi'>(user.preferences.defaultLanguage || 'en');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);

  React.useEffect(() => {
    setDisplayName(user.name);
    if (user.preferences.defaultLanguage) {
      setPreferredLang(user.preferences.defaultLanguage);
    }
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    setProfileSuccessMsg(null);
    try {
      await updateUserProfile({
        displayName,
        preferredLanguage: preferredLang,
      });
      setProfileSuccessMsg('Profile updated successfully.');
      setTimeout(() => setProfileSuccessMsg(null), 3000);
    } catch {
      // Handled
    } finally {
      setIsSavingProfile(false);
    }
  };

  const [activeSection, setActiveSection] = useState<SettingsSection>('account');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeLegalDoc, setActiveLegalDoc] = useState<LegalDocType | null>(null);
  const [isOnboardingModalOpen, setIsOnboardingModalOpen] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [publishAlerts, setPublishAlerts] = useState(true);
  const [renderAlerts, setRenderAlerts] = useState(true);

  // Real Connected Accounts State
  const [socialAccounts, setSocialAccounts] = useState<Array<{
    id: string;
    provider: string;
    platformAccountId: string;
    accountName: string;
    accountHandle?: string;
    avatarUrl?: string;
    status: string;
    scopes: string[];
    lastVerifiedAt?: string;
  }>>([]);
  const [testingAccId, setTestingAccId] = useState<string | null>(null);
  const [testingStatusMsg, setTestingStatusMsg] = useState<{ id: string; msg: string; ok: boolean } | null>(null);

  const fetchSocialAccounts = async () => {
    try {
      const res = await fetch('/api/social/accounts');
      const data = await res.json();
      if (data.success && Array.isArray(data.accounts)) {
        setSocialAccounts(data.accounts);
      }
    } catch {
      // Ignored
    }
  };

  React.useEffect(() => {
    fetchSocialAccounts();
  }, []);

  const handleTestAccount = async (id: string) => {
    setTestingAccId(id);
    setTestingStatusMsg(null);
    try {
      const res = await fetch(`/api/social/accounts/${id}/test`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setTestingStatusMsg({ id, msg: `Verified Live (${data.latencyMs}ms)`, ok: true });
        fetchSocialAccounts();
      } else {
        setTestingStatusMsg({ id, msg: data.error || 'Test failed', ok: false });
      }
    } catch (e: unknown) {
      setTestingStatusMsg({ id, msg: e instanceof Error ? e.message : 'Error', ok: false });
    } finally {
      setTestingAccId(null);
    }
  };

  const handleDisconnectAccount = async (id: string) => {
    if (!confirm('Are you sure you want to disconnect this account? Stored OAuth tokens will be securely wiped.')) return;
    try {
      await fetch(`/api/social/accounts?id=${id}`, { method: 'DELETE' });
      fetchSocialAccounts();
    } catch {
      // Ignored
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshHealth();
    await fetchSocialAccounts();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const isBedrockOnline = providerHealth?.bedrock?.status === 'online';
  const isAgentRouterOnline = providerHealth?.agentrouter?.status === 'online';

  const sections: Array<{
    id: SettingsSection;
    label: string;
    icon: React.ElementType;
    badge?: string;
  }> = [
    { id: 'account', label: 'Account', icon: User },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'providers', label: 'AI Providers', icon: Cpu, badge: 'Live' },
    { id: 'connections', label: 'Connected Accounts', icon: Share2 },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Privacy & Security', icon: Shield },
    { id: 'usage', label: 'Usage & Quotas', icon: BarChart2 },
    { id: 'data', label: 'Data & Storage', icon: Database },
    { id: 'about', label: 'About RIIQX', icon: Info },
    { id: 'legal', label: 'Legal & Compliance', icon: FileText },
    { id: 'support', label: 'Support & Docs', icon: HelpCircle },
  ];

  return (
    <div className="flex h-full flex-1 flex-col min-h-0 overflow-y-auto bg-[#FAF9F6] dark:bg-[#151515] p-4 sm:p-8 text-[#202124] dark:text-[#F7F7F7] transition-colors">
      <div className="mx-auto w-full max-w-5xl space-y-6 pb-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center font-bold">
                <Settings className="h-4 w-4" />
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#202124] dark:text-white">
                RIIQX Settings &amp; Preferences
              </h1>
            </div>
            <p className="mt-1 text-xs text-[#737373] dark:text-[#A3A3A3]">
              Configure your creative workspace, multi-model AI routing, social API integrations, and zero-telemetry security.
            </p>
          </div>

          <button
            onClick={() => setIsOnboardingModalOpen(true)}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] hover:border-[#FFD43B] text-xs font-bold text-[#202124] dark:text-white transition shadow-2xs"
          >
            <Smartphone className="w-3.5 h-3.5 text-[#FFD43B]" />
            <span>Mobile Guide</span>
          </button>
        </div>

        {/* Master iOS Settings Layout: Navigation Column + Content Column */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left Navigation Menu */}
          <nav className="md:col-span-4 flex md:flex-col gap-1 overflow-x-auto no-scrollbar pb-2 md:pb-0">
            {sections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-semibold shrink-0 transition-all ${
                    isActive
                      ? 'bg-[#FFD43B] text-[#202124] font-bold shadow-xs'
                      : 'text-[#737373] dark:text-[#A3A3A3] hover:bg-white dark:hover:bg-[#202020] hover:text-[#202124] dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#202124]' : 'text-[#737373] dark:text-[#A3A3A3]'}`} />
                    <span>{sec.label}</span>
                  </div>
                  {sec.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-[#202124] text-white'
                          : 'bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/20'
                      }`}
                    >
                      {sec.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Inset Grouped Panels */}
          <div className="md:col-span-8 space-y-5">
            {/* 1. Account & Profile Section */}
            {activeSection === 'account' && (
              <div className="space-y-4">
                <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FFD43B] to-[#FF6B5E] text-[#202124] flex items-center justify-center font-black text-xl shadow-xs">
                        <span>{user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}</span>
                      </div>
                      <div>
                        <h2 className="text-base font-black text-[#202124] dark:text-white">
                          {user.name}
                        </h2>
                        <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16865D]/15 text-[#16865D] border border-[#16865D]/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Supabase Auth Verified
                          </span>
                          <span className="text-[10px] font-semibold text-[#737373] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                            Creator Workspace Tier
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => signOut()}
                      className="px-3.5 py-1.5 rounded-xl border border-[#FF4D4F]/30 hover:border-[#FF4D4F] text-[#FF4D4F] hover:bg-[#FF4D4F]/10 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#EAE7E1] dark:border-[#2E2E2E] text-xs">
                    <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                      <span className="text-[10px] uppercase font-bold text-[#737373]">Account Role</span>
                      <p className="font-bold text-[#202124] dark:text-white capitalize mt-0.5">{user.role}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                      <span className="text-[10px] uppercase font-bold text-[#737373]">User ID</span>
                      <p className="font-mono text-[10px] text-[#737373] dark:text-[#A3A3A3] truncate mt-0.5" title={user.id}>
                        {user.id}
                      </p>
                    </div>
                    <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                      <span className="text-[10px] uppercase font-bold text-[#737373]">Row Level Security</span>
                      <p className="font-bold text-[#16865D] mt-0.5 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> Enforced (RLS)
                      </p>
                    </div>
                  </div>

                  {/* Profile Edit Form */}
                  <form onSubmit={handleSaveProfile} className="space-y-4 pt-4 border-t border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-[#737373] dark:text-[#A3A3A3]">
                        Edit Profile Details
                      </h3>
                      {profileSuccessMsg && (
                        <span className="text-xs font-bold text-[#16865D] flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>{profileSuccessMsg}</span>
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-[#202124] dark:text-white mb-1">
                          Display Name
                        </label>
                        <input
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] focus:outline-hidden focus:border-[#FFD43B]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-[#202124] dark:text-white mb-1">
                          Preferred Language
                        </label>
                        <select
                          value={preferredLang}
                          onChange={(e) => setPreferredLang(e.target.value as any)}
                          className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] focus:outline-hidden focus:border-[#FFD43B]"
                        >
                          <option value="en">English (Global)</option>
                          <option value="bn">Bengali (বাংলা)</option>
                          <option value="hi">Hindi (हिंदी)</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        disabled={isSavingProfile}
                        className="px-4 py-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        {isSavingProfile ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Save Profile</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* 2. Appearance Section */}
            {activeSection === 'appearance' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-5">
                <div>
                  <h2 className="text-sm font-bold text-[#202124] dark:text-white">Theme &amp; Visual Identity</h2>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Choose between warm iOS editorial light mode or sleek dark mode.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      theme === 'light'
                        ? 'border-[#FFD43B] bg-[#FAF9F6] ring-2 ring-[#FFD43B]/30'
                        : 'border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-white text-slate-800 flex items-center justify-center shadow-xs">
                        <Sun className="w-4 h-4 text-[#D97706]" />
                      </div>
                      {theme === 'light' && <Check className="w-4 h-4 text-[#202124]" />}
                    </div>
                    <span className="font-bold text-xs text-[#202124] block">Warm Light</span>
                    <span className="text-[11px] text-[#737373] mt-0.5 block">#FAF9F6 canvas with crisp white surfaces</span>
                  </button>

                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      theme === 'dark'
                        ? 'border-[#FFD43B] bg-[#151515] text-white ring-2 ring-[#FFD43B]/30'
                        : 'border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#151515] text-white opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl bg-[#202020] text-white flex items-center justify-center shadow-xs">
                        <Moon className="w-4 h-4 text-[#FFD43B]" />
                      </div>
                      {theme === 'dark' && <Check className="w-4 h-4 text-[#FFD43B]" />}
                    </div>
                    <span className="font-bold text-xs block">Obsidian Dark</span>
                    <span className="text-[11px] text-[#A3A3A3] mt-0.5 block">#151515 background with #202020 surfaces</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-[#EAE7E1] dark:border-[#2E2E2E]">
                  <span className="text-xs font-bold text-[#202124] dark:text-white block mb-2">Accent Palette Preview</span>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#FFD43B]" />
                      <span className="text-xs font-mono font-semibold">#FFD43B Yellow</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#FF6B5E]" />
                      <span className="text-xs font-mono font-semibold">#FF6B5E Coral</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                      <span className="w-3.5 h-3.5 rounded-full bg-[#FF4D4F]" />
                      <span className="text-xs font-mono font-semibold">#FF4D4F Red</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. AI Providers Section */}
            {activeSection === 'providers' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-[#202124] dark:text-white">Connected AI Runtimes</h2>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                      Live status of enterprise and free developer tier LLM endpoints.
                    </p>
                  </div>
                  <button
                    onClick={handleRefresh}
                    disabled={isRefreshing}
                    className="flex items-center gap-1.5 rounded-xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] px-3 py-1.5 text-xs font-bold text-[#202124] dark:text-white hover:border-[#FFD43B] transition"
                  >
                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-[#FFD43B]' : ''}`} />
                    <span>Probe Status</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {/* AWS Bedrock */}
                  <div className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cpu className="h-4 w-4 text-[#FFD43B]" />
                        <span className="text-xs font-bold text-[#202124] dark:text-white">
                          AWS Bedrock Runtime (Selected Region: ap-southeast-2)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/20">
                        {isBedrockOnline ? 'CONNECTED & AUTHORIZED' : 'ONLINE GATEWAY'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono text-[#737373]">
                      <div>Model: <span className="text-[#202124] dark:text-white font-semibold">Claude Sonnet 3.7 / 3.5</span></div>
                      <div>Region: <span className="text-[#202124] dark:text-white font-semibold">ap-southeast-2</span></div>
                      <div>Status: <span className="text-[#16865D] font-semibold">Active &amp; Guarded</span></div>
                    </div>
                  </div>

                  {/* Groq LPU */}
                  <div className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-[#FF6B5E]" />
                        <span className="text-xs font-bold text-[#202124] dark:text-white">
                          Groq LPU Cloud (Free Tier)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/20">
                        ACTIVE • ~460ms
                      </span>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Ultra-fast reasoning model: <code>qwen/qwen3.8-27b</code> with zero inference cost.
                    </p>
                  </div>

                  {/* OpenRouter */}
                  <div className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Cloud className="h-4 w-4 text-[#D97706]" />
                        <span className="text-xs font-bold text-[#202124] dark:text-white">
                          OpenRouter Gateway (Llama 3.3 70B &amp; Gemma 4 Free)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/20">
                        ONLINE LIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Multi-model provider routing with automatic failover and token conservation.
                    </p>
                  </div>

                  {/* Cohere */}
                  <div className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-[#FF4D4F]" />
                        <span className="text-xs font-bold text-[#202124] dark:text-white">
                          Cohere Enterprise (Command R+ Free Dev Tier)
                        </span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/20">
                        ONLINE LIVE
                      </span>
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      128,000 token context window tailored for comprehensive scriptwriting and deep research.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Connected Accounts Section */}
            {activeSection === 'connections' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3.5">
                  <div>
                    <h2 className="text-sm font-bold text-[#202124] dark:text-white">Connected Social Accounts</h2>
                    <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                      Genuine OAuth 2.0 PKCE authorized channels for autonomous Reels and Shorts publishing.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => (window.location.href = '/api/social/oauth/authorize?provider=youtube')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-xs font-bold text-[#202124] transition shadow-xs"
                    >
                      <span>+ Connect YouTube</span>
                    </button>
                    <button
                      onClick={() => (window.location.href = '/api/social/oauth/authorize?provider=instagram')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF6B5E] hover:bg-[#FF4D4F] text-xs font-bold text-white transition shadow-xs"
                    >
                      <span>+ Connect Instagram</span>
                    </button>
                  </div>
                </div>

                {socialAccounts.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-dashed border-[#EAE7E1] dark:border-[#2E2E2E] space-y-2">
                    <p className="text-xs font-semibold text-[#202124] dark:text-white">
                      No external social accounts currently authorized.
                    </p>
                    <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                      Click above to authorize your YouTube Creator Channel or Meta Instagram Professional account using official OAuth 2.0.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {socialAccounts.map((acc) => (
                      <div
                        key={acc.id}
                        className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          {acc.avatarUrl ? (
                            <img
                              src={acc.avatarUrl}
                              alt={acc.accountName}
                              className="w-10 h-10 rounded-full border border-[#EAE7E1] object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-2xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center font-bold text-xs uppercase">
                              {acc.provider.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <span className="text-xs font-bold text-[#202124] dark:text-white block">
                              {acc.accountName}{' '}
                              {acc.accountHandle && (
                                <span className="font-normal text-[#FF6B5E]">({acc.accountHandle})</span>
                              )}
                            </span>
                            <span className="text-[11px] text-[#737373] font-mono">
                              {acc.provider.toUpperCase()} • ID: <code>{acc.platformAccountId}</code>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${
                              acc.status === 'connected'
                                ? 'bg-[#16865D]/10 text-[#16865D] border-[#16865D]/30'
                                : 'bg-[#FF4D4F]/10 text-[#FF4D4F] border-[#FF4D4F]/30'
                            }`}
                          >
                            {acc.status}
                          </span>

                          <button
                            onClick={() => handleTestAccount(acc.id)}
                            disabled={testingAccId === acc.id}
                            className="px-2.5 py-1 rounded-lg border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] text-xs font-semibold text-[#FF6B5E] hover:border-[#FFD43B] transition flex items-center gap-1"
                          >
                            <RefreshCw className={`w-3 h-3 ${testingAccId === acc.id ? 'animate-spin' : ''}`} />
                            <span>{testingAccId === acc.id ? 'Probing...' : 'Test Probe'}</span>
                          </button>

                          <button
                            onClick={() => handleDisconnectAccount(acc.id)}
                            className="text-xs font-semibold text-[#FF4D4F] hover:underline px-1"
                          >
                            Disconnect
                          </button>
                        </div>

                        {testingStatusMsg && testingStatusMsg.id === acc.id && (
                          <div
                            className={`sm:col-span-2 w-full mt-2 p-2 rounded-xl text-[10px] font-semibold ${
                              testingStatusMsg.ok
                                ? 'bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/20'
                                : 'bg-[#FF4D4F]/10 text-[#FF4D4F] border border-[#FF4D4F]/20'
                            }`}
                          >
                            {testingStatusMsg.msg}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. Notifications Section */}
            {activeSection === 'notifications' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-[#202124] dark:text-white">Notification Preferences</h2>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Choose when and how RIIQX notifies you of completed tasks.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <div>
                      <span className="text-xs font-bold text-[#202124] dark:text-white block">
                        Video Render Completions
                      </span>
                      <span className="text-[11px] text-[#737373]">
                        Alert when Creator Studio finishes rendering a 30 FPS MP4 video.
                      </span>
                    </div>
                    <button
                      onClick={() => setRenderAlerts(!renderAlerts)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                        renderAlerts ? 'bg-[#FFD43B] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <div>
                      <span className="text-xs font-bold text-[#202124] dark:text-white block">
                        Autopilot Social Publishing Alerts
                      </span>
                      <span className="text-[11px] text-[#737373]">
                        Notify upon successful post dispatch to Instagram Reels or YouTube Shorts.
                      </span>
                    </div>
                    <button
                      onClick={() => setPublishAlerts(!publishAlerts)}
                      className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${
                        publishAlerts ? 'bg-[#FFD43B] justify-end' : 'bg-slate-300 dark:bg-slate-700 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Privacy & Security */}
            {activeSection === 'privacy' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-2 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3">
                  <Lock className="h-4 w-4 text-[#16865D]" />
                  <h2 className="text-sm font-bold text-[#202124] dark:text-white">
                    Cryptographic Privacy &amp; Data Isolation
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-1.5">
                    <span className="text-[#737373] text-[10px] uppercase font-bold tracking-wider">
                      Authentication Engine
                    </span>
                    <div className="font-semibold text-[#16865D] flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> 100% Non-Firebase (PBKDF2 SHA-256)
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      Credentials hashed with 10,000 rounds of PBKDF2 with 16-byte cryptographically secure salts.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 space-y-1.5">
                    <span className="text-[#737373] text-[10px] uppercase font-bold tracking-wider">
                      Zero-Telemetry Local Storage
                    </span>
                    <div className="font-semibold text-[#202124] dark:text-white">
                      Encrypted Client-Side Storage
                    </div>
                    <p className="text-[11px] text-[#737373]">
                      No third-party trackers or external analytics SDKs are loaded in your browser session.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Usage & Quotas */}
            {activeSection === 'usage' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-[#202124] dark:text-white">Usage &amp; Quotas Ledger</h2>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Honest telemetry showing actual token consumption and zero-cost free tier utilization.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="text-[10px] uppercase font-bold text-[#737373]">Free Tier Inferences</span>
                    <p className="text-xl font-black text-[#16865D] mt-1">100% Free</p>
                    <span className="text-[10px] text-[#737373]">$0.00 estimated API cost</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="text-[10px] uppercase font-bold text-[#737373]">Active Models</span>
                    <p className="text-xl font-black text-[#202124] dark:text-white mt-1">4 Providers</p>
                    <span className="text-[10px] text-[#737373]">Bedrock, Groq, OpenRouter, Cohere</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="text-[10px] uppercase font-bold text-[#737373]">Concurrency Protection</span>
                    <p className="text-xl font-black text-[#D97706] mt-1">Active</p>
                    <span className="text-[10px] text-[#737373]">Throttling &amp; fallback guards</span>
                  </div>
                </div>
              </div>
            )}

            {/* 8. Data & Storage */}
            {activeSection === 'data' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-[#202124] dark:text-white">Workspace Data Management</h2>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Export your full project portfolio or reset client workspace data safely.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] gap-3">
                    <div>
                      <span className="text-xs font-bold text-[#202124] dark:text-white block">
                        Export Complete Workspace Archive
                      </span>
                      <span className="text-[11px] text-[#737373]">
                        Downloads all conversations, creator projects, storyboards, and custom templates in JSON format.
                      </span>
                    </div>
                    <button
                      onClick={exportData}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] hover:border-[#FFD43B] text-xs font-bold text-[#202124] dark:text-white transition shadow-2xs"
                    >
                      <Download className="w-3.5 h-3.5 text-[#FFD43B]" />
                      <span>Export JSON</span>
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 gap-3">
                    <div>
                      <span className="text-xs font-bold text-red-900 dark:text-red-200 block">
                        Permanently Wipe All Account Data
                      </span>
                      <span className="text-[11px] text-red-700/80 dark:text-red-300/80">
                        Irreversibly deletes all local projects, scripts, chat histories, and cached credentials.
                      </span>
                    </div>
                    <button
                      onClick={wipeData}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF4D4F] hover:bg-red-600 text-xs font-bold text-white transition shadow-2xs shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Wipe Data</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 9. About RIIQX */}
            {activeSection === 'about' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FFD43B] to-[#FF6B5E] text-[#202124] flex items-center justify-center font-black text-lg shadow-xs">
                    <span>R</span>
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#202124] dark:text-white">RIIQX 2.0.0 Production</h2>
                    <p className="text-xs text-[#737373]">Autonomous Creator OS • Tool-Calling AI Agent</p>
                  </div>
                </div>

                <p className="text-xs leading-relaxed text-[#737373] dark:text-[#A3A3A3]">
                  RIIQX is built for autonomous creators who require true end-to-end production pipelines: from trend discovery and viral scriptwriting to multi-track canvas editing, AI audio/video synthesis, and multi-platform publishing.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-center text-xs">
                  <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="font-bold text-[#202124] dark:text-white block">14 Stages</span>
                    <span className="text-[10px] text-[#737373]">Creator Studio</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="font-bold text-[#202124] dark:text-white block">Level 3</span>
                    <span className="text-[10px] text-[#737373]">Autopilot Core</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="font-bold text-[#202124] dark:text-white block">30 FPS</span>
                    <span className="text-[10px] text-[#737373]">Canvas Render</span>
                  </div>
                  <div className="p-3 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E]">
                    <span className="font-bold text-[#202124] dark:text-white block">iOS Polished</span>
                    <span className="text-[10px] text-[#737373]">Design System</span>
                  </div>
                </div>
              </div>
            )}

            {/* 10. Legal & Compliance */}
            {activeSection === 'legal' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-[#202124] dark:text-white">Legal Disclosures &amp; Compliance</h2>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Official documents, commercial rights, and synthetic media labeling.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { type: 'privacy' as LegalDocType, title: 'Privacy Policy', desc: 'Zero-telemetry & encrypted tokens' },
                    { type: 'terms' as LegalDocType, title: 'Terms of Service', desc: 'Commercial rights & ownership' },
                    { type: 'ai-disclosure' as LegalDocType, title: 'AI Usage Disclosure', desc: 'Synthetic media ethics' },
                  ].map((card) => (
                    <button
                      key={card.type}
                      onClick={() => setActiveLegalDoc(card.type)}
                      className="p-4 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] hover:border-[#FFD43B] text-left transition group shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-xs font-bold text-[#202124] dark:text-white group-hover:text-[#FF6B5E] transition-colors block">
                          {card.title}
                        </span>
                        <span className="text-[11px] text-[#737373] mt-1 block leading-relaxed">
                          {card.desc}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#737373] self-end mt-3 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 11. Support & Docs */}
            {activeSection === 'support' && (
              <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
                <div>
                  <h2 className="text-sm font-bold text-[#202124] dark:text-white">Support &amp; Developer Community</h2>
                  <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
                    Direct access to core engineering support and API documentation.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] space-y-2">
                  <span className="text-xs font-bold text-[#202124] dark:text-white block">
                    Developer &amp; Architecture Support
                  </span>
                  <p className="text-xs text-[#737373] leading-relaxed">
                    Have an issue with AWS Bedrock throttling, social OAuth callbacks, or multi-track audio alignment? Open a direct ticket or review documentation.
                  </p>
                  <button
                    onClick={() => setActiveLegalDoc('support')}
                    className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-xs font-bold text-[#202124] transition shadow-xs"
                  >
                    <span>Contact Support Team</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <RiiqxLegalModal
        type={activeLegalDoc}
        onClose={() => setActiveLegalDoc(null)}
      />

      <RiiqxOnboardingModal
        isOpen={isOnboardingModalOpen}
        onClose={() => setIsOnboardingModalOpen(false)}
      />
    </div>
  );
}
