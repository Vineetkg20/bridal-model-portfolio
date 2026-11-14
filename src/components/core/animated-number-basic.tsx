'use client';
import React, { useEffect, useState } from 'react';
import { AnimatedNumber } from '@/components/core/animated-number';

export interface AnimatedNumberBasicProps {
  targetValue?: number;
  label?: string;
  className?: string;
}

export function AnimatedNumberBasic({
  targetValue = 2082,
  label,
  className = ''
}: AnimatedNumberBasicProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    setValue(targetValue);
  }, [targetValue]);

  return (
    <div className={`flex w-full items-center justify-center ${className}`}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 16 16'
        width='16'
        height='16'
        className='mr-3 h-3.5 w-3.5 fill-transparent stroke-[#DEC596] stroke-[1.4] drop-shadow-[0_0_8px_rgba(222,197,150,0.5)]'
        aria-hidden='true'
      >
        <path d='M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z'></path>
      </svg>
      <AnimatedNumber
        className='inline-flex items-center font-mono text-2xl font-semibold text-[#F5EEDC] tracking-tight drop-shadow-[0_0_10px_rgba(222,197,150,0.3)]'
        springOptions={{
          bounce: 0,
          duration: 2000,
        }}
        value={value}
      />
      {label && (
        <span className="ml-2 text-xs uppercase tracking-wider text-white/70 font-sans">
          {label}
        </span>
      )}
    </div>
  );
}
