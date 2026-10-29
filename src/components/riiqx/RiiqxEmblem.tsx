import React from 'react';

interface RiiqxEmblemProps {
  className?: string;
  size?: number;
  glow?: boolean;
  variant?: 'gradient' | 'white' | 'dark';
}

export function RiiqxEmblem({
  className = '',
  size = 32,
  glow = false,
  variant = 'gradient',
}: RiiqxEmblemProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-[#FFD43B] to-[#FF6B5E] blur-md opacity-50 pointer-events-none"
        />
      )}
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-xs"
      >
        <defs>
          <linearGradient id="riiqxYellowCoralGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFD43B" />
            <stop offset="1" stopColor="#FF6B5E" />
          </linearGradient>
          <linearGradient id="riiqxStemGrad" x1="20" y1="20" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFFFFF" />
            <stop offset="1" stopColor="#FFF8E7" />
          </linearGradient>
        </defs>

        {/* Squircle Background for App Icon style */}
        {variant === 'gradient' && (
          <rect width="100" height="100" rx="26" fill="url(#riiqxYellowCoralGrad)" />
        )}

        {/* Geometric 'R' Monogram - High-contrast crisp geometry */}
        {/* 1. Left Vertical Stem */}
        <rect
          x="24"
          y="22"
          width="13"
          height="56"
          rx="6.5"
          fill={variant === 'gradient' ? '#202124' : 'currentColor'}
        />

        {/* 2. Upper Dynamic Loop */}
        <path
          d="M32 22H52C63.0457 22 72 30.9543 72 42C72 53.0457 63.0457 62 52 62H32V49H51C54.866 49 58 45.866 58 42C58 38.134 54.866 35 51 35H32V22Z"
          fill={variant === 'gradient' ? '#202124' : 'currentColor'}
        />

        {/* 3. Forward-Slanted Dynamic Leg */}
        <path
          d="M48 54L68 76C70 78 74 78 75.5 75.5C77 73 76.5 69.5 73.5 66.5L56 49H45L48 54Z"
          fill={variant === 'gradient' ? '#202124' : 'currentColor'}
        />
      </svg>
    </div>
  );
}
