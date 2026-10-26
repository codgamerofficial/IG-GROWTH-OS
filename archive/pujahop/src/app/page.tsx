'use client';

// =============================================================================
// PujaHop Kolkata: Primary Application View Router
// Product: PujaHop Kolkata — One Day. One City. Maximum Puja.
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { HomeScreen } from '@/components/home/HomeScreen';
import { MapView } from '@/components/map/MapView';
import { RouteView } from '@/components/route/RouteView';
import { MetroView } from '@/components/metro/MetroView';
import { PandalDirectoryView } from '@/components/pandals/PandalDirectoryView';
import { PassportView } from '@/components/passport/PassportView';
import { TripStatsView } from '@/components/stats/TripStatsView';
import { APIHealthView } from '@/components/settings/APIHealthView';
import { AdminView } from '@/components/admin/AdminView';
import { AboutView } from '@/components/about/AboutView';

export default function HomePage() {
  const { activeTab } = usePujaHop();

  switch (activeTab) {
    case 'home':
      return <HomeScreen />;
    case 'explore':
      return <MapView />;
    case 'route':
      return <RouteView />;
    case 'metro':
      return <MetroView />;
    case 'pandals':
      return <PandalDirectoryView />;
    case 'passport':
      return <PassportView />;
    case 'stats':
      return <TripStatsView />;
    case 'settings':
      return <APIHealthView />;
    case 'admin':
      return <AdminView />;
    case 'about':
      return <AboutView />;
    default:
      return <HomeScreen />;
  }
}
