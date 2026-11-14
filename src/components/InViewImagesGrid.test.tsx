import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InViewImagesGrid } from './InViewImagesGrid';
import { EDITORIAL_STACK_ITEMS } from './EditorialScrollStack';

describe('InViewImagesGrid / EditorialScrollStack Integration', () => {
  it('renders seamless scroll stack without pagination controls or previous/next buttons', () => {
    render(<InViewImagesGrid />);

    // Verify artificial debug headers, previous/next buttons, and counters are NOT rendered
    expect(screen.queryByText(/HORIZONTAL SCROLL STACK/i)).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Previous card in stack/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Next card in stack/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/01 \/ 0/i)).not.toBeInTheDocument();

    // Verify bridal cards from EDITORIAL_STACK_ITEMS are rendered with pure titles
    expect(screen.getByText(/The Royal Azure Reign/i)).toBeInTheDocument();
    expect(screen.getByText(/Crimson Heirloom Symphony/i)).toBeInTheDocument();
    expect(screen.getByText(/Contemporary Ivory Nocturne/i)).toBeInTheDocument();

    // Verify photos are rendered with img tags
    const images = screen.getAllByRole('img', { hidden: true });
    expect(images.length).toBe(EDITORIAL_STACK_ITEMS.length);
  });

  it('keeps cards clean without artificial 1 to 5 page indicators', () => {
    render(<InViewImagesGrid />);

    // Ensure no "Card 1:", "Card 2:" prefix strings or "01 / 05" page types
    expect(screen.queryByText(/Card 1:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Card 2:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/01 \/ 05/i)).not.toBeInTheDocument();
  });

  it('invokes onOpenLightbox when inspect button is clicked', () => {
    const handleOpenLightbox = vi.fn();
    render(<InViewImagesGrid onOpenLightbox={handleOpenLightbox} />);

    const inspectButtons = screen.getAllByRole('button', { name: /Inspect Look/i });
    expect(inspectButtons.length).toBeGreaterThan(0);

    fireEvent.click(inspectButtons[0]);
    expect(handleOpenLightbox).toHaveBeenCalledTimes(1);
    expect(handleOpenLightbox).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 'look-azure',
        title: 'The Royal Azure Reign'
      })
    );
  });
});
