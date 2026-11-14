import { describe, it, expect, beforeEach } from 'vitest';
import {
  deepMergeWithDefaults,
  safeLoadContent,
  sanitizeAgainstPrototypePollution,
  STORAGE_KEY
} from './contentMerge';
import { WEBSITE_CONTENT } from '../data';

describe('contentMerge Security and Resilience Test Suite', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('sanitizeAgainstPrototypePollution', () => {
    it('strips __proto__, constructor, and prototype from objects', () => {
      const maliciousPayload = JSON.parse(
        '{"__proto__":{"polluted":true},"normalField":"safe","constructor":{"hacked":true}}'
      );

      const cleaned = sanitizeAgainstPrototypePollution(maliciousPayload);

      expect(cleaned.normalField).toBe('safe');
      expect(cleaned).not.toHaveProperty('__proto__');
      expect(cleaned).not.toHaveProperty('constructor');
      expect((Object.prototype as any).polluted).toBeUndefined();
    });

    it('recursively cleans nested objects and arrays', () => {
      const payload = {
        outer: {
          items: [
            { valid: 1 },
            JSON.parse('{"__proto__":{"nested":true},"name":"item"}')
          ]
        }
      };

      const cleaned = sanitizeAgainstPrototypePollution(payload);
      expect(cleaned.outer.items[0].valid).toBe(1);
      expect(cleaned.outer.items[1].name).toBe('item');
      expect(cleaned.outer.items[1]).not.toHaveProperty('__proto__');
      expect((Object.prototype as any).nested).toBeUndefined();
    });

    it('gracefully handles primitives, null, and undefined', () => {
      expect(sanitizeAgainstPrototypePollution(null)).toBeNull();
      expect(sanitizeAgainstPrototypePollution(undefined)).toBeUndefined();
      expect(sanitizeAgainstPrototypePollution('string')).toBe('string');
      expect(sanitizeAgainstPrototypePollution(12345)).toBe(12345);
    });
  });

  describe('deepMergeWithDefaults', () => {
    it('returns default config when saved input is null, undefined, or primitive', () => {
      expect(deepMergeWithDefaults(WEBSITE_CONTENT, null)).toEqual(WEBSITE_CONTENT);
      expect(deepMergeWithDefaults(WEBSITE_CONTENT, undefined)).toEqual(WEBSITE_CONTENT);
      expect(deepMergeWithDefaults(WEBSITE_CONTENT, 'invalid string')).toEqual(WEBSITE_CONTENT);
      expect(deepMergeWithDefaults(WEBSITE_CONTENT, [1, 2, 3])).toEqual(WEBSITE_CONTENT);
    });

    it('safely merges valid updates while preserving nested arrays against null/malformed values', () => {
      const corruptedSaved = {
        hero: {
          fullName: 'NEW NAME',
          tagline: 'NOT_AN_ARRAY', // Corrupted type
          specifications: null // Corrupted null
        },
        about: {
          statistics: null,
          measurements: 'BAD_TYPE'
        }
      };

      const result = deepMergeWithDefaults(WEBSITE_CONTENT, corruptedSaved);

      // Successfully updated valid field
      expect(result.hero.fullName).toBe('NEW NAME');

      // Restored default arrays when invalid types were provided
      expect(Array.isArray(result.hero.tagline)).toBe(true);
      expect(result.hero.tagline).toEqual(WEBSITE_CONTENT.hero.tagline);
      expect(Array.isArray(result.hero.specifications)).toBe(true);
      expect(result.hero.specifications).toEqual(WEBSITE_CONTENT.hero.specifications);

      expect(Array.isArray(result.about.statistics)).toBe(true);
      expect(result.about.statistics).toEqual(WEBSITE_CONTENT.about.statistics);
      expect(Array.isArray(result.about.measurements)).toBe(true);
      expect(result.about.measurements).toEqual(WEBSITE_CONTENT.about.measurements);
    });

    it('strips prototype pollution payloads without polluting Object.prototype', () => {
      const hostileInput = JSON.parse(
        '{"__proto__":{"isAdmin":true},"hero":{"fullName":"HACKED NAME"}}'
      );

      const result = deepMergeWithDefaults(WEBSITE_CONTENT, hostileInput);

      expect(result.hero.fullName).toBe('HACKED NAME');
      expect((Object.prototype as any).isAdmin).toBeUndefined();
    });
  });

  describe('safeLoadContent', () => {
    it('returns defaults when localStorage is empty', () => {
      expect(safeLoadContent()).toEqual(WEBSITE_CONTENT);
    });

    it('loads and merges valid localStorage content', () => {
      const custom = { hero: { fullName: 'SAVED NAME' } };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(custom));

      const loaded = safeLoadContent();
      expect(loaded.hero.fullName).toBe('SAVED NAME');
      expect(loaded.hero.tagline).toEqual(WEBSITE_CONTENT.hero.tagline);
    });

    it('safely recovers and clears corrupted non-JSON localStorage', () => {
      localStorage.setItem(STORAGE_KEY, 'MALFORMED_JSON_STRING{{{');

      const loaded = safeLoadContent();
      expect(loaded).toEqual(WEBSITE_CONTENT);
      expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });

    it('safely recovers and clears non-object JSON values like numbers or arrays', () => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));

      const loaded = safeLoadContent();
      expect(loaded).toEqual(WEBSITE_CONTENT);
    });
  });
});
