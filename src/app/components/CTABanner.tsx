'use client';
import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

export default function CTABanner() {
  return (
    <section className="py-20 bg-primary overflow-hidden relative">
      {/* Background orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-400/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <span className="label-tag text-accent mb-4 block">Members Only</span>
        <h2 className="hero-title text-primary-foreground mb-6">
          Join the<br />
          <span className="text-gradient-gold">ThreadHaus</span><br />
          Community
        </h2>
        <p className="text-primary-foreground/60 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Get early access to new arrivals, exclusive member pricing, and style guides curated just for you.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/sign-up-login" className="btn-accent">
            Create Account
            <Icon name="ArrowRightIcon" size={16} />
          </Link>
          <Link href="/products" className="btn-outline border-white/20 text-primary-foreground hover:bg-white/10 hover:border-white/40">
            Browse First
          </Link>
        </div>
      </div>
    </section>
  );
}