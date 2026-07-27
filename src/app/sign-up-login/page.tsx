import React, { Suspense } from 'react';
import Header from '@/components/Header';
import AuthClient from './components/AuthClient';

export default function SignUpLoginPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="w-10 h-10 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <AuthClient />
        </Suspense>
      </main>
    </>
  );
}