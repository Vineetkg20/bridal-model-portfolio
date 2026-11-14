import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { WEBSITE_CONTENT } from '../data';
import { TearSheetItem } from '../types';

export const PressTearSheets: React.FC = () => {
  const { content } = useContent();
  const pressConfig = content?.press || WEBSITE_CONTENT.press;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTearSheet, setActiveTearSheet] = useState<TearSheetItem | null>(null);
  const [showCompCardModal, setShowCompCardModal] = useState<boolean>(false);

  const visibleItems = (pressConfig.items || []).filter((item) => !item?.isHidden);
  const filteredItems =
    selectedCategory === 'All'
      ? visibleItems
      : visibleItems.filter((item) => item.category === selectedCategory);

  return (
    <section
      id="press"
      className="relative w-full py-24 md:py-32 bg-transparent text-[#FAF7F2] px-6 md:px-14 border-t border-[#DEC596]/15 select-none"
    >
      {/* Background Subtle Ambient Texture */}
      {pressConfig.watermarkText ? (
        <div className="absolute right-4 bottom-10 font-anton text-[22vw] text-white/[0.02] select-none pointer-events-none leading-none">
          {pressConfig.watermarkText}
        </div>
      ) : null}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
            {pressConfig.badge}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#DEC596]/15 pb-8 mb-12">
          <div>
            <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-[#FAF7F2]">
              {pressConfig.heading}
            </h2>
            <p className="text-xs md:text-sm font-sans tracking-widest uppercase text-[#FAF7F2]/65 mt-2 max-w-xl">
              {pressConfig.sub}
            </p>
          </div>

          {/* Publication Filter Pills */}
          <div className="flex flex-wrap gap-2 text-[11px] font-sans uppercase tracking-wider">
            {pressConfig.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border transition-all duration-300 font-medium cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#DEC596] border-[#DEC596] text-[#0B090C] font-semibold shadow-[0_0_20px_rgba(222,197,150,0.4)]'
                    : 'bg-[#141018]/60 border-[#DEC596]/15 text-[#FAF7F2]/70 hover:border-[#DEC596]/50 hover:text-[#FAF7F2] backdrop-blur-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Agency Comp Card & Press Kit Highlight Banner */}
        <div className="mb-14 p-6 md:p-8 luxury-card-elevated flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.7)]">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] shadow-[0_0_8px_rgba(222,197,150,0.8)]" />
              <span className="text-[10px] uppercase font-sans tracking-[0.28em] text-[#DEC596] font-semibold">
                {pressConfig.compCard.badge}
              </span>
            </div>
            <h3 className="font-anton text-xl md:text-2xl uppercase tracking-tight text-[#FAF7F2]">
              {pressConfig.compCard.title}
            </h3>
            <p className="text-xs font-sans text-[#FAF7F2]/80 max-w-2xl leading-relaxed">
              {pressConfig.compCard.statsSummary}
            </p>
            <p className="text-[11px] font-sans text-[#DEC596]/90 tracking-wide">
              {pressConfig.compCard.agencyRepresentation}
            </p>
          </div>

          <button
            onClick={() => setShowCompCardModal(true)}
            className="shrink-0 px-7 py-3 rounded-full bg-gradient-to-r from-[#DEC596] to-[#F5EEDC] text-[#0B090C] font-semibold text-xs font-sans uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_0_25px_rgba(222,197,150,0.35)] hover:shadow-[0_0_35px_rgba(222,197,150,0.6)] flex items-center gap-2.5 cursor-pointer"
          >
            <span>📄</span>
            <span>View Comp Card</span>
          </button>
        </div>

        {/* Tear Sheets & Magazine Covers Responsive Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              role="button"
              tabIndex={0}
              aria-label={`Inspect ${item.publication} tear sheet: ${item.title}`}
              onClick={() => setActiveTearSheet(item)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setActiveTearSheet(item);
                }
              }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-[#DEC596]/20 bg-[#140F1B]/85 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:shadow-[0_25px_65px_rgba(0,0,0,0.85),0_0_30px_rgba(222,197,150,0.2)] hover:border-[#DEC596]/60 transition-all duration-500 cursor-pointer hover:-translate-y-2 text-left"
            >
              {/* Cover Magazine Frame */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/50">
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  loading="lazy"
                />

                {/* Top Publication Badge */}
                <div className="absolute top-4 left-4 bg-[#120D17]/92 backdrop-blur-md px-4 py-1.5 rounded-full border border-[#DEC596]/35 shadow-md flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596]" />
                  <span className="text-[10px] uppercase tracking-[0.22em] font-anton text-[#F5EEDC]">
                    {item.publication}
                  </span>
                </div>

                {/* Corner Spread Counter */}
                {item.spreadCount && (
                  <div className="absolute top-4 right-4 bg-[#0B090C]/90 backdrop-blur-md px-3.5 py-1 text-[9px] uppercase tracking-wider font-sans font-semibold text-[#DEC596] border border-[#DEC596]/25 rounded-full">
                    {item.spreadCount}
                  </div>
                )}

                {/* Subtle Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B090C] via-transparent to-transparent opacity-65 group-hover:opacity-45 transition-opacity duration-500" />
              </div>

              {/* Tear Sheet Metadata Card */}
              <div className="p-6 md:p-7 flex flex-col justify-between flex-grow space-y-4 bg-[#140F1B]/98 border-t border-[#DEC596]/15">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-[#DEC596] font-semibold mb-1.5">
                    <span>{item.issue}</span>
                    <span className="font-mono text-[#F5EEDC] font-semibold">0{index + 1}</span>
                  </div>

                  <h3 className="font-anton text-xl tracking-tight uppercase leading-snug text-[#FAF7F2] group-hover:text-[#F5EEDC] transition-colors">
                    {item.title}
                  </h3>

                  {item.quote && (
                    <p className="text-xs font-serif italic text-[#FAF7F2]/85 mt-2.5 leading-relaxed">
                      "{item.quote}"
                    </p>
                  )}
                </div>

                {/* Couturier & Photographer Credits */}
                <div className="pt-3.5 border-t border-[#DEC596]/15 flex items-center justify-between text-xs font-sans">
                  <div>
                    <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold tracking-wider">Couturier</span>
                    <span className="text-[#FAF7F2]/90 font-medium text-[11px]">{item.designer}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold tracking-wider">Photography</span>
                    <span className="text-[#FAF7F2]/90 font-medium text-[11px]">{item.photographer}</span>
                  </div>
                </div>

                {/* Inspect Action */}
                <div className="pt-2 flex items-center justify-between text-[11px] font-sans uppercase tracking-[0.2em] text-[#DEC596] font-semibold">
                  <span>Inspect Tear Sheet</span>
                  <span className="group-hover:translate-x-1 transition-transform">↗</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tear Sheet Detail Modal */}
      {activeTearSheet && (
        <div
          className="fixed inset-0 z-50 bg-[#0B090C]/96 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setActiveTearSheet(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto bg-[#141018] border border-[#DEC596]/30 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 text-[#FAF7F2]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveTearSheet(null)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-[#FAF7F2] hover:text-[#DEC596] flex items-center justify-center text-sm cursor-pointer"
              aria-label="Close modal"
            >
              ✕
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#DEC596]/20 bg-black/50">
                <img
                  src={activeTearSheet.coverImage}
                  alt={activeTearSheet.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-5">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[#DEC596] font-semibold mb-1">
                    <span>{activeTearSheet.publication}</span>
                    <span>•</span>
                    <span>{activeTearSheet.issue}</span>
                  </div>
                  <h3 className="font-anton text-2xl sm:text-3xl uppercase tracking-tight text-[#FAF7F2]">
                    {activeTearSheet.title}
                  </h3>
                </div>

                {activeTearSheet.quote && (
                  <div className="p-4 rounded-xl bg-[#1C1724] border-l-2 border-[#DEC596] font-serif italic text-sm text-[#FAF7F2]/90 leading-relaxed">
                    "{activeTearSheet.quote}"
                  </div>
                )}

                {activeTearSheet.editorNote && (
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-[#DEC596] tracking-widest block mb-1">
                      Editorial Context
                    </span>
                    <p className="text-xs font-sans text-[#FAF7F2]/80 leading-relaxed">
                      {activeTearSheet.editorNote}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#DEC596]/15 text-xs font-sans">
                  <div>
                    <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Couturier / House</span>
                    <span className="text-[#FAF7F2]/90 font-medium">{activeTearSheet.designer}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Photographer</span>
                    <span className="text-[#FAF7F2]/90 font-medium">{activeTearSheet.photographer}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {activeTearSheet.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="text-[10px] uppercase tracking-wider bg-[#1C1724] border border-[#DEC596]/20 px-3 py-1 rounded-full text-[#FAF7F2]/85 font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comp Card Quick Modal */}
      {showCompCardModal && (
        <div
          className="fixed inset-0 z-50 bg-[#0B090C]/96 backdrop-blur-2xl flex items-center justify-center p-4 md:p-8 animate-fadeIn"
          onClick={() => setShowCompCardModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative max-w-xl w-full bg-[#141018] border border-[#DEC596]/30 rounded-2xl md:rounded-3xl shadow-2xl p-6 md:p-8 text-[#FAF7F2] space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCompCardModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-black/60 border border-white/20 text-[#FAF7F2] hover:text-[#DEC596] flex items-center justify-center text-sm cursor-pointer"
              aria-label="Close comp card"
            >
              ✕
            </button>

            <div className="text-center space-y-2 border-b border-[#DEC596]/15 pb-4">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#DEC596] font-semibold block">
                OFFICIAL EDITORIAL SPECIFICATIONS
              </span>
              <h3 className="font-anton text-2xl uppercase tracking-tight text-[#FAF7F2]">
                MEHAK SHARMA
              </h3>
              <p className="text-xs font-sans text-[#FAF7F2]/60 uppercase tracking-widest">
                Haute Couture Bridal Muse · Commercial & Runway Model
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-sans bg-[#1C1724]/60 p-5 rounded-2xl border border-[#DEC596]/20">
              <div>
                <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Height</span>
                <span className="font-semibold text-white">5'10" / 178 cm</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Bust</span>
                <span className="font-semibold text-white">33" / 84 cm</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Waist</span>
                <span className="font-semibold text-white">24.5" / 62 cm</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Hips</span>
                <span className="font-semibold text-white">35.5" / 90 cm</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Shoes</span>
                <span className="font-semibold text-white">39 EU / 8.5 US</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#DEC596]/70 block font-semibold">Eyes / Hair</span>
                <span className="font-semibold text-white">Hazel / Espresso</span>
              </div>
            </div>

            <div className="text-center pt-2 space-y-3">
              <p className="text-xs font-sans text-[#FAF7F2]/70 leading-relaxed">
                Direct booking inquiries through Elite Model Management & Inega Mumbai or direct commission via contact portal.
              </p>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-6 py-2.5 rounded-full bg-[#DEC596] hover:bg-[#F5EEDC] text-[#0B090C] font-semibold text-xs font-sans uppercase tracking-widest cursor-pointer shadow-md"
              >
                Print / Save Comp Card
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
