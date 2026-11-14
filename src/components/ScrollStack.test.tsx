import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ScrollStack, { ScrollStackItem } from './ScrollStack';

describe('ScrollStack Right-to-Left Slider Component', () => {
  it('renders the exact user snippet cards with right-to-left direction badge when showHeader is enabled', () => {
    render(
      <div style={{ height: 600 }}>
        <ScrollStack showHeader={true}>
          <ScrollStackItem>
            <h2>Card 1</h2>
            <p>This is the first card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 2</h2>
            <p>This is the second card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 3</h2>
            <p>This is the third card in the stack</p>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    );

    // Direction badge
    expect(screen.getAllByText(/Right → Left ➔/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/HORIZONTAL SCROLL STACK/i)).toBeInTheDocument();

    // Cards rendered
    expect(screen.getByText('Card 1')).toBeInTheDocument();
    expect(screen.getByText('This is the first card in the stack')).toBeInTheDocument();
    expect(screen.getByText('Card 2')).toBeInTheDocument();
    expect(screen.getByText('Card 3')).toBeInTheDocument();

    // Data-lenis-prevent attribute prevents global page scroll interference
    const region = screen.getByRole('region', { name: /ScrollStack Slider/i });
    expect(region).toHaveAttribute('data-lenis-prevent', 'true');
  });

  it('slides from Card 1 to Card 2 and Card 3 when clicking Next and updates active indicator when controls are enabled', () => {
    const handleCardChange = vi.fn();
    const handleStackComplete = vi.fn();

    render(
      <div style={{ height: 600 }}>
        <ScrollStack
          showControls={true}
          showProgress={true}
          onCardChange={handleCardChange}
          onStackComplete={handleStackComplete}
        >
          <ScrollStackItem>
            <h2>Card 1</h2>
            <p>This is the first card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 2</h2>
            <p>This is the second card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 3</h2>
            <p>This is the third card in the stack</p>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    );

    // Initial counter: 01 / 03
    expect(screen.getByText('01 / 03')).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /Next card in stack/i });
    const prevBtn = screen.getByRole('button', { name: /Previous card in stack/i });

    // Previous is initially disabled
    expect(prevBtn).toBeDisabled();

    // Click Next to slide to Card 2
    fireEvent.click(nextBtn);
    expect(handleCardChange).toHaveBeenCalledWith(1);
    expect(screen.getByText('02 / 03')).toBeInTheDocument();

    // Click Next to slide to Card 3 (final card)
    fireEvent.click(nextBtn);
    expect(handleCardChange).toHaveBeenCalledWith(2);
    expect(handleStackComplete).toHaveBeenCalled();
    expect(screen.getByText('03 / 03')).toBeInTheDocument();

    // Next is now disabled on last card
    expect(nextBtn).toBeDisabled();

    // Click Previous to return to Card 2
    fireEvent.click(prevBtn);
    expect(screen.getByText('02 / 03')).toBeInTheDocument();
  });

  it('navigates directly when clicking pagination dot indicator when progress is enabled', () => {
    render(
      <div style={{ height: 600 }}>
        <ScrollStack showProgress={true}>
          <ScrollStackItem>
            <h2>Card 1</h2>
            <p>This is the first card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 2</h2>
            <p>This is the second card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 3</h2>
            <p>This is the third card in the stack</p>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    );

    const dot3 = screen.getByRole('button', { name: /Go to card 3/i });
    fireEvent.click(dot3);

    expect(screen.getByText('03 / 03')).toBeInTheDocument();
  });

  it('does NOT render Previous, Next, or page progress indicators by default', () => {
    render(
      <div style={{ height: 600 }}>
        <ScrollStack>
          <ScrollStackItem>
            <h2>Card 1</h2>
            <p>Clean look</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 2</h2>
            <p>Clean look</p>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    );

    expect(screen.queryByRole('button', { name: /Previous card in stack/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Next card in stack/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/01 \/ 02/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/HORIZONTAL SCROLL STACK/i)).not.toBeInTheDocument();
  });

  it('supports keyboard navigation with arrow keys', () => {
    render(
      <div style={{ height: 600 }}>
        <ScrollStack showProgress={true}>
          <ScrollStackItem>
            <h2>Card 1</h2>
            <p>This is the first card in the stack</p>
          </ScrollStackItem>
          <ScrollStackItem>
            <h2>Card 2</h2>
            <p>This is the second card in the stack</p>
          </ScrollStackItem>
        </ScrollStack>
      </div>
    );

    const region = screen.getByRole('region', { name: /ScrollStack Slider/i });

    // Press ArrowRight to advance
    fireEvent.keyDown(region, { key: 'ArrowRight' });
    expect(screen.getByText('02 / 02')).toBeInTheDocument();

    // Press ArrowLeft to go back
    fireEvent.keyDown(region, { key: 'ArrowLeft' });
    expect(screen.getByText('01 / 02')).toBeInTheDocument();
  });
});
