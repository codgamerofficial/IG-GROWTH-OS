'use client';

// =============================================================================
// PujaHop Kolkata: Crowd Pulse & Queue Wait-Time Tracker (Phase 24)
// Geodesic GPS verification • Real-time queue telemetry • Ground reporting
// =============================================================================

import React, { useState } from 'react';
import { Pandal, CrowdLevel } from '@/lib/types/pujahop';
import { calculateDistanceMeters } from '@/lib/utils/exif';
import {
  X,
  Users,
  Clock,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  CheckCircle2,
  Send,
  Radio,
} from 'lucide-react';

interface CrowdPulseModalProps {
  pandal: Pandal;
  isOpen: boolean;
  onClose: () => void;
  onReportSubmitted?: () => void;
}

export function CrowdPulseModal({ pandal, isOpen, onClose, onReportSubmitted }: CrowdPulseModalProps) {
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel>('MODERATE');
  const [waitMinutes, setWaitMinutes] = useState(35);
  const [notes, setNotes] = useState('');
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [gpsDistance, setGpsDistance] = useState<number | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAcquireGps = () => {
    setIsLocating(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserCoords({ lat, lng });
        const dist = calculateDistanceMeters(lat, lng, pandal.lat, pandal.lng);
        setGpsDistance(dist);
        setIsLocating(false);
      },
      (err) => {
        setGpsError('Unable to retrieve GPS coordinates: ' + err.message);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/crowd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pandal_id: pandal.id,
          crowd_level: crowdLevel,
          wait_time_minutes: waitMinutes,
          user_lat: userCoords?.lat,
          user_lng: userCoords?.lng,
          notes,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        if (onReportSubmitted) onReportSubmitted();
        setTimeout(() => {
          setSubmitSuccess(false);
          onClose();
        }, 1800);
      } else {
        alert('Failed to submit report: ' + (data.error || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error submitting crowd report: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isGpsVerified = gpsDistance !== null && gpsDistance <= 600;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0F0D20] border border-amber-500/30 shadow-2xl p-6 md:p-8 space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 text-rose-400 text-xs font-bold tracking-wide uppercase">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Live Crowd Pulse & Darshan Telemetry</span>
          </div>
          <h2 className="text-xl md:text-2xl font-extrabold text-white mt-1">{pandal.name}</h2>
          <p className="text-xs text-amber-300 font-medium">{pandal.name_bn} • {pandal.area}</p>
        </div>

        {submitSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3 animate-in zoom-in-95">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-lg font-bold text-white">Crowd Telemetry Logged!</h3>
            <p className="text-xs text-emerald-200">
              Thank you for updating the Kolkata darshan community. Your wait time estimate has been published to live route planners.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* GPS Proximity Check Card */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>On-Site Ground Verification</span>
                </span>
                {isGpsVerified ? (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Verified On-Site
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400">Optional for Telemetry</span>
                )}
              </div>

              {gpsDistance !== null ? (
                <div
                  className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                    isGpsVerified
                      ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border border-amber-500/20 text-amber-300'
                  }`}
                >
                  <span className="font-medium">
                    {isGpsVerified
                      ? `🎯 Verified GPS: ${gpsDistance}m from Pandal gate`
                      : `📍 Location detected: ${Math.round(gpsDistance / 1000)}km away (Remote Report)`}
                  </span>
                  <button
                    type="button"
                    onClick={handleAcquireGps}
                    className="text-[10px] underline hover:text-white"
                  >
                    Refresh
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleAcquireGps}
                  disabled={isLocating}
                  className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-zinc-200 font-semibold flex items-center justify-center gap-2 transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isLocating ? 'Acquiring GPS Satellite Lock...' : 'Verify My GPS Location On-Site'}</span>
                </button>
              )}

              {gpsError && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3 flex-shrink-0" />
                  <span>{gpsError}</span>
                </p>
              )}
            </div>

            {/* Crowd Level Buttons */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-300 block">Current Darshan Density:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'LOW', label: 'Brisk / Low', hint: '<20 min wait', color: 'emerald' },
                  { id: 'MODERATE', label: 'Moderate', hint: '20-45 min wait', color: 'amber' },
                  { id: 'HIGH', label: 'Heavy Queue', hint: '45-75 min wait', color: 'rose' },
                  { id: 'EXTREME', label: 'Surge / Crush', hint: '75+ min wait', color: 'purple' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setCrowdLevel(item.id as CrowdLevel);
                      if (item.id === 'LOW') setWaitMinutes(15);
                      else if (item.id === 'MODERATE') setWaitMinutes(35);
                      else if (item.id === 'HIGH') setWaitMinutes(60);
                      else if (item.id === 'EXTREME') setWaitMinutes(90);
                    }}
                    className={`p-2.5 rounded-xl text-left border transition-all ${
                      crowdLevel === item.id
                        ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg'
                        : 'bg-white/5 border-white/10 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.label}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{item.hint}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Wait Time Slider */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-zinc-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Estimated Queue Wait Time:</span>
                </span>
                <span className="text-sm font-black text-amber-400">{waitMinutes} Minutes</span>
              </div>
              <input
                type="range"
                min="5"
                max="180"
                step="5"
                value={waitMinutes}
                onChange={(e) => setWaitMinutes(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-zinc-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-zinc-500">
                <span>5 min (Walk-in)</span>
                <span>60 min (Standard)</span>
                <span>180 min (Peak Ashtami)</span>
              </div>
            </div>

            {/* Ground Notes Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-300 block">
                Ground Notes & Gate Tips (Optional):
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. VIP gate moving fast, queue extends to main road, heavy rain delay..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#121124] border border-white/10 text-white text-xs placeholder:text-zinc-600 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-950/40 transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? 'Transmitting Telemetry...' : 'Publish Live Queue Report'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
