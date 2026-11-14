# ✦ BRIDAL MODEL PORTFOLIO — CONTENT & MEDIA CUSTOMIZATION GUIDE

Welcome to your bridal model portfolio! This guide is written so that **anyone can personalize the entire website without advanced coding knowledge**.

You only ever need to edit **one single configuration file** and drop your images/videos into clearly organized media folders.

---

## 📌 The Golden Rule

* **The ONLY file you need to edit for content:**
  ```
  src/data.ts
  ```
* **The media folders where you place your photos and videos:**
  ```
  public/media/photos/
  public/media/videos/
  ```
* **Files you should LEAVE UNTOUCHED:**
  Do not edit files inside `src/components/`, `src/utils/`, or `src/types/` unless you want to redesign components.

---

## 📁 1. Media Directory Organization

All media files are stored inside the `public/` folder:

```
public/
└── media/
    ├── photos/
    │   ├── hero/         ← Main hero photographs (e.g. hero-bridal-portrait.jpg)
    │   ├── bridal/       ← Traditional & contemporary bridal looks
    │   ├── editorial/    ← Magazine & high-fashion editorials
    │   ├── beauty/       ← Close-up beauty, makeup & jewellery focus
    │   ├── fashion/      ← Lookbook and gala designer wear
    │   └── portraits/    ← Model headshots and about section portraits
    └── videos/           ← MP4 cinematic reels (e.g. bridal-film-01.mp4)
```

> **Naming Tip:** Use simple filenames with hyphens and no spaces, e.g. `bridal-look-01.jpg` or `reception-couture.mp4`. If your filename has spaces, rename it or reference it directly.

---

## 📝 2. Practical Step-by-Step Customization Examples

### 1. Change the Model's Name and Headline

Open `src/data.ts`. Look for `WEBSITE_CONTENT.hero.fullName`:

**Before:**
```typescript
fullName: 'MEHAK SHARMA',
```

**After:**
```typescript
fullName: 'PRIYA KAPOOR',
```
*(Also update `navigation.brandName: 'PRIYA KAPOOR'` and `navigation.monogram: 'PK'` in `navigation` right above it!)*

---

### 2. Rewrite the About Section & Manifesto

In `src/data.ts`, scroll down to the `about:` section:

```typescript
about: {
  heading: 'HONORING THE SOUL OF BRIDAL COUTURE',
  intro: 'Write your own personal intro here. Describe your connection with bridal textiles, jewelry, and couture.',
  craftText: 'Describe how you handle heavy lehenga weights, veil control, and poise on set.',
  manifestoText: 'Your personal artistic statement on fashion and visual storytelling.',
  // ...
}
```

---

### 3. Replace the Hero Photograph

1. Copy your new photograph into:
   ```
   public/media/photos/hero/my-hero-photo.jpg
   ```
2. Open `src/data.ts` and update `hero.primaryMedia.image.src`:

```typescript
image: {
  src: '/media/photos/hero/my-hero-photo.jpg',
  alt: 'Priya Kapoor wearing Couture Red Bridal Lehenga',
  focalPoint: 'center top' // Adjust if needed: 'center 20%', 'center center', etc.
}
```

---

### 4. Replace an Existing Bridal Photograph

1. Copy your new image into:
   ```
   public/media/photos/bridal/ruby-lehenga-01.jpg
   ```
2. In `src/data.ts`, locate the item in `portfolioItems` (e.g. `look-2`):

**Before:**
```typescript
primaryImage: 'https://images.unsplash.com/...',
```

**After:**
```typescript
primaryImage: '/media/photos/bridal/ruby-lehenga-01.jpg',
imageAlt: 'Ruby Red Velvet Bridal Lehenga with Heritage Kundan Jewellery',
```

---

### 5. Add a New Portfolio Photograph or Look

To add a completely new look to both the **3D Cylindrical Ring** and the **Portfolio Gallery**, simply append an entry to `portfolioItems` inside `src/data.ts`:

