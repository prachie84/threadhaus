import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/app/components/HeroSection';
import CategorySection from '@/app/components/CategorySection';
import FeaturedSection from '@/app/components/FeaturedSection';
import BrandValues from '@/app/components/BrandValues';
import CTABanner from '@/app/components/CTABanner';

export default function Homepage() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedSection />
        <BrandValues />
        <CTABanner />
      </main>
      <Footer />
    </>
  );
}