import React, { useState, useEffect, useRef } from 'react';
import { useContent } from '../context/ContentContext';
import { PortfolioItem, WebsiteContentConfig, JourneyMilestone, SpecialitySkill, TearSheetItem } from '../types';
import { WEBSITE_CONTENT } from '../data';
import { deepMergeWithDefaults } from '../utils/contentMerge';

interface ContentEditorModalProps {
  content?: WebsiteContentConfig;
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (updated: WebsiteContentConfig) => void;
  onReset?: () => void;
}

export const ContentEditorModal: React.FC<ContentEditorModalProps> = ({
  content: propContent,
  isOpen: propIsOpen,
  onClose: propOnClose,
  onSave: propOnSave,
  onReset: propOnReset
}) => {
  const context = useContent();

  // Use props if provided, otherwise fallback to context
  const content = propContent || context.content;
  const isOpen = propIsOpen !== undefined ? propIsOpen : context.editorOpen;
  const onClose = propOnClose || context.closeEditor;
  const onSave = propOnSave || context.updateContent;
  const onReset = propOnReset || context.resetToDefaults;

  const [formData, setFormData] = useState<WebsiteContentConfig>(content);
  const [activeTab, setActiveTab] = useState<string>(context.editorInitialTab || 'model');
  const [copySuccess, setCopySuccess] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [showImportBox, setShowImportBox] = useState(false);
  const [updateToast, setUpdateToast] = useState<string | null>(null);
  const [liveAutoUpdate, setLiveAutoUpdate] = useState(true);

  // Snapshot taken whenever modal opens, used to restore original text on Cancel
  const initialSnapshotRef = useRef<WebsiteContentConfig>(content);

  useEffect(() => {
    if (isOpen) {
      initialSnapshotRef.current = JSON.parse(JSON.stringify(content));
      setFormData(content);
    }
  }, [isOpen]);

  // Synchronize when external content changes while closed
  useEffect(() => {
    if (!isOpen) {
      setFormData(content);
    }
  }, [content, isOpen]);

  useEffect(() => {
    if (context.editorInitialTab) {
      setActiveTab(context.editorInitialTab);
    }
  }, [context.editorInitialTab]);

  // Cleanly handle body scroll lock and Escape key listener
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleCancelAndRevert();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const triggerUpdate = (updatedData: WebsiteContentConfig, showBanner = true) => {
    onSave(updatedData);
    if (context.updateContent && onSave !== context.updateContent) {
      context.updateContent(updatedData);
    }
    if (showBanner) {
      setUpdateToast('✓ WEBSITE UPDATED IN REAL-TIME! Changes are now live on your site.');
      setTimeout(() => {
        setUpdateToast(null);
      }, 4000);
    }
  };

  // Atomic field updates supporting single path or dictionary of multiple paths
  const handleFieldChange = (
    updates: Record<string, any> | string,
    singleValue?: any
  ) => {
    setFormData((prev) => {
      const cloned = JSON.parse(JSON.stringify(prev));
      const dict: Record<string, any> =
        typeof updates === 'string' ? { [updates]: singleValue } : updates;

      for (const [path, val] of Object.entries(dict)) {
        const parts = path.split('.');
        // Defend against prototype pollution traversal
        if (parts.some((p) => p === '__proto__' || p === 'constructor' || p === 'prototype')) {
          continue;
        }
        let current = cloned;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!current[parts[i]]) current[parts[i]] = {};
          current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = val;
      }

      if (liveAutoUpdate) {
        onSave(cloned);
        if (context.updateContent && onSave !== context.updateContent) {
          context.updateContent(cloned);
        }
      }

      return cloned;
    });
  };

  const handleManualSave = () => {
    triggerUpdate(formData, true);
    // Baseline is now updated to the newly saved formData
    initialSnapshotRef.current = JSON.parse(JSON.stringify(formData));
  };

  const handleCancelAndRevert = () => {
    // Restore original text and content from the snapshot before editing
    if (initialSnapshotRef.current) {
      onSave(initialSnapshotRef.current);
      if (context.updateContent && onSave !== context.updateContent) {
        context.updateContent(initialSnapshotRef.current);
      }
      setFormData(initialSnapshotRef.current);
    }
    onClose();
    document.body.style.overflow = '';
  };

  const handleViewSection = (sectionId: string) => {
    triggerUpdate(formData, false);
    initialSnapshotRef.current = JSON.parse(JSON.stringify(formData));
    onClose();
    document.body.style.overflow = '';
    context.navigateTo(sectionId);
  };

  // Portfolio items CRUD
  const handleTogglePortfolioHide = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(formData));
    cloned.portfolioItems[index].isHidden = !cloned.portfolioItems[index].isHidden;
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  const handleDeletePortfolioItem = (index: number) => {
    if (window.confirm(`Delete look "${formData.portfolioItems[index].title}"?`)) {
      const cloned = JSON.parse(JSON.stringify(formData));
      cloned.portfolioItems.splice(index, 1);
      setFormData(cloned);
      if (liveAutoUpdate) triggerUpdate(cloned, false);
    }
  };

  const handleAddPortfolioItem = () => {
    const newItem: PortfolioItem = {
      id: `look-custom-${Date.now()}`,
      title: 'New Bridal Creation',
      category: 'Royal Bridal',
      collection: 'COUTURE ATELIER',
      primaryImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=80',
      shortDescription: 'Exquisite handcrafted bridal ensemble with intricate embroidery and delicate tulle.',
      tags: ['Couture', 'Bridal', 'Handmade'],
      credits: {
        designer: 'Custom Atelier',
        photographer: 'Editorial Studio'
      },
      order: formData.portfolioItems.length + 1,
      isHidden: false
    };

    const cloned = JSON.parse(JSON.stringify(formData));
    cloned.portfolioItems.push(newItem);
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  // Milestones CRUD
  const handleAddMilestone = () => {
    const newMilestone: JourneyMilestone = {
      id: `milestone-${Date.now()}`,
      dateOrPeriod: '2026',
      title: 'New Milestone Highlight',
      brandOrPublication: 'Bridal Atelier',
      description: 'Featured in premier international bridal campaign showcasing royal couture.',
      tag: 'EDITORIAL',
      isHidden: false
    };
    const cloned = JSON.parse(JSON.stringify(formData));
    cloned.journey.milestones.push(newMilestone);
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  const handleDeleteMilestone = (index: number) => {
    if (window.confirm('Delete this milestone?')) {
      const cloned = JSON.parse(JSON.stringify(formData));
      cloned.journey.milestones.splice(index, 1);
      setFormData(cloned);
      if (liveAutoUpdate) triggerUpdate(cloned, false);
    }
  };

  // Skills CRUD
  const handleAddSkill = () => {
    const newSkill: SpecialitySkill = {
      id: `skill-${Date.now()}`,
      name: 'Custom Artistry',
      category: 'Movement & Poise',
      tagline: 'Precision modeling and regal silhouette expression under high-fashion lighting.',
      isHidden: false
    };
    const cloned = JSON.parse(JSON.stringify(formData));
    if (!cloned.specialities) {
      cloned.specialities = { badge: 'TECHNICAL CAPABILITIES', heading: 'SPECIALITIES', sub: 'Movement & Poise', categories: [], skills: [] };
    }
    if (!cloned.specialities.skills) cloned.specialities.skills = [];
    cloned.specialities.skills.push(newSkill);
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  const handleDeleteSkill = (index: number) => {
    if (window.confirm('Delete this skill?')) {
      const cloned = JSON.parse(JSON.stringify(formData));
      if (cloned.specialities?.skills) {
        cloned.specialities.skills.splice(index, 1);
        setFormData(cloned);
        if (liveAutoUpdate) triggerUpdate(cloned, false);
      }
    }
  };

  // Tear sheets CRUD
  const handleAddTearSheet = () => {
    const newItem: TearSheetItem = {
      id: `tear-sheet-${Date.now()}`,
      publication: 'VOGUE INDIA',
      issue: 'SPECIAL COUTURE EDITION',
      title: 'New Bridal Editorial Feature',
      category: 'Vogue',
      coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      designer: 'Sabyasachi Mukherjee',
      photographer: 'Editorial Lens',
      spreadCount: '8-Page Feature',
      quote: 'An iconic bridal presence commanding modern high-fashion.',
      tags: ['Couture', 'Bridal', 'Cover'],
      order: (formData.press?.items?.length || 0) + 1,
      isHidden: false
    };
    const cloned = JSON.parse(JSON.stringify(formData));
    if (!cloned.press) cloned.press = { items: [] };
    if (!cloned.press.items) cloned.press.items = [];
    cloned.press.items.push(newItem);
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  const handleDeleteTearSheet = (index: number) => {
    if (window.confirm('Delete this tear sheet?')) {
      const cloned = JSON.parse(JSON.stringify(formData));
      if (cloned.press?.items) {
        cloned.press.items.splice(index, 1);
        setFormData(cloned);
        if (liveAutoUpdate) triggerUpdate(cloned, false);
      }
    }
  };

  // Hero Specifications CRUD
  const handleAddHeroSpecification = () => {
    const cloned = JSON.parse(JSON.stringify(formData));
    if (!cloned.hero.specifications) cloned.hero.specifications = [];
    cloned.hero.specifications.push({ label: 'Focus', value: 'Bridal Couture' });
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  const handleDeleteHeroSpecification = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(formData));
    cloned.hero.specifications.splice(index, 1);
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  // Model Measurements CRUD
  const handleAddMeasurement = () => {
    const cloned = JSON.parse(JSON.stringify(formData));
    if (!cloned.about.measurements) cloned.about.measurements = [];
    cloned.about.measurements.push({ label: 'Measurement', value: 'Value' });
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  const handleDeleteMeasurement = (index: number) => {
    const cloned = JSON.parse(JSON.stringify(formData));
    cloned.about.measurements.splice(index, 1);
    setFormData(cloned);
    if (liveAutoUpdate) triggerUpdate(cloned, false);
  };

  // Export & Import
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(formData, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2500);
  };

  const handleImportJSON = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        alert('Invalid configuration format. Expected a JSON configuration object.');
        return;
      }
      // Guarantee structural integrity, strip prototype pollution, and fallback missing fields
      const merged = deepMergeWithDefaults(WEBSITE_CONTENT, parsed);
      setFormData(merged);
      triggerUpdate(merged, true);
      setShowImportBox(false);
      setImportJsonText('');
      alert('✓ Configuration successfully imported and applied!');
    } catch (e) {
      alert('Invalid JSON configuration. Please check the syntax and try again.');
    }
  };

  const tabs = [
    { id: 'model', label: '1. Model & Identity', targetSection: 'hero' },
    { id: 'specifications', label: '✦ Model Specifications', targetSection: 'hero' },
    { id: 'hero', label: '2. Hero Video & Media', targetSection: 'hero' },
    { id: 'lookRing', label: '3. 3D Ring', targetSection: '3d-ring' },
    { id: 'portfolio', label: '4. Portfolio Looks', targetSection: 'portfolio' },
    { id: 'about', label: '5. About & Specs', targetSection: 'about' },
    { id: 'journey', label: '6. Journey Timeline', targetSection: 'journey' },
    { id: 'press', label: '7. Press & Tear Sheets', targetSection: 'press' },
    { id: 'specialities', label: '✦ Specialities (Archive)', targetSection: 'press' },
    { id: 'contact', label: '8. Contact & Socials', targetSection: 'contact' },
    { id: 'backup', label: '9. Backup & Export', targetSection: 'hero' }
  ];

  const currentTabObj = tabs.find((t) => t.id === activeTab) || tabs[0];

  return (
    <div
      data-lenis-prevent="true"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
      onClick={handleCancelAndRevert}
      role="dialog"
      aria-modal="true"
      aria-label="Editorial Website Customizer"
    >
      <div
        className="bg-white text-[#111113] w-full max-w-5xl h-[94vh] max-h-[900px] rounded-2xl md:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-[#DEC596]/30"
        onClick={(e) => e.stopPropagation()}
      >
        {/* TOP BAR: Header & Primary Action Controls */}
        <div className="bg-gradient-to-r from-[#4E0A17] via-[#6E1426] to-[#4E0A17] text-white px-6 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-[#DEC596]/20">
          <div className="flex items-center gap-3">
            <span className="font-anton text-xl tracking-wider uppercase text-[#F5EEDC]">✦ WEBSITE CONTENT CUSTOMIZER</span>
            <span className="hidden sm:inline-block text-[10px] tracking-widest uppercase bg-white/15 text-[#F5EEDC] font-sans px-3 py-0.5 rounded-full font-medium border border-white/20">
              Real-Time Live Sync
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Prominent Real-Time Update Button */}
            <button
              onClick={handleManualSave}
              className="px-5 py-2.5 bg-[#DEC596] text-[#0B090C] hover:bg-[#F5EEDC] font-anton text-xs tracking-wider uppercase rounded-full shadow-lg transition-all duration-200 flex items-center gap-1.5 active:scale-95 cursor-pointer font-semibold"
              title="Immediately update all text, media, and settings on the website"
            >
              <span>⚡</span>
              <span>UPDATE WEBSITE NOW</span>
            </button>

            {/* Jump To Section */}
            <button
              onClick={() => handleViewSection(currentTabObj.targetSection)}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 bg-black/35 hover:bg-black/60 text-[#FAF7F2] text-[11px] font-sans uppercase tracking-wider rounded-full border border-white/20 transition-colors cursor-pointer"
              title="Close editor and view this section on the live website"
            >
              <span>👁</span>
              <span>View On Website</span>
            </button>

            {/* Cancel & Close */}
            <button
              onClick={handleCancelAndRevert}
              className="text-[#FAF7F2] hover:text-white text-xs font-semibold tracking-wider uppercase border border-white/30 hover:border-white/60 px-3.5 py-2 rounded-full transition-colors cursor-pointer"
              title="Close and discard uncommitted changes"
            >
              Cancel ✕
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST BANNER */}
        {updateToast && (
          <div className="bg-emerald-600 text-white text-xs font-sans font-semibold py-2 px-6 flex items-center justify-between animate-fadeIn shadow-inner">
            <div className="flex items-center gap-2">
              <span className="text-sm">✓</span>
              <span>{updateToast}</span>
            </div>
            <button onClick={() => setUpdateToast(null)} className="text-white/80 hover:text-white text-xs">
              ✕
            </button>
          </div>
        )}

        {/* SECONDARY TOOLBAR: Auto-sync toggle & Direct section links */}
        <div className="bg-[#111113] text-white/80 px-6 py-2 flex flex-wrap items-center justify-between text-xs font-sans border-b border-black/10">
          <label className="flex items-center gap-2 cursor-pointer select-none text-white font-medium">
            <input
              type="checkbox"
              checked={liveAutoUpdate}
              onChange={(e) => setLiveAutoUpdate(e.target.checked)}
              className="w-4 h-4 accent-[#8B0000] cursor-pointer"
            />
            <span className="text-[11px] tracking-wide">Live Auto-Update as I type (changes reflect immediately)</span>
          </label>

          <div className="flex items-center gap-3 text-[11px]">
            <span className="text-white/40">Direct View:</span>
            <button onClick={() => handleViewSection('hero')} className="hover:text-white hover:underline">Hero</button>
            <span className="text-white/20">•</span>
            <button onClick={() => handleViewSection('3d-ring')} className="hover:text-white hover:underline">3D Ring</button>
            <span className="text-white/20">•</span>
            <button onClick={() => handleViewSection('portfolio')} className="hover:text-white hover:underline">Portfolio</button>
            <span className="text-white/20">•</span>
            <button onClick={() => handleViewSection('about')} className="hover:text-white hover:underline">About</button>
            <span className="text-white/20">•</span>
            <button onClick={() => handleViewSection('journey')} className="hover:text-white hover:underline">Journey</button>
            <span className="text-white/20">•</span>
            <button onClick={() => handleViewSection('contact')} className="hover:text-white hover:underline">Contact</button>
          </div>
        </div>

        {/* TAB NAVIGATION SCROLLER */}
        <div className="flex border-b border-black/10 bg-[#FBF9F5] px-4 md:px-6 text-xs uppercase font-sans tracking-wider overflow-x-auto scrollbar-thin">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3.5 font-semibold border-b-2 transition-colors whitespace-nowrap text-[11px] ${
                activeTab === tab.id
                  ? 'border-[#8B0000] text-[#8B0000] bg-white/50'
                  : 'border-transparent text-black/60 hover:text-black'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB BODY (SCROLLABLE) */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-xs font-sans bg-white">
          {/* TAB 1: MODEL & BRAND IDENTITY */}
          {activeTab === 'model' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <h3 className="font-anton text-base uppercase text-[#8B0000]">Model Identity & Wordmark</h3>
                <button
                  onClick={() => handleViewSection('hero')}
                  className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                >
                  👁 View Hero Section →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Model Full Name</label>
                  <input
                    type="text"
                    value={formData.hero.fullName}
                    onChange={(e) =>
                      handleFieldChange({
                        'hero.fullName': e.target.value,
                        'navigation.brandName': e.target.value
                      })
                    }
                    className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm font-medium"
                  />
                  <span className="text-[10px] text-black/40 mt-1 block">Displayed in hero title and brand navigation</span>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Monogram Symbol (1-2 letters)</label>
                  <input
                    type="text"
                    maxLength={3}
                    value={formData.navigation.monogram}
                    onChange={(e) => handleFieldChange('navigation.monogram', e.target.value)}
                    className="w-28 border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-base font-anton uppercase"
                  />
                  <span className="text-[10px] text-black/40 mt-1 block">Displayed in top-left monogram box</span>
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Professional Subtitle / Title</label>
                <input
                  type="text"
                  value={formData.hero.subtitle}
                  onChange={(e) =>
                    handleFieldChange({
                      'hero.subtitle': e.target.value,
                      'navigation.brandSubtitle': e.target.value
                    })
                  }
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Availability Status Text</label>
                  <input
                    type="text"
                    value={formData.hero.availability.statusText}
                    onChange={(e) => handleFieldChange('hero.availability.statusText', e.target.value)}
                    className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Nav CTA Button Label</label>
                  <input
                    type="text"
                    value={formData.navigation.ctaButton.label}
                    onChange={(e) => handleFieldChange('navigation.ctaButton.label', e.target.value)}
                    className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm"
                  />
                </div>
              </div>

              {/* Quick Link to Model Specifications */}
              <div className="bg-[#FBF9F5] p-4 border border-black/15 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div>
                  <span className="font-anton text-xs text-[#8B0000] block uppercase tracking-wider">
                    ✦ Model Specifications & Physical Measurements
                  </span>
                  <span className="text-[11px] text-black/60 font-sans mt-0.5 block">
                    Height, Hair, Location, Bust, Waist, Hips, and verified runway metrics.
                  </span>
                </div>
                <button
                  onClick={() => setActiveTab('specifications')}
                  className="px-3.5 py-2 bg-[#8B0000] hover:bg-black text-white rounded-sm text-xs font-semibold uppercase tracking-wider transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <span>Edit Specifications</span>
                  <span>➔</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: MODEL SPECIFICATIONS & MEASUREMENTS */}
          {activeTab === 'specifications' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-black/10 gap-2">
                <div>
                  <h3 className="font-anton text-base uppercase text-[#8B0000] tracking-wider">
                    Model Specifications & Physical Measurements
                  </h3>
                  <p className="text-[11px] text-black/60 font-sans mt-0.5">
                    Customize physical metrics, runway statistics, and verified focus specifications shown on the intro hero card and about section.
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <button
                    onClick={() => handleViewSection('hero')}
                    className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold flex items-center gap-1"
                  >
                    <span>👁 View Hero Intro Specs →</span>
                  </button>
                  <span className="text-black/20">•</span>
                  <button
                    onClick={() => handleViewSection('about')}
                    className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold flex items-center gap-1"
                  >
                    <span>👁 View About Table →</span>
                  </button>
                </div>
              </div>

              {/* 1. HERO INTRO CARD SPECIFICATIONS */}
              <div className="bg-[#060814] text-white p-5 rounded-sm border border-white/10 shadow-lg space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#E5C378] shadow-[0_0_8px_#D4AF37]" />
                      <h4 className="font-anton text-sm tracking-wider uppercase text-[#F3E5AB]">
                        Intro Page Specifications Card (Hero Section)
                      </h4>
                    </div>
                    <p className="text-[10px] text-white/60 font-sans mt-1">
                      Displayed prominently in frosted gold cards directly on the front magazine cover.
                    </p>
                  </div>
                  <button
                    onClick={handleAddHeroSpecification}
                    className="px-3 py-1.5 bg-[#D4AF37]/20 hover:bg-[#D4AF37] text-[#F3E5AB] hover:text-black border border-[#D4AF37]/50 rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer"
                  >
                    <span>+ Add Hero Specification</span>
                  </button>
                </div>

                {/* Hero specifications list */}
                <div className="space-y-3">
                  {formData.hero.specifications && formData.hero.specifications.length > 0 ? (
                    formData.hero.specifications.map((spec, sIdx) => (
                      <div
                        key={sIdx}
                        className="bg-white/5 border border-white/10 p-3 rounded-sm flex flex-col sm:flex-row items-stretch sm:items-center gap-3 group hover:border-[#D4AF37]/40 transition-colors"
                      >
                        <div className="w-full sm:w-1/3">
                          <label className="block text-[10px] uppercase font-semibold text-[#E5C378] mb-1">
                            Specification Label #{sIdx + 1}
                          </label>
                          <input
                            type="text"
                            value={spec.label}
                            placeholder="e.g. Height, Hair, Location"
                            onChange={(e) =>
                              handleFieldChange(`hero.specifications.${sIdx}.label`, e.target.value)
                            }
                            className="w-full bg-black/40 border border-white/20 p-2 rounded-sm text-white text-xs font-medium focus:border-[#D4AF37] outline-none"
                          />
                        </div>

                        <div className="flex-1">
                          <label className="block text-[10px] uppercase font-semibold text-white/70 mb-1">
                            Specification Value
                          </label>
                          <input
                            type="text"
                            value={spec.value}
                            placeholder="e.g. 5'9 / 175 cm, Dark Hazel"
                            onChange={(e) =>
                              handleFieldChange(`hero.specifications.${sIdx}.value`, e.target.value)
                            }
                            className="w-full bg-black/40 border border-white/20 p-2 rounded-sm text-white text-xs font-medium focus:border-[#D4AF37] outline-none"
                          />
                        </div>

                        <div className="sm:self-end pb-0.5">
                          <button
                            onClick={() => handleDeleteHeroSpecification(sIdx)}
                            className="w-full sm:w-auto px-3 py-2 bg-red-950/60 hover:bg-red-700 text-red-200 hover:text-white border border-red-800/50 rounded-sm text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                            title="Remove this specification"
                          >
                            <span>✕</span>
                            <span className="sm:hidden">Remove</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 border border-dashed border-white/20 rounded-sm text-white/40 text-xs">
                      No hero specifications configured. Click "+ Add Hero Specification" above to add one.
                    </div>
                  )}
                </div>

                {/* Live Preview Chips */}
                {formData.hero.specifications && formData.hero.specifications.length > 0 && (
                  <div className="pt-2 border-t border-white/10">
                    <span className="text-[10px] font-sans tracking-widest uppercase text-white/40 block mb-2">
                      Live Hero Card Preview:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {formData.hero.specifications.map((s, idx) => (
                        <div
                          key={idx}
                          className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-[11px] font-sans uppercase tracking-wider"
                        >
                          <span className="text-[#E5C378] font-semibold mr-1">{s.label}:</span>
                          <span>{s.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* 2. ABOUT SECTION DETAILED MEASUREMENTS TABLE */}
              <div className="bg-[#FBF9F5] p-5 rounded-sm border border-black/10 shadow-sm space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/10 pb-3">
                  <div>
                    <h4 className="font-anton text-sm tracking-wider uppercase text-[#8B0000]">
                      Editorial Agency Measurements Table (About Section)
                    </h4>
                    <p className="text-[10px] text-black/60 font-sans mt-0.5">
                      Detailed runway and fashion measurements shown on the dedicated About page.
                    </p>
                  </div>
                  <button
                    onClick={handleAddMeasurement}
                    className="px-3 py-1.5 bg-[#8B0000] hover:bg-black text-white rounded-sm text-xs font-semibold tracking-wider uppercase transition-colors flex items-center gap-1 self-start sm:self-auto cursor-pointer shadow-sm"
                  >
                    <span>+ Add Measurement</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-black/70 mb-1">
                      Table Heading Title
                    </label>
                    <input
                      type="text"
                      value={formData.about.measurementsTitle}
                      onChange={(e) => handleFieldChange('about.measurementsTitle', e.target.value)}
                      className="w-full bg-white border border-black/20 p-2 rounded-sm text-xs font-anton tracking-wide focus:border-[#8B0000] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-black/70 mb-1">
                      Table Subtitle / Verification Tag
                    </label>
                    <input
                      type="text"
                      value={formData.about.measurementsSub}
                      onChange={(e) => handleFieldChange('about.measurementsSub', e.target.value)}
                      className="w-full bg-white border border-black/20 p-2 rounded-sm text-xs font-sans focus:border-[#8B0000] outline-none"
                    />
                  </div>
                </div>

                {/* Measurements Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {formData.about.measurements &&
                    formData.about.measurements.map((m, mIdx) => (
                      <div
                        key={mIdx}
                        className="bg-white border border-black/10 p-3 rounded-sm flex items-center gap-2 group hover:border-[#8B0000]/40 shadow-xs"
                      >
                        <div className="flex-1 space-y-1">
                          <input
                            type="text"
                            value={m.label}
                            placeholder="Metric (e.g. Bust)"
                            onChange={(e) =>
                              handleFieldChange(`about.measurements.${mIdx}.label`, e.target.value)
                            }
                            className="w-full text-[10px] font-semibold uppercase text-black/60 border-b border-transparent focus:border-black/30 outline-none pb-0.5"
                          />
                          <input
                            type="text"
                            value={m.value}
                            placeholder="Value (e.g. 34B)"
                            onChange={(e) =>
                              handleFieldChange(`about.measurements.${mIdx}.value`, e.target.value)
                            }
                            className="w-full text-xs font-medium text-black border-b border-transparent focus:border-[#8B0000] outline-none pb-0.5"
                          />
                        </div>
                        <button
                          onClick={() => handleDeleteMeasurement(mIdx)}
                          className="opacity-40 group-hover:opacity-100 hover:text-red-600 p-1 text-xs transition-opacity cursor-pointer"
                          title="Delete metric"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HERO & VIDEO / MEDIA */}
          {activeTab === 'hero' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <h3 className="font-anton text-base uppercase text-[#8B0000]">Hero Model Identity, Reel Video & Photograph</h3>
                <button
                  onClick={() => handleViewSection('hero')}
                  className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                >
                  👁 View Hero Section →
                </button>
              </div>

              {/* Direct Model Name and Subtitle on the Hero Page tab */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FBF9F5] p-4 rounded-sm border border-black/10">
                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Model Full Name</label>
                  <input
                    type="text"
                    value={formData.hero.fullName}
                    onChange={(e) =>
                      handleFieldChange({
                        'hero.fullName': e.target.value,
                        'navigation.brandName': e.target.value
                      })
                    }
                    className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm font-medium bg-white"
                  />
                  <span className="text-[10px] text-black/40 mt-1 block">Hero oversized headline & brand wordmark</span>
                </div>

                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Professional Subtitle / Designation</label>
                  <input
                    type="text"
                    value={formData.hero.subtitle}
                    onChange={(e) =>
                      handleFieldChange({
                        'hero.subtitle': e.target.value,
                        'navigation.brandSubtitle': e.target.value
                      })
                    }
                    className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm bg-white"
                  />
                  <span className="text-[10px] text-black/40 mt-1 block">Hero top designation strip & nav subtitle</span>
                </div>
              </div>

              <div className="bg-[#FBF9F5] p-4 border border-black/10 rounded-sm">
                <label className="block font-semibold uppercase text-black/80 mb-1">
                  Hero Video Path or URL (MP4 / WebM)
                </label>
                <input
                  type="text"
                  value={formData.hero.primaryMedia.video.src}
                  onChange={(e) => handleFieldChange('hero.primaryMedia.video.src', e.target.value)}
                  placeholder="/media/videos/portfolio-women.mp4 or https://..."
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-xs font-mono bg-white"
                />
                <span className="text-[10px] text-black/50 mt-1 block">
                  You can specify a local path like <code className="bg-black/5 px-1">/media/videos/portfolio-women.mp4</code> or any online MP4 URL.
                </span>
              </div>

              <div className="bg-[#FBF9F5] p-4 border border-black/10 rounded-sm">
                <label className="block font-semibold uppercase text-black/80 mb-1">
                  Hero Photograph / Video Poster Image Path or URL
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <div className="flex-1 w-full">
                    <input
                      type="text"
                      value={formData.hero.primaryMedia.image.src}
                      onChange={(e) =>
                        handleFieldChange({
                          'hero.primaryMedia.image.src': e.target.value,
                          'hero.primaryMedia.video.poster': e.target.value
                        })
                      }
                      placeholder="/media/photos/hero/hero-bridal-portrait.jpg or https://..."
                      className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-xs font-mono bg-white"
                    />
                    <span className="text-[10px] text-black/50 mt-1 block">
                      Used as the primary editorial portrait and fallback poster if video is loading.
                    </span>
                  </div>

                  {formData.hero.primaryMedia.image.src && (
                    <div className="w-24 h-32 flex-shrink-0 bg-black/10 rounded-sm overflow-hidden border border-black/20 shadow-sm">
                      <img
                        src={formData.hero.primaryMedia.image.src}
                        alt="Hero preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Hero Badge Label</label>
                <input
                  type="text"
                  value={formData.hero.primaryMedia.badgeLabel}
                  onChange={(e) => handleFieldChange('hero.primaryMedia.badgeLabel', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">3-Line Hero Tagline</label>
                {formData.hero.tagline.map((line, lIdx) => (
                  <div key={lIdx} className="mb-2">
                    <span className="text-[10px] uppercase text-black/50 block mb-0.5">Line {lIdx + 1}</span>
                    <input
                      type="text"
                      value={line}
                      onChange={(e) => {
                        const updated = [...formData.hero.tagline];
                        updated[lIdx] = e.target.value;
                        handleFieldChange('hero.tagline', updated);
                      }}
                      className="w-full border border-black/20 p-2 rounded-sm focus:border-[#8B0000] outline-none text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: 3D LOOK RING */}
          {activeTab === 'lookRing' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <h3 className="font-anton text-base uppercase text-[#8B0000]">3D Cylindrical Look Ring</h3>
                <button
                  onClick={() => handleViewSection('3d-ring')}
                  className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                >
                  👁 View 3D Ring Section →
                </button>
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Section Badge</label>
                <input
                  type="text"
                  value={formData.lookRing.badge}
                  onChange={(e) => handleFieldChange('lookRing.badge', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={formData.lookRing.heading}
                  onChange={(e) => handleFieldChange('lookRing.heading', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.lookRing.description}
                  onChange={(e) => handleFieldChange('lookRing.description', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Interactive Instruction Prompt</label>
                <input
                  type="text"
                  value={formData.lookRing.dragInstruction}
                  onChange={(e) => handleFieldChange('lookRing.dragInstruction', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PORTFOLIO LOOKS (FULL CRUD) */}
          {activeTab === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-2 border-b border-black/10">
                <div>
                  <h3 className="font-anton text-base uppercase text-[#8B0000]">Portfolio Looks & Photographs</h3>
                  <p className="text-black/60 text-xs">Manage, edit, or add photographs and bridal lookbook items.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddPortfolioItem}
                    className="px-3.5 py-1.5 bg-[#8B0000] hover:bg-[#700000] text-white text-xs font-semibold uppercase tracking-wider rounded-sm shadow-sm transition-colors flex items-center gap-1"
                  >
                    <span>+</span>
                    <span>Add New Look</span>
                  </button>

                  <button
                    onClick={() => handleViewSection('portfolio')}
                    className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold px-2 py-1"
                  >
                    👁 View Gallery →
                  </button>
                </div>
              </div>

              {/* Portfolio Section Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#FBF9F5] p-4 rounded-sm border border-black/10">
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Gallery Heading</label>
                  <input
                    type="text"
                    value={formData.portfolio.heading}
                    onChange={(e) => handleFieldChange('portfolio.heading', e.target.value)}
                    className="w-full border border-black/20 p-2 rounded-sm text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Gallery Description</label>
                  <input
                    type="text"
                    value={formData.portfolio.description}
                    onChange={(e) => handleFieldChange('portfolio.description', e.target.value)}
                    className="w-full border border-black/20 p-2 rounded-sm text-xs bg-white"
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-4">
                {formData.portfolioItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`p-4 border rounded-sm transition-all duration-200 ${
                      item.isHidden ? 'bg-black/[0.03] border-dashed border-black/20 opacity-70' : 'bg-white border-black/15 shadow-sm'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-center gap-2 pb-3 mb-3 border-b border-black/10">
                      <div className="flex items-center gap-2">
                        <span className="font-anton text-sm uppercase text-[#8B0000]">
                          Look #{idx + 1}: {item.title}
                        </span>
                        {item.isHidden && (
                          <span className="text-[9px] bg-red-100 text-red-700 px-2 py-0.5 rounded-full uppercase font-semibold">
                            Hidden
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleTogglePortfolioHide(idx)}
                          className={`px-2.5 py-1 text-[10px] uppercase font-semibold rounded-sm transition-colors ${
                            item.isHidden ? 'bg-gray-700 text-white' : 'bg-emerald-600 text-white'
                          }`}
                        >
                          {item.isHidden ? 'Hidden (Click to Show)' : 'Visible (Click to Hide)'}
                        </button>

                        <button
                          onClick={() => handleDeletePortfolioItem(idx)}
                          className="px-2.5 py-1 text-[10px] uppercase font-semibold text-red-600 hover:bg-red-50 rounded-sm border border-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                      {/* Thumbnail Preview */}
                      <div className="md:col-span-3">
                        <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Preview</label>
                        <div className="aspect-[3/4] w-full bg-black/5 rounded-sm overflow-hidden border border-black/15 flex items-center justify-center">
                          <img
                            src={item.primaryImage}
                            alt={item.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src =
                                'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect fill="%23f3efeb" width="300" height="400"/><text fill="%238b0000" font-family="sans-serif" font-size="12" x="50%" y="50%" text-anchor="middle">Image Not Found</text></svg>';
                            }}
                          />
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="md:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-black/60 mb-0.5">Title</label>
                          <input
                            type="text"
                            value={item.title}
                            onChange={(e) => handleFieldChange(`portfolioItems.${idx}.title`, e.target.value)}
                            className="w-full border border-black/20 p-2 rounded-sm text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-black/60 mb-0.5">Category</label>
                          <input
                            type="text"
                            value={item.category}
                            onChange={(e) => handleFieldChange(`portfolioItems.${idx}.category`, e.target.value)}
                            className="w-full border border-black/20 p-2 rounded-sm text-xs bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-semibold text-black/60 mb-0.5">
                            Primary Image Path or URL
                          </label>
                          <input
                            type="text"
                            value={item.primaryImage}
                            onChange={(e) => handleFieldChange(`portfolioItems.${idx}.primaryImage`, e.target.value)}
                            placeholder="/media/photos/bridal/... or https://..."
                            className="w-full border border-black/20 p-2 rounded-sm text-xs font-mono bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-[10px] uppercase font-semibold text-black/60 mb-0.5">
                            Short Description
                          </label>
                          <textarea
                            rows={2}
                            value={item.shortDescription}
                            onChange={(e) => handleFieldChange(`portfolioItems.${idx}.shortDescription`, e.target.value)}
                            className="w-full border border-black/20 p-2 rounded-sm text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-black/60 mb-0.5">
                            Designer / Brand Credit
                          </label>
                          <input
                            type="text"
                            value={item.credits?.designer || ''}
                            onChange={(e) => handleFieldChange(`portfolioItems.${idx}.credits.designer`, e.target.value)}
                            className="w-full border border-black/20 p-2 rounded-sm text-xs bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase font-semibold text-black/60 mb-0.5">
                            Photographer Credit
                          </label>
                          <input
                            type="text"
                            value={item.credits?.photographer || ''}
                            onChange={(e) => handleFieldChange(`portfolioItems.${idx}.credits.photographer`, e.target.value)}
                            className="w-full border border-black/20 p-2 rounded-sm text-xs bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ABOUT & SPECS */}
          {activeTab === 'about' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <h3 className="font-anton text-base uppercase text-[#8B0000]">About Muse, Portrait & Specs</h3>
                <button
                  onClick={() => handleViewSection('about')}
                  className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                >
                  👁 View About Section →
                </button>
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Section Heading</label>
                <input
                  type="text"
                  value={formData.about.heading}
                  onChange={(e) => handleFieldChange('about.heading', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm font-anton"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">About Introduction</label>
                <textarea
                  rows={3}
                  value={formData.about.intro}
                  onChange={(e) => handleFieldChange('about.intro', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Personal Manifesto</label>
                <textarea
                  rows={3}
                  value={formData.about.manifestoText}
                  onChange={(e) => handleFieldChange('about.manifestoText', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">The Craft / Bridal Philosophy</label>
                <textarea
                  rows={3}
                  value={formData.about.craftText}
                  onChange={(e) => handleFieldChange('about.craftText', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-xs"
                />
              </div>

              <div className="bg-[#FBF9F5] p-4 border border-black/10 rounded-sm">
                <label className="block font-semibold uppercase text-black/70 mb-1">Portrait Image Path or URL</label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <input
                    type="text"
                    value={formData.about.portrait.src}
                    onChange={(e) => handleFieldChange('about.portrait.src', e.target.value)}
                    className="flex-1 w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-xs font-mono bg-white"
                  />
                  {formData.about.portrait.src && (
                    <div className="w-20 h-24 flex-shrink-0 bg-black/10 rounded-sm overflow-hidden border border-black/15">
                      <img
                        src={formData.about.portrait.src}
                        alt="About portrait preview"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Measurements */}
              {formData.about.measurements && (
                <div className="bg-white p-4 border border-black/10 rounded-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-anton text-sm uppercase text-[#8B0000]">Physical Specifications & Measurements</h4>
                    <button
                      onClick={() => setActiveTab('specifications')}
                      className="text-[10px] uppercase font-semibold text-[#8B0000] hover:underline cursor-pointer"
                    >
                      Open Full Specifications Editor ➔
                    </button>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {formData.about.measurements.map((m, mIdx) => (
                      <div key={mIdx}>
                        <label className="block text-[10px] uppercase text-black/50">{m.label}</label>
                        <input
                          type="text"
                          value={m.value}
                          onChange={(e) => handleFieldChange(`about.measurements.${mIdx}.value`, e.target.value)}
                          className="w-full border border-black/20 p-1.5 rounded-sm text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: JOURNEY TIMELINE (FULL CRUD) */}
          {activeTab === 'journey' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-black/10">
                <div>
                  <h3 className="font-anton text-base uppercase text-[#8B0000]">Career Journey & Milestones</h3>
                  <p className="text-black/60 text-xs">Add or edit your high-fashion bridal milestones.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddMilestone}
                    className="px-3 py-1.5 bg-[#8B0000] text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
                  >
                    + Add Milestone
                  </button>
                  <button
                    onClick={() => handleViewSection('journey')}
                    className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                  >
                    👁 View Timeline →
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {formData.journey.milestones.map((m, mIdx) => (
                  <div key={m.id} className="p-4 bg-[#FBF9F5] border border-black/10 rounded-sm space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-anton text-sm uppercase text-[#8B0000]">Milestone #{mIdx + 1}</span>
                      <button
                        onClick={() => handleDeleteMilestone(mIdx)}
                        className="text-red-600 hover:text-red-800 text-[11px] uppercase font-semibold"
                      >
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[10px] uppercase text-black/50">Year / Date</label>
                        <input
                          type="text"
                          value={m.dateOrPeriod}
                          onChange={(e) => handleFieldChange(`journey.milestones.${mIdx}.dateOrPeriod`, e.target.value)}
                          className="w-full border border-black/20 p-1.5 rounded-sm text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-black/50">Tag</label>
                        <input
                          type="text"
                          value={m.tag}
                          onChange={(e) => handleFieldChange(`journey.milestones.${mIdx}.tag`, e.target.value)}
                          className="w-full border border-black/20 p-1.5 rounded-sm text-xs bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] uppercase text-black/50">Brand / Publication</label>
                        <input
                          type="text"
                          value={m.brandOrPublication}
                          onChange={(e) => handleFieldChange(`journey.milestones.${mIdx}.brandOrPublication`, e.target.value)}
                          className="w-full border border-black/20 p-1.5 rounded-sm text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase text-black/50">Title</label>
                        <input
                          type="text"
                          value={m.title}
                          onChange={(e) => handleFieldChange(`journey.milestones.${mIdx}.title`, e.target.value)}
                          className="w-full border border-black/20 p-1.5 rounded-sm text-xs bg-white"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="block text-[10px] uppercase text-black/50">Description</label>
                        <textarea
                          rows={2}
                          value={m.description}
                          onChange={(e) => handleFieldChange(`journey.milestones.${mIdx}.description`, e.target.value)}
                          className="w-full border border-black/20 p-1.5 rounded-sm text-xs bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PRESS & TEAR SHEETS (EDITORIAL COVERS & COMP CARD) */}
          {activeTab === 'press' && (
            <div className="space-y-6 max-w-4xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-black/10">
                <div>
                  <h3 className="font-anton text-base uppercase text-[#8B0000]">Editorial Press, Covers & Comp Card</h3>
                  <p className="text-black/60 text-xs">Curate your magazine cover spreads, tear sheets, and high-fashion comp card.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddTearSheet}
                    className="px-3 py-1.5 bg-[#8B0000] text-white text-xs font-semibold uppercase tracking-wider rounded-sm hover:bg-[#6e0000] transition-colors"
                  >
                    + Add Tear Sheet
                  </button>
                  <button
                    onClick={() => handleViewSection('press')}
                    className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                  >
                    👁 View Section →
                  </button>
                </div>
              </div>

              {/* Section Headlines */}
              <div className="p-4 bg-[#FBF9F5] border border-black/10 rounded-sm space-y-3">
                <h4 className="font-anton text-xs uppercase tracking-wider text-[#8B0000]">Section Titles & Meta</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Badge</label>
                    <input
                      type="text"
                      value={formData.press?.badge || ''}
                      onChange={(e) => handleFieldChange('press.badge', e.target.value)}
                      className="w-full border border-black/20 p-2 rounded-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Watermark</label>
                    <input
                      type="text"
                      value={formData.press?.watermarkText || ''}
                      onChange={(e) => handleFieldChange('press.watermarkText', e.target.value)}
                      className="w-full border border-black/20 p-2 rounded-sm bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Heading</label>
                    <input
                      type="text"
                      value={formData.press?.heading || ''}
                      onChange={(e) => handleFieldChange('press.heading', e.target.value)}
                      className="w-full border border-black/20 p-2 rounded-sm bg-white font-medium"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Subtitle</label>
                    <input
                      type="text"
                      value={formData.press?.sub || ''}
                      onChange={(e) => handleFieldChange('press.sub', e.target.value)}
                      className="w-full border border-black/20 p-2 rounded-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Comp Card Configuration */}
              <div className="p-4 bg-[#FBF9F5] border border-black/10 rounded-sm space-y-3">
                <h4 className="font-anton text-xs uppercase tracking-wider text-[#8B0000]">Digital Comp Card Settings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Comp Card Badge</label>
                    <input
                      type="text"
                      value={formData.press?.compCard?.badge || ''}
                      onChange={(e) => handleFieldChange('press.compCard.badge', e.target.value)}
                      className="w-full border border-black/20 p-2 rounded-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Agency Representation</label>
                    <input
                      type="text"
                      value={formData.press?.compCard?.agencyRepresentation || ''}
                      onChange={(e) => handleFieldChange('press.compCard.agencyRepresentation', e.target.value)}
                      className="w-full border border-black/20 p-2 rounded-sm bg-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] uppercase font-semibold text-black/60 mb-1">Stats Summary Headline</label>
                    <input
                      type="text"
                      value={formData.press?.compCard?.statsSummary || ''}
                      onChange={(e) => handleFieldChange('press.compCard.statsSummary', e.target.value)}
                      className="w-full border border-black/20 p-2 rounded-sm bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Tear Sheets Items */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-anton text-xs uppercase tracking-wider text-[#8B0000]">
                    Published Covers & Tear Sheets ({(formData.press?.items || []).length})
                  </h4>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {(formData.press?.items || []).map((sheet, sIdx) => (
                    <div key={sheet.id || sIdx} className="p-4 bg-[#FBF9F5] border border-black/10 rounded-sm space-y-3 text-xs">
                      <div className="flex justify-between items-center border-b border-black/10 pb-2">
                        <span className="font-anton text-xs uppercase text-[#8B0000]">
                          #{sIdx + 1} — {sheet.publication || 'Publication'} ({sheet.issue || 'Issue'})
                        </span>
                        <button
                          onClick={() => handleDeleteTearSheet(sIdx)}
                          className="text-red-600 hover:text-red-800 text-[10px] uppercase font-semibold"
                        >
                          Delete
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[9px] uppercase font-medium text-black/50">Publication Name</label>
                          <input
                            type="text"
                            value={sheet.publication}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.publication`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-medium text-black/50">Issue / Edition</label>
                          <input
                            type="text"
                            value={sheet.issue}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.issue`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-medium text-black/50">Category Filter</label>
                          <input
                            type="text"
                            value={sheet.category}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.category`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2 md:col-span-3">
                          <label className="block text-[9px] uppercase font-medium text-black/50">Feature Title</label>
                          <input
                            type="text"
                            value={sheet.title}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.title`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2 md:col-span-3">
                          <label className="block text-[9px] uppercase font-medium text-black/50">Cover / Spread Image URL</label>
                          <input
                            type="text"
                            value={sheet.coverImage}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.coverImage`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white font-mono text-[11px]"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-medium text-black/50">Couturier / Designer</label>
                          <input
                            type="text"
                            value={sheet.designer}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.designer`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-medium text-black/50">Photographer</label>
                          <input
                            type="text"
                            value={sheet.photographer}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.photographer`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] uppercase font-medium text-black/50">Spread Count / Tag</label>
                          <input
                            type="text"
                            value={sheet.spreadCount || ''}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.spreadCount`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white"
                          />
                        </div>

                        <div className="sm:col-span-2 md:col-span-3">
                          <label className="block text-[9px] uppercase font-medium text-black/50">Editorial Pull Quote</label>
                          <textarea
                            rows={2}
                            value={sheet.quote || ''}
                            onChange={(e) => handleFieldChange(`press.items.${sIdx}.quote`, e.target.value)}
                            className="w-full border border-black/20 p-1.5 rounded-sm bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: SPECIALITIES (ARCHIVE / BACKWARD COMPATIBLE) */}
          {activeTab === 'specialities' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-2 border-b border-black/10">
                <div>
                  <h3 className="font-anton text-base uppercase text-[#8B0000]">Modelling Specialities (Archive)</h3>
                  <p className="text-black/60 text-xs">Manage your technical expertise and movement skills archive.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddSkill}
                    className="px-3 py-1.5 bg-[#8B0000] text-white text-xs font-semibold uppercase tracking-wider rounded-sm"
                  >
                    + Add Skill
                  </button>
                  <button
                    onClick={() => handleViewSection('press')}
                    className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                  >
                    👁 View Press Section →
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(formData.specialities?.skills || []).map((s, sIdx) => (
                  <div key={s.id} className="p-3 bg-[#FBF9F5] border border-black/10 rounded-sm space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-anton text-xs uppercase text-[#8B0000]">Skill #{sIdx + 1}</span>
                      <button
                        onClick={() => handleDeleteSkill(sIdx)}
                        className="text-red-600 hover:text-red-800 text-[10px] uppercase font-semibold"
                      >
                        Delete
                      </button>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase text-black/50">Skill Name</label>
                      <input
                        type="text"
                        value={s.name}
                        onChange={(e) => handleFieldChange(`specialities.skills.${sIdx}.name`, e.target.value)}
                        className="w-full border border-black/20 p-1 rounded-sm text-xs bg-white font-medium"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase text-black/50">Category</label>
                      <input
                        type="text"
                        value={s.category}
                        onChange={(e) => handleFieldChange(`specialities.skills.${sIdx}.category`, e.target.value)}
                        className="w-full border border-black/20 p-1 rounded-sm text-xs bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase text-black/50">Description</label>
                      <textarea
                        rows={2}
                        value={s.tagline}
                        onChange={(e) => handleFieldChange(`specialities.skills.${sIdx}.tagline`, e.target.value)}
                        className="w-full border border-black/20 p-1 rounded-sm text-xs bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CONTACT & SOCIALS */}
          {activeTab === 'contact' && (
            <div className="space-y-5 max-w-3xl">
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <h3 className="font-anton text-base uppercase text-[#8B0000]">Contact & Agency Channels</h3>
                <button
                  onClick={() => handleViewSection('contact')}
                  className="text-[11px] text-[#8B0000] hover:underline uppercase font-semibold"
                >
                  👁 View Contact Section →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Headline Part 1</label>
                  <input
                    type="text"
                    value={formData.contact.headlineMain}
                    onChange={(e) => handleFieldChange('contact.headlineMain', e.target.value)}
                    className="w-full border border-black/20 p-2.5 rounded-sm font-anton text-sm"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Headline Part 2</label>
                  <input
                    type="text"
                    value={formData.contact.headlineAction}
                    onChange={(e) => handleFieldChange('contact.headlineAction', e.target.value)}
                    className="w-full border border-black/20 p-2.5 rounded-sm font-anton text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Direct Booking Email Address</label>
                <input
                  type="email"
                  value={formData.contact.email}
                  onChange={(e) => handleFieldChange('contact.email', e.target.value)}
                  className="w-full border border-black/20 p-2.5 rounded-sm focus:border-[#8B0000] outline-none text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Booking Notice / Response SLA</label>
                <textarea
                  rows={2}
                  value={formData.contact.bookingNotice}
                  onChange={(e) => handleFieldChange('contact.bookingNotice', e.target.value)}
                  className="w-full border border-black/20 p-2 rounded-sm text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Instagram URL</label>
                  <input
                    type="text"
                    value={formData.contact.social.instagram.url}
                    onChange={(e) => handleFieldChange('contact.social.instagram.url', e.target.value)}
                    className="w-full border border-black/20 p-2 rounded-sm text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    value={formData.contact.social.instagram.handle || ''}
                    onChange={(e) => handleFieldChange('contact.social.instagram.handle', e.target.value)}
                    className="w-full border border-black/20 p-2 rounded-sm text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Agency Booking URL</label>
                  <input
                    type="text"
                    value={formData.contact.social.agency?.url || ''}
                    onChange={(e) => handleFieldChange('contact.social.agency.url', e.target.value)}
                    className="w-full border border-black/20 p-2 rounded-sm text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold uppercase text-black/70 mb-1">Agency Name / Division</label>
                  <input
                    type="text"
                    value={formData.contact.social.agency?.sub || ''}
                    onChange={(e) => handleFieldChange('contact.social.agency.sub', e.target.value)}
                    className="w-full border border-black/20 p-2 rounded-sm text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold uppercase text-black/70 mb-1">Footer Copyright Text</label>
                <input
                  type="text"
                  value={formData.contact.footer.copyrightText}
                  onChange={(e) => handleFieldChange('contact.footer.copyrightText', e.target.value)}
                  className="w-full border border-black/20 p-2 rounded-sm text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 9: BACKUP, EXPORT & RESTORE */}
          {activeTab === 'backup' && (
            <div className="space-y-5 max-w-3xl">
              <div className="pb-2 border-b border-black/10">
                <h3 className="font-anton text-base uppercase text-[#8B0000]">Configuration Backup & Restore</h3>
                <p className="text-black/60 text-xs">
                  Copy your website configuration to JSON, paste previously saved settings, or restore defaults.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold uppercase text-black/70">Current Configuration JSON</span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleExportJSON}
                      className="py-1.5 px-3 bg-[#8B0000] text-white text-xs uppercase font-semibold rounded-sm hover:bg-[#700000] transition-colors"
                    >
                      {copySuccess ? '✓ Copied to Clipboard!' : 'Copy JSON'}
                    </button>
                    <button
                      onClick={() => setShowImportBox(!showImportBox)}
                      className="py-1.5 px-3 border border-black/20 text-xs uppercase font-semibold rounded-sm hover:bg-black/5 transition-colors"
                    >
                      {showImportBox ? 'Cancel Import' : 'Import JSON'}
                    </button>
                  </div>
                </div>

                {showImportBox && (
                  <div className="p-4 bg-[#FBF9F5] border border-black/20 rounded-sm space-y-3">
                    <label className="block font-semibold uppercase text-black/80">
                      Paste Configuration JSON Below:
                    </label>
                    <textarea
                      rows={6}
                      value={importJsonText}
                      onChange={(e) => setImportJsonText(e.target.value)}
                      placeholder="Paste your JSON configuration here..."
                      className="w-full border border-black/20 p-2 font-mono text-[11px] bg-white rounded-sm"
                    />
                    <button
                      onClick={handleImportJSON}
                      className="py-2 px-4 bg-emerald-700 text-white font-semibold uppercase text-xs rounded-sm hover:bg-emerald-800"
                    >
                      Apply Imported JSON Now
                    </button>
                  </div>
                )}

                <textarea
                  readOnly
                  rows={9}
                  value={JSON.stringify(formData, null, 2)}
                  className="w-full border border-black/20 p-3 font-mono text-[11px] bg-black/5 rounded-sm"
                />
              </div>

              <div className="pt-4 border-t border-black/10 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold uppercase text-red-700">Restore Factory Defaults</h4>
                  <p className="text-black/60 text-xs">Reset all custom changes and restore the original template.</p>
                </div>
                <button
                  onClick={() => {
                    if (window.confirm('Reset ALL customized content and restore original template defaults?')) {
                      onReset();
                      onClose();
                      document.body.style.overflow = '';
                    }
                  }}
                  className="px-4 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs uppercase tracking-wider font-semibold rounded-sm transition-colors"
                >
                  Reset to Original Defaults
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER BAR: Instant Action Buttons */}
        <div className="bg-[#FAF7F2] p-4 border-t border-black/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-black/60 font-sans">
              Status: Ready • Click Update to apply all changes instantly.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCancelAndRevert}
              className="px-5 py-2 border border-black/20 text-xs uppercase tracking-wider hover:bg-black/5 rounded-full transition-colors text-black/75 hover:text-black font-semibold cursor-pointer"
            >
              Cancel (Restore Original)
            </button>

            {/* Primary Action Button */}
            <button
              onClick={handleManualSave}
              className="px-6 py-2.5 bg-[#6E1426] hover:bg-[#4E0A17] text-white text-xs uppercase font-anton tracking-wider rounded-full shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>⚡</span>
              <span>UPDATE WEBSITE NOW</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};