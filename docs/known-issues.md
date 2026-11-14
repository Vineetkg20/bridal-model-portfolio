# ✦ KNOWN ISSUES & TRACKING REGISTER

**Project:** Bridal Model Portfolio Website  
**Last Updated:** 2026-10-27 (Phase Zero Audit)  

---

## Active Issues Register

| ID | Category | Severity | Description | Status | Proposed Remediation |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **SEC-001** | Dependencies | **CRITICAL** | Build-time devDependency audit vulnerabilities in `tinypool` (prototype pollution leading to RCE risk in worker options). | **OPEN** | Upgrade Vitest / tinypool in Phase 4. |
| **VCS-001** | Version Control | **HIGH** | No `.git` directory initialized in project root; risk of untracked changes. | **OPEN** | Initialize Git repository and add pre-commit hooks in Phase 4. |
| **ARC-001** | Persistence | **HIGH** | Content customization in `ContentEditorModal` is client-isolated to `localStorage`. | **IN REVIEW** | Add optional authenticated `PUT /api/content` in Phase 3 if global persistence is requested. |
| **API-001** | Lead Capture | **MEDIUM** | Booking inquiries currently rely on native OS `mailto:` client handlers. | **PLANNED** | Implement `POST /api/inquiries` with validation & email forwarding in Phase 2. |
| **CFG-001** | Configuration | **LOW** | Missing `.env.example` template for deployment and environment settings. | **PLANNED** | Create `.env.example` in Phase 1. |
| **ISS-001** | Version Control | **HIGH** | No `.gitignore` or Git repo initialized. | **RESOLVED** | Created comprehensive `.gitignore`. |
| **ISS-002** | Testing | **HIGH** | No test runner (Vitest) or test suites configured. | **RESOLVED** | Configured Vitest & React Testing Library; 53/53 tests pass. |
| **ISS-003** | Reliability | **HIGH** | Absence of top-level React Error Boundary. | **RESOLVED** | Implemented luxury editorial `ErrorBoundary` component. |
| **ISS-005** | Accessibility | **MEDIUM** | Modals (`Lightbox`, `ContentEditorModal`) missing scroll lock. | **RESOLVED** | Added body scroll locking and Escape key navigation hooks. |
| **ISS-006** | Robustness | **MEDIUM** | Missing `onError` image fallback in gallery. | **RESOLVED** | Added inline SVG luxury placeholder fallbacks. |
| **ISS-007** | Performance | **MEDIUM** | Hero video buffering on mobile. | **RESOLVED** | Added `preload="metadata"` and fallback handling. |
