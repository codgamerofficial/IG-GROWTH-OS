// =============================================================================
// RIIQX — Global Unified Search API
// Searches Across Assets, Campaigns, Canvases, Products, Workflows & Brand Profiles
// =============================================================================

import { NextResponse } from 'next/server';
import { AssetService } from '@/services/assets/asset-service';
import { CampaignGenerator } from '@/services/campaigns/campaign-generator';
import { CanvasService } from '@/services/canvas/canvas-service';
import { ProductService } from '@/services/products/product-service';
import { WorkflowEngine } from '@/services/workflows/workflow-engine';
import { BrandDNASynthesizer } from '@/services/brand/brand-dna-synthesizer';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').toLowerCase().trim();

    const assets = AssetService.listAssets();
    const campaigns = CampaignGenerator.listCampaigns();
    const canvases = CanvasService.listProjects();
    const products = ProductService.listProducts();
    const workflows = WorkflowEngine.listWorkflows();
    const brand = BrandDNASynthesizer.getActiveBrandDNA();

    if (!query) {
      return NextResponse.json({
        success: true,
        query: '',
        counts: {
          assets: assets.length,
          campaigns: campaigns.length,
          canvases: canvases.length,
          products: products.length,
          workflows: workflows.length,
          hasBrand: !!brand,
        },
        results: {
          assets: assets.slice(0, 10),
          campaigns: campaigns.slice(0, 5),
          canvases: canvases.slice(0, 5),
          products: products.slice(0, 5),
          workflows: workflows.slice(0, 5),
          brand,
        },
      });
    }

    // Filter by query
    const filteredAssets = assets.filter(
      (a) =>
        a.name.toLowerCase().includes(query) ||
        a.tags.some((t) => t.toLowerCase().includes(query)) ||
        a.category.toLowerCase().includes(query)
    );

    const filteredCampaigns = campaigns.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.objective.toLowerCase().includes(query) ||
        c.strategyOverview.toLowerCase().includes(query)
    );

    const filteredCanvases = canvases.filter(
      (cv) => cv.name.toLowerCase().includes(query) || cv.description?.toLowerCase().includes(query)
    );

    const filteredProducts = products.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
    );

    const filteredWorkflows = workflows.filter(
      (w) => w.name.toLowerCase().includes(query) || w.description.toLowerCase().includes(query)
    );

    const brandMatches =
      brand &&
      (brand.brandName.toLowerCase().includes(query) ||
        brand.tagline.toLowerCase().includes(query) ||
        brand.industry.toLowerCase().includes(query))
        ? brand
        : null;

    const totalMatches =
      filteredAssets.length +
      filteredCampaigns.length +
      filteredCanvases.length +
      filteredProducts.length +
      filteredWorkflows.length +
      (brandMatches ? 1 : 0);

    return NextResponse.json({
      success: true,
      query,
      totalMatches,
      results: {
        assets: filteredAssets,
        campaigns: filteredCampaigns,
        canvases: filteredCanvases,
        products: filteredProducts,
        workflows: filteredWorkflows,
        brand: brandMatches,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Global search failed' },
      { status: 500 }
    );
  }
}

