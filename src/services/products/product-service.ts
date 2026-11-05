// =============================================================================
// RIIQX — Master AI Product Studio Service
// Feature Extraction • Environment Synthesis • Commercial Renders • Asset Sync
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import {
  ProductItem,
  CreateProductInput,
  GenerateSceneInput,
  ProductSceneGeneration,
  ProductFeatures,
} from './types';
import { BrandDNASynthesizer } from '../brand/brand-dna-synthesizer';
import { AIServiceManager } from '../ai/ai-service-manager';
import { AssetService } from '../assets/asset-service';

const ProductFeatureExtractionSchema = z.object({
  colors: z.array(z.string()).default(['#1E293B', '#FFD43B', '#FFFFFF']),
  materials: z.array(z.string()).default(['Matte Polycarbonate', 'Brushed Aluminum', 'Glass']),
  shape: z.string().default('Sleek ergonomic cylinder with rounded corners'),
  textOnProduct: z.string().optional().default('RIIQX CORE'),
  keyDifferentiator: z.string().default('High-precision autonomous intelligence unit'),
});

const SceneCopySchema = z.object({
  adHeadline: z.string().default('Engineered for Flawless Performance'),
  callToAction: z.string().default('Order Now • Limited Early Batch'),
  scenePromptDescription: z.string().default('Hyper-realistic commercial studio shot on obsidian pedestal.'),
});

