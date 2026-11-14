import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollExpand from './ScrollExpand';

describe('ScrollExpand Component', () => {
  it('renders exact user snippet 1 with window scroll, media, and children', () => {
    render(
      <ScrollExpand
        src="/hero.jpg"
        alt="Product hero"
        title="Built to scale"
        scrollHint="Scroll inside the frame"
        useWindowScroll
      >
        <h2>Every pixel, everywhere</h2>
        <p>The frame opens up as you scroll and hands the whole stage to your media.</p>
      </ScrollExpand>
    );

    // Media & Titles rendered
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/hero.jpg');
    expect(img).toHaveAttribute('alt', 'Product hero');
    expect(screen.getByText('Built to scale')).toBeInTheDocument();
    expect(screen.getByText('Scroll inside the frame')).toBeInTheDocument();

    // Children rendered
    expect(screen.getByText('Every pixel, everywhere')).toBeInTheDocument();
    expect(
      screen.getByText('The frame opens up as you scroll and hands the whole stage to your media.')
    ).toBeInTheDocument();
  });

  it('renders exact user snippet 2 inside a fixed height container', () => {
    render(
      <div style={{ height: '520px' }}>
        <ScrollExpand
          src="/hero.jpg"
          title="Built to scale"
          mediaZoom={1.35}
          startWidth={42}
          startHeight={58}
          startRadius={24}
          endRadius={0}
          scrollDistance={1.2}
          holdDistance={0.35}
          smoothing={0.1}
          overlayScrim={0.45}
          enabled
        />
      </div>
    );

    const region = screen.getByRole('region', { name: /ScrollExpand Container/i });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('data-lenis-prevent', 'true');
    expect(screen.getByText('Built to scale')).toBeInTheDocument();
  });

  it('provides render props with activeCardIndex, isExpanded, and current phase', () => {
    const handleCardChange = vi.fn();
    const handleExpandChange = vi.fn();

    render(
      <div style={{ height: '600px' }}>
        <ScrollExpand
          startWidth={44}
          startHeight={58}
          startRadius={24}
          totalCards={5}
          onCardIndexChange={handleCardChange}
          onExpandStateChange={handleExpandChange}
        >
          {({ activeCardIndex, phase, isExpanded }) => (
            <div>
              <span data-testid="active-card">{activeCardIndex}</span>
              <span data-testid="phase">{phase}</span>
              <span data-testid="expanded">{isExpanded ? 'yes' : 'no'}</span>
            </div>
          )}
        </ScrollExpand>
      </div>
    );

    expect(screen.getByTestId('active-card')).toHaveTextContent('0');
    expect(screen.getByTestId('phase')).toHaveTextContent('expand');
    expect(screen.getByTestId('expanded')).toHaveTextContent('no');
  });

  it('responds to wheel events by progressing through expand, hold, and collapse phases', () => {
    render(
      <div style={{ height: '600px' }}>
        <ScrollExpand startWidth={40} startHeight={50} totalCards={3}>
          {({ phase, activeCardIndex }) => (
            <div>
              <span data-testid="phase-status">{phase}</span>
              <span data-testid="card-status">{activeCardIndex}</span>
            </div>
          )}
        </ScrollExpand>
      </div>
    );

    const region = screen.getByRole('region', { name: /ScrollExpand Container/i });

    // Initial state: expand phase
    expect(screen.getByTestId('phase-status')).toHaveTextContent('expand');

    // Scroll forward into hold phase
    fireEvent.wheel(region, { deltaY: 250 });
    expect(['expand', 'hold']).toContain(screen.getByTestId('phase-status').textContent);

    // Scroll deep into collapse phase
    fireEvent.wheel(region, { deltaY: 700 });
    expect(['hold', 'collapse']).toContain(screen.getByTestId('phase-status').textContent);
  });
});
