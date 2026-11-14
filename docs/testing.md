# ✦ TESTING STRATEGY & TEST SPECIFICATIONS

**Project:** Bridal Model Portfolio Website  
**Test Runner:** Vitest v1.6.1 + React Testing Library + JSDOM  
**Last Verified:** 2026-10-27 (12/12 suites passed, 53/53 tests passed)  

---

## 1. Testing Philosophy

In accordance with the **Backend Master Guidelines**:
1. **Never claim a test passed unless it actually ran and passed.** Show the command and a truthful result summary.
2. **Never hide a failure.** Do not delete tests, loosen assertions, or silently skip checks.
3. **Fix code, not test expectations.** If a test reveals a bug, keep the regression test and fix the implementation.
4. **Test against realistic contracts.** Test boundary validation, error codes, and edge-cases.

---

## 2. Current Baseline Test Suite (12 Suites, 53 Tests)

| Test Suite | Tests | Scope | Result |
| :--- | :---: | :--- | :---: |
| `src/utils/transitions.test.ts` | 10 | Blade clip-path geometry, 3D cylinder layout, and exit-opacity bounds. | **PASS** |
| `src/data.test.ts` | 5 | Content schema integrity, required attributes, email format. | **PASS** |
| `src/context/ContentContext.test.tsx` | 5 | Content updates, view mode switching, page navigation, localStorage sync. | **PASS** |
| `src/components/Hero.test.tsx` / `App.test.tsx` | 4 | Layout orchestration, floating dock toggle, full scroll & page view. | **PASS** |
| `src/components/PortfolioGallery.test.tsx` | 3 | Morphing dialog triggers, category filtering, accessibility. | **PASS** |
| `src/components/About.test.tsx` | 2 | Verified achievement counters, in-view sliding numbers. | **PASS** |
| `src/components/InViewImagesGrid.test.tsx` | 3 | Staggered in-view image grid, inspection triggers, fallback images. | **PASS** |
| `src/components/ContentEditorModal.test.tsx` | 7 | Field updates, live auto-update, cancel snapshot revert, reset. | **PASS** |
| `src/components/Lightbox.test.tsx` | 4 | Lightbox opening, keyboard navigation (Escape, Left, Right), close. | **PASS** |
| `src/components/Navigation.test.tsx` | 4 | Mobile navigation menu, contrast adaptation, links. | **PASS** |
| `src/components/LookRing3D.test.tsx` | 2 | 3D look ring card rendering and transform math. | **PASS** |
| `src/components/core/animated-number.test.tsx` | 4 | Animated number spring options, boundary values. | **PASS** |

**Total:** 12 passed suites, 53 passed tests.

---

## 3. Backend & API Test Specifications (Planned for Phase 1 & 2)

When API endpoints are implemented, the following test suites will be added:

### Suite 13: Health & Diagnostics (`test/api/health.test.ts`)
- `GET /api/health` returns `200 OK` with JSON `{ status: "ok", timestamp: ... }`.
- Response contains zero leaked server paths or internal credentials.

### Suite 14: Inquiries API (`test/api/inquiries.test.ts`)
- **Valid Submission:** Submitting complete valid bridal inquiry returns `201 Created` with `inquiryId`.
- **Validation Errors:**
  - Invalid email returns `400 Bad Request` with field error code `INVALID_EMAIL`.
  - Empty name or message returns `400 Bad Request`.
  - Past event date returns `400 Bad Request`.
- **Honeypot Protection:** When hidden honeypot field is filled by bot, return `200 OK` simulated success without sending email.
- **Rate Limiting:** 6th request within 15 minutes from the same IP returns `429 Too Many Requests` with `Retry-After` header.

---

## 4. Test Execution Commands

```bash
# Run unit and contract test suite
npm run test

# Run tests in watch mode
npm run test:watch

# Run TypeScript compilation check
npm run typecheck

# Run production build check
npm run build
```
