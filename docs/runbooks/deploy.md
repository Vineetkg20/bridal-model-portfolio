# ✦ DEPLOYMENT RUNBOOK — BRIDAL MODEL PORTFOLIO

This runbook documents step-by-step instructions to deploy the bridal model portfolio to premier static hosting providers (Vercel, Netlify, Cloudflare Pages, GitHub Pages) with automatic HTTPS and global edge CDN caching.

---

## 1. Pre-Deployment Verification Checklist

Before deploying any changes to production, execute the local quality gate:

```bash
# 1. Typecheck TypeScript
npm run typecheck

# 2. Run automated test suite
npm test

# 3. Compile production bundle
npm run build
```

Verify that all 3 commands exit with code 0 and `dist/` is generated.

---

## 2. Deploying to Vercel (Recommended)

Vercel provides automatic edge caching, SSL certificates, and instant preview branches.

### Option A: Using the Vercel Dashboard (Zero CLI)
1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your `bridal-model-portfolio` repository.
4. Framework Preset will automatically detect **Vite**:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Click **"Deploy"**. Your luxury portfolio is live in ~30 seconds with automatic HTTPS.

### Option B: Using the Vercel CLI
```bash
# Install Vercel CLI globally
npm i -g vercel

# Deploy preview
vercel

# Deploy to production
vercel --prod
```

---

## 3. Deploying to Netlify

1. Log in to [Netlify](https://app.netlify.com).
2. Click **"Add new site" → "Import an existing project"**.
3. Select your GitHub repository.
4. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. Click **"Deploy site"**.

---

## 4. Deploying to Cloudflare Pages

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com) and go to **Workers & Pages**.
2. Click **"Create Application" → "Pages" → "Connect to Git"**.
3. Select the repository and select the **Vite** preset:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Click **"Save and Deploy"**.

---

## 5. Custom Domain Configuration (e.g., `mehaksharma.com`)

1. In your hosting provider's project settings, navigate to **Domains**.
2. Add your custom domain (e.g. `mehaksharma.com` and `www.mehaksharma.com`).
3. Add the required DNS records in your domain registrar (GoDaddy, Namecheap, Google Domains):
   - **A Record:** Points to provider's IP (e.g., `76.76.21.21` for Vercel).
   - **CNAME Record:** `www` pointing to `cname.vercel-dns.com`.
4. SSL certificates generate automatically within 5 to 15 minutes.
