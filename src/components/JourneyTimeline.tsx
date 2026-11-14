import React from 'react';
import { useContent } from '../context/ContentContext';
import { WEBSITE_CONTENT } from '../data';

export const JourneyTimeline: React.FC = () => {
  const { content } = useContent();
  const journeyConfig = content?.journey || WEBSITE_CONTENT.journey;
  const visibleMilestones = (journeyConfig.milestones || []).filter((m) => !m?.isHidden);

  return (
    <section
      id="journey"
      className="relative w-full py-24 md:py-32 bg-transparent text-[#FAF7F2] px-6 md:px-14 border-t border-[#DEC596]/15"
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
            {journeyConfig.badge}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-16 border-b border-[#DEC596]/15 pb-6">
          <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-[#FAF7F2]">
            {journeyConfig.heading}
          </h2>
          <span className="text-xs font-sans tracking-widest text-[#FAF7F2]/50 uppercase">
            {journeyConfig.sub}
          </span>
        </div>

        {/* Timeline Sequence */}
        <div className="relative border-l border-[#DEC596]/25 ml-4 md:ml-32 space-y-16">
          {visibleMilestones.map((milestone) => (
            <div key={milestone.id} className="relative pl-8 md:pl-12 group">
              {/* Timeline Marker Point as Radiant Jewel */}
              <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-[#0B090C] border-2 border-[#DEC596] shadow-[0_0_12px_rgba(222,197,150,0.85)] group-hover:bg-[#DEC596] transition-colors duration-300" />

              {/* Date Marker (Displayed on left for md+ screens) */}
              <div className="md:absolute md:-left-36 md:top-1 text-xs md:text-sm font-anton tracking-wider text-[#F5EEDC] uppercase mb-1 md:mb-0">
                {milestone.dateOrPeriod}
              </div>

              {/* Milestone Content Card */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start luxury-card p-6 md:p-8 hover:border-[#DEC596]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(222,197,150,0.2)] transition-all duration-500 shadow-2xl">
                <div className="lg:col-span-8 space-y-3.5">
                  <div className="flex items-center gap-3">
                    <span className="text-[9px] uppercase tracking-[0.22em] bg-gradient-to-r from-[#1E1627] to-[#150F1C] border border-[#DEC596]/35 text-[#F5EEDC] px-3.5 py-1 rounded-full font-semibold shadow-sm">
                      {milestone.tag}
                    </span>
                    <span className="text-xs uppercase tracking-widest text-[#DEC596]/80 font-medium">
                      {milestone.brandOrPublication}
                    </span>
                  </div>

                  <h3 className="font-anton text-2xl md:text-3xl tracking-tight uppercase leading-snug text-[#FAF7F2] group-hover:text-[#F5EEDC] transition-colors">
                    {milestone.title}
                  </h3>

                  <p className="text-xs md:text-sm font-sans text-[#FAF7F2]/85 leading-relaxed font-normal">
                    {milestone.description}
                  </p>

                  {milestone.credits && (
                    <div className="pt-2.5 text-[11px] font-sans text-[#FAF7F2]/60 italic border-t border-[#DEC596]/15">
                      Credits: {milestone.credits}
                    </div>
                  )}
                </div>

                {/* Optional Supporting Thumbnail */}
                {milestone.image && (
                  <div className="lg:col-span-4 aspect-[4/3] w-full overflow-hidden bg-black/50 rounded-2xl border border-[#DEC596]/25 shadow-md">
                    <img
                      src={milestone.image}
                      alt={milestone.imageAlt || milestone.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
