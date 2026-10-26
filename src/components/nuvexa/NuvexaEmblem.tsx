'use client';

import React from 'react';

interface NuvexaEmblemProps {
  size?: number;
  className?: string;
  animate?: boolean;
}

/**
 * Distinctive Infinity-loop dual-orbit AI emblem for NUVEXA AI.
 * Represents infinite possibilities with deep cyan, electric blue, and violet gradients.
 */
export function NuvexaEmblem({ size = 32, className = '', animate = false }: NuvexaEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`relative inline-block select-none ${className}`}
    >
      <defs>
        {/* Primary Cyan to Violet Linear Gradient */}
        <linearGradient id="nuvexa-infinity-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="45%" stopColor="#3B82F6" />
          <stop offset="85%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Ambient Glow Filter */}
        <filter id="nuvexa-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="glow" />
          <feComposite in="SourceGraphic" in2="glow" operator="over" />
        </filter>

        {/* Core Node Pulse */}
        <linearGradient id="nuvexa-core-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      {/* Background Soft Aura */}
      <circle cx="50" cy="50" r="42" fill="url(#nuvexa-infinity-grad)" opacity="0.08" />

      {/* Outer Infinity Loop Halo (Glow) */}
      <path
        d="M28 50 C28 39, 39 39, 50 50 C61 61, 72 61, 72 50 C72 39, 61 39, 50 50 C39 61, 28 61, 28 50 Z"
        stroke="url(#nuvexa-infinity-grad)"
        strokeWidth="9"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.35"
        filter="url(#nuvexa-glow)"
      />

      {/* Main Sharp Infinity Loop Track */}
      <path
        d="M28 50 C28 39, 39 39, 50 50 C61 61, 72 61, 72 50 C72 39, 61 39, 50 50 C39 61, 28 61, 28 50 Z"
        stroke="url(#nuvexa-infinity-grad)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={animate ? 'animate-pulse' : ''}
      />

      {/* Left Singularity Core (Analytical Node) */}
      <circle cx="34" cy="50" r="3.5" fill="#22D3EE" filter="url(#nuvexa-glow)" />

      {/* Central Nexus Intersection (Multi-Modal Crossroad) */}
      <circle cx="50" cy="50" r="4" fill="#FFFFFF" />

      {/* Right Singularity Core (Creative/Synthesis Node) */}
      <circle cx="66" cy="50" r="3.5" fill="#EC4899" filter="url(#nuvexa-glow)" />
    </svg>
  );
}
