// =============================================================================
// PujaHop Kolkata: Amazon Bedrock Converse Tool Definitions & Execution Dispatcher
// Strictly maps to verified Kolkata Puja databases, OSRM routes & live weather
// =============================================================================

import { Tool } from '@aws-sdk/client-bedrock-runtime';
import { VERIFIED_KOLKATA_PANDALS } from '../data/kolkata-pandals';
import { VERIFIED_METRO_STATIONS, METRO_LINES, getMetroOperatingSchedule } from '../data/kolkata-metro';
import { VERIFIED_TRAFFIC_ALERTS } from '../data/kolkata-traffic';
import { VERIFIED_RESTAURANTS, VERIFIED_HOSPITALS, VERIFIED_POLICE_STATIONS } from '../data/kolkata-amenities';
import { fetchLiveKolkataWeather } from '../weather/service';
import { optimizePujaItinerary } from '../routing/optimizer';
import { evaluatePandalStatus } from '../data/kolkata-calendar';

export const bedrockTools: Tool[] = [
  {
    toolSpec: {
      name: 'search_pandals',
      description: 'Search verified Kolkata Durga Puja pandals by area, neighborhood, keyword, or nearest metro station.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            area: {
              type: 'string',
              description: 'Area filter: North Kolkata, Central Kolkata, South Kolkata, East Kolkata / Salt Lake',
            },
            query: {
              type: 'string',
              description: 'Search query keyword (e.g. Bagbazar, Ekdalia, lighting, temple)',
            },
            nearest_metro: {
              type: 'string',
              description: 'Filter by nearest metro station (e.g. Shyambazar, Kalighat, Central)',
            },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_pandal_details',
      description: 'Get verified detailed info for a specific pandal including theme, opening status, scores, coordinates, and nearest metro.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            slug_or_id: {
              type: 'string',
              description: 'Pandal slug or ID (e.g. bagbazar-sarbojanin, ekdalia-evergreen)',
            },
          },
          required: ['slug_or_id'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_metro_info',
      description: 'Retrieve official Kolkata Metro operational information, stations, interchanges, and date-aware Puja night service schedules.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            date: {
              type: 'string',
              description: 'Target date in YYYY-MM-DD format (e.g. 2026-10-18)',
            },
            station_name: {
              type: 'string',
              description: 'Optional station name to lookup (e.g. Kalighat, Esplanade)',
            },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_traffic_alerts',
      description: 'Retrieve current official Kolkata Police traffic restrictions, road closures, pedestrian-only zones, and diversions.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            area: {
              type: 'string',
              description: 'Optional area filter: North Kolkata, Central Kolkata, South Kolkata, East Kolkata / Salt Lake',
            },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_weather',
      description: 'Retrieve real-time live weather conditions for Kolkata (temperature, humidity, precipitation, walking safety).',
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
      name: 'plan_puja_route',
      description: 'Generate an optimized one-day pandal hopping itinerary based on user start location, time budget, walking tolerance, and interests.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            date: { type: 'string', description: 'YYYY-MM-DD date' },
            start_location: { type: 'string', description: 'Starting place name (e.g. Howrah, Shyambazar, Gariahat)' },
            start_time: { type: 'string', description: 'Start time HH:MM (e.g. 14:00)' },
            end_time: { type: 'string', description: 'End time HH:MM (e.g. 22:00)' },
            walking_tolerance: { type: 'string', enum: ['LOW', 'MEDIUM', 'HIGH'] },
            transport_preference: { type: 'string', enum: ['METRO_AND_WALK', 'WALK_ONLY', 'CAB_PREFERRED'] },
            max_pandals: { type: 'number', description: 'Preferred number of pandals (3 to 10)' },
          },
          required: ['date', 'start_location', 'start_time', 'end_time'],
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_nearby_food',
      description: 'Find verified Kolkata restaurants, biryani spots, rolls, or sweets near an area or metro station.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            area: { type: 'string', description: 'North Kolkata, South Kolkata, Central Kolkata' },
            category: { type: 'string', description: 'BIRYANI, ROLL, STREET_FOOD, SWEETS, RESTAURANT' },
          },
        },
      },
    },
  },
  {
    toolSpec: {
      name: 'get_emergency_services',
      description: 'Get nearest 24/7 hospitals, Kolkata Police stations, and emergency SOS contact numbers.',
      inputSchema: {
        json: {
          type: 'object',
          properties: {
            area: { type: 'string', description: 'Area of emergency' },
          },
        },
      },
    },
  },
];

/**
 * Executes a tool called by Amazon Bedrock Converse API with real backend data
 */
