import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { AnimatedNumber } from './animated-number';
import { AnimatedNumberBasic } from './animated-number-basic';

describe('AnimatedNumber Component', () => {
  it('renders with accessibility attributes and target value', () => {
    render(<AnimatedNumber value={2082} className="test-number" />);

    // Screen reader accessible text contains exact target number
    expect(screen.getByText('2,082')).toBeInTheDocument();
  });

  it('respects custom formatter if provided', () => {
    const customFormat = (val: number) => `$${val}.00`;
    render(<AnimatedNumber value={150} format={customFormat} />);

    expect(screen.getByText('$150.00')).toBeInTheDocument();
  });

  it('renders custom HTML element when specified by as prop', () => {
    const { container } = render(
      <AnimatedNumber value={85} as="h2" className="custom-heading" />
    );

    const heading = container.querySelector('h2.custom-heading');
    expect(heading).toBeInTheDocument();
  });
});

describe('AnimatedNumberBasic Component', () => {
  it('renders the star SVG and the animated number value', () => {
    const { container } = render(<AnimatedNumberBasic targetValue={2082} />);

    // SVG icon is present
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();

    // Target value is rendered
    expect(screen.getByText('2,082')).toBeInTheDocument();
  });
});
