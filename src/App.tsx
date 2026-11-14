import React, { useState, useEffect, useRef } from 'react';
import { ReactLenis, useLenis } from 'lenis/react';
import { ContentProvider, useContent } from './context/ContentContext';
import { Navigation } from './components/Navigation';
import { Hero } from './components/Hero';
import { EditorialScrollStack } from './components/EditorialScrollStack';
import { PortfolioGallery } from './components/PortfolioGallery';
import { BladeTransition } from './components/BladeTransition';
import { About } from './components/About';
import { JourneyTimeline } from './components/JourneyTimeline';
import { PressTearSheets } from './components/PressTearSheets';
import { Contact } from './components/Contact';
import { Lightbox } from './components/Lightbox';
import { ContentEditorModal } from './components/ContentEditorModal';
import { PortfolioItem } from './types';

const SECTION_PAGES = [
  { id: 'hero', label: 'Home / Reel', subtitle: 'The Bridal Model & Video Reel' },
  { id: 'looks', label: 'Scroll Stack', subtitle: 'Editorial Looks & Full-Screen Showcase' },
  { id: 'portfolio', label: 'Portfolio', subtitle: 'Bridal Archive & Signature Looks' },
  { id: 'about', label: 'About', subtitle: 'Model Profile & Measurements' },
  { id: 'journey', label: 'Experience', subtitle: 'Career Journey & Runway Highlights' },
  { id: 'press', label: 'Press & Covers', subtitle: 'Magazine Covers & Published Spreads' },
  { id: 'contact', label: 'Contact', subtitle: 'Direct Inquiries & Bookings' }
];