export async function executeBedrockTool(
  toolName: string,
  input: Record<string, unknown>
): Promise<unknown> {
  switch (toolName) {
    case 'search_pandals': {
      let results = [...VERIFIED_KOLKATA_PANDALS];
      if (input.area) {
        results = results.filter((p) => p.area.toLowerCase().includes(String(input.area).toLowerCase()));
      }
      if (input.nearest_metro) {
        results = results.filter((p) =>
          p.nearest_metro.toLowerCase().includes(String(input.nearest_metro).toLowerCase())
        );
      }
      if (input.query) {
        const q = String(input.query).toLowerCase();
        results = results.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.name_bn.includes(q) ||
            p.theme.toLowerCase().includes(q) ||
            p.neighborhood.toLowerCase().includes(q)
        );
      }
      return results.map((p) => ({
        id: p.id,
        name: p.name,
        name_bn: p.name_bn,
        area: p.area,
        nearest_metro: p.nearest_metro,
        walking_distance: p.walking_distance,
        theme: p.theme,
        status: p.status,
        overall_score: p.overall_score,
      }));
    }

    case 'get_pandal_details': {
      const q = String(input.slug_or_id || '').toLowerCase();
      const p = VERIFIED_KOLKATA_PANDALS.find(
        (x) => x.id.toLowerCase() === q || x.slug.toLowerCase() === q || x.name.toLowerCase().includes(q)
      );
      if (!p) return { error: `Pandal not found for query '${input.slug_or_id}'` };
      return p;
    }

    case 'get_metro_info': {
      const date = String(input.date || '2026-10-18');
      const schedule = getMetroOperatingSchedule(date);
      let stations = VERIFIED_METRO_STATIONS;
      if (input.station_name) {
        const sn = String(input.station_name).toLowerCase();
        stations = stations.filter((s) => s.name.toLowerCase().includes(sn));
      }
      return {
        lines: METRO_LINES,
        schedule,
        matching_stations: stations.slice(0, 8),
      };
    }

    case 'get_traffic_alerts': {
      let alerts = VERIFIED_TRAFFIC_ALERTS;
      if (input.area) {
        alerts = alerts.filter((a) => a.area.toLowerCase().includes(String(input.area).toLowerCase()));
      }
      return alerts;
    }

    case 'get_weather': {
      return await fetchLiveKolkataWeather();
    }

    case 'plan_puja_route': {
      // Find approximate coordinates for starting location
      let startLat = 22.5726;
      let startLng = 88.3639;
      const startName = String(input.start_location || 'Kolkata');

      const matchingStation = VERIFIED_METRO_STATIONS.find((s) =>
        s.name.toLowerCase().includes(startName.toLowerCase())
      );
      if (matchingStation) {
        startLat = matchingStation.lat;
        startLng = matchingStation.lng;
      }

      const plan = await optimizePujaItinerary({
        date: String(input.date || '2026-10-18'),
        startLocation: { name: startName, lat: startLat, lng: startLng },
        startTime: String(input.start_time || '14:00'),
        endTime: String(input.end_time || '22:00'),
        walkingTolerance: (input.walking_tolerance as any) || 'MEDIUM',
        transportPreference: (input.transport_preference as any) || 'METRO_AND_WALK',
        maxPandals: typeof input.max_pandals === 'number' ? input.max_pandals : 6,
      });

      return {
        title: plan.title,
        total_pandals: plan.total_pandals,
        total_walking_distance_meters: plan.total_walking_distance_meters,
        total_travel_time_minutes: plan.total_travel_time_minutes,
        stops: plan.stops.map((s) => ({
          name: s.custom_name,
          type: s.stop_type,
          arrival: s.arrival_time,
          departure: s.departure_time,
          duration: s.duration_minutes,
          crowd: s.crowd_status,
        })),
        reasoning: plan.ai_reasoning,
      };
    }

    case 'get_nearby_food': {
      let restos = VERIFIED_RESTAURANTS;
      if (input.area) {
        restos = restos.filter((r) => r.area.toLowerCase().includes(String(input.area).toLowerCase()));
      }
      if (input.category) {
        restos = restos.filter((r) => r.category.toLowerCase() === String(input.category).toLowerCase());
      }
      return restos;
    }

    case 'get_emergency_services': {
      return {
        emergency_numbers: { national: '112', police: '100 / 033-2214-3230', ambulance: '102 / 108' },
        hospitals: VERIFIED_HOSPITALS,
        police_stations: VERIFIED_POLICE_STATIONS,
      };
    }

    default:
      return { error: `Tool ${toolName} not supported` };
  }
}
