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

    // Clear any accidental inline scroll locks or height restrictions on html/body
    if (document.documentElement) {
      document.documentElement.style.overflow = '';
      document.documentElement.style.height = '';
      document.documentElement.scrollLeft = 0;
    }
    if (document.body) {
      document.body.style.overflow = '';
      document.body.style.height = '';
      document.body.classList.remove('antigravity-scroll-lock');
      document.body.scrollLeft = 0;
    }

    // Reset window scroll
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

    // Reset internal scroll container if present
    const scrollContainer = document.getElementById('pujahop-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop = 0;
      scrollContainer.scrollLeft = 0;
    }
  }, [activeTab]);

  return null;
}
