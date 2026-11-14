import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { PortfolioItem } from '../types';

interface LookRing3DProps {
  onSelectLook: (item: PortfolioItem) => void;
}

export const LookRing3D: React.FC<LookRing3DProps> = ({ onSelectLook }) => {
  const { content } = useContent();
  const ringConfig = content.lookRing;

  // Filter out hidden items and sort by order
  const cards = content.portfolioItems
    .filter((item) => !item.isHidden)
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  const [rotationAngle, setRotationAngle] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [flippedCardId, setFlippedCardId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  const totalCards = Math.max(1, cards.length);
  const angleStep = 360 / totalCards;
  const cardWidth = 310;
  // Radius calculation with breathing factor
  const cylinderRadius = Math.round((cardWidth / 2) / Math.tan(Math.PI / totalCards) * 1.15);

  // Smooth continuous auto-rotation
  useEffect(() => {
    let lastTime = performance.now();
    const autoRotate = (currentTime: number) => {
      const delta = currentTime - lastTime;
      lastTime = currentTime;

      if (!isDragging && !isHovered && !flippedCardId) {
        setRotationAngle((prev) => (prev - delta * 0.02) % 360);
      }
      animationFrameRef.current = requestAnimationFrame(autoRotate);
    };

    animationFrameRef.current = requestAnimationFrame(autoRotate);
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isDragging, isHovered, flippedCardId]);

  const handlePointerDown = (clientX: number) => {
    setIsDragging(true);
    setStartX(clientX);
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startX;
    setRotationAngle((prev) => prev + deltaX * 0.4);
    setStartX(clientX);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
  };

  const toggleFlipCard = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFlippedCardId((prev) => (prev === id ? null : id));
  };

  const rotateToCard = (index: number) => {
    const targetAngle = -index * angleStep;
    setRotationAngle(targetAngle);
  };

  return (
    <section
      id="3d-ring"
      className="relative w-full py-24 md:py-32 bg-[#0B090C] text-[#FAF7F2] overflow-hidden select-none border-t border-b border-[#DEC596]/15"
    >
      {/* Background Editorial Header */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
              {ringConfig.badge}
            </span>
          </div>
          <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-[#FAF7F2]">
            {ringConfig.heading}
          </h2>
        </div>

        <div className="flex flex-col md:items-end text-left md:text-right">
          <p className="text-xs md:text-sm font-sans tracking-wide text-[#FAF7F2]/60 max-w-md uppercase">
            {ringConfig.description}
          </p>
          <div className="flex items-center gap-2 mt-3 text-xs tracking-widest text-[#DEC596] font-medium">
            <span>{ringConfig.dragInstruction}</span>
          </div>
        </div>
      </div>

      {/* DESKTOP 3D CYLINDRICAL RING (Visible >= 820px) */}
      <div
        className="hidden md:flex justify-center items-center relative h-[620px] w-full cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setIsDragging(false);
        }}
        onMouseDown={(e) => handlePointerDown(e.clientX)}
        onMouseMove={(e) => handlePointerMove(e.clientX)}
        onMouseUp={handlePointerUp}
        onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
        onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
        onTouchEnd={handlePointerUp}
      >
        {/* 3D Scene Perspective Container */}
        <div
          ref={containerRef}
          className="relative w-[310px] h-[460px] preserve-3d"
          style={{
            perspective: '1400px',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* Rotating Axis */}
          <div
            className="w-full h-full preserve-3d transition-transform ease-out"
            style={{
              transform: `rotateY(${rotationAngle}deg)`,
              transformStyle: 'preserve-3d',
              transitionDuration: isDragging ? '0ms' : '200ms'
            }}
          >
            {cards.map((item, index) => {
              const cardAngle = index * angleStep;
              // Every 3rd card uses editorial red background
              const isRed = item.isEditorialRed ?? (index + 1) % 3 === 0;
              const isFlipped = flippedCardId === item.id;

              return (
                <div
                  key={item.id}
                  className="absolute inset-0 preserve-3d cursor-pointer"
                  style={{
                    transform: `rotateY(${cardAngle}deg) translateZ(${cylinderRadius}px)`,
                    transformStyle: 'preserve-3d'
                  }}
                  onClick={(e) => toggleFlipCard(item.id, e)}
                >
                  {/* Card Flipper */}
                  <div
                    className="relative w-full h-full preserve-3d transition-transform duration-700 shadow-2xl rounded-3xl"
                    style={{
                      transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* FRONT FACE */}
                    <div
                      className={`absolute inset-0 backface-hidden p-6 flex flex-col justify-between rounded-3xl border backdrop-blur-2xl ${
                        isRed
                          ? 'bg-gradient-to-br from-[#4E0A17]/98 to-[#30050E]/98 text-[#FAF7F2] border-[#DEC596]/40 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_25px_rgba(222,197,150,0.15)]'
                          : 'bg-gradient-to-br from-[#16101D]/98 to-[#0E0A13]/98 text-[#FAF7F2] border-[#DEC596]/25 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_20px_rgba(222,197,150,0.1)]'
                      }`}
                      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span
                            className={`text-[9px] uppercase tracking-[0.22em] font-sans font-semibold px-3 py-1 rounded-full ${
                              isRed ? 'bg-white/20 text-[#FAF7F2]' : 'bg-[#DEC596]/20 text-[#DEC596]'
                            }`}
                          >
                            {item.featuredSeal || 'EDITORIAL'}
                          </span>
                          <h4 className="font-anton text-lg tracking-tight mt-2.5 leading-tight uppercase text-[#FAF7F2]">
                            {item.title}
                          </h4>
                        </div>
                        <span className="text-[10px] tracking-widest font-mono text-[#DEC596]/80 font-bold">
                          0{index + 1}
                        </span>
                      </div>

                      {/* Card Preview Image */}
                      <div className="relative my-3 h-56 w-full overflow-hidden bg-black/40 rounded-2xl border border-white/10 shadow-inner">
                        <img
                          src={item.primaryImage}
                          alt={item.imageAlt || item.title}
                          className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                          style={{ objectPosition: item.focalPoint || 'center top' }}
                          loading="lazy"
                        />
                      </div>

                      <div className="flex justify-between items-center pt-2.5 border-t border-[#DEC596]/20 text-[11px] font-sans tracking-wider uppercase text-[#FAF7F2]/80">
                        <span className="opacity-80">{item.category}</span>
                        <span className="font-semibold text-[#DEC596] hover:text-white transition-colors">
                          {ringConfig.flipPrompt}
                        </span>
                      </div>
                    </div>

                    {/* BACK FACE */}
                    <div
                      className="absolute inset-0 backface-hidden p-6 flex flex-col justify-between rounded-3xl border border-[#DEC596]/35 text-[#FAF7F2] backdrop-blur-2xl shadow-2xl"
                      style={{
                        transform: 'rotateY(180deg)',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background: 'linear-gradient(145deg, #1C1524 0%, #281622 100%)'
                      }}
                    >
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-[10px] uppercase tracking-[0.25em] font-sans font-semibold text-[#DEC596]">
                            ARCHIVE DETAILS · {item.collection}
                          </span>
                          <button
                            onClick={(e) => toggleFlipCard(item.id, e)}
                            className="text-xs text-[#DEC596] hover:underline uppercase tracking-wider cursor-pointer"
                          >
                            {ringConfig.flipBackPrompt}
                          </button>
                        </div>
                        <h4 className="font-anton text-xl tracking-tight text-[#FAF7F2] uppercase mb-2">
                          {item.title}
                        </h4>
                        <p className="text-xs font-sans text-[#FAF7F2]/80 leading-relaxed mb-4">
                          {item.shortDescription}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div className="border-t border-[#DEC596]/15 pt-2 space-y-1 text-[11px] font-sans">
                          {item.credits.designer && (
                            <p className="text-[#FAF7F2]/70">
                              <span className="font-semibold text-[#DEC596]">Atelier:</span>{' '}
                              {item.credits.designer}
                            </p>
                          )}
                          {item.credits.photographer && (
                            <p className="text-[#FAF7F2]/70">
                              <span className="font-semibold text-[#DEC596]">Lens:</span>{' '}
                              {item.credits.photographer}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {item.tags.map((tag, tIdx) => (
                            <span
                              key={tIdx}
                              className="text-[9px] uppercase tracking-wider bg-[#141018] px-2.5 py-0.5 rounded-full text-[#DEC596] border border-[#DEC596]/20 font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectLook(item);
                          }}
                          className="w-full mt-2 py-2.5 bg-[#DEC596] hover:bg-[#F5EEDC] text-[#0B090C] text-xs font-sans uppercase tracking-[0.18em] transition-all rounded-full shadow-md font-semibold cursor-pointer"
                        >
                          {ringConfig.inspectButtonLabel}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Indicators below cylinder */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-2 z-20">
          {cards.map((_, idx) => (
            <button
              key={idx}
              onClick={() => rotateToCard(idx)}
              className="w-2.5 h-2.5 rounded-full border border-black/30 hover:bg-[#8B0000] transition-colors"
              aria-label={`Rotate cylinder to card ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* MOBILE RESPONSIVE FALLBACK */}
      <div className="md:hidden px-6 space-y-6">
        <p className="text-xs uppercase tracking-widest text-[#DEC596] font-semibold">
          {ringConfig.mobileBadge}
        </p>
        <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory scrollbar-none">
          {cards.map((item, idx) => {
            const isRed = item.isEditorialRed ?? (idx + 1) % 3 === 0;
            return (
              <div
                key={item.id}
                className={`snap-center shrink-0 w-[84vw] p-6 rounded-2xl border shadow-xl ${
                  isRed ? 'bg-[#4E0A17]/95 text-[#FAF7F2] border-[#DEC596]/30' : 'bg-[#141018]/95 text-[#FAF7F2] border-[#DEC596]/20'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span
                    className={`text-[9px] uppercase tracking-widest font-semibold px-2.5 py-1 rounded-full ${
                      isRed ? 'bg-white/20 text-[#FAF7F2]' : 'bg-[#DEC596]/15 text-[#DEC596]'
                    }`}
                  >
                    {item.featuredSeal || 'EDITORIAL'}
                  </span>
                  <span className="text-[10px] text-[#DEC596]/70">0{idx + 1}</span>
                </div>
                <h4 className="font-anton text-xl uppercase mb-2 text-[#FAF7F2]">{item.title}</h4>
                <div className="h-64 w-full bg-black/20 overflow-hidden rounded-xl my-3 border border-white/10">
                  <img
                    src={item.primaryImage}
                    alt={item.imageAlt || item.title}
                    className="w-full h-full object-cover"
                    style={{ objectPosition: item.focalPoint || 'center top' }}
                    loading="lazy"
                  />
                </div>
                <p className="text-xs leading-relaxed opacity-85 mb-3 text-[#FAF7F2]/80">{item.shortDescription}</p>
                <button
                  onClick={() => onSelectLook(item)}
                  className={`w-full py-2.5 text-xs uppercase tracking-widest font-semibold rounded-full transition-colors cursor-pointer ${
                    isRed ? 'bg-[#DEC596] text-[#0B090C]' : 'bg-[#DEC596] text-[#0B090C]'
                  }`}
                >
                  {ringConfig.inspectButtonLabel}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
