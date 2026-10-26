import React from 'react';

interface RiiqxEmblemProps {
  className?: string;
  size?: number;
  glow?: boolean;
}

export function RiiqxEmblem({ className = '', size = 32, glow = true }: RiiqxEmblemProps) {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {glow && (
        <div
          className="absolute -inset-1 rounded-xl bg-gradient-to-r from-cyan-500/30 via-blue-500/20 to-violet-600/30 blur-sm opacity-70 animate-pulse pointer-events-none"
          style={{ filter: 'blur(6px)' }}
        />
      )}
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 w-full h-full drop-shadow-md"
      >
        <defs>
          <linearGradient id="riiqxGrad1" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="0.5" stopColor="#3B82F6" />
            <stop offset="1" stopColor="#8B5CF6" />
          </linearGradient>
          <linearGradient id="riiqxGrad2" x1="44" y1="4" x2="4" y2="44" gradientUnits="userSpaceOnUse">
            <stop stopColor="#22D3EE" />
            <stop offset="1" stopColor="#A855F7" />
          </linearGradient>
        </defs>

        {/* Outer Angular Shield / Aperture */}
        <path
          d="M24 4L42 14V34L24 44L6 34V14L24 4Z"
          stroke="url(#riiqxGrad1)"
          strokeWidth="2.5"
          strokeLinejoin="round"
          className="opacity-90"
        />

        {/* Dynamic Chevron Matrix (RIIQX Focus Core) */}
        <path
          d="M17 18L24 13L31 18V30L24 35L17 30V18Z"
          fill="url(#riiqxGrad2)"
          fillOpacity="0.2"
          stroke="url(#riiqxGrad2)"
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Precision Target Node (One Goal. Gets It Done.) */}
        <circle cx="24" cy="24" r="3.5" fill="#22D3EE" />
        <circle cx="24" cy="24" r="6" stroke="#06B6D4" strokeWidth="1" strokeDasharray="2 2" className="animate-spin-slow" />
      </svg>
    </div>
  );
}
