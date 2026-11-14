# ✦ SYSTEM DESIGN SPECIFICATION

**Project:** Bridal Model Editorial Portfolio (Mehak Sharma)  
**Date:** 2026-10-27  
**Architecture:** Luxury Fashion Single Page Application with Modular Edge API  

---

## 1. System Overview & Core Workflows

The application delivers an editorial digital experience for high-fashion bridal couture modeling. The system architecture balances rich visual media (1080p motion studies, high-resolution photographs) with high-performance client rendering and resilient, lightweight backend services.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CLIENT BROWSER (Vite SPA)                        │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────────┐   │
│  │ Hero & Visual Reel    │  │ Staggered Look Grid   │  │ Morphing Dialog│   │
│  │ (Full Bleed Background│  │ (In-View Blur Focus)  │  │ Portfolio      │   │
│  └───────────────────────┘  └───────────────────────┘  └────────────────┘   │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌────────────────┐   │
│  │ Muse Profile & Specs  │  │ Career Timeline       │  │ Inquiries Form │   │
│  │ (Sliding Numbers)     │  │ (Haute Couture Runs)  │  │ & Mailto Link  │   │
│  └───────────────────────┘  └───────────────────────┘  └────────────────┘   │
│                                 ▲                                           │
│                                 │ ContentContext (React Context)            │
│                     ┌───────────┴───────────┐                               │
│                     │ LocalStorage Fallback │                               │
│                     └───────────────────────┘                               │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ HTTPS Requests (/api/*)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                        EDGE / BACKEND API LAYER                             │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Security & Boundary Middleware                                        │  │
│  │ - Rate Limiting & Abuse Prevention                                    │  │
│  │ - CORS & Security Headers                                             │  │
│  │ - Zod Request Validation                                              │  │
│  │ - Request ID & Correlation Tracking                                   │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
│                                     │                                       │
│          ┌──────────────────────────┼──────────────────────────┐            │
│          ▼                          ▼                          ▼            │
│   GET /api/health           POST /api/inquiries         GET/PUT /api/content│
│   (Liveness / Uptime)       (Lead Booking Capture)      (CMS Content Sync)  │
│                                     │                          │            │
│                                     ▼                          ▼            │
│                              Email Dispatch             Persistence Adapter │
│                              (Resend/SES)               (Edge KV / Memory)  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Core Operational Workflows

### 2.1 Workflow 1: Public Portfolio Browsing
1. Visitor loads URL via Global CDN.
2. `index.html` delivers preconnected fonts and initial DOM.
3. React renders `App.tsx` with `ContentProvider`. Content is loaded synchronously from `src/data.ts` (instant sub-100ms first paint).
4. Full-bleed model background remains pinned at `fixed inset-0 z-0` while user navigates via Full Scroll or Page View modes.
5. Media assets (photographs/video) stream on-demand with `preload="metadata"` and lazy loading.

### 2.2 Workflow 2: Commission & Booking Inquiry Submission
1. Client fills out inquiry form on `#contact` section (dates, shoot type, location, budget).
2. Frontend runs client-side preliminary validation.
3. `POST /api/inquiries` receives payload with client IP and user-agent context.
4. Backend middleware validates Zod schema and enforces rate limits (max 5 requests per 15 min per IP).
5. Sanitized data triggers email dispatch to model and agency management.
6. Server returns standard `{ success: true, data: { inquiryId, status: "received" } }`.

### 2.3 Workflow 3: Live Content Customization
1. Model/Manager presses `Ctrl+E` or clicks "✦ Edit" dock button.
2. `ContentEditorModal.tsx` opens with active configuration.
3. Edits preview in real time via React state.
4. Saving persists changes to `localStorage` (and optionally syncs to `PUT /api/content` with admin token).