```typescript
{
  id: 'look-7',
  title: 'GOLDEN NOCTURNE GALA',
  category: 'Couture & Designer Wear',
  collection: 'Met Gala Bridal Suite',
  primaryImage: '/media/photos/fashion/golden-gala-01.jpg',
  imageAlt: 'Golden tissue silk bridal lehenga with trailing cape',
  shortDescription: 'Champagne tissue silk ensemble sculpted with micro-pearl embroidery and modern sheer cape.',
  tags: ['Tissue Silk', 'Pearl Handwork', 'Cape Drape', 'Modern Gala'],
  credits: {
    designer: 'Sabyasachi Atelier',
    photographer: 'Vogue Lens Studio',
    makeupArtist: 'Namrata Soni'
  },
  featuredSeal: 'GALA SPECIAL',
  isEditorialRed: false, // Set to true if you want an editorial red card
  aspectRatio: 'portrait',
  order: 7,
  isHidden: false
}
```

---

### 6. Replace the Hero Video with a New MP4

1. Place your new video file inside:
   ```
   public/media/videos/my-new-film.mp4
   ```
   *(Ensure it is standard web-compatible MP4 encoded with H.264 video)*
2. In `src/data.ts`, find `hero.primaryMedia.video`:

```typescript
video: {
  title: 'Couture Bridal Motion Reel 2026',
  src: '/media/videos/my-new-film.mp4',
  poster: '/media/photos/hero/my-hero-photo.jpg',
  autoPlay: true,
  loop: true,
  muted: true,
  controls: false,
  playsInline: true
}
```

---

### 7. Add a Video to a Portfolio Card

If you have a video reel for a specific portfolio look, simply add `videoUrl`:

```typescript
{
  id: 'look-1',
  title: 'THE ROYAL AZURE REIGN',
  primaryImage: '/media/photos/bridal/azure-lehenga-01.jpg',
  videoUrl: '/media/videos/bridal-film-01.mp4', // When opened in Lightbox, plays video!
  // ...
}
```

---

### 8. Change a Video Thumbnail / Poster

Update the `poster` field in `hero.primaryMedia.video.poster`:
```typescript
poster: '/media/photos/hero/custom-video-poster.jpg',
```

---

### 9. Change Contact Details & Social Links

In `src/data.ts`, scroll down to `contact:`:

```typescript
contact: {
  email: 'hello@priyakapoor.com',
  bookingNotice: 'Now accepting bookings for Autumn/Winter 2026 and Destination Weddings.',
  social: {
    instagram: {
      label: 'Instagram',
      handle: '@priyakapoor.model',
      url: 'https://instagram.com/priyakapoor.model',
      isVisible: true
    },
    lookbook: {
      label: 'Digital Lookbook',
      sub: 'Download High-Res PDF (12MB)',
      url: '/media/lookbook-2026.pdf',
      isVisible: true
    },
    agency: {
      label: 'Agency Management',
      sub: 'Inez & Vinoodh Agency',
      url: 'https://modelagency.com',
      isVisible: true // Set to false to hide completely
    }
  }
}
```

---

### 10. Hide a Portfolio Look or Section Temporarily

To hide any portfolio item without deleting its files or rewriting code, set:

```typescript
isHidden: true
```

The website will automatically skip it from both the 3D Ring and Gallery Grid!

---

### 11. Optional Live Content Customizer (In Your Browser!)

You can also test and preview changes interactively directly on the website:
* Click the small **✦ Edit Content** button in the bottom-right corner of the page (or press `Ctrl+E` / `Cmd+E`, or visit `http://localhost:4173/?edit=true`).
* A luxury editing modal opens where you can tweak model name, photos, videos, descriptions, and contact links live!
* Click **"Save & Preview Changes"** to see your edits applied immediately.
* Click **"Copy Configuration JSON"** on the *Export Config* tab to copy the settings into your clipboard!

---

## 💻 3. Running & Previewing Your Changes Locally

Run these simple commands in your terminal:

```bash
# Navigate to the project directory
cd ~/Downloads/bridal-model-portfolio

# Start the local development server (with instant hot-reload on save)
npm run dev
```

Open your browser at `http://localhost:3000` (or the URL shown in your terminal). Whenever you save changes in `src/data.ts`, the browser will automatically refresh!

To build for production:
```bash
npm run build
```
The optimized website will be generated in `dist/`, ready to deploy to Vercel, Netlify, GitHub Pages, or any web host.
