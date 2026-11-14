import { WebsiteContentConfig } from '../types';
import { WEBSITE_CONTENT } from '../data';

export const STORAGE_KEY = 'bridal_portfolio_custom_content_v2';

/**
 * Recursively strips prototype-polluting keys (__proto__, constructor, prototype)
 * to ensure that untrusted user input cannot modify object prototypes.
 */
export function sanitizeAgainstPrototypePollution(input: any): any {
  if (!input || typeof input !== 'object') return input;
  if (Array.isArray(input)) {
    return input.map(sanitizeAgainstPrototypePollution);
  }
  const sanitized: Record<string, any> = {};
  for (const key of Object.keys(input)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
      continue;
    }
    sanitized[key] = sanitizeAgainstPrototypePollution(input[key]);
  }
  return sanitized;
}

/**
 * Deep merge saved custom content with default WEBSITE_CONTENT.
 * Guarantees that any missing, incomplete, corrupted, or malicious keys fallback to valid defaults,
 * permanently preventing undefined rendering exceptions and prototype pollution.
 */
export function deepMergeWithDefaults(
  defaults: WebsiteContentConfig,
  saved: any
): WebsiteContentConfig {
  if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return defaults;

  const cleanSaved = sanitizeAgainstPrototypePollution(saved);

  const safeObj = (val: any) => (val && typeof val === 'object' && !Array.isArray(val) ? val : {});

  const nav = safeObj(cleanSaved.navigation);
  const hero = safeObj(cleanSaved.hero);
  const lookRing = safeObj(cleanSaved.lookRing);
  const portfolio = safeObj(cleanSaved.portfolio);
  const about = safeObj(cleanSaved.about);
  const journey = safeObj(cleanSaved.journey);
  const press = safeObj(cleanSaved.press);
  const contact = safeObj(cleanSaved.contact);

  return {
    ...defaults,
    ...cleanSaved,
    navigation: {
      ...defaults.navigation,
      ...nav,
      links: Array.isArray(nav.links) ? nav.links : defaults.navigation.links,
      ctaButton: { ...defaults.navigation.ctaButton, ...safeObj(nav.ctaButton) }
    },
    hero: {
      ...defaults.hero,
      ...hero,
      tagline: Array.isArray(hero.tagline) ? hero.tagline : defaults.hero.tagline,
      specifications: Array.isArray(hero.specifications)
        ? hero.specifications
        : defaults.hero.specifications,
      availability: { ...defaults.hero.availability, ...safeObj(hero.availability) },
      primaryMedia: {
        ...defaults.hero.primaryMedia,
        ...safeObj(hero.primaryMedia),
        image: { ...defaults.hero.primaryMedia?.image, ...safeObj(hero.primaryMedia?.image) },
        video: { ...defaults.hero.primaryMedia?.video, ...safeObj(hero.primaryMedia?.video) }
      },
      buttons: { ...defaults.hero.buttons, ...safeObj(hero.buttons) },
      footerLeft: { ...defaults.hero.footerLeft, ...safeObj(hero.footerLeft) }
    },
    lookRing: { ...defaults.lookRing, ...lookRing },
    portfolio: { ...defaults.portfolio, ...portfolio },
    portfolioItems:
      Array.isArray(cleanSaved.portfolioItems) && cleanSaved.portfolioItems.length > 0
        ? cleanSaved.portfolioItems
        : defaults.portfolioItems,
    about: {
      ...defaults.about,
      ...about,
      portrait: { ...defaults.about.portrait, ...safeObj(about.portrait) },
      statistics: Array.isArray(about.statistics) ? about.statistics : defaults.about.statistics,
      measurements: Array.isArray(about.measurements)
        ? about.measurements
        : defaults.about.measurements
    },
    journey: {
      ...defaults.journey,
      ...journey,
      milestones: Array.isArray(journey.milestones) ? journey.milestones : defaults.journey.milestones
    },
    press: {
      ...defaults.press,
      ...press,
      items: Array.isArray(press.items) ? press.items : defaults.press.items
    },
    contact: {
      ...defaults.contact,
      ...contact,
      social: { ...defaults.contact.social, ...safeObj(contact.social) },
      footer: { ...defaults.contact.footer, ...safeObj(contact.footer) }
    }
  };
}

export function safeLoadContent(initialContent?: WebsiteContentConfig): WebsiteContentConfig {
  if (initialContent) return initialContent;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return WEBSITE_CONTENT;
    const parsed = JSON.parse(saved);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return WEBSITE_CONTENT;
    }
    return deepMergeWithDefaults(WEBSITE_CONTENT, parsed);
  } catch (e) {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem('bridal_portfolio_custom_content_v1');
    } catch (_) {}
    return WEBSITE_CONTENT;
  }
}
