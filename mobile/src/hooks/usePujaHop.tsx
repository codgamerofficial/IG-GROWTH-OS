// =============================================================================
// PujaHop Kolkata Mobile: Application Context & State Hook
// Connects UI to API, location services, storage, and date intelligence
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Pandal, TripPlan, PandalVisitRecord, WeatherSnapshot, TrafficAlert } from '../../../../src/lib/types/pujahop';
import { VERIFIED_KOLKATA_PANDALS } from '../../../../src/lib/data/kolkata-pandals';
import { api } from '../services/api';
import { storage } from '../services/storage';
import { locationService, UserCoordinates } from '../services/location';
import { useHaptics } from './useHaptics';

interface PujaHopContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  pandals: Pandal[];
  loading: boolean;
  userLocation: UserCoordinates | null;
  hasLocationPermission: boolean;
  requestLocation: () => Promise<void>;
  currentTrip: TripPlan | null;
  setCurrentTrip: (trip: TripPlan | null) => void;
  visits: PandalVisitRecord[];
  visitedPandals: PandalVisitRecord[];
  markVisited: (pandal: Pandal, photoUri?: string) => Promise<void>;
  weather: WeatherSnapshot | null;
  trafficAlerts: TrafficAlert[];
  isOffline: boolean;
  lastSync: string | null;
  formattedDate: string;
  refreshData: () => Promise<void>;
}

const PujaHopContext = createContext<PujaHopContextType | undefined>(undefined);

export function PujaHopProvider({ children }: { children: React.ReactNode }) {
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-14'); // Default Pre-Puja
  const [pandals, setPandals] = useState<Pandal[]>(VERIFIED_KOLKATA_PANDALS);
  const [loading, setLoading] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<UserCoordinates | null>(null);
  const [hasLocationPermission, setHasLocationPermission] = useState<boolean>(false);
  const [currentTrip, setCurrentTrip] = useState<TripPlan | null>(null);
  const [visits, setVisits] = useState<PandalVisitRecord[]>([]);
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);
  const [trafficAlerts, setTrafficAlerts] = useState<TrafficAlert[]>([]);
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const haptics = useHaptics();

  // Load offline cache on mount
  useEffect(() => {
    (async () => {
      const [savedTrip, savedVisits, syncTime] = await Promise.all([
        storage.getOfflineTrip(),
        storage.getVisits(),
        storage.getLastSync(),
      ]);
      if (savedTrip) setCurrentTrip(savedTrip);
      if (savedVisits) setVisits(savedVisits);
      if (syncTime) setLastSync(syncTime);
    })();
  }, []);

  // Request Location
  const requestLocation = useCallback(async () => {
    const granted = await locationService.requestPermission();
    setHasLocationPermission(granted);
    if (granted) {
      const coords = await locationService.getCurrentLocation();
      setUserLocation(coords);
    }
  }, []);

  // Refresh Data
  const refreshData = useCallback(async () => {
    setLoading(true);
    try {
      const [pandalList, weatherData, trafficList] = await Promise.all([
        api.getPandals(selectedDate),
        api.getWeather(),
        api.getTraffic(),
      ]);
      setPandals(pandalList);
      setWeather(weatherData);
      setTrafficAlerts(trafficList);
      setIsOffline(false);
    } catch {
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  }, [selectedDate]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Mark Pandal as Visited (Passport Stamp)
  const markVisited = async (pandal: Pandal, photoUri?: string) => {
    haptics.success();
    const newVisit: PandalVisitRecord = {
      id: `visit_${Date.now()}`,
      pandal_id: pandal.id,
      pandal_name: pandal.name,
      area: pandal.area,
      visited_at: new Date().toISOString(),
      source: 'GPS_PROXIMITY_OR_USER',
      source_type: 'ON_GROUND_SURVEY',
      verified_by_user: true,
      dwell_time_minutes: 25,
      photo_url: photoUri,
    };

    const updated = [newVisit, ...visits.filter((v) => v.pandal_id !== pandal.id)];
    setVisits(updated);
    await storage.saveVisits(updated);
  };

  return (
    <PujaHopContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        pandals,
        loading,
        userLocation,
        hasLocationPermission,
        requestLocation,
        currentTrip,
        setCurrentTrip,
        visits,
        visitedPandals: visits,
        markVisited,
        weather,
        trafficAlerts,
        isOffline,
        lastSync,
        formattedDate: selectedDate === '2026-10-14' ? '14 OCT • PRE-PUJA' : selectedDate === '2026-10-18' ? '18 OCT • MAHA SAPTAMI' : `${selectedDate} • PUJA DAY`,
        refreshData,
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
