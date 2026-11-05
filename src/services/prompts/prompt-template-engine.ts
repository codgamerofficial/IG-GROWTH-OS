// =============================================================================
// RIIQX — Master Prompt Template & Versioning Engine
// Reusable Templates • Variable Interpolation • Brand-Aware Context Injection
// =============================================================================

export interface PromptTemplateDefinition {
  id: string;
  version: number;
  description: string;
  requiredVariables: string[];
  systemPrompt: string;
  userPromptTemplate: string;
}

export class PromptTemplateEngine {
  private static templates: Map<string, PromptTemplateDefinition> = new Map();

  static {
    // 1. BRAND DNA SYNTHESIS TEMPLATE
    this.register({
      id: 'BRAND_DNA_SYNTHESIS',
      version: 1,
      description: 'Converts raw website scrape and assets into structured Brand DNA',
      requiredVariables: ['brandName', 'scrapedContent'],
      systemPrompt: `You are the Principal Brand Architect of RIIQX. Analyze the business content and generate an authoritative, structured Brand DNA profile.
Return a valid JSON object matching:
{
  "brandName": string,
  "tagline": string,
  "mission": string,
  "industry": string,
  "targetAudience": string,
  "customerPersonas": string[],
  "brandPersonality": string[],
  "toneOfVoice": string,
  "coreMessages": string[],
  "colorPalette": {
    "primary": string,
    "secondary": string,
    "accent": string,
    "background": string,
    "neutral": string
  },
  "typography": {
    "heading": string,
    "body": string,
    "code": string
  },
  "visualRules": string[],
  "doNotUseRules": string[]
}`,
      userPromptTemplate: `Business Name: {{brandName}}
Target URL: {{websiteUrl}}
Extracted Content:
{{scrapedContent}}

Generate the authoritative Brand DNA profile now in pure JSON format.`,
    });

    // 2. CAMPAIGN STRATEGY & CONTENT PILLARS
    this.register({
      id: 'CAMPAIGN_STRATEGY',
      version: 1,
      description: 'Generates a cross-platform marketing strategy and content pillars',
      requiredVariables: ['brandName', 'objective', 'platforms', 'callToAction'],
      systemPrompt: `You are an elite Creative Director & Performance Marketing Strategist.
Design an authentic, high-impact marketing campaign brief grounded in the provided Brand DNA.`,
      userPromptTemplate: `Brand: {{brandName}}
Campaign Objective: {{objective}}
Target Platforms: {{platforms}}
Key Offer / Message: {{offer}}
Call To Action: {{callToAction}}
Language: {{language}}
Tone: {{tone}}

Brand Guidelines Context:
- Tone of Voice: {{brandTone}}
- Core Values: {{brandPersonality}}
- Color Palette: {{brandPalette}}

Generate:
1. High-level Campaign Strategic Narrative
2. 4 Core Content Pillars
3. Recommended Platform Content Breakdown (Instagram Reels, YouTube Shorts, Facebook, LinkedIn)
4. Key Performance Indicators`,
    });

    // 3. PLATFORM-SPECIFIC CREATIVE BRIEF
    this.register({
      id: 'PLATFORM_CREATIVE_BRIEF',
      version: 1,
      description: 'Generates platform-tailored scripts, hooks, captions, and visual instructions',
      requiredVariables: ['platform', 'topic', 'brandName'],
      systemPrompt: `You are a viral social media scriptwriter and creative producer for RIIQX.
Generate platform-native content with maximum audience retention and high conversion hooks.`,
      userPromptTemplate: `Platform: {{platform}}
Topic / Angle: {{topic}}
Brand: {{brandName}}
Audience: {{targetAudience}}

Format requirements:
- Opening 3-second hook (visual + audio)
- 3 core value beats
- Closing CTA
- Platform-optimized caption with relevant hashtags
- Exact visual b-roll and text overlay instructions`,
    });

    // 4. CREATIVE CANVAS CONTEXTUAL TRANSFORM
    this.register({
      id: 'CANVAS_CONTEXTUAL_TRANSFORM',
      version: 1,
      description: 'Transforms selected canvas blocks based on user prompt and block context',
      requiredVariables: ['selectedBlockData', 'userInstruction'],
      systemPrompt: `You are the AI Creative Canvas Assistant for RIIQX.
You receive structured context about the currently selected canvas blocks and the user instruction.
Transform the concept, suggest visual alterations, or generate accompanying copy.`,
      userPromptTemplate: `Selected Block Type: {{blockType}}
Selected Block Content:
{{selectedBlockData}}

User Instruction: "{{userInstruction}}"

Return a JSON object with:
{
  "transformationSummary": string,
  "updatedData": object,
  "suggestedNewBlocks": array
}`,
    });

    // 5. PRODUCT STUDIO CONCEPT
    this.register({
      id: 'PRODUCT_STUDIO_CONCEPT',
      version: 1,
      description: 'Generates advertising photoshoot concepts preserving product characteristics',
      requiredVariables: ['productName', 'conceptPreset'],
      systemPrompt: `You are a high-end commercial photographer and 3D visual director.
Plan a brand-consistent photoshoot scene for a physical product while strictly preserving logo, packaging, and label integrity.`,
      userPromptTemplate: `Product Name: {{productName}}
Product Description: {{productDescription}}
Concept Preset: {{conceptPreset}}
Brand Palette: {{brandPalette}}

Generate:
1. Exact Lighting Setup (Key, Fill, Rim)
2. Background Environment Description
3. Surface Texture & Props
4. AI Image Generation Prompt (for Flux/SDXL with negative prompts protecting logo/text)`,
    });

    // 6. WORKFLOW NLP SYNTHESIZER
    this.register({
      id: 'WORKFLOW_NLP_SYNTHESIZER',
      version: 1,
      description: 'Translates a natural language automation request into an executable node graph',
      requiredVariables: ['userRequest'],
      systemPrompt: `You are the RIIQX Workflow Graph Architect.
Convert natural language automation requests into a structured directed graph of predefined nodes.
Allowed node types:
- TRIGGER: schedule, webhook, manual, file_uploaded
- AI: text_generation, research, summarization, image_generation, transcription
- LOGIC: condition, branch, filter, loop
- ACTION: save_asset, update_project, post_to_queue, call_api

Return a valid JSON object matching:
{
  "workflowName": string,
  "description": string,
  "trigger": { "type": string, "config": object },
  "nodes": [
    { "id": string, "name": string, "type": string, "category": string, "config": object }
  ],
  "edges": [
    { "from": string, "to": string }
  ]
}`,
      userPromptTemplate: `User Request: "{{userRequest}}"

Synthesize an executable node graph in pure JSON now.`,
    });
  }

