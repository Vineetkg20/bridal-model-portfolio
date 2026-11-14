import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { App } from './App';
import { WEBSITE_CONTENT } from './data';

describe('App End-to-End Component Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.style.overflow = '';
  });

  it('renders the website without the upper navigation strip, featuring hero and floating controls', () => {
    render(<App />);

    // Top navigation strip is completely removed from the entire website
    expect(screen.queryByRole('banner')).not.toBeInTheDocument();
    expect(screen.queryByText(WEBSITE_CONTENT.navigation.monogram)).not.toBeInTheDocument();

    // Hero headline words are rendered directly
    expect(screen.getByText('MEHAK')).toBeInTheDocument();
    expect(screen.getByText('SHARMA')).toBeInTheDocument();

    // Intro page is clean and professional without 'Bridal Model' or 'Accepting Bridal Campaigns'
    const heroSection = document.getElementById('hero');
    expect(heroSection).toBeInTheDocument();
    expect(within(heroSection!).queryByText(/Bridal Model/i)).not.toBeInTheDocument();
    expect(within(heroSection!).queryByText(/Accepting Bridal Campaigns/i)).not.toBeInTheDocument();

    // Floating controls dock features a single clean Edit shortcut button
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.queryByText('Page View')).not.toBeInTheDocument();
    expect(screen.queryByText('Full Scroll')).not.toBeInTheDocument();

    // Premium Book Shoot button is rendered on the top right
    const bookShootBtn = screen.getByRole('button', { name: /Book Shoot/i });
    expect(bookShootBtn).toBeInTheDocument();
  });

  it('navigates to contact section when Book Shoot button is clicked', () => {
    render(<App />);

    const bookShootBtn = screen.getByRole('button', { name: /Book Shoot/i });
    fireEvent.click(bookShootBtn);

    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('renders all sections in a continuous unified editorial layout without pagination bars', () => {
    render(<App />);

    // Renders all sections in sequence
    expect(document.getElementById('hero')).toBeInTheDocument();
    expect(document.getElementById('looks')).toBeInTheDocument();
    expect(document.getElementById('portfolio')).toBeInTheDocument();
    expect(document.getElementById('about')).toBeInTheDocument();
    expect(document.getElementById('journey')).toBeInTheDocument();
    expect(document.getElementById('press')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();

    // No page pagination controller bar
    expect(screen.queryByText(/PAGE 1 OF 7/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/PAGE 2 OF 7/i)).not.toBeInTheDocument();
  });

  it('opens Content Editor and updates website text in real-time', async () => {
    render(<App />);

    // Click the Edit shortcut button in navigation or floating badge
    const editBtn = screen.getByTitle(/Open Live Content Editor/i);
    fireEvent.click(editBtn);

    // Content customizer is open
    expect(screen.getByText(/WEBSITE CONTENT CUSTOMIZER/i)).toBeInTheDocument();

    // Find the input for Model Full Name
    const nameInput = screen.getByDisplayValue(WEBSITE_CONTENT.hero.fullName);
    fireEvent.change(nameInput, { target: { value: 'VICTORIA SERAPHINA' } });

    // Click UPDATE WEBSITE NOW
    const updateBtns = screen.getAllByRole('button', { name: /UPDATE WEBSITE NOW/i });
    fireEvent.click(updateBtns[0]);

    // Close the editor via Cancel ✕ (since changes are saved, it keeps saved state)
    const closeBtn = screen.getByRole('button', { name: /Cancel ✕/i });
    fireEvent.click(closeBtn);

    // The updated name is now live in the hero!
    await waitFor(() => {
      expect(screen.getByText('VICTORIA')).toBeInTheDocument();
      expect(screen.getByText('SERAPHINA')).toBeInTheDocument();
    });
  });

  it('restores original text when Cancel is clicked without saving', async () => {
    render(<App />);

    const editBtn = screen.getByTitle(/Open Live Content Editor/i);
    fireEvent.click(editBtn);

    // Edit Model Name and Subtitle
    const nameInput = screen.getByDisplayValue(WEBSITE_CONTENT.hero.fullName);
    fireEvent.change(nameInput, { target: { value: 'TEMPORARY UNWANTED EDIT' } });

    // Click Cancel (Restore Original) button
    const cancelBtn = screen.getByRole('button', { name: /Cancel \(Restore Original\)/i });
    fireEvent.click(cancelBtn);

    // Original model name and subtitle must be restored on the website!
    await waitFor(() => {
      expect(screen.queryByText('TEMPORARY')).not.toBeInTheDocument();
      expect(screen.queryByText('UNWANTED')).not.toBeInTheDocument();
      expect(screen.getByText('MEHAK')).toBeInTheDocument();
      expect(screen.getByText('SHARMA')).toBeInTheDocument();
    });
  });
});