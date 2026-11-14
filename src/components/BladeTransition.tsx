import React from 'react';

interface BladeTransitionProps {
  label?: string;
  variant?: 'red-to-white' | 'white-to-red' | 'editorial-split';
  skewAngle?: number;
}

/**
 * BladeTransition
 * Haute Couture Bridal Ribbon Separator.
 * Connects editorial chapters with soft curved geometry, warm antique champagne
 * hairlines, and refined serif typography — eliminating sharp, jarring slashes.
 */
export const BladeTransition: React.FC<BladeTransitionProps> = ({
  label = 'EDITORIAL TRANSITION',
  variant = 'white-to-red',
  skewAngle = 4
}) => {
  return (
    <div className="relative w-full overflow-hidden select-none pointer-events-none py-10 -my-4 z-20">
      {/* Background Soft Feather Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DEC596]/[0.08] to-transparent blur-xl" />

      {/* Haute Couture Editorial Hairline Separator */}
      <div className="max-w-7xl mx-auto px-6 md:px-14">
        <div className="w-full flex items-center justify-between gap-4 md:gap-8">
          {/* Left Hairline with Gradient Fade */}
          <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-[#DEC596]/35 to-[#DEC596]/60" />

          {/* Center Editorial Pill Cartouche */}
          <div className="shrink-0 flex items-center gap-3 px-6 py-2 rounded-full bg-[#120D17]/90 backdrop-blur-xl border border-[#DEC596]/30 shadow-[0_4px_25px_rgba(0,0,0,0.7),0_0_15px_rgba(222,197,150,0.1)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] shadow-[0_0_6px_rgba(222,197,150,0.8)]" />
            <span className="font-anton text-[#F5EEDC] text-[11px] md:text-xs tracking-[0.28em] uppercase">
              {label}
            </span>
            <span className="hidden sm:inline-block w-4 h-[1px] bg-[#DEC596]/40" />
            <span className="hidden sm:inline-block font-serif italic text-[11px] tracking-[0.2em] text-[#DEC596]/80">
              Couture Muse
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] shadow-[0_0_6px_rgba(222,197,150,0.8)]" />
          </div>

          {/* Right Hairline with Gradient Fade */}
          <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent via-[#DEC596]/35 to-[#DEC596]/60" />
        </div>
      </div>
    </div>
  );
};
