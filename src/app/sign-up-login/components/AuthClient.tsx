'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'login' | 'signup';

export default function AuthClient() {
  const [tab, setTab] = useState<Tab>('login');
  const [loginForm, setLoginForm] = useState({ email: '', password: '', remember: false });
  const [signupForm, setSignupForm] = useState({ firstName: '', lastName: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const getRedirect = () => {
    const redirect = searchParams.get('redirect');
    return redirect || '/account-dashboard';
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(loginForm.email, loginForm.password);
      router.push(getRedirect());
    } catch (err: any) {
      setError(err?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (signupForm.password !== signupForm.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (signupForm.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(signupForm.email, signupForm.password, {
        fullName: `${signupForm.firstName} ${signupForm.lastName}`.trim(),
      });
      setSuccess('Account created! Signing you in…');
      // Auto sign-in after signup
      await signIn(signupForm.email, signupForm.password);
      router.push(getRedirect());
    } catch (err: any) {
      setError(err?.message || 'Could not create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
      {/* Left: Fashion Image Panel */}
      <div className="hidden lg:block relative overflow-hidden">
        <AppImage
          src="https://img.rocket.new/generatedImages/rocket_gen_img_1a2d833d5-1775934355814.png"
          alt="Fashion editorial interior — dark moody atmosphere with dramatic shadows, deep charcoal walls, low-key studio lighting, women's clothing silhouettes"
          fill
          priority
          className="object-cover"
          sizes="50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12 text-primary-foreground">
          <blockquote className="text-2xl font-bold leading-snug mb-4">
            "Style is a way to say who you are without having to speak."
          </blockquote>
          <p className="label-tag text-primary-foreground/50">Rachel Zoe</p>
        </div>
        <div className="absolute top-8 left-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary-foreground">ThreadHaus</span>
          </Link>
        </div>
      </div>

      {/* Right: Form Panel */}
      <div className="flex items-center justify-center px-6 py-16 pt-28 lg:pt-16">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <span className="text-xl font-bold text-foreground">ThreadHaus</span>
          </Link>

          {/* Tab switcher */}
          <div className="flex bg-secondary rounded-full p-1 mb-8">
            {(['login', 'signup'] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); setSuccess(''); }}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-full transition-all ${
                  tab === t ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}>
                {t === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          {/* Error / Success messages */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
              <Icon name="ExclamationCircleIcon" size={16} className="flex-shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm flex items-center gap-2">
              <Icon name="CheckCircleIcon" size={16} className="flex-shrink-0" />
              {success}
            </div>
          )}

          {tab === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4 animate-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="text-muted-foreground text-sm mt-1">Sign in to your ThreadHaus account</p>
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="sarah@example.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} />
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pr-10"
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={loginForm.remember}
                    onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                    className="accent-accent" />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 disabled:opacity-70">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing In…
                  </>
                ) : (
                  <>
                    Sign In
                    <Icon name="ArrowRightIcon" size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                New to ThreadHaus?{' '}
                <button onClick={() => { setTab('signup'); setError(''); }} className="text-accent font-semibold hover:underline">
                  Create account
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4 animate-in">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-foreground">Create your account</h1>
                <p className="text-muted-foreground text-sm mt-1">Join ThreadHaus and start shopping</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Sarah"
                    value={signupForm.firstName}
                    onChange={(e) => setSignupForm({ ...signupForm, firstName: e.target.value })} />
                </div>
                <div>
                  <label className="label-tag text-muted-foreground block mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    className="input-field"
                    placeholder="Mitchell"
                    value={signupForm.lastName}
                    onChange={(e) => setSignupForm({ ...signupForm, lastName: e.target.value })} />
                </div>
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="input-field"
                  placeholder="sarah@example.com"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })} />
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pr-10"
                    placeholder="Min. 6 characters"
                    value={signupForm.password}
                    onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <Icon name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'} size={16} />
                  </button>
                </div>
              </div>

              <div>
                <label className="label-tag text-muted-foreground block mb-1">Confirm Password</label>
                <input
                  type="password"
                  required
                  className="input-field"
                  placeholder="••••••••"
                  value={signupForm.confirm}
                  onChange={(e) => setSignupForm({ ...signupForm, confirm: e.target.value })} />
                {signupForm.confirm && signupForm.password !== signupForm.confirm && (
                  <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                )}
              </div>

              <p className="text-xs text-muted-foreground leading-relaxed">
                By creating an account you agree to our{' '}
                <Link href="/terms" className="text-accent hover:underline">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-accent hover:underline">Privacy Policy</Link>.
              </p>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center mt-2 disabled:opacity-70">
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account…
                  </>
                ) : (
                  <>
                    Create Account
                    <Icon name="ArrowRightIcon" size={16} />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => { setTab('login'); setError(''); }} className="text-accent font-semibold hover:underline">
                  Sign in
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