export class ProductService {
  private static productsDir = path.join(process.cwd(), 'AI Video Editor', 'projects', 'products');
  private static uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'products');
  private static memoryCache: Map<string, ProductItem> = new Map();

  static {
    try {
      if (fs.existsSync(this.productsDir)) {
        const files = fs.readdirSync(this.productsDir).filter((f) => f.endsWith('.json'));
        for (const file of files) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(this.productsDir, file), 'utf-8'));
            if (data.id && data.name) {
              this.memoryCache.set(data.id, data);
            }
          } catch {}
        }
      }
    } catch {}
  }

  /**
   * Create a new product and extract physical features
   */
  public static async createProduct(input: CreateProductInput): Promise<ProductItem> {
    const id = `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const systemPrompt = `You are a Principal Industrial Designer and Creative Director at RIIQX.
Extract physical design attributes (colors, materials, geometric shape, text, differentiator) from the product name and description.
Return ONLY valid JSON matching the schema.`;

    const userPrompt = `Product Name: ${input.name}
Category: ${input.category}
Description: ${input.description}
Price: ${input.price || 'N/A'}`;

    let features: ProductFeatures;

    try {
      const res = await AIServiceManager.executeStructured(
        userPrompt,
        ProductFeatureExtractionSchema,
        {
          systemPrompt,
          taskType: 'product_concept',
          temperature: 0.6,
        }
      );
      features = (res.data as any) || this.buildFallbackFeatures(input);
    } catch (err: any) {
      console.warn('[ProductService] AI feature extraction fallback triggered:', err.message);
      features = this.buildFallbackFeatures(input);
    }

    const initialImage = input.imageUrl || '/icons/icon-512x512.png';

    const product: ProductItem = {
      id,
      name: input.name,
      category: input.category,
      description: input.description,
      price: input.price,
      originalImages: [initialImage],
      processedImages: [initialImage],
      features,
      generations: [],
      createdAt: now,
      updatedAt: now,
    };

    this.persistProduct(product);
    return product;
  }

  /**
   * Synthesize a commercial scene with environment, lighting & composition presets
   */
  public static async generateScene(input: GenerateSceneInput): Promise<ProductSceneGeneration> {
    const product = this.getProduct(input.productId);
    if (!product) throw new Error(`Product not found: ${input.productId}`);

    const brand = BrandDNASynthesizer.getActiveBrandDNA();
    const sceneId = `scene_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();

    const systemPrompt = `You are an elite E-Commerce Creative Director at RIIQX.
Craft a punchy ad headline, high-conversion CTA, and detailed visual scene description for a commercial product shoot.`;

    const userPrompt = `Product: ${product.name} (${product.category})
Key Feature: ${product.features.keyDifferentiator || product.description}
Materials: ${product.features.materials.join(', ')}
Environment Preset: ${input.environment}
Lighting Preset: ${input.lighting}
Composition: ${input.composition}
Brand Voice: ${brand?.toneOfVoice || 'Confident, high performance'}
${input.customPrompt ? `Creator Prompt: ${input.customPrompt}` : ''}`;

    let adHeadline = 'Engineered for Flawless Performance';
    let callToAction = 'Order Now • Limited Launch Release';

    try {
      const res = await AIServiceManager.executeStructured(
        userPrompt,
        SceneCopySchema,
        {
          systemPrompt,
          taskType: 'product_concept',
          temperature: 0.7,
        }
      );
      if (res.data) {
        adHeadline = (res.data as any).adHeadline || adHeadline;
        callToAction = (res.data as any).callToAction || callToAction;
      }
    } catch {}

    // Generate physical SVG commercial render
    const imageUrl = this.renderCommercialSceneSvg({
      sceneId,
      productName: product.name,
      category: product.category,
      environment: input.environment,
      lighting: input.lighting,
      aspectRatio: input.aspectRatio,
      adHeadline,
      callToAction,
      primaryColor: brand?.colorPalette.primary || '#FFD43B',
      accentColor: brand?.colorPalette.accent || '#06B6D4',
    });

    const generation: ProductSceneGeneration = {
      id: sceneId,
      productId: product.id,
      environment: input.environment,
      lighting: input.lighting,
      composition: input.composition,
      aspectRatio: input.aspectRatio,
      prompt: `${input.environment} scene with ${input.lighting} lighting in ${input.composition} framing`,
      imageUrl,
      originalImageUrl: product.originalImages[0] || '/icons/icon-512x512.png',
      adHeadline,
      callToAction,
      createdAt: now,
    };

    product.generations.unshift(generation);
    product.updatedAt = now;
    this.persistProduct(product);

    // Register in shared creative asset catalog
    try {
      AssetService.registerAsset({
        userId: 'riiqx_user_creator',
        name: `Product Render: ${product.name} (${input.environment})`,
        category: 'product_images',
        mimeType: 'image/svg+xml',
        fileSizeBytes: 2048,
        publicUrl: imageUrl,
        tags: ['product_studio', product.category, input.environment, input.lighting],
        metadata: {
          productId: product.id,
          sceneId,
          environment: input.environment,
          lighting: input.lighting,
          headline: adHeadline,
        },
      });
    } catch {}

    return generation;
  }

  /**
   * Get single product by ID
   */
  public static getProduct(id: string): ProductItem | null {
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id)!;
    }
    const filePath = path.join(this.productsDir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        this.memoryCache.set(id, data);
        return data;
      } catch {}
    }
    return null;
  }

  /**
   * List all products
   */
  public static listProducts(): ProductItem[] {
    const list = Array.from(this.memoryCache.values());
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Delete product
   */
  public static deleteProduct(id: string): boolean {
    this.memoryCache.delete(id);
    const filePath = path.join(this.productsDir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        return true;
      } catch {}
    }
    return false;
  }

  /**
   * Persist product to disk
   */
  private static persistProduct(product: ProductItem): void {
    try {
      if (!fs.existsSync(this.productsDir)) {
        fs.mkdirSync(this.productsDir, { recursive: true });
      }
      this.memoryCache.set(product.id, product);
      fs.writeFileSync(path.join(this.productsDir, `${product.id}.json`), JSON.stringify(product, null, 2), 'utf-8');
    } catch (err: any) {
      console.warn('[ProductService] Failed to persist product:', err.message);
    }
  }

  /**
   * Fallback feature builder
   */
  private static buildFallbackFeatures(input: CreateProductInput): ProductFeatures {
    return {
      colors: ['#0C0C0E', '#FFD43B', '#1E293B', '#FFFFFF'],
      materials: ['Matte Polycarbonate', 'Brushed Aluminum', 'Satin Finish Coating'],
      shape: 'Sleek monolithic form with rounded edges',
      textOnProduct: input.name.toUpperCase().slice(0, 16),
      keyDifferentiator: 'High-precision performance and autonomous efficiency',
    };
  }

  /**
   * Renders a real commercial scene SVG asset saved to public/uploads/products/
   */
  private static renderCommercialSceneSvg(options: {
    sceneId: string;
    productName: string;
    category: string;
    environment: string;
    lighting: string;
    aspectRatio: string;
    adHeadline: string;
    callToAction: string;
    primaryColor: string;
    accentColor: string;
  }): string {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
    }

    const width = options.aspectRatio === '9:16' ? 540 : options.aspectRatio === '16:9' ? 960 : 600;
    const height = options.aspectRatio === '9:16' ? 960 : options.aspectRatio === '16:9' ? 540 : 600;

    const bgGradient =
      options.environment === 'abstract_neon'
        ? `url(#neonGrad)`
        : options.environment === 'luxury_pedestal'
        ? `url(#luxuryGrad)`
        : options.environment === 'outdoor_nature'
        ? `url(#natureGrad)`
        : `url(#studioGrad)`;

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}">
  <defs>
    <linearGradient id="studioGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B" />
      <stop offset="50%" stop-color="#0C0C0E" />
      <stop offset="100%" stop-color="#000000" />
    </linearGradient>
    <linearGradient id="luxuryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2D1F0E" />
      <stop offset="50%" stop-color="#12100E" />
      <stop offset="100%" stop-color="#050505" />
    </linearGradient>
    <linearGradient id="neonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E082E" />
      <stop offset="50%" stop-color="#0A0B1A" />
      <stop offset="100%" stop-color="#020308" />
    </linearGradient>
    <linearGradient id="natureGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F2415" />
      <stop offset="50%" stop-color="#0B140E" />
      <stop offset="100%" stop-color="#050705" />
    </linearGradient>
    <linearGradient id="pedestalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#27272A" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#121215" stop-opacity="0.95" />
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="12" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Canvas -->
  <rect width="100%" height="100%" fill="${bgGradient}" />

  <!-- Atmospheric Glow -->
  <circle cx="${width / 2}" cy="${height * 0.45}" r="${width * 0.35}" fill="${options.primaryColor}" opacity="0.12" filter="url(#glow)" />

  <!-- Pedestal / Floor Stage -->
  <ellipse cx="${width / 2}" cy="${height * 0.7}" rx="${width * 0.38}" ry="${height * 0.12}" fill="url(#pedestalGrad)" stroke="#3F3F46" stroke-width="1.5" />
  <ellipse cx="${width / 2}" cy="${height * 0.7}" rx="${width * 0.32}" ry="${height * 0.08}" fill="#0C0C0E" opacity="0.6" />

  <!-- Central Product Silhouette & Emblem -->
  <rect x="${width / 2 - 80}" y="${height * 0.3}" width="160" height="220" rx="24" fill="#18181B" stroke="${options.primaryColor}" stroke-width="2" filter="url(#glow)" />
  <rect x="${width / 2 - 70}" y="${height * 0.32}" width="140" height="196" rx="16" fill="#121215" />
  
  <!-- Product Hologram Ring -->
  <circle cx="${width / 2}" cy="${height * 0.45}" r="38" fill="none" stroke="${options.accentColor}" stroke-width="3" stroke-dasharray="6,4" />
  <circle cx="${width / 2}" cy="${height * 0.45}" r="18" fill="${options.primaryColor}" opacity="0.9" />

  <!-- Product Labels -->
  <text x="${width / 2}" y="${height * 0.38}" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="14" font-weight="bold" text-anchor="middle" letter-spacing="2">
    ${options.productName.toUpperCase().slice(0, 18)}
  </text>
  <text x="${width / 2}" y="${height * 0.54}" fill="${options.accentColor}" font-family="monospace" font-size="10" text-anchor="middle" letter-spacing="1">
    ${options.category.toUpperCase()} • ${options.lighting.replace('_', ' ').toUpperCase()}
  </text>

  <!-- Commercial Header & CTA Overlay -->
  <text x="${width / 2}" y="${height * 0.12}" fill="#FFFFFF" font-family="Inter, sans-serif" font-size="${width > 600 ? 22 : 18}" font-weight="800" text-anchor="middle">
    ${options.adHeadline}
  </text>

  <!-- CTA Badge Button -->
  <rect x="${width / 2 - 120}" y="${height * 0.86}" width="240" height="42" rx="21" fill="${options.primaryColor}" />
  <text x="${width / 2}" y="${height * 0.86 + 26}" fill="#000000" font-family="Inter, sans-serif" font-size="12" font-weight="bold" text-anchor="middle" letter-spacing="1">
    ${options.callToAction.toUpperCase()}
  </text>

  <!-- Telemetry Watermark -->
  <text x="${width - 16}" y="${height - 14}" fill="#71717A" font-family="monospace" font-size="9" text-anchor="end">
    RIIQX AI PRODUCT STUDIO • ${options.environment}
  </text>
</svg>`;

    const fileName = `${options.sceneId}.svg`;
    const filePath = path.join(this.uploadsDir, fileName);
    fs.writeFileSync(filePath, svgContent, 'utf-8');

    return `/uploads/products/${fileName}`;
  }
}
