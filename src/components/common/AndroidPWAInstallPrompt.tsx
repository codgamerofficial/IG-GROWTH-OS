'use client';

// =============================================================================
// PujaHop Kolkata: Android PWA Install Experience
// Captures `beforeinstallprompt` on Android Chrome/Edge/Samsung Internet
// Seamless 1-tap Android Native WebApp Installation with Haptics & Offline Caching
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Smartphone, Download, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function AndroidPWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [isInstalledJustNow, setIsInstalledJustNow] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    // 1. Check if already installed / standalone
    if (typeof window !== 'undefined') {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone === true;
      setIsStandalone(isStandaloneMode);

      // Check localStorage for dismissal
      const dismissedUntil = localStorage.getItem('pujahop_android_install_dismissed');
      if (dismissedUntil && Number(dismissedUntil) > Date.now()) {
        setIsDismissed(true);
      }
    }

    // 2. Listen for Android Chrome beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // 3. Listen for successful app installation
    const handleAppInstalled = () => {
      setIsInstalledJustNow(true);
      setDeferredPrompt(null);
      setIsStandalone(true);
      setTimeout(() => setIsInstalledJustNow(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    // Tactile haptic feedback
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([15, 40, 15]);
      } catch (_) {}
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        setIsInstalledJustNow(true);
        setTimeout(() => setIsInstalledJustNow(false), 4000);
      }
      setDeferredPrompt(null);
    } else {
      // Browser didn't expose prompt or on other Android browser
      setShowInstructions(true);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    // Remember dismissal for 24 hours
    localStorage.setItem('pujahop_android_install_dismissed', String(Date.now() + 24 * 60 * 60 * 1000));
  };

  // Do not show if already running in standalone Android WebApp mode or dismissed
  if (isStandalone && !isInstalledJustNow) return null;
  if (isDismissed && !isInstalledJustNow) return null;

  return (
    <>
      {isInstalledJustNow ? (
        <div className="fixed top-16 left-4 right-4 z-50 max-w-md mx-auto p-4 rounded-2xl bg-emerald-950/95 border border-emerald-500/40 text-emerald-200 shadow-2xl flex items-center gap-3 backdrop-blur-md animate-in slide-in-from-top">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div className="text-xs">
            <p className="font-bold text-white">PujaHop Installed on Android!</p>
            <p className="text-emerald-300/90">Find PujaHop on your Home Screen with offline maps.</p>
          </div>
        </div>
      ) : (
        <div className="fixed bottom-20 lg:bottom-6 left-4 right-4 z-40 max-w-md mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#170E24] via-[#1F1026] to-[#120E22] border border-amber-500/30 p-3.5 shadow-2xl shadow-black/80 backdrop-blur-xl">
            {/* Ambient Festive Rim Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between gap-3 relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-amber-500/40 shadow-md">
                  <Image
                    src="/icon-192.png"
                    alt="PujaHop Android Emblem"
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-white text-xs tracking-tight truncate">
                      PujaHop Kolkata
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase shrink-0">
                      Android WebApp
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300 truncate mt-0.5">
                    Install for offline maps, GPS passport &amp; zero lag
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleInstallClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-rose-950/50 active:scale-95 transition-all"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>INSTALL</span>
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1 rounded-lg text-zinc-400 hover:text-white transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* In-Browser Fallback Instructions Drawer */}
            {showInstructions && (
              <div className="mt-3 pt-3 border-t border-white/10 text-[11px] text-zinc-300 space-y-1.5 animate-in fade-in">
                <p className="font-semibold text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  <span>How to install in your Android Browser:</span>
                </p>
                <ol className="list-decimal list-inside space-y-0.5 text-zinc-300 text-[10px]">
                  <li>Tap the browser menu <strong className="text-white">(⋮ or Share)</strong></li>
                  <li>Select <strong className="text-amber-300">&quot;Install app&quot;</strong> or <strong className="text-amber-300">&quot;Add to Home screen&quot;</strong></li>
                  <li>Confirm installation to get the full native standalone experience!</li>
                </ol>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
