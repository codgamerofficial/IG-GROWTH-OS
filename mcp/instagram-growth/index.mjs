#!/usr/bin/env node
// =============================================================================
// IG GrowthOS: Official MCP Server (instagram-growth-mcp)
// =============================================================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Server instance
const server = new Server(
  {
    name: 'instagram-growth-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// In-Memory state for standalone MCP runtime
const state = {
  brand: {
    name: 'RIIQX',
    category: 'Fashion / Clothing / Lifestyle',
    username: 'riiqx.official',
    status: 'Connected (Development / Mock Mode)',
  },
  items: [
    {
      id: '40000000-0000-0000-0000-000000000001',
      title: 'Stop buying hoodies that lose their shape after 2 washes',
      status: 'PUBLISHED',
      approval_status: 'APPROVED',
      content_type: 'Reel',
      ai_score: 94.5,
      instagram_media_id: '17983419082347101',
    },
    {
      id: '40000000-0000-0000-0000-000000000002',
      title: '3 Ways to Style Tactical Cargo Pants Without Looking Like a Camper',
      status: 'SCHEDULED',
      approval_status: 'APPROVED',
      content_type: 'Carousel',
      ai_score: 91.0,
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
    },
    {
      id: '40000000-0000-0000-0000-000000000003',
      title: 'POV: You finally stopped dressing for everyone else',
      status: 'READY',
      approval_status: 'PENDING',
      content_type: 'Reel',
      ai_score: 88.5,
    },
  ],
  trends: [
    { topic: 'Deconstructed Utilitarian Denim', score: 94 },
    { topic: '3-Second Fast Cut Outfit Transitions', score: 91 },
    { topic: 'Monochrome Earth Tones vs Acid Wash', score: 88 },
    { topic: 'POV: Finding Your Uniform in 2026', score: 95 },
  ],
};

// 1. LIST TOOLS
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'instagram_get_account',
        description: 'Get connected Instagram professional account details and metrics for RIIQX.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'instagram_get_media',
        description: 'Get recent Instagram media posts and reels for RIIQX.',
        inputSchema: {
          type: 'object',
          properties: { limit: { type: 'number', description: 'Number of posts to return (default: 10)' } },
        },
      },
      {
        name: 'instagram_get_insights',
        description: 'Retrieve official account-level reach, impressions, and follower growth metrics.',
        inputSchema: {
          type: 'object',
          properties: { period: { type: 'string', enum: ['day', 'week', 'days_28'], default: 'day' } },
        },
      },
      {
        name: 'instagram_get_comments',
        description: 'Fetch comments on a specific Instagram media post.',
        inputSchema: {
          type: 'object',
          properties: { media_id: { type: 'string', description: 'Instagram Media ID' } },
          required: ['media_id'],
        },
      },
      {
        name: 'instagram_create_content',
        description: 'Create a new content item draft for RIIQX.',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string' },
            content_type: { type: 'string', enum: ['Reel', 'Carousel', 'Single Image', 'UGC'] },
            hook: { type: 'string' },
            caption: { type: 'string' },
            hashtags: { type: 'array', items: { type: 'string' } },
          },
          required: ['title', 'content_type', 'caption'],
        },
      },
      {
        name: 'instagram_update_content',
        description: 'Update an existing draft or pending content item.',
        inputSchema: {
          type: 'object',
          properties: {
            content_id: { type: 'string' },
            title: { type: 'string' },
            caption: { type: 'string' },
            hook: { type: 'string' },
          },
          required: ['content_id'],
        },
      },
      {
        name: 'instagram_approve_content',
        description: 'Approve a content item pending review. Required before scheduling or publishing.',
        inputSchema: {
          type: 'object',
          properties: {
            content_id: { type: 'string' },
            approved_by: { type: 'string', default: 'mcp_user' },
          },
          required: ['content_id'],
        },
      },
      {
        name: 'instagram_reject_content',
        description: 'Reject a pending content item with a reason.',
        inputSchema: {
          type: 'object',
          properties: {
            content_id: { type: 'string' },
            reason: { type: 'string' },
          },
          required: ['content_id', 'reason'],
        },
      },
      {
        name: 'instagram_schedule_content',
        description: 'Schedule an APPROVED content item for future publication. Rejects unapproved content.',
        inputSchema: {
          type: 'object',
          properties: {
            content_id: { type: 'string' },
            scheduled_at: { type: 'string', description: 'ISO-8601 timestamp' },
          },
          required: ['content_id', 'scheduled_at'],
        },
      },
      {
        name: 'instagram_publish_content',
        description: 'Publish an APPROVED content item to Instagram. Enforces approval and duplicate checks.',
        inputSchema: {
          type: 'object',
          properties: {
            content_id: { type: 'string' },
          },
          required: ['content_id'],
        },
      },
      {
        name: 'instagram_get_calendar',
        description: 'Get content calendar items for RIIQX across drafts, approved, scheduled, and published.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'instagram_get_trends',
        description: 'Get current streetwear, fashion, and Instagram audio trends.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'instagram_generate_ideas',
        description: 'Generate and score 10 AI content ideas for RIIQX.',
        inputSchema: {
          type: 'object',
          properties: {
            pillar: { type: 'string', description: 'Content pillar (e.g. Outfit Inspiration, UGC)' },
            count: { type: 'number', default: 10 },
          },
        },
      },
      {
        name: 'instagram_analyze_performance',
        description: 'Run comprehensive AI performance diagnostics on RIIQX Instagram metrics.',
        inputSchema: { type: 'object', properties: {} },
      },
      {
        name: 'instagram_run_daily_workflow',
        description: 'Execute the complete 12-step daily workflow: analyze trends, generate ideas, score, create packages, and queue in Approvals.',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
  };
});

