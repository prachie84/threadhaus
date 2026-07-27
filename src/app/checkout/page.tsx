import React, { Suspense } from 'react';
import CheckoutClient from './components/CheckoutClient';

export const metadata = {
  title: 'Checkout — ThreadHaus',
  description: 'Enter your delivery details and complete your purchase.',
};

function CheckoutFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground text-sm">Loading checkout…</p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutClient />
    </Suspense>
  );
}
