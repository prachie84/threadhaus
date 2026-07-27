import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductsClient from './components/ProductsClient';

export default function ProductsPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <ProductsClient />
      </main>
      <Footer />
    </>
  );
}