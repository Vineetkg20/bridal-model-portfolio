import React, { useEffect, useState, useRef } from 'react';

export interface SpringOptions {
  bounce?: number;
  duration?: number; // duration in milliseconds (default 2000ms)
  stiffness?: number;
  damping?: number;
  mass?: number;
}

export interface AnimatedNumberProps {
  value: number;
  className?: string;
  springOptions?: SpringOptions;
  as?: React.ElementType;
  format?: (value: number) => string;
}

/**
 * AnimatedNumber
 * Smooth physics-driven animated number component matching the Motion Primitives API.
 * Animates numerical values with customizable spring/easing physics and full accessibility.
 */
export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  className = '',
  springOptions,
  as: Component = 'span',
  format
}) => {
  const [displayValue, setDisplayValue] = useState<number>(() => {
    // In test or non-DOM environments, initialize immediately with the target value
    if (typeof window === 'undefined' || typeof requestAnimationFrame !== 'function') {
      return value;
    }
    return 0;
  });

  const previousValueRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    // If in test or headless environment without requestAnimationFrame, immediately set value
    if (typeof window === 'undefined' || typeof requestAnimationFrame !== 'function') {
      setDisplayValue(value);
      previousValueRef.current = value;
      return;
    }

    // When value is 0 (e.g. out of view / reset), cancel running animation and reset to 0
    // so that as soon as the user reaches the section, it animates from 0 to the target!
    if (value === 0) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      setDisplayValue(0);
      previousValueRef.current = 0;
      return;
    }

    const startValue = previousValueRef.current;
    const targetValue = value;
    const duration = springOptions?.duration ?? 2000;
    const bounce = springOptions?.bounce ?? 0;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / Math.max(duration, 1), 1);

      // Spring-inspired ease curve:
      // When bounce === 0, use smooth quintic deceleration (ease-out quint)
      // When bounce > 0, introduce physics-based spring oscillation
      let eased = 1;
      if (progress < 1) {
        if (bounce > 0) {
          const omega = 10;
          const zeta = Math.max(0.2, 1 - bounce * 0.8);
          eased = 1 - Math.exp(-zeta * omega * progress) * Math.cos(omega * progress);
        } else {
          eased = 1 - Math.pow(1 - progress, 4);
        }
      }

      const current = Math.round(startValue + (targetValue - startValue) * eased);
      setDisplayValue(current);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(targetValue);
        previousValueRef.current = targetValue;
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [value, springOptions?.duration, springOptions?.bounce]);

  const formattedDisplay = format
    ? format(displayValue)
    : displayValue.toLocaleString('en-US');

  const formattedTarget = format
    ? format(value)
    : value.toLocaleString('en-US');

  return (
    <Component className={`tabular-nums inline-flex items-center ${className}`}>
      {/* Screen readers get the exact settled target value without intermediate noise */}
      <span className="sr-only">{formattedTarget}</span>
      <span aria-hidden="true">{formattedDisplay}</span>
    </Component>
  );
};
