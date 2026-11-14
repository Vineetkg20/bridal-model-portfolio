import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock IntersectionObserver for Vitest / jsdom
class MockIntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = '';
  readonly thresholds: ReadonlyArray<number> = [];
  private callback?: IntersectionObserverCallback;

  constructor(callback?: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = vi.fn((target?: Element) => {
    if (this.callback && target) {
      this.callback(
        [
          {
            isIntersecting: true,
            target,
            intersectionRatio: 1,
            boundingClientRect: target.getBoundingClientRect?.() || ({} as any),
            intersectionRect: target.getBoundingClientRect?.() || ({} as any),
            rootBounds: null,
            time: Date.now()
          } as any
        ],
        this as any
      );
    }
  });
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = vi.fn(() => []);
}

window.IntersectionObserver = MockIntersectionObserver as any;

// Mock window.scrollTo and Element.prototype.scrollIntoView
window.scrollTo = vi.fn() as any;
window.Element.prototype.scrollIntoView = vi.fn();

// Mock ResizeObserver for Vitest / jsdom (required by smooth scroll & layout engines)
class MockResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

window.ResizeObserver = window.ResizeObserver || (MockResizeObserver as any);

// Mock window.matchMedia for Vitest / jsdom (required by prefers-reduced-motion queries in Lenis)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});


