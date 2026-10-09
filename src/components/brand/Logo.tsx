'use client';

// =============================================================================
// PujaHop Kolkata: Brand Identity & Official Emblem
// Design: Bengali Festival Alpona Motif • Dhak Drum Curves • Saffron & Vermilion
// =============================================================================

import React from 'react';

interface LogoProps {
  variant?: 'horizontal' | 'stacked' | 'icon';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export function Logo({
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
  className = '',
}: LogoProps) {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const IconSvg = (
    <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_12px_rgba(225,29,72,0.4)]"
      >
        <circle cx="32" cy="32" r="30" fill="#151226" stroke="#F59E0B" strokeWidth="1.5" />
        <path
          d="M32 8C33.5 18 46 20 46 32C46 41 39 48 32 54C25 48 18 41 18 32C18 20 30.5 18 32 8Z"
          fill="url(#festiveGrad)"
        />
        <circle cx="32" cy="32" r="6" fill="#FDE047" />
        <path
          d="M26 44C29 47 35 47 38 44"
          stroke="#F59E0B"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M16 32C20 28 20 36 24 32"
          stroke="#FFFBEB"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <path
          d="M48 32C44 28 44 36 40 32"
          stroke="#FFFBEB"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <defs>
          <linearGradient id="festiveGrad" x1="18" y1="8" x2="46" y2="54" gradientUnits="userSpaceOnUse">
            <stop stopColor="#E11D48" />
            <stop offset="0.6" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#EA580C" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return <div className={`inline-flex items-center ${className}`}>{IconSvg}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2 sm:gap-2.5 min-w-0 shrink-0 ${className}`}>
      {IconSvg}
      <div className="flex flex-col leading-tight min-w-0">
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <span className={`font-extrabold tracking-tight text-white ${textSizes[size]}`}>
            PujaHop
          </span>
          <span className="hidden min-[380px]:inline bg-gradient-to-r from-amber-400 via-rose-500 to-red-500 bg-clip-text font-black text-transparent">
            Kolkata
          </span>
        </div>
        {showTagline && (
          <span className="text-[10px] font-medium tracking-wide text-amber-200/70 truncate hidden sm:inline">
            One Day. One City. Maximum Puja.
          </span>
        )}
      </div>
    </div>
  );
}
