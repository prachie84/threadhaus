'use client';
import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-10 animate-in">
            <span className="label-tag text-accent mb-3 block">Support</span>
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">Contact Us</h1>
            <p className="text-muted-foreground text-lg">We&apos;re here to help. Reach out and we&apos;ll respond within 24 hours.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10 animate-in-delay-1">
            {[
              { icon: 'EnvelopeIcon', title: 'Email', value: 'hello@threadhaus.com', sub: 'Response within 24h' },
              { icon: 'PhoneIcon', title: 'Phone', value: '+1 (800) 555-0192', sub: 'Mon–Fri, 9am–6pm EST' },
              { icon: 'MapPinIcon', title: 'Address', value: '142 Fashion Ave', sub: 'New York, NY 10018' }
            ].map((item) => (
              <div key={item.title} className="bg-card border border-border rounded-2xl p-5 card-hover">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center mb-3">
                  <Icon name={item.icon as any} size={20} className="text-accent" />
                </div>
                <h3 className="font-bold text-foreground text-sm mb-1">{item.title}</h3>
                <p className="text-sm text-foreground font-medium">{item.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="bg-card border border-border rounded-3xl p-8 animate-in-delay-2">
            <h2 className="text-xl font-bold text-foreground mb-6">Send a Message</h2>
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Icon name="CheckCircleIcon" size={28} className="text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">We&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
                    <input type="text" placeholder="Sarah" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
                    <input type="text" placeholder="Mitchell" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
                  <input type="email" placeholder="sarah@example.com" className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
                  <select className="input-field">
                    <option>Order Issue</option>
                    <option>Return / Exchange</option>
                    <option>Product Question</option>
                    <option>Account Help</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    placeholder="Tell us how we can help..."
                    className="input-field resize-none" />
                </div>
                <button type="submit" className="btn-accent w-full justify-center">
                  Send Message
                  <Icon name="PaperAirplaneIcon" size={16} />
                </button>
              </form>
            )}
          </div>

          <div className="mt-8 text-center animate-in-delay-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-accent transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
