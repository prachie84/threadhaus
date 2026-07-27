import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartCheckoutClient from './components/CartCheckoutClient';

export default function CartCheckoutPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <CartCheckoutClient />
      </main>
      <Footer />
    </>
  );
}