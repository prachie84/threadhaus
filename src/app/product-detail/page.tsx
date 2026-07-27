import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductDetailClient from './components/ProductDetailClient';

export default function ProductDetailPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <ProductDetailClient />
      </main>
      <Footer />
    </>
  );
}