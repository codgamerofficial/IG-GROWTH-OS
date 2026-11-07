'use client';

// =============================================================================
// RIIQX — Hyperlocal Online vs Offline Store Arbitrage Card
// Ultra-Modern Trending Obsidian Glassmorphic Design System
// Powered by Carto Basemaps • In-Store POS Cashback • Zero Simulation
// =============================================================================

import React, { useState } from 'react';
import {
  MapPin,
  Navigation,
  Clock,
  CreditCard,
  Building2,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  TrendingDown,
  Phone,
  Zap,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { HyperlocalArbitrageReport, PhysicalStoreLocation } from '@/services/product-intelligence/types';

interface Props {
  report: HyperlocalArbitrageReport;
  onRefreshCity?: (city: string) => void;
  isLoading?: boolean;
}

export function HyperlocalArbitrageCard({ report, onRefreshCity, isLoading }: Props) {
  const [selectedStoreId, setSelectedStoreId] = useState<string>(
    report.bestOfflineOffer?.storeId || report.offlineStores[0]?.storeId || ''
  );

  const selectedStore =
    report.offlineStores.find((s) => s.storeId === selectedStoreId) ||
    report.bestOfflineOffer ||
    report.offlineStores[0];

  const quickCities = ['Kolkata', 'Bengaluru', 'Mumbai', 'Delhi', 'Hyderabad'];

  const isOfflineCheaper = report.arbitrageVerdict === 'offline_wins_cheaper';
  const isOfflineFaster = report.arbitrageVerdict === 'offline_wins_faster';

  return (
    <div className="rounded-3xl border border-white/[0.08] bg-zinc-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
      {/* 1. Header with City Pills */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-orange-500/10 border border-orange-500/20 text-orange-400">
              <MapPin className="w-4 h-4" />
            </span>
            <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-black">
              Carto GIS Hyperlocal Arbitrage
            </span>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              Live POS Feeds Active
            </span>
          </div>
          <h3 className="text-xl font-black text-white tracking-tight">
            Online vs Nearby Physical Store Arbitrage
          </h3>
          <p className="text-xs text-zinc-400">
            Cross-comparing {report.onlineLowestRetailer} delivery with electronics retailers in{' '}
            <span className="text-white font-semibold">{report.userCity}</span> ({report.userPincode})
          </p>
        </div>

        {/* Quick City Switcher */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] text-zinc-500 font-mono mr-1">City:</span>
          {quickCities.map((c) => (
            <button
              key={c}
              onClick={() => onRefreshCity?.(c)}
              disabled={isLoading}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                report.userCity.toLowerCase() === c.toLowerCase()
                  ? 'bg-orange-500 text-white shadow-xs shadow-orange-500/20'
                  : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/[0.06]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Arbitrage Head-to-Head Banner */}
      <div
        className={`rounded-2xl p-5 border relative overflow-hidden transition-all ${
          isOfflineCheaper
            ? 'bg-gradient-to-br from-emerald-950/40 via-zinc-900/60 to-zinc-950/80 border-emerald-500/30'
            : isOfflineFaster
            ? 'bg-gradient-to-br from-amber-950/40 via-zinc-900/60 to-zinc-950/80 border-amber-500/30'
            : 'bg-gradient-to-br from-blue-950/40 via-zinc-900/60 to-zinc-950/80 border-blue-500/30'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Online Price Column */}
          <div className="space-y-1">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
              Online Lowest Delivered
            </span>
            <div className="text-2xl font-black text-zinc-200">
              ₹{report.onlineLowestDeliveredPrice.toLocaleString('en-IN')}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {report.onlineLowestRetailer} • ~{report.onlineDeliveryDays} Days Shipping
              </span>
            </div>
          </div>

          {/* Arbitrage Verdict Badge (Center) */}
          <div className="text-center py-2 px-4 rounded-xl bg-black/40 border border-white/[0.08] backdrop-blur-md">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-1">
              Arbitrage Recommendation
            </span>
            <div className="text-xs font-black uppercase tracking-tight">
              {isOfflineCheaper && (
                <span className="text-emerald-400 flex items-center justify-center gap-1">
                  <TrendingDown className="w-4 h-4" /> Save ₹
                  {report.savingsAmountRupees.toLocaleString('en-IN')} In Store
                </span>
              )}
              {isOfflineFaster && (
                <span className="text-amber-400 flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4" /> Zero-Wait Same Day Pickup
                </span>
              )}
              {!isOfflineCheaper && !isOfflineFaster && (
                <span className="text-blue-400 flex items-center justify-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Online Order Recommended
                </span>
              )}
            </div>
            <p className="text-[10px] text-zinc-300 mt-1 leading-relaxed">
              {report.recommendationReason}
            </p>
          </div>

          {/* Physical Store Price Column */}
          {report.bestOfflineOffer && (
            <div className="space-y-1 md:text-right">
              <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider block">
                Best Nearby Store Net Price
              </span>
              <div className="text-2xl font-black text-emerald-400">
                ₹{report.bestOfflineOffer.netInStorePayablePrice.toLocaleString('en-IN')}
              </div>
              <div className="flex items-center md:justify-end gap-1.5 text-xs text-zinc-400">
                <Navigation className="w-3.5 h-3.5 text-orange-400" />
                <span>
                  {report.bestOfflineOffer.chainName} • {report.bestOfflineOffer.distanceKm} km away (
                  {report.bestOfflineOffer.drivingMinutes}m drive)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. Carto GIS Radar Minimap & Store Pinboard */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Radar Map Visualizer (2 Cols) */}
        <div className="lg:col-span-2 rounded-2xl border border-white/[0.08] bg-zinc-950/80 p-4 relative overflow-hidden flex flex-col justify-between min-h-[300px]">
          {/* Carto Dark Matter Background Indicator */}
          <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Radar Circles Visual */}
          <div className="relative flex-1 flex items-center justify-center my-4">
            {/* Outer Ring (15km) */}
            <div className="w-56 h-56 rounded-full border border-zinc-800 flex items-center justify-center relative">
              <span className="absolute top-1 text-[8px] font-mono text-zinc-600">15 km</span>

              {/* Mid Ring (10km) */}
              <div className="w-40 h-40 rounded-full border border-zinc-700/60 flex items-center justify-center relative">
                <span className="absolute top-1 text-[8px] font-mono text-zinc-500">10 km</span>

                {/* Inner Ring (5km) */}
                <div className="w-24 h-24 rounded-full border border-orange-500/30 flex items-center justify-center relative bg-orange-500/5">
                  <span className="absolute top-1 text-[8px] font-mono text-orange-400">5 km</span>

                  {/* User Center Pin */}
                  <div className="w-4 h-4 rounded-full bg-orange-500 shadow-md shadow-orange-500/50 flex items-center justify-center animate-pulse">
                    <div className="w-1.5 h-1.5 rounded-full bg-white" />
                  </div>
                </div>
              </div>

              {/* Pulsing Store Pins on concentric rings */}
              {report.offlineStores.map((store, idx) => {
                const angle = (idx * (360 / report.offlineStores.length) * Math.PI) / 180;
                const radiusPx = Math.min(100, Math.max(30, store.distanceKm * 7));
                const x = Math.cos(angle) * radiusPx;
                const y = Math.sin(angle) * radiusPx;
                const isSelected = store.storeId === selectedStore?.storeId;

                return (
                  <button
                    key={store.storeId}
                    onClick={() => setSelectedStoreId(store.storeId)}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className={`absolute p-1.5 rounded-full transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/50 scale-125 z-10'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:scale-110'
                    }`}
                    title={`${store.chainName} (${store.distanceKm} km)`}
                  >
                    <Building2 className="w-3 h-3" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 border-t border-white/[0.06] pt-3">
            <span>Powered by Carto Dark Matter GIS</span>
            <span>Radius: {report.searchRadiusKm} km</span>
          </div>
        </div>

        {/* Selected Store Detailed Audit (3 Cols) */}
        <div className="lg:col-span-3 space-y-4">
          {/* Store Selection Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {report.offlineStores.map((store) => (
              <button
                key={store.storeId}
                onClick={() => setSelectedStoreId(store.storeId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  store.storeId === selectedStore?.storeId
                    ? 'bg-white text-zinc-950 shadow-md font-black'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/[0.06]'
                }`}
              >
                {store.chainName} • {store.distanceKm} km
              </button>
            ))}
          </div>

          {/* Store Details Card */}
          {selectedStore && (
            <div className="rounded-2xl border border-white/[0.08] bg-zinc-950/90 p-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-black text-white">{selectedStore.chainName}</h4>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      In Stock
                    </span>
                    {selectedStore.badge && (
                      <span className="text-[10px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                        {selectedStore.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-0.5">{selectedStore.branchName}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{selectedStore.address}</p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase block">
                    Net In-Store Cost
                  </span>
                  <span className="text-xl font-black text-emerald-400">
                    ₹{selectedStore.netInStorePayablePrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-zinc-500 line-through block">
                    Base: ₹{selectedStore.storePrice.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* POS Terminal Cashback Offers */}
              {selectedStore.posTerminalCashback.length > 0 && (
                <div className="rounded-xl bg-zinc-900/80 border border-white/[0.06] p-3 space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-300">
                    <CreditCard className="w-3.5 h-3.5 text-orange-400" />
                    <span>In-Store POS Terminal Instant Swipe Cashback:</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedStore.posTerminalCashback.map((pos, idx) => (
                      <div
                        key={idx}
                        className="rounded-lg bg-black/40 border border-white/[0.04] p-2 flex items-center justify-between"
                      >
                        <span className="text-[11px] text-zinc-300">{pos.bankName}</span>
                        <span className="text-[11px] font-mono font-bold text-emerald-400">
                          -₹{pos.instantCashbackRupees.toLocaleString('en-IN')} ({pos.terminalProvider})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Manager Discount Callout */}
              {selectedStore.managerDiscountPotentialRupees > 0 && (
                <div className="flex items-center gap-2 text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    In-Store Manager Spot Coupon: Ask sales rep for price-match to unlock up to ₹
                    {selectedStore.managerDiscountPotentialRupees.toLocaleString('en-IN')} bill-buster
                    deduction.
                  </span>
                </div>
              )}

              {/* Open Box / Display Unit Alert */}
              {selectedStore.openBoxAlternativeAvailable && selectedStore.openBoxPriceRupees && (
                <div className="flex items-center justify-between text-xs text-zinc-300 bg-zinc-900/60 border border-white/[0.06] rounded-xl px-3 py-2">
                  <span>Open-box / showroom demo unit available at this branch:</span>
                  <span className="font-mono font-bold text-orange-400">
                    ₹{selectedStore.openBoxPriceRupees.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              {/* Action Buttons: Directions & Call */}
              <div className="flex items-center gap-3 pt-2">
                <a
                  href={selectedStore.directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5" />
                  <span>Get Driving Directions ({selectedStore.drivingMinutes} mins)</span>
                  <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                </a>

                {selectedStore.phone && (
                  <a
                    href={`tel:${selectedStore.phone}`}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/[0.08] text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Call Store</span>
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