  /**
   * Register a new or updated prompt template
   */
  public static register(def: PromptTemplateDefinition): void {
    this.templates.set(def.id, def);
  }

  /**
   * Render a prompt template with variable interpolation and optional Brand DNA injection
   */
  public static render(
    templateId: string,
    variables: Record<string, any>,
    brandContext?: Record<string, any>
  ): { systemPrompt: string; userPrompt: string; version: number } {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Prompt template '${templateId}' not found in registry.`);
    }

    // Merge brand variables if supplied
    const mergedVars: Record<string, any> = { ...variables };
    if (brandContext) {
      mergedVars.brandName = mergedVars.brandName || brandContext.brandName || 'RIIQX Brand';
      mergedVars.brandTone = mergedVars.brandTone || brandContext.toneOfVoice || 'Professional & Modern';
      mergedVars.brandPersonality =
        mergedVars.brandPersonality ||
        (Array.isArray(brandContext.brandPersonality)
          ? brandContext.brandPersonality.join(', ')
          : 'Innovative, Bold');
      mergedVars.brandPalette =
        mergedVars.brandPalette ||
        (brandContext.colorPalette ? JSON.stringify(brandContext.colorPalette) : '#FFD43B Yellow, #0C0C0E Dark');
    }

    let userPrompt = template.userPromptTemplate;
    for (const [key, value] of Object.entries(mergedVars)) {
      const placeholder = new RegExp(`{{${key}}}`, 'g');
      userPrompt = userPrompt.replace(placeholder, typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value));
    }

    // Clean up any remaining unset placeholders
    userPrompt = userPrompt.replace(/{{[A-Za-z0-9_]+}}/g, 'N/A');

    return {
      systemPrompt: template.systemPrompt,
      userPrompt,
      version: template.version,
    };
  }

  /**
   * Retrieve list of all registered templates
   */
  public static listTemplates(): Array<{ id: string; version: number; description: string }> {
    return Array.from(this.templates.values()).map((t) => ({
      id: t.id,
      version: t.version,
      description: t.description,
    }));
  }
}

