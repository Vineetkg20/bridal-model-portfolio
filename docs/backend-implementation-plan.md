# ✦ BACKEND IMPLEMENTATION PLAN — PHASED ARCHITECTURE

**Project:** Bridal Model Editorial Portfolio (Mehak Sharma)  
**Date:** 2026-10-27  
**Status:** PROPOSED (Awaiting User Approval Before Implementation)  

---

## 1. Architectural Strategy & Recommendation

Based on the Phase Zero audit, this project is a luxury fashion model portfolio. For maximum reliability, lightning-fast edge delivery, and zero unnecessary infrastructure overhead, we recommend:

### **Recommended Architecture: Edge-Enhanced Modular Serverless / Static SPA**
- **Hosting:** Global Edge CDN (Vercel, Cloudflare Pages, or Netlify).
- **Backend Runtime:** Lightweight Serverless API Functions (`/api/inquiries`, `/api/health`, `/api/content`) colocated with the repository.
- **Input Validation:** Zod schema validation at the HTTP boundary.
- **Email Forwarding:** Resend, AWS SES, or Nodemailer for booking inquiries.
- **Persistence (Optional CMS):** Cloudflare KV / Vercel KV / SQLite or Git-backed content persistence for global portfolio updates.
- **Security:** Standardized rate limiting, CORS allowlisting, input sanitization, and structured JSON error responses.

---

## 2. Phased Implementation Roadmap

### Phase 1: Environment & API Foundation (Low Risk)
* **Goal:** Establish configuration management, API contracts, and health observability without touching existing frontend behavior.
* **Tasks:**
  1. Create `.env.example` documenting all configuration keys (ports, API keys, contact email).
  2. Implement standardized JSON error response schema (`{ error: { code, message, details, requestId } }`) in accordance with API conventions.
  3. Implement `/api/health` lightweight endpoint returning status, timestamp, and environment metadata.
  4. Write automated contract tests for `/api/health` and error formatting.
* **Acceptance Criteria:**
  - Health check responds with HTTP 200 and safe metadata.
  - Zero disruption to current client-side portfolio features.
  - `npm run test` and `npm run typecheck` pass 100%.

### Phase 2: Booking & Commission Inquiry API (`POST /api/inquiries`)
* **Goal:** Enable prospective clients, casting directors, and luxury bridal houses to submit structured booking inquiries directly through the site.
* **Tasks:**
  1. Define Zod schema for inquiry submission (`name`, `email`, `phone`, `brandOrDesigner`, `inquiryType`, `eventDate`, `location`, `message`, `honeypot`).
  2. Implement input validation middleware rejecting malformed payloads with descriptive client errors (HTTP 400).
  3. Implement honeypot field and in-memory/edge IP rate-limiting (e.g. 5 submissions per 15 minutes per IP) to prevent spam.
  4. Integrate server-side email dispatch client (Resend/Nodemailer) behind an abstract email service interface.
  5. Add optional inquiry form UI in `#contact` while preserving the fallback `mailto:` link for client choice.
* **Acceptance Criteria:**
  - Valid payloads trigger email delivery simulation / dispatch and return HTTP 201 Created.
  - Missing/invalid fields return HTTP 400 with field-level validation errors.
  - Spam bots triggering the honeypot are silently dropped with simulated success.
  - Unit and integration tests verify validation, rate-limiting, and error handling.

### Phase 3: Global Content Persistence & CMS Sync (Optional Client Feature)
* **Goal:** Enable the model or agency manager to update portfolio content globally without rebuilding and redeploying the static code bundle.
* **Tasks:**
  1. Implement authenticated admin endpoint `PUT /api/content` protected by a secure Bearer token or session cookie.
  2. Implement `GET /api/content` returning current live content with fallback to default `data.ts`.
  3. Connect storage adapter (Cloudflare KV, Redis, or local JSON store with file locking in local development).
  4. Update `ContentContext.tsx` to optionally revalidate from `/api/content` on initial load while maintaining offline `localStorage` fallback.
* **Acceptance Criteria:**
  - Unauthorized updates return HTTP 401/403.
  - Valid updates persist content globally.
  - Corrupt storage fails gracefully back to bundled `src/data.ts`.

### Phase 4: Production Hardening, Audit Fixes & CI Pipeline
* **Goal:** Harden dependencies, configure automated CI testing, and document runbooks.
* **Tasks:**
  1. Resolve build-time npm audit vulnerabilities (`tinypool`, `esbuild`) by updating devDependencies.
  2. Initialize Git repository and add GitHub Actions CI workflow (`.github/workflows/ci.yml`) enforcing typecheck, test, and build gates.
  3. Document runbooks for deployment, rollbacks, and incident response.
* **Acceptance Criteria:**
  - CI pipeline executes automatically and passes all gates.
  - Dependency audit vulnerabilities resolved.
  - Complete documentation updated and verified.

---

## 3. Risk Assessment & Rollback Strategy

| Phase | Identified Risk | Mitigation | Rollback Plan |
| :--- | :--- | :--- | :--- |
| **Phase 1** | Route collision with client-side SPA routing. | Namespace all backend endpoints under `/api/*` and configure Vite dev server proxy. | Remove `/api` proxy from `vite.config.ts`. |
| **Phase 2** | Email provider rate limits or downtime. | Fail safely: log structured error with correlation ID; notify user to use direct email fallback. | Switch form toggle back to `mailto:` button. |
| **Phase 3** | Admin token leakage or unauthorized content edits. | Strong secret tokens in environment variables, constant-time token comparison, rate limiting on auth. | Revert content to bundled `src/data.ts` and revoke token. |

---

## 4. Approval Checkpoints

> [!IMPORTANT]
> In accordance with the **Non-Negotiable Rules**, broad implementation will **not** begin until you approve this plan.
> 
> **Please confirm whether you would like to proceed with:**
> 1. **Phase 1 Only** (API Foundation, Health Check & Error Contracts)
> 2. **Phase 1 + Phase 2** (API Foundation + Booking Inquiry Form API)
> 3. **Keep pure static frontend** (No backend infrastructure, optimize static deployment and fix dependency audit)
