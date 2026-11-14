# ✦ MEHAK SHARMA — Luxury Bridal Model Portfolio

A premium, cinematic, interactive portfolio website for a **PROFESSIONAL BRIDAL MODEL**. Designed as a high-fashion bridal fashion editorial mixed with a modern, experimental digital portfolio.

---

## 🎬 1. Visual Reference & Video Recreation (`portfolio-women.mp4`)

This website was crafted based on an in-depth frame-by-frame analysis of `portfolio-women.mp4`:
- **Attire & Craftsmanship**: Royal sapphire blue bridal lehenga adorned with hand-embroidered zardozi and gold/silver threadwork, paired with a matching sheer dupatta draped with architectural poise.
- **Jewellery Focus**: Platinum and diamond sculptural drop choker, matching teardrop earrings, sapphire bracelet, rings, and traditional bridal mehndi (henna).
- **Movement & Pacing**: Unhurried, deliberate editorial rhythm (1.2s to 1.8s pose holds) showcasing 360-degree jewelry angles, profile turns, regal seated postures, and approachable bridal warmth.
- **Video Reel Integration**: The original 1080p high-definition video reference is directly embedded into the Hero and Portfolio sections with play/pause, audio toggle, and loop controls, ensuring the model's movements and poise remain the living centerpiece of the experience.

---

## 🎨 2. Visual Direction & Identity

- **Color Palette**:
  - Pure White (`#FFFFFF`) — High-fashion negative space and generous breathing room.
  - Deep Editorial Red (`#8B0000` / `#700000`) — Striking editorial contrast used for hero accents, the Contact finale, and 3D look ring highlights.
  - Light Rose Red (`#E24B5E`) — Delicate accents and card back-face gradients.
  - Dark Ink Black (`#0A0A0C` / `#111113`) — Deep typography and rich contrast.
- **Typography**:
  - **Anton**: Oversized, bold editorial headlines, display statements, and numerical counters.
  - **Plus Jakarta Sans**: Clean, modern, highly legible sans-serif for navigation, body text, credits, and captions.

---

## 🏛️ 3. Sections & Features

1. **Dynamic Navigation (`src/components/Navigation.tsx`)**:
   - Minimal, fixed navigation that automatically adapts its text contrast (dark ink on white sections, pure white on red sections and transitions).
   - Wordmark monogram (`MS`), desktop links, and full-screen mobile drawer (<820px).
2. **Hero Section (`src/components/Hero.tsx`)**:
   - Magazine cover art direction with oversized Anton typography.
   - Professional designation: `BRIDAL MODEL · FASHION · EDITORIAL`.
   - 3-line concise editorial statement.
   - Integrated live 1080p video reel with playback and mute controls.
   - Minimal scroll indicator and subtle availability badge.
3. **3D Look Ring (`src/components/LookRing3D.tsx`)**:
   - Continuous 3D cylindrical ring built with pure CSS 3D transforms (`perspective`, `rotateY`, `translateZ`).
   - Dual-faced cards: Front face (white, every 3rd card deep editorial red) and Back face (`rotateY(180deg)` with light red gradient).
   - Interactive drag-to-spin, auto-rotation with hover pause, and click-to-flip.
   - Lightweight, touch-friendly swipeable carousel for mobile viewports (<820px).
4. **Portfolio Gallery & Lightbox (`src/components/PortfolioGallery.tsx` & `src/components/Lightbox.tsx`)**:
   - Filterable categories: Bridal Portraits, Full-Length Bridal Looks, Wedding Editorials, Couture & Designer Wear, Beauty and Makeup, Fashion Campaigns.
   - Accessible keyboard-controlled lightbox (ArrowLeft, ArrowRight, Escape).
5. **Blade Transitions (`src/components/BladeTransition.tsx` & `src/utils/transitions.ts`)**:
   - Shared mathematical `clip-path: polygon(...)` geometry creating sharp, editorial page-turn transitions between sections.
   - Exit-opacity easing rule: `opacity * Math.max(0, 1 - exitProgress * 2.4)`.
6. **About Section (`src/components/About.tsx`)**:
   - Secondary portrait, personal manifesto, bridal approach, and model measurements specifications.
   - 3 large editorial animated numerical counters (`85+`, `40+`, `6+`).
7. **Experience & Journey (`src/components/JourneyTimeline.tsx`)**:
   - Curated fashion archive sequence with featured campaign milestones and dates.
8. **Modelling Specialities (`src/components/Specialities.tsx`)**:
   - 16 core editorial disciplines organized into balanced typographic clusters (no fake progress bars).
9. **Contact Finale (`src/components/Contact.tsx`)**:
   - Full editorial-red background revealed by blade transition.
   - Gigantic white `LET'S CREATE` headline in Anton (`min(36vh, 26vw)`).
   - Primary email in bottom-left (`clamp(34px, 3.7vw, 74px)`) with animated wipe underline.
   - Stacked social links (Instagram, Lookbook, Agency) with rotating `↗` icons.

---

## 📁 4. Centralized Content Management (`src/data.ts`)

All content, images, videos, measurements, statistics, and social links are centralized in:
```
src/data.ts
```

### To Update Model Information:
Open `src/data.ts` and modify the `MODEL_PROFILE` object:
```typescript
export const MODEL_PROFILE: ModelProfile = {
  fullName: 'MEHAK SHARMA',
  specialtiesSubtitle: 'BRIDAL MODEL · FASHION · EDITORIAL',
  // ...
};
```

### To Replace Images or Videos:
Place your new files in `public/assets/` and update the paths in `src/data.ts`:
- Hero Video: `/assets/portfolio-women.mp4`
- Hero & Portrait Image: `/assets/bridal-portrait-1.jpg`
- Portfolio Look Images: update `primaryImage` in `PORTFOLIO_ITEMS`.

---

## 🚀 5. Development & Build Commands

Ensure Node.js (v18+) is available, then run:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server with Hot Module Replacement
npm run dev

# 3. Typecheck TypeScript files
npm run typecheck

# 4. Production build
npm run build

# 5. Preview production build locally
npm run preview
```

---

## ♿ 6. Accessibility & Performance
- Full keyboard navigation for modal lightbox, links, and buttons.
- Semantic HTML5 structure (`header`, `main`, `section`, `article`, `footer`).
- `prefers-reduced-motion` CSS rules automatically simplify animations for users requesting reduced motion.
- Hardware-accelerated CSS 3D transforms (`translateZ(0)`) ensure fluid 60fps interaction.
