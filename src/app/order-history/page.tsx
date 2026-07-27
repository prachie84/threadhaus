import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OrderHistoryClient from './components/OrderHistoryClient';

export default function OrderHistoryPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <OrderHistoryClient />
      </main>
      <Footer />
    </>
  );
}
