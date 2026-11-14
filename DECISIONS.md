# Architecture & Project Decisions

## Purpose

This file records important architectural, technical, security, data, and design decisions for the **Bridal Model Editorial Portfolio** project. Its purpose is to preserve architectural intent, rationale, constraints, and dependencies so that future developers and AI coding agents do not repeatedly re-infer, contradict, or accidentally undo decisions that were intentionally made.

---

## Rules for Future AI Agents

- **Read this file before making architecture-level changes.**
- **Treat "CONFIRMED" decisions as intentional constraints.**
- **Do not contradict a confirmed decision without explicit human approval.**
- **Do not silently replace an existing decision.**
- **If a proposed change conflicts with a decision, identify the conflict first.**
- **If a decision is unclear or outdated, ask for clarification before changing architecture.**
- **Never infer a new architecture solely because an existing implementation appears unusual.**
- **"DECISIONS.md" is documentation only. It must never become a justification for changing code without explicit user instruction.**

---

## Decision Index

| ID | Decision | Status | Area |
| :--- | :--- | :--- | :--- |
| **DEC-001** | Centralized Single-Source-of-Truth Content Architecture (`src/data.ts`) | **CONFIRMED** | Architecture / Frontend |
| **DEC-002** | Modern Toolchain & Bundler (Vite 5 + TypeScript + Tailwind CSS) | **CONFIRMED** | Infrastructure / Frontend |
| **DEC-003** | Test Framework & Runner (Vitest + React Testing Library) | **CONFIRMED** | Operations / Testing |
| **DEC-004** | Cinematic Smooth Scrolling Engine (Lenis + ReactLenis Provider) | **CONFIRMED** | Frontend / UX |
| **DEC-005** | Section 2 Pinned Stacking Showcase (`ScrollExpand` + `ScrollStack` with Right-to-Left Motion) | **CONFIRMED** | Frontend / UX |
| **DEC-006** | Client-Isolated State Persistence with Self-Healing Fallback (`localStorage` + `deepMergeWithDefaults`) | **CONFIRMED** | Frontend / State Management |
| **DEC-007** | Full-Bleed Pinned Background Viewport with Unified Continuous Scroll | **CONFIRMED** | Frontend / Layout |
| **DEC-008** | Luxury Error Boundary with Automatic Corrupted-Storage Remediation | **CONFIRMED** | Architecture / Reliability |
| **DEC-009** | Minimalist Floating Controls (Top-Right "Book Shoot" & Bottom-Right "Edit" Dock) | **CONFIRMED** | Frontend / UI Architecture |
| **DEC-010** | Dual Editorial Typography Hierarchy (Anton & Plus Jakarta Sans) | **CONFIRMED** | Frontend / Design System |
| **DEC-011** | Standardized RESTful JSON Envelope Specification for Edge API | **CONFIRMED** | API / Backend Architecture |
| **DEC-012** | Asset Caching & CDN Freshness Policy | **CONFIRMED** | Infrastructure / Performance |
| **DEC-013** | Native OS Mailto Protocol for Lead Inquiries (Interim Phase 1 Implementation) | **CONFIRMED** | Business Logic / Integration |
| **DEC-014** | Backward-Compatibility Export Layer in Data Manifest | **CONFIRMED** | Architecture / Maintenance |
| **DEC-015** | Deprecation of Top Navigation Bar & Multi-Mode Dock in Favor of Immersive Hero | **SUPERSEDED** | Frontend / UI Architecture |

---

## Decisions

### DEC-001 — Centralized Single-Source-of-Truth Content Architecture (`src/data.ts`)

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Architecture / Frontend  

