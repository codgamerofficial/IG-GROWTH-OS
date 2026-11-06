'use client';

// =============================================================================
// BANZA — Savings Calculator Section
// "The right product, The right price, The right way to pay."
// Live Payment Stacking • Bank Card Arbitrage • Total Savings Counter (₹27,000)
// =============================================================================

import React, { useState } from 'react';
import { CreditCard, Tag, ArrowRight, ShieldCheck, CheckCircle2, TrendingDown } from 'lucide-react';

export function BanzaSavingsCalculator({ onLaunchTwin }: { onLaunchTwin: (q?: string) => void }) {
  const [selectedProduct, setSelectedProduct] = useState<'earbuds' | 'airfryer' | 'sneakers'>('earbuds');

  const products = {
    earbuds: {
      name: 'OnePlus Buds Pro 2 Wireless ANC Earbuds',
      mrp: 11999,
      baseListed: 7999,
      cheapestPlatform: 'Amazon India',
      bankOfferName: 'HDFC Bank Credit Card 10% Instant Off',
      bankDiscount: 800,
      twinArbitrage: 320,
      finalPrice: 6879,
      totalSaved: 5120,
    },
    airfryer: {
      name: 'Philips Digital Air Fryer 4.1L with Rapid Air Tech',
      mrp: 9995,
      baseListed: 6499,
      cheapestPlatform: 'Flipkart',
      bankOfferName: 'SBI Credit Card ₹750 Instant Discount',
      bankDiscount: 750,
      twinArbitrage: 250,
      finalPrice: 5499,
      totalSaved: 4496,
    },
    sneakers: {
      name: 'Nike Air Max SC Leather Daily Commuter Shoes',
      mrp: 6795,
      baseListed: 4899,
      cheapestPlatform: 'Myntra',
      bankOfferName: 'ICICI Bank 10% Festive Code',
      bankDiscount: 500,
      twinArbitrage: 271,
      finalPrice: 4128,
      totalSaved: 2667,
    },
  };

  const curr = products[selectedProduct];

  return (
    <section className="py-20 border-t border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#0E0E10] transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-[#FF5722]/20 bg-[#FF5722]/10 px-3.5 py-1 text-xs font-bold text-[#FF5722]">
            <span>THE 3-TIER SHOPPING FORMULA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
            The right product, <br className="hidden sm:inline" />
            The right price, <br className="hidden sm:inline" />
            <span className="text-[#FF5722]">The right way to pay.</span>
          </h2>
          <p className="text-sm sm:text-base text-[#6B6661] dark:text-[#A3A3A3]">
            Finding the item is only half the battle. Your Twin compares 6+ retailers, tracks price history, and stacks hidden bank card offers to unlock the true floor price.
          </p>

          {/* Product Selector */}
          <div className="flex flex-wrap justify-center gap-2 pt-4">
            {(['earbuds', 'airfryer', 'sneakers'] as const).map((key) => (
              <button
                key={key}
                onClick={() => setSelectedProduct(key)}
                className={`rounded-full px-4 py-2 text-xs font-bold capitalize transition-all ${
                  selectedProduct === key
                    ? 'bg-[#FF5722] text-white shadow-xs'
                    : 'bg-white dark:bg-[#1A1A1E] text-[#6B6661] dark:text-[#A3A3A3] border border-[#EAE3D9] dark:border-[#26262B] hover:text-[#FF5722]'
                }`}
              >
                {key === 'earbuds' ? 'OnePlus Earbuds' : key === 'airfryer' ? 'Philips Air Fryer' : 'Nike Air Max'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Stacking Breakdown Card (Matching Screenshot) */}
        <div className="mt-12 max-w-4xl mx-auto rounded-[32px] border border-[#EAE3D9] dark:border-[#26262B] bg-white dark:bg-[#18181C] p-6 sm:p-10 shadow-xl space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] dark:border-[#26262B] pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#FF5722]">
                Active Price Arbitrage
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#1A1817] dark:text-white mt-1">
                {curr.name}
              </h3>
              <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] mt-0.5">
                Cheapest listed platform: <span className="font-bold text-[#1A1817] dark:text-white">{curr.cheapestPlatform}</span>
              </p>
            </div>

            {/* Total Saved Badge */}
            <div className="sm:text-right">
              <span className="text-xs font-bold text-[#6B6661] dark:text-[#A3A3A3]">Total Saved by Twin</span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
                ₹{curr.totalSaved.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Stacking Ladder */}
          <div className="space-y-4">
            
            {/* Step 1: Base Price */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141418] border border-[#EAE3D9] dark:border-[#26262B]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#1A1817] dark:bg-white text-white dark:text-[#1A1817] flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1817] dark:text-white">Base Listed Price across 6 Platforms</div>
                  <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">Filtered out overpriced marketplace resellers</div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-[#1A1817] dark:text-white">₹{curr.baseListed.toLocaleString()}</span>
                <span className="text-xs text-[#9E9E9E] line-through block">₹{curr.mrp.toLocaleString()}</span>
              </div>
            </div>

            {/* Step 2: Bank Offer */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141418] border border-[#EAE3D9] dark:border-[#26262B]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#FF5722] text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1817] dark:text-white flex items-center gap-2">
                    <CreditCard className="h-3.5 w-3.5 text-[#FF5722]" />
                    {curr.bankOfferName}
                  </div>
                  <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">Automatically matched with your wallet cards</div>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                -₹{curr.bankDiscount.toLocaleString()}
              </span>
            </div>

            {/* Step 3: Twin Arbitrage & Coupons */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF8F5] dark:bg-[#141418] border border-[#EAE3D9] dark:border-[#26262B]">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div>
                  <div className="text-xs font-bold text-[#1A1817] dark:text-white flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-emerald-600" />
                    Banza Arbitrage &amp; Auto-Applied Vouchers
                  </div>
                  <div className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">Merchant tokenized savings &amp; gift balance</div>
                </div>
              </div>
              <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                -₹{curr.twinArbitrage.toLocaleString()}
              </span>
            </div>

          </div>

          {/* Final Floor Price Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-[#FFFDF9] dark:bg-[#202024] border-2 border-[#FF5722]">
            <div>
              <span className="text-xs font-bold text-[#6B6661] dark:text-[#A3A3A3]">Final Floor Price You Pay</span>
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-black text-[#FF5722]">
                  ₹{curr.finalPrice.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {Math.round((curr.totalSaved / curr.mrp) * 100)}% Cheaper than Retail MRP
                </span>
              </div>
            </div>

            <button
              onClick={() => onLaunchTwin(`Show me best offers on ${curr.name}`)}
              className="flex items-center justify-center gap-2 rounded-full bg-[#FF5722] hover:bg-[#E64A19] text-white px-6 py-3 text-xs font-black shadow-md transition-all active:scale-95"
            >
              <span>Unlock This Deal With Twin</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {/* Average User Savings Counter (Matches Screenshot ₹27,000) */}
          <div className="pt-4 border-t border-[#EAE3D9] dark:border-[#26262B] text-center">
            <span className="text-xs text-[#6B6661] dark:text-[#A3A3A3]">Average Year 1 Consumer Savings</span>
            <div className="text-3xl sm:text-5xl font-black text-[#1A1817] dark:text-white mt-1">
              ₹27,000
            </div>
            <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] mt-1">
              Calculated across tech, beauty, fashion, and home appliances.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}
