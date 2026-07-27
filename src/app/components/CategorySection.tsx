'use client';
import React, { useRef, useEffect } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

const categories = [
  {
    label: 'Women',
    tag: 'New Season',
    href: '/products?category=women',
    image: "https://images.unsplash.com/photo-1575577849039-8baad9e07f71",
    alt: "Bright fashion boutique interior with colorful women's clothing racks, warm afternoon light, airy white walls",
    count: '3,200+ styles',
    colSpan: 'md:col-span-2 md:row-span-2'
  },
  {
    label: 'Men',
    tag: 'Essentials',
    href: '/products?category=men',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ef57a0de-1772090792146.png",
    alt: "Men's minimal wardrobe with neatly folded neutral clothes on wooden shelves, bright clean studio, soft shadows",
    count: '1,800+ styles',
    colSpan: 'md:col-span-1 md:row-span-1'
  },
  {
    label: 'Children',
    tag: 'Playful Picks',
    href: '/products?category=children',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_126488a7f-1769520313061.png",
    alt: 'Colorful children\'s clothing flat lay on a bright white background, pastel tones, cheerful and airy',
    count: '900+ styles',
    colSpan: 'md:col-span-1 md:row-span-1'
  }
];

export default function CategorySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const cards = section.querySelectorAll('.cat-card');
            cards.forEach((card, i) => {
              setTimeout(() => card.classList.add('animate-in'), i * 120);
            });
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer?.observe(section);
    return () => observer?.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="label-tag text-accent mb-2 block">Shop by Category</span>
            <h2 className="section-title text-foreground">
              Find Your<br />
              <span className="text-gradient-dark">Perfect Fit</span>
            </h2>
          </div>
          <Link href="/products" className="btn-outline self-start sm:self-auto">
            View All
            <Icon name="ArrowRightIcon" size={14} />
          </Link>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 md:h-[560px]">
          {categories?.map((cat) => (
            <div
              key={cat?.label}
              className={`cat-card opacity-100 relative rounded-3xl overflow-hidden group product-img-zoom ${cat?.colSpan}`}>
              
              <AppImage
                src={cat?.image}
                alt={cat?.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw" />
              
              {/* Blue scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C2E]/80 via-[#0F1C2E]/20 to-transparent" />

              {/* Tag */}
              <div className="absolute top-4 left-4 z-10">
                <span className="glass-card px-3 py-1 rounded-full label-tag text-foreground">
                  {cat?.tag}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                <div className="flex items-end justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-primary-foreground mb-1">{cat?.label}</h3>
                    <p className="label-tag text-primary-foreground/60">{cat?.count}</p>
                  </div>
                  <Link
                    href={cat?.href}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-white text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    Shop
                    <Icon name="ArrowRightIcon" size={12} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}