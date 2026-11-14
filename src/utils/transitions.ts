/**
 * Shared transition mathematics, polygon geometry, and animation easing functions
 * for cinematic section changes and 3D cylindrical card ring.
 */

export interface BladeGeometry {
  clipPath: string;
  skewAngle: number;
}

/**
 * Calculates consistent mathematical polygon geometry for the cinematic blade transition.
 * Ensures clean transition sweep without leaving gaps, transparent seams, or clipped corners.
 * 
 * @param progress 0.0 to 1.0 representing transition progression
 * @param skewDeg Angle of the cutting edge in degrees
 */
export function calculateBladeClipPath(
  progress: number,
  skewDeg: number = 6
): string {
  const p = Math.max(0, Math.min(1, progress));
  const skewOffset = Math.tan((skewDeg * Math.PI) / 180) * 100;
  
  // Scale progress over (100 + skewOffset) so both leading and trailing edges
  // completely clear the viewport from 0% to 100%
  const effectiveProgress = p * (100 + skewOffset);
  const topX = effectiveProgress;
  const bottomX = effectiveProgress - skewOffset;

  const clampedTop = Math.max(0, Math.min(100, topX));
  const clampedBottom = Math.max(0, Math.min(100, bottomX));

  return `polygon(0% 0%, ${clampedTop.toFixed(2)}% 0%, ${clampedBottom.toFixed(2)}% 100%, 0% 100%)`;
}

/**
 * Calculates inverted blade transition for exiting or entering layers.
 */
export function calculateBladeReverseClipPath(
  progress: number,
  skewDeg: number = 6
): string {
  const p = Math.max(0, Math.min(1, progress));
  const skewOffset = Math.tan((skewDeg * Math.PI) / 180) * 100;

  const effectiveProgress = (1 - p) * (100 + skewOffset);
  const topX = effectiveProgress - skewOffset;
  const bottomX = effectiveProgress;

  const clampedTop = Math.max(0, Math.min(100, topX));
  const clampedBottom = Math.max(0, Math.min(100, bottomX));

  return `polygon(${clampedTop.toFixed(2)}% 0%, 100% 0%, 100% 100%, ${clampedBottom.toFixed(2)}% 100%)`;
}

/**
 * Section 11 Exit-Opacity Rule:
 * opacity * Math.max(0, 1 - exitProgress * 2.4)
 */
export function calculateExitOpacity(baseOpacity: number, exitProgress: number): number {
  return baseOpacity * Math.max(0, 1 - exitProgress * 2.4);
}

/**
 * Standard cubic ease-out curve for smooth, luxury reveals.
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Exponential easing curve for opening hero reveals.
 */
export function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

/**
 * Calculates 3D Cylindrical Ring parameters:
 * Ensures all cards are spaced precisely around the circumference with no gaps or overlap.
 * 
 * @param cardWidth Width of an individual card in pixels
 * @param totalCards Total number of cards in the ring
 */
export function calculateCylinderParameters(cardWidth: number, totalCards: number) {
  const count = Math.max(1, totalCards);
  const angleStep = 360 / count;
  // Radius calculation from regular polygon geometry: r = (w / 2) / tan(pi / n)
  const radius = Math.round((cardWidth / 2) / Math.tan(Math.PI / count) * 1.08);

  return {
    angleStep,
    radius,
    perspective: Math.max(1200, radius * 2.6)
  };
}