- **Decision:** All editorial copy, image/video asset paths, measurements, statistics, timeline milestones, press tear sheets, and contact details are centralized in `src/data.ts` under a single strongly-typed `WEBSITE_CONTENT` configuration object.
- **Why:** Allows model managers, editors, and non-technical users to update the entire portfolio from a single, predictable file without risking edits to React JSX component logic.
- **Problem Solved:** Prevents content fragmentation, string duplication across multiple files, and unintentional UI regressions during text updates.
- **Alternatives Considered:** External headless CMS (Sanity, Contentful), scattered hardcoded component strings.
- **Why Alternatives Were Rejected:** Headless CMS introduces external network latency, subscription costs, and API token dependencies for a static portfolio. Scattered strings make client updates error-prone.
- **Constraints:** Must adhere strictly to TypeScript interfaces declared in `src/types/index.ts`.
- **Impact:** Consumed by `ContentContext.tsx`, `Hero.tsx`, `EditorialScrollStack.tsx`, `PortfolioGallery.tsx`, `About.tsx`, `JourneyTimeline.tsx`, `PressTearSheets.tsx`, and `Contact.tsx`.
- **Evidence:** `src/data.ts`, `docs/architecture.md#1.2`, `CONTENT_GUIDE.md#📌-The-Golden-Rule`.
- **Change Risk:** Modifying data structures without updating `src/types/index.ts` will trigger build-time TypeScript compilation errors.
- **Related Decisions:** DEC-006, DEC-014.

---

### DEC-002 — Modern Toolchain & Bundler (Vite 5 + TypeScript + Tailwind CSS)

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Infrastructure / Frontend  

- **Decision:** Build the portfolio as a single page application (SPA) using Vite 5, React 18, TypeScript (strict mode), and Tailwind CSS with PostCSS.
- **Why:** Vite provides instant dev server start, sub-second Hot Module Replacement (HMR), Rollup-based production tree-shaking, and zero-config asset hashing.
- **Problem Solved:** Eliminates legacy Webpack build slowdowns, complex Babel configurations, and bloated production CSS files.
- **Alternatives Considered:** Webpack, Turbopack / Next.js.
- **Why Alternatives Were Rejected:** Webpack is significantly slower with heavy configuration overhead; Next.js/Turbopack introduces full-stack server-side rendering complexity unnecessary for an edge-cached visual portfolio.
- **Constraints:** Requires Node.js 18+; React Fast Refresh requires files inside component boundaries to only export React components.
- **Impact:** All build scripts (`npm run dev`, `npm run build`, `npm run preview`), configuration files (`vite.config.ts`, `tailwind.config.js`, `tsconfig.json`).
- **Evidence:** `vite.config.ts`, `package.json`, `docs/architecture.md#2`.
- **Change Risk:** Changing bundlers breaks alias path resolution (`@/*`) and Vitest configuration.
- **Related Decisions:** DEC-003, DEC-012.

---

### DEC-003 — Test Framework & Runner (Vitest + React Testing Library)

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Operations / Testing  

- **Decision:** Use Vitest 1.6 with `@testing-library/react`, `@testing-library/jest-dom`, and JSDOM environment for all unit, integration, and E2E component tests.
- **Why:** Vitest executes directly inside Vite's transform pipeline, running 3x faster than Jest while maintaining full API compatibility with standard test conventions.
- **Problem Solved:** Avoids duplicated transform configs and ESM module parsing incompatibilities that occur when running Jest inside Vite projects.
- **Alternatives Considered:** Jest, Cypress / Playwright.
- **Why Alternatives Were Rejected:** Jest requires separate Babel/ts-jest configurations; Cypress/Playwright add heavy browser binary overhead for unit-level state tests.
- **Constraints:** JSDOM lacks native layout engines for scroll heights and CSS 3D transforms, requiring explicit mocks for `IntersectionObserver` and `window.scrollTo` in `src/test/setup.ts`.
- **Impact:** 16 test files covering 72 tests across math utilities, context reducers, and UI components.
- **Evidence:** `vite.config.ts`, `src/test/setup.ts`, `docs/architecture.md#2`, `docs/testing.md`.
- **Change Risk:** Modifying test runner setup breaks the 72-test quality gate.
- **Related Decisions:** DEC-002.

---

