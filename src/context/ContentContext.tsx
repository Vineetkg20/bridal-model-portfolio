import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { WEBSITE_CONTENT } from '../data';
import { WebsiteContentConfig } from '../types';
import { safeLoadContent, STORAGE_KEY } from '../utils/contentMerge';

export { STORAGE_KEY };

export type ViewMode = 'scroll' | 'pages';

interface ContentContextType {
  content: WebsiteContentConfig;
  updateContent: (newContent: WebsiteContentConfig) => void;
  updateField: (path: string, value: any) => void;
  resetToDefaults: () => void;
  editorOpen: boolean;
  setEditorOpen: (open: boolean) => void;
  editorInitialTab: string;
  openEditor: (tab?: string) => void;
  closeEditor: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  navigateTo: (sectionId: string) => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: ReactNode; initialContent?: WebsiteContentConfig }> = ({
  children,
  initialContent
}) => {
  const [content, setContent] = useState<WebsiteContentConfig>(() =>
    safeLoadContent(initialContent)
  );

  const [editorOpen, setEditorOpen] = useState(false);
  const [editorInitialTab, setEditorInitialTab] = useState('model');
  const [viewMode, setViewMode] = useState<ViewMode>('scroll');

  const [activePage, setActivePage] = useState('all');

  // Keep localStorage updated on save
  const updateContent = (newContent: WebsiteContentConfig) => {
    setContent(newContent);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContent));
    } catch (e) {
      console.warn('Unable to persist to localStorage:', e);
    }
  };

  const updateField = (path: string, value: any) => {
    setContent((prev) => {
      const parts = path.split('.');
      // Reject prototype-polluting paths (__proto__, constructor, prototype)
      for (const part of parts) {
        if (part === '__proto__' || part === 'constructor' || part === 'prototype') {
          console.warn('Rejected attempt to modify reserved object property:', part);
          return prev;
        }
      }

      const cloned = JSON.parse(JSON.stringify(prev));
      let current = cloned;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!current[parts[i]]) current[parts[i]] = {};
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = value;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(cloned));
      } catch (e) {}
      return cloned;
    });
  };

  const resetToDefaults = () => {
    setContent(WEBSITE_CONTENT);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  };

  const openEditor = (tab = 'model') => {
    setEditorInitialTab(tab);
    setEditorOpen(true);
  };

  const closeEditor = () => {
    setEditorOpen(false);
    // Explicitly safety-reset body overflow
    document.body.style.overflow = '';
  };

  const navigateTo = (sectionId: string) => {
    // Ensure overflow is never stuck
    document.body.style.overflow = '';
    setActivePage(sectionId);

    const globalLenis = typeof window !== 'undefined' ? (window as any).lenis : null;

    if (sectionId === 'hero') {
      if (globalLenis) {
        globalLenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      if (globalLenis) {
        globalLenis.scrollTo('#' + sectionId, { offset: -30, duration: 1.2 });
      } else {
        const element = document.getElementById(sectionId);
        if (element && typeof element.scrollIntoView === 'function') {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  return (
    <ContentContext.Provider
      value={{
        content,
        updateContent,
        updateField,
        resetToDefaults,
        editorOpen,
        setEditorOpen,
        editorInitialTab,
        openEditor,
        closeEditor,
        viewMode,
        setViewMode,
        activePage,
        setActivePage,
        navigateTo
      }}
    >
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = (): ContentContextType => {
  const context = useContext(ContentContext);
  if (!context) {
    // Safe fallback if used outside Provider (e.g. in standalone tests)
    return {
      content: WEBSITE_CONTENT,
      updateContent: () => {},
      updateField: () => {},
      resetToDefaults: () => {},
      editorOpen: false,
      setEditorOpen: () => {},
      editorInitialTab: 'model',
      openEditor: () => {},
      closeEditor: () => {},
      viewMode: 'scroll',
      setViewMode: () => {},
      activePage: 'all',
      setActivePage: () => {},
      navigateTo: (id) => {
        const el = document.getElementById(id);
        if (el && typeof el.scrollIntoView === 'function') {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };
  }
  return context;
};
