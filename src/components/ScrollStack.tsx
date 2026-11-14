import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  Children,
  isValidElement
} from 'react';

export interface ScrollStackProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  mode?: 'pin' | 'container';  // 'pin' = sticky viewport scroll (default for page sections); 'container' = fixed height
  pinHeight?: string;         // Scroll track height when mode="pin" (default: '320vh')
  itemScale?: number;         // Scale reduction factor per stacked card (default: 0.05)
  baseScale?: number;         // Minimum scale of stacked card (default: 0.85)
  dimAmount?: number;         // Opacity reduction factor per stacked card (default: 0.22)
  blurAmount?: number;        // Blur in px per stacked card (default: 0)
  itemStackDistance?: number; // Horizontal offset in px for stacked cards (default: 36)
  direction?: 'right-to-left' | 'left-to-right' | 'vertical'; // Default: 'right-to-left'
  showControls?: boolean;     // Show Previous / Next buttons (default: false)
  showProgress?: boolean;     // Show pagination dots / indicator (default: false)
  showHeader?: boolean;       // Show top direction header strip (default: false)
  controlledIndex?: number;   // External controlled active index (e.g. from ScrollExpand)
  onCardChange?: (index: number) => void;
  onStackComplete?: () => void;
}

export interface ScrollStackItemProps {
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  badge?: string;
  image?: string;
  imageAlt?: string;
  category?: string;
  title?: string;
  description?: string;
  designer?: string;
  lens?: string;
  tags?: string[];
  onInspect?: () => void;
  onClick?: () => void;
}

/**
 * ScrollStackItem
 * Individual card container within a ScrollStack.
 * Supports both rich bridal layout (image + metadata) and custom children (h2, p, etc.).
 */
