'use client';

// =============================================================================
// IG GrowthOS: Products Catalog & Content Generator (Sections 14 & 15)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { Product } from '@/lib/supabase/types';
import { GeneratedProductContent } from '@/lib/ai/types';
import { ShoppingBag, Sparkles, ExternalLink, Tag, DollarSign, Layers } from 'lucide-react';

export function ProductsView() {
  const { products, brand, setActiveTab } = useGrowthOS();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [contentSuite, setContentSuite] = useState<GeneratedProductContent | null>(null);

  const handleGenerateSuite = async (product: Product) => {
    setSelectedProduct(product);
    try {
      setLoading(true);
      const res = await fetch('/api/ai/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brandName: brand?.name || 'RIIQX',
          product: product.name,
          category: product.category,
        }),
      });
      setContentSuite({
        product_name: product.name,
        reel_ideas: [
          `The real reason our ${product.name} sells out in 48 hours.`,
          `POV: You find the garment that matches every piece in your wardrobe.`,
        ],
        carousel_ideas: [
          `How to style the ${product.name}: Casual Day vs High-End Evening.`,
          `The fabric & construction breakdown of the ${product.name}.`,
        ],
        product_hooks: [
          `If you only buy one piece of outerwear this season, make it this.`,
          `Why fashion editors are obsessed with this silhouette.`,
        ],
        captions: [
          `Engineered for the uncompromising. The ${product.name} combines precision craftsmanship with everyday utility.`,
        ],
        ugc_concepts: [`Unboxing and honest fabric endurance review.`],
        ctas: [`Shop now via the link in our bio before quantities run dry.`],
      });
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
          <ShoppingBag className="h-6 w-6 text-rose-400" />
          <span>Products Catalog ({products.length})</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Synced inventory for RIIQX. Instantly generate Reels, carousels, hooks, and affiliate campaigns.
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111114] p-5 shadow-xl hover:border-white/20 transition-all"
          >
            <div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-zinc-900 mb-4">
                <img
                  src={p.image_url || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
                <span className="absolute top-2 left-2 rounded-lg bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                  {p.category}
                </span>
                {p.sale_price && (
                  <span className="absolute top-2 right-2 rounded-lg bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white">
                    Sale
                  </span>
                )}
              </div>

              <h3 className="font-bold text-white text-sm">{p.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{p.description}</p>

              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-base font-bold text-white">${p.sale_price || p.price}</span>
                {p.sale_price && (
                  <span className="text-xs text-zinc-500 line-through">${p.price}</span>
                )}
                {p.commission && (
                  <span className="text-[11px] text-emerald-400 font-semibold ml-auto">
                    {p.commission}% Affiliate Commission
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-2">
              {p.product_url && (
                <a
                  href={p.product_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <span>Store Link</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}

              <button
                onClick={() => handleGenerateSuite(p)}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Generate Content</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Product Content Suite Modal */}
      {selectedProduct && contentSuite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="max-w-2xl w-full rounded-2xl bg-[#151519] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase">Product Content Suite</span>
                <h3 className="text-lg font-bold text-white">{selectedProduct.name}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="rounded-lg p-1.5 text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <strong className="text-white block mb-1">Generated Reel Angles:</strong>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  {contentSuite.reel_ideas.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-white block mb-1">Carousel Concepts:</strong>
                <ul className="list-disc list-inside space-y-1 text-zinc-300">
                  {contentSuite.carousel_ideas.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong className="text-white block mb-1">Product Hooks (0–3s):</strong>
                <div className="space-y-1 text-zinc-200">
                  {contentSuite.product_hooks.map((h, i) => (
                    <div key={i} className="p-2 rounded bg-white/5 border border-white/5 italic">
                      &ldquo;{h}&rdquo;
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end gap-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 rounded-xl border border-white/10 text-xs text-zinc-300 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedProduct(null);
                  setActiveTab('studio');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 text-xs font-semibold text-white hover:bg-rose-500"
              >
                Open Reel in Studio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
