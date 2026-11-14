import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';
import { WEBSITE_CONTENT } from '../data';

describe('Navigation Component', () => {
  it('renders monogram, model name, and desktop navigation links', () => {
    const onNavigate = vi.fn();
    render(<Navigation activeSection="hero" isRedSection={false} onNavigate={onNavigate} />);

    expect(screen.getByText(WEBSITE_CONTENT.navigation.monogram)).toBeInTheDocument();
    expect(screen.getByText(WEBSITE_CONTENT.navigation.brandName)).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Portfolio')).toBeInTheDocument();
    expect(screen.getByText('Contact')).toBeInTheDocument();
  });

  it('adapts text color contrast based on isRedSection prop', () => {
    const onNavigate = vi.fn();
    const { rerender, container } = render(
      <Navigation activeSection="hero" isRedSection={false} onNavigate={onNavigate} />
    );

    // Light section: text is dark ink
    const link = screen.getByText('Home');
    expect(link).toHaveClass('text-[#111113]');

    // Red section (Contact): text adapts to white
    rerender(<Navigation activeSection="contact" isRedSection={true} onNavigate={onNavigate} />);
    expect(link).toHaveClass('text-white');
  });

  it('triggers onNavigate callback when link is clicked', () => {
    const onNavigate = vi.fn();
    render(<Navigation activeSection="hero" isRedSection={false} onNavigate={onNavigate} />);

    const portfolioLink = screen.getByText('Portfolio');
    fireEvent.click(portfolioLink);
    expect(onNavigate).toHaveBeenCalledWith('portfolio');
  });

  it('toggles mobile menu drawer when hamburger button is clicked', () => {
    const onNavigate = vi.fn();
    render(<Navigation activeSection="hero" isRedSection={false} onNavigate={onNavigate} />);

    const hamburgerBtn = screen.getByRole('button', { name: /Open Menu/i });
    fireEvent.click(hamburgerBtn);

    // Mobile drawer should now be visible
    expect(screen.getByText(WEBSITE_CONTENT.navigation.mobileMenuTitle)).toBeInTheDocument();
  });
});