### DEC-004 — Cinematic Smooth Scrolling Engine (Lenis + ReactLenis Provider)

**Status:** CONFIRMED  
**Date:** 2026-10-31  
**Area:** Frontend / UX  

- **Decision:** Use Lenis smooth scrolling (`@studio-freight/lenis` / `lenis/react`) wrapping the root application, exposing the instance globally via `(window as any).lenis`.
- **Why:** Provides normalized, momentum-based, luxury kinetic scrolling across different input devices (trackpad, mousewheel, mobile touch) without browser stutter.
- **Problem Solved:** Eliminates abrupt native scroll jumps and enables frame-by-frame synchronization with sticky pinned scroll animations.
- **Alternatives Considered:** Native CSS `scroll-behavior: smooth`, Locomotive Scroll.
- **Why Alternatives Were Rejected:** Native CSS lacks momentum physics and smooth frame callback hooks; Locomotive Scroll has higher bundle weight and conflicts with CSS sticky viewport pinning.
- **Constraints:** Nested scrollable containers (e.g., `ContentEditorModal`, Lightbox, touch carousels) must declare `data-lenis-prevent="true"` to prevent parent page hijacking.
- **Impact:** `src/App.tsx`, `src/components/ScrollExpand.tsx`, `src/components/ContentEditorModal.tsx`, `src/components/SmoothScroll.test.tsx`.
- **Evidence:** `src/App.tsx#L40-L51`, `src/components/SmoothScroll.test.tsx`.
- **Change Risk:** Removing or unhooking Lenis causes desynchronization between page scroll and `ScrollExpand` pinning.
- **Related Decisions:** DEC-005, DEC-007.

---

### DEC-005 — Section 2 Pinned Stacking Showcase (`ScrollExpand` + `ScrollStack` with Right-to-Left Motion)

**Status:** CONFIRMED  
**Date:** 2026-10-31  
**Area:** Frontend / UX  

- **Decision:** Section 2 (`#looks`) utilizes a sticky pinning track (`pinHeight="750vh"`) combining `ScrollExpand` and `ScrollStack`. When entered, a framed portal (44% width / 58% height / 24px radius) expands to full bleed (`100vw x 100vh`), holds across 5 full-screen slides that transition right-to-left, and smoothly collapses back down before continuing natural page scroll.
- **Why:** Delivers an unhurried, slow-paced luxury experience where a full trackpad swipe skips at most 1–2 slides, giving every high-resolution look dedicated visual prominence without leaving empty side gutters.
- **Problem Solved:** Fast scrolling speeding through multiple slides at once, small boxy cards leaving empty side margins, and visual disconnect between sections.
- **Alternatives Considered:** 3D Cylindrical Ring (`LookRing3D`), horizontal overflow carousel.
- **Why Alternatives Were Rejected:** 3D Cylindrical Ring required horizontal drag gestures that felt awkward on vertical mobile scroll (retained as hidden `#3d-ring` anchor for backward compatibility); horizontal overflow breaks vertical narrative pacing.
- **Constraints:** Total track height is `750vh`; hold range is 80% (`pExpandRatio=0.10`, `pCollapseRatio=0.90`); each card receives equal 20% interval (~104vh) of scroll distance.
- **Impact:** `src/components/EditorialScrollStack.tsx`, `src/components/ScrollExpand.tsx`, `src/components/ScrollStack.tsx`.
- **Evidence:** `src/components/EditorialScrollStack.tsx#L90-L171`, `src/components/ScrollExpand.tsx#L170-L225`, `src/components/ScrollStack.tsx#L404-L470`.
- **Change Risk:** Shortening `pinHeight` causes fast-forward scroll rush; adding margins/padding breaks full-screen mobile/desktop bleed.
- **Related Decisions:** DEC-004, DEC-007, DEC-015.

---

### DEC-006 — Client-Isolated State Persistence with Self-Healing Fallback (`localStorage` + `deepMergeWithDefaults`)

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Frontend / State Management  

