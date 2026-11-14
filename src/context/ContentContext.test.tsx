import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ContentProvider, useContent, STORAGE_KEY } from './ContentContext';
import { WEBSITE_CONTENT } from '../data';

describe('ContentContext & Provider', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = '';
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <ContentProvider>{children}</ContentProvider>
  );

  it('provides default WEBSITE_CONTENT initially when localStorage is empty', () => {
    const { result } = renderHook(() => useContent(), { wrapper });
    expect(result.current.content.hero.fullName).toBe(WEBSITE_CONTENT.hero.fullName);
    expect(result.current.viewMode).toBe('scroll');
  });

  it('updates content in real-time when updateContent is called', () => {
    const { result } = renderHook(() => useContent(), { wrapper });

    act(() => {
      const modified = JSON.parse(JSON.stringify(result.current.content));
      modified.hero.fullName = 'Custom Bridal Model Name';
      result.current.updateContent(modified);
    });

    expect(result.current.content.hero.fullName).toBe('Custom Bridal Model Name');

    // Also checks localStorage persistence
    const saved = localStorage.getItem(STORAGE_KEY);
    expect(saved).not.toBeNull();
    expect(JSON.parse(saved!).hero.fullName).toBe('Custom Bridal Model Name');
  });

  it('updates specific deep fields via updateField', () => {
    const { result } = renderHook(() => useContent(), { wrapper });

    act(() => {
      result.current.updateField('hero.primaryMedia.video.src', '/custom-video.mp4');
    });

    expect(result.current.content.hero.primaryMedia.video.src).toBe('/custom-video.mp4');
  });

  it('resets content back to default template when resetToDefaults is called', () => {
    const { result } = renderHook(() => useContent(), { wrapper });

    act(() => {
      result.current.updateField('hero.fullName', 'Temporary Name');
    });
    expect(result.current.content.hero.fullName).toBe('Temporary Name');

    act(() => {
      result.current.resetToDefaults();
    });
    expect(result.current.content.hero.fullName).toBe(WEBSITE_CONTENT.hero.fullName);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('switches viewMode cleanly between scroll and pages and unlocks overflow', () => {
    const { result } = renderHook(() => useContent(), { wrapper });

    expect(result.current.viewMode).toBe('scroll');

    act(() => {
      result.current.setViewMode('pages');
    });
    expect(result.current.viewMode).toBe('pages');

    act(() => {
      result.current.navigateTo('portfolio');
    });
    expect(result.current.activePage).toBe('portfolio');
    expect(document.body.style.overflow).toBe('');
  });

  it('safely recovers and deep-merges defaults when localStorage contains partial or corrupted data', () => {
    // Put incomplete partial object into localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ hero: { fullName: 'Custom Muse' } }));

    const { result } = renderHook(() => useContent(), { wrapper });

    expect(result.current.content.hero.fullName).toBe('Custom Muse');
    // Ensure essential arrays and child configs are not undefined
    expect(Array.isArray(result.current.content.hero.specifications)).toBe(true);
    expect(Array.isArray(result.current.content.portfolioItems)).toBe(true);
    expect(result.current.content.portfolioItems.length).toBeGreaterThan(0);
  });
});