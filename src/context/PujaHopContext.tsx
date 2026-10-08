'use client';

// =============================================================================
// PujaHop Kolkata: Primary Application Context & State Engine
// Product: PujaHop Kolkata — One Day. One City. Maximum Puja.
// Handles: Verified Directory, Route Execution, Live Re-routing, Pandal Passport, Offline Mode
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Pandal,
  MetroStation,
  MetroLine,
  TrafficAlert,
  WeatherSnapshot,
  TripPlan,
  PandalVisitRecord,
  APIHealthItem,
  RouteRecalculation,
} from '@/lib/types/pujahop';
import { VERIFIED_KOLKATA_PANDALS } from '@/lib/data/kolkata-pandals';
import { VERIFIED_METRO_STATIONS, METRO_LINES } from '@/lib/data/kolkata-metro';
import { VERIFIED_TRAFFIC_ALERTS } from '@/lib/data/kolkata-traffic';

export type NavigationTab =
  | 'home'
  | 'explore'
  | 'route'
  | 'metro'
  | 'pandals'
  | 'passport'
  | 'stats'
  | 'settings'
  | 'admin'
  | 'about';

interface PujaHopContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  pandals: Pandal[];
  selectedPandal: Pandal | null;
  setSelectedPandal: (pandal: Pandal | null) => void;
  metroStations: MetroStation[];
  metroLines: MetroLine[];
  trafficAlerts: TrafficAlert[];
  weather: WeatherSnapshot | null;
  currentTrip: TripPlan | null;
  setCurrentTrip: (trip: TripPlan | null) => void;
  savedTrips: TripPlan[];
  visits: PandalVisitRecord[];
  apiHealth: APIHealthItem[];
  loading: boolean;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  sosOpen: boolean;
  setSosOpen: (open: boolean) => void;
  wizardOpen: boolean;
  setWizardOpen: (open: boolean) => void;
  markPandalVisited: (pandal: Pandal, rating?: number, notes?: string) => Promise<void>;
  generateTrip: (params: any) => Promise<TripPlan>;
  recalculateTrip: (congestedPandalId: string) => Promise<RouteRecalculation | null>;
  downloadOfflineTrip: () => void;
  refreshAllData: () => Promise<void>;
}

const PujaHopContext = createContext<PujaHopContextType | undefined>(undefined);