export const ScrollStackItem: React.FC<ScrollStackItemProps> = ({
  children,
  className = '',
  style = {},
  badge,
  image,
  imageAlt,
  category,
  title,
  description,
  designer,
  lens,
  tags,
  onInspect,
  onClick
}) => {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative w-full h-full overflow-hidden select-none text-[#FAF7F2] touch-pan-y ${className}`}
    >
      {/* Full-Bleed Photograph Layer - Edge-to-Edge Full Viewport */}
      {image && (
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src={image}
            alt={imageAlt || title || 'Bridal Silhouette'}
            className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
            loading="lazy"
          />
          {/* Subtle multi-directional luxury vignettes ensuring text readability without dimming the photo */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B090C]/95 via-[#0B090C]/35 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B090C]/75 via-[#0B090C]/20 to-transparent pointer-events-none" />
        </div>
      )}

      {/* Top Badge */}
      {badge && (
        <div className="absolute top-6 right-6 sm:top-8 sm:right-10 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B090C]/80 border border-[#DEC596]/40 backdrop-blur-md shadow-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] shadow-[0_0_8px_rgba(222,197,150,0.8)]" />
          <span className="text-[10px] sm:text-xs uppercase font-sans tracking-[0.22em] text-[#DEC596] font-semibold">
            {badge}
          </span>
        </div>
      )}

      {/* Floating Bottom-Left Editorial Showcase */}
      {image ? (
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-12 sm:right-auto z-20 max-w-2xl space-y-3 sm:space-y-4 pointer-events-auto">
          {category && (
            <div className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596]" />
              <span>{category}</span>
            </div>
          )}
          {title && (
            <h2 className="font-anton text-3xl sm:text-5xl md:text-6xl uppercase tracking-wider text-[#F5EEDC] leading-none drop-shadow-md">
              {title}
            </h2>
          )}
          {description && (
            <p className="font-sans text-xs sm:text-sm md:text-base text-[#FAF7F2]/90 leading-relaxed max-w-xl drop-shadow line-clamp-3 sm:line-clamp-none">
              {description}
            </p>
          )}

          {/* Custom Content Slot if passed */}
          {children}

          {/* Designer & Lens Credits */}
          {(designer || lens) && (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-xs font-sans text-[#FAF7F2]/80">
              {designer && (
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#DEC596] block font-semibold">
                    Couturier / House
                  </span>
                  <span className="font-medium text-[#FAF7F2]">{designer}</span>
                </div>
              )}
              {lens && (
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-[#DEC596] block font-semibold">
                    Photography
                  </span>
                  <span className="font-medium text-[#FAF7F2]">{lens}</span>
                </div>
              )}
            </div>
          )}

          {/* Tags & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            {onInspect && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onInspect();
                }}
                className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#DEC596] to-[#F5EEDC] hover:shadow-[0_0_25px_rgba(222,197,150,0.5)] text-[#0B090C] text-[11px] uppercase tracking-[0.2em] font-semibold transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>Inspect Look</span>
                <span>↗</span>
              </button>
            )}
            {tags &&
              tags.map((t, idx) => (
                <span
                  key={idx}
                  className="text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-[#120D17]/85 border border-[#DEC596]/30 text-[#FAF7F2]/90 backdrop-blur-md font-medium"
                >
                  {t}
                </span>
              ))}
          </div>
        </div>
      ) : (
        /* Standalone Children Layout (User snippet: <h2>Card 1</h2><p>...</p>) */
        <div className="relative z-10 flex flex-col justify-center items-center h-full w-full p-8 sm:p-16 text-center space-y-4">
          <div className="max-w-2xl space-y-4">{children}</div>
          <div className="pt-3 border-t border-[#DEC596]/15 flex items-center justify-between text-xs font-sans text-[#DEC596] w-full max-w-md">
            <span>Horizontal Motion</span>
            <span>Right → Left ➔</span>
          </div>
        </div>
      )}

      {/* Subtle Polki Gold Accent Sheen */}
      <div className="absolute -bottom-16 -right-16 w-56 h-56 rounded-full bg-[#DEC596]/5 blur-3xl pointer-events-none" />
    </div>
  );
};

/**
 * ScrollStack
 * Stacking card slider animation with Right-to-Left directional motion.
 * In 'pin' mode (default), the section pins into viewport and page scrolling drives
 * the right-to-left card stacking naturally, resuming normal scroll when finished.
 * In 'container' mode, fits inside a fixed container (e.g. style={{ height: 600 }}).
 */
export const ScrollStack: React.FC<ScrollStackProps> = ({
  children,
  className = '',
  style = {},
  mode = 'container',
  pinHeight = '320vh',
  itemScale = 0.05,
  baseScale = 0.85,
  dimAmount = 0.22,
  blurAmount = 0,
  itemStackDistance = 36,
  direction = 'right-to-left',
  showControls = false,
  showProgress = false,
  showHeader = false,
  controlledIndex,
  onCardChange,
  onStackComplete
}) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0);
  const activeIndex = controlledIndex !== undefined ? controlledIndex : internalActiveIndex;
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const isWheelingRef = useRef(false);
  const wheelTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const items = Children.toArray(children).filter(isValidElement);
  const totalItems = items.length;

  const goToCard = useCallback(
    (newIndex: number) => {
      const clamped = Math.max(0, Math.min(newIndex, totalItems - 1));
      if (controlledIndex === undefined) {
        setInternalActiveIndex(clamped);
      }
      if (onCardChange) onCardChange(clamped);
      if (clamped === totalItems - 1 && onStackComplete) {
        onStackComplete();
      }

      // If in pin mode, smoothly align page scroll to that card fraction
      if (mode === 'pin' && trackRef.current && typeof window !== 'undefined') {
        const rect = trackRef.current.getBoundingClientRect();
        const currentScrollY = window.scrollY;
        const trackTop = currentScrollY + rect.top;
        const totalScrollable = rect.height - window.innerHeight;
        const targetScroll = trackTop + (clamped / Math.max(1, totalItems - 1)) * totalScrollable;
        window.scrollTo({ top: targetScroll, behavior: 'smooth' });
      }
    },
    [totalItems, onCardChange, onStackComplete, mode]
  );

  const handleNext = useCallback(() => {
    if (activeIndex < totalItems - 1) {
      goToCard(activeIndex + 1);
    }
  }, [activeIndex, totalItems, goToCard]);

  const handlePrev = useCallback(() => {
    if (activeIndex > 0) {
      goToCard(activeIndex - 1);
    }
  }, [activeIndex, goToCard]);

  // PIN MODE: Synchronize cards directly with page scroll
  useEffect(() => {
    if (mode !== 'pin') return;

    const handleWindowScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / totalScrollable));
      setScrollProgress(progress);

      const activeFraction = progress * (totalItems - 1);
      const newActive = Math.min(totalItems - 1, Math.round(activeFraction));
      if (controlledIndex === undefined && newActive !== activeIndex) {
        setInternalActiveIndex(newActive);
        if (onCardChange) onCardChange(newActive);
        if (newActive === totalItems - 1 && onStackComplete) {
          onStackComplete();
        }
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [mode, totalItems, activeIndex, onCardChange, onStackComplete]);

  // CONTAINER MODE: Wheel listener translates vertical scroll into right-to-left card sliding
  // Only active in standalone container mode when NOT controlled by an outer scroll driver (like ScrollExpand)
  useEffect(() => {
    if (mode === 'pin' || controlledIndex !== undefined) return;
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isWheelingRef.current) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(delta) < 20) return;

      isWheelingRef.current = true;
      if (delta > 0) {
        handleNext();
      } else {
        handlePrev();
      }

      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
      wheelTimeoutRef.current = setTimeout(() => {
        isWheelingRef.current = false;
      }, 350);
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) clearTimeout(wheelTimeoutRef.current);
    };
  }, [mode, controlledIndex, handleNext, handlePrev]);

  // Touch & Drag Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    // In pin mode or when controlled by outer scroll driver, let page scroll handle touch naturally
    if (mode === 'pin' || controlledIndex !== undefined) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    touchStartX.current = clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (mode === 'pin' || controlledIndex !== undefined || touchStartX.current === null) return;
    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX;
    const diff = clientX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(diff) > 40) {
      const isRightToLeft = direction === 'right-to-left';
      if (isRightToLeft) {
        // In Right-to-Left: swipe left (diff < 0) advances to next card; swipe right goes back
        if (diff < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      } else {
        // In Left-to-Right: swipe right (diff > 0) advances to next card; swipe left goes back
        if (diff > 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      handleNext();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      handlePrev();
    }
  };

  const stackContent = (
    <div
      ref={containerRef}
      data-lenis-prevent={mode === 'container' && controlledIndex === undefined ? 'true' : undefined}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      style={mode === 'container' ? style : undefined}
      className={`relative w-full h-full flex flex-col justify-center overflow-hidden select-none outline-none group touch-pan-y ${className}`}
      aria-label={`ScrollStack Slider (${direction === 'right-to-left' ? 'Right to Left' : 'Left to Right'})`}
      role="region"
    >
      {/* Top Header Strip: Direction & Current Position (optional) */}
      {showHeader && (
        <div className="relative z-20 flex items-center justify-between px-6 sm:px-10 pt-4 text-xs font-sans">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
              HORIZONTAL SCROLL STACK
            </span>
          </div>
          <div className="flex items-center gap-2 bg-[#0B090C]/65 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#DEC596]/25 text-[10px] tracking-widest uppercase text-[#FAF7F2]/80">
            <span>Direction:</span>
            <span className="text-[#DEC596] font-semibold">
              {direction === 'right-to-left' ? 'Right → Left ➔' : 'Left → Right ➔'}
            </span>
          </div>
        </div>
      )}

      {/* Card Arena: Full-bleed slides animated horizontally from Right to Left */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {items.map((child, index) => {
          const isCurrent = index === activeIndex;
          const isStacked = index < activeIndex; // Slid across to the left
          const isUpcoming = index > activeIndex; // Waiting to slide in from right to left
          const isRightToLeft = direction === 'right-to-left';

          let transform = 'translate3d(0, 0, 0)';
          let opacity = 1;
          let zIndex = 20;
          let pointerEvents: 'auto' | 'none' = 'none';

          if (isCurrent) {
            transform = 'translate3d(0, 0, 0)';
            opacity = 1;
            zIndex = 20;
            pointerEvents = 'auto';
          } else if (isStacked) {
            const diff = activeIndex - index;
            // Slid offscreen to the left (-100%)
            const exitOffset = isRightToLeft ? '-100%' : '100%';
            transform = `translate3d(${exitOffset}, 0, 0)`;
            opacity = diff === 1 ? 0.3 : 0;
            zIndex = 10 - diff;
            pointerEvents = 'none';
          } else if (isUpcoming) {
            // Waiting offscreen to the right (+100%)
            const enterOffset = isRightToLeft ? '100%' : '-100%';
            transform = `translate3d(${enterOffset}, 0, 0)`;
            opacity = 1;
            zIndex = 25 + (totalItems - index);
            pointerEvents = 'none';
          }

          return (
            <div
              key={index}
              onClick={() => {
                if (index !== activeIndex) goToCard(index);
              }}
              style={{
                transform,
                opacity,
                zIndex,
                pointerEvents,
                transition:
                  'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease'
              }}
              className="absolute inset-0 w-full h-full cursor-pointer"
              aria-hidden={!isCurrent}
            >
              {child}
            </div>
          );
        })}
      </div>

      {/* Bottom Controls Strip */}
      {(showControls || showProgress) && (
        <div className="relative z-20 flex items-center justify-between px-6 sm:px-10 pb-5 pt-2">
          {showControls ? (
            <button
              onClick={handlePrev}
              disabled={activeIndex === 0}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all cursor-pointer ${
                activeIndex === 0
                  ? 'border-white/10 text-white/30 cursor-not-allowed bg-transparent'
                  : 'border-[#DEC596]/40 text-[#DEC596] hover:bg-[#DEC596] hover:text-[#0B090C] bg-[#141018]/85 backdrop-blur-md shadow-md'
              }`}
              aria-label="Previous card in stack"
            >
              <span>←</span>
              <span className="hidden sm:inline font-semibold">Previous</span>
            </button>
          ) : (
            <div />
          )}

          {showProgress && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                {items.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToCard(i)}
                    className={`transition-all duration-300 rounded-full cursor-pointer ${
                      i === activeIndex
                        ? 'w-7 h-2 bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]'
                        : 'w-2 h-2 bg-white/25 hover:bg-white/50'
                    }`}
                    aria-label={`Go to card ${i + 1}`}
                  />
                ))}
              </div>
              <span className="font-mono text-xs text-[#FAF7F2]/80 font-semibold">
                0{activeIndex + 1} / 0{totalItems}
              </span>
            </div>
          )}

          {showControls ? (
            <button
              onClick={handleNext}
              disabled={activeIndex === totalItems - 1}
              className={`flex items-center gap-2 text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all cursor-pointer ${
                activeIndex === totalItems - 1
                  ? 'border-white/10 text-white/30 cursor-not-allowed bg-transparent'
                  : 'border-[#DEC596]/40 text-[#DEC596] hover:bg-[#DEC596] hover:text-[#0B090C] bg-[#141018]/85 backdrop-blur-md shadow-md'
              }`}
              aria-label="Next card in stack"
            >
              <span className="hidden sm:inline font-semibold">Next</span>
              <span>→</span>
            </button>
          ) : (
            <div />
          )}
        </div>
      )}
    </div>
  );

  // If PIN MODE: Wrap inside an outer scroll-track with sticky viewport pinning
  if (mode === 'pin') {
    return (
      <div
        ref={trackRef}
        style={{ height: pinHeight, ...style }}
        className={`relative w-full ${className}`}
      >
        <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden">
          {stackContent}
        </div>
      </div>
    );
  }

  // CONTAINER MODE: Render directly
  return stackContent;
};

export default ScrollStack;
