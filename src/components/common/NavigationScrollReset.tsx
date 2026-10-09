'use client';

// =============================================================================
// PujaHop Kolkata: Navigation Scroll & Offset Reset Handler
// Ensures that whenever the active tab changes, the page scroll container
// and window immediately reset to (top: 0, left: 0), preventing horizontal shifts
// or stale scroll offsets across screens.
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import { useEffect } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';

export function NavigationScrollReset() {
  const { activeTab } = usePujaHop();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Reset window scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Reset internal scroll container
    const scrollContainer = document.getElementById('pujahop-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    }

    // Reset document element
    if (document.documentElement) {
      document.documentElement.scrollLeft = 0;
    }
    if (document.body) {
      document.body.scrollLeft = 0;
    }
  }, [activeTab]);

  return null;
}
