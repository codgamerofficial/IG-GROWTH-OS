// =============================================================================
// PujaHop Kolkata: Kolkata Traffic Intelligence Layer (Phase 13: Date-Aware)
// Official Source: Kolkata Traffic Police (Lalbazar Headquarters)
// Regulations: Road closures, one-way systems, pedestrian-only zones & diversions
// =============================================================================

import { TrafficAlert } from '../types/pujahop';

export const VERIFIED_TRAFFIC_ALERTS: TrafficAlert[] = [
  {
    id: 'traff-001',
    title: 'Gariahat & Rashbehari Pedestrian-Only Corridor',
    description: 'Rashbehari Avenue from Gariahat Crossing to Deshapriya Park closed to vehicular traffic from 15:00 to 04:00 daily during Puja days. Only pedestrian movement permitted.',
    category: 'PEDESTRIAN_ONLY',
    area: 'South Kolkata',
    affected_roads: ['Rashbehari Avenue', 'Gariahat Road', 'Dover Lane', 'Ekdalia Road'],
    valid_from: '2026-10-14T15:00:00Z',
    valid_until: '2026-10-21T05:00:00Z',
    source: 'Kolkata Traffic Police Official Puja Notification',
    source_url: 'https://kolkatatrafficpolice.gov.in',
    source_type: 'POLICE_GUIDE',
    confidence: 0.94,
    status: 'ACTIVE',
    published_at: '2026-10-07T12:00:00Z',
  },
  {
    id: 'traff-002',
    title: 'VIP Road Lake Town Service Road Closure for Sreebhumi',
    description: 'Service road towards Lake Town Entry closed to private vehicles from Tritiya. Entry only permitted via designated pedestrian holding bays near Ultadanga foot overbridge.',
    category: 'ROAD_CLOSURE',
    area: 'East Kolkata / Salt Lake',
    affected_roads: ['VIP Road Service Lane', 'Lake Town Main Road', 'Sreebhumi Link'],
    valid_from: '2026-10-13T12:00:00Z',
    valid_until: '2026-10-22T06:00:00Z',
    source: 'Bidhannagar Police Commissionerate Traffic Guard',
    source_url: 'https://bidhannagarpolice.gov.in',
    source_type: 'OFFICIAL',
    confidence: 0.95,
    status: 'ACTIVE',
    published_at: '2026-10-07T14:00:00Z',
  },
  {
    id: 'traff-003',
    title: 'College Street & Surya Sen Street One-Way Movement',
    description: 'College Street between MG Road crossing and Bowbazar converted to strict South-to-North one-way pedestrian & emergency vehicle flow for College Square crowd management.',
    category: 'ONE_WAY',
    area: 'Central Kolkata',
    affected_roads: ['College Street', 'Surya Sen Street', 'Bankim Chatterjee Street'],
    valid_from: '2026-10-14T16:00:00Z',
    valid_until: '2026-10-21T04:00:00Z',
    source: 'Kolkata Police Central Traffic Guard Circular',
    source_url: 'https://kolkatatrafficpolice.gov.in',
    source_type: 'POLICE_GUIDE',
    confidence: 0.92,
    status: 'ACTIVE',
    published_at: '2026-10-08T09:00:00Z',
  },
  {
    id: 'traff-004',
    title: 'Kumartuli & Sovabazar Ghat Road Restrictions',
    description: 'No goods vehicles or heavy vehicles allowed on Rabindra Sarani and Ahiritola Street between 14:00 and 04:00 to facilitate artisan movement and pedestrian pandal hoppers.',
    category: 'VEHICLE_RESTRICTION',
    area: 'North Kolkata',
    affected_roads: ['Rabindra Sarani', 'Ahiritola Street', 'BK Paul Avenue', 'Sovabazar Street'],
    valid_from: '2026-10-14T14:00:00Z',
    valid_until: '2026-10-21T06:00:00Z',
    source: 'Shyampukur Traffic Guard Order',
    source_url: 'https://kolkatatrafficpolice.gov.in',
    source_type: 'POLICE_GUIDE',
    confidence: 0.92,
    status: 'ACTIVE',
    published_at: '2026-10-08T10:00:00Z',
  },
  {
    id: 'traff-005',
    title: 'Kalighat Temple & Badamtala Auto Diversion',
    description: 'Autos on Kalighat-Gariahat route diverted through Hazra Road due to heavy queue overflow on Nepal Bhattacharjee Street.',
    category: 'AUTO_RESTRICTION',
    area: 'South Kolkata',
    affected_roads: ['Nepal Bhattacharjee Street', 'Sadananda Road', 'Kalighat Road'],
    valid_from: '2026-10-14T16:00:00Z',
    valid_until: '2026-10-20T23:00:00Z',
    source: 'Kalighat Traffic Guard Bulletin',
    source_url: 'https://kolkatatrafficpolice.gov.in',
    source_type: 'POLICE_GUIDE',
    confidence: 0.90,
    status: 'ACTIVE',
    published_at: '2026-10-08T11:00:00Z',
  },
];

/**
 * Filter alerts strictly valid for the selected date (Phase 13: Date-aware traffic).
 */
export function getActiveTrafficAlertsForDate(dateString: string): TrafficAlert[] {
  const targetMidnight = new Date(`${dateString}T12:00:00Z`).getTime();

  return VERIFIED_TRAFFIC_ALERTS.filter((alert) => {
    const fromTime = new Date(alert.valid_from).getTime();
    const untilTime = new Date(alert.valid_until).getTime();
    return targetMidnight >= fromTime && targetMidnight <= untilTime;
  });
}
