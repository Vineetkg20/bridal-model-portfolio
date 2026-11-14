import {
  WebsiteContentConfig,
  PortfolioItem,
  StatisticHighlight,
  JourneyMilestone,
  SpecialitySkill,
  TearSheetItem,
  PressConfig
} from './types';

/**
 * ============================================================================
 * ✦ CENTRALIZED BRIDAL MODEL CONTENT & MEDIA CONFIGURATION
 * ============================================================================
 * 
 * QUICK EDITING INSTRUCTIONS:
 * ----------------------------------------------------------------------------
 * 1. EDIT ANY TEXT / HEADINGS:
 *    Change the string values inside `WEBSITE_CONTENT` below.
 * 
 * 2. REPLACE A PHOTOGRAPH:
 *    Add your JPG/PNG file to the appropriate folder in `public/media/photos/`:
 *      - Hero:        `public/media/photos/hero/`
 *      - Bridal:      `public/media/photos/bridal/`
 *      - Editorial:   `public/media/photos/editorial/`
 *      - Beauty:      `public/media/photos/beauty/`
 *      - Fashion:     `public/media/photos/fashion/`
 *      - Portraits:   `public/media/photos/portraits/`
 *    Then update the `src` path below (e.g. `"/media/photos/hero/my-photo.jpg"`).
 * 
 * 3. REPLACE A VIDEO:
 *    Add your MP4 file to `public/media/videos/` (e.g. `bridal-film-01.mp4`),
 *    then update the `src` path in `hero.primaryMedia.video.src`.
 * 
 * 4. ADD / HIDE A PORTFOLIO LOOK:
 *    - To add: Copy an item in `portfolioItems` array and update its details.
 *    - To hide temporarily: Add `isHidden: true` to the item.
 *    - To reorder: Move the item up or down in the `portfolioItems` array.
 * 
 * ============================================================================
 */

