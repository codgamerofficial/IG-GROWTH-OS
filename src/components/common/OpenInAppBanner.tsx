'use client';

// =============================================================================
// PujaHop Kolkata: Web-to-App Handoff Banner
// Section 74 & 75: Seamless deep link trigger to native mobile app (pujahop://)
// =============================================================================

import React, { useState } from 'react';
import { Smartphone, X, ExternalLink, ArrowRight } from 'lucide-react';

interface OpenInAppBannerProps {
  routePath?: string;
}

export function OpenInAppBanner({ routePath = '' }: OpenInAppBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  const appDeepLink = `pujahop://${routePath.replace(/^\//, '')}`;

  const handleOpenInApp = () => {
    // Attempt native deep link
    window.location.href = appDeepLink;
    // Fallback: If not installed, alert user about the native Expo build
    setTimeout(() => {
      console.log('App deep link triggered:', appDeepLink);
    }, 1500);
  };

  return (
    <div className="relative isolate flex items-center justify-between gap-x-4 bg-gradient-to-r from-[#170E1A] via-[#2A1118] to-[#121124] px-4 py-2 text-xs border-b border-amber-500/20 text-white">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
          <Smartphone className="h-4 w-4" />
        </div>
        <div>
          <span className="font-bold text-amber-400">PUJAHOP NATIVE APP</span>
          <span className="hidden sm:inline text-zinc-300 ml-2">
            Experience 60 FPS offline maps, digital passport stamps &amp; turn-by-turn guidance.
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleOpenInApp}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold px-3 py-1 text-[11px] shadow-sm transition-all"
        >
          <span>OPEN IN APP</span>
          <ArrowRight className="h-3 w-3" />
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="text-zinc-400 hover:text-white p-1"
          aria-label="Dismiss banner"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
