import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';

interface NavigationProps {
  activeSection: string;
  isRedSection: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeSection,
  isRedSection,
  onNavigate
}) => {
  const { content, viewMode, setViewMode, activePage, navigateTo, openEditor } = useContent();
  const navConfig = content.navigation;
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    // Explicitly safety-reset body overflow in case it was locked
    document.body.style.overflow = '';
    onNavigate(id);
    navigateTo(id);
  };

  // Contrast logic: When in the red Contact section or over red transition, use white text
  const textColorClass = isRedSection ? 'text-white' : 'text-[#111113]';
  const navBgClass = isRedSection
    ? 'bg-transparent'
    : isScrolled
    ? 'bg-[#141018]/90 backdrop-blur-xl border-b border-[#DEC596]/15 shadow-xl'
    : 'bg-transparent';
  const activeIndicatorColor = isRedSection ? 'bg-[#DEC596]' : 'bg-[#6E1426]';

  // The first page acts as a plain, spacious intro page without the upper navigation strip
  const isIntroPage = activeSection === 'hero' && !isScrolled;

  const visibilityClass = isIntroPage
    ? '-translate-y-full opacity-0 pointer-events-none'
    : 'translate-y-0 opacity-100 pointer-events-auto';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 py-3.5 px-6 md:px-12 flex items-center justify-between ${navBgClass} ${visibilityClass}`}
      >
        {/* Monogram / Brand Wordmark */}
        <a
          href="#hero"
          onClick={(e) => handleLinkClick(e, 'hero')}
          className={`flex items-center gap-3.5 group transition-colors duration-300 ${textColorClass}`}
        >
          <span className="font-anton text-xl tracking-widest px-3 py-1 border border-[#DEC596]/40 rounded-full text-[#F5EEDC] transition-all duration-300 group-hover:scale-105 group-hover:border-[#DEC596] group-hover:shadow-[0_0_15px_rgba(222,197,150,0.3)] bg-[#141018]/60 backdrop-blur-md">
            {navConfig.monogram}
          </span>
          <div className="flex flex-col">
            <span className="font-anton text-sm tracking-[0.2em] uppercase text-[#FAF7F2] group-hover:text-[#F5EEDC] transition-colors">
              {navConfig.brandName}
            </span>
            <span className="text-[9px] tracking-[0.25em] uppercase text-[#DEC596]/85 font-sans font-medium">
              {navConfig.brandSubtitle}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-[0.22em] font-sans font-medium">
          {navConfig.links.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className={`relative py-1.5 transition-colors duration-300 hover:opacity-100 ${
                  isActive
                    ? 'opacity-100 font-semibold'
                    : 'opacity-70 hover:opacity-100'
                } ${textColorClass}`}
              >
                {link.label}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[1.5px] transition-all duration-300 ${activeIndicatorColor}`}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Action Area: Edit Shortcut + CTA */}
        <div className="hidden md:flex items-center gap-3">
          {/* Quick Edit shortcut */}
          <button
            onClick={() => openEditor('model')}
            title="Open Live Content Editor"
            className="text-[11px] uppercase tracking-[0.16em] px-3.5 py-1.5 border border-[#DEC596]/25 text-[#FAF7F2]/80 hover:text-[#0B090C] hover:border-[#DEC596] hover:bg-[#DEC596] transition-all rounded-full flex items-center gap-1.5 cursor-pointer bg-[#141018]/60 backdrop-blur-md"
          >
            <span className="text-[#DEC596] hover:text-[#0B090C]">✎</span>
            <span>Edit</span>
          </button>

          {/* Action / Availability pill */}
          {navConfig.ctaButton.isVisible && (
            <a
              href={navConfig.ctaButton.href}
              onClick={(e) => handleLinkClick(e, navConfig.ctaButton.href.replace('#', ''))}
              className="text-[11px] uppercase tracking-[0.2em] px-5 py-2 border border-[#DEC596]/60 text-[#DEC596] hover:bg-[#DEC596] hover:text-[#0B090C] rounded-full transition-all duration-300 font-semibold shadow-[0_0_15px_rgba(222,197,150,0.15)] hover:shadow-[0_0_25px_rgba(222,197,150,0.4)]"
            >
              {navConfig.ctaButton.label}
            </a>
          )}
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
            document.body.style.overflow = '';
          }}
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className={`lg:hidden p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-[#DEC596] ${textColorClass}`}
        >
          <svg
            className="w-6 h-6 transition-transform duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </header>

      {/* Mobile Drawer Navigation (<820px) */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B090C]/98 backdrop-blur-2xl flex flex-col justify-center px-8 lg:hidden animate-fadeIn">
          <div className="flex flex-col gap-5 text-left">
            <div className="flex justify-between items-center pb-3 border-b border-[#DEC596]/15">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#DEC596] font-semibold">
                {navConfig.mobileMenuTitle}
              </span>
            </div>

            {navConfig.links.map((link) => (
              <a
                key={link.id}
                href={`#${link.id}`}
                onClick={(e) => handleLinkClick(e, link.id)}
                className="font-anton text-2xl tracking-wider text-[#FAF7F2] hover:text-[#DEC596] transition-colors py-1 flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-sm font-sans text-[#DEC596]/60">↗</span>
              </a>
            ))}

            <div className="pt-4 border-t border-[#DEC596]/15 mt-2 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openEditor('hero');
                }}
                className="w-full py-2.5 bg-[#DEC596] text-[#0B090C] font-anton tracking-wider uppercase text-sm rounded-full font-semibold shadow-md cursor-pointer"
              >
                ✎ Open Live Content Editor
              </button>

              <span className="text-xs uppercase tracking-widest text-[#FAF7F2]/60">
                {navConfig.mobileInquiriesLabel}
              </span>
              <a
                href={`mailto:${content.contact.email}`}
                className="text-sm text-[#FAF7F2] hover:text-[#DEC596] font-medium"
              >
                {content.contact.email}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
