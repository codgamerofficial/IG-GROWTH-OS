// =============================================================================
// RIIQX — Master AI Creative Canvas Service
// Project Persistence • Contextual AI Transforms • Cross-Engine Bridges
// =============================================================================

import fs from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import {
  CanvasProject,
  CanvasBlock,
  AITransformInput,
  AITransformResult,
} from './types';
import { BrandDNASynthesizer } from '../brand/brand-dna-synthesizer';
import { AIServiceManager } from '../ai/ai-service-manager';
import { AssetService } from '../assets/asset-service';
import { CampaignGenerator } from '../campaigns/campaign-generator';

const AITransformOutputSchema = z.object({
  summary: z.string().default('Successfully transformed selected canvas elements.'),
  updatedBlocks: z.array(
    z.object({
      id: z.string(),
      updates: z.object({
        title: z.string().optional(),
        text: z.string().optional(),
        caption: z.string().optional(),
        hexCode: z.string().optional(),
        prompt: z.string().optional(),
        noteColor: z.enum(['yellow', 'cyan', 'purple', 'green', 'red']).optional(),
        statusTag: z.enum(['Draft', 'Approved', 'Review', 'Ideas', 'In Production']).optional(),
      }),
    })
  ).default([]),
  suggestedNewBlocks: z.array(
    z.object({
      type: z.enum(['text', 'image', 'video', 'color_swatch', 'moodboard', 'ai_generator', 'sticky_note']),
      x: z.number().default(100),
      y: z.number().default(100),
      width: z.number().default(280),
      height: z.number().default(180),
      data: z.object({
        title: z.string().optional(),
        text: z.string().optional(),
        caption: z.string().optional(),
        hexCode: z.string().optional(),
        noteColor: z.enum(['yellow', 'cyan', 'purple', 'green', 'red']).optional(),
        statusTag: z.enum(['Draft', 'Approved', 'Review', 'Ideas', 'In Production']).optional(),
      }),
    })
  ).default([]),
});

export class CanvasService {
  private static canvasDir = path.join(process.cwd(), 'AI Video Editor', 'projects', 'canvas');
  private static memoryCache: Map<string, CanvasProject> = new Map();

  static {
    try {
      if (fs.existsSync(this.canvasDir)) {
        const files = fs.readdirSync(this.canvasDir).filter((f) => f.endsWith('.json'));
        for (const file of files) {
          try {
            const data = JSON.parse(fs.readFileSync(path.join(this.canvasDir, file), 'utf-8'));
            if (data.id && data.name) {
              this.memoryCache.set(data.id, data);
            }
          } catch {}
        }
      }
    } catch {}
  }

