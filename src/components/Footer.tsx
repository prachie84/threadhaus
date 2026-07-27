import React from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';

const shopLinks = [
  { label: 'Women', href: '/products?category=women' },
  { label: 'Men', href: '/products?category=men' },
  { label: 'Children', href: '/products?category=children' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
];

const accountLinks = [
  { label: 'My Account', href: '/account-dashboard' },
  { label: 'Order History', href: '/order-history' },
  { label: 'Wishlist', href: '/account-dashboard' },
  { label: 'Sign In', href: '/sign-up-login' },
];

const legalLinks = [
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Cookie Policy', href: '/privacy' },
  { label: 'Help Center', href: '/help-center' },
  { label: 'Contact Us', href: '/contact' },
];

const socials = [
  { icon: 'GlobeAltIcon', label: 'Instagram', href: '#' },
  { icon: 'ChatBubbleLeftIcon', label: 'Twitter', href: '#' },
  { icon: 'LinkIcon', label: 'Pinterest', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-14 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <AppLogo size={30} />
              <span className="font-bold text-base tracking-tight text-foreground">ThreadHaus</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-5">
              Premium clothing for every chapter of life. Curated with care, delivered with confidence.
            </p>
            <div className="flex items-center gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 flex items-center justify-center rounded-full border border-border hover:border-accent hover:bg-accent hover:text-white transition-all">
                  <Icon name={s.icon as any} size={14} className="text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="label-tag text-foreground mb-4">Shop</h4>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="label-tag text-foreground mb-4">Account</h4>
            <ul className="space-y-2.5">
              {accountLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="label-tag text-foreground mb-4">Legal & Support</h4>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground font-mono-label">© 2026 ThreadHaus. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-accent transition-colors">Terms</Link>
            <span className="text-border">·</span>
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-accent transition-colors">Privacy</Link>
            <span className="text-border">·</span>
            <Link href="/contact" className="text-xs text-muted-foreground hover:text-accent transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}