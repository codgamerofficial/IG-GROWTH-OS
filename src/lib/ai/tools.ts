// =============================================================================
// IG GrowthOS: Bedrock Converse API Tool Definitions & Dispatcher (Section 25)
// =============================================================================

import { Tool } from '@aws-sdk/client-bedrock-runtime';
import { repository } from '../supabase/repository';
import { instagramService } from '../instagram/service';

export const bedrockTools: Tool[] = [
  {
    toolSpec: {
      name: 'get_brand',
      description: 'Retrieve brand identity, guidelines, target audience, and active content pillars for RIIQX or specific brand.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            slug: { type: 'string', description: 'Brand slug, default riiqx-fashion' },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_content',
      description: 'Retrieve existing content items, drafts, scheduled posts, or historical reels.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            status: { type: 'string', description: 'Filter by status: DRAFT, PENDING, APPROVED, SCHEDULED, PUBLISHED' },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'create_content',
      description: 'Create a new content item in Supabase repository (always defaults to approval_status PENDING).',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'Content post title' },
            contentType: { type: 'string', description: 'Reel, UGC, Carousel, Story, etc.' },
            contentPillar: { type: 'string', description: 'Associated pillar (Outfit Inspiration, UGC, etc.)' },
            hook: { type: 'string', description: 'First 0-3 second hook' },
            caption: { type: 'string', description: 'Full Instagram caption' },
            hashtags: { type: 'array', items: { type: 'string' }, description: 'Target hashtags' },
            aiScore: { type: 'number', description: 'AI Opportunity Score 0-100' },
          },
          required: ['title', 'contentType', 'hook', 'caption'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_analytics',
      description: 'Get verified historical performance metrics, engagement rates, and reach analytics.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            days: { type: 'number', description: 'Days of data to analyze (7, 14, 30, 90)' },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_trends',
      description: 'Fetch current verified fashion, streetwear, and lifestyle trends with scores.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_products',
      description: 'List active verified RIIQX product catalog items for styling and affiliate content.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_instagram_account',
      description: 'Retrieve current connected Instagram professional account details and verification state.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {},
        },
      },
    },
  },
];

/**
 * Execute tool calls triggered by Bedrock Converse API
 */
export async function executeBedrockTool(name: string, input: Record<string, unknown>): Promise<unknown> {
  const brand = await repository.getBrand('riiqx-fashion');

  switch (name) {
    case 'get_brand': {
      return brand || { name: 'RIIQX', category: 'Fashion & Lifestyle', audience: 'Gen Z streetwear' };
    }
    case 'get_content': {
      const status = typeof input.status === 'string' ? (input.status as any) : undefined;
      return await repository.getContentItems(brand.id, { status });
    }
    case 'create_content': {
      return await repository.createContentItem({
        brand_id: brand.id,
        title: String(input.title || 'Untitled Post'),
        content_type: (input.contentType as any) || 'Reel',
        content_pillar: String(input.contentPillar || 'Outfit Inspiration'),
        hook: String(input.hook || ''),
        script: { hook: String(input.hook || '') },
        caption: String(input.caption || ''),
        hashtags: Array.isArray(input.hashtags) ? (input.hashtags as string[]) : ['#RIIQX', '#Streetwear'],
        cta: 'Comment RIIQX to get the secret drop link',
        media_url: null,
        thumbnail_url: null,
        cover_text: String(input.title || 'NEW RELEASE'),
        scheduled_at: null,
        published_at: null,
        instagram_media_id: null,
        status: 'READY',
        approval_status: 'PENDING',
        ai_score: Number(input.aiScore || 88),
        ai_score_breakdown: null,
      });
    }
    case 'get_analytics': {
      const days = typeof input.days === 'number' ? input.days : 14;
      return await repository.getAnalytics(brand.id, days);
    }
    case 'get_trends': {
      return await repository.getTrends();
    }
    case 'get_products': {
      return await repository.getProducts(brand.id);
    }
    case 'get_instagram_account': {
      return await instagramService.getAccount();
    }
    default:
      return { error: `Tool ${name} is not recognized or requires manual approval.` };
  }
}
