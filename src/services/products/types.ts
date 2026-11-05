// =============================================================================
// RIIQX — Master AI Product Studio Types
// Multi-Angle Inputs • Feature Extraction • Environment Presets • Commercial Renders
// =============================================================================

export type ProductCategory =
  | 'cosmetics'
  | 'beverage'
  | 'electronics'
  | 'apparel'
  | 'food'
  | 'luxury'
  | 'wellness'
  | 'general';

export type EnvironmentPreset =
  | 'minimalist_studio'
  | 'lifestyle_home'
  | 'outdoor_nature'
  | 'luxury_pedestal'
  | 'seasonal_holiday'
  | 'abstract_neon';

export type LightingPreset =
  | 'warm_golden_hour'
  | 'cool_studio'
  | 'dramatic_rim'
  | 'soft_diffused'
  | 'neon_cyberpunk';

export type CompositionPreset =
  | 'center_hero'
  | 'rule_of_thirds'
  | 'flat_lay'
  | 'floating_dynamic'
  | 'macro_detail';

export type ProductAspectRatio = '1:1' | '9:16' | '16:9' | '4:5';

export interface ProductFeatures {
  colors: string[];
  materials: string[];
  shape: string;
  textOnProduct?: string;
  keyDifferentiator?: string;
}

export interface ProductSceneGeneration {
  id: string;
  productId: string;
  environment: EnvironmentPreset;
  lighting: LightingPreset;
  composition: CompositionPreset;
  aspectRatio: ProductAspectRatio;
  prompt: string;
  imageUrl: string;
  originalImageUrl: string;
  adHeadline?: string;
  callToAction?: string;
  createdAt: string;
}

export interface ProductItem {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price?: string;
  originalImages: string[];
  processedImages: string[];
  features: ProductFeatures;
  generations: ProductSceneGeneration[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductInput {
  name: string;
  category: ProductCategory;
  description: string;
  price?: string;
  imageUrl?: string;
}

export interface GenerateSceneInput {
  productId: string;
  environment: EnvironmentPreset;
  lighting: LightingPreset;
  composition: CompositionPreset;
  aspectRatio: ProductAspectRatio;
  customPrompt?: string;
}
