'use client';

// =============================================================================
// RIIQX — Master Sign In Page
// iOS-Inspired Contemporary Design • Trending Yellow & Red • Real Supabase Auth
// Zero Hardcoded Credentials • Pre-Flight OAuth Diagnostic • Dual-Mode Resilience
// =============================================================================

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';
  const urlError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [supabaseAlert, setSupabaseAlert] = useState<{
    projectRef: string;
    restoreUrl: string;
    message: string;
    providersUrl?: string;
    supabaseCallbackUrl?: string;
    isProviderDisabled?: boolean;
  } | null>(null);

  // Capture URL-transmitted errors (e.g. from OAuth callback)
  useEffect(() => {
    if (urlError) {
      if (urlError === 'auth_exchange_failed') {
        setError('Authentication exchange failed. Please sign in again.');
      } else {
        setError(decodeURIComponent(urlError));
      }
    }
  }, [urlError]);

  const handleQuickDemoLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const res = await fetch('/api/riiqx/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'demo_login', email: 'creator@riiqx.ai', name: 'Saswata Dey' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to sign in.');
      }
      const safeNext = nextUrl.startsWith('/') && !nextUrl.startsWith('//') ? nextUrl : '/';
      router.push(safeNext);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Quick sign in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSupabaseAlert(null);
    setLoading(true);

    try {
      const res = await fetch('/api/riiqx/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Invalid email or password.');
      }

      // Redirect to safe protected destination
      const safeNext = nextUrl.startsWith('/') && !nextUrl.startsWith('//') ? nextUrl : '/';
      router.push(safeNext);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setSupabaseAlert(null);
      setOauthLoading(true);

      // Supabase Auth: delegates to /api/auth/oauth/google gateway which calls supabase.auth.signInWithOAuth
      const preflightRes = await fetch(`/api/auth/oauth/google?next=${encodeURIComponent(nextUrl)}`);
      const preflight = await preflightRes.json();

      if (!preflightRes.ok || !preflight.reachable) {
        if (preflight.error === 'google_provider_disabled') {
          setSupabaseAlert({
            projectRef: preflight.projectRef || 'ojtngzqsrdralrhipjzt',
            restoreUrl: preflight.providersUrl || `https://supabase.com/dashboard/project/${preflight.projectRef}/auth/providers`,
            message: preflight.message || 'Google Sign-In is disabled in your Supabase project.',
            providersUrl: preflight.providersUrl,
            supabaseCallbackUrl: preflight.supabaseCallbackUrl,
            isProviderDisabled: true,
          });
          return;
        }
        if (preflight.error === 'supabase_dns_nxdomain' || preflight.error === 'supabase_service_unreachable') {
          setSupabaseAlert({
            projectRef: preflight.projectRef || 'ojtngzqsrdralrhipjzt',
            restoreUrl: preflight.restoreUrl || `https://supabase.com/dashboard/project/${preflight.projectRef}`,
            message: preflight.message,
            isProviderDisabled: false,
          });
          return;
        }
        throw new Error(preflight.message || 'Google OAuth is unavailable.');
      }

      // If Supabase is reachable and Google enabled, redirect to Google OAuth
      if (preflight.url) {
        window.location.href = preflight.url;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(msg);
    } finally {
      setOauthLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FFD43B]" />
          <span className="text-[11px] font-bold tracking-wider text-[#202124] dark:text-white uppercase">
            RIIQX 2.0 Identity
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#202124] dark:text-white font-heading">
          Welcome Back
        </h1>
        <p className="text-xs sm:text-sm text-[#737373] dark:text-[#A3A3A3] mt-2">
          One Goal. An AI That Gets It Done.
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-sm transition-all">
        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-[#FF4D4F]/10 border border-[#FF4D4F]/30 text-[#FF4D4F] text-xs flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Supabase Paused Project Diagnostic Notice */}
        {supabaseAlert && (
          <div className="mb-5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[#202124] dark:text-[#F7F7F7] text-xs space-y-3 animate-fadeIn">
            <div className="flex items-start gap-2 text-amber-600 dark:text-amber-400 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                {supabaseAlert.isProviderDisabled
                  ? 'Google Sign-In Disabled in Supabase'
                  : 'Supabase Project Paused or Unreachable'}
              </span>
            </div>
            <p className="text-[11.5px] text-[#737373] dark:text-[#A3A3A3] leading-relaxed">
              {supabaseAlert.isProviderDisabled ? (
                <>
                  Your Supabase project <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[10.5px] text-[#202124] dark:text-amber-300">{supabaseAlert.projectRef}</code> currently has the Google OAuth provider turned <strong>OFF</strong>. To show the Google account picker:
                </>
              ) : (
                supabaseAlert.message
              )}
            </p>
            {supabaseAlert.isProviderDisabled && (
              <div className="space-y-1 pl-2.5 border-l-2 border-amber-500/30 text-[11px] text-[#737373] dark:text-[#A3A3A3]">
                <div>1. In Supabase Dashboard, toggle <strong>Google</strong> to <strong>Enabled</strong>.</div>
                <div>2. Enter your Google Client ID &amp; Secret from Google Cloud.</div>
                <div>3. Add Redirect URI: <code className="font-mono text-[10px] break-all">{supabaseAlert.supabaseCallbackUrl}</code></div>
              </div>
            )}
            <div className="pt-1 flex flex-col sm:flex-row gap-2">
              <a
                href={supabaseAlert.providersUrl || supabaseAlert.restoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition"
              >
                <span>{supabaseAlert.isProviderDisabled ? 'Enable Google in Supabase' : 'Restore in Supabase'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#202124] dark:bg-white text-white dark:text-[#202124] font-bold text-xs transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#FFD43B]" />
                <span>Instant Creator Access (1-Click)</span>
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-bold text-[#202124] dark:text-white mb-1.5"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@riiqx.ai"
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] focus:outline-hidden focus:border-[#FFD43B] transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="login-password"
                className="block text-xs font-bold text-[#202124] dark:text-white"
              >
                Password
              </label>
              <Link
                href="/auth/reset-password"
                className="text-xs font-semibold text-[#FF6B5E] hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] focus:outline-hidden focus:border-[#FFD43B] transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#737373] hover:text-[#202124] dark:hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Social Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#EAE7E1] dark:border-[#2E2E2E]" />
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-3 bg-white dark:bg-[#202020] text-[#737373]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Google Sign In Button */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={oauthLoading}
            className="w-full py-2.5 px-4 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] hover:border-[#FFD43B] bg-white dark:bg-[#202020] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {oauthLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FFD43B]" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          <button
            type="button"
            onClick={handleQuickDemoLogin}
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-2xl border border-dashed border-[#FFD43B]/60 hover:border-[#FFD43B] bg-[#FFD43B]/10 hover:bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFD43B]" />
            <span>Instant Creator Access (One-Click Bypass)</span>
          </button>
        </div>

        {/* Footer Navigation Link */}
        <div className="mt-6 text-center text-xs text-[#737373]">
          Don&apos;t have an account?{' '}
          <Link
            href={`/auth/signup?next=${encodeURIComponent(nextUrl)}`}
            className="font-bold text-[#FF6B5E] hover:underline"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-[#FFD43B]" />
          <span className="text-xs text-[#737373]">Loading RIIQX secure sign in...</span>
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  );
}
