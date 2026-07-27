import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="mb-10 animate-in">
            <span className="label-tag text-accent mb-3 block">Legal</span>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: July 27, 2026</p>
          </div>

          <div className="bg-card border border-border rounded-3xl p-8 space-y-8 animate-in-delay-1">
            {[
              {
                title: '1. Information We Collect',
                content: 'We collect information you provide directly, such as name, email address, shipping address, and payment information when you create an account or make a purchase. We also collect usage data and device information automatically.'
              },
              {
                title: '2. How We Use Your Information',
                content: 'We use your information to process orders, send order confirmations and shipping updates, provide customer support, personalize your shopping experience, and send marketing communications (with your consent).'
              },
              {
                title: '3. Information Sharing',
                content: 'We do not sell your personal information. We share data only with trusted service providers who assist in operating our website, conducting business, or servicing you, subject to confidentiality agreements.'
              },
              {
                title: '4. Cookies',
                content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our visitors are coming from. You can control cookie settings through your browser.'
              },
              {
                title: '5. Data Security',
                content: 'We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information from unauthorized access.'
              },
              {
                title: '6. Your Rights',
                content: 'You have the right to access, correct, or delete your personal data. You may also opt out of marketing communications at any time. Contact us at privacy@threadhaus.com to exercise these rights.'
              },
              {
                title: '7. Data Retention',
                content: 'We retain your personal information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law.'
              },
              {
                title: '8. Contact Us',
                content: 'For privacy-related questions or concerns, contact our Privacy Team at privacy@threadhaus.com or write to us at 142 Fashion Ave, New York, NY 10018.'
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
            <Link href="/terms" className="text-sm text-accent hover:underline">Terms of Service →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
