import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContentEditorModal } from './ContentEditorModal';
import { ContentProvider } from '../context/ContentContext';
import { WEBSITE_CONTENT } from '../data';

describe('ContentEditorModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = '';
  });

  const renderModal = (props: any = {}) => {
    return render(
      <ContentProvider>
        <ContentEditorModal
          isOpen={true}
          onClose={vi.fn()}
          {...props}
        />
      </ContentProvider>
    );
  };

  it('renders modal header, tabs, and action buttons', () => {
    renderModal();

    expect(screen.getByText(/WEBSITE CONTENT CUSTOMIZER/i)).toBeInTheDocument();
    expect(screen.getByText(/1\. Model & Identity/i)).toBeInTheDocument();
    expect(screen.getByText(/2\. Hero Video & Media/i)).toBeInTheDocument();
    expect(screen.getByText(/4\. Portfolio Looks/i)).toBeInTheDocument();
    expect(screen.getAllByText(/UPDATE WEBSITE NOW/i).length).toBeGreaterThan(0);
  });

  it('displays real-time success toast when UPDATE WEBSITE NOW is clicked', () => {
    renderModal();

    const updateBtns = screen.getAllByRole('button', { name: /UPDATE WEBSITE NOW/i });
    fireEvent.click(updateBtns[0]);

    expect(screen.getByText(/WEBSITE UPDATED IN REAL-TIME/i)).toBeInTheDocument();
  });

  it('allows switching to Portfolio Looks tab and adding a new look', () => {
    renderModal();

    const portfolioTabBtn = screen.getByText(/4\. Portfolio Looks/i);
    fireEvent.click(portfolioTabBtn);

    expect(screen.getByText(/Portfolio Looks & Photographs/i)).toBeInTheDocument();

    const addLookBtn = screen.getByRole('button', { name: /\+ Add New Look/i });
    fireEvent.click(addLookBtn);

    // Should now find the new bridal creation
    expect(screen.getByText(/New Bridal Creation/i)).toBeInTheDocument();
  });

  it('locks body scroll on open and unlocks on close', () => {
    const onClose = vi.fn();
    const { unmount } = render(
      <ContentProvider>
        <ContentEditorModal isOpen={true} onClose={onClose} />
      </ContentProvider>
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('allows editing Model Full Name and Professional Subtitle simultaneously without overwriting', () => {
    renderModal();

    const nameInput = screen.getByDisplayValue(WEBSITE_CONTENT.hero.fullName);
    const subtitleInput = screen.getByDisplayValue(WEBSITE_CONTENT.hero.subtitle);

    fireEvent.change(nameInput, { target: { value: 'AURELIA VANCE' } });
    fireEvent.change(subtitleInput, { target: { value: 'INTERNATIONAL COUTURE MUSE' } });

    expect(nameInput).toHaveValue('AURELIA VANCE');
    expect(subtitleInput).toHaveValue('INTERNATIONAL COUTURE MUSE');
  });

  it('restores original content when Cancel is clicked', () => {
    const onSave = vi.fn();
    const onClose = vi.fn();
    render(
      <ContentProvider>
        <ContentEditorModal
          isOpen={true}
          onClose={onClose}
          onSave={onSave}
          content={WEBSITE_CONTENT}
        />
      </ContentProvider>
    );

    const nameInput = screen.getByDisplayValue(WEBSITE_CONTENT.hero.fullName);
    fireEvent.change(nameInput, { target: { value: 'MODIFIED NAME' } });

    // Click Cancel (Restore Original) button
    const cancelBtn = screen.getByRole('button', { name: /Cancel \(Restore Original\)/i });
    fireEvent.click(cancelBtn);

    // Verify onSave was called with original WEBSITE_CONTENT to restore it
    expect(onSave).toHaveBeenCalledWith(expect.objectContaining({
      hero: expect.objectContaining({ fullName: WEBSITE_CONTENT.hero.fullName })
    }));
    expect(onClose).toHaveBeenCalled();
  });

  it('renders Model Specifications option in edit tabs and allows adding hero specifications', () => {
    renderModal();

    // Verify option exists in Edit Options
    const specsTabBtn = screen.getByRole('button', { name: /✦ Model Specifications/i });
    expect(specsTabBtn).toBeInTheDocument();
    fireEvent.click(specsTabBtn);

    // Verify Tab contents are rendered
    expect(screen.getByText(/Model Specifications & Physical Measurements/i)).toBeInTheDocument();
    expect(screen.getByText(/Intro Page Specifications Card/i)).toBeInTheDocument();
    expect(screen.getByText(/Editorial Agency Measurements Table/i)).toBeInTheDocument();

    // Verify adding a new hero specification
    const addHeroSpecBtn = screen.getByRole('button', { name: /\+ Add Hero Specification/i });
    fireEvent.click(addHeroSpecBtn);

    expect(screen.getByDisplayValue('Bridal Couture')).toBeInTheDocument();
  });
});