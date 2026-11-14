# ✦ ARCHITECTURE DECISION RECORD & STACK BOUNDARIES

**Project:** Bridal Model Editorial Portfolio (Mehak Sharma)  
**Date:** 2026-10-27  
**Architecture:** Modular Edge-Ready Monorepo / Static SPA  

---

## 1. Approved Architecture & Boundaries

### 1.1 Structural Organization
```text
bridal-model-portfolio/
├── docs/                 # System architecture, audit, API conventions & runbooks
├── public/               # Static media assets, video reels & photographs
│   ├── assets/           # Core imagery & fallback MP4 video reel
│   └── media/            # Organized editorial subdirectories (bridal, runway, jewelry)
├── src/
│   ├── components/       # Editorial UI components (Hero, Portfolio, About, Contact)
│   │   └── core/         # Micro-interactions (AnimatedNumber, InView, MorphingDialog)
│   ├── context/          # Content state management (ContentContext.tsx)
│   ├── utils/            # Shared math, transitions, and formatting helpers
│   ├── types/            # TypeScript domain models and schemas
│   ├── App.tsx           # Layout orchestrator (Full Scroll & Page View)
│   ├── data.ts           # Baseline editorial content configuration
│   └── main.tsx          # Application entry point with ErrorBoundary
├── index.html            # HTML shell with Google Font preconnects & SEO metadata
├── vite.config.ts        # Bundler configuration with test settings
└── package.json          # Dependency manifest & npm scripts
```

### 1.2 Separation of Concerns
1. **Presentation Layer (`src/components/`):** Purely responsible for rendering UI, animations, and responding to user gestures.
2. **State & Domain Layer (`src/context/`, `src/data.ts`):** Central source of truth for all portfolio text, image URLs, and settings. Decoupled from transport.
3. **Transport & API Layer (`api/` or serverless functions):** Boundary validation using Zod, safe HTTP status mapping, rate-limiting, and error formatting.
4. **Integration Layer:** External service clients (Email, Analytics) abstracted behind simple functional interfaces to avoid vendor lock-in.

---

## 2. Technology Selection Rationale

| Layer | Chosen Tool | Rationale | Alternatives Evaluated |
| :--- | :--- | :--- | :--- |
| **Bundler** | Vite 5 | Sub-second HMR, native ES modules, zero-config production optimization. | Webpack (Too complex/slow), Turbopack (Next.js coupling). |
| **Animation** | Motion (Framer Motion v12) | Hardware-accelerated spring animations, layout morphing, robust InView triggers. | GSAP (Commercial licensing overhead), CSS-only (Lacks layout morphing). |
| **Validation** | Zod | Runtime schema validation, automatic TypeScript type inference, zero dependencies. | Joi (Bulkier), Yup (Weaker TypeScript integration). |
| **Testing** | Vitest + RTL | Native Vite config integration, 3x faster than Jest, identical API to Jest/RTL. | Jest (Complex ESM config in Vite projects), Cypress (Heavier overhead). |
