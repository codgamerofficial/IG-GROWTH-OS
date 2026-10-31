'use client';

// =============================================================================
// RIIQX LIQUID INTELLIGENCE — SIGNATURE AI THINKING ORB
// 12 Reactive States • Fluid Liquid Shaders • Neural Connections & Particle Pulses
// Apple Liquid Glass + VisionOS Depth Physics
// =============================================================================

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export type AIOrbState =
  | 'idle'
  | 'listening'
  | 'understanding'
  | 'thinking'
  | 'planning'
  | 'tool_selection'
  | 'tool_execution'
  | 'generating'
  | 'reviewing'
  | 'completed'
  | 'warning'
  | 'failed';

export interface AIThinkingOrbProps {
  state?: AIOrbState;
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  showLabel?: boolean;
  toolName?: string;
  neuralActivity?: boolean;
  className?: string;
  onClick?: () => void;
}

export function AIThinkingOrb({
  state = 'idle',
  size = 'md',
  showLabel = false,
  toolName,
  neuralActivity = true,
  className = '',
  onClick,
}: AIThinkingOrbProps) {
  // Numeric pixel dimension
  const pixelSize = useMemo(() => {
    if (typeof size === 'number') return size;
    return {
      sm: 32,
      md: 52,
      lg: 84,
      xl: 128,
    }[size];
  }, [size]);

  // State metadata: Colors, speed, scale, text
  const stateMeta = useMemo(() => {
    switch (state) {
      case 'listening':
        return {
          label: 'Listening...',
          color1: '#FF6B5E',
          color2: '#FFD43B',
          glow: 'rgba(255, 107, 94, 0.45)',
          speed: 1.2,
          scalePulse: [1, 1.15, 0.95, 1.08, 1],
        };
      case 'understanding':
        return {
          label: 'Parsing intent...',
          color1: '#FFD43B',
          color2: '#F59E0B',
          glow: 'rgba(255, 212, 59, 0.5)',
          speed: 1.8,
          scalePulse: [1, 1.05, 1],
        };
      case 'thinking':
        return {
          label: 'Thinking deeply...',
          color1: '#FFD43B',
          color2: '#FF6B5E',
          glow: 'rgba(255, 212, 59, 0.55)',
          speed: 2.2,
          scalePulse: [1, 1.08, 0.96, 1.05, 1],
        };
      case 'planning':
        return {
          label: 'Decomposing plan...',
          color1: '#F59E0B',
          color2: '#10B981',
          glow: 'rgba(245, 158, 11, 0.45)',
          speed: 1.5,
          scalePulse: [1, 1.04, 1],
        };
      case 'tool_selection':
        return {
          label: toolName ? `Selecting ${toolName}...` : 'Selecting tool...',
          color1: '#FFD43B',
          color2: '#3B82F6',
          glow: 'rgba(255, 212, 59, 0.4)',
          speed: 1.4,
          scalePulse: [1, 1.06, 0.98, 1],
        };
      case 'tool_execution':
        return {
          label: toolName ? `Executing ${toolName}...` : 'Executing tool...',
          color1: '#3B82F6',
          color2: '#FFD43B',
          glow: 'rgba(59, 130, 246, 0.5)',
          speed: 0.8,
          scalePulse: [1, 1.1, 1],
        };
      case 'generating':
        return {
          label: 'Synthesizing output...',
          color1: '#FFD43B',
          color2: '#FF4D4F',
          glow: 'rgba(255, 212, 59, 0.6)',
          speed: 1.0,
          scalePulse: [1, 1.12, 0.94, 1.06, 1],
        };
      case 'reviewing':
        return {
          label: 'Reviewing quality...',
          color1: '#10B981',
          color2: '#FFD43B',
          glow: 'rgba(16, 185, 129, 0.45)',
          speed: 1.6,
          scalePulse: [1, 1.03, 1],
        };
      case 'completed':
        return {
          label: 'Goal complete',
          color1: '#10B981',
          color2: '#059669',
          glow: 'rgba(16, 185, 129, 0.55)',
          speed: 3.0,
          scalePulse: [1, 1.12, 1],
        };
      case 'warning':
        return {
          label: 'Human approval required',
          color1: '#F59E0B',
          color2: '#D97706',
          glow: 'rgba(245, 158, 11, 0.6)',
          speed: 1.0,
          scalePulse: [1, 1.15, 1],
        };
      case 'failed':
        return {
          label: 'Operation interrupted',
          color1: '#FF4D4F',
          color2: '#DC2626',
          glow: 'rgba(255, 77, 79, 0.65)',
          speed: 0.6,
          scalePulse: [1, 1.08, 0.92, 1],
        };
      case 'idle':
      default:
        return {
          label: 'RIIQX Intelligent Core',
          color1: '#FFD43B',
          color2: '#FF6B5E',
          glow: 'rgba(255, 212, 59, 0.25)',
          speed: 4.0,
          scalePulse: [1, 1.03, 1],
        };
    }
  }, [state, toolName]);

  const radius = pixelSize / 2;
  const strokeWidth = Math.max(1.5, pixelSize * 0.04);

  return (
    <div
      className={`relative inline-flex flex-col items-center justify-center select-none ${className}`}
      onClick={onClick}
    >
      {/* Outer Atmospheric Glow */}
      <motion.div
        animate={{
          scale: stateMeta.scalePulse,
          opacity: [0.6, 0.85, 0.6],
        }}
        transition={{
          duration: stateMeta.speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          width: pixelSize * 1.3,
          height: pixelSize * 1.3,
          background: `radial-gradient(circle, ${stateMeta.glow} 0%, rgba(0,0,0,0) 70%)`,
        }}
        className="absolute rounded-full pointer-events-none filter blur-md"
      />

      {/* SVG Liquid & Neural Mesh */}
      <div
        style={{ width: pixelSize, height: pixelSize }}
        className="relative flex items-center justify-center cursor-pointer"
      >
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox={`0 0 ${pixelSize} ${pixelSize}`}
          className="overflow-visible"
        >
          <defs>
            {/* Primary Fluid Linear Gradient */}
            <linearGradient
              id={`orb-grad-${state}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={stateMeta.color1} />
              <stop offset="100%" stopColor={stateMeta.color2} />
            </linearGradient>

            {/* Glass Highlight Gradient */}
            <radialGradient
              id="orb-highlight"
              cx="35%"
              cy="35%"
              r="60%"
              fx="25%"
              fy="25%"
            >
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>

            {/* Liquid Filter / Turbulance */}
            <filter id={`orb-liquid-${state}`} x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur in="SourceGraphic" stdDeviation={pixelSize * 0.03} result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
                result="liquid"
              />
            </filter>
          </defs>

          {/* Rotating Orbital Particle Ring (Thinking, Executing, Generating) */}
          {(state === 'thinking' || state === 'generating' || state === 'tool_execution') && (
            <motion.circle
              cx={radius}
              cy={radius}
              r={radius * 1.15}
              fill="none"
              stroke={stateMeta.color1}
              strokeWidth={strokeWidth}
              strokeDasharray={`${pixelSize * 0.3} ${pixelSize * 0.4}`}
              strokeLinecap="round"
              opacity={0.7}
              animate={{ rotate: 360 }}
              transition={{
                duration: stateMeta.speed * 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{ transformOrigin: 'center' }}
            />
          )}

          {/* Neural Activity Interconnects */}
          {neuralActivity && (state === 'understanding' || state === 'planning' || state === 'thinking') && (
            <g opacity={0.65}>
              <motion.line
                x1={radius * 0.4}
                y1={radius * 0.5}
                x2={radius * 1.5}
                y2={radius * 1.4}
                stroke="#FFFFFF"
                strokeWidth={1}
                strokeDasharray="2 2"
                animate={{ opacity: [0.2, 0.9, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.line
                x1={radius * 1.5}
                y1={radius * 0.6}
                x2={radius * 0.6}
                y2={radius * 1.5}
                stroke="#FFFFFF"
                strokeWidth={1}
                strokeDasharray="2 2"
                animate={{ opacity: [0.8, 0.1, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              />
            </g>
          )}

          {/* Base Liquid Sphere */}
          <motion.circle
            cx={radius}
            cy={radius}
            r={radius * 0.85}
            fill={`url(#orb-grad-${state})`}
            animate={{
              scale: stateMeta.scalePulse,
            }}
            transition={{
              duration: stateMeta.speed,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Inner Liquid Morphing Core */}
          <motion.path
            d={`M ${radius * 0.4} ${radius} Q ${radius} ${radius * 0.3} ${radius * 1.6} ${radius} Q ${radius} ${radius * 1.7} ${radius * 0.4} ${radius}`}
            fill={stateMeta.color2}
            opacity={0.4}
            animate={{
              rotate: [0, 180, 360],
              scale: [0.9, 1.1, 0.9],
            }}
            transition={{
              duration: stateMeta.speed * 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{ transformOrigin: 'center' }}
          />

          {/* Liquid Glass Surface Highlight (Apple Liquid Glass Feel) */}
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.85}
            fill="url(#orb-highlight)"
            pointerEvents="none"
          />

          {/* Fine Outer Glass Rim */}
          <circle
            cx={radius}
            cy={radius}
            r={radius * 0.85}
            fill="none"
            stroke="rgba(255, 255, 255, 0.35)"
            strokeWidth={strokeWidth}
          />
        </svg>

        {/* Center Activity Pulse Dot for Small Sizes */}
        {pixelSize <= 36 && (
          <div
            style={{ backgroundColor: stateMeta.color1 }}
            className="absolute w-1.5 h-1.5 rounded-full shadow-xs"
          />
        )}
      </div>

      {/* Optional State Label */}
      {showLabel && (
        <div className="flex flex-col items-center mt-2 text-center pointer-events-none">
          <span className="text-[11px] font-bold tracking-tight text-[#202124] dark:text-[#F4F4F6]">
            {stateMeta.label}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-mono text-[#737373] dark:text-[#A1A1AA] mt-0.5">
            RIIQX Intelligence Core
          </span>
        </div>
      )}
    </div>
  );
}

