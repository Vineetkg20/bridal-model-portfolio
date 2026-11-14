# ✦ AGENTS.MD — BRIDAL MODEL PORTFOLIO DEVELOPMENT GUIDELINES

## Product Context
* **Application**: Premium, interactive editorial bridal model portfolio (Mehak Sharma).
* **Architecture**: Client-side Single Page Application built with React 18, TypeScript, Vite, and Tailwind CSS.
* **Core Philosophy**: Editorial luxury aesthetic (pure white, deep editorial red, Anton typography, 3D cylindrical ring, 1080p cinematic video reel, centralized `src/data.ts`).
* **Classification**: Static website / portfolio. Non-SaaS layers (databases, auth, stripe, queues) are marked **NOT APPLICABLE**.

## Key Commands
```bash
# Start local development server
npm run dev

# Run TypeScript typechecking
npm run typecheck

# Run automated unit & integration test suites
npm run test

# Production build
npm run build

# Preview production build locally
npm run preview
```

## Directory Structure
```
bridal-model-portfolio/
├── docs/                      # Architectural audits, plans, testing docs, known issues
├── public/
│   └── media/                 # Organized media folders
│       ├── photos/            # hero/, bridal/, editorial/, beauty/, fashion/, portraits/
│       └── videos/            # MP4 video reels
├── src/
│   ├── components/            # UI components (Navigation, Hero, LookRing3D, Gallery, etc.)
│   ├── utils/                 # Shared math, transitions, 3D cylinder geometry
│   ├── types/                 # Strict TypeScript contracts & interfaces
│   ├── data.ts                # Centralized content & media configuration (WEBSITE_CONTENT)
│   ├── App.tsx                # Layout coordinator & section observer
│   └── index.css              # Custom editorial Anton typography & 3D CSS
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## Non-Negotiable Rules
1. **Never hardcode visible content in components**: All editable text and media references must live in `src/data.ts`.
2. **Preserve working functionality and styling**: Anton typography, 3D transforms, blade transitions, and red/white identity must be retained.
3. **Never fabricate test results**: All reported statuses must be backed by real command execution evidence.
4. **No backend bloat**: Do not add unnecessary databases, authentication, or microservices to a client-side portfolio.
