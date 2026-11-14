import React from 'react';
import { useContent } from '../context/ContentContext';
import { WEBSITE_CONTENT } from '../data';

interface ContactProps {
  onBackToTop: () => void;
}

export const Contact: React.FC<ContactProps> = ({ onBackToTop }) => {
  const { content } = useContent();
  const contactConfig = content?.contact || WEBSITE_CONTENT.contact;

  return (
    <section
      id="contact"
      className="relative min-h-screen w-full bg-transparent text-[#FAF7F2] flex flex-col justify-between pt-16 md:pt-24 pb-10 px-6 md:px-14 select-none overflow-hidden border-t border-[#DEC596]/15"
    >
      {/* Background Luxury Velvet & Gold Ambient Glow */}
      <div className="absolute inset-0 bg-radial from-[#6E1426]/25 via-transparent to-transparent pointer-events-none" />

      {/* Background Luxury Watermark Texture */}
      {contactConfig.watermarkText ? (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center font-anton text-[40vw] text-white leading-none">
          {contactConfig.watermarkText}
        </div>
      ) : null}

      {/* TOP DECORATIVE STRIP */}
      <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#DEC596]/15 pb-4">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
          <span className="text-xs uppercase tracking-[0.25em] font-sans font-medium text-[#DEC596]">
            {contactConfig.badge}
          </span>
        </div>
        <span className="text-[11px] font-sans tracking-[0.2em] text-[#FAF7F2]/60 uppercase">
          {contactConfig.destinationsText}
        </span>
      </div>

      {/* GIGANTIC ANTON HEADLINE */}
      <div className="relative z-10 my-auto py-8">
        <h2 className="font-anton text-[min(36vh,26vw)] leading-[0.84] tracking-tight uppercase text-[#FAF7F2] select-none text-left md:text-center">
          <span className="block transform hover:scale-[1.01] transition-transform duration-500">
            {contactConfig.headlineMain}
          </span>
          <span className="block text-[#F5EEDC] transform hover:scale-[1.01] transition-transform duration-500 drop-shadow-[0_0_35px_rgba(222,197,150,0.3)]">
            {contactConfig.headlineAction}
          </span>
        </h2>
      </div>

      {/* BOTTOM CONTACT CONTENT & SOCIAL CHANNELS */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-end border-b border-[#DEC596]/15 pb-12 mb-8">
        {/* Bottom-Left: Primary Email Address in Anton with animated wipe underline */}
        <div className="lg:col-span-7 flex flex-col justify-end space-y-4">
          <span className="text-xs uppercase tracking-[0.25em] text-[#DEC596] font-sans block font-semibold">
            {contactConfig.inquiriesLabel}
          </span>

          <a
            href={`mailto:${contactConfig.email}`}
            className="font-anton text-[clamp(34px,3.7vw,74px)] text-[#FAF7F2] hover:text-[#F5EEDC] transition-colors leading-none tracking-tight email-underline-wipe inline-block"
            aria-label={`Send email to ${contactConfig.email}`}
          >
            {contactConfig.email}
          </a>

          <p className="text-xs md:text-sm font-sans text-[#FAF7F2]/80 max-w-lg leading-relaxed pt-2">
            {contactConfig.bookingNotice}
          </p>
        </div>

        {/* Bottom-Right: Stacked Social Links with Luxury Card Styling */}
        <div className="lg:col-span-5 flex flex-col space-y-3.5">
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#DEC596] font-sans mb-1 block font-semibold">
            {contactConfig.channelsLabel}
          </span>

          {/* Instagram */}
          {contactConfig.social.instagram.isVisible && (
            <a
              href={contactConfig.social.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-2xl bg-gradient-to-r from-[#181120]/90 to-[#120D18]/90 backdrop-blur-xl border border-[#DEC596]/25 hover:border-[#DEC596]/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(222,197,150,0.25)] flex items-center justify-between text-[#FAF7F2] group transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col">
                <span className="font-anton text-lg tracking-wider uppercase group-hover:text-[#F5EEDC] transition-colors">
                  {contactConfig.social.instagram.label}
                </span>
                {contactConfig.social.instagram.handle && (
                  <span className="text-[11px] font-sans text-[#DEC596]/75 tracking-wider">
                    {contactConfig.social.instagram.handle}
                  </span>
                )}
              </div>
              <span className="text-xl font-mono text-[#DEC596] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
          )}

          {/* Digital Lookbook */}
          {contactConfig.social.lookbook.isVisible && (
            <a
              href={contactConfig.social.lookbook.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-2xl bg-gradient-to-r from-[#181120]/90 to-[#120D18]/90 backdrop-blur-xl border border-[#DEC596]/25 hover:border-[#DEC596]/70 hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_25px_rgba(222,197,150,0.25)] flex items-center justify-between text-[#FAF7F2] group transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col">
                <span className="font-anton text-lg tracking-wider uppercase group-hover:text-[#F5EEDC] transition-colors">
                  {contactConfig.social.lookbook.label}
                </span>
                {contactConfig.social.lookbook.sub && (
                  <span className="text-[11px] font-sans text-[#DEC596]/75 tracking-wider">
                    {contactConfig.social.lookbook.sub}
                  </span>
                )}
              </div>
              <span className="text-xl font-mono text-[#DEC596] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
          )}

          {/* Agency Management */}
          {contactConfig.social.agency?.isVisible && (
            <a
              href={contactConfig.social.agency.url}
              target="_blank"
              rel="noopener noreferrer"
              className="py-4 px-6 rounded-2xl bg-gradient-to-r from-[#201322]/90 to-[#150E1A]/90 backdrop-blur-xl border border-[#DEC596]/30 hover:border-[#DEC596]/80 hover:shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_30px_rgba(222,197,150,0.3)] flex items-center justify-between text-[#FAF7F2] group transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex flex-col">
                <span className="font-anton text-lg tracking-wider uppercase group-hover:text-[#F5EEDC] transition-colors">
                  {contactConfig.social.agency.label}
                </span>
                {contactConfig.social.agency.sub && (
                  <span className="text-[11px] font-sans text-[#DEC596]/90 tracking-wider font-medium">
                    {contactConfig.social.agency.sub}
                  </span>
                )}
              </div>
              <span className="text-xl font-mono text-[#DEC596] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">↗</span>
            </a>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans tracking-[0.2em] uppercase text-[#FAF7F2]/60">
        <div>{contactConfig.footer.copyrightText}</div>

        <div className="flex items-center gap-8">
          <span className="hidden md:inline text-[#FAF7F2]/40">{contactConfig.footer.tagline}</span>
          <button
            onClick={onBackToTop}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-[#DEC596] to-[#F5EEDC] text-[#0B090C] font-semibold shadow-[0_0_25px_rgba(222,197,150,0.35)] hover:shadow-[0_0_35px_rgba(222,197,150,0.55)] transition-all flex items-center gap-2 cursor-pointer text-[11px] tracking-[0.2em]"
          >
            <span>{contactConfig.footer.backToTopLabel}</span>
          </button>
        </div>
      </footer>
    </section>
  );
};
