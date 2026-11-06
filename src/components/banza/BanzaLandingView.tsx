'use client';

// =============================================================================
// BANZA — Master Landing & Experience View
// Exact 1:1 High-Fidelity Match with Banza Landing & Decision Platform
// =============================================================================

import React, { useState } from 'react';
import { BanzaNavbar } from './BanzaNavbar';
import { BanzaHeroSection } from './BanzaHeroSection';
import { BanzaDecisionContrast } from './BanzaDecisionContrast';
import { BanzaSavingsCalculator } from './BanzaSavingsCalculator';
import { BanzaResearchSimulator } from './BanzaResearchSimulator';
import { BanzaContextMemory } from './BanzaContextMemory';
import { BanzaAlgorithmOnYourSide } from './BanzaAlgorithmOnYourSide';
import { BanzaCommunityAskCarousel } from './BanzaCommunityAskCarousel';
import { BanzaFooter } from './BanzaFooter';
import { BanzaTwinWorkspace } from './BanzaTwinWorkspace';

export function BanzaLandingView() {
  const [currentMode, setCurrentMode] = useState<'landing' | 'twin_live' | 'profile'>('landing');
  const [activePrompt, setActivePrompt] = useState<string>('');

  const handleLaunchTwin = (prompt?: string) => {
    if (prompt) {
      setActivePrompt(prompt);
    }
    setCurrentMode('twin_live');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6] transition-colors flex flex-col font-sans selection:bg-[#FF5722]/20 selection:text-[#FF5722]">
      {/* Top Header Navbar */}
      <BanzaNavbar
        currentMode={currentMode}
        onModeChange={(m) => {
          setCurrentMode(m);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentMode === 'landing' ? (
          <>
            {/* 1. Hero Section */}
            <BanzaHeroSection onLaunchTwin={handleLaunchTwin} />

            {/* 2. What you see isn't always what's best for you */}
            <BanzaDecisionContrast onLaunchTwin={handleLaunchTwin} />

            {/* 3. The right product, The right price, The right way to pay (₹27,000 saved) */}
            <BanzaSavingsCalculator onLaunchTwin={handleLaunchTwin} />

            {/* 4. Hours of research. One question to your Twin. */}
            <BanzaResearchSimulator onLaunchTwin={handleLaunchTwin} />

            {/* 5. Your next decision shouldn't start from scratch. */}
            <BanzaContextMemory onLaunchTwin={() => handleLaunchTwin()} />

            {/* 6. Your Twin works for you. Finally an algorithm on your side. */}
            <BanzaAlgorithmOnYourSide onLaunchTwin={() => handleLaunchTwin()} />

            {/* 7. What would you ask your Twin? (Community Carousel + Final CTA) */}
            <BanzaCommunityAskCarousel onLaunchTwin={handleLaunchTwin} />
          </>
        ) : (
          /* Live Interactive AI Twin Decision Engine */
          <BanzaTwinWorkspace
            initialPrompt={activePrompt}
            initialShowConfigModal={currentMode === 'profile'}
            onBackToLanding={() => {
              setCurrentMode('landing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Footer */}
      <BanzaFooter />
    </div>
  );
}
