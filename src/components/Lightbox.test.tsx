import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Lightbox } from './Lightbox';
import { WEBSITE_CONTENT } from '../data';

describe('Lightbox Accessible Modal Component', () => {
  const sampleItems = WEBSITE_CONTENT.portfolioItems.slice(0, 3);
  const activeItem = sampleItems[0];

  it('renders nothing when item is null', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    const { container } = render(
      <Lightbox item={null} allItems={sampleItems} onClose={onClose} onNavigate={onNavigate} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders look details and image when open', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    render(
      <Lightbox item={activeItem} allItems={sampleItems} onClose={onClose} onNavigate={onNavigate} />
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(activeItem.title)).toBeInTheDocument();
    expect(screen.getByText(activeItem.shortDescription)).toBeInTheDocument();
  });

  it('calls onClose when Close button or Escape key is pressed', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    render(
      <Lightbox item={activeItem} allItems={sampleItems} onClose={onClose} onNavigate={onNavigate} />
    );

    // Click Close button
    const closeBtn = screen.getByRole('button', { name: /Close Lightbox/i });
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);

    // Press Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('navigates next and previous using keyboard arrows', () => {
    const onClose = vi.fn();
    const onNavigate = vi.fn();
    render(
      <Lightbox item={activeItem} allItems={sampleItems} onClose={onClose} onNavigate={onNavigate} />
    );

    // ArrowRight -> next item
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(onNavigate).toHaveBeenCalledWith(sampleItems[1]);

    // ArrowLeft -> previous item (wraps to last item)
    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(onNavigate).toHaveBeenCalledWith(sampleItems[sampleItems.length - 1]);
  });
});
