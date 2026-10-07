'use client';

// =============================================================================
// IG GrowthOS: Approval Center (Section 18 & 19)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Play,
  Copy,
  Edit3,
  Calendar,
  AlertTriangle,
  Info,
  Sparkles,
} from 'lucide-react';
import { ContentItem } from '@/lib/supabase/types';

export function ApprovalsView() {
  const {
    contentItems,
    approveContent,
    rejectContent,
    scheduleContent,
    publishContent,
    createContentItem,
  } = useGrowthOS();

  const [selectedItem, setSelectedItem] = useState<ContentItem | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [schedulingId, setSchedulingId] = useState<string | null>(null);
  const [scheduleDateTime, setScheduleDateTime] = useState('');
  const [publishingId, setPublishingId] = useState<string | null>(null);
  const [filterTab, setFilterTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'>('PENDING');

  const filteredItems = contentItems.filter((item) => {
    if (filterTab === 'ALL') return true;
    return item.approval_status === filterTab;
  });

  const handlePublish = async (id: string) => {
    try {
      setPublishingId(id);
      const res = await publishContent(id);
      alert(res.message);
    } catch (err: any) {
      alert(`Publishing Error: ${err.message}`);
    } finally {
      setPublishingId(null);
    }
  };

  const handleDuplicate = async (item: ContentItem) => {
    await createContentItem({
      title: `${item.title} (Copy)`,
      content_type: item.content_type,
      content_pillar: item.content_pillar,
      hook: item.hook,
      caption: item.caption,
      hashtags: item.hashtags,
      cta: item.cta,
      status: 'DRAFT',
      approval_status: 'DRAFT',
      ai_score: item.ai_score,
    });
    alert('Duplicated into Drafts!');
  };

  const handleConfirmReject = async () => {
    if (!rejectingId) return;
    await rejectContent(rejectingId, rejectionReason || 'Needs revisions');
    setRejectingId(null);
    setRejectionReason('');
  };

  const handleConfirmSchedule = async () => {
    if (!schedulingId || !scheduleDateTime) return;
    await scheduleContent(schedulingId, new Date(scheduleDateTime).toISOString());
    setSchedulingId(null);
    setScheduleDateTime('');
  };

  return (
    <div className="space-y-6 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Approvals Command Center</span>
            <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs text-rose-300 border border-rose-500/30">
              {contentItems.filter((i) => i.approval_status === 'PENDING').length} Pending Review
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Safety Gate Enforced: Content requires <strong className="text-white">APPROVED</strong> status before scheduling or publishing.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 rounded-xl bg-white/5 border border-white/10 p-1">
          {(['PENDING', 'APPROVED', 'REJECTED', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterTab(tab)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                filterTab === tab
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-zinc-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {tab === 'PENDING' ? 'Pending Review' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      {filteredItems.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#111114] p-12 text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-400/80 mb-3" />
          <h3 className="text-sm font-semibold text-white">No items in this filter queue</h3>
          <p className="text-xs text-zinc-400 mt-1">Run today&apos;s workflow or generate ideas to populate new packages.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredItems.map((item) => {
            const isApproved = item.approval_status === 'APPROVED';
            const isPending = item.approval_status === 'PENDING';
            const isRejected = item.approval_status === 'REJECTED';
            const isPublished = item.status === 'PUBLISHED';
            const breakdown = item.ai_score_breakdown;

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="rounded-lg bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white uppercase tracking-wider">
                        {item.content_type}
                      </span>
                      {item.content_pillar && (
                        <span className="rounded-lg bg-rose-500/20 px-2 py-0.5 text-[11px] font-medium text-rose-300 border border-rose-500/30">
                          {item.content_pillar}
                        </span>
                      )}
                    </div>

                    {/* AI Opportunity Score Badge */}
                    <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-right">
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider">Opportunity</div>
                      <div className="text-sm font-bold text-amber-400">{item.ai_score}/100</div>
                    </div>
                  </div>

                  <h3 className="mt-3 text-base font-bold text-white leading-snug">{item.title}</h3>

                  {item.hook && (
                    <div className="mt-2.5 rounded-xl bg-white/5 border border-white/5 p-3 text-xs">
                      <strong className="text-rose-400 block mb-0.5 font-semibold">0–3s Hook:</strong>
                      <span className="text-zinc-200 italic">&ldquo;{item.hook}&rdquo;</span>
                    </div>
                  )}

                  {/* Factor Breakdown (Section 11) */}
                  {breakdown && (
                    <div className="mt-3 grid grid-cols-4 gap-2 text-[10px] text-zinc-400 bg-black/40 rounded-xl p-2.5 border border-white/5">
                      <div>
                        <span>Hook: </span>
                        <strong className="text-white">{breakdown.hook_strength}%</strong>
                      </div>
                      <div>
                        <span>Audience: </span>
                        <strong className="text-white">{breakdown.audience_relevance}%</strong>
                      </div>
                      <div>
                        <span>Trend: </span>
                        <strong className="text-white">{breakdown.trend_relevance}%</strong>
                      </div>
                      <div>
                        <span>Brand Fit: </span>
                        <strong className="text-white">{breakdown.brand_fit}%</strong>
                      </div>
                    </div>
                  )}

                  <p className="mt-3 text-xs text-zinc-300 line-clamp-3 whitespace-pre-wrap">{item.caption}</p>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.hashtags.slice(0, 5).map((t, i) => (
                      <span key={i} className="text-[10px] text-rose-400/90 bg-rose-500/10 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>

                  {item.scheduled_at && (
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Scheduled for: {new Date(item.scheduled_at).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {/* Action Bar */}
                <div className="mt-6 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleDuplicate(item)}
                      className="p-2 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white"
                      title="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="px-2.5 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-zinc-300 hover:text-white"
                    >
                      Full Script
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <button
                          onClick={() => setRejectingId(item.id)}
                          className="flex items-center gap-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Reject</span>
                        </button>
                        <button
                          onClick={() => approveContent(item.id)}
                          className="flex items-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30 shadow-md shadow-emerald-500/10"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Approve</span>
                        </button>
                      </>
                    )}

                    {isApproved && !isPublished && (
                      <>
                        <button
                          onClick={() => setSchedulingId(item.id)}
                          className="flex items-center gap-1 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 hover:bg-indigo-500/20"
                        >
                          <Calendar className="h-3.5 w-3.5" />
                          <span>Schedule</span>
                        </button>
                        <button
                          onClick={() => handlePublish(item.id)}
                          disabled={publishingId === item.id}
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-4 py-1.5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                        >
                          {publishingId === item.id ? (
                            <div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <Play className="h-3.5 w-3.5 fill-white" />
                          )}
                          <span>Publish Now</span>
                        </button>
                      </>
                    )}

                    {isPublished && (
                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-400">
                        <CheckCircle2 className="h-4 w-4" /> Published
                      </span>
                    )}

                    {isRejected && (
                      <span className="text-xs font-semibold text-red-400">Rejected</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Reason Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl bg-[#151519] border border-white/10 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Reject Content Item</h3>
            <p className="text-xs text-zinc-400 mb-4">Provide a reason so future AI generations learn from this feedback.</p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Tone too informal; need more focus on fabric construction rather than lifestyle."
              className="w-full h-24 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder-zinc-500 focus:border-rose-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setRejectingId(null)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="rounded-xl bg-red-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-red-500"
              >
                Confirm Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Picker Modal */}
      {schedulingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-w-md w-full rounded-2xl bg-[#151519] border border-white/10 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white mb-2">Schedule Publication</h3>
            <p className="text-xs text-zinc-400 mb-4">
              Recommended window for RIIQX: <strong className="text-rose-400">6:30 PM – 8:00 PM EST</strong>.
            </p>
            <input
              type="datetime-local"
              value={scheduleDateTime}
              onChange={(e) => setScheduleDateTime(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 p-2.5 text-xs text-white"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setSchedulingId(null)}
                className="px-3 py-1.5 text-xs font-medium text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSchedule}
                disabled={!scheduleDateTime}
                className="rounded-xl bg-indigo-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
              >
                Confirm Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
