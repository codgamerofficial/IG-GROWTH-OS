'use client';

// =============================================================================
// PujaHop Kolkata: PWA Service Worker Registration & Offline Network Monitor
// Detects cellular congestion during Durga Puja and displays offline mode banner
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export function PWARegister() {
  const [isOffline, setIsOffline] = useState(false);
  const [justReconnected, setJustReconnected] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('[PujaHop PWA] Service worker registered with scope:', registration.scope);
          })
          .catch((err) => {
            console.warn('[PujaHop PWA] Service worker registration failed:', err);
          });
      });
    }

    // 2. Online / Offline Listeners
    const handleOnline = () => {
      setIsOffline(false);
      setJustReconnected(true);
      const timer = setTimeout(() => setJustReconnected(false), 4000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOffline(true);
      setJustReconnected(false);
    };

    // Set initial status
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline && !justReconnected) return null;

  return (
    <div className="fixed top-14 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none animate-in slide-in-from-top duration-300">
      {isOffline ? (
        <div className="pointer-events-auto max-w-lg w-full bg-[#1A1128]/95 backdrop-blur-md border border-amber-500/40 text-amber-200 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <span>Festival Crowd Offline Mode</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 uppercase">Active</span>
              </div>
              <div className="text-[11px] text-zinc-300">
                Cellular connection weak. Using locally cached pandals, routes, and emergency SOS.
              </div>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-[11px] font-bold flex items-center gap-1 shrink-0 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="pointer-events-auto max-w-lg w-full bg-emerald-950/90 backdrop-blur-md border border-emerald-500/40 text-emerald-200 px-4 py-2 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs animate-in fade-in">
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div>
            <span className="font-bold text-white">Back Online:</span> Network connectivity restored. Live crowd &amp; traffic sync active.
          </div>
        </div>
      )}
    </div>
  );
}
