'use client';
import React, { ReactNode, useRef } from 'react';
import {
  motion,
  useInView,
  type Variants,
  type Transition,
  type UseInViewOptions
} from 'motion/react';

export interface InViewProps {
  children: ReactNode;
  variants?: Variants;
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: keyof typeof motion;
  className?: string;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

/**
 * InView Component
 * Motion Primitives wrapper that triggers animations when elements enter or exit the viewport.
 * Supports configurable variants, transitions, and viewport intersection options.
 */
export const InView: React.FC<InViewProps> = ({
  children,
  variants = defaultVariants,
  transition,
  viewOptions,
  as = 'div',
  className = ''
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewOptions);

  const Component = (motion[as as keyof typeof motion] || motion.div) as typeof motion.div;

  return (
    <Component
      ref={ref}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </Component>
  );
};
