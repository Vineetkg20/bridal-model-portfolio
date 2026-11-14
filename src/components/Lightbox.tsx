import React, { useEffect, useState } from 'react';
import { PortfolioItem } from '../types';

interface LightboxProps {
  item: PortfolioItem | null;
  allItems: PortfolioItem[];
  onClose: () => void;
  onNavigate: (newItem: PortfolioItem) => void;
}

const FALLBACK_IMAGE_PLACEHOLDER =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800"><rect fill="%23111113" width="600" height="800"/><text fill="%23E24B5E" font-family="sans-serif" font-size="20" font-weight="bold" x="50%" y="48%" text-anchor="middle">✦ EDITORIAL ARCHIVE</text><text fill="%23ffffff" opacity="0.6" font-family="sans-serif" font-size="14" x="50%" y="54%" text-anchor="middle">Image Reference Loading</text></svg>';

export const Lightbox: React.FC<LightboxProps> = ({
  item,
  allItems,
  onClose,
  onNavigate
}) => {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [item?.id]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (item) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [item]);

  if (!item) return null;

  const currentIndex = allItems.findIndex((it) => it.id === item.id);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const prevIndex = (currentIndex - 1 + allItems.length) % allItems.length;
    onNavigate(allItems[prevIndex]);
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const nextIndex = (currentIndex + 1) % allItems.length;
    onNavigate(allItems[nextIndex]);
  };

  // Keyboard navigation: Escape to close, Left Arrow for prev, Right Arrow for next
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allItems]);

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 bg-[#0B090C]/96 backdrop-blur-2xl flex flex-col justify-between p-4 md:p-8 animate-fadeIn"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Lightbox view of ${item.title}`}
    >
      {/* Top Header Bar */}
      <div
        className="flex items-center justify-between z-10 w-full text-[#FAF7F2] border-b border-[#DEC596]/15 pb-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-4">
          <span className="font-anton text-xl tracking-wider text-[#F5EEDC]">
            {item.featuredSeal || 'EDITORIAL LOOK'}
          </span>
          <span className="text-xs uppercase tracking-[0.2em] text-[#FAF7F2]/60">
            {currentIndex + 1} of {allItems.length}
          </span>
        </div>

        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="px-5 py-2 text-xs uppercase tracking-[0.2em] font-medium border border-[#DEC596]/30 hover:border-[#DEC596] hover:bg-[#DEC596] hover:text-[#0B090C] transition-colors rounded-full cursor-pointer"
        >
          Close ✕
        </button>
      </div>

      {/* Main Image Stage */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          aria-label="Previous Look"
          className="absolute left-2 md:left-6 z-20 p-3.5 bg-[#141018]/80 hover:bg-[#DEC596] hover:text-[#0B090C] text-[#FAF7F2] rounded-full transition-all backdrop-blur-md border border-[#DEC596]/20 shadow-lg cursor-pointer"
        >
          <span className="text-xl">←</span>
        </button>

        {/* Display Image or Video */}
        <div className="max-h-[75vh] max-w-[90vw] md:max-w-[70vw] relative flex items-center justify-center">
          {item.videoUrl ? (
            <video
              src={item.videoUrl}
              autoPlay
              loop
              muted
              controls
              playsInline
              preload="metadata"
              className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-2xl border border-[#DEC596]/20"
            />
          ) : (
            <img
              src={imageError ? FALLBACK_IMAGE_PLACEHOLDER : item.primaryImage}
              alt={item.imageAlt || item.title}
              onError={() => setImageError(true)}
              className="max-h-[72vh] max-w-full object-contain rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] border border-[#DEC596]/20"
            />
          )}
        </div>

        <button
          onClick={handleNext}
          aria-label="Next Look"
          className="absolute right-2 md:right-6 z-20 p-3.5 bg-[#141018]/80 hover:bg-[#DEC596] hover:text-[#0B090C] text-[#FAF7F2] rounded-full transition-all backdrop-blur-md border border-[#DEC596]/20 shadow-lg cursor-pointer"
        >
          <span className="text-xl">→</span>
        </button>
      </div>

      {/* Bottom Editorial Information Bar */}
      <div
        className="bg-[#141018]/85 backdrop-blur-xl p-5 md:p-6 border border-[#DEC596]/20 text-[#FAF7F2] rounded-2xl md:rounded-3xl w-full max-w-4xl mx-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <span className="text-[10px] uppercase tracking-widest text-[#DEC596] font-semibold">
                {item.category}
              </span>
              <span className="text-xs text-[#DEC596]/50">•</span>
              <span className="text-[10px] uppercase tracking-widest text-[#FAF7F2]/60">
                {item.collection}
              </span>
            </div>
            <h3 className="font-anton text-2xl md:text-3xl tracking-tight uppercase text-[#FAF7F2]">
              {item.title}
            </h3>
            <p className="text-xs md:text-sm text-[#FAF7F2]/80 max-w-2xl mt-1 leading-relaxed">
              {item.shortDescription}
            </p>
          </div>

          {/* Credits Summary */}
          {item.credits && (
            <div className="text-[11px] font-sans text-[#FAF7F2]/60 space-y-0.5 border-l border-[#DEC596]/20 pl-4 shrink-0">
              {item.credits.designer && (
                <div>
                  <span className="text-white/40">Couturier:</span> {item.credits.designer}
                </div>
              )}
              {item.credits.photographer && (
                <div>
                  <span className="text-white/40">Lens:</span> {item.credits.photographer}
                </div>
              )}
              {item.credits.makeupArtist && (
                <div>
                  <span className="text-white/40">Glam:</span> {item.credits.makeupArtist}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
