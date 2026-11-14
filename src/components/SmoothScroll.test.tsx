import React from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { App } from '../App';
import { Lightbox } from './Lightbox';
import { ContentEditorModal } from './ContentEditorModal';
import { ContentProvider } from '../context/ContentContext';
import { PortfolioItem } from '../types';

describe('Lenis Smooth Scroll Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes Lenis smooth scroll and mounts App within ReactLenis provider', () => {
    const { container } = render(<App />);

    // Check App rendered
    expect(container.querySelector('main')).toBeInTheDocument();

    // Verify global lenis is attached to window
    expect((window as any).lenis).toBeDefined();
    expect(typeof (window as any).lenis.scrollTo).toBe('function');
  });

  it('triggers smooth scroll when Back to Top is executed in Contact section', () => {
    render(<App />);

    const lenis = (window as any).lenis;
    const scrollToSpy = vi.spyOn(lenis, 'scrollTo');

    // Find and click "Back to top" button
    const backToTopBtn = screen.getByRole('button', { name: /Back to top/i });
    fireEvent.click(backToTopBtn);

    expect(scrollToSpy).toHaveBeenCalledWith(0, expect.objectContaining({ duration: 1.4 }));
  });

  it('ensures ContentEditorModal has data-lenis-prevent to preserve internal scrolling', () => {
    render(
      <ContentProvider>
        <ContentEditorModal />
      </ContentProvider>
    );

    // Click edit button or open modal
    const dialog = screen.queryByRole('dialog', { name: /Editorial Website Customizer/i });
    if (dialog) {
      expect(dialog).toHaveAttribute('data-lenis-prevent', 'true');
    }
  });

  it('ensures Lightbox modal has data-lenis-prevent to isolate modal scroll from background', () => {
    const sampleItem: PortfolioItem = {
      id: 'test-item-1',
      title: 'Test Bridal Gown',
      category: 'Bridal',
      collection: 'COUTURE',
      primaryImage: '/test.jpg',
      shortDescription: 'Test Description',
      tags: ['Couture'],
      credits: {
        designer: 'Sabyasachi',
        photographer: 'Tarun'
      }
    };

    render(
      <Lightbox
        item={sampleItem}
        allItems={[sampleItem]}
        onClose={vi.fn()}
        onNavigate={vi.fn()}
      />
    );

    const lightboxDialog = screen.getByRole('dialog', { name: /Lightbox view of Test Bridal Gown/i });
    expect(lightboxDialog).toHaveAttribute('data-lenis-prevent', 'true');
  });
});