const MainAppContent: React.FC = () => {
  const {
    content,
    navigateTo,
    editorOpen,
    setEditorOpen,
    openEditor
  } = useContent();

  const [activeSection, setActiveSection] = useState<string>('hero');
  const [isRedSection, setIsRedSection] = useState<boolean>(false);
  const [lightboxItem, setLightboxItem] = useState<PortfolioItem | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Guarantee mobile and desktop video playback by setting muted and invoking play()
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true;
      videoRef.current.defaultMuted = true;
      try {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {
            // Fallback: browser autoplay policy caught; poster image remains displayed
          });
        }
      } catch (_) {}
    }
  }, [content?.hero?.primaryMedia?.video?.src]);

  const lenis = useLenis();

  // Expose global lenis instance on window and ensure fresh scroll to top on load
  useEffect(() => {
    if (lenis && typeof window !== 'undefined') {
      (window as any).lenis = lenis;
      lenis.scrollTo(0, { immediate: true });
      return () => {
        delete (window as any).lenis;
      };
    }
  }, [lenis]);

  // Safety: Guarantee scroll unlock
  useEffect(() => {
    document.body.style.overflow = '';
  }, []);

  // Keyboard shortcut: Ctrl+E or Cmd+E opens the live customizer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        setEditorOpen(!editorOpen);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorOpen, setEditorOpen]);

  // Force manual scroll restoration so browser refresh always restarts at top intro page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ('scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'manual';
      }
      // If there was an old section hash (like #looks), clear it so refresh never gets trapped
      if (window.location.hash) {
        window.history.replaceState(null, '', window.location.pathname);
      }
      window.scrollTo(0, 0);
    }

    const params = new URLSearchParams(window.location.search);
    if (params.get('edit') === 'true') {
      const allowedTabs = [
        'model',
        'specifications',
        'hero',
        'lookRing',
        'portfolio',
        'about',
        'journey',
        'press',
        'specialities',
        'contact',
        'export'
      ];
      const requestedTab = params.get('tab') || 'model';
      const safeTab = allowedTabs.includes(requestedTab) ? requestedTab : 'model';
      openEditor(safeTab);
    }
  }, []);

  // Active section tracking with Intersection Observer for continuous scroll
  useEffect(() => {
    const sectionIds = ['hero', 'looks', 'portfolio', 'about', 'journey', 'press', 'contact'];

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveSection(id);
          setIsRedSection(id === 'contact');
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.15,
      rootMargin: '-80px 0px -40% 0px'
    });

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavigate = (sectionId: string) => {
    navigateTo(sectionId);
  };

  const handleBackToTop = () => {
    if (lenis) {
      lenis.scrollTo(0, { duration: 1.4 });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const heroImageSrc =
    content?.hero?.primaryMedia?.image?.src ||
    '/media/photos/hero/hero-bridal-portrait.jpg';

  return (
    <div className="min-h-screen bg-[#0B090C] text-[#FAF7F2] relative selection:bg-[#DEC596] selection:text-[#0B090C]">
      {/* ================================================================= */}
      {/* GLOBAL BRIDAL BACKGROUND (Spans from first page to last page)      */}
      {/* Full picture stretches across entire site, visible when scrolling */}
      {/* ================================================================= */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {/* Full-bleed Model Video Reel or High-Resolution Photograph spanning the entire site background */}
        {content?.hero?.primaryMedia?.video?.src ? (
          <video
            ref={videoRef}
            src={content.hero.primaryMedia.video.src}
            poster={heroImageSrc}
            autoPlay
            loop
            muted
            playsInline
            webkit-playsinline="true"
            preload="auto"
            className="w-full h-full object-cover object-[center_12%] md:object-[72%_15%]"
          />
        ) : (
          <img
            src={heroImageSrc}
            alt={content?.hero?.primaryMedia?.image?.alt || `${content?.hero?.fullName || 'Haute Couture'} Editorial Portfolio`}
            className="w-full h-full object-cover object-[center_12%] md:object-[72%_15%]"
          />
        )}

        {/* Cinematic Multiply Wash in Warm Obsidian & Velvet Undertones */}
        <div className="absolute inset-0 bg-[#0B090C]/40 mix-blend-multiply" />

        {/* Global Editorial Vignette: Soft directional left fade for reading text */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B090C]/95 via-[#0B090C]/75 md:via-[#0B090C]/45 to-transparent" />

        {/* Top and Bottom Feathering Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B090C]/90 via-transparent to-[#0B090C]/95" />

        {/* Ethereal Polki Gold & Velvet Rose Sheen */}
        <div
          className="absolute inset-0 opacity-30 mix-blend-screen"
          style={{
            background:
              'radial-gradient(circle at 72% 28%, rgba(222, 197, 150, 0.22) 0%, rgba(110, 20, 38, 0.12) 45%, transparent 70%)'
          }}
        />

        {/* Subtle Ambient Grain & Atmosphere */}
        {content.hero?.watermarkText ? (
          <div className="absolute top-1/4 right-4 opacity-[0.02] select-none font-anton text-[28vw] leading-none text-right text-white tracking-tighter pointer-events-none">
            {content.hero.watermarkText}
          </div>
        ) : null}
      </div>

      {/* ========================================================= */}
      {/* CONTINUOUS LUXURY EDITORIAL FLOW                         */}
      {/* ========================================================= */}
      <main className="w-full relative z-10">
        {/* 1. Hero Section */}
        <Hero onExploreClick={() => navigateTo('looks')} />

        {/* Blade Transition into Scroll Stack */}
        <BladeTransition label="BRIDAL COUTURE · SCROLL STACK" variant="white-to-red" skewAngle={3} />

        {/* 2. ScrollExpand + Right-to-Left Card Stack Section */}
        <EditorialScrollStack onOpenLightbox={(item) => setLightboxItem(item)} />

        {/* Blade Transition into Portfolio Gallery */}
        <BladeTransition label="EDITORIAL ARCHIVE" variant="red-to-white" skewAngle={3} />

        {/* 3. Portfolio Section */}
        <PortfolioGallery onOpenLightbox={(item) => setLightboxItem(item)} />

        {/* Blade Transition into About */}
        <BladeTransition label="MUSE PROFILE" variant="white-to-red" skewAngle={4} />

        {/* 4. About Section */}
        <About />

        {/* 5. Experience Timeline */}
        <JourneyTimeline />

        {/* Blade Transition into Editorial Press & Tear Sheets */}
        <BladeTransition label="EDITORIAL PRESS & TEAR SHEETS" variant="white-to-red" skewAngle={4} />

        {/* 6. Editorial Press & Covers */}
        <PressTearSheets />

        {/* Blade Transition into Contact Finale */}
        <BladeTransition label="COMMISSION & BOOKINGS" variant="white-to-red" skewAngle={4} />

        {/* 7. Contact Section */}
        <Contact onBackToTop={handleBackToTop} />
      </main>

      {/* Accessible Lightbox Modal */}
      <Lightbox
        item={lightboxItem}
        allItems={(content?.portfolioItems || []).filter((i) => !i?.isHidden)}
        onClose={() => {
          setLightboxItem(null);
          document.body.style.overflow = '';
        }}
        onNavigate={(newItem) => setLightboxItem(newItem)}
      />

      {/* Top-Right Fixed Action: Premium 'Book Shoot' Button */}
      <div className="fixed top-5 right-5 sm:top-6 sm:right-6 md:top-8 md:right-10 z-40 select-none">
        <button
          onClick={() => navigateTo('contact')}
          className="group relative flex items-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-[#141018]/85 hover:bg-[#DEC596] text-[#FAF7F2] hover:text-[#0B090C] border border-[#DEC596]/35 hover:border-[#DEC596] backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_15px_rgba(222,197,150,0.12)] hover:shadow-[0_0_28px_rgba(222,197,150,0.45)] transition-all duration-300 font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] font-semibold cursor-pointer"
          aria-label="Book Shoot"
          title="Book Shoot — Direct Inquiries & Commissions"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#DEC596] group-hover:bg-[#0B090C] shadow-[0_0_8px_rgba(222,197,150,0.8)] transition-colors" />
          <span>Book Shoot</span>
          <span className="text-xs font-mono transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 text-[#DEC596] group-hover:text-[#0B090C]">
            ↗
          </span>
        </button>
      </div>

      {/* Floating Control Dock (Bottom-Right: Live Customizer Action) */}
      <aside
        aria-label="Floating Controls"
        className="fixed bottom-6 right-6 z-40 flex items-center bg-[#141018]/90 backdrop-blur-xl p-1.5 rounded-full border border-[#DEC596]/30 shadow-[0_16px_45px_rgba(0,0,0,0.7),0_0_25px_rgba(222,197,150,0.15)] select-none"
      >
        <button
          onClick={() => openEditor('model')}
          className="bg-[#1F1926]/90 hover:bg-[#DEC596] hover:text-[#0B090C] text-[#FAF7F2] text-[10px] tracking-[0.16em] uppercase font-sans font-semibold px-4 py-2 rounded-full border border-[#DEC596]/20 transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-sm group"
          title="Open Live Content Editor or press Ctrl+E"
        >
          <span className="text-xs text-[#DEC596] group-hover:text-[#0B090C] transition-colors">✦</span>
          <span>Edit</span>
        </button>
      </aside>

      {/* Live Content Customizer Modal */}
      <ContentEditorModal />
    </div>
  );
};

const LENIS_OPTIONS = {
  lerp: 0.08,
  duration: 1.2,
  smoothWheel: true,
  wheelMultiplier: 1.0,
  touchMultiplier: 2.0,
  syncTouch: true
};

export const App: React.FC = () => {
  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      <ContentProvider>
        <MainAppContent />
      </ContentProvider>
    </ReactLenis>
  );
};