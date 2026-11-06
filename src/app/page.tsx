'use client';

// =============================================================================
// RIIQX — Master Workspace Router
// "Know your needs. Make smarter moves."
// Personal AI Twin & Intelligence Platform
// =============================================================================

import React from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { TwinDashboardView } from '@/components/twin/TwinDashboardView';
import { TwinChatView } from '@/components/twin/TwinChatView';
import { TwinDecisionsView } from '@/components/twin/TwinDecisionsView';
import { TwinOpportunitiesView } from '@/components/twin/TwinOpportunitiesView';
import { TwinLifestyleView } from '@/components/twin/TwinLifestyleView';
import { TwinRewardsView } from '@/components/twin/TwinRewardsView';
import { TwinDigestView } from '@/components/twin/TwinDigestView';
import { TwinConnectionsView } from '@/components/twin/TwinConnectionsView';
import { TwinActivityView } from '@/components/twin/TwinActivityView';
import { TwinSettingsView } from '@/components/twin/TwinSettingsView';

export default function RiiqxWorkspacePage() {
  const { activeTab } = useRiiqx();

  switch (activeTab) {
    case 'home':
      return <TwinDashboardView />;
    case 'twin':
      return <TwinChatView />;
    case 'decisions':
      return <TwinDecisionsView />;
    case 'opportunities':
      return <TwinOpportunitiesView />;
    case 'lifestyle':
      return <TwinLifestyleView />;
    case 'rewards':
      return <TwinRewardsView />;
    case 'digest':
      return <TwinDigestView />;
    case 'connections':
    case 'integrations':
      return <TwinConnectionsView />;
    case 'activity':
    case 'tasks':
      return <TwinActivityView />;
    case 'settings':
      return <TwinSettingsView />;
    default:
      return <TwinDashboardView />;
  }
}
