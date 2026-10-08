// =============================================================================
// PujaHop Kolkata: Real Routing & Walking Navigation Engine
// Real OSRM Foot Routing • Google Maps Navigation Link • Accurate Geodesy
// =============================================================================

import { WalkingLeg, CrowdLevel } from '../types/pujahop';

export interface RouteLegCalculation {
  distanceMeters: number;
  durationSeconds: number;
  durationMinutes: number;
  isRealApi: boolean;
  source: string;
}

/**
 * Calculates real walking route between two GPS coordinates using Open Source Routing Machine (OSRM)
 * with robust timeout and transparent fallback to Haversine geodesy.
 */
export async function calculateWalkingLeg(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<RouteLegCalculation> {
  const url = `https://router.project-osrm.org/route/v1/foot/${originLng},${originLat};${destLng},${destLat}?overview=false`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'PujaHopKolkata/1.0' },
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const dist = Math.round(route.distance);
        let durSec = Math.round(route.duration);
        let durMin = Math.round(durSec / 60);
        // Calibrate walking pace to realistic Kolkata pedestrian crowd speed (~4.2 km/h = 70 m/min)
        if (durMin < Math.round(dist / 90)) {
          durMin = Math.max(1, Math.round(dist / 70));
          durSec = durMin * 60;
        }
        return {
          distanceMeters: dist,
          durationSeconds: durSec,
          durationMinutes: durMin,
          isRealApi: true,
          source: 'OSRM Walking Router API (Real Route Calculation)',
        };
      }
    }
  } catch (err) {
    // Graceful fallback to accurate Haversine calculation
  }

  // Haversine Geodesic Distance with Kolkata pedestrian detour coefficient (1.28)
  const straightMeters = calculateHaversineDistance(originLat, originLng, destLat, destLng);
  const roadWalkingMeters = Math.round(straightMeters * 1.28);
  // Average urban walking speed in Kolkata crowded Puja streets: ~4.2 km/h (70 meters/minute)
  const walkingMinutes = Math.max(2, Math.round(roadWalkingMeters / 70));

  return {
    distanceMeters: roadWalkingMeters,
    durationSeconds: walkingMinutes * 60,
    durationMinutes: walkingMinutes,
    isRealApi: false,
    source: 'Geodesic Walking Calculation (Detour Factor 1.28 @ 4.2 km/h)',
  };
}

/**
 * Great-circle distance between two GPS coordinates in meters
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

/**
 * Builds standard Google Maps walking directions URL for native navigation action
 */
export function buildGoogleMapsWalkingUrl(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number,
  destLabel?: string
): string {
  const base = 'https://www.google.com/maps/dir/?api=1';
  const origin = `&origin=${originLat},${originLng}`;
  const dest = `&destination=${destLat},${destLng}`;
  const mode = '&travelmode=walking';
  return `${base}${origin}${dest}${mode}`;
}

/**
 * Formats a walking leg into human-readable details
 */
export function buildWalkingLeg(
  fromName: string,
  fromLat: number,
  fromLng: number,
  toName: string,
  toLat: number,
  toLng: number,
  distanceMeters: number,
  walkingMinutes: number,
  crowdStatus: CrowdLevel = 'MODERATE',
  roadStatus = 'Normal pedestrian flow'
): WalkingLeg {
  return {
    from_name: fromName,
    from_lat: fromLat,
    from_lng: fromLng,
    to_name: toName,
    to_lat: toLat,
    to_lng: toLng,
    distance_meters: distanceMeters,
    estimated_walking_minutes: walkingMinutes,
    crowd_status: crowdStatus,
    road_status: roadStatus,
    navigation_action_url: buildGoogleMapsWalkingUrl(fromLat, fromLng, toLat, toLng, toName),
    transit_mode: 'WALK',
  };
}
