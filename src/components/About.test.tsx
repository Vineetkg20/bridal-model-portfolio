import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { About } from './About';
import { ContentProvider } from '../context/ContentContext';

describe('About Component Achievements & Sliding Numbers', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the About section honoring bridal culture', () => {
    render(
      <ContentProvider>
        <About />
      </ContentProvider>
    );

    // Section heading honoring bridal couture
    expect(screen.getByText(/HONORING THE SOUL OF BRIDAL COUTURE/i)).toBeInTheDocument();

    // Achievements section badge
    expect(screen.getByText(/VERIFIED ACHIEVEMENTS & RECORD/i)).toBeInTheDocument();

    // Achievements labels
    expect(screen.getByText(/COUTURE & BRIDAL CAMPAIGNS/i)).toBeInTheDocument();
    expect(screen.getByText(/DESIGNER & ATELIER COLLABORATIONS/i)).toBeInTheDocument();
    expect(screen.getByText(/YEARS ON CAMERA & RUNWAY/i)).toBeInTheDocument();

    // Archive couture milestone counter is removed
    expect(screen.queryByText(/Couture Archive Milestones:/i)).not.toBeInTheDocument();
  });

  it('triggers the sliding numbers animation when user reaches the achievements section', () => {
    render(
      <ContentProvider>
        <About />
      </ContentProvider>
    );

    // Active metrics badge indicates section has intersected viewport
    expect(screen.getByText(/Active Metrics/i)).toBeInTheDocument();

    // Target values are rendered and animated
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('40')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.queryByText(/Couture Archive Milestones:/i)).not.toBeInTheDocument();
  });
});
