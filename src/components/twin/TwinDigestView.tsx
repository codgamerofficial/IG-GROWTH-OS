'use client';

// =============================================================================
// RIIQX — Weekly Personal Intelligence Digest View
// Scheduled Summaries • Verifiable Citations • User-Selectable Topics
// =============================================================================

import React, { useState, useEffect } from 'react';
import { BookOpen, Calendar, ExternalLink, Sparkles, CheckCircle2, Bookmark } from 'lucide-react';
import { WeeklyDigest } from '@/lib/riiqx/twin-types';

export function TwinDigestView() {
  const [digests, setDigests] = useState<WeeklyDigest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDigests() {
      try {
        setLoading(true);
        const res = await fetch('/api/twin/digest');
        if (res.ok) {
          const data = await res.json();
          setDigests(data.digests || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadDigests();
  }, []);

  const currentDigest = digests[0];

  return (
    <div className="flex-1 overflow-y-auto bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[#FF5722]" />
            <span className="text-xs font-black uppercase tracking-wider text-[#6B6661] dark:text-[#A3A3A3]">
              Personal Digest
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading mt-1">
            Weekly Intelligence Digest
          </h1>
          <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] mt-1">
            Consolidated intelligence covering your active goals, detected price drops, and lifestyle picks.
          </p>
        </div>
      </div>

      {currentDigest ? (
        <div className="rounded-3xl border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-8 space-y-6 shadow-xs max-w-4xl mx-auto">
          <div className="flex items-center justify-between border-b border-[#EAE3D9] dark:border-[#26262B] pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-[#FF5722]">
                Week of {new Date(currentDigest.weekStartDate).toLocaleDateString()}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white font-heading mt-1">
                {currentDigest.title}
              </h2>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-bold text-[#16865D] bg-[#16865D]/10 px-3 py-1 rounded-full">
              <CheckCircle2 className="h-3.5 w-3.5" /> Curated by Twin
            </span>
          </div>

          <div className="space-y-6">
            {currentDigest.sections.map((sec, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] space-y-3"
              >
                <h3 className="text-sm font-bold text-[#1A1817] dark:text-white font-heading flex items-center gap-2">
                  <Bookmark className="h-4 w-4 text-[#FF5722]" />
                  <span>{sec.title}</span>
                </h3>
                <p className="text-xs sm:text-sm text-[#6B6661] dark:text-[#A3A3A3] leading-relaxed">
                  {sec.summary}
                </p>

                {sec.sourceCitations && sec.sourceCitations.length > 0 && (
                  <div className="pt-2 border-t border-[#EAE3D9] dark:border-[#26262B] text-[10px] text-[#6B6661]">
                    <span className="font-bold">Sources &amp; Evidence: </span>
                    <span>{sec.sourceCitations.join(' • ')}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] max-w-xl mx-auto space-y-3">
          <BookOpen className="h-10 w-10 text-[#6B6661] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#1A1817] dark:text-white">No digest generated yet</h3>
          <p className="text-xs text-[#6B6661]">
            Your weekly digest is compiled every Monday based on your active goals and saved searches.
          </p>
        </div>
      )}
    </div>
  );
}
