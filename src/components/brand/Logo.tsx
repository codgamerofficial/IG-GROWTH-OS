'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { brandConfig } from '@/lib/brand/config';

export type LogoVariant = 'icon' | 'horizontal' | 'stacked' | 'light' | 'dark' | 'monochrome';
export type LogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface LogoProps {
  variant?: LogoVariant;
  size?: LogoSize;
  className?: string;
  showTagline?: boolean;
  animated?: boolean;
  href?: string;
  priority?: boolean;
}

const sizeMap: Record<LogoSize, { iconSize: number; titleClass: string; taglineClass: string }> = {
  xs: {
    iconSize: 22,
    titleClass: 'text-sm font-extrabold',
    taglineClass: 'text-[9px] tracking-widest',
  },
  sm: {
    iconSize: 32,
    titleClass: 'text-base font-extrabold',
    taglineClass: 'text-[10px] tracking-widest',
  },
  md: {
    iconSize: 42,
    titleClass: 'text-xl font-black',
    taglineClass: 'text-[11px] tracking-widest',
  },
  lg: {
    iconSize: 56,
    titleClass: 'text-2xl font-black',
    taglineClass: 'text-xs tracking-widest',
  },
  xl: {
    iconSize: 84,
    titleClass: 'text-4xl font-black',
    taglineClass: 'text-sm tracking-widest',
  },
};

export function Logo({
  variant = 'horizontal',
  size = 'md',
  className = '',
  showTagline = true,
  animated = false,
  href,
  priority = false,
}: LogoProps) {
  const { iconSize, titleClass, taglineClass } = sizeMap[size];

  const iconElement = (
    <div
      className={`relative flex items-center justify-center shrink-0 rounded-xl overflow-hidden transition-all duration-300 ${
        animated ? 'animate-pulse drop-shadow-[0_0_16px_rgba(236,72,153,0.45)]' : ''
      }`}
      style={{ width: iconSize, height: iconSize }}
    >
      {/* 3D Glassmorphic Master Icon with Upward Growth Arrow */}
      <Image
        src="/brand/icon-192.png"
        alt={brandConfig.name}
        width={iconSize}
        height={iconSize}
        className="w-full h-full object-contain select-none"
        priority={priority}
      />
    </div>
  );

  if (variant === 'icon') {
    if (href) {
      return (
        <Link href={href} className={`inline-flex items-center ${className}`} aria-label={brandConfig.name}>
          {iconElement}
        </Link>
      );
    }
    return <div className={`inline-flex items-center ${className}`}>{iconElement}</div>;
  }

  const wordmark = (
    <div className="flex flex-col select-none leading-none">
      <div className={`tracking-tight flex items-center gap-1 ${titleClass}`}>
        <span className="text-white">IG</span>
        <span className="text-slate-100">Growth</span>
        <span className="brand-gradient-text drop-shadow-[0_0_12px_rgba(236,72,153,0.35)]">OS</span>
      </div>
      {showTagline && (
        <span className={`text-slate-400 font-bold uppercase mt-1 ${taglineClass}`}>
          {brandConfig.tagline}
        </span>
      )}
    </div>
  );

  if (variant === 'stacked') {
    const content = (
      <div className={`flex flex-col items-center text-center gap-3 ${className}`}>
        {iconElement}
        {wordmark}
      </div>
    );
    if (href) {
      return (
        <Link href={href} className="inline-block" aria-label={brandConfig.name}>
          {content}
        </Link>
      );
    }
    return content;
  }

  // Default: Horizontal lockup
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      {iconElement}
      {wordmark}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center" aria-label={brandConfig.name}>
        {content}
      </Link>
    );
  }

  return content;
}

export default Logo;
