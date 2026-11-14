'use client';
import React from 'react';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogImage,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogDescription,
  MorphingDialogContainer,
} from '@/components/core/morphing-dialog';
import { PlusIcon } from 'lucide-react';

export function MorphingDialogBasicOne() {
  return (
    <MorphingDialog
      transition={{
        type: 'spring',
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: '12px',
        }}
        className='flex max-w-[270px] flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900'
      >
        <MorphingDialogImage
          src='/media/photos/hero/hero-bridal-portrait.jpg'
          alt='Editorial Bridal Heritage Creation'
          className='h-48 w-full object-cover'
        />
        <div className='flex grow flex-row items-end justify-between px-3 py-2'>
          <div>
            <MorphingDialogTitle className='text-zinc-950 dark:text-zinc-50 font-anton tracking-wide uppercase text-sm'>
              ROYAL ATELIER
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='text-zinc-700 dark:text-zinc-400 text-xs font-sans'>
              Bridal Couture Editorial
            </MorphingDialogSubtitle>
          </div>
          <button
            type='button'
            className='relative ml-1 flex h-6 w-6 shrink-0 scale-100 select-none appearance-none items-center justify-center rounded-lg border border-zinc-950/10 text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] dark:border-zinc-50/10 dark:bg-zinc-900 dark:text-zinc-500 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:focus-visible:ring-zinc-500'
            aria-label='Open dialog'
          >
            <PlusIcon size={12} />
          </button>
        </div>
      </MorphingDialogTrigger>
      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: '24px',
          }}
          className='pointer-events-auto relative flex h-auto w-full flex-col overflow-hidden border border-zinc-950/10 bg-white dark:border-zinc-50/10 dark:bg-zinc-900 sm:w-[500px]'
        >
          <MorphingDialogImage
            src='/media/photos/hero/hero-bridal-portrait.jpg'
            alt='Editorial Bridal Heritage Creation'
            className='h-full w-full object-cover max-h-[380px]'
          />
          <div className='p-6'>
            <MorphingDialogTitle className='text-2xl text-zinc-950 dark:text-zinc-50 font-anton uppercase'>
              ROYAL ATELIER
            </MorphingDialogTitle>
            <MorphingDialogSubtitle className='text-zinc-700 dark:text-zinc-400 font-sans text-xs tracking-wider uppercase mt-1'>
              Bridal Couture Editorial · Zardozi Craft
            </MorphingDialogSubtitle>
            <MorphingDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, scale: 0.8, y: 100 },
                animate: { opacity: 1, scale: 1, y: 0 },
                exit: { opacity: 0, scale: 0.8, y: 100 },
              }}
            >
              <p className='mt-3 text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed'>
                A masterwork celebrating the dialogue between traditional polki ornamentation
                and contemporary haute-couture silhouette craftsmanship.
              </p>
              <p className='mt-2 text-zinc-500 text-xs leading-relaxed'>
                Curated specifically for luxury bridal showcases, featuring bespoke embroidery
                and architectural drapery.
              </p>
            </MorphingDialogDescription>
          </div>
          <MorphingDialogClose className='text-zinc-50' />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
}