export const WEBSITE_CONTENT: WebsiteContentConfig = {
  // --------------------------------------------------------------------------
  // NAVIGATION CONFIGURATION
  // --------------------------------------------------------------------------
  navigation: {
    monogram: 'MS',
    brandName: 'MEHAK SHARMA',
    brandSubtitle: 'Bridal Editorial',
    links: [
      { id: 'hero', label: 'Home' },
      { id: 'looks', label: 'Look Grid' },
      { id: 'portfolio', label: 'Portfolio' },
      { id: 'about', label: 'About' },
      { id: 'journey', label: 'Experience' },
      { id: 'press', label: 'Press & Covers' },
      { id: 'contact', label: 'Contact' }
    ],
    ctaButton: {
      label: 'Book Shoot ↗',
      href: '#contact',
      isVisible: true
    },
    mobileMenuTitle: 'Portfolio Navigation',
    mobileInquiriesLabel: 'Direct Inquiries:'
  },

  // --------------------------------------------------------------------------
  // HERO SECTION CONFIGURATION
  // --------------------------------------------------------------------------
  hero: {
    watermarkText: '',
    subtitle: 'LUXURY BRIDAL & COUTURE PORTFOLIO',
    fullName: 'MEHAK SHARMA',
    tagline: [
      'BRINGING ROYAL INDIAN COUTURE TO LIFE WITH GRACE, POISE, AND EFFORTLESS SERENITY.',
      'CELEBRATING TIMELESS HANDCRAFTED EMBROIDERY, RICH SILKS, AND HERITAGE BRIDAL BEAUTY.',
      'CREATING MEMORABLE EDITORIAL VISUALS FOR PREMIER DESIGNERS, CAMPAIGNS, AND RUNWAYS.'
    ],
    specifications: [
      { label: 'Height', value: "5'9\" / 175 cm" },
      { label: 'Hair', value: 'Chestnut Brown · Soft Waves' },
      { label: 'Location', value: 'Mumbai · New Delhi · Worldwide' }
    ],
    availability: {
      isAvailable: true,
      statusText: 'Couture Editorial & Global Bookings 2026/2027',
      regions: ['India', 'Dubai & UAE', 'London', 'Worldwide Destination Shoots']
    },
    primaryMedia: {
      video: {
        title: 'The Royal Azure Bridal Film',
        description: 'Cinematic bridal movement study showcasing golden zardozi embroidery and diamond jewelry.',
        // Replace with your MP4 video file in public/media/videos/
        src: '/media/videos/bridal-film-01.mp4',
        poster: '/media/photos/hero/hero-bridal-portrait.jpg',
        isFeatured: true,
        autoPlay: true,
        loop: true,
        muted: true,
        controls: false,
        playsInline: true
      },
      image: {
        // Replace with your photo file in public/media/photos/hero/
        src: '/media/photos/hero/hero-bridal-portrait.jpg',
        alt: 'Mehak Sharma wearing Royal Azure Bridal Lehenga with Golden Embroidery',
        focalPoint: 'center top'
      },
      badgeLabel: 'Live Bridal Motion Film · 4K Cinema',
      creditMain: 'ROYAL SAPPHIRE LEHENGA · GOLDEN HANDWORK',
      creditSub: 'HERITAGE PALACE CAMPAIGN'
    },
    buttons: {
      toggleVideoPlay: '▶ Play Cinematic Reel',
      toggleVideoPause: '⏸ Pause Reel',
      toggleMuteOn: '🔊 Audio On',
      toggleMuteOff: '🔇 Audio Off',
      scrollPrompt: 'EXPLORE BRIDAL LOOKS'
    },
    footerLeft: {
      volume: 'Volume I / 2026',
      categories: 'Couture · Traditional · Contemporary'
    }
  },

  // --------------------------------------------------------------------------
  // 3D CYLINDRICAL LOOK RING CONFIGURATION
  // --------------------------------------------------------------------------
  lookRing: {
    badge: 'Interactive 3D Lookbook',
    heading: 'BRIDAL LOOK RING',
    description: 'Drag horizontally to rotate the 3D gallery. Click any card to inspect full details and credits.',
    dragInstruction: 'DRAG HORIZONTALLY TO ROTATE ↔',
    mobileBadge: 'Touch-Friendly Bridal Gallery',
    flipPrompt: 'Click to Flip ↺',
    flipBackPrompt: 'Flip Back ↺',
    inspectButtonLabel: 'View Full Screen ↗'
  },

  // --------------------------------------------------------------------------
  // PORTFOLIO ARCHIVE GALLERY CONFIGURATION
  // --------------------------------------------------------------------------
  portfolio: {
    badge: 'Curated Fashion Archive',
    heading: 'PORTFOLIO ARCHIVE',
    description: 'A handpicked gallery of bespoke bridal lehengas, fine jewelry features, and runway highlights.',
    categories: [
      'All',
      'Bridal Portraits',
      'Full-Length Bridal Looks',
      'Wedding Editorials',
      'Couture & Designer Wear',
      'Beauty and Makeup',
      'Fashion Campaigns'
    ],
    inspectHoverLabel: 'Inspect Look ↗'
  },

  // --------------------------------------------------------------------------
  // PORTFOLIO ITEMS (Used in both 3D Ring and Gallery Grid)
  // --------------------------------------------------------------------------
  portfolioItems: [
    {
      id: 'look-1',
      title: 'THE ROYAL AZURE REIGN',
      category: 'Bridal Portraits',
      collection: 'Haute Couture Bridal 2026',
      // Photos can be local paths (e.g. /media/photos/bridal/...) or URLs
      primaryImage: '/media/photos/bridal/azure-lehenga-01.jpg',
      imageAlt: 'Mehak Sharma in Royal Azure Lehenga with Sculptural Diamond Choker',
      videoUrl: '/media/videos/bridal-film-01.mp4',
      shortDescription: 'A royal sapphire blue velvet lehenga detailed with intricate golden embroidery, styled with a classic diamond choker for a regal palace evening.',
      tags: ['Royal Blue Lehenga', 'Golden Handwork', 'Diamond Choker', 'Palace Editorial'],
      credits: {
        designer: 'Atelier Heritage Couture',
        photographer: 'Studio Tarun Vishwa',
        makeupArtist: 'Mickey Contractor Atelier',
        stylist: 'Anaita Shroff Adajania'
      },
      featuredSeal: 'FEATURED EDITORIAL',
      isEditorialRed: false,
      aspectRatio: 'tall',
      focalPoint: 'center top',
      order: 1,
      isHidden: false
    },
    {
      id: 'look-2',
      title: 'CRIMSON HEIRLOOM SYMPHONY',
      category: 'Couture & Designer Wear',
      collection: 'Heritage Bride Collection',
      primaryImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Deep vermilion raw silk bridal lehenga with uncut polki jewels',
      shortDescription: 'A deep crimson raw silk lehenga with traditional golden border work, paired with handcrafted polki jewelry to honor timeless wedding rituals.',
      tags: ['Crimson Silk', 'Polki Diamonds', 'Heritage Bride', 'Temple Architecture'],
      credits: {
        designer: 'Sabyasachi Heritage Arts',
        photographer: 'Bikramjit Bose',
        makeupArtist: 'Namrata Soni Atelier'
      },
      featuredSeal: 'COVER SELECTION',
      isEditorialRed: false,
      aspectRatio: 'portrait',
      order: 2,
      isHidden: false
    },
    {
      id: 'look-3',
      title: 'CONTEMPORARY IVORY NOCTURNE',
      category: 'Full-Length Bridal Looks',
      collection: 'Destination Nuptials Vol. IV',
      primaryImage: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Pearl ivory trail lehenga with champagne organza veil',
      shortDescription: 'A pearl ivory lehenga with a flowing organza veil, designed for modern destination weddings with clean lines and subtle sparkle.',
      tags: ['Ivory Organza', 'Destination Bride', 'Modern Minimalism', 'Trailing Dupatta'],
      credits: {
        designer: 'Tarun Tahiliani Bridal Couture',
        photographer: 'Errikos Andreou',
        stylist: 'Vogue Wedding Bureau'
      },
      featuredSeal: 'HAUTE COUTURE',
      isEditorialRed: true, // 3rd card uses editorial red background in 3D Ring
      aspectRatio: 'portrait',
      order: 3,
      isHidden: false
    },
    {
      id: 'look-4',
      title: 'THE MAHLAQA JEWELRY EDITORIAL',
      category: 'Beauty and Makeup',
      collection: 'High Jewellery Suite 2026',
      primaryImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Macro beauty study highlighting emerald beads and bridal choker',
      shortDescription: 'A close-up bridal beauty study highlighting glowing natural skin, layered emerald beads, and an uncut diamond choker.',
      tags: ['Emerald Choker', 'Bridal Glam', 'Dewy Complexion', 'Fine Jewelry'],
      credits: {
        designer: 'Hazoorilal Legacy Fine Jewellery',
        photographer: 'Signe Vilstrup',
        makeupArtist: 'Elton Fernandez'
      },
      featuredSeal: 'BEAUTY FOCUS',
      isEditorialRed: false,
      aspectRatio: 'square',
      order: 4,
      isHidden: false
    },
    {
      id: 'look-5',
      title: 'GILDED SUNSET AT THE PALACE',
      category: 'Wedding Editorials',
      collection: 'Fortress Weddings India',
      primaryImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Warm golden hour bridal portrait against heritage sandstone arches',
      shortDescription: 'A warm golden-hour bridal portrait set against historic sandstone arches with a sweeping, dramatic veil drape.',
      tags: ['Golden Hour', 'Sandstone Palace', 'Dramatic Veil', 'Sunset Silhouette'],
      credits: {
        designer: 'Rimple & Harpreet Narula',
        photographer: 'Joseph Radhik Studio'
      },
      featuredSeal: 'EDITORIAL CAMPAIGN',
      isEditorialRed: false,
      aspectRatio: 'landscape',
      order: 5,
      isHidden: false
    },
    {
      id: 'look-6',
      title: 'THE VELVET REGALIA',
      category: 'Fashion Campaigns',
      collection: 'Winter Bridal Gala',
      primaryImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
      imageAlt: 'Midnight maroon micro-velvet bridal ensemble with copper dabka',
      shortDescription: 'A rich winter bridal look in deep maroon velvet with handcrafted antique borders and fine emerald touches.',
      tags: ['Velvet Lehenga', 'Winter Bride', 'Antique Dabka', 'Midnight Maroon'],
      credits: {
        designer: 'Raw Mango Atelier',
        photographer: 'Rohan Shrestha Studio',
        stylist: "Harper's Bazaar Atelier"
      },
      featuredSeal: 'GALA SHOWCASE',
      isEditorialRed: true, // 6th card uses editorial red background in 3D Ring
      aspectRatio: 'portrait',
      order: 6,
      isHidden: false
    }
  ],

  // --------------------------------------------------------------------------
  // ABOUT SECTION CONFIGURATION
  // --------------------------------------------------------------------------
  about: {
    watermarkText: '',
    badge: 'The Person Behind The Portfolio',
    heading: 'HONORING THE SOUL OF BRIDAL COUTURE',
    intro:
      'I believe bridal fashion is about bringing dreams to life. Every bridal outfit carries the emotion of a special celebration, the artistry of skilled weavers, and the magic of family traditions. My focus on set is to carry heavy couture with calm poise, gentle warmth, and a refined presence that lets the beauty of every design shine effortlessly before the lens.',
    craftBadge: 'THE BRIDAL CRAFT & SILHOUETTE',
    craftText:
      'Wearing heavy bridal couture requires patience, balance, and quiet strength. Moving naturally in 15 to 20 kilograms of rich silk and delicate embroidery while keeping a serene smile and elegant posture is a craft I have refined over years of dedicated work.',
    manifestoBadge: 'PERSONAL MANIFESTO',
    manifestoText:
      'Great bridal modeling is more than standing still. It is about understanding how the fabric flows when you turn, how jewelry catches the golden light, and how a genuine expression turns an outfit into an unforgettable story.',
    portrait: {
      src: '/media/photos/portraits/bridal-portrait-01.jpg',
      alt: 'Mehak Sharma editorial study in bridal lehenga and fine jewelry',
      focalPoint: 'center top'
    },
    portraitBadge: 'EDITORIAL PORTRAIT · GRACE & PRESENCE',
    portraitCaption:
      'Balanced posture, relaxed elegance, and expressive warmth in every frame.',
    measurementsTitle: 'MODEL MEASUREMENTS & SPECIFICATIONS',
    measurementsSub: 'Official Casting Details',
    measurements: [
      { label: 'Height', value: "5'9\" / 175 cm" },
      { label: 'Bust / Waist / Hips', value: '34B · 26" · 36"' },
      { label: 'Shoe', value: '39 EU / 8.5 US' },
      { label: 'Eyes', value: 'Hazel Brown' },
      { label: 'Hair', value: 'Rich Chestnut / Soft Waves' },
      { label: 'Base Location', value: 'Mumbai & New Delhi (Available for Travel)' }
    ],
    statisticsBadge: 'VERIFIED ACHIEVEMENTS & RECORD',
    statistics: [
      {
        id: 'stat-shoots',
        number: '85+',
        label: 'COUTURE & BRIDAL CAMPAIGNS',
        description: 'Lead bridal editorial features across luxury designer collections and high-jewelry houses.',
        isNumeric: true,
        isHidden: false
      },
      {
        id: 'stat-collaborations',
        number: '40+',
        label: 'DESIGNER & ATELIER COLLABORATIONS',
        description: 'Partnering with premier bridal couturiers, makeup artisans, and master jewelers.',
        isNumeric: true,
        isHidden: false
      },
      {
        id: 'stat-experience',
        number: '6+',
        label: 'YEARS ON CAMERA & RUNWAY',
        description: 'Professional experience across live couture fashion weeks, photo shoots, and bridal films.',
        isNumeric: true,
        isHidden: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // EXPERIENCE & JOURNEY TIMELINE CONFIGURATION
  // --------------------------------------------------------------------------
  journey: {
    badge: 'Selected Career Milestones',
    heading: 'EXPERIENCE & JOURNEY',
    sub: 'Key Highlights & Fashion Features · 2024–2026',
    milestones: [
      {
        id: 'milestone-1',
        title: 'Lead Model for The Royal Azure Campaign',
        dateOrPeriod: 'Autumn / Winter 2026',
        brandOrPublication: 'Heritage Bridal Atelier',
        description: 'Chosen as the primary face for the royal blue winter bridal campaign, highlighting traditional embroidery and palatial heritage architecture.',
        image: '/media/photos/bridal/azure-lehenga-01.jpg',
        imageAlt: 'Royal Azure bridal campaign still',
        credits: 'Directed and photographed by Editorial Productions',
        tag: 'Flagship Campaign',
        isHidden: false
      },
      {
        id: 'milestone-2',
        title: 'The Grand Heritage Jewelry Showcase',
        dateOrPeriod: 'Spring 2026',
        brandOrPublication: 'Lumière High Jewellery',
        description: 'Modeled 14 signature bridal jewelry sets—from uncut polki chokers to layered emerald necklaces—featured across national magazines and outdoor billboards.',
        image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=85',
        imageAlt: 'High jewelry showcase feature',
        credits: 'Featured across luxury bridal publications',
        tag: 'Jewelry Campaign',
        isHidden: false
      },
      {
        id: 'milestone-3',
        title: 'Runway Opener: Couture Bridal Week',
        dateOrPeriod: 'Winter 2025',
        brandOrPublication: 'National Couture Conclave',
        description: 'Selected to open the grand finale bridal show wearing a 22kg bespoke silk lehenga, praised for smooth walking pace, balanced veil control, and confidence.',
        image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85',
        imageAlt: 'Couture Bridal Week runway opener',
        credits: 'Choreographed for National Couture Fashion Week',
        tag: 'Couture Runway',
        isHidden: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // EDITORIAL PRESS & TEAR SHEETS CONFIGURATION
  // --------------------------------------------------------------------------
  press: {
    badge: 'EDITORIAL TEAR SHEETS & PRESS',
    heading: 'COVERS & PUBLICATIONS',
    sub: 'Cover stories, magazine spreads, and published features across leading fashion publications.',
    watermarkText: '',
    categories: ['All', 'Vogue', "Harper's Bazaar", 'Elle', "L'Officiel", 'International'],
    compCard: {
      title: 'MEHAK SHARMA · DIGITAL COMP CARD',
      subtitle: 'Official Model Comp Card & Press Kit for Casting Directors & Fashion Houses',
      badge: 'VERIFIED CASTING SPECIFICATIONS',
      statsSummary: "Height 5'9\" (175cm) · Bust 34B · Waist 26\" · Hips 36\" · Shoes 39 EU · Eyes Hazel Brown · Hair Chestnut Brown",
      downloadLabel: 'Download Official Press Kit (PDF)',
      agencyRepresentation: 'Represented Globally by Elite Model Management & Inega Mumbai'
    },
    items: [
      {
        id: 'tear-sheet-1',
        publication: 'VOGUE INDIA',
        issue: 'COUTURE BRIDAL SPECIAL · AUTUMN 2025',
        title: 'The Sovereign Bride: Royal Heritage Reimagined',
        category: 'Vogue',
        coverImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
        designer: 'Sabyasachi Mukherjee',
        photographer: 'Tarun Vishwa',
        spreadCount: '12-Page Cover Story',
        quote: 'Mehak brings a calm, regal stillness that lets the beauty of heavy bridal heirlooms shine through.',
        editorNote: 'Cover story photographed in Jodhpur featuring handcrafted heritage royal bridal wear.',
        tags: ['Vogue Cover', 'Royal Velvet', 'Sabyasachi', 'High Jewellery'],
        order: 1,
        isHidden: false
      },
      {
        id: 'tear-sheet-2',
        publication: "HARPER'S BAZAAR BRIDE",
        issue: 'VOLUME IX · THE VELVET NOCTURNE',
        title: 'Midnight Romance: The Velvet Collection',
        category: "Harper's Bazaar",
        coverImage: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1200&q=85',
        designer: 'Manish Malhotra Couture',
        photographer: 'Rid Burman',
        spreadCount: '10-Page Feature',
        quote: 'A graceful bridal presence that blends traditional Indian charm with modern editorial glamour.',
        editorNote: 'On-location campaign in Udaipur showcasing unreleased midnight bridal collections.',
        tags: ['Bazaar Cover', 'Manish Malhotra', 'Palace Suite', 'Couture Muse'],
        order: 2,
        isHidden: false
      },
      {
        id: 'tear-sheet-3',
        publication: 'ELLE WEDDINGS',
        issue: 'ANNUAL BRIDAL ISSUE · SPRING/SUMMER 2025',
        title: 'Soft Pastels: Contemporary Bridal Drape',
        category: 'Elle',
        coverImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1200&q=85',
        designer: 'Tarun Tahiliani',
        photographer: 'Bikramjit Bose',
        spreadCount: '8-Page Editorial',
        quote: 'Her poise mirrors the gentle flow of fine organza and delicate pearls.',
        editorNote: 'Feature on lightweight bridal wear and modern festive draping styles.',
        tags: ['Elle Spread', 'Tarun Tahiliani', 'Chikankari', 'Pastel Bridal'],
        order: 3,
        isHidden: false
      },
      {
        id: 'tear-sheet-4',
        publication: "L'OFFICIEL COUTURE",
        issue: 'INTERNATIONAL EDITION · WINTER 2025',
        title: 'Timeless Gold: The Varanasi Brocade Edit',
        category: "L'Officiel",
        coverImage: 'https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=1200&q=85',
        designer: 'Raw Mango',
        photographer: 'Signe Vilstrup',
        spreadCount: '10-Page Editorial',
        quote: "Natural elegance that brings India's finest handwoven silks onto the international stage.",
        editorNote: 'Sunrise editorial on the riverfront ghats celebrating ancient weaving heritage.',
        tags: ["L'Officiel Cover", 'Raw Mango', 'Banarasi Silk', 'Handloom'],
        order: 4,
        isHidden: false
      },
      {
        id: 'tear-sheet-5',
        publication: 'BRIDES INTERNATIONAL',
        issue: 'GLOBAL DESTINATION SPECIAL · 2026',
        title: 'Palace Romance: The Grand Destination Wedding',
        category: 'International',
        coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85',
        designer: 'Rimple & Harpreet Narula',
        photographer: 'Joseph Radhik',
        spreadCount: '14-Page Spread',
        quote: 'A sought-after model for grand destination wedding campaigns across India and Europe.',
        editorNote: 'Luxury destination bridal campaign shot between Rajasthan and Lake Como.',
        tags: ['Brides Cover', 'Destination Bridal', 'Mughal Tapestry', 'Heirloom'],
        order: 5,
        isHidden: false
      },
      {
        id: 'tear-sheet-6',
        publication: 'VOGUE WEDDING BOOK',
        issue: 'ANNUAL HIGH JEWELLERY EDITION',
        title: 'Uncut Diamonds & The Art of Stillness',
        category: 'Vogue',
        coverImage: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=85',
        designer: 'Hazoorilal Legacy & Sabyasachi Fine Jewellery',
        photographer: 'Errikos Andreou',
        spreadCount: '8-Page Close-Up Study',
        quote: 'A striking facial harmony and poised stillness created for the finest bridal jewelry.',
        editorNote: 'Dedicated macro beauty feature focusing on heritage polki chokers and headpieces.',
        tags: ['Vogue Special', 'Polki Jewellery', 'Royal Regalia', 'Macro Beauty'],
        order: 6,
        isHidden: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // MODELLING SPECIALITIES & DISCIPLINES CONFIGURATION
  // --------------------------------------------------------------------------
  specialities: {
    badge: 'Modelling Capabilities & Technique',
    heading: 'EXPERTISE & SPECIALITIES',
    sub: '16 core modeling disciplines curated for premier bridal campaigns and couture houses.',
    categories: [
      'All',
      'Bridal Couture Styling',
      'Posing & Silhouette',
      'Expression & Camera',
      'Campaigns & Direction'
    ],
    skills: [
      {
        id: 'spec-1',
        name: 'BRIDAL MODELLING',
        category: 'Bridal Couture Styling',
        tagline: 'Comfortable and poised wearing heavy, traditional bridal ensembles.',
        isHidden: false
      },
      {
        id: 'spec-2',
        name: 'TRADITIONAL BRIDAL STYLING',
        category: 'Bridal Couture Styling',
        tagline: 'Understanding cultural traditions, draping styles, and bridal rituals.',
        isHidden: false
      },
      {
        id: 'spec-3',
        name: 'CONTEMPORARY BRIDAL FASHION',
        category: 'Bridal Couture Styling',
        tagline: 'Showcasing modern pastel lehengas, reception gowns, and cocktail wear.',
        isHidden: false
      },
      {
        id: 'spec-4',
        name: 'EDITORIAL MODELLING',
        category: 'Campaigns & Direction',
        tagline: 'Bringing the creative vision of magazine editors and directors to life.',
        isHidden: false
      },
      {
        id: 'spec-5',
        name: 'BEAUTY & MAKEUP PHOTOGRAPHY',
        category: 'Expression & Camera',
        tagline: 'Poised close-up shots that highlight glowing bridal makeup and skincare.',
        isHidden: false
      },
      {
        id: 'spec-6',
        name: 'COUTURE PRESENTATION',
        category: 'Bridal Couture Styling',
        tagline: 'Displaying fine seams, intricate hand embroidery, and luxurious textiles.',
        isHidden: false
      },
      {
        id: 'spec-7',
        name: 'CAMERA POSING',
        category: 'Posing & Silhouette',
        tagline: 'Awareness of angles, studio lighting, and how garments move on camera.',
        isHidden: false
      },
      {
        id: 'spec-8',
        name: 'FACIAL EXPRESSIONS',
        category: 'Expression & Camera',
        tagline: 'Natural transitions between royal composure and genuine, warm bridal smiles.',
        isHidden: false
      },
      {
        id: 'spec-9',
        name: 'BODY LANGUAGE & POISE',
        category: 'Posing & Silhouette',
        tagline: 'Good posture, straight spine, and graceful neck and shoulder lines.',
        isHidden: false
      },
      {
        id: 'spec-10',
        name: 'RUNWAY PRESENTATION',
        category: 'Posing & Silhouette',
        tagline: 'Steady, confident walking pace even with long trains and heavy dupattas.',
        isHidden: false
      },
      {
        id: 'spec-11',
        name: 'WEDDING CAMPAIGNS',
        category: 'Campaigns & Direction',
        tagline: 'Story-driven shoots for luxury destination venues and wedding planners.',
        isHidden: false
      },
      {
        id: 'spec-12',
        name: 'JEWELLERY EDITORIALS',
        category: 'Expression & Camera',
        tagline: 'Calm stillness that lets necklaces, earrings, and rings take center stage.',
        isHidden: false
      },
      {
        id: 'spec-13',
        name: 'FASHION LOOKBOOKS',
        category: 'Campaigns & Direction',
        tagline: 'Efficient and versatile sequence shooting for new seasonal designer collections.',
        isHidden: false
      },
      {
        id: 'spec-14',
        name: 'OUTFIT PRESENTATION',
        category: 'Bridal Couture Styling',
        tagline: 'Smooth handling of long dupattas, multi-layered skirts, and delicate sleeves.',
        isHidden: false
      },
      {
        id: 'spec-15',
        name: 'CREATIVE COLLABORATION',
        category: 'Campaigns & Direction',
        tagline: 'Working closely with photographers, stylists, and makeup artists on set.',
        isHidden: false
      },
      {
        id: 'spec-16',
        name: 'ON-CAMERA CONFIDENCE',
        category: 'Expression & Camera',
        tagline: 'Comfortable during video shoots, behind-the-scenes films, and studio lights.',
        isHidden: false
      }
    ]
  },

  // --------------------------------------------------------------------------
  // CONTACT & BOOKING FINALE CONFIGURATION
  // --------------------------------------------------------------------------
  contact: {
    watermarkText: '',
    badge: 'Booking & Editorial Inquiries',
    destinationsText: 'Worldwide Destination Bookings · 2026/2027',
    headlineMain: "LET'S",
    headlineAction: 'CONNECT',
    inquiriesLabel: 'Direct Casting & Campaign Bookings',
    email: 'bookings@mehaksharma.editorial',
    bookingNotice:
      'Currently booking for Luxury Bridal Campaigns, Couture Runway Shows, and Destination Weddings worldwide.',
    channelsLabel: 'Representation & Booking Channels',
    social: {
      instagram: {
        label: 'Instagram',
        handle: '@mehaksharma.official',
        url: 'https://instagram.com/mehaksharma.official',
        isVisible: true
      },
      lookbook: {
        label: 'Digital Lookbook',
        sub: 'High-Resolution PDF Suite',
        url: '#portfolio',
        isVisible: true
      },
      agency: {
        label: 'Agency Booking',
        sub: 'Elite Couture Representation',
        url: 'https://elite-bridal-models.com',
        isVisible: true
      }
    },
    footer: {
      copyrightText: '© 2026 MEHAK SHARMA. All Rights Reserved.',
      tagline: 'Luxury Bridal & Couture Model Portfolio',
      backToTopLabel: 'Back to top ↑'
    }
  }
};

/**
 * ============================================================================
 * BACKWARD COMPATIBILITY EXPORTS
 * Preserves seamless integration with existing imports across components.
 * ============================================================================
 */
export const MODEL_PROFILE = {
  fullName: WEBSITE_CONTENT.hero.fullName,
  monogram: WEBSITE_CONTENT.navigation.monogram,
  professionalTitle: 'PROFESSIONAL BRIDAL & COUTURE MODEL',
  specialtiesSubtitle: WEBSITE_CONTENT.hero.subtitle,
  tagline: WEBSITE_CONTENT.hero.tagline as [string, string, string],
  location: WEBSITE_CONTENT.hero.specifications.find((s) => s.label === 'Location')?.value || 'Worldwide',
  availability: WEBSITE_CONTENT.hero.availability,
  aboutIntro: WEBSITE_CONTENT.about.intro,
  personalManifesto: WEBSITE_CONTENT.about.manifestoText,
  bridalApproach: WEBSITE_CONTENT.about.craftText,
  heroVideo: WEBSITE_CONTENT.hero.primaryMedia.video.src,
  heroImage: WEBSITE_CONTENT.hero.primaryMedia.image.src,
  secondaryPortrait: WEBSITE_CONTENT.about.portrait.src,
  measurements: {
    height: "5'9\" / 175 cm",
    bust: "34B",
    waist: "26\" / 66 cm",
    hips: "36\" / 91 cm",
    shoes: "39 EU / 8.5 US",
    eyes: "Hazel Brown",
    hair: "Rich Chestnut / Soft Waves"
  }
};

export const MODEL_STATISTICS: StatisticHighlight[] = WEBSITE_CONTENT.about.statistics;
export const PORTFOLIO_ITEMS: PortfolioItem[] = WEBSITE_CONTENT.portfolioItems;
export const JOURNEY_MILESTONES: JourneyMilestone[] = WEBSITE_CONTENT.journey.milestones;
export const EDITORIAL_TEAR_SHEETS: TearSheetItem[] = WEBSITE_CONTENT.press.items;
export const MODELLING_SPECIALITIES: SpecialitySkill[] = WEBSITE_CONTENT.specialities?.skills || [];
export const CONTACT_INFO = {
  headlineMain: WEBSITE_CONTENT.contact.headlineMain,
  headlineAction: WEBSITE_CONTENT.contact.headlineAction,
  email: WEBSITE_CONTENT.contact.email,
  bookingNotice: WEBSITE_CONTENT.contact.bookingNotice,
  location: WEBSITE_CONTENT.hero.specifications.find((s) => s.label === 'Location')?.value || 'Worldwide',
  social: {
    instagram: WEBSITE_CONTENT.contact.social.instagram.url,
    instagramHandle: WEBSITE_CONTENT.contact.social.instagram.handle,
    lookbookUrl: WEBSITE_CONTENT.contact.social.lookbook.url,
    agencyUrl: WEBSITE_CONTENT.contact.social.agency?.url,
    agencyName: WEBSITE_CONTENT.contact.social.agency?.sub
  },
  copyrightYear: 2026
};
