'use client';

// =============================================================================
// PujaHop Kolkata: Emergency Push Notification Bell & Subscription Modal
// Real-Time Kolkata Police Traffic Directives • Weather Radar Warnings
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Check, ShieldCheck, AlertTriangle, X, Radio, Send } from 'lucide-react';

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission);
      if (Notification.permission === 'granted') {
        const stored = localStorage.getItem('pujahop_push_registered');
        if (stored) setIsSubscribed(true);
      }
    }
  }, []);

  const handleSubscribe = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setStatusMsg('Push notifications are not supported in this browser.');
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);

      if (perm === 'granted') {
        // Generate or retrieve persistent web client token
        let webToken = localStorage.getItem('pujahop_web_device_token');
        if (!webToken) {
          webToken = `web_${crypto.randomUUID()}`;
          localStorage.setItem('pujahop_web_device_token', webToken);
        }

        // Register with backend Supabase
        const res = await fetch('/api/notifications/register-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            push_token: webToken,
            platform: 'web',
          }),
        });

        const data = await res.json();
        if (data.success) {
          setIsSubscribed(true);
          localStorage.setItem('pujahop_push_registered', 'true');
          setStatusMsg('✔ Subscribed to Kolkata Police & Emergency Traffic Alerts!');

          // Show immediate test notification
          new Notification('PujaHop Kolkata Alerts Active', {
            body: 'You are now connected to real-time Kolkata Police traffic directives and weather warnings.',
            icon: '/icon',
          });
        } else {
          setStatusMsg(`Registration error: ${data.error}`);
        }
      } else {
        setStatusMsg('Permission was denied. Please allow notifications in browser settings.');
      }
    } catch (err: any) {
      setStatusMsg(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition-all flex items-center justify-center"
        title="Emergency Alerts & Notifications"
        aria-label="Festival Notifications"
      >
        {isSubscribed ? (
          <BellRing className="w-4 h-4 text-emerald-400 animate-pulse" />
        ) : (
          <Bell className="w-4 h-4 text-zinc-400" />
        )}
        {isSubscribed && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#070611]" />
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#121124] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center">
                  <Radio className="w-4 h-4 text-rose-400" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Emergency Broadcasts</h3>
                  <p className="text-[10px] text-zinc-400">Kolkata Police &amp; Weather Telemetry</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <p className="leading-relaxed">
                Stay updated during Durga Puja 2026 with critical live alerts directly on your device:
              </p>

              <div className="space-y-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Lalbazar Traffic Directives</div>
                    <div className="text-[11px] text-zinc-400">
                      Emergency road diversions, flyover closures, and VIP corridor updates.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-white">Crowd Surges &amp; Rain Warnings</div>
                    <div className="text-[11px] text-zinc-400">
                      Immediate warnings when entry queues exceed 90+ minutes or rain arrives.
                    </div>
                  </div>
                </div>
              </div>

              {statusMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-[11px]">
                  {statusMsg}
                </div>
              )}
            </div>

            <div className="pt-2 flex flex-col gap-2">
              {isSubscribed ? (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Push Alerts Active on this Device</span>
                </div>
              ) : (
                <button
                  onClick={handleSubscribe}
                  disabled={loading}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/50 transition-all disabled:opacity-50"
                >
                  <BellRing className="w-4 h-4" />
                  <span>{loading ? 'Connecting to Supabase...' : 'Enable Emergency Push Alerts'}</span>
                </button>
              )}

              <button
                onClick={() => setIsOpen(false)}
                className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white text-xs font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
