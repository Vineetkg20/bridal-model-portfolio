import { describe, it, expect } from 'vitest';
import {
  calculateBladeClipPath,
  calculateBladeReverseClipPath,
  calculateExitOpacity,
  easeOutCubic,
  easeOutExpo,
  calculateCylinderParameters
} from './transitions';

describe('Blade Transition Mathematics', () => {
  it('calculates clean polygon clip-path at progress 0.0 (completely hidden)', () => {
    const clipPath = calculateBladeClipPath(0, 6);
    expect(clipPath).toBe('polygon(0% 0%, 0.00% 0%, 0.00% 100%, 0% 100%)');
  });

  it('calculates full polygon clip-path at progress 1.0 (completely revealed with zero gaps)', () => {
    const clipPath = calculateBladeClipPath(1, 6);
    expect(clipPath).toBe('polygon(0% 0%, 100.00% 0%, 100.00% 100%, 0% 100%)');
  });

  it('calculates reversed blade clip path within clamped percentage bounds', () => {
    const clipPathStart = calculateBladeReverseClipPath(0, 6);
    expect(clipPathStart).toBe('polygon(100.00% 0%, 100% 0%, 100% 100%, 100.00% 100%)');

    const clipPathEnd = calculateBladeReverseClipPath(1, 6);
    expect(clipPathEnd).toBe('polygon(0.00% 0%, 100% 0%, 100% 100%, 0.00% 100%)');
  });
});

describe('Exit-Opacity Rule (Section 11)', () => {
  it('preserves full opacity at exitProgress = 0', () => {
    const opacity = calculateExitOpacity(1.0, 0);
    expect(opacity).toBe(1.0);
  });

  it('reduces opacity to 0 at or beyond exitProgress = 1 / 2.4 (~0.417)', () => {
    const opacityMid = calculateExitOpacity(1.0, 0.42);
    expect(opacityMid).toBe(0);

    const opacityFull = calculateExitOpacity(1.0, 1.0);
    expect(opacityFull).toBe(0);
  });

  it('never returns a negative opacity', () => {
    const opacityOver = calculateExitOpacity(1.0, 2.5);
    expect(opacityOver).toBe(0);
  });
});

describe('Easing Curves', () => {
  it('easeOutCubic returns 0 at t=0 and 1 at t=1', () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeCloseTo(0.875, 3);
  });

  it('easeOutExpo returns 1 at t=1', () => {
    expect(easeOutExpo(1)).toBe(1);
    expect(easeOutExpo(0)).toBe(0);
  });
});

describe('3D Cylindrical Ring Geometry (Section 4)', () => {
  it('calculates exact angle step and positive radius for N cards', () => {
    const totalCards = 6;
    const cardWidth = 310;
    const { angleStep, radius, perspective } = calculateCylinderParameters(cardWidth, totalCards);

    expect(angleStep).toBe(60); // 360 / 6
    expect(radius).toBeGreaterThan(cardWidth / 2);
    expect(perspective).toBeGreaterThan(radius);
  });

  it('maintains continuous 360-degree circumference without division errors', () => {
    const counts = [4, 6, 8, 12];
    counts.forEach((count) => {
      const { angleStep, radius } = calculateCylinderParameters(300, count);
      expect(angleStep * count).toBeCloseTo(360);
      expect(radius).toBeGreaterThan(0);
    });
  });
});
