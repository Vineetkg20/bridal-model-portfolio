import React from 'react';
import ScrollExpand from './ScrollExpand';
import ScrollStack, { ScrollStackItem } from './ScrollStack';
import { PortfolioItem } from '../types';

export interface EditorialScrollStackProps {
  onOpenLightbox?: (item: PortfolioItem) => void;
  className?: string;
}

export const EDITORIAL_STACK_ITEMS: Array<{
  id: string;
  badge: string;
  category: string;
  title: string;
  description: string;
  image: string;
  designer: string;
  lens: string;
  tags: string[];
}> = [
  {
    id: 'look-azure',
    badge: 'Sapphire Velvet',
    category: 'Haute Couture Bridal',
    title: 'The Royal Azure Reign',
    description:
      'A royal sapphire blue velvet lehenga detailed with intricate golden embroidery, styled with a classic diamond choker for a regal palace evening.',
    image: '/media/photos/bridal/azure-lehenga-01.jpg',
    designer: 'Atelier Heritage Couture',
    lens: 'Tarun Vishwa Studio',
    tags: ['Royal Blue', 'Golden Handwork', 'Palace Campaign']
  },
  {
    id: 'look-crimson',
    badge: 'Heritage Silk',
    category: 'Cover Selection',
    title: 'Crimson Heirloom Symphony',
    description:
      'A deep crimson raw silk lehenga with traditional golden border work, paired with handcrafted polki jewelry to honor timeless wedding rituals.',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1920&q=90',
    designer: 'Regal Weaves India',
    lens: 'Studio Lumière',
    tags: ['Crimson Silk', 'Polki Diamonds', 'Heritage Bride']
  },
  {
    id: 'look-ivory',
    badge: 'Modern Elegance',
    category: 'Destination Weddings',
    title: 'Contemporary Ivory Nocturne',
    description:
      'A pearl ivory lehenga with a flowing organza veil, designed for modern destination weddings with clean lines and subtle sparkle.',
    image: 'https://images.unsplash.com/photo-1546804784-896d0dca3805?auto=format&fit=crop&w=1920&q=90',
    designer: 'Modern Atelier Bridal',
    lens: 'Candid Vogue',
    tags: ['Ivory Organza', 'Modern Minimalism', 'Trailing Dupatta']
  },
  {
    id: 'look-gold',
    badge: 'Gilded Brocade',
    category: 'Varanasi Heritage',
    title: 'Gilded Chintz Brocade',
    description:
      'An antique gold brocade woven by master artisans, paired with natural green emeralds to capture the warmth of Indian festivities.',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=1920&q=90',
    designer: 'Raw Mango Atelier',
    lens: 'Bikramjit Bose',
    tags: ['Gold Brocade', 'Varanasi Looms', 'Emerald Choker']
  },
  {
    id: 'look-palace',
    badge: 'Palace Regalia',
    category: 'Royal Finale',
    title: 'Palace Regalia Finale',
    description:
      'A magnificent ruby red velvet bridal ensemble with a grand flowing drape, bringing old-world royalty into modern cinematic fashion.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=90',
    designer: 'Rimple & Harpreet',
    lens: 'Joseph Radhik',
    tags: ['Lake Palace Udaipur', 'Mughal Tapestry', 'Ruby Velvet']
  }
];

/**
 * EditorialScrollStack
 * Replaces the entire second page with a scroll-driven sticky pinning card stack.
 * When scrolling past the intro hero page, the section pins and natural vertical
 * scrolling drives cards sliding in from Right to Left, then releases to normal scroll.
 */
export const EditorialScrollStack: React.FC<EditorialScrollStackProps> = ({
  onOpenLightbox,
  className = ''
}) => {
  return (
    <section
      id="looks"
      className={`relative w-full bg-transparent text-[#FAF7F2] select-none touch-pan-y ${className}`}
    >
      {/* Anchor for backward compatibility with 3d-ring references */}
      <div id="3d-ring" className="absolute top-0 pointer-events-none opacity-0" aria-hidden="true" />

      {/* ScrollExpand Animation: Opens up when entering, presents right-to-left cards, and closes back down when finished */}
      <ScrollExpand
        useWindowScroll
        pinHeight="750vh"
        startWidth={44}
        startHeight={58}
        startRadius={24}
        endRadius={0}
        mediaZoom={1.2}
        scrollDistance={1.2}
        holdDistance={0.5}
        smoothing={0.1}
        overlayScrim={0.4}
        enabled
        reverseCollapse={true}
        pExpandRatio={0.10}
        pCollapseRatio={0.90}
        totalCards={EDITORIAL_STACK_ITEMS.length}
      >
        {({ activeCardIndex }) => (
          <ScrollStack
            mode="container"
            controlledIndex={activeCardIndex}
            itemScale={0.05}
            baseScale={0.88}
            dimAmount={0.2}
            itemStackDistance={36}
            direction="right-to-left"
            showControls={false}
            showProgress={false}
            showHeader={false}
          >
            {EDITORIAL_STACK_ITEMS.map((item, idx) => (
              <ScrollStackItem
                key={item.id}
                badge={item.badge}
                image={item.image}
                imageAlt={item.title}
                category={item.category}
                title={item.title}
                description={item.description}
                designer={item.designer}
                lens={item.lens}
                tags={item.tags}
                onInspect={() => {
                  if (onOpenLightbox) {
                    onOpenLightbox({
                      id: item.id,
                      title: item.title,
                      category: item.category,
                      collection: 'Editorial Scroll Stack',
                      primaryImage: item.image,
                      imageAlt: item.title,
                      shortDescription: item.description,
                      tags: item.tags,
                      credits: {
                        designer: item.designer,
                        photographer: item.lens
                      },
                      aspectRatio: 'portrait',
                      order: idx + 1
                    });
                  }
                }}
              />
            ))}
          </ScrollStack>
        )}
      </ScrollExpand>
    </section>
  );
};

export default EditorialScrollStack;