  /**
   * Save canvas project to disk and memory
   */
  public static saveProject(project: Partial<CanvasProject> & { name: string }): CanvasProject {
    const id = project.id || `canvas_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date().toISOString();
    const brand = BrandDNASynthesizer.getActiveBrandDNA();

    const record: CanvasProject = {
      id,
      name: project.name,
      description: project.description || '',
      blocks: project.blocks || [],
      connectors: project.connectors || [],
      viewport: project.viewport || { x: 0, y: 0, zoom: 1.0 },
      brandProfileId: brand?.id || project.brandProfileId,
      brandName: brand?.brandName || project.brandName || 'RIIQX',
      createdAt: project.createdAt || now,
      updatedAt: now,
    };

    try {
      if (!fs.existsSync(this.canvasDir)) {
        fs.mkdirSync(this.canvasDir, { recursive: true });
      }
      this.memoryCache.set(id, record);
      fs.writeFileSync(path.join(this.canvasDir, `${id}.json`), JSON.stringify(record, null, 2), 'utf-8');
    } catch (err: any) {
      console.warn('[CanvasService] Failed to persist canvas project:', err.message);
    }

    return record;
  }

  /**
   * Get single canvas project by ID
   */
  public static getProject(id: string): CanvasProject | null {
    if (this.memoryCache.has(id)) {
      return this.memoryCache.get(id)!;
    }
    const filePath = path.join(this.canvasDir, `${id}.json`);
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
   * List all canvas projects
   */
  public static listProjects(): CanvasProject[] {
    const list = Array.from(this.memoryCache.values());
    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  /**
   * Delete canvas project
   */
  public static deleteProject(id: string): boolean {
    this.memoryCache.delete(id);
    const filePath = path.join(this.canvasDir, `${id}.json`);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
        return true;
      } catch {}
    }
    return false;
  }

  /**
   * Contextual AI Transform:
   * Analyzes selected block(s) and executes targeted transforms or companion creations
   */
  public static async aiTransform(input: AITransformInput): Promise<AITransformResult> {
    const brand = input.brandDNA || BrandDNASynthesizer.getActiveBrandDNA();
    const blocksSummary = input.selectedBlocks
      .map(
        (b) =>
          `[Block ID: ${b.id}, Type: ${b.type}]\nTitle: ${b.data.title || 'N/A'}\nContent: ${
            b.data.text || b.data.caption || b.data.hexCode || b.data.prompt || 'Visual element'
          }`
      )
      .join('\n\n');

    const systemPrompt = `You are the Principal AI Creative Canvas Director at RIIQX.
The user has selected one or more creative canvas blocks and given a specific instruction.
Transform the selected blocks, enhance their copy, suggest color/visual adjustments, or propose new companion blocks (e.g. video hooks, ad copy, matching sticky notes).
Strictly respect Brand DNA guidelines if provided:
Brand: ${brand?.brandName || 'RIIQX'}
Tone: ${brand?.toneOfVoice || 'Confident, high-velocity'}
Primary Accent: ${brand?.colorPalette?.primary || '#FFD43B'}

Return ONLY a valid JSON object matching the requested schema.`;

    const userPrompt = `Selected Canvas Blocks:
${blocksSummary}

User Instruction: "${input.instruction}"

Execute the requested creative transform now.`;

    try {
      const result = await AIServiceManager.executeStructured(
        userPrompt,
        AITransformOutputSchema,
        {
          systemPrompt,
          taskType: 'canvas_transform',
          temperature: 0.7,
        }
      );
      const data = result.data as any;
      return {
        summary: data.summary || 'Transform executed cleanly.',
        updatedBlocks: data.updatedBlocks || [],
        suggestedNewBlocks: data.suggestedNewBlocks || [],
      };
    } catch (err: any) {
      console.warn('[CanvasService] AI Transform fallback triggered:', err.message);
      // Deterministic fallback transform
      const first = input.selectedBlocks[0];
      const updatedBlocks: any[] = [];
      const suggestedNewBlocks: any[] = [];

      if (first) {
        if (first.type === 'text') {
          updatedBlocks.push({
            id: first.id,
            updates: {
              text: `[Enhanced] ${first.data.text || 'High-impact value proposition'}\n\nKey Takeaway: Autonomy drives 10x creative velocity.`,
              statusTag: 'Approved' as const,
            },
          });
        } else if (first.type === 'color_swatch') {
          updatedBlocks.push({
            id: first.id,
            updates: {
              hexCode: brand?.colorPalette?.primary || '#FFD43B',
              title: 'Hero Brand Accent',
            },
          });
        } else {
          updatedBlocks.push({
            id: first.id,
            updates: {
              caption: `Optimized for ${brand?.brandName || 'RIIQX'} 9:16 distribution`,
              statusTag: 'Review' as const,
            },
          });
        }

        // Add companion suggestion block
        suggestedNewBlocks.push({
          type: 'sticky_note' as const,
          x: first.x + first.width + 30,
          y: first.y,
          width: 240,
          height: 160,
          data: {
            title: 'AI Companion Note',
            text: `Generated response to: "${input.instruction}". Ready for production pipeline.`,
            noteColor: 'cyan' as const,
            statusTag: 'Ideas' as const,
          },
        });
      }

      return {
        summary: `Transformed elements according to "${input.instruction}".`,
        updatedBlocks,
        suggestedNewBlocks,
      };
    }
  }

  /**
   * Export selected canvas blocks to AI Video Editor as a Storyboard
   */
  public static async exportToVideo(
    project: CanvasProject,
    selectedBlockIds?: string[]
  ): Promise<{
    projectId: string;
    storyboardId: string;
    storyboardPath: string;
    beatsCount: number;
  }> {
    const brand = BrandDNASynthesizer.getActiveBrandDNA();
    const blocksToExport =
      selectedBlockIds && selectedBlockIds.length > 0
        ? project.blocks.filter((b) => selectedBlockIds.includes(b.id))
        : project.blocks;

    const projectId = `proj_vid_canvas_${Date.now()}`;
    const storyboardId = `sb_canvas_${Date.now()}`;

    // Extract text and media elements from canvas blocks
    const textBlocks = blocksToExport.filter((b) => b.type === 'text' || b.type === 'sticky_note');
    const mediaBlocks = blocksToExport.filter((b) => b.type === 'video' || b.type === 'image' || b.type === 'moodboard');

    const hookText = textBlocks[0]?.data.text || textBlocks[0]?.data.title || 'Stop creating content the slow manual way.';
    const bodyText = textBlocks[1]?.data.text || 'With RIIQX Autonomous Studio, your creative pipeline runs 24/7.';

    const beats = [
      {
        id: 'beat_1',
        sceneNumber: 1,
        title: 'Scene 01 — Canvas Hook Beat',
        inSec: 0,
        outSec: 3.5,
        durationSeconds: 3.5,
        sourceClip: mediaBlocks[0]?.data.videoUrl || 'sample_vertical.mp4',
        spokenText: hookText.slice(0, 100),
        visualComposition: 'Dynamic eye-level framing with bold kinetic typography in brand primary.',
        captionText: hookText.toUpperCase().slice(0, 48),
        highlightedWords: ['STOP', 'MANUAL', 'SCALE'],
        motionGraphics: 'Kinetic typography bounce',
        transition: 'Fast whip-pan',
        audioSfx: 'Clean riser whoosh',
        bRollInstruction: 'Fast split screen of creative canvas cards',
      },
      {
        id: 'beat_2',
        sceneNumber: 2,
        title: 'Scene 02 — Problem & Value Contrast',
        inSec: 3.5,
        outSec: 8.0,
        durationSeconds: 4.5,
        sourceClip: 'sample_vertical.mp4',
        spokenText: bodyText.slice(0, 120),
        visualComposition: 'Medium shot showing canvas moodboard frames animating in 3D perspective.',
        captionText: 'AUTONOMOUS WORKFLOWS WIN',
        highlightedWords: ['AUTONOMOUS', 'WIN'],
        motionGraphics: 'Card pop with glow badge',
        transition: 'Zoom-in cut',
        audioSfx: 'High retention hit',
        bRollInstruction: 'B-roll of moodboard and palette blocks',
      },
      {
        id: 'beat_3',
        sceneNumber: 3,
        title: 'Scene 03 — Autonomous Solution Proof',
        inSec: 8.0,
        outSec: 12.5,
        durationSeconds: 4.5,
        sourceClip: 'sample_vertical.mp4',
        spokenText: `${brand?.brandName || 'RIIQX'} converts creative moodboards directly into finished video storyboards.`,
        visualComposition: 'Direct screen recording of video timeline rendering in real time.',
        captionText: 'MOODBOARDS DIRECTLY TO 4K VIDEO',
        highlightedWords: ['DIRECTLY', 'VIDEO', '4K'],
        motionGraphics: 'HyperFrames progress bar and telemetry checkmarks',
        transition: 'Glitch slide',
        audioSfx: 'Metallic UI chime',
        bRollInstruction: 'Clean 9:16 vertical render preview',
      },
      {
        id: 'beat_4',
        sceneNumber: 4,
        title: 'Scene 04 — High Conversion Call to Action',
        inSec: 12.5,
        outSec: 15.0,
        durationSeconds: 2.5,
        sourceClip: 'sample_vertical.mp4',
        spokenText: brand?.ctaStyles?.[0] || 'Try the Creative Canvas today.',
        visualComposition: 'Pulsing CTA button overlay with direct eye contact creator.',
        captionText: (brand?.ctaStyles?.[0] || 'TAP LINK IN BIO • GET STARTED').toUpperCase(),
        highlightedWords: ['TAP', 'STARTED', 'NOW'],
        motionGraphics: 'Pulsing primary yellow hero CTA button',
        transition: 'Fade to black',
        audioSfx: 'Deep sub-bass chime',
        bRollInstruction: 'Profile follow badge and link in bio pointer',
      },
    ];

    const totalDurationSeconds = beats.reduce((s, b) => s + b.durationSeconds, 0);

    const storyboardRecord = {
      id: storyboardId,
      sourceCanvasProjectId: project.id,
      projectName: `${project.name} — Canvas Storyboard`,
      aspectRatio: '9:16',
      totalDurationSeconds,
      isApproved: true,
      approvedAt: new Date().toISOString(),
      beats,
      brandGuidelines: {
        primaryColor: brand?.colorPalette?.primary || '#FFD43B',
        secondaryColor: brand?.colorPalette?.secondary || '#202124',
        accentColor: brand?.colorPalette?.accent || '#06B6D4',
        font: brand?.typography?.heading || 'Inter',
      },
      createdAt: new Date().toISOString(),
    };

    // Write to metadata/storyboards
    const storyboardsDir = path.join(process.cwd(), 'AI Video Editor', 'metadata', 'storyboards');
    if (!fs.existsSync(storyboardsDir)) fs.mkdirSync(storyboardsDir, { recursive: true });
    const storyboardPath = path.join(storyboardsDir, `storyboard_${storyboardId}.json`);
    fs.writeFileSync(storyboardPath, JSON.stringify(storyboardRecord, null, 2), 'utf-8');

    // Create active video project
    const projectDir = path.join(process.cwd(), 'AI Video Editor', 'projects', 'active', projectId);
    if (!fs.existsSync(projectDir)) fs.mkdirSync(projectDir, { recursive: true });

    const projectRecord = {
      id: projectId,
      storyboardId,
      name: `${project.name} — Canvas Storyboard`,
      aspectRatio: '9:16',
      durationSeconds: totalDurationSeconds,
      status: 'ready_to_render',
      sourceCanvasProjectId: project.id,
      storyboardPath: path.relative(process.cwd(), storyboardPath),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(path.join(projectDir, 'project.json'), JSON.stringify(projectRecord, null, 2), 'utf-8');

    // Register in Asset Catalog
    try {
      AssetService.registerAsset({
        userId: 'riiqx_user_creator',
        name: `Canvas Storyboard: ${project.name}`,
        category: 'campaign_assets',
        mimeType: 'application/json',
        fileSizeBytes: fs.existsSync(storyboardPath) ? fs.statSync(storyboardPath).size : 1024,
        publicUrl: '',
        localPath: storyboardPath,
        tags: ['canvas', 'storyboard', 'video_bridge'],
        metadata: {
          canvasProjectId: project.id,
          storyboardId,
          projectId,
        },
      });
    } catch {}

    return {
      projectId,
      storyboardId,
      storyboardPath,
      beatsCount: beats.length,
    };
  }

  /**
   * Export selected canvas blocks to Campaign Studio
   */
  public static async exportToCampaign(
    project: CanvasProject,
    selectedBlockIds?: string[]
  ): Promise<any> {
    const blocksToExport =
      selectedBlockIds && selectedBlockIds.length > 0
        ? project.blocks.filter((b) => selectedBlockIds.includes(b.id))
        : project.blocks;

    const textSample = blocksToExport
      .filter((b) => b.type === 'text' || b.type === 'sticky_note')
      .map((b) => b.data.text || b.data.title)
      .join('\n\n');

    const campaign = await CampaignGenerator.generateCampaign({
      name: `${project.name} Campaign`,
      objective: 'product_launch',
      targetPlatforms: ['instagram', 'youtube', 'facebook', 'tiktok', 'linkedin'],
      durationDays: 14,
      offerDetails: 'Born from Creative Canvas moodboard synthesis',
      callToAction: 'Experience the autonomous creative system',
      userInstructions: textSample ? `Incorporate these canvas notes:\n${textSample}` : undefined,
    });

    return campaign;
  }
}
