import React from 'react';
import { RiiqxEmblem } from './RiiqxEmblem';

interface RiiqxLogoProps {
  className?: string;
  size?: number;
  showTagline?: boolean;
  showPillTags?: boolean;
}

export function RiiqxLogo({
  className = '',
  size = 32,
  showTagline = false,
  showPillTags = false,
}: RiiqxLogoProps) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center gap-2.5">
        <RiiqxEmblem size={size} glow={false} />
        <div className="flex flex-col">
          <span className="font-extrabold text-xl tracking-tight leading-none text-slate-900 dark:text-white font-heading">
            RIIQX
          </span>
          {showTagline && (
            <span className="text-[10px] text-[#777D88] dark:text-slate-400 font-medium tracking-wide mt-0.5">
              Creator OS • AI Workspace • Social Growth
            </span>
          )}
        </div>
      </div>

      {showPillTags && (
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          {['Create', 'Edit', 'Schedule', 'Publish', 'Analyze', 'Grow'].map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-[9px] font-semibold bg-[#FFD43B]/15 text-[#202124] dark:bg-[#FFD43B]/20 dark:text-[#FFD43B] border border-[#FFD43B]/30"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
