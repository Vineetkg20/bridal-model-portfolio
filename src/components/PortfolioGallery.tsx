import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { PortfolioItem } from '../types';
import { WEBSITE_CONTENT } from '../data';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from '@/components/core/morphing-dialog';
import { PlusIcon } from 'lucide-react';

interface PortfolioGalleryProps {
  onOpenLightbox?: (item: PortfolioItem) => void;
}

const FALLBACK_IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect fill="%23F3EFEB" width="600" height="800"/><text fill="%238B0000" font-family="sans-serif" font-size="20" font-weight="bold" x="50%" y="48%" text-anchor="middle">✦ EDITORIAL ARCHIVE</text><text fill="%23111113" opacity="0.6" font-family="sans-serif" font-size="14" x="50%" y="54%" text-anchor="middle">Image Reference Loading</text></svg>';

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ onOpenLightbox }) => {
  const { content } = useContent();
  const portfolioConfig = content?.portfolio || WEBSITE_CONTENT.portfolio;
  const rawItems = Array.isArray(content?.portfolioItems) && content.portfolioItems.length > 0
    ? content.portfolioItems
    : WEBSITE_CONTENT.portfolioItems;
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});
  const [activeLookId, setActiveLookId] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('look');
    } catch {
      return null;
    }
  });

  // Filter out hidden items and sort by order
  const allItems = rawItems
    .filter((item) => !item?.isHidden)
    .sort((a, b) => (a?.order || 0) - (b?.order || 0));

  const filteredItems =
    selectedCategory === 'All'
      ? allItems
      : allItems.filter((item) => item.category === selectedCategory);

  const handleImageError = (id: string) => {
    setBrokenImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <section id="portfolio" className="relative w-full py-24 md:py-32 bg-transparent text-[#FAF7F2] px-6 md:px-14 border-t border-[#DEC596]/15">
      {/* Editorial Section Header */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
            {portfolioConfig.badge}
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-[#DEC596]/15 pb-8">
          <div>
            <h2 className="font-anton text-5xl sm:text-6xl md:text-7xl tracking-tight uppercase leading-none text-[#FAF7F2]">
              {portfolioConfig.heading}
            </h2>
            <p className="text-xs md:text-sm font-sans tracking-widest uppercase text-[#FAF7F2]/65 mt-3 max-w-xl">
              {portfolioConfig.description}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 text-[11px] font-sans uppercase tracking-[0.15em]">
            {portfolioConfig.categories.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                    isActive
                      ? 'bg-[#DEC596] border-[#DEC596] text-[#0B090C] font-semibold shadow-[0_0_20px_rgba(222,197,150,0.4)]'
                      : 'bg-[#141018]/60 border-[#DEC596]/15 text-[#FAF7F2]/70 hover:border-[#DEC596]/50 hover:text-[#FAF7F2] backdrop-blur-md'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Responsive Editorial Gallery Grid featuring Morphing Dialogs */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {filteredItems.map((item, index) => {
          const isBroken = brokenImages[item.id];
          return (
            <MorphingDialog
              key={item.id}
              isOpen={activeLookId === item.id}
              onOpenChange={(open) => {
                if (open) {
                  setActiveLookId(item.id);
                } else if (activeLookId === item.id) {
                  setActiveLookId(null);
                  if (typeof window !== 'undefined' && window.location.search.includes('look=')) {
                    const url = new URL(window.location.href);
                    url.searchParams.delete('look');
                    window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
                  }
                }
              }}
              transition={{
                type: 'spring',
                bounce: 0.05,
                duration: 0.25
              }}
            >
              {/* Card Trigger */}
              <MorphingDialogTrigger
                style={{ borderRadius: '24px' }}
                className="group flex flex-col overflow-hidden luxury-card border border-[#DEC596]/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] hover:border-[#DEC596]/60 hover:shadow-[0_25px_65px_rgba(0,0,0,0.8),0_0_30px_rgba(222,197,150,0.22)] transition-all duration-500 select-none hover:-translate-y-2 cursor-pointer"
              >
                {/* Media Container */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/40">
                  <MorphingDialogImage
                    src={isBroken ? FALLBACK_IMAGE_PLACEHOLDER : item.primaryImage}
                    alt={item.imageAlt || item.title}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ objectPosition: item.focalPoint || 'center top' }}
                  />

                  {/* Corner Editorial Tag */}
                  <div className="absolute top-4 left-4 bg-[#120D17]/90 backdrop-blur-md px-3.5 py-1.5 text-[9px] uppercase tracking-[0.25em] font-sans font-semibold text-[#F5EEDC] border border-[#DEC596]/30 rounded-full shadow-lg">
                    {item.featuredSeal || item.category}
                  </div>
                </div>

                {/* Trigger Footer Card Meta */}
                <div className="flex grow flex-row items-end justify-between px-6 py-5 bg-[#140F1B]/95 backdrop-blur-xl border-t border-[#DEC596]/15">
                  <div className="pr-3">
                    <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#FAF7F2]/60 mb-1">
                      <span>{item.collection}</span>
                      <span className="font-mono text-[#DEC596] font-semibold">0{index + 1}</span>
                    </div>
                    <MorphingDialogTitle className="font-anton text-xl tracking-tight uppercase leading-tight text-[#FAF7F2] group-hover:text-[#F5EEDC] transition-colors">
                      {item.title}
                    </MorphingDialogTitle>
                    <MorphingDialogSubtitle className="text-xs font-sans text-[#DEC596]/80 uppercase tracking-widest mt-1">
                      {item.category}
                    </MorphingDialogSubtitle>
                  </div>
                  <button
                    type="button"
                    className="relative ml-1 flex h-9 w-9 shrink-0 select-none appearance-none items-center justify-center rounded-full border border-[#DEC596]/35 bg-[#1E1627] text-[#F5EEDC] transition-all hover:bg-[#DEC596] hover:text-[#0B090C] hover:border-[#DEC596] hover:shadow-[0_0_15px_rgba(222,197,150,0.4)] active:scale-[0.96] shadow-sm cursor-pointer"
                    aria-label={`Open ${item.title} details`}
                  >
                    <PlusIcon size={15} />
                  </button>
                </div>
              </MorphingDialogTrigger>

              {/* Morphing Dialog Container: clean, non-scrollable presentation card */}
              <MorphingDialogContainer>
                <MorphingDialogContent
                  style={{ borderRadius: '28px' }}
                  className="pointer-events-auto relative flex h-auto max-h-[85vh] w-full flex-col overflow-hidden border border-[#DEC596]/40 bg-[#100C14]/98 text-[#FAF7F2] shadow-[0_30px_90px_rgba(0,0,0,0.9),0_0_40px_rgba(222,197,150,0.15)] sm:max-w-[480px] md:max-w-[520px] backdrop-blur-3xl"
                >
                  {/* Photo at the top */}
                  <div className="relative w-full aspect-[4/5] max-h-[52vh] overflow-hidden bg-black/60">
                    <MorphingDialogImage
                      src={isBroken ? FALLBACK_IMAGE_PLACEHOLDER : item.primaryImage}
                      alt={item.imageAlt || item.title}
                      className="w-full h-full object-cover object-top"
                      style={{ objectPosition: item.focalPoint || 'center top' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#100C14] via-transparent to-transparent opacity-60 pointer-events-none" />
                    {item.featuredSeal && (
                      <div className="absolute top-4 left-4 bg-[#120D17]/92 backdrop-blur-md px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] font-sans font-semibold text-[#F5EEDC] border border-[#DEC596]/45 rounded-full shadow-lg">
                        {item.featuredSeal}
                      </div>
                    )}
                  </div>

                  {/* Under the photo: Compact, clean editorial card info (No scrolling required) */}
                  <div className="p-6 sm:p-7 bg-[#100C14] border-t border-[#DEC596]/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.25em] text-[#DEC596] font-semibold mb-1.5">
                        <span>{item.collection}</span>
                        <span className="font-mono text-[#DEC596]/80 font-bold">ATELIER LOOK 0{index + 1}</span>
                      </div>
                      <MorphingDialogTitle className="text-2xl sm:text-3xl font-anton uppercase text-[#FAF7F2] tracking-tight leading-tight">
                        {item.title}
                      </MorphingDialogTitle>
                      <MorphingDialogSubtitle className="text-xs uppercase tracking-widest font-sans text-[#DEC596] mt-1.5 font-medium">
                        {item.category} · {item.credits.designer || item.credits.brand || 'Atelier Heritage Couture'}
                      </MorphingDialogSubtitle>
                    </div>

                    <MorphingDialogDescription
                      disableLayoutAnimation
                      variants={{
                        initial: { opacity: 0, scale: 0.95 },
                        animate: { opacity: 1, scale: 1 },
                        exit: { opacity: 0, scale: 0.95 }
                      }}
                      className="mt-4 pt-3.5 border-t border-[#DEC596]/20"
                    >
                      <span className="text-[10px] uppercase font-semibold text-[#DEC596] tracking-[0.22em] block mb-1.5">
                        Curated Silhouette Description
                      </span>
                      <p className="text-xs sm:text-[13px] text-[#FAF7F2]/85 leading-relaxed font-sans line-clamp-2">
                        {item.shortDescription}
                      </p>
                    </MorphingDialogDescription>
                  </div>

                  {/* Accessible Close Button */}
                  <MorphingDialogClose className="text-white hover:text-[#DEC596] transition-colors" />
                </MorphingDialogContent>
              </MorphingDialogContainer>
            </MorphingDialog>
          );
        })}
      </div>
    </section>
  );
};

