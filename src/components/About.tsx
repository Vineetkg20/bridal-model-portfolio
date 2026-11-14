import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { WEBSITE_CONTENT } from '../data';
import { AnimatedNumber } from '@/components/core/animated-number';

export const About: React.FC = () => {
  const { content, viewMode, activePage } = useContent();
  const [isStatsInView, setIsStatsInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const aboutConfig = content?.about || WEBSITE_CONTENT.about;

  useEffect(() => {
    // If IntersectionObserver is unavailable, immediately activate
    if (typeof IntersectionObserver === 'undefined') {
      setIsStatsInView(true);
      return;
    }

    // Observer specifically watching the achievements container
    // so animation starts AT THE MOMENT the user actually reaches the section
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          if (entry.isIntersecting) {
            setIsStatsInView(true);
          } else {
            // Reset when leaving view so returning to the section triggers the animation again
            setIsStatsInView(false);
          }
        }
      },
      {
        threshold: 0.15, // Triggers when 15% of the achievements container enters viewport
        rootMargin: '0px 0px -30px 0px'
      }
    );

    const target = statsRef.current;
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
      observer.disconnect();
    };
  }, [viewMode, activePage]);

  const visibleStatistics = (aboutConfig.statistics || []).filter((s) => !s?.isHidden);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full py-24 md:py-32 bg-transparent text-[#FAF7F2] px-6 md:px-14 border-t border-[#DEC596]/15 overflow-hidden"
    >
      {/* Background Subtle Ambient Texture */}
      {aboutConfig.watermarkText ? (
        <div className="absolute right-4 bottom-10 font-anton text-[22vw] text-white/[0.02] select-none pointer-events-none leading-none">
          {aboutConfig.watermarkText}
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-4">
          <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
            {aboutConfig.badge}
          </span>
        </div>

        {/* Asymmetrical Editorial Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start mt-8">
          {/* Left Column: Portrait Study & Measurements */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50 rounded-3xl border border-[#DEC596]/30 shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_35px_rgba(222,197,150,0.12)] group">
              <img
                src={aboutConfig.portrait.src}
                alt={aboutConfig.portrait.alt}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                style={{ objectPosition: aboutConfig.portrait.focalPoint || 'center top' }}
                loading="lazy"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-[#140F1B]/95 backdrop-blur-2xl p-5 rounded-2xl border border-[#DEC596]/25 shadow-xl">
                <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-[#F5EEDC] block mb-1">
                  {aboutConfig.portraitBadge}
                </span>
                <p className="text-xs font-sans text-[#FAF7F2]/85 leading-snug">
                  {aboutConfig.portraitCaption}
                </p>
              </div>
            </div>

            {/* Model Measurements Table (Official Casting Comp Card Format) */}
            {aboutConfig.measurements && aboutConfig.measurements.length > 0 && (
              <div className="mt-8 luxury-card p-6 md:p-8">
                <h4 className="font-anton text-sm tracking-widest text-[#F5EEDC] uppercase mb-5 flex items-center justify-between border-b border-[#DEC596]/20 pb-3.5">
                  <span>{aboutConfig.measurementsTitle}</span>
                  <span className="text-[10px] font-sans text-[#DEC596]/70 uppercase tracking-widest font-normal">
                    {aboutConfig.measurementsSub}
                  </span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-5 text-xs font-sans">
                  {aboutConfig.measurements.map((m, mIdx) => (
                    <div key={mIdx} className="space-y-0.5">
                      <span className="text-[#FAF7F2]/50 uppercase block text-[10px] font-medium tracking-wider">
                        {m.label}
                      </span>
                      <span className="font-semibold text-[#FAF7F2] tracking-wide">{m.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Editorial Copy & Personal Manifesto */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-8">
            <div>
              <h3 className="font-anton text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase leading-[0.95] text-[#FAF7F2]">
                {aboutConfig.heading}
              </h3>
              <div className="w-24 h-[2px] bg-gradient-to-r from-[#DEC596] via-[#DEC596]/50 to-transparent my-6" />

              {/* Personal Introduction */}
              <p className="text-sm md:text-base font-sans text-[#FAF7F2]/90 leading-relaxed mb-6 font-normal">
                {aboutConfig.intro}
              </p>

              {/* Bridal Approach in Luxury Glass Card */}
              <div className="luxury-card p-6 md:p-8 mb-6 relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] shadow-[0_0_8px_rgba(222,197,150,0.8)]" />
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#DEC596] block">
                    {aboutConfig.craftBadge}
                  </span>
                </div>
                <p className="text-xs md:text-sm font-serif italic text-[#FAF7F2]/90 leading-relaxed">
                  "{aboutConfig.craftText}"
                </p>
              </div>

              {/* Personal Manifesto */}
              <div className="space-y-3">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#DEC596]/80 block">
                  {aboutConfig.manifestoBadge}
                </span>
                <p className="text-xs md:text-sm font-sans text-[#FAF7F2]/85 leading-relaxed font-normal">
                  {aboutConfig.manifestoText}
                </p>
              </div>
            </div>

            {/* THREE LARGE EDITORIAL COUNTERS / HIGHLIGHTS WITH SLIDING NUMBERS */}
            {visibleStatistics.length > 0 && (
              <div ref={statsRef} className="border-t border-[#DEC596]/15 pt-8">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#DEC596] block">
                    {aboutConfig.statisticsBadge}
                  </span>
                  <div className="hidden md:flex items-center gap-2 text-xs text-[#FAF7F2]/50 font-sans tracking-widest uppercase">
                    <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isStatsInView ? 'bg-[#DEC596] shadow-[0_0_8px_rgba(222,197,150,0.8)]' : 'bg-white/20'}`} />
                    <span>{isStatsInView ? 'Active Metrics' : 'Live Metrics'}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {visibleStatistics.map((stat) => {
                    const match = stat.number.match(/^(\d+)(.*)$/);
                    const numericValue = match ? parseInt(match[1], 10) : null;
                    const suffix = match ? match[2] : '';

                    return (
                      <div
                        key={stat.id}
                        className={`p-6 luxury-card relative group ${
                          isStatsInView ? 'border-[#DEC596]/35 shadow-[0_16px_40px_rgba(0,0,0,0.65),0_0_20px_rgba(222,197,150,0.12)]' : 'border-white/10 opacity-90'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-anton text-4xl sm:text-5xl tracking-tight text-[#F5EEDC] drop-shadow-[0_0_15px_rgba(222,197,150,0.35)] transition-all duration-700 flex items-baseline">
                            {numericValue !== null ? (
                              <>
                                <AnimatedNumber
                                  value={isStatsInView ? numericValue : 0}
                                  springOptions={{
                                    bounce: 0,
                                    duration: 2000
                                  }}
                                  className="font-anton"
                                />
                                {suffix && (
                                  <span className="font-anton ml-0.5 text-[#F5EEDC]">{suffix}</span>
                                )}
                              </>
                            ) : (
                              <span>{stat.number}</span>
                            )}
                          </div>
                          {/* Decorative SVG star from sliding number component */}
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            width="16"
                            height="16"
                            className={`fill-transparent transition-all duration-500 stroke-[1.3] ${
                              isStatsInView
                                ? 'stroke-[#DEC596] scale-110 drop-shadow-[0_0_8px_rgba(222,197,150,0.5)]'
                                : 'stroke-[#DEC596]/40 scale-100'
                            }`}
                            aria-hidden="true"
                          >
                            <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
                          </svg>
                        </div>
                        <div className="text-[11px] font-sans font-semibold tracking-wider uppercase text-[#FAF7F2]/90 mt-2">
                          {stat.label}
                        </div>
                        <p className="text-[11px] font-sans text-[#FAF7F2]/60 mt-1 leading-snug">
                          {stat.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
