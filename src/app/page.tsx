'use client';

// =============================================================================
// IG GrowthOS: Primary Application Router & Command View Switcher
// =============================================================================

import React from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import { OverviewView } from '@/components/dashboard/OverviewView';
import { CalendarView } from '@/components/calendar/CalendarView';
import { IdeasEngineView } from '@/components/ideas/IdeasEngineView';
import { ApprovalsView } from '@/components/approvals/ApprovalsView';
import { AnalyticsView } from '@/components/analytics/AnalyticsView';
import { TrendsView } from '@/components/trends/TrendsView';
import { ProductsView } from '@/components/products/ProductsView';
import { AIStudioView } from '@/components/studio/AIStudioView';
import { AutomationsView } from '@/components/automations/AutomationsView';
import { InstagramConnectionView } from '@/components/connection/InstagramConnectionView';
import { BrandSettingsView } from '@/components/brands/BrandSettingsView';

export default function HomePage() {
  const { activeTab } = useGrowthOS();

  switch (activeTab) {
    case 'overview':
      return <OverviewView />;
    case 'calendar':
      return <CalendarView />;
    case 'ideas':
      return <IdeasEngineView />;
    case 'drafts':
    case 'approvals':
      return <ApprovalsView />;
    case 'scheduled':
      return <CalendarView />;
    case 'published':
      return <OverviewView />;
    case 'analytics':
      return <AnalyticsView />;
    case 'trends':
      return <TrendsView />;
    case 'products':
      return <ProductsView />;
    case 'studio':
      return <AIStudioView />;
    case 'automations':
      return <AutomationsView />;
    case 'connection':
      return <InstagramConnectionView />;
    case 'brands':
    case 'settings':
      return <BrandSettingsView />;
    default:
      return <OverviewView />;
  }
}
