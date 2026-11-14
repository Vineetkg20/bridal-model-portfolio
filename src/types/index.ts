export interface MediaItem {
  src: string;
  alt: string;
  focalPoint?: string; // e.g. 'center top', 'center 20%'
  fallback?: string;
  aspectRatio?: 'portrait' | 'landscape' | 'tall' | 'square';
}

export interface VideoMediaItem {
  title: string;
  description?: string;
  src: string;
  poster: string;
  isFeatured?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  playsInline?: boolean;
}

export interface AvailabilityInfo {
  isAvailable: boolean;
  statusText: string;
  regions?: string[];
}

export interface ModelMeasurementItem {
  label: string;
  value: string;
}

export interface ModelMeasurements {
  height?: string;
  bust?: string;
  waist?: string;
  hips?: string;
  shoes?: string;
  eyes?: string;
  hair?: string;
  location?: string;
  custom?: ModelMeasurementItem[];
}

export interface StatisticHighlight {
  id: string;
  number: string;
  label: string;
  description: string;
  isNumeric: boolean;
  isHidden?: boolean;
}

export interface PortfolioItemCredits {
  designer?: string;
  photographer?: string;
  makeupArtist?: string;
  stylist?: string;
  brand?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  collection: string;
  primaryImage: string;
  imageAlt?: string;
  secondaryImage?: string;
  videoUrl?: string;
  poster?: string;
  shortDescription: string;
  tags: string[];
  credits: PortfolioItemCredits;
  featuredSeal?: string;
  isEditorialRed?: boolean; // For 3D ring: every 3rd card uses editorial red background
  aspectRatio?: 'portrait' | 'landscape' | 'tall' | 'square';
  focalPoint?: string;
  order?: number;
  isHidden?: boolean;
  externalUrl?: string;
}

export interface JourneyMilestone {
  id: string;
  title: string;
  dateOrPeriod: string;
  brandOrPublication: string;
  description: string;
  image?: string;
  imageAlt?: string;
  credits?: string;
  tag: string;
  isHidden?: boolean;
}

export interface SpecialitySkill {
  id: string;
  name: string;
  category: string;
  tagline: string;
  isHidden?: boolean;
}

export interface SocialLinkItem {
  label: string;
  sub?: string;
  handle?: string;
  url: string;
  isVisible: boolean;
}

export interface SiteNavigationConfig {
  monogram: string;
  brandName: string;
  brandSubtitle: string;
  links: Array<{ id: string; label: string }>;
  ctaButton: {
    label: string;
    href: string;
    isVisible: boolean;
  };
  mobileMenuTitle: string;
  mobileInquiriesLabel: string;
}

export interface HeroConfig {
  watermarkText: string;
  subtitle: string;
  fullName: string;
  tagline: string[];
  specifications: Array<{ label: string; value: string }>;
  availability: AvailabilityInfo;
  primaryMedia: {
    video: VideoMediaItem;
    image: MediaItem;
    badgeLabel: string;
    creditMain: string;
    creditSub: string;
  };
  buttons: {
    toggleVideoPlay: string;
    toggleVideoPause: string;
    toggleMuteOn: string;
    toggleMuteOff: string;
    scrollPrompt: string;
  };
  footerLeft: {
    volume: string;
    categories: string;
  };
}

export interface LookRingConfig {
  badge: string;
  heading: string;
  description: string;
  dragInstruction: string;
  mobileBadge: string;
  flipPrompt: string;
  flipBackPrompt: string;
  inspectButtonLabel: string;
}

export interface PortfolioConfig {
  badge: string;
  heading: string;
  description: string;
  categories: string[];
  inspectHoverLabel: string;
}

export interface AboutConfig {
  watermarkText: string;
  badge: string;
  heading: string;
  intro: string;
  craftBadge: string;
  craftText: string;
  manifestoBadge: string;
  manifestoText: string;
  portrait: MediaItem;
  portraitBadge: string;
  portraitCaption: string;
  measurementsTitle: string;
  measurementsSub: string;
  measurements: ModelMeasurementItem[];
  statisticsBadge: string;
  statistics: StatisticHighlight[];
}

export interface JourneyConfig {
  badge: string;
  heading: string;
  sub: string;
  milestones: JourneyMilestone[];
}

export interface TearSheetItem {
  id: string;
  publication: string;
  issue: string;
  title: string;
  category: string;
  coverImage: string;
  designer: string;
  photographer: string;
  spreadCount?: string;
  quote?: string;
  editorNote?: string;
  tags: string[];
  order: number;
  isHidden?: boolean;
}

export interface PressConfig {
  badge: string;
  heading: string;
  sub: string;
  watermarkText: string;
  categories: string[];
  compCard: {
    title: string;
    subtitle: string;
    badge: string;
    statsSummary: string;
    downloadLabel: string;
    agencyRepresentation: string;
  };
  items: TearSheetItem[];
}

export interface SpecialitiesConfig {
  badge: string;
  heading: string;
  sub: string;
  categories: string[];
  skills: SpecialitySkill[];
}

export interface ContactConfig {
  watermarkText: string;
  badge: string;
  destinationsText: string;
  headlineMain: string;
  headlineAction: string;
  inquiriesLabel: string;
  email: string;
  bookingNotice: string;
  channelsLabel: string;
  social: {
    instagram: SocialLinkItem;
    lookbook: SocialLinkItem;
    agency?: SocialLinkItem;
  };
  footer: {
    copyrightText: string;
    tagline: string;
    backToTopLabel: string;
  };
}

export interface WebsiteContentConfig {
  navigation: SiteNavigationConfig;
  hero: HeroConfig;
  lookRing: LookRingConfig;
  portfolio: PortfolioConfig;
  portfolioItems: PortfolioItem[];
  about: AboutConfig;
  journey: JourneyConfig;
  press: PressConfig;
  specialities?: SpecialitiesConfig;
  contact: ContactConfig;
}
