'use client';

// =============================================================================
// BANZA — Footer
// Clean Minimal Typography • Brand Heritage • Legal Disclosures
// =============================================================================

import React from 'react';
import { ShieldCheck, Heart } from 'lucide-react';

export function BanzaFooter() {
  return (
    <footer className="border-t border-[#EAE3D9] dark:border-[#26262B] bg-[#FAF8F5] dark:bg-[#0E0E10] py-14 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black tracking-tight text-[#1A1817] dark:text-white font-heading">
                banza
              </span>
              <span className="h-2 w-2 rounded-full bg-[#FF5722]" />
            </div>
            <p className="text-xs text-[#6B6661] dark:text-[#A3A3A3] max-w-sm leading-relaxed">
              Your personal AI Twin. Helping consumers make smarter, unbiased buying decisions with real-time price arbitrage and card discount stacking.
            </p>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Independent Consumer Advocate • Zero Seller Bribes</span>
            </div>
          </div>

          {/* Links Cols */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1817] dark:text-white mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6661] dark:text-[#A3A3A3]">
              <li>AI Twin Copilot</li>
              <li>Price Arbitrage Engine</li>
              <li>Bank Card Stack</li>
              <li>Dark Pattern Guard</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1817] dark:text-white mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6661] dark:text-[#A3A3A3]">
              <li>Tech &amp; Electronics</li>
              <li>Skincare &amp; Beauty</li>
              <li>Sneakers &amp; Apparel</li>
              <li>Home Appliances</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A1817] dark:text-white mb-3">
              Company
            </h4>
            <ul className="space-y-2 text-xs text-[#6B6661] dark:text-[#A3A3A3]">
              <li>About Banza</li>
              <li>Buyer Bill of Rights</li>
              <li>Privacy Architecture</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-[#EAE3D9] dark:border-[#26262B] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9E9E9E]">
          <div>
            &copy; {new Date().getFullYear()} Banza Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-[#6B6661] dark:text-[#A3A3A3]">
            <span>Finally an algorithm on your side.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