- **Decision:** Live customizations made through `ContentEditorModal` persist to `localStorage` under key `bridal_portfolio_custom_content_v2` and hydrate through `deepMergeWithDefaults` in `src/utils/contentMerge.ts`.
- **Why:** Allows the client to personalize content and preview changes live without requiring an authenticated backend database or server deployment.
- **Problem Solved:** Prevents white-screen crashes if localStorage holds corrupted or outdated JSON structures by falling back to valid defaults for every missing key.
- **Alternatives Considered:** Raw `JSON.parse` direct state assignment, remote server database.
- **Why Alternatives Were Rejected:** Direct assignment caused "Unexpected Display State" crashes if a field was missing; remote database requires user authentication infrastructure.
- **Constraints:** LocalStorage changes are browser-isolated and do not persist across different visitor devices.
- **Impact:** `src/context/ContentContext.tsx`, `src/utils/contentMerge.ts`, `src/components/ErrorBoundary.tsx`.
- **Evidence:** `src/utils/contentMerge.ts#L11-L89`, `docs/known-issues.md#ARC-001`.
- **Change Risk:** Bypassing `deepMergeWithDefaults` risks unhandled property access errors on client startup.
- **Related Decisions:** DEC-001, DEC-008.

---

### DEC-007 — Full-Bleed Pinned Background Viewport with Unified Continuous Scroll

**Status:** CONFIRMED  
**Date:** 2026-10-26  
**Area:** Frontend / Layout  

- **Decision:** Mount the primary high-resolution bridal portrait at `fixed inset-0 z-0` with multi-stop dark gradients and screen blend modes, while all 7 page sections scroll continuously over it at `relative z-10`.
- **Why:** Creates high-end editorial depth and cohesive atmospheric lighting across the entire portfolio, eliminating visual seams between sections.
- **Problem Solved:** Prevents repetitive background reloads, awkward white section breaks, and disjointed page transitions.
- **Alternatives Considered:** Discrete background images per section, paginated full-screen slides (`viewMode="pages"`).
- **Why Alternatives Were Rejected:** Separate backgrounds look cluttered; discrete page-by-page slides feel like a presentation deck rather than an editorial fashion magazine.
- **Constraints:** Overlaid content must maintain high contrast using semi-transparent frosted cards (`bg-[#141018]/75 backdrop-blur-xl border border-[#DEC596]/20`).
- **Impact:** `src/App.tsx#L125-L260`, `src/components/Hero.tsx`, `src/index.css`.
- **Evidence:** `src/App.tsx#L127-L140`, `docs/system-design.md#2.1`.
- **Change Risk:** Removing fixed background breaks visual continuity and causes contrast failure against dark body theme.
- **Related Decisions:** DEC-004, DEC-010.

---

### DEC-008 — Luxury Error Boundary with Automatic Corrupted-Storage Remediation

**Status:** CONFIRMED  
**Date:** 2026-10-31  
**Area:** Architecture / Reliability  

- **Decision:** Wrap the root application in a custom React `ErrorBoundary` that renders a stylized editorial recovery screen, automatically purges invalid localStorage keys, and provides "Recover Portfolio Now ✦" and "Reset Custom Data & Reload ↺" actions.
- **Why:** Protects clients and visitors from unexpected white screens caused by corrupt browser storage, network timeouts, or unhandled exceptions.
- **Problem Solved:** Prevents permanent client lockout if invalid data is saved to `localStorage`.
- **Alternatives Considered:** Default Vite dev error overlay, unhandled browser crash.
- **Why Alternatives Were Rejected:** Vite overlay does not exist in production builds; unhandled crash leaves a blank screen damaging client trust.
- **Constraints:** Must be a class component to implement `componentDidCatch` and `getDerivedStateFromError`.
- **Impact:** `src/components/ErrorBoundary.tsx`, `src/main.tsx`.
- **Evidence:** `src/components/ErrorBoundary.tsx#L1-L150`, `src/main.tsx#L8-L12`, `docs/known-issues.md#ISS-003`.
- **Change Risk:** Removing ErrorBoundary leaves production builds vulnerable to unrecoverable white screens.
- **Related Decisions:** DEC-006.