export function PujaHopProvider({ children }: { children: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14'); // Default Pre-Puja Mode (14 Oct)
  const [pandals, setPandals] = useState<Pandal[]>(VERIFIED_KOLKATA_PANDALS);
  const [selectedPandal, setSelectedPandal] = useState<Pandal | null>(null);
  const [metroStations, setMetroStations] = useState<MetroStation[]>(VERIFIED_METRO_STATIONS);
  const [metroLines, setMetroLines] = useState<MetroLine[]>(METRO_LINES);
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>(VERIFIED_TRAFFIC_ALERTS);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [savedTrips, setSavedTrips] = useState<TripPlan[]>([]);
  const [visits, setVisits] = useState<PandalVisitRecord[]>([]);
  const [apiHealth, setApiHealth] = useState<APIHealthItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [sosOpen, setSosOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  // Load initial data
  const refreshAllData = useCallback(async () => {
    try {
      setLoading(true);
      const [pandalRes, metroRes, trafficRes, weatherRes, healthRes, tripsRes, visitsRes] =
        await Promise.allSettled([
          fetch(`/api/pandals?date=${selectedDate}`).then((r) => r.json()),
          fetch(`/api/metro?date=${selectedDate}`).then((r) => r.json()),
          fetch('/api/traffic').then((r) => r.json()),
          fetch('/api/weather').then((r) => r.json()),
          fetch('/api/health').then((r) => r.json()),
          fetch('/api/trips').then((r) => r.json()),
          fetch('/api/passport').then((r) => r.json()),
        ]);

      if (pandalRes.status === 'fulfilled' && pandalRes.value?.success) {
        setPandals(pandalRes.value.pandals);
      }
      if (metroRes.status === 'fulfilled' && metroRes.value?.success) {
        setMetroStations(metroRes.value.stations);
        setMetroLines(metroRes.value.lines);
      }
      if (trafficRes.status === 'fulfilled' && trafficRes.value?.success) {
        setTrafficAlerts(trafficRes.value.alerts);
      }
      if (weatherRes.status === 'fulfilled' && weatherRes.value?.success) {
        setWeather(weatherRes.value.weather);
      }
      if (healthRes.status === 'fulfilled' && healthRes.value?.services) {
        setApiHealth(healthRes.value.services);
      }
      if (tripsRes.status === 'fulfilled' && tripsRes.value?.plans) {
        setSavedTrips(tripsRes.value.plans);
        if (tripsRes.value.plans.length > 0 && !currentTrip) {
          setCurrentTrip(tripsRes.value.plans[0]);
        }
      }
      if (visitsRes.status === 'fulfilled' && visitsRes.value?.visits) {
        setVisits(visitsRes.value.visits);
      }
    } catch (err) {
      console.error('Failed to load PujaHop data:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, currentTrip]);

  useEffect(() => {
    refreshAllData();
  }, [selectedDate]);

  // Generate Trip via Route Engine
  const generateTrip = async (params: any): Promise<TripPlan> => {
    setLoading(true);
    try {
      const res = await fetch('/api/route/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...params,
          date: selectedDate,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to generate route');
      }
      setCurrentTrip(data.plan);
      setSavedTrips((prev) => [data.plan, ...prev]);
      setActiveTab('route');
      setWizardOpen(false);
      return data.plan;
    } finally {
      setLoading(false);
    }
  };

  // Recalculate Live Route on Crowd Surge
  const recalculateTrip = async (congestedPandalId: string): Promise<RouteRecalculation | null> => {
    if (!currentTrip) return null;
    setLoading(true);
    try {
      const res = await fetch('/api/route/recalculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: currentTrip,
          congestedPandalId,
        }),
      });
      const data = await res.json();
      if (data.success && data.recalculation) {
        setCurrentTrip(data.recalculation.recalculated_plan);
        return data.recalculation;
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mark Visited in Passport
  const markPandalVisited = async (pandal: Pandal, rating = 5, notes = '') => {
    try {
      const res = await fetch('/api/passport', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pandal_id: pandal.id,
          pandal_name: pandal.name,
          area: pandal.area,
          rating,
          notes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setVisits((prev) => [data.visit, ...prev]);
        // Also update stop visited status if in current trip
        if (currentTrip) {
          const updatedStops = currentTrip.stops.map((s) =>
            s.pandal?.id === pandal.id ? { ...s, visited: true, visited_at: new Date().toISOString() } : s
          );
          setCurrentTrip({ ...currentTrip, stops: updatedStops });
        }
      }
    } catch (e) {
      console.error('Failed to mark visited:', e);
    }
  };

  // Offline Trip Mode: Download as JSON & Cache to localStorage
  const downloadOfflineTrip = () => {
    if (!currentTrip) return;
    const offlinePayload = {
      product: 'PujaHop Kolkata',
      tagline: 'One Day. One City. Maximum Puja.',
      exportedAt: new Date().toISOString(),
      trip: currentTrip,
      pandals: currentTrip.stops.filter((s) => s.pandal).map((s) => s.pandal),
      metroStations: VERIFIED_METRO_STATIONS,
      emergencyContacts: {
        police: '100 / 033-2214-3230',
        national: '112',
        ambulance: '102 / 108',
      },
    };

    // Cache in browser localStorage
    try {
      localStorage.setItem('PUJAHOP_OFFLINE_TRIP', JSON.stringify(offlinePayload));
    } catch (e) {
      // Storage quota or private mode
    }

    // Trigger file download
    const blob = new Blob([JSON.stringify(offlinePayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pujahop-kolkata-${currentTrip.date}-${currentTrip.id}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <PujaHopContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedDate,
        setSelectedDate,
        pandals,
        selectedPandal,
        setSelectedPandal,
        metroStations,
        metroLines,
        trafficAlerts,
        weather,
        currentTrip,
        setCurrentTrip,
        savedTrips,
        visits,
        apiHealth,
        loading,
        copilotOpen,
        setCopilotOpen,
        sosOpen,
        setSosOpen,
        wizardOpen,
        setWizardOpen,
        markPandalVisited,
        generateTrip,
        recalculateTrip,
        downloadOfflineTrip,
        refreshAllData,
      }}
    >
      {children}
    </PujaHopContext.Provider>
  );
}

export function usePujaHop() {
  const context = useContext(PujaHopContext);
  if (!context) {
    throw new Error('usePujaHop must be used within a PujaHopProvider');
  }
  return context;
}
