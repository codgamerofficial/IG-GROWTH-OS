// =============================================================================
// RIIQX — Master AI Creative Canvas Types
// Infinite Pan/Zoom • 7 Block Types • Dynamic Connectors • Contextual AI
// =============================================================================

export type CanvasBlockType =
  | 'text'
  | 'image'
  | 'video'
  | 'color_swatch'
  | 'moodboard'
  | 'ai_generator'
  | 'sticky_note';

export type AspectRatioPreset = '9:16' | '16:9' | '1:1' | '4:5';

export type StickyNoteColor = 'yellow' | 'cyan' | 'purple' | 'green' | 'red';

export type BlockStatusTag = 'Draft' | 'Approved' | 'Review' | 'Ideas' | 'In Production';

export interface CanvasBlockData {
  title?: string;
  text?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  imageUrl?: string;
  videoUrl?: string;
  aspectRatio?: AspectRatioPreset;
  caption?: string;
  hexCode?: string;
  paletteName?: string;
  paletteColors?: string[];
  images?: Array<{ id: string; url: string; caption?: string }>;
  prompt?: string;
  model?: string;
  generatedResult?: string;
  noteColor?: StickyNoteColor;
  statusTag?: BlockStatusTag;
  tags?: string[];
}

export interface CanvasBlock {
  id: string;
  type: CanvasBlockType;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
  data: CanvasBlockData;
  selected?: boolean;
}

export interface CanvasConnector {
  id: string;
  fromBlockId: string;
  toBlockId: string;
  label?: string;
  color?: string;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasProject {
  id: string;
  name: string;
  description?: string;
  blocks: CanvasBlock[];
  connectors: CanvasConnector[];
  viewport: CanvasViewport;
  brandProfileId?: string;
  brandName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AITransformInput {
  instruction: string;
  selectedBlocks: CanvasBlock[];
  brandDNA?: any;
}

export interface AITransformResult {
  summary: string;
  updatedBlocks: Array<{
    id: string;
    updates: Partial<CanvasBlockData>;
  }>;
  suggestedNewBlocks?: Array<Omit<CanvasBlock, 'id' | 'zIndex'>>;
}

