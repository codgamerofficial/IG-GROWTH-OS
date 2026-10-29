'use client';

// =============================================================================
// RIIQX — Application Shell Controller
// Distinguishes Authenticated Dashboard Workspace from Standalone Public & Auth Screens
// =============================================================================

import React from 'react';
import { usePathname } from 'next/navigation';
import { RiiqxHeader } from './RiiqxHeader';
import { RiiqxSidebar } from './RiiqxSidebar';
import { RiiqxAssistantDrawer } from './RiiqxAssistantDrawer';

interface RiiqxAppShellProps {
  children: React.ReactNode;
}

export function RiiqxAppShell({ children }: RiiqxAppShellProps) {
  const pathname = usePathname();

  // Authentication and standalone public routes must NOT render the dashboard shell
  const isAuthRoute = pathname?.startsWith('/auth');
  const isStandalonePublic =
    pathname === '/terms' ||
    pathname === '/privacy' ||
    pathname === '/about' ||
    pathname?.startsWith('/terms/') ||
    pathname?.startsWith('/privacy/');

  if (isAuthRoute || isStandalonePublic) {
    return (
      <main className="h-full w-full overflow-y-auto min-h-0 min-w-0 bg-[#FAF9F6] dark:bg-[#151515] text-[#202124] dark:text-[#F7F7F7]">
        {children}
      </main>
    );
  }

  // Full Authenticated Workspace Dashboard Shell
  return (
    <div className="flex h-full w-full max-w-full flex-col overflow-hidden min-h-0 bg-[#FAF9F6] dark:bg-[#151515]">
      <RiiqxHeader />
      <div className="relative flex flex-1 overflow-hidden min-h-0 min-w-0">
        <RiiqxSidebar />
        <main className="relative flex flex-1 flex-col overflow-hidden min-w-0 min-h-0">
          {children}
        </main>
      </div>
      {/* Contextual Floating Assistant Drawer (never squeezes main content) */}
      <RiiqxAssistantDrawer />
    </div>
  );
}
