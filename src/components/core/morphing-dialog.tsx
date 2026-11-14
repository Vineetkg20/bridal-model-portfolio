'use client';
import React, {
  createContext,
  useContext,
  useState,
  useId,
  useEffect,
  useRef,
  ReactNode,
  CSSProperties,
  MouseEvent
} from 'react';
import { createPortal } from 'react-dom';
import {
  motion,
  AnimatePresence,
  type Transition,
  type Variants
} from 'motion/react';

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uniqueId: string;
  transition?: Transition;
}

const MorphingDialogContext = createContext<MorphingDialogContextType | null>(null);

export const useMorphingDialog = () => {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error('MorphingDialog components must be used within a MorphingDialogProvider');
  }
  return context;
};

export interface MorphingDialogProps {
  children: ReactNode;
  transition?: Transition;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function MorphingDialog({
  children,
  transition = {
    type: 'spring',
    bounce: 0.05,
    duration: 0.25
  },
  isOpen: controlledIsOpen,
  onOpenChange
}: MorphingDialogProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isControlled = controlledIsOpen !== undefined;
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;

  useEffect(() => {
    if (controlledIsOpen !== undefined) {
      setInternalIsOpen(controlledIsOpen);
    }
  }, [controlledIsOpen]);

  const setIsOpen: React.Dispatch<React.SetStateAction<boolean>> = (value) => {
    const nextValue = typeof value === 'function' ? (value as (prev: boolean) => boolean)(isOpen) : value;
    setInternalIsOpen(nextValue);
    if (onOpenChange) {
      onOpenChange(nextValue);
    }
  };

  const uniqueId = useId();

  return (
    <MorphingDialogContext.Provider
      value={{
        isOpen,
        setIsOpen,
        uniqueId,
        transition
      }}
    >
      {children}
    </MorphingDialogContext.Provider>
  );
}

export interface MorphingDialogTriggerProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
}

export function MorphingDialogTrigger({
  children,
  className = '',
  style,
  onClick
}: MorphingDialogTriggerProps) {
  const { setIsOpen, uniqueId, transition } = useMorphingDialog();

  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    setIsOpen(true);
    if (onClick) onClick(e);
  };

  return (
    <motion.div
      layoutId={`dialog-${uniqueId}`}
      transition={transition}
      onClick={handleClick}
      className={`cursor-pointer ${className}`}
      style={style}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsOpen(true);
        }
      }}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingDialogContainerProps {
  children: ReactNode;
  className?: string;
}

export function MorphingDialogContainer({
  children,
  className = ''
}: MorphingDialogContainerProps) {
  const { isOpen, setIsOpen } = useMorphingDialog();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsOpen(false);
          document.body.style.overflow = '';
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, setIsOpen]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          data-lenis-prevent="true"
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 overflow-hidden ${className}`}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-md"
            aria-hidden="true"
          />
          {children}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export interface MorphingDialogContentProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function MorphingDialogContent({
  children,
  className = '',
  style
}: MorphingDialogContentProps) {
  const { uniqueId, transition } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-${uniqueId}`}
      transition={transition}
      onClick={(e) => e.stopPropagation()}
      className={`relative z-10 w-full overflow-hidden shadow-2xl ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingDialogImageProps {
  src: string;
  alt?: string;
  className?: string;
  style?: CSSProperties;
  loading?: 'lazy' | 'eager';
}

export function MorphingDialogImage({
  src,
  alt = '',
  className = '',
  style,
  loading = 'lazy'
}: MorphingDialogImageProps) {
  const { uniqueId, transition } = useMorphingDialog();

  return (
    <motion.img
      layoutId={`dialog-img-${uniqueId}`}
      transition={transition}
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
    />
  );
}

export interface MorphingDialogTitleProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function MorphingDialogTitle({
  children,
  className = '',
  style
}: MorphingDialogTitleProps) {
  const { uniqueId, transition } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-title-${uniqueId}`}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingDialogSubtitleProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function MorphingDialogSubtitle({
  children,
  className = '',
  style
}: MorphingDialogSubtitleProps) {
  const { uniqueId, transition } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-subtitle-${uniqueId}`}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingDialogDescriptionProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  disableLayoutAnimation?: boolean;
  variants?: Variants;
}

const defaultDescriptionVariants: Variants = {
  initial: { opacity: 0, scale: 0.8, y: 30 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.8, y: 30 }
};

export function MorphingDialogDescription({
  children,
  className = '',
  style,
  disableLayoutAnimation = false,
  variants = defaultDescriptionVariants
}: MorphingDialogDescriptionProps) {
  const { uniqueId, transition } = useMorphingDialog();

  if (disableLayoutAnimation) {
    return (
      <motion.div
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        transition={transition}
        className={className}
        style={style}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      layoutId={`dialog-desc-${uniqueId}`}
      transition={transition}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingDialogCloseProps {
  children?: ReactNode;
  className?: string;
}

export function MorphingDialogClose({
  children,
  className = ''
}: MorphingDialogCloseProps) {
  const { setIsOpen } = useMorphingDialog();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen(false);
    document.body.style.overflow = '';
  };

  return (
    <button
      type="button"
      onClick={handleClose}
      aria-label="Close dialog"
      className={`absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80 focus:outline-none cursor-pointer ${className}`}
    >
      {children || (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  );
}
