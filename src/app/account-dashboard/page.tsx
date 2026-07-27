import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DashboardClient from './components/DashboardClient';

export default function AccountDashboardPage() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen bg-background">
        <DashboardClient />
      </main>
      <Footer />
    </>
  );
}