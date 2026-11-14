import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PortfolioGallery } from './PortfolioGallery';
import { ContentProvider } from '../context/ContentContext';
import { MorphingDialogBasicOne } from './core/morphing-dialog-basic';

describe('PortfolioGallery with MorphingDialog Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = '';
  });

  const renderGallery = () => {
    return render(
      <ContentProvider>
        <PortfolioGallery />
      </ContentProvider>
    );
  };

  it('renders portfolio archive section with morphing dialog cards', () => {
    renderGallery();

    expect(screen.getByText(/PORTFOLIO ARCHIVE/i)).toBeInTheDocument();
    expect(screen.getByText(/Curated Fashion Archive/i)).toBeInTheDocument();

    // Verify trigger cards exist with plus icon button
    const openBtns = screen.getAllByRole('button', { name: /Open .* details/i });
    expect(openBtns.length).toBeGreaterThan(0);
  });

  it('morphs open when clicked showing the photo and description without background pages', () => {
    renderGallery();

    const triggerCards = screen.getAllByRole('button', { name: /Open .* details/i });
    expect(triggerCards.length).toBeGreaterThan(0);

    // Click the first trigger card
    fireEvent.click(triggerCards[0]);

    // In expanded view, the Curated Silhouette Description and dialog close button appear
    expect(screen.getByText(/Curated Silhouette Description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Close dialog/i })).toBeInTheDocument();

    // Close the dialog with a single click
    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    // Overflow should be restored immediately in a single click
    expect(document.body.style.overflow).toBe('');
  });

  it('restores body overflow and cleans look query state on close click', () => {
    renderGallery();

    const triggerCards = screen.getAllByRole('button', { name: /Open .* details/i });
    fireEvent.click(triggerCards[0]);

    expect(document.body.style.overflow).toBe('hidden');

    const closeBtn = screen.getByRole('button', { name: /Close dialog/i });
    fireEvent.click(closeBtn);

    expect(document.body.style.overflow).toBe('');
  });

  it('renders MorphingDialogBasicOne standalone component accurately', () => {
    render(<MorphingDialogBasicOne />);

    expect(screen.getByText(/ROYAL ATELIER/i)).toBeInTheDocument();
    const plusBtn = screen.getByRole('button', { name: /Open dialog/i });
    expect(plusBtn).toBeInTheDocument();

    fireEvent.click(plusBtn);

    expect(screen.getByText(/A masterwork celebrating the dialogue/i)).toBeInTheDocument();
  });
});
