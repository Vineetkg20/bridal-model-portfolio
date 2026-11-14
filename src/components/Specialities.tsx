import React, { useState } from 'react';
import { useContent } from '../context/ContentContext';
import { SpecialitySkill } from '../types';

export const Specialities: React.FC = () => {
  const { content } = useContent();
  const specConfig = content.specialities || {
    badge: 'TECHNICAL SPECIALITIES',
    heading: 'SKILLS & MOVEMENT',
    sub: 'Disciplines & Haute Couture Mastery',
    categories: ['All'],
    skills: []
  };
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const visibleSkills = specConfig.skills.filter((s) => !s.isHidden);

  const filteredSkills =
    activeCategory === 'All'
      ? visibleSkills
      : visibleSkills.filter((s) => s.category === activeCategory);

  return (
    <section
      id="specialities"
      className="relative w-full py-24 md:py-32 bg-transparent text-[#FAF7F2] px-6 md:px-14 border-t border-[#DEC596]/15"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2 h-2 rounded-full bg-[#DEC596] shadow-[0_0_10px_rgba(222,197,150,0.8)]" />
          <span className="text-xs uppercase tracking-[0.25em] text-[#DEC596] font-semibold">
            {specConfig.badge}
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#DEC596]/15 pb-8 mb-12">
          <div>
            <h2 className="font-anton text-4xl sm:text-5xl md:text-6xl tracking-tight uppercase text-[#FAF7F2]">
              {specConfig.heading}
            </h2>
            <p className="text-xs md:text-sm font-sans tracking-widest uppercase text-[#FAF7F2]/65 mt-2 max-w-xl">
              {specConfig.sub}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 text-[11px] font-sans uppercase tracking-wider">
            {specConfig.categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full border transition-all duration-300 font-medium ${
                  activeCategory === cat
                    ? 'bg-[#DEC596] border-[#DEC596] text-[#0B090C] font-semibold shadow-[0_0_20px_rgba(222,197,150,0.4)]'
                    : 'bg-[#141018]/60 border-[#DEC596]/15 text-[#FAF7F2]/70 hover:border-[#DEC596]/50 hover:text-[#FAF7F2] backdrop-blur-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 16 Skills in balanced editorial cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill: SpecialitySkill, index: number) => (
            <div
              key={skill.id}
              className="group p-6 md:p-7 luxury-card hover:border-[#DEC596]/60 hover:shadow-[0_25px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(222,197,150,0.2)] transition-all duration-500 shadow-xl flex flex-col justify-between hover:-translate-y-2 cursor-default"
            >
              <div>
                <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-[#FAF7F2]/50 mb-3.5">
                  <span className="text-[#DEC596] font-semibold tracking-[0.2em]">{skill.category}</span>
                  <span className="font-mono text-[#DEC596]/80 font-bold">{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                </div>

                <h3 className="font-anton text-xl tracking-tight uppercase leading-snug text-[#FAF7F2] group-hover:text-[#F5EEDC] transition-colors">
                  {skill.name}
                </h3>
              </div>

              <div className="pt-4 mt-4 border-t border-[#DEC596]/15">
                <p className="text-xs font-sans text-[#FAF7F2]/80 leading-relaxed font-normal">
                  {skill.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