---

### DEC-009 — Minimalist Floating Controls (Top-Right "Book Shoot" & Bottom-Right "Edit" Dock)

**Status:** CONFIRMED  
**Date:** 2026-10-31  
**Area:** Frontend / UI Architecture  

- **Decision:** Removed the fixed top navigation banner completely; replaced with a permanent luxury top-right "Book Shoot ↗" pill button and a single floating bottom-right "✦ Edit" dock button (with `Ctrl+E` keyboard shortcut).
- **Why:** Delivers an uncluttered, high-fashion magazine cover appearance on the Hero page, eliminating navigation bar clutter while keeping the primary commercial call-to-action immediately accessible.
- **Problem Solved:** Navigation bars crowding the oversized Anton display title and interfering with mobile viewports.
- **Alternatives Considered:** Fixed top navigation bar with monogram (`MS`), multi-button floating dock ("Page View", "Full Scroll", "Edit").
- **Why Alternatives Were Rejected:** Top bar distracted from model portrait; multi-button dock added cognitive load and conflicted with the unified continuous scroll model.
- **Constraints:** "Book Shoot" must smoothly navigate to `#contact`; "Edit" button must open `ContentEditorModal`.
- **Impact:** `src/App.tsx#L250-L270`, `src/App.test.tsx#L13-L38`.
- **Evidence:** `src/App.tsx#L250-L273`, `src/App.test.tsx#L16-L37`.
- **Change Risk:** Re-introducing a top banner will break existing E2E assertions in `App.test.tsx`.
- **Related Decisions:** DEC-007, DEC-015.

---

### DEC-010 — Dual Editorial Typography Hierarchy (Anton & Plus Jakarta Sans)

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Frontend / Design System  

- **Decision:** Use Google Fonts `Anton` for oversized uppercase headlines, numbers, and display statements; use `Plus Jakarta Sans` for body text, metadata, badges, and credits.
- **Why:** Anton evokes bold high-fashion Vogue cover typography; Plus Jakarta Sans provides clean geometric readability at small sizes.
- **Problem Solved:** Typographic inconsistency and generic web styling.
- **Alternatives Considered:** Playfair Display, Cinzel, Montserrat.
- **Why Alternatives Were Rejected:** Playfair/Cinzel felt overly classical/archaic; Anton provides modern high-impact high-fashion editorial poise.
- **Constraints:** Preconnected in `index.html` via `fonts.googleapis.com` and `fonts.gstatic.com` to prevent Flash of Unstyled Text (FOUT).
- **Impact:** `index.html`, `tailwind.config.js`, all component typography classes.
- **Evidence:** `index.html#L14-L21`, `README.md#2`, `docs/caching.md#1`.
- **Change Risk:** Visual degradation and FOUT if font link or Tailwind font families change.
- **Related Decisions:** DEC-002, DEC-012.

---

### DEC-011 — Standardized RESTful JSON Envelope Specification for Edge API

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** API / Backend Architecture  

- **Decision:** All future edge/serverless API endpoints (`/api/*`) must return standardized envelopes: `{ success: true, data: T, meta: { requestId } }` for success and `{ error: { code, message, details, requestId } }` for failures.
- **Why:** Ensures client-side API consumers have a single, deterministic contract with correlation tracking, preventing unhandled edge failures or leaking internal stack traces.
- **Problem Solved:** Ad-hoc API response formats and unstructured error payloads.
- **Alternatives Considered:** Raw payload responses, GraphQL.
- **Why Alternatives Were Rejected:** Raw payloads lack standardized error/metadata context; GraphQL introduces unnecessary query parsing overhead for a lightweight portfolio.
- **Constraints:** HTTP status codes must strictly match envelope semantics (`200`, `201`, `400`, `401`, `429`, `500`).
- **Impact:** `docs/api-conventions.md`, `docs/system-design.md`, future backend endpoints.
- **Evidence:** `docs/api-conventions.md#1-3`, `docs/system-design.md#1`.
- **Change Risk:** Breaking frontend API adapters if response shapes diverge.
- **Related Decisions:** DEC-001, DEC-013.

