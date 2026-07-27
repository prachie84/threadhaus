'use client';
import React, { useRef, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const values = [
  {
    icon: 'SparklesIcon',
    title: 'Premium Quality',
    desc: 'Every piece is crafted from responsibly sourced materials that last seasons, not just weeks.',
    span: 'md:col-span-1'
  },
  {
    icon: 'TruckIcon',
    title: 'Free Shipping',
    desc: 'Complimentary delivery on all orders over $75. Fast, tracked, and reliable.',
    span: 'md:col-span-1'
  },
  {
    icon: 'ArrowPathIcon',
    title: 'Easy Returns',
    desc: '30-day hassle-free returns. No questions asked, no restocking fees.',
    span: 'md:col-span-1'
  },
  {
    icon: 'ShieldCheckIcon',
    title: 'Secure Checkout',
    desc: 'Bank-level encryption protects every transaction. Shop with complete confidence.',
    span: 'md:col-span-1'
  }
];

export default function BrandValues() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef?.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = section.querySelectorAll('.value-item');
            items.forEach((item, i) => {
              setTimeout(() => item.classList.add('animate-in'), i * 100);
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
        <div className="text-center mb-12">
          <span className="label-tag text-accent mb-3 block">Why ThreadHaus</span>
          <h2 className="section-title text-foreground">Built on <span className="text-gradient-gold">Trust</span></h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {values.map((v) => (
            <div
              key={v.title}
              className={`value-item opacity-100 bg-card border border-border rounded-2xl p-6 card-hover ${v.span}`}>
              <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                <Icon name={v.icon as any} size={22} className="text-accent" />
              </div>
              <h3 className="font-bold text-foreground text-base mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}