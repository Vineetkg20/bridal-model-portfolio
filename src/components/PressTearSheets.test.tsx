import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PressTearSheets } from './PressTearSheets';
import { ContentProvider } from '../context/ContentContext';

describe('PressTearSheets Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders section headers, badge, and digital comp card banner', () => {
    render(
      <ContentProvider>
        <PressTearSheets />
      </ContentProvider>
    );

    // Section Badge
    expect(screen.getByText(/EDITORIAL TEAR SHEETS & PRESS/i)).toBeInTheDocument();

    // Section Main Heading
    expect(screen.getByText(/COVERS & PUBLICATIONS/i)).toBeInTheDocument();

    // Comp Card
    expect(screen.getByText(/DIGITAL COMP CARD/i)).toBeInTheDocument();
    expect(screen.getByText(/Represented Globally by Elite Model Management/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /View Comp Card/i })).toBeInTheDocument();
  });

  it('renders tear sheets and allows filtering by publication', () => {
    render(
      <ContentProvider>
        <PressTearSheets />
      </ContentProvider>
    );

    // Check that Vogue India cover is present
    expect(screen.getByText(/VOGUE INDIA/i)).toBeInTheDocument();
    expect(screen.getByText(/The Sovereign Bride/i)).toBeInTheDocument();

    // Filter pills
    const harperFilter = screen.getByRole('button', { name: /^Harper's Bazaar$/i });
    expect(harperFilter).toBeInTheDocument();

    // Click Harper's Bazaar filter
    fireEvent.click(harperFilter);

    // Should display Harper's Bazaar Bride and hide Elle
    expect(screen.getByText(/HARPER'S BAZAAR BRIDE/i)).toBeInTheDocument();
    expect(screen.queryByText(/ELLE WEDDINGS/i)).not.toBeInTheDocument();
  });

  it('opens and closes the tear sheet inspect modal', () => {
    render(
      <ContentProvider>
        <PressTearSheets />
      </ContentProvider>
    );

    const inspectButtons = screen.getAllByRole('button', { name: /Inspect.*tear sheet/i });
    expect(inspectButtons.length).toBeGreaterThan(0);

    // Open first modal
    fireEvent.click(inspectButtons[0]);

    // Modal should show dialog with close button
    const closeBtn = screen.getByRole('button', { name: /Close modal/i });
    expect(closeBtn).toBeInTheDocument();

    // Close modal
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('button', { name: /Close modal/i })).not.toBeInTheDocument();
  });

  it('opens and closes the digital comp card modal', () => {
    render(
      <ContentProvider>
        <PressTearSheets />
      </ContentProvider>
    );

    const compCardBtn = screen.getByRole('button', { name: /View Comp Card/i });
    fireEvent.click(compCardBtn);

    // Modal should show official editorial specifications and close button
    expect(screen.getByText(/OFFICIAL EDITORIAL SPECIFICATIONS/i)).toBeInTheDocument();
    const closeBtn = screen.getByRole('button', { name: /Close comp card/i });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('button', { name: /Close comp card/i })).not.toBeInTheDocument();
  });
});
