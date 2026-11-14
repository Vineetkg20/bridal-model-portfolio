import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LookRing3D } from './LookRing3D';
import { WEBSITE_CONTENT } from '../data';

describe('LookRing3D Component', () => {
  it('renders section title and 3D cylinder cards', () => {
    const onSelectLook = vi.fn();
    render(<LookRing3D onSelectLook={onSelectLook} />);

    expect(screen.getByText(WEBSITE_CONTENT.lookRing.heading)).toBeInTheDocument();
    // Cards from portfolioItems should be present
    const firstLook = WEBSITE_CONTENT.portfolioItems[0];
    expect(screen.getAllByText(firstLook.title).length).toBeGreaterThan(0);
  });

  it('flips a card when clicked to reveal editorial archive back face', () => {
    const onSelectLook = vi.fn();
    render(<LookRing3D onSelectLook={onSelectLook} />);

    const firstLook = WEBSITE_CONTENT.portfolioItems[0];
    // Find card container by title
    const cardTitleEl = screen.getAllByText(firstLook.title)[0];
    const cardEl = cardTitleEl.closest('.preserve-3d');
    expect(cardEl).toBeInTheDocument();

    if (cardEl) {
      fireEvent.click(cardEl);
      // Back face archive details should be accessible
      expect(screen.getAllByText(new RegExp(`ARCHIVE DETAILS`, 'i')).length).toBeGreaterThan(0);
    }
  });
});
