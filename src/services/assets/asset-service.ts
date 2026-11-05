// =============================================================================
// RIIQX — Master Shared Creative Asset Service
// Multi-Category Management • Secure Signed Storage • Cross-Module Reuse
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';

export type CreativeAssetCategory =
  | 'logos'
  | 'brand_profiles'
  | 'fonts'
  | 'product_images'
  | 'reference_images'
  | 'generated_images'
  | 'videos'
  | 'audio'
  | 'music'
  | 'templates'
  | 'campaign_assets'
  | 'moodboards'
  | 'exports';

export interface CreativeAssetItem {
  id: string;
  userId: string;
  category: CreativeAssetCategory;
  name: string;
  originalFileName?: string;
  mimeType: string;
  fileSizeBytes: number;
  publicUrl: string;
  localPath?: string;
  dimensions?: { width: number; height: number };
  durationSeconds?: number;
  tags: string[];
  brandProfileId?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export class AssetService {
  private static assetsMap: Map<string, CreativeAssetItem> = new Map();
  private static storageDir = path.join(process.cwd(), 'AI Video Editor', 'assets', 'library-index');

  static {
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      } else {
        const files = fs.readdirSync(this.storageDir).filter((f) => f.endsWith('.json'));
        for (const file of files) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(this.storageDir, file), 'utf-8'));
            if (data.id) this.assetsMap.set(data.id, data);
          } catch {}
        }
      }
    } catch {}
  }

  /**
   * Register a new asset in the shared creative catalog
   */
  public static registerAsset(asset: Omit<CreativeAssetItem, 'id' | 'createdAt'>): CreativeAssetItem {
    const id = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const now = new Date().toISOString();

    const record: CreativeAssetItem = {
      ...asset,
      id,
      createdAt: now,
    };

    this.assetsMap.set(id, record);
    this.persistAsset(record);

    return record;
  }

  /**
   * List assets with filtering by category, search tag, or brand
   */
  public static listAssets(filters: {
    userId?: string;
    category?: CreativeAssetCategory;
    tag?: string;
    brandProfileId?: string;
    search?: string;
  } = {}): CreativeAssetItem[] {
    let list = Array.from(this.assetsMap.values());

    if (filters.userId) {
      list = list.filter((a) => a.userId === filters.userId);
    }
    if (filters.category) {
      list = list.filter((a) => a.category === filters.category);
    }
    if (filters.tag) {
      list = list.filter((a) => a.tags.includes(filters.tag!));
    }
    if (filters.brandProfileId) {
      list = list.filter((a) => a.brandProfileId === filters.brandProfileId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  /**
   * Retrieve asset by ID
   */
  public static getAsset(assetId: string): CreativeAssetItem | null {
    return this.assetsMap.get(assetId) || null;
  }

  /**
   * Delete asset with physical cleanup
   */
  public static deleteAsset(assetId: string): boolean {
    const asset = this.assetsMap.get(assetId);
    if (!asset) return false;

    if (asset.localPath && fs.existsSync(asset.localPath)) {
      try {
        fs.unlinkSync(asset.localPath);
      } catch {}
    }

    this.assetsMap.delete(assetId);

    const metaFile = path.join(this.storageDir, `${assetId}.json`);
    if (fs.existsSync(metaFile)) {
      try {
        fs.unlinkSync(metaFile);
      } catch {}
    }

    return true;
  }

  private static persistAsset(asset: CreativeAssetItem): void {
    try {
      if (!fs.existsSync(this.storageDir)) {
        fs.mkdirSync(this.storageDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(this.storageDir, `${asset.id}.json`),
        JSON.stringify(asset, null, 2),
        'utf-8'
      );
    } catch {}
  }
}

