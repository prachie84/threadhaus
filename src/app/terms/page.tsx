import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10 animate-in">
            <span className="label-tag text-accent mb-3 block">Legal</span>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: July 27, 2026</p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 space-y-8 animate-in-delay-1">
            {[
              {
                title: '1. Acceptance of Terms',
                content: 'By accessing and using ThreadHaus, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.'
              },
              {
                title: '2. Use of Service',
                content: 'ThreadHaus grants you a limited, non-exclusive, non-transferable license to access and use our platform for personal, non-commercial purposes. You agree not to reproduce, duplicate, copy, sell, or exploit any portion of the service without express written permission.'
              },
              {
                title: '3. Account Responsibility',
                content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Notify us immediately of any unauthorized use of your account.'
              },
              {
                title: '4. Orders & Payments',
                content: 'All orders are subject to availability and confirmation. We reserve the right to refuse or cancel any order. Prices are subject to change without notice. Payment must be received prior to order fulfillment.'
              },
              {
                title: '5. Returns & Refunds',
                content: 'We offer a 30-day return policy on all unworn, unwashed items with original tags attached. Refunds are processed within 5–10 business days of receiving the returned item. Shipping costs are non-refundable.'
              },
              {
                title: '6. Intellectual Property',
                content: 'All content on ThreadHaus, including text, graphics, logos, and images, is the property of ThreadHaus and protected by applicable intellectual property laws.'
              },
              {
                title: '7. Limitation of Liability',
                content: 'ThreadHaus shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.'
              },
              {
                title: '8. Contact',
                content: 'For questions about these Terms, contact us at legal@threadhaus.com or visit our Contact page.'
              }
            ]?.map((section) => (
              <div key={section?.title}>
                <h2 className="text-lg font-bold text-foreground mb-3">{section?.title}</h2>
                <p className="text-muted-foreground leading-relaxed">{section?.content}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center justify-between animate-in-delay-2">
            <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">← Back to Home</Link>
            <Link href="/privacy" className="text-sm text-accent hover:underline">Privacy Policy →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
