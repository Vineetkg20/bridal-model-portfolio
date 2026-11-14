# ✦ CACHING & CDN SPECIFICATION

**Project:** Bridal Model Portfolio Website  
**Target:** Global Edge CDN & Browser Caching  

---

## 1. Asset Caching Strategy

The portfolio utilizes Vite's deterministic content-hashing for JavaScript and CSS bundles, enabling aggressive immutable caching at the edge and in visitors' browsers:

| Asset Type | Pattern / Directory | Recommended `Cache-Control` Header | Freshness Policy |
| :--- | :--- | :--- | :--- |
| **HTML Entry Point** | `index.html` | `public, max-age=0, must-revalidate` | Always validates against CDN for immediate updates on new deployments. |
| **Hashed JS & CSS** | `dist/assets/*.js`, `dist/assets/*.css` | `public, max-age=31536000, immutable` | Cached for 1 year; filename hash automatically changes on any code edit. |
| **Video Reels** | `public/media/videos/*.mp4` | `public, max-age=86400, stale-while-revalidate=604800` | Cached for 24h with background revalidation. Supports HTTP 206 range requests. |
| **High-Res Photos** | `public/media/photos/*` | `public, max-age=604800, stale-while-revalidate=86400` | Cached for 7 days with seamless edge revalidation. |
| **Web Fonts** | Google Fonts (Anton, Plus Jakarta Sans) | Browser CDN Cache (`fonts.gstatic.com`) | Preconnected in `index.html` for sub-50ms font availability. |

---

## 2. Bandwidth & Performance Optimizations

1. **Video Streaming Optimization**:
   - The hero video includes `preload="metadata"`, preventing initial cellular bandwidth waste until the video begins playing.
   - Poster image (`hero-bridal-portrait.jpg`) renders instantly before video buffers.
2. **GPU Acceleration**:
   - 3D Look Ring cards use `transform-style: preserve-3d` and `will-change: transform` to run at native 60fps on modern displays.
3. **Lazy Loading**:
   - Off-screen portfolio gallery images specify `loading="lazy"` to defer downloading until entering viewport.
