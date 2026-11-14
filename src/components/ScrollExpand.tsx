import React, {
  useState,
  useEffect,
  useRef,
  useCallback
} from 'react';

export interface ScrollExpandRenderProps {
  progress: number;
  phase: 'expand' | 'hold' | 'collapse';
  activeCardIndex: number;
  isExpanded: boolean;
  width: number;
  height: number;
  radius: number;
}

export interface ScrollExpandProps {
  src?: string;
  alt?: string;
  title?: string;
  subtitle?: string;
  scrollHint?: string;
  useWindowScroll?: boolean;
  pinHeight?: string;         // Scroll track height when useWindowScroll=true (default: '340vh')
  startWidth?: number;       // Starting width percentage (default: 44)
  startHeight?: number;      // Starting height percentage (default: 58)
  startRadius?: number;      // Starting border-radius in px (default: 24)
  endRadius?: number;        // Ending border-radius in px (default: 0)
  mediaZoom?: number;        // Zoom level when collapsed (default: 1.35)
  scrollDistance?: number;   // Scroll distance sensitivity multiplier (default: 1.2)
  holdDistance?: number;     // Hold distance ratio (default: 0.35)
  smoothing?: number;        // Smoothing factor (default: 0.1)
  overlayScrim?: number;     // Dark overlay scrim opacity (default: 0.45)
  enabled?: boolean;         // Animation active flag (default: true)
  reverseCollapse?: boolean; // Whether to close again after all photos/content finish (default: true)
  pExpandRatio?: number;    // Ratio where expansion finishes (default: 0.10 if reverseCollapse, else 0.20)
  pCollapseRatio?: number;  // Ratio where collapse begins (default: 0.90 if reverseCollapse, else 1.0)
  totalCards?: number;       // Number of items to distribute across hold phase (default: 5)
  onCardIndexChange?: (index: number) => void;
  onExpandStateChange?: (isExpanded: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode | ((props: ScrollExpandRenderProps) => React.ReactNode);
}

/**
 * ScrollExpand
 * Luxury frame expansion animation component.
 * When scrolling into view, smoothly expands from a framed portal (startWidth/startHeight/startRadius)
 * into a full-bleed viewport stage (100% / 0px radius).
 * After the internal content/photos complete their presentation, it smoothly contracts/closes
 * back down to the framed dimensions and resumes normal continuous page scroll.
 */
export const ScrollExpand: React.FC<ScrollExpandProps> = ({
  src,
  alt = 'Product hero',
  title = 'Built to scale',
  subtitle,
  scrollHint = 'Scroll inside the frame',
  useWindowScroll = false,
  pinHeight = '340vh',
  startWidth = 44,
  startHeight = 58,
  startRadius = 24,
  endRadius = 0,
  mediaZoom = 1.35,
  scrollDistance = 1.2,
  holdDistance = 0.35,
  smoothing = 0.1,
  overlayScrim = 0.45,
  enabled = true,
  reverseCollapse = true,
  pExpandRatio,
  pCollapseRatio,
  totalCards = 5,
  onCardIndexChange,
  onExpandStateChange,
  className = '',
  style = {},
  children
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartY = useRef<number | null>(null);

  // Responsive screen check
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(typeof window !== 'undefined' && window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // WINDOW SCROLL LISTENER (Pins section and derives progress from page scrolling)
  useEffect(() => {
    if (!useWindowScroll || !enabled) return;

    const handleWindowScroll = () => {
      if (!trackRef.current) return;
      const rect = trackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight || 800;
      const totalScrollable = rect.height - windowHeight;
      if (totalScrollable <= 0) return;

      const currentScroll = -rect.top;
      const rawProgress = currentScroll / totalScrollable;
      const clamped = Math.max(0, Math.min(1, rawProgress));
      setScrollProgress(clamped);
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    handleWindowScroll();

    // Hook to global Lenis instance for instantaneous frame-by-frame synchronization
    const globalLenis = typeof window !== 'undefined' ? (window as any).lenis : null;
    if (globalLenis && typeof globalLenis.on === 'function') {
      globalLenis.on('scroll', handleWindowScroll);
    }

    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
      if (globalLenis && typeof globalLenis.off === 'function') {
        globalLenis.off('scroll', handleWindowScroll);
      }
    };
  }, [useWindowScroll, enabled]);

  // CONTAINER MODE: Wheel listener when not using window scroll
  useEffect(() => {
    if (useWindowScroll || !enabled) return;
    const el = containerRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY;
      const step = (delta * 0.0018 * scrollDistance);
      setScrollProgress((prev) => Math.max(0, Math.min(1, prev + step)));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [useWindowScroll, enabled, scrollDistance]);

  // Touch handlers for both window scroll and container mode
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const clientY = e.touches[0].clientY;
    const diff = touchStartY.current - clientY;
    touchStartY.current = clientY;

    if (useWindowScroll) {
      if (typeof window !== 'undefined') {
        const globalLenis = (window as any).lenis;
        if (globalLenis && typeof globalLenis.scrollTo === 'function') {
          globalLenis.scrollTo(globalLenis.scroll + diff * 1.5, { immediate: true });
        } else {
          window.scrollBy({ top: diff * 1.5, behavior: 'instant' });
        }
      }
    } else {
      const step = diff * 0.0025 * scrollDistance;
      setScrollProgress((prev) => Math.max(0, Math.min(1, prev + step)));
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  // Interpolation Math
  const effectiveStartWidth = isMobile ? Math.max(startWidth, 84) : startWidth;
  const effectiveStartHeight = isMobile ? Math.max(startHeight, 68) : startHeight;

  // Split progress into 3 phases:
  // Phase 1: Expand [0 -> pExpand]
  // Phase 2: Hold & Content [pExpand -> pCollapse]
  // Phase 3: Collapse / Close [pCollapse -> 1.0]
  const pExpand = pExpandRatio ?? (reverseCollapse ? 0.10 : 0.20);
  const pCollapse = pCollapseRatio ?? (reverseCollapse ? 0.90 : 1.0);

  let widthPercent = 100;
  let heightPercent = 100;
  let currentRadius = endRadius;
  let currentZoom = 1.0;
  let currentScrim = 0;
  let currentCardIndex = 0;
  let currentPhase: 'expand' | 'hold' | 'collapse' = 'hold';

  if (scrollProgress <= pExpand) {
    currentPhase = 'expand';
    const t = Math.max(0, Math.min(1, scrollProgress / pExpand));
    // Smooth easeOutCubic
    const ease = 1 - Math.pow(1 - t, 3);
    widthPercent = effectiveStartWidth + (100 - effectiveStartWidth) * ease;
    heightPercent = effectiveStartHeight + (100 - effectiveStartHeight) * ease;
    currentRadius = startRadius + (endRadius - startRadius) * ease;
    currentZoom = mediaZoom + (1.0 - mediaZoom) * ease;
    currentScrim = overlayScrim * (1 - ease);
    currentCardIndex = 0;
  } else if (scrollProgress >= pCollapse && reverseCollapse) {
    currentPhase = 'collapse';
    const t = Math.max(0, Math.min(1, (scrollProgress - pCollapse) / (1 - pCollapse)));
    // Smooth easeInCubic
    const ease = t * t * t;
    widthPercent = 100 - (100 - effectiveStartWidth) * ease;
    heightPercent = 100 - (100 - effectiveStartHeight) * ease;
    currentRadius = endRadius + (startRadius - endRadius) * ease;
    currentZoom = 1.0 + (mediaZoom - 1.0) * ease;
    currentScrim = overlayScrim * ease;
    currentCardIndex = totalCards - 1;
  } else {
    currentPhase = 'hold';
    widthPercent = 100;
    heightPercent = 100;
    currentRadius = endRadius;
    currentZoom = 1.0;
    currentScrim = 0;

    // Distribute cards equally across the hold range
    const holdRange = pCollapse - pExpand;
    if (holdRange > 0) {
      const holdProgress = Math.max(0, Math.min(0.999999, (scrollProgress - pExpand) / holdRange));
      currentCardIndex = Math.min(totalCards - 1, Math.floor(holdProgress * totalCards));
    }
  }

  const isFullyExpanded = widthPercent >= 98 && heightPercent >= 98;

  // Notify parent callbacks when card or expand state changes
  useEffect(() => {
    if (onCardIndexChange) onCardIndexChange(currentCardIndex);
  }, [currentCardIndex, onCardIndexChange]);

  useEffect(() => {
    if (onExpandStateChange) onExpandStateChange(isFullyExpanded);
  }, [isFullyExpanded, onExpandStateChange]);

  const renderProps: ScrollExpandRenderProps = {
    progress: scrollProgress,
    phase: currentPhase,
    activeCardIndex: currentCardIndex,
    isExpanded: isFullyExpanded,
    width: widthPercent,
    height: heightPercent,
    radius: currentRadius
  };

  // Frame container styling
  const frameStyle: React.CSSProperties = {
    width: `${widthPercent}%`,
    height: `${heightPercent}%`,
    borderRadius: `${currentRadius}px`,
    transition: smoothing > 0 ? `width 0.15s ease-out, height 0.15s ease-out, border-radius 0.15s ease-out` : undefined
  };

  const frameContent = (
    <div
      ref={containerRef}
      data-lenis-prevent={!useWindowScroll ? 'true' : undefined}
      tabIndex={0}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={!useWindowScroll ? { height: '100%', width: '100%', ...style } : undefined}
      className={`relative w-full h-full flex items-center justify-center overflow-hidden select-none outline-none touch-pan-y ${className}`}
      aria-label="ScrollExpand Container"
      role="region"
    >
      {/* EXPANDING LUXURY FRAME */}
      <div
        style={frameStyle}
        className={`relative overflow-hidden flex flex-col justify-center items-center transition-shadow duration-500 touch-pan-y ${
          isFullyExpanded
            ? 'border-none shadow-none rounded-none'
            : 'border border-[#DEC596]/35 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(222,197,150,0.15)] bg-gradient-to-br from-[#18131F]/98 via-[#221727]/98 to-[#141018]/98'
        }`}
      >
        {/* Standalone Media Layer if 'src' prop is provided */}
        {src && (
          <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <img
              src={src}
              alt={alt}
              style={{
                transform: `scale(${currentZoom})`,
                transition: 'transform 0.2s ease-out'
              }}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {currentScrim > 0 && (
              <div
                style={{ opacity: currentScrim }}
                className="absolute inset-0 bg-black transition-opacity duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B090C]/80 via-transparent to-transparent" />
          </div>
        )}

        {/* Standalone Title & Caption Overlay (when src and no render function) */}
        {src && typeof children !== 'function' && (title || subtitle) && (
          <div className="absolute inset-x-8 bottom-10 z-10 text-white space-y-2 pointer-events-none">
            {title && (
              <h2 className="font-anton text-2xl sm:text-4xl uppercase tracking-wider text-[#F5EEDC] drop-shadow-lg">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="font-sans text-xs sm:text-sm text-[#FAF7F2]/80 max-w-xl drop-shadow">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Scroll Hint Pill (shown initially before full expansion) */}
        {!isFullyExpanded && scrollHint && (
          <div className="absolute bottom-5 z-20 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B090C]/85 border border-[#DEC596]/35 backdrop-blur-md shadow-md text-[#DEC596] text-[10px] uppercase font-sans tracking-[0.2em] font-semibold animate-pulse-subtle pointer-events-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596]" />
            <span>{scrollHint}</span>
            <span>↕</span>
          </div>
        )}

        {/* Main Content Slot (Function render prop or nested elements) */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
          {typeof children === 'function' ? (
            children(renderProps)
          ) : children ? (
            /* Direct Children (User snippet: <h2>Every pixel, everywhere</h2><p>...</p>) */
            <div className="relative z-10 p-8 sm:p-12 text-[#FAF7F2] max-w-2xl text-center space-y-4">
              {children}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );

  // If WINDOW SCROLL: Wrap with outer pinning track
  if (useWindowScroll) {
    return (
      <div
        ref={trackRef}
        style={{ height: pinHeight, ...style }}
        className={`relative w-full touch-pan-y ${className}`}
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden touch-pan-y">
          {frameContent}
        </div>
      </div>
    );
  }

  // CONTAINER MODE: Render directly
  return frameContent;
};

export default ScrollExpand;
