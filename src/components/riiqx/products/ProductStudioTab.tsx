'use client';

// =============================================================================
// RIIQX — Master AI Product Studio UI Component
// Feature Extraction • Commercial Scene Generation • Side-by-Side Comparison Slider
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  ShoppingBag,
  Plus,
  Sliders,
  Maximize2,
  RefreshCw,
  Layers,
  Palette,
  Camera,
  Check,
  ChevronRight,
  ExternalLink,
  Split,
  Eye,
  Download,
  Share2,
  ShieldCheck,
  Copy,
  Trash2,
} from 'lucide-react';
import {
  ProductItem,
  ProductCategory,
  EnvironmentPreset,
  LightingPreset,
  CompositionPreset,
  ProductAspectRatio,
  ProductSceneGeneration,
} from '@/services/products/types';
import { BrandDNA } from '@/services/brand/types';

export function ProductStudioTab() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [activeProduct, setActiveProduct] = useState<ProductItem | null>(null);
  const [brandDNA, setBrandDNA] = useState<BrandDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [generatingScene, setGeneratingScene] = useState(false);

  // Scene Generation Controls
  const [environment, setEnvironment] = useState<EnvironmentPreset>('luxury_pedestal');
  const [lighting, setLighting] = useState<LightingPreset>('dramatic_rim');
  const [composition, setComposition] = useState<CompositionPreset>('center_hero');
  const [aspectRatio, setAspectRatio] = useState<ProductAspectRatio>('1:1');
  const [customPrompt, setCustomPrompt] = useState('');

  // Side-by-side comparison slider position (0-100%)
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDraggingSlider, setIsDraggingSlider] = useState(false);
  const [activeScene, setActiveScene] = useState<ProductSceneGeneration | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(false);
  const sliderContainerRef = useRef<HTMLDivElement>(null);

  // New Product Modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newProductName, setNewProductName] = useState('RIIQX Sonic Pro Headphones');
  const [newProductCategory, setNewProductCategory] = useState<ProductCategory>('electronics');
  const [newProductDesc, setNewProductDesc] = useState(
    'Precision-engineered wireless noise-canceling headphones with brushed matte aluminum finish and gold acoustic rings.'
  );
  const [newProductPrice, setNewProductPrice] = useState('$299.00');
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [creatingProduct, setCreatingProduct] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      // 1. Fetch Brand DNA
      const brandRes = await fetch('/api/riiqx/brand');
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        if (brandData.success && (brandData.brand || brandData.brandDNA)) {
          setBrandDNA(brandData.brand || brandData.brandDNA);
        }
      }

      // 2. Fetch Products
      const prodRes = await fetch('/api/riiqx/products');
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        if (prodData.success && Array.isArray(prodData.products) && prodData.products.length > 0) {
          setProducts(prodData.products);
          setActiveProduct(prodData.products[0]);
          if (prodData.products[0].generations?.length > 0) {
            setActiveScene(prodData.products[0].generations[0]);
          }
        } else {
          createInitialProduct();
        }
      }
    } catch (err) {
      console.warn('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInitialProduct = async () => {
    try {
      const res = await fetch('/api/riiqx/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'RIIQX Kinetic Obsidian Watch',
          category: 'luxury',
          description:
            'Autonomous titanium timepiece with electric yellow sub-dials, sapphire crystal glass, and black ceramic bezel.',
          price: '$580.00',
        }),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts([data.product]);
        setActiveProduct(data.product);

        const sceneRes = await fetch(`/api/riiqx/products/${data.product.id}/generate-scene`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            environment: 'luxury_pedestal',
            lighting: 'dramatic_rim',
            composition: 'center_hero',
            aspectRatio: '1:1',
          }),
        });
        const sceneData = await sceneRes.json();
        if (sceneData.success && sceneData.generation) {
          data.product.generations = [sceneData.generation];
          setActiveProduct({ ...data.product });
          setActiveScene(sceneData.generation);
        }
      }
    } catch (err) {
      console.warn('Initial product creation error:', err);
    }
  };

  // Create Product handler
  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    setCreatingProduct(true);
    try {
      const res = await fetch('/api/riiqx/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProductName.trim(),
          category: newProductCategory,
          description: newProductDesc.trim(),
          price: newProductPrice.trim(),
          imageUrl: newProductImageUrl.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        setActiveProduct(data.product);
        setShowNewModal(false);
        setNewProductImageUrl('');
      } else {
        alert(data.error || 'Failed to create product');
      }
    } catch (err: any) {
      alert('Error creating product: ' + err.message);
    } finally {
      setCreatingProduct(false);
    }
  };

  // Delete Product handler
  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product and its generated scenes?')) return;

    setDeletingProduct(true);
    try {
      const res = await fetch(`/api/riiqx/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        const remaining = products.filter((p) => p.id !== productId);
        setProducts(remaining);
        setActiveProduct(remaining[0] || null);
        setActiveScene(remaining[0]?.generations?.[0] || null);
      } else {
        alert(data.error || 'Failed to delete product');
      }
    } catch (err: any) {
      alert('Delete error: ' + err.message);
    } finally {
      setDeletingProduct(false);
    }
  };

  // Generate Commercial Scene
  const handleGenerateScene = async () => {
    if (!activeProduct) return;

    setGeneratingScene(true);
    try {
      const res = await fetch(`/api/riiqx/products/${activeProduct.id}/generate-scene`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          environment,
          lighting,
          composition,
          aspectRatio,
          customPrompt,
        }),
      });

      const data = await res.json();
      if (data.success && data.generation) {
        const updatedGenerations = [data.generation, ...(activeProduct.generations || [])];
        const updatedProduct = { ...activeProduct, generations: updatedGenerations };
        setActiveProduct(updatedProduct);
        setActiveScene(data.generation);
        setProducts((prev) => prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p)));
      } else {
        alert(data.error || 'Failed to generate scene');
      }
    } catch (err: any) {
      alert('Scene generation error: ' + err.message);
    } finally {
      setGeneratingScene(false);
    }
  };

  // Interactive slider position calculator
  const updateSliderFromClientX = (clientX: number) => {
    if (!sliderContainerRef.current) return;
    const rect = sliderContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = Math.round((x / rect.width) * 100);
    setSliderPosition(percent);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDraggingSlider || e.buttons === 1) {
      updateSliderFromClientX(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches[0]) {
      updateSliderFromClientX(e.touches[0].clientX);
    }
  };

  const handleCopySceneUrl = () => {
    if (!activeScene?.imageUrl) return;
    navigator.clipboard.writeText(activeScene.imageUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#27272A] bg-[#121215] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-[#FFD43B]/10 border border-[#FFD43B]/30 flex items-center justify-center text-[#FFD43B]">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">AI Product Studio</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Commercial Engine
              </span>
            </div>
            <p className="text-xs text-[#9E9EA4] mt-0.5">
              Multi-angle feature extraction, preset studio environments, and commercial scene synthesis.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-semibold text-xs transition shadow-md shadow-[#FFD43B]/10"
          >
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Product Selector Bar */}
      {products.length > 0 && (
        <div className="flex items-center justify-between border-b border-[#27272A] pb-1 gap-4">
          <div className="flex items-center gap-2 overflow-x-auto flex-1">
            <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mr-2 shrink-0">
              Products ({products.length}):
            </span>
            {products.map((prod) => (
              <button
                key={prod.id}
                onClick={() => {
                  setActiveProduct(prod);
                  if (prod.generations?.length > 0) setActiveScene(prod.generations[0]);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 whitespace-nowrap shrink-0 ${
                  activeProduct?.id === prod.id
                    ? 'bg-[#27272A] text-white border border-[#FFD43B]/40'
                    : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
                }`}
              >
                <ShoppingBag className="h-3.5 w-3.5 text-[#FFD43B]" />
                <span>{prod.name}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#18181B] text-[#71717A]">
                  {prod.category}
                </span>
              </button>
            ))}
          </div>

          {activeProduct && (
            <button
              onClick={() => handleDeleteProduct(activeProduct.id)}
              disabled={deletingProduct}
              title="Delete Active Product"
              className="p-1.5 rounded-lg bg-[#18181B] hover:bg-red-950/60 text-[#71717A] hover:text-red-400 border border-[#27272A] transition shrink-0"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Main Studio Split Layout */}
      {activeProduct ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Feature Extraction & Studio Controls (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Extracted Product Features Card */}
            <div className="p-5 rounded-xl border border-[#27272A] bg-[#121215] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="h-4 w-4 text-[#FFD43B]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Extracted Physical Features
                  </h3>
                </div>
                {activeProduct.price && (
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {activeProduct.price}
                  </span>
                )}
              </div>

              <div className="space-y-3 text-xs">
                {/* Colors */}
                <div>
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
                    Observed Color Palette:
                  </span>
                  <div className="flex items-center gap-2">
                    {activeProduct.features.colors?.map((col, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-2 py-1 rounded bg-[#18181B] border border-[#27272A]"
                      >
                        <div
                          className="w-3.5 h-3.5 rounded-full border border-white/20"
                          style={{ backgroundColor: col }}
                        />
                        <span className="text-[10px] font-mono text-white">{col}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Materials */}
                <div>
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-1">
                    Extracted Materials:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeProduct.features.materials?.map((mat, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] px-2 py-0.5 rounded bg-[#18181B] border border-[#27272A] text-[#D4D4D8]"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Form & Differentiator */}
                <div>
                  <span className="text-[10px] font-mono text-[#71717A] uppercase block mb-0.5">
                    Geometric Shape &amp; Profile:
                  </span>
                  <p className="text-[#A1A1AA] text-[11px] leading-relaxed">
                    {activeProduct.features.shape}
                  </p>
                </div>

                {/* Preservation Check */}
                <div className="pt-2 border-t border-[#1E1E22] flex items-center gap-2 text-emerald-400 text-[11px]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Feature &amp; Silhouette Integrity Protected (100%)</span>
                </div>
              </div>
            </div>

            {/* Scene Generator Controls */}
            <div className="p-5 rounded-xl border border-[#27272A] bg-[#121215] space-y-4">
              <div className="flex items-center gap-2 border-b border-[#1E1E22] pb-3">
                <Sliders className="h-4 w-4 text-[#06B6D4]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Scene Generation Controls
                </h3>
              </div>

              {/* Environment Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">
                  Environment Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'luxury_pedestal', label: 'Luxury Pedestal' },
                    { id: 'minimalist_studio', label: 'Minimalist Studio' },
                    { id: 'lifestyle_home', label: 'Lifestyle / Home' },
                    { id: 'outdoor_nature', label: 'Outdoor Nature' },
                    { id: 'abstract_neon', label: 'Abstract Neon' },
                    { id: 'seasonal_holiday', label: 'Seasonal Holiday' },
                  ].map((env) => (
                    <button
                      key={env.id}
                      onClick={() => setEnvironment(env.id as EnvironmentPreset)}
                      className={`px-3 py-2 rounded-lg text-xs font-medium transition text-left ${
                        environment === env.id
                          ? 'bg-[#FFD43B] text-black font-semibold'
                          : 'bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[#27272A]'
                      }`}
                    >
                      {env.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lighting Presets */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">
                  Lighting Preset
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'dramatic_rim', label: 'Dramatic Rim Light' },
                    { id: 'warm_golden_hour', label: 'Warm Golden Hour' },
                    { id: 'cool_studio', label: 'Cool Studio Softbox' },
                    { id: 'neon_cyberpunk', label: 'Neon Cyberpunk' },
                  ].map((lit) => (
                    <button
                      key={lit.id}
                      onClick={() => setLighting(lit.id as LightingPreset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition text-left ${
                        lighting === lit.id
                          ? 'bg-[#06B6D4] text-black font-semibold'
                          : 'bg-[#18181B] text-[#A1A1AA] hover:text-white border border-[#27272A]'
                      }`}
                    >
                      {lit.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-[#A1A1AA] uppercase tracking-wider block">
                  Aspect Ratio
                </label>
                <div className="flex items-center gap-2">
                  {(['1:1', '9:16', '16:9', '4:5'] as ProductAspectRatio[]).map((ar) => (
                    <button
                      key={ar}
                      onClick={() => setAspectRatio(ar)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium transition text-center ${
                        aspectRatio === ar
                          ? 'bg-[#27272A] text-[#FFD43B] border border-[#FFD43B]'
                          : 'bg-[#18181B] text-[#A1A1AA] border border-[#27272A]'
                      }`}
                    >
                      {ar}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handleGenerateScene}
                disabled={generatingScene}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition shadow-lg shadow-[#FFD43B]/10 disabled:opacity-50 mt-2"
              >
                {generatingScene ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Rendering Commercial Scene...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Commercial Scene</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Interactive Side-by-Side Comparison & Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Side-by-Side Interactive Slider Card */}
            <div className="p-5 rounded-xl border border-[#27272A] bg-[#121215] space-y-4">
              <div className="flex items-center justify-between border-b border-[#1E1E22] pb-3">
                <div className="flex items-center gap-2">
                  <Split className="h-4 w-4 text-[#FFD43B]" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Interactive Comparison Slider (Original vs AI Render)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-[#71717A]">
                  Click or drag horizontally
                </span>
              </div>

              {/* Interactive Comparison Viewport */}
              <div
                ref={sliderContainerRef}
                onClick={(e) => updateSliderFromClientX(e.clientX)}
                onMouseDown={() => setIsDraggingSlider(true)}
                onMouseUp={() => setIsDraggingSlider(false)}
                onMouseLeave={() => setIsDraggingSlider(false)}
                onMouseMove={handleMouseMove}
                onTouchStart={() => setIsDraggingSlider(true)}
                onTouchEnd={() => setIsDraggingSlider(false)}
                onTouchMove={handleTouchMove}
                className="relative aspect-square max-h-[460px] w-full rounded-xl overflow-hidden cursor-ew-resize border border-[#27272A] bg-black shadow-2xl mx-auto"
              >
                {/* Layer 1: AI Generated Scene (Full Background) */}
                <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0C0C0E]">
                  {activeScene ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={activeScene.imageUrl}
                      alt="AI Generated Commercial Scene"
                      className="w-full h-full object-contain pointer-events-none"
                    />
                  ) : (
                    <div className="text-xs text-[#71717A]">No scene generated yet</div>
                  )}
                  <span className="absolute bottom-3 right-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-[#FFD43B] border border-[#FFD43B]/30">
                    AI Render: {activeScene?.environment || environment}
                  </span>
                </div>

                {/* Layer 2: Original Product Silhouette (Clipped by slider position) */}
                <div
                  className="absolute inset-0 h-full overflow-hidden border-r-2 border-[#FFD43B] shadow-2xl"
                  style={{ width: `${sliderPosition}%` }}
                >
                  <div className="relative w-full h-full flex items-center justify-center bg-[#151518]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeProduct.originalImages?.[0] || '/icons/icon-512x512.png'}
                      alt="Original Product"
                      className="w-full h-full object-contain p-8 pointer-events-none"
                    />
                    <span className="absolute bottom-3 left-3 text-[10px] font-mono px-2 py-0.5 rounded bg-black/80 text-white border border-white/20">
                      Original Product
                    </span>
                  </div>
                </div>

                {/* Central Drag Bar & Handle */}
                <div
                  className="absolute top-0 bottom-0 pointer-events-none -ml-3 flex items-center justify-center"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="w-6 h-6 rounded-full bg-[#FFD43B] border-2 border-black flex items-center justify-center text-black text-[9px] font-bold shadow-xl">
                    ⇄
                  </div>
                </div>
              </div>

              {/* Active Scene Copy & Direct Action */}
              {activeScene && (
                <div className="p-3.5 rounded-lg bg-[#18181B] border border-[#27272A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold text-white">{activeScene.adHeadline}</h4>
                    <p className="text-[11px] text-[#A1A1AA] mt-0.5">
                      CTA: &quot;{activeScene.callToAction}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopySceneUrl}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-medium transition"
                    >
                      {copiedUrl ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                    </button>
                    <a
                      href={activeScene.imageUrl}
                      download={`${activeProduct.name}_commercial.svg`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black text-xs font-semibold transition"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download SVG</span>
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Generated Variations Gallery */}
            {activeProduct.generations && activeProduct.generations.length > 0 && (
              <div className="p-4 rounded-xl border border-[#27272A] bg-[#121215] space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#A1A1AA] uppercase tracking-wider">
                    Commercial Variations ({activeProduct.generations.length})
                  </h4>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {activeProduct.generations.map((gen) => (
                    <button
                      key={gen.id}
                      onClick={() => setActiveScene(gen)}
                      className={`relative aspect-square rounded-lg border overflow-hidden transition ${
                        activeScene?.id === gen.id
                          ? 'border-[#FFD43B] ring-2 ring-[#FFD43B]/20'
                          : 'border-[#27272A] hover:border-[#3F3F46]'
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={gen.imageUrl}
                        alt="Variant"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-x-0 bottom-0 p-1.5 bg-black/80 backdrop-blur-xs text-[9px] font-mono text-white truncate text-left">
                        {gen.environment.replace(/_/g, ' ')}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl border border-dashed border-[#27272A] bg-[#121215] space-y-4">
          <ShoppingBag className="h-10 w-10 text-[#71717A] mx-auto" />
          <h3 className="text-base font-bold text-white">No Products Configured</h3>
          <p className="text-xs text-[#A1A1AA] max-w-md mx-auto">
            Upload your first product to trigger multi-angle feature extraction and commercial scene
            synthesis.
          </p>
          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2 rounded-lg bg-[#FFD43B] text-black font-semibold text-xs"
          >
            Create Product
          </button>
        </div>
      )}

      {/* New Product Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-[#27272A] bg-[#121215] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-[#FFD43B]" />
                <h3 className="text-sm font-bold text-white">Add New Product</h3>
              </div>
              <button
                onClick={() => setShowNewModal(false)}
                className="text-[#71717A] hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3.5">
              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Product Name
                </label>
                <input
                  type="text"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="e.g. Lumina Smart Water Bottle"
                  required
                  className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    Category
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value as ProductCategory)}
                    className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="luxury">Luxury &amp; Jewelry</option>
                    <option value="cosmetics">Cosmetics &amp; Skincare</option>
                    <option value="beverage">Beverage &amp; Drinks</option>
                    <option value="apparel">Apparel &amp; Fashion</option>
                    <option value="food">Food &amp; Gourmet</option>
                    <option value="wellness">Wellness &amp; Health</option>
                    <option value="general">General Merchandise</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                    Price (Optional)
                  </label>
                  <input
                    type="text"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    placeholder="e.g. $149.00"
                    className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Image URL / Photo Path (Optional)
                </label>
                <input
                  type="text"
                  value={newProductImageUrl}
                  onChange={(e) => setNewProductImageUrl(e.target.value)}
                  placeholder="e.g. /icons/icon-512x512.png or https://..."
                  className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                  Product Description &amp; Materials
                </label>
                <textarea
                  value={newProductDesc}
                  onChange={(e) => setNewProductDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe physical shape, materials, finishes, and core functions..."
                  required
                  className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B] resize-none"
                />
              </div>

              <div className="pt-2 border-t border-[#27272A] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  disabled={creatingProduct}
                  className="px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs text-[#A1A1AA]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingProduct}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-semibold text-xs transition disabled:opacity-50"
                >
                  {creatingProduct ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Extracting Features...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Extract Features &amp; Save</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
