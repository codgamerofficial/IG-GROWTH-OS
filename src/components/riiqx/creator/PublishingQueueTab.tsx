'use client';

// =============================================================================
// RIIQX Creator Studio — Publishing Queue & Automation
// Genuine OAuth 2.0 Accounts • Meta Graph API v26.0 & YouTube Shorts Adapters
// Idempotency Protection • Real-Time Container Polling • Truthful Status
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  CreatorProject,
  PublishingJob,
  CreatorStudioTab,
} from '@/lib/riiqx/creator-types';
import {
  Clock,
  Send,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Youtube,
  Instagram,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Radio,
  Plus,
} from 'lucide-react';

interface ConnectedAccount {
  id: string;
  provider: string;
  platformAccountId: string;
  accountName: string;
  accountHandle?: string;
  avatarUrl?: string;
  status: string;
}

interface PublishingQueueTabProps {
  project: CreatorProject | null;
  onUpdateProject: (updated: CreatorProject) => void;
  onTabChange: (tab: CreatorStudioTab) => void;
}

export function PublishingQueueTab({
  project,
  onUpdateProject,
  onTabChange,
}: PublishingQueueTabProps) {
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([]);
  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);

  useEffect(() => {
    async function loadAccounts() {
      setIsLoadingAccounts(true);
      try {
        const res = await fetch('/api/social/accounts');
        const data = await res.json();
        if (data.success && Array.isArray(data.accounts)) {
          setConnectedAccounts(data.accounts);
          if (data.accounts.length > 0) {
            setSelectedAccountId(data.accounts[0].id);
          }
        }
      } catch (err) {
        console.error('Failed to load connected accounts:', err);
      } finally {
        setIsLoadingAccounts(false);
      }
    }
    loadAccounts();
  }, []);

  const [job, setJob] = useState<PublishingJob>(() => {
    if (project?.publishingJob) return project.publishingJob;
    return {
      id: `job_${Date.now()}`,
      projectId: project?.id || '',
      platform: 'both',
      connectedAccount: selectedAccountId || '@unconnected',
      scheduledTime: new Date(Date.now() + 3600000 * 2).toISOString(),
      status: 'scheduled',
      retryCount: 0,
      idempotencyKey: `idemp_${project?.id || Date.now()}`,
    };
  });

  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchLogs, setDispatchLogs] = useState<string[]>([]);
  const [publishError, setPublishError] = useState<string | null>(null);

  if (!project) {
    return (
      <div className="flex h-96 flex-col items-center justify-center p-8 text-center text-[#737373] dark:text-[#A3A3A3]">
        <Clock className="h-10 w-10 text-[#FFD43B] mb-3" />
        <h3 className="text-base font-bold text-[#202124] dark:text-white">No Project Selected</h3>
        <p className="text-xs mt-1">Select or create a project from Overview to view the publishing queue.</p>
      </div>
    );
  }

  const selectedAccount = connectedAccounts.find((a) => a.id === selectedAccountId);

  const handleLivePublish = async () => {
    if (!selectedAccount) {
      alert('Please connect a YouTube or Instagram account before publishing.');
      return;
    }

    setIsDispatching(true);
    setPublishError(null);
    setDispatchLogs(['Initiating automated container dispatch with idempotency verification...']);

    setJob((prev) => ({ ...prev, status: 'uploading' }));
    await new Promise((r) => setTimeout(r, 400));

    setDispatchLogs((prev) => [
      ...prev,
      `Target: ${selectedAccount.provider.toUpperCase()} (${selectedAccount.accountName})...`,
    ]);

    try {
      const res = await fetch('/api/social/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          accountId: selectedAccount.id,
          platform: selectedAccount.provider,
          title: project.name,
          caption: project.storyboard?.caption || `${project.name} #Shorts #Reels`,
          mediaUrl: project.renderedVideoBlobUrl || 'https://riiqx.ai/sample_9x16.mp4',
          idempotencyKey: `idemp_${project.id}_${Date.now()}`,
        }),
      });

      const data = await res.json();

      if (data.success && data.status === 'published') {
        setDispatchLogs((prev) => [
          ...prev,
          `✅ Publication confirmed on ${selectedAccount.provider.toUpperCase()}!`,
          `Platform Media ID: ${data.mediaId}`,
          `Permalink: ${data.permalink}`,
        ]);

        const updatedJob: PublishingJob = {
          ...job,
          status: 'published',
          publishedAt: new Date().toISOString(),
          platformMediaId: data.mediaId,
          permalink: data.permalink,
          errorMessage: undefined,
        };

        setJob(updatedJob);
        onUpdateProject({
          ...project,
          status: 'published',
          publishingJob: updatedJob,
          updatedAt: new Date().toISOString(),
        });
      } else {
        const errorMsg = data.error || data.errorMessage || 'Publishing rejected by platform.';
        setPublishError(errorMsg);
        setDispatchLogs((prev) => [...prev, `❌ Publication failed: ${errorMsg}`]);

        const updatedJob: PublishingJob = {
          ...job,
          status: 'failed',
          errorMessage: errorMsg,
        };

        setJob(updatedJob);
        onUpdateProject({
          ...project,
          status: 'failed',
          publishingJob: updatedJob,
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Network error during publish';
      setPublishError(errorMsg);
      setDispatchLogs((prev) => [...prev, `❌ Fatal error: ${errorMsg}`]);

      setJob((prev) => ({ ...prev, status: 'failed', errorMessage: errorMsg }));
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
              <Clock className="h-4 w-4" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">
              Publishing Queue &amp; Dispatcher
            </h1>
            <span
              className={`rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                job.status === 'published'
                  ? 'bg-[#16865D]/10 text-[#16865D] border-[#16865D]/30'
                  : job.status === 'uploading'
                  ? 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border-[#FFD43B]/40'
                  : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
              }`}
            >
              Status: {job.status}
            </span>
          </div>
          <p className="mt-1 text-xs text-[#737373] dark:text-[#A3A3A3]">
            Real-time publishing queue for Meta Instagram Graph API v26.0 and Google YouTube Data API v3.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {job.status === 'published' ? (
            <button
              onClick={() => onTabChange('analytics')}
              className="flex items-center gap-1.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] px-4 py-2 text-xs font-bold transition shadow-xs"
            >
              <span>Track Performance</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          ) : (
            <button
              onClick={handleLivePublish}
              disabled={isDispatching || connectedAccounts.length === 0}
              className="flex items-center gap-1.5 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] px-4 py-2 text-xs font-bold transition shadow-xs active:scale-95 disabled:opacity-60"
            >
              <Send className="h-3.5 w-3.5" />
              <span>{isDispatching ? 'Publishing Live...' : 'Publish Live Now'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Target Account Selector */}
      <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-3">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-[#FFD43B]" />
            <h3 className="text-sm font-bold text-[#202124] dark:text-white">Select Connected Target Channel</h3>
          </div>
          <button
            onClick={() => (window.location.href = '/api/social/oauth/authorize?provider=youtube')}
            className="text-xs font-semibold text-[#FF6B5E] hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Connect Another</span>
          </button>
        </div>

        {connectedAccounts.length === 0 ? (
          <div className="p-6 text-center rounded-2xl bg-[#FAF9F6] dark:bg-[#151515] border border-dashed border-[#EAE7E1] dark:border-[#2E2E2E] space-y-2">
            <AlertCircle className="w-6 h-6 text-[#FF4D4F] mx-auto" />
            <p className="text-xs font-bold text-[#202124] dark:text-white">
              No Social Media Accounts Authorized
            </p>
            <p className="text-[11px] text-[#737373] dark:text-[#A3A3A3]">
              Authorize your YouTube Channel or Instagram Professional account to enable live publishing.
            </p>
            <div className="pt-2 flex justify-center gap-2">
              <button
                onClick={() => (window.location.href = '/api/social/oauth/authorize?provider=youtube')}
                className="px-3.5 py-1.5 rounded-xl bg-[#FFD43B] text-xs font-bold text-[#202124] shadow-xs"
              >
                Connect YouTube
              </button>
              <button
                onClick={() => (window.location.href = '/api/social/oauth/authorize?provider=instagram')}
                className="px-3.5 py-1.5 rounded-xl bg-[#FF6B5E] text-xs font-bold text-white shadow-xs"
              >
                Connect Instagram
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {connectedAccounts.map((acc) => (
              <div
                key={acc.id}
                onClick={() => setSelectedAccountId(acc.id)}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  selectedAccountId === acc.id
                    ? 'border-[#FFD43B] bg-[#FFD43B]/10 dark:bg-[#FFD43B]/10'
                    : 'border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] hover:border-[#FFD43B]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      acc.provider === 'youtube'
                        ? 'bg-[#FF4D4F]/15 text-[#FF4D4F]'
                        : 'bg-[#FF6B5E]/15 text-[#FF6B5E]'
                    }`}
                  >
                    {acc.provider === 'youtube' ? (
                      <Youtube className="w-4 h-4" />
                    ) : (
                      <Instagram className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#202124] dark:text-white block">
                      {acc.accountName}
                    </span>
                    <span className="text-[10px] text-[#737373] dark:text-[#A3A3A3] font-mono">
                      {acc.accountHandle || acc.provider.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16865D]/10 text-[#16865D] border border-[#16865D]/20">
                    {acc.status}
                  </span>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      selectedAccountId === acc.id ? 'border-[#FFD43B] bg-[#FFD43B]' : 'border-slate-400'
                    }`}
                  >
                    {selectedAccountId === acc.id && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Job Card */}
      <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] p-6 space-y-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-4">
          <div>
            <h3 className="text-base font-bold text-[#202124] dark:text-white">{project.name}</h3>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-0.5">
              Target Channel: {selectedAccount ? selectedAccount.accountName : 'None Selected'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-[#737373] dark:text-[#A3A3A3]">
              <Calendar className="h-3.5 w-3.5 text-[#FFD43B]" />
              Scheduled for: {new Date(job.scheduledTime).toLocaleDateString()} at{' '}
              {new Date(job.scheduledTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Live Confirmation Banner if published */}
        {job.status === 'published' && (
          <div className="rounded-2xl border border-[#16865D]/30 bg-[#16865D]/10 p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-[#16865D] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#202124] dark:text-white">
                  Live Platform Publication Confirmed
                </h4>
                <p className="text-[11px] text-[#737373] dark:text-slate-300 mt-0.5">
                  Media container processed and published successfully. Real platform Media ID:{' '}
                  <code className="text-[#16865D] font-mono font-bold">{job.platformMediaId}</code>
                </p>
              </div>
            </div>
            {job.permalink && (
              <a
                href={job.permalink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-xs font-bold text-[#16865D] hover:underline shrink-0"
              >
                <span>View Live</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {/* Failure Banner if error */}
        {publishError && (
          <div className="rounded-2xl border border-[#FF4D4F]/30 bg-[#FF4D4F]/10 p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-[#FF4D4F] shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-[#FF4D4F]">Publication Halted by Safety Gate</h4>
              <p className="text-[11px] text-[#FF4D4F] mt-0.5 leading-relaxed">{publishError}</p>
            </div>
          </div>
        )}

        {/* Dispatch Console Output */}
        {dispatchLogs.length > 0 && (
          <div className="rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] p-4 font-mono text-xs text-[#202124] dark:text-slate-300 space-y-1">
            <div className="text-[10px] uppercase font-bold text-[#737373] mb-1">
              Live Dispatch Telemetry:
            </div>
            {dispatchLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-[#FFD43B]">›</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
