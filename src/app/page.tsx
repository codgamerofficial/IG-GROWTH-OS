'use client';

// =============================================================================
// RIIQX 2.0 — Master Workspace Router
// One Goal. An AI That Gets It Done.
// Contemporary Creator OS • Tool-Calling AI Agent • Level 3 Autopilot
// =============================================================================

import React from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxHomeDashboard } from '@/components/riiqx/RiiqxHomeDashboard';
import { BanzaLandingView } from '@/components/banza/BanzaLandingView';
import { RiiqxChatView } from '@/components/riiqx/RiiqxChatView';
import { RiiqxVideoEditor } from '@/components/riiqx/RiiqxVideoEditor';
import { RiiqxAutopilotCenter } from '@/components/riiqx/RiiqxAutopilotCenter';
import { RiiqxResearchView } from '@/components/riiqx/RiiqxResearchView';
import { RiiqxCodeView } from '@/components/riiqx/RiiqxCodeView';
import { RiiqxTaskView } from '@/components/riiqx/RiiqxTaskView';
import { RiiqxIntegrationsView } from '@/components/riiqx/RiiqxIntegrationsView';
import { RiiqxFilesView } from '@/components/riiqx/RiiqxFilesView';
import { RiiqxAnalyticsView } from '@/components/riiqx/RiiqxAnalyticsView';
import { RiiqxSettingsView } from '@/components/riiqx/RiiqxSettingsView';

export default function RiiqxWorkspacePage() {
  const { activeTab } = useRiiqx();

  switch (activeTab) {
    case 'twin':
      return <BanzaLandingView />;
    case 'home':
      return <RiiqxHomeDashboard />;
    case 'chat':
      return <RiiqxChatView />;
    case 'editor':
      return <RiiqxVideoEditor />;
    case 'autopilot':
      return <RiiqxAutopilotCenter />;
    case 'research':
      return <RiiqxResearchView />;
    case 'code':
      return <RiiqxCodeView />;
    case 'tasks':
      return <RiiqxTaskView />;
    case 'integrations':
      return <RiiqxIntegrationsView />;
    case 'files':
      return <RiiqxFilesView />;
    case 'analytics':
      return <RiiqxAnalyticsView />;
    case 'settings':
      return <RiiqxSettingsView />;
    default:
      return <BanzaLandingView />;
  }
}
