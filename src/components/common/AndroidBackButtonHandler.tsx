'use client';

// =============================================================================
// PujaHop Kolkata: Android Hardware & Gesture Back Button Handler
// Ensures that on Android devices, pressing Back or swiping Back edge-gesture
// closes the active Modal/Drawer (Pandal Details, Wizard, Copilot, SOS)
// instead of exiting or navigating away from the standalone PWA.
// Created & Conceptualized by Saswata Dey (Riik)
// =============================================================================

import { useEffect, useRef } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';

export function AndroidBackButtonHandler() {
  const {
    wizardOpen,
    setWizardOpen,
    selectedPandal,
    setSelectedPandal,
    copilotOpen,
    setCopilotOpen,
    sosOpen,
    setSosOpen,
  } = usePujaHop();

  const isModalOpen = wizardOpen || Boolean(selectedPandal) || copilotOpen || sosOpen;
  const pushedRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // When a modal opens and we haven't pushed a modal history state yet
    if (isModalOpen && !pushedRef.current) {
      window.history.pushState({ pujahopModal: true }, '');
      pushedRef.current = true;
    }

    // When all modals are closed by normal UI buttons, reset the flag
    if (!isModalOpen && pushedRef.current) {
      pushedRef.current = false;
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = (event: PopStateEvent) => {
      // If a modal was open when user pressed Android Back button
      if (wizardOpen || selectedPandal || copilotOpen || sosOpen) {
        // Haptic feedback
        if ('vibrate' in navigator) {
          try {
            navigator.vibrate(8);
          } catch (_) {}
        }

        // Close the uppermost active modal
        if (sosOpen) {
          setSosOpen(false);
        } else if (selectedPandal) {
          setSelectedPandal(null);
        } else if (copilotOpen) {
          setCopilotOpen(false);
        } else if (wizardOpen) {
          setWizardOpen(false);
        }

        pushedRef.current = false;
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [
    wizardOpen,
    setWizardOpen,
    selectedPandal,
    setSelectedPandal,
    copilotOpen,
    setCopilotOpen,
    sosOpen,
    setSosOpen,
  ]);

  return null;
}