---

### DEC-012 — Asset Caching & CDN Freshness Policy

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Infrastructure / Performance  

- **Decision:** Immutable 1-year caching for content-hashed JS/CSS (`dist/assets/*`), `max-age=0, must-revalidate` for `index.html`, and `stale-while-revalidate` for video reels (24h) and high-res photos (7d).
- **Why:** Guarantees zero stale deployments for visitors while maximizing edge CDN cache hit rates and minimizing cellular bandwidth usage for heavy media assets.
- **Problem Solved:** Stale browser caches showing outdated code or media after redeployments.
- **Alternatives Considered:** Uniform 24-hour cache for all assets.
- **Why Alternatives Were Rejected:** Causes stale HTML holding old bundle hashes or re-downloads heavy video files needlessly.
- **Constraints:** Video files must support HTTP 206 partial range requests for smooth scrubbing.
- **Impact:** Deployment configuration, CDN headers, `public/media/` assets.
- **Evidence:** `docs/caching.md#1-2`.
- **Change Risk:** Cache invalidation failures or high egress costs on media CDN.
- **Related Decisions:** DEC-002, DEC-007.

---

### DEC-013 — Native OS Mailto Protocol for Lead Inquiries (Interim Phase 1 Implementation)

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Business Logic / Integration  

- **Decision:** Direct commission inquiries on the Contact section trigger native `mailto:bookings@mehaksharma.editorial` client handlers with pre-filled subject/body formatting, while `POST /api/inquiries` is planned for Phase 2.
- **Why:** Zero-backend, zero-cost operational lead capture that works immediately on static hosting without requiring third-party email API provisioning.
- **Problem Solved:** Inability to receive booking inquiries prior to backend server setup.
- **Alternatives Considered:** Third-party form services (Formspree, EmailJS), requiring full Node.js mailer backend immediately.
- **Why Alternatives Were Rejected:** Third-party services introduce subscription dependencies and privacy exposure; full mailer backend requires email server provisioning (SES/Resend).
- **Constraints:** Requires the client to have an email client configured on their operating system.
- **Impact:** `src/components/Contact.tsx#L58-L68`, `docs/known-issues.md#API-001`.
- **Evidence:** `src/components/Contact.tsx`, `docs/known-issues.md#API-001`, `docs/system-design.md#2.2`.
- **Change Risk:** Lost conversions from visitors without a default desktop mail application (documented for upgrade to `POST /api/inquiries`).
- **Related Decisions:** DEC-011.

---

### DEC-014 — Backward-Compatibility Export Layer in Data Manifest

**Status:** CONFIRMED  
**Date:** 2026-10-27  
**Area:** Architecture / Maintenance  

- **Decision:** Retain named export aliases in `src/data.ts` (`MODEL_PROFILE`, `MODEL_STATISTICS`, `PORTFOLIO_ITEMS`, `JOURNEY_MILESTONES`, `EDITORIAL_TEAR_SHEETS`, `MODELLING_SPECIALITIES`, `CONTACT_INFO`) mapping directly to `WEBSITE_CONTENT` properties.
- **Why:** Ensures existing component imports and legacy test suites continue to resolve cleanly without massive cross-file refactoring when the central schema was unified into `WEBSITE_CONTENT`.
- **Problem Solved:** Breaking changes across 16 test files and multiple components during centralized schema migration.
- **Alternatives Considered:** Breaking refactor renaming imports across all files.
- **Why Alternatives Were Rejected:** High risk of subtle regression across tests and components with zero runtime benefit.
- **Constraints:** Any new property added to `WEBSITE_CONTENT` that was historically accessed directly must preserve its legacy export alias.
- **Impact:** `src/data.ts#L690-L738`, `src/data.test.ts`.
- **Evidence:** `src/data.ts#L690-L738`, `src/data.test.ts#L37-L41`.
- **Change Risk:** Breakage of existing unit tests if export aliases are removed.
- **Related Decisions:** DEC-001.

