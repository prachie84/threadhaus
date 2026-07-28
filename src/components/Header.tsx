'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

const navLinks: { label: string; href: string; adminOnly?: boolean }[] = [
  { label: 'Women', href: '/products?category=women' },
  { label: 'Men', href: '/products?category=men' },
  { label: 'Children', href: '/products?category=children' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'My Account', href: '/account-dashboard' },
  { label: 'Help Center', href: '/help-center' },
  { label: 'Admin', href: '/admin', adminOnly: true },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(3);
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const isAdmin = user?.user_metadata?.role === 'admin' || user?.app_metadata?.role === 'admin';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router?.push('/');
      router?.refresh();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const displayName = user?.user_metadata?.full_name
    ? user?.user_metadata?.full_name?.split(' ')?.[0]
    : user?.email?.split('@')?.[0] || '';

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 md:h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <AppLogo size={36} />
            <span className="font-bold text-lg tracking-tight text-foreground">
              ThreadHaus
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks?.filter(link => !link.adminOnly || isAdmin)?.map((link) => (
              <Link
                key={link?.label}
                href={link?.href}
                className={`px-4 py-2 text-sm font-medium transition-colors rounded-full ${
                  link.adminOnly
                    ? 'text-green-400 hover:text-green-300 hover:bg-green-500/10' :'text-muted-foreground hover:text-accent hover:bg-accent/8'
                }`}
              >
                {link?.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/products"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Icon name="MagnifyingGlassIcon" size={20} className="text-foreground" />
            </Link>

            <Link
              href="/order-history"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Order History"
            >
              <Icon name="ClockIcon" size={20} className="text-foreground" />
            </Link>

            <Link
              href="/account-dashboard"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Account"
            >
              <Icon name="UserIcon" size={20} className="text-foreground" />
            </Link>

            <Link
              href="/cart-checkout"
              className="relative flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Cart"
            >
              <Icon name="ShoppingBagIcon" size={20} className="text-foreground" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {!loading && (
              user ? (
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-muted-foreground font-medium">Hi, {displayName}</span>
                  <button
                    onClick={handleSignOut}
                    className="btn-outline text-xs py-2 px-4 hover:bg-green-600 hover:border-green-600 hover:text-white"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  href="/sign-up-login"
                  className="hidden md:inline-flex btn-primary text-xs py-2 px-5 bg-green-600 hover:bg-green-700"
                >
                  Sign In
                </Link>
              )
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(true)}
              className="flex md:hidden items-center justify-center w-9 h-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Open menu"
            >
              <Icon name="Bars3Icon" size={22} className="text-foreground" />
            </button>
          </div>
        </div>
      </header>
      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[60] bg-primary/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 right-0 bottom-0 z-[70] w-72 bg-background border-l border-border flex flex-col transition-transform duration-400 ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b border-border">
          <span className="font-bold text-base text-foreground">Menu</span>
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted transition-colors"
          >
            <Icon name="XMarkIcon" size={20} className="text-foreground" />
          </button>
        </div>

        <nav className="flex-1 p-5 space-y-1 overflow-y-auto">
          {navLinks?.filter(link => !link.adminOnly || isAdmin)?.map((link) => (
            <Link
              key={link?.label}
              href={link?.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                link.adminOnly
                  ? 'text-green-400 hover:bg-green-500/10' :'text-foreground hover:bg-muted hover:text-accent'
              }`}
            >
              {link?.label}
            </Link>
          ))}

          <div className="pt-4 border-t border-border space-y-1 mt-4">
            {user ? (
              <>
                <div className="px-4 py-2">
                  <p className="text-xs text-muted-foreground">Signed in as</p>
                  <p className="text-sm font-semibold text-foreground truncate">{user?.email}</p>
                </div>
                <Link
                  href="/account-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="Squares2X2Icon" size={18} />
                  My Account
                </Link>
                <Link
                  href="/order-history"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="ClockIcon" size={18} />
                  Order History
                </Link>
                <button
                  onClick={() => { setMobileOpen(false); handleSignOut(); }}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors w-full text-left"
                >
                  <Icon name="ArrowRightOnRectangleIcon" size={18} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/sign-up-login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="UserIcon" size={18} />
                  Sign In / Register
                </Link>
                <Link
                  href="/account-dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Icon name="Squares2X2Icon" size={18} />
                  My Account
                </Link>
              </>
            )}
            <Link
              href="/cart-checkout"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              <Icon name="ShoppingBagIcon" size={18} />
              Cart ({cartCount})
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}