// 2. CALL TOOLS
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args = {} } = request.params;

  switch (name) {
    case 'instagram_get_account': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                brand: state.brand.name,
                username: state.brand.username,
                followers: 48920,
                following: 312,
                posts: 84,
                connection_status: 'Connected ●',
                category: state.brand.category,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_get_media': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              state.items.filter((i) => i.status === 'PUBLISHED'),
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_get_insights': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                period: args.period || 'day',
                reach: 40100,
                impressions: 51300,
                likes: 3510,
                saves: 1460,
                shares: 930,
                engagement_rate: '7.82%',
                followers_gained: 355,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_get_comments': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              [
                { user: 'stylevanguard', comment: 'Where can I buy the 460 GSM hoodie?' },
                { user: 'drapemaster', comment: 'The proportions on those cargos are insane.' },
              ],
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_create_content': {
      const newItem = {
        id: `mcp_item_${Date.now()}`,
        title: args.title,
        content_type: args.content_type || 'Reel',
        hook: args.hook || '',
        caption: args.caption,
        hashtags: args.hashtags || ['#riiqx', '#streetwear'],
        status: 'DRAFT',
        approval_status: 'DRAFT',
        ai_score: 89.0,
      };
      state.items.push(newItem);
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success: true, item: newItem }, null, 2),
          },
        ],
      };
    }

    case 'instagram_update_content': {
      const item = state.items.find((i) => i.id === args.content_id);
      if (!item) throw new Error(`Content item ${args.content_id} not found.`);
      if (args.title) item.title = args.title;
      if (args.caption) item.caption = args.caption;
      if (args.hook) item.hook = args.hook;
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: true, updated: item }, null, 2) }],
      };
    }

    case 'instagram_approve_content': {
      const item = state.items.find((i) => i.id === args.content_id);
      if (!item) throw new Error(`Content item ${args.content_id} not found.`);
      item.approval_status = 'APPROVED';
      item.status = 'APPROVED';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Content item "${item.title}" successfully APPROVED.`,
                item,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_reject_content': {
      const item = state.items.find((i) => i.id === args.content_id);
      if (!item) throw new Error(`Content item ${args.content_id} not found.`);
      item.approval_status = 'REJECTED';
      item.status = 'REJECTED';
      item.rejection_reason = args.reason;
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Content item "${item.title}" REJECTED. Reason: ${args.reason}`,
                item,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_schedule_content': {
      const item = state.items.find((i) => i.id === args.content_id);
      if (!item) throw new Error(`Content item ${args.content_id} not found.`);
      // Enforce approval gate
      if (item.approval_status !== 'APPROVED') {
        throw new Error(
          `CRITICAL SAFETY GATE: Content item "${item.title}" cannot be scheduled because approval_status is '${item.approval_status}'. Content must be APPROVED first.`
        );
      }
      item.status = 'SCHEDULED';
      item.scheduled_at = args.scheduled_at;
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({ success: true, scheduled: item }, null, 2),
          },
        ],
      };
    }

    case 'instagram_publish_content': {
      const item = state.items.find((i) => i.id === args.content_id);
      if (!item) throw new Error(`Content item ${args.content_id} not found.`);

      // CRITICAL ACCEPTANCE TEST: A non-approved post MUST NOT publish
      if (item.approval_status !== 'APPROVED') {
        throw new Error(
          `CRITICAL SAFETY GATE: Content item "${item.title}" CANNOT BE PUBLISHED. Approval status is '${item.approval_status}'. Posts require 'APPROVED' status before publication.`
        );
      }

      if (item.status === 'PUBLISHED' && item.instagram_media_id) {
        throw new Error(`Duplicate publication prevented. Item is already published with media ID ${item.instagram_media_id}.`);
      }

      item.status = 'PUBLISHED';
      item.instagram_media_id = `1799${Date.now().toString().slice(-8)}`;
      item.published_at = new Date().toISOString();

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Published item "${item.title}" to Instagram.`,
                instagram_media_id: item.instagram_media_id,
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_get_calendar': {
      return {
        content: [{ type: 'text', text: JSON.stringify(state.items, null, 2) }],
      };
    }

    case 'instagram_get_trends': {
      return {
        content: [{ type: 'text', text: JSON.stringify(state.trends, null, 2) }],
      };
    }

    case 'instagram_generate_ideas': {
      const ideas = [
        { title: 'The 1:2 Golden Streetwear Ratio', hook: 'Why your proportions look off in photos', score: 94 },
        { title: 'Why 460 GSM is the New Luxury', hook: 'Never buy another limp hoodie', score: 96 },
        { title: '3 Ways to Style Wide Tactical Cargos', hook: 'Wear cargos without looking like a camper', score: 91 },
      ];
      return {
        content: [{ type: 'text', text: JSON.stringify(ideas, null, 2) }],
      };
    }

    case 'instagram_analyze_performance': {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                top_format: 'Reels (460 GSM Masterclass)',
                engagement_trend: '+14.8% over past 14 days',
                best_hook: 'Challenging fast-fashion myth',
                save_rate: '3.64%',
                recommendations: [
                  'Double down on fabric tension macro demos',
                  'Post between 6:30 PM - 8:00 PM EST',
                  'Add comment-trigger DMs',
                ],
              },
              null,
              2
            ),
          },
        ],
      };
    }

    case 'instagram_run_daily_workflow': {
      const newItems = [
        {
          id: `daily_${Date.now()}_1`,
          title: '3 Silhouette Mistakes in Streetwear',
          status: 'READY',
          approval_status: 'PENDING',
          content_type: 'Reel',
          ai_score: 94.5,
        },
        {
          id: `daily_${Date.now()}_2`,
          title: 'Anatomy of a $120 Heavyweight Hoodie',
          status: 'READY',
          approval_status: 'PENDING',
          content_type: 'Reel',
          ai_score: 96.0,
        },
        {
          id: `daily_${Date.now()}_3`,
          title: 'Tactical Cargo Proportions Masterclass',
          status: 'READY',
          approval_status: 'PENDING',
          content_type: 'Carousel',
          ai_score: 91.0,
        },
      ];
      state.items.push(...newItems);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                workflow: "Today's Instagram Workflow for RIIQX",
                steps_completed: 12,
                items_queued_for_approval: newItems,
                note: 'Items queued with approval_status = PENDING. No automatic publishing occurred.',
              },
              null,
              2
            ),
          },
        ],
      };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// Start transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error('Fatal MCP Server error:', err);
  process.exit(1);
});