---

### DEC-015 — Deprecation of Top Navigation Bar & Multi-Mode Dock in Favor of Immersive Hero

**Status:** SUPERSEDED (Historical: OUTDATED)  
**Date:** 2026-10-31  
**Area:** Frontend / UI Architecture  

- **Decision:** The original top navigation header (`Navigation.tsx` banner with monogram) and the floating multi-button dock ("Page View" / "Full Scroll") were deprecated and superseded by a clean magazine hero with a single top-right "Book Shoot" pill and single "✦ Edit" dock button.
- **Why:** User requested a clean, professional, and luxurious intro without clutter, allowing the model portrait and typography to dominate the initial viewport.
- **Problem Solved:** Header banner collision, navigation redundancy, and cluttered bottom controls.
- **Alternatives Considered:** Collapsible hamburger menu, persistent sticky nav bar.
- **Why Alternatives Were Rejected:** Distracted from luxury editorial magazine styling; user explicitly requested removing navigation bars and page counters.
- **Constraints:** `App.test.tsx` explicitly asserts that the banner, monogram, and "Page View" / "Full Scroll" buttons are NOT present in the DOM.
- **Impact:** `src/App.tsx`, `src/App.test.tsx`, `src/components/Navigation.tsx`.
- **Evidence:** `src/App.test.tsx#L13-L38`, `README.md#3.1` (reflects legacy state before supersession).
- **Change Risk:** Re-adding a top nav bar will break existing E2E assertions in `App.test.tsx`.
- **Related Decisions:** DEC-009.

---

## Decision Dependency Analysis

- **DEC-006 (State Persistence)** depends on **DEC-001 (Content Schema)** for fallback defaults and **DEC-008 (ErrorBoundary)** for corrupted-data purge.
- **DEC-005 (ScrollStack Showcase)** depends on **DEC-004 (Lenis Scrolling)** for synchronized window scroll events and **DEC-007 (Full-Bleed Viewport)** for edge-to-edge layout.
- **DEC-009 (Minimalist Controls)** supersedes **DEC-015 (Top Nav Bar & Multi-Mode Dock)**.
- **DEC-014 (Backward-Compatibility Layer)** depends directly on **DEC-001 (Content Schema)**.
- **DEC-003 (Vitest Runner)** depends on **DEC-002 (Vite Toolchain)** for unified configuration and transform pipelines.
- **DEC-013 (Mailto Lead Capture)** is an interim mechanism planned to migrate to **DEC-011 (RESTful API Envelope)** via `POST /api/inquiries`.

---

## Change Protocol for Future Agents

Before making any architectural, technical, or dependency change, future AI agents and engineers must follow this strict sequence:

1. **Locate Existing Decision:** Find the relevant decision in this document using the Decision Index.
2. **Review Rationale & Constraints:** Understand the original problem solved, why alternatives were rejected, and what constraints exist.
3. **Identify Affected Components:** Trace every repository path listed under "Impact" and "Evidence".
4. **Identify Dependent Decisions:** Check the "Decision Dependency Analysis" section to see what other decisions depend on the target.
5. **Formulate Explicit Justification:** Clearly explain why the existing decision is no longer sufficient or why the context has changed.
6. **Formulate Proposed Replacement:** Specify the new architecture or technical choice.
7. **Evaluate Migration Risks:** Identify breaking changes, compatibility impacts, and regression risks.
8. **Request Explicit Human Approval:** Do NOT modify source code or architecture without explicit human confirmation.
9. **Update Documentation Simultaneously:** When approved, record the new decision with a new stable ID (e.g., `DEC-016`) and mark the old decision as `SUPERSEDED` or `OUTDATED`. Never rewrite architectural history.
