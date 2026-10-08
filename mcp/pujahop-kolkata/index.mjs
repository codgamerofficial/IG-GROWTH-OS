#!/usr/bin/env node
// =============================================================================
// PujaHop Kolkata: Official MCP Server (pujahop-kolkata-mcp)
// Real-time Durga Puja Planner & Travel Companion Tools
// =============================================================================

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  {
    name: 'pujahop-kolkata-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 1. TOOL DEFINITIONS
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_pandals',
        description: 'Search verified Kolkata Durga Puja pandals by name, area (North/Central/South), or metro station.',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Pandal name or keyword' },
            area: { type: 'string', description: 'North Kolkata, Central Kolkata, or South Kolkata' },
          },
        },
      },
      {
        name: 'plan_puja_itinerary',
        description: 'Generates a time-budgeted, multi-constraint one-day Durga Puja hopping itinerary for Kolkata.',
        inputSchema: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'Target date (YYYY-MM-DD)' },
            startLocation: { type: 'string', description: 'Starting hub name or coordinates' },
            startTime: { type: 'string', description: 'Start time (e.g., 14:00)' },
            endTime: { type: 'string', description: 'End time (e.g., 22:00)' },
            walkingTolerance: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            maxPandals: { type: 'number', description: 'Maximum pandals to visit' },
          },
          required: ['date', 'startLocation'],
        },
      },
      {
        name: 'check_metro_status',
        description: 'Fetch official Kolkata Metro Rail operating status, lines, and special all-night Puja schedules.',
        inputSchema: {
          type: 'object',
          properties: {
            line: { type: 'string', description: 'blue, green_underwater, green_east, purple, orange' },
            date: { type: 'string', description: 'Target date for night service schedule check' },
          },
        },
      },
      {
        name: 'get_traffic_restrictions',
        description: 'Retrieve real-time Kolkata Police traffic circulars, road closures, and one-way corridors.',
        inputSchema: {
          type: 'object',
          properties: {
            corridor: { type: 'string', description: 'Optional road name filter (e.g., Rashbehari, CR Avenue)' },
          },
        },
      },
      {
        name: 'get_kolkata_weather',
        description: 'Fetch real-time weather and walking safety status for Kolkata from Open-Meteo.',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
    ],
  };
});

// 2. TOOL EXECUTION HANDLER
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    if (name === 'search_pandals') {
      const res = await fetch(`${baseUrl}/api/pandals`);
      const data = await res.json();
      let list = data.pandals || [];
      if (args.query) {
        const q = String(args.query).toLowerCase();
        list = list.filter((p) => p.name.toLowerCase().includes(q) || p.name_bn.includes(q));
      }
      if (args.area) {
        list = list.filter((p) => p.area.toLowerCase().includes(String(args.area).toLowerCase()));
      }
      return {
        content: [{ type: 'text', text: JSON.stringify({ count: list.length, pandals: list }, null, 2) }],
      };
    }

    if (name === 'plan_puja_itinerary') {
      const res = await fetch(`${baseUrl}/api/route/plan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      });
      const data = await res.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === 'check_metro_status') {
      const res = await fetch(`${baseUrl}/api/metro`);
      const data = await res.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === 'get_traffic_restrictions') {
      const res = await fetch(`${baseUrl}/api/traffic`);
      const data = await res.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    }

    if (name === 'get_kolkata_weather') {
      const res = await fetch(`${baseUrl}/api/weather`);
      const data = await res.json();
      return {
        content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
      };
    }

    throw new Error(`Unknown tool: ${name}`);
  } catch (err) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ error: err.message }, null, 2) }],
      isError: true,
    };
  }
});

// Start STDIO transport
async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((err) => {
  console.error('Fatal MCP Server Error:', err);
  process.exit(1);
});
