import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HelpCenterClient from './components/HelpCenterClient';

export const metadata = {
  title: 'Help Center — ThreadHaus',
  description: 'Find answers to common questions about orders, shipping, returns, sizing, and more.',
};

export default function HelpCenterPage() {
  return (
    <>
      <Header />
      <main className="pt-20 md:pt-24 min-h-screen">
        <HelpCenterClient />
      </main>
      <Footer />
    </>
  );
}
