import { describe, it, expect } from 'vitest';
import { WEBSITE_CONTENT, MODEL_PROFILE } from './data';

describe('Centralized Content Data Integrity', () => {
  it('contains valid Model identity and headline typography', () => {
    expect(WEBSITE_CONTENT.hero.fullName).toBeTruthy();
    expect(WEBSITE_CONTENT.hero.fullName).toBe('MEHAK SHARMA');
    expect(WEBSITE_CONTENT.navigation.monogram).toBe('MS');
  });

  it('contains exactly 3 lines in the editorial tagline as required by Section 3', () => {
    expect(WEBSITE_CONTENT.hero.tagline).toHaveLength(3);
    WEBSITE_CONTENT.hero.tagline.forEach((line) => {
      expect(typeof line).toBe('string');
      expect(line.length).toBeGreaterThan(10);
    });
  });

  it('contains at least 3 active portfolio items with required fields', () => {
    const activeItems = WEBSITE_CONTENT.portfolioItems.filter((item) => !item.isHidden);
    expect(activeItems.length).toBeGreaterThanOrEqual(3);

    activeItems.forEach((item) => {
      expect(item.id).toBeTruthy();
      expect(item.title).toBeTruthy();
      expect(item.category).toBeTruthy();
      expect(item.primaryImage).toBeTruthy();
      expect(item.shortDescription).toBeTruthy();
      expect(Array.isArray(item.tags)).toBe(true);
    });
  });

  it('contains a valid contact email address without spaces', () => {
    expect(WEBSITE_CONTENT.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('maintains backwards compatibility exports for existing components', () => {
    expect(MODEL_PROFILE.fullName).toBe(WEBSITE_CONTENT.hero.fullName);
    expect(MODEL_PROFILE.monogram).toBe(WEBSITE_CONTENT.navigation.monogram);
  });
});
