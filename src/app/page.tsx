'use client';

// =============================================================================
// RIIQX — Master Workspace Router
// One Goal. An AI That Gets It Done.
// Online-First Agentic AI • Autonomous Social Creator • Level 3 Autopilot
// =============================================================================

import React from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import { RiiqxChatView } from '@/components/riiqx/RiiqxChatView';
import { RiiqxCreatorStudio } from '@/components/riiqx/RiiqxCreatorStudio';
import { RiiqxAutopilotCenter } from '@/components/riiqx/RiiqxAutopilotCenter';
import { RiiqxResearchView } from '@/components/riiqx/RiiqxResearchView';
import { RiiqxCodeView } from '@/components/riiqx/RiiqxCodeView';
import { RiiqxTaskView } from '@/components/riiqx/RiiqxTaskView';
import { RiiqxAnalyticsView } from '@/components/riiqx/RiiqxAnalyticsView';
import { RiiqxSettingsView } from '@/components/riiqx/RiiqxSettingsView';

export default function RiiqxWorkspacePage() {
  const { activeTab } = useRiiqx();

  switch (activeTab) {
    case 'chat':
      return <RiiqxChatView />;
    case 'creator':
      return <RiiqxCreatorStudio />;
    case 'autopilot':
      return <RiiqxAutopilotCenter />;
    case 'research':
      return <RiiqxResearchView />;
    case 'code':
      return <RiiqxCodeView />;
    case 'tasks':
      return <RiiqxTaskView />;
    case 'analytics':
      return <RiiqxAnalyticsView />;
    case 'settings':
      return <RiiqxSettingsView />;
    default:
      return <RiiqxChatView />;
  }
}
