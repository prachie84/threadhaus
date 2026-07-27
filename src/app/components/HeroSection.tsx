'use client';
import React, { useEffect, useRef } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const onScroll = () => {
      const y = window.scrollY;
      const img = hero.querySelector('.hero-parallax') as HTMLElement;
      if (img) img.style.transform = `translateY(${y * 0.25}px)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen overflow-hidden bg-primary"
      aria-label="Hero">
      
      {/* Animated background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 left-1/3 w-64 h-64 rounded-full bg-blue-400/15 blur-2xl" style={{animation: 'float 4s ease-in-out infinite 1s'}} />
      </div>

      {/* Full-bleed image */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="hero-parallax absolute inset-0 scale-110">
          <AppImage
            src="https://img.rocket.new/generatedImages/rocket_gen_img_1965d8338-1772248430965.png"
            alt="Elegant fashion editorial — a woman in a flowing cream coat stands in a sunlit minimalist interior, warm neutral tones, airy atmosphere"
            fill
            priority
            className="object-cover"
            sizes="100vw" />
        </div>
        {/* Blue-tinted scrim */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1C2E]/85 via-[#0F1C2E]/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1C2E]/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between px-6 sm:px-10 lg:px-16 pt-28 pb-12">
        {/* Top label */}
        <div className="animate-in">
          <span className="glass-card px-4 py-1.5 rounded-full label-tag text-muted-foreground inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
            Summer Collection 2026
          </span>
        </div>

        {/* Main content */}
        <div className="max-w-2xl">
          <h1 className="hero-title text-primary-foreground mb-6 animate-in-delay-1">
            Dress the<br />
            <span className="text-gradient-gold">Story</span>
            <br />You Live.
          </h1>

          <p className="text-primary-foreground/70 text-lg max-w-md mb-10 leading-relaxed animate-in-delay-2">
            Curated clothing for men, women, and children. Timeless pieces built for real life.
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-in-delay-3">
            <Link href="/products" className="btn-accent">
              Shop Now
              <Icon name="ArrowRightIcon" size={16} />
            </Link>
            <Link href="/products?sort=newest" className="btn-outline border-white/30 text-primary-foreground hover:bg-accent/20 hover:border-accent">
              New Arrivals
            </Link>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          {/* Stats */}
          <div className="flex items-center gap-8 animate-in-delay-4">
            {[
              { num: '12K+', label: 'Styles' },
              { num: '4.9', label: 'Rating' },
              { num: '180+', label: 'Brands' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-primary-foreground">{stat.num}</div>
                <div className="label-tag text-primary-foreground/50">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Glass card overlay */}
          <div className="glass-card rounded-3xl p-8 max-w-xs w-full animate-in-delay-4">
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="label-tag text-muted-foreground mb-1">Featured Look</p>
                <h3 className="font-bold text-foreground text-lg leading-snug">
                  The Linen<br />Essentials Edit
                </h3>
              </div>
              <Link
                href="/products"
                className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-accent hover:border-accent hover:text-white transition-all">
                <Icon name="ArrowRightIcon" size={16} className="text-foreground" />
              </Link>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex -space-x-2">
                {[
                  'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&q=80',
                  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80',
                  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80'
                ].map((src, i) => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden">
                    <AppImage src={src} alt="Customer" width={32} height={32} className="object-cover w-full h-full" />
                  </div>
                ))}
              </div>
              <span className="label-tag text-muted-foreground">2.4K wearing this</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-px h-8 bg-primary-foreground/30" />
        <Icon name="ChevronDownIcon" size={16} className="text-primary-foreground/40" />
      </div>
    </section>
  );
}