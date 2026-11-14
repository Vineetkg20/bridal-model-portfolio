import React from 'react';
import { useContent } from '../context/ContentContext';
import { WEBSITE_CONTENT } from '../data';

interface HeroProps {
  onExploreClick: () => void;
}

/**
 * Hero Component - Luxury Full-Bleed Photograph Intro
 * Features the model's portrait as a full-screen atmospheric background
 * with color harmonies matching the Royal Azure couture lehenga and zardozi gold,
 * with high-fashion typography and key specifications elegantly layered in front.
 */
export const Hero: React.FC<HeroProps> = ({ onExploreClick }) => {
  const { content } = useContent();
  const heroConfig = content?.hero || WEBSITE_CONTENT.hero;
  const fullName = heroConfig.fullName || WEBSITE_CONTENT.hero.fullName;
  const taglines = Array.isArray(heroConfig.tagline) ? heroConfig.tagline : WEBSITE_CONTENT.hero.tagline;
  const specifications = Array.isArray(heroConfig.specifications) ? heroConfig.specifications : WEBSITE_CONTENT.hero.specifications;
  const primaryMedia = heroConfig.primaryMedia || WEBSITE_CONTENT.hero.primaryMedia;
  const buttons = heroConfig.buttons || WEBSITE_CONTENT.hero.buttons;
  const footerLeft = heroConfig.footerLeft || WEBSITE_CONTENT.hero.footerLeft;

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden text-white pt-12 md:pt-16 pb-8 px-6 md:px-14 select-none bg-transparent"
    >
      {/* ================================================================= */}
      {/* HERO OVERSIZED HEADLINE & ARCHIVE BRANDING                        */}
      {/* ================================================================= */}
      <div className="relative z-10 my-auto py-8 md:py-14">
        {/* Couture Heritage Label with Italic Serif Accent */}
        <div className="flex items-center gap-3 mb-4 text-xs md:text-sm font-sans tracking-[0.3em] uppercase text-[#DEC596]">
          <span className="w-10 h-[1px] bg-gradient-to-r from-transparent to-[#DEC596]/60" />
          <span className="font-medium tracking-[0.25em] text-[#DEC596]/95">
            {primaryMedia.creditMain || 'ROYAL AZURE COUTURE ARCHIVE'}
          </span>
          <span className="w-10 h-[1px] bg-gradient-to-l from-transparent to-[#DEC596]/60" />
        </div>

        {/* Oversized Anton Typography in White with Golden Hover */}
        <h1 className="font-anton text-[15vw] sm:text-[14vw] md:text-[12.5vw] lg:text-[11vw] leading-[0.84] tracking-tight uppercase text-[#FAF7F2] drop-shadow-[0_8px_45px_rgba(0,0,0,0.95)]">
          {fullName.split(' ').map((word, i) => (
            <span
              key={i}
              className="block hover:text-[#F5EEDC] transition-all duration-700 cursor-default select-none tracking-tight hover:drop-shadow-[0_0_35px_rgba(222,197,150,0.25)]"
            >
              {word}
            </span>
          ))}
        </h1>
      </div>

      {/* ================================================================= */}
      {/* 4. FOREGROUND CARDS: Editorial Statement & Verified Specs         */}
      {/* ================================================================= */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-end my-4">
        {/* Left Column: 3-Line Statement in Frosted Luxury Glass Card */}
        <div className="lg:col-span-7 luxury-card p-6 md:p-8 space-y-3.5 relative overflow-hidden group">
          {/* Subtle Corner Light Glow */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-radial from-[#DEC596]/12 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] shadow-[0_0_8px_rgba(222,197,150,0.8)]" />
            <span className="text-[10px] font-sans tracking-[0.28em] font-semibold text-[#DEC596] uppercase block">
              HAUTE COUTURE BRIDAL EDITORIAL
            </span>
          </div>

          <div className="space-y-2">
            {taglines.map((line, idx) => (
              <p
                key={idx}
                className="text-xs md:text-sm tracking-[0.08em] font-sans font-normal text-[#FAF7F2]/90 leading-relaxed uppercase"
              >
                {line}
              </p>
            ))}
          </div>
        </div>

        {/* Right Column: Physical Specifications in Frosted Luxury Glass Card */}
        <div className="lg:col-span-5 luxury-card p-6 md:p-8 flex flex-col justify-between gap-5 relative overflow-hidden">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] shadow-[0_0_8px_rgba(222,197,150,0.8)]" />
              <span className="text-[10px] font-sans tracking-[0.28em] font-semibold text-[#DEC596] uppercase block">
                EDITORIAL SPECIFICATIONS
              </span>
            </div>

            <div className="flex flex-wrap gap-2 text-xs font-sans">
              {specifications.map((spec, sIdx) => (
                <div
                  key={sIdx}
                  className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#1C1524]/90 to-[#140F1B]/90 border border-[#DEC596]/25 text-[#FAF7F2] font-medium tracking-wider uppercase text-[11px] hover:border-[#DEC596]/55 hover:shadow-[0_0_14px_rgba(222,197,150,0.2)] transition-all"
                >
                  <span className="text-[#DEC596] font-semibold mr-1.5">{spec.label}:</span>
                  <span>{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between text-[11px] font-sans tracking-widest uppercase text-[#FAF7F2]/70 pt-3 border-t border-[#DEC596]/15">
            <span className="font-medium">{primaryMedia.creditSub || 'PALACE SUITE CAMPAIGN'}</span>
            <span className="text-[#DEC596] font-semibold flex items-center gap-2">
              <span className="w-1 h-1 rounded-full bg-[#DEC596]" />
              <span>HANDCRAFTED COUTURE</span>
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 5. FOOTER BAR: Volume Tag, Centered Explore Action & Dock Spacer  */}
      {/* ================================================================= */}
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between border-t border-[#DEC596]/15 pt-5 mt-4 text-xs font-sans tracking-[0.2em] uppercase text-[#FAF7F2]/70 gap-4">
        {/* Left: Volume & Curation */}
        <div className="flex items-center gap-3">
          <span className="text-[#DEC596] font-semibold">{footerLeft.volume}</span>
          <span className="text-[#DEC596]/50">•</span>
          <span className="text-[#FAF7F2]/60 hidden sm:inline">{footerLeft.categories}</span>
        </div>

        {/* Center: Prominent Explore Action (Centered for balanced magazine layout without dock collision) */}
        <div className="flex items-center justify-center">
          <button
            onClick={onExploreClick}
            className="flex items-center gap-3 px-8 py-3 bg-gradient-to-r from-[#DEC596]/20 via-[#DEC596]/30 to-[#DEC596]/20 hover:from-[#DEC596] hover:to-[#F5EEDC] text-[#FAF7F2] hover:text-[#0B090C] rounded-full border border-[#DEC596]/45 hover:border-[#DEC596] backdrop-blur-xl transition-all duration-500 font-semibold tracking-[0.22em] text-[11px] shadow-[0_0_25px_rgba(222,197,150,0.25)] hover:shadow-[0_0_40px_rgba(222,197,150,0.55)] group cursor-pointer"
            title="Enter collection and explore looks"
          >
            <span className="uppercase font-semibold">{buttons.scrollPrompt}</span>
            <span className="transform transition-transform duration-300 group-hover:translate-y-1 text-xs">↓</span>
          </button>
        </div>

        {/* Right: Dedicated Spacer ensuring zero collision with floating controls dock */}
        <div className="hidden lg:block w-52" aria-hidden="true" />
      </div>
    </section>
  );
};
