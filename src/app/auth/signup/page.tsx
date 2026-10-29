'use client';

// =============================================================================
// RIIQX — Master Sign Up Page
// iOS-Inspired Contemporary Design • Trending Yellow & Red • Real Supabase Auth
// Zero Hardcoded Credentials • PKCE OAuth via @supabase/ssr • Production Secure
// =============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRiiqx } from '@/context/RiiqxContext';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/';

  const { isAuthenticated, isAuthLoading } = useRiiqx();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [supabaseAlert, setSupabaseAlert] = useState<{
    projectRef: string;
    restoreUrl: string;
    message: string;
    providersUrl?: string;
    supabaseCallbackUrl?: string;
    isProviderDisabled?: boolean;
  } | null>(null);

  // If already authenticated, redirect forward to workspace
  React.useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      const safeNext = nextUrl.startsWith('/') && !nextUrl.startsWith('//') ? nextUrl : '/';
      router.replace(safeNext);
    }
  }, [isAuthenticated, isAuthLoading, nextUrl, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSupabaseAlert(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/riiqx/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', email, password, name }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to create account.');
      }

      if (data.requiresEmailConfirmation) {
        setSuccess('Account created! Please check your email to confirm your account before signing in.');
        return;
      }

      // If registered and logged in directly:
      const safeNext = nextUrl.startsWith('/') && !nextUrl.startsWith('//') ? nextUrl : '/';
      router.push(safeNext);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      setError(null);
      setSupabaseAlert(null);
      setOauthLoading(true);

      // Clean callback URL matching exact Supabase Allowlist
      const callbackUrl = `${window.location.origin}/auth/callback`;

      // Store intended next route in temporary cookie if different from root
      if (nextUrl && nextUrl !== '/' && nextUrl.startsWith('/') && !nextUrl.startsWith('//')) {
        document.cookie = `riiqx_auth_next=${encodeURIComponent(nextUrl)}; path=/; max-age=300; SameSite=Lax`;
      }

      // Initiate client-side PKCE flow via @supabase/ssr to set code_verifier cookie
      const supabase = createClient();
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          },
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-up failed';
      setError(msg);
      setOauthLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] shadow-2xs mb-4">
          <span className="w-2 h-2 rounded-full bg-[#FF6B5E]" />
          <span className="text-[11px] font-bold tracking-wider text-[#202124] dark:text-white uppercase">
            Create Your Account
          </span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#202124] dark:text-white font-heading">
          Join RIIQX
        </h1>
        <p className="mt-2 text-sm text-[#737373] dark:text-[#A1A1AA]">
          Deploy autonomous AI growth agents and multi-platform publishing.
        </p>
      </div>

      {/* Main Glass Card */}
      <div className="bg-white/80 dark:bg-[#202020]/80 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-sm border border-[#EAE7E1] dark:border-[#2E2E2E]">
        {/* Error Notification Alert */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-[#FF6B5E]/10 border border-[#FF6B5E]/30 flex items-start gap-3 text-xs sm:text-sm text-[#FF6B5E]">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3 text-xs sm:text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{success}</div>
          </div>
        )}

        {/* Supabase Actionable Diagnostic Alert */}
        {supabaseAlert && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs sm:text-sm">
            <div className="flex items-start gap-2.5 mb-2 font-bold">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Supabase Configuration Notice</span>
            </div>
            <p className="mb-3 leading-relaxed text-[#737373] dark:text-[#A1A1AA]">
              {supabaseAlert.message}
            </p>
            {supabaseAlert.isProviderDisabled ? (
              <div className="space-y-2">
                <p className="text-[11px] text-[#737373] dark:text-[#A1A1AA]">
                  To activate Google Sign-In, toggle <strong>Google</strong> to Enabled in your Supabase Auth Providers console and add your Google Cloud Client ID &amp; Secret:
                </p>
                {supabaseAlert.supabaseCallbackUrl && (
                  <div className="p-2 rounded bg-black/5 dark:bg-white/5 font-mono text-[10px] break-all select-all">
                    Redirect URI: {supabaseAlert.supabaseCallbackUrl}
                  </div>
                )}
                <a
                  href={supabaseAlert.restoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition"
                >
                  <span>Open Supabase Providers</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ) : (
              <a
                href={supabaseAlert.restoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition"
              >
                <span>Restore Supabase Project</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* Form or Email Confirmation State */}
        {success ? (
          <div className="text-center py-4">
            <Link
              href={`/auth/login?next=${encodeURIComponent(nextUrl)}`}
              className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-2xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] font-bold text-sm shadow-xs transition"
            >
              <span>Proceed to Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="signup-name"
                  className="block text-xs font-bold text-[#202124] dark:text-white mb-1.5"
                >
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] focus:outline-hidden focus:border-[#FFD43B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-email"
                  className="block text-xs font-bold text-[#202124] dark:text-white mb-1.5"
                >
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] focus:outline-hidden focus:border-[#FFD43B] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="signup-password"
                  className="block text-xs font-bold text-[#202124] dark:text-white mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
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

              <div>
                <label
                  htmlFor="signup-confirm-password"
                  className="block text-xs font-bold text-[#202124] dark:text-white mb-1.5"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#737373] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full pl-10 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[#FAF9F6] dark:bg-[#151515] border border-[#EAE7E1] dark:border-[#2E2E2E] focus:outline-hidden focus:border-[#FFD43B] transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 px-4 rounded-2xl bg-[#FF6B5E] hover:bg-[#EE5D50] text-white font-bold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
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

            {/* Google Sign Up Button */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={oauthLoading}
                className="w-full py-2.5 px-4 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] hover:border-[#FF6B5E] bg-white dark:bg-[#202020] text-xs sm:text-sm font-semibold flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
              >
                {oauthLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#FF6B5E]" />
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
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Footer Navigation Link */}
            <div className="mt-6 text-center text-xs text-[#737373]">
              Already have an account?{' '}
              <Link
                href={`/auth/login?next=${encodeURIComponent(nextUrl)}`}
                className="font-bold text-[#FF6B5E] hover:underline"
              >
                Sign In
              </Link>
            </div>
          </>
        )}
      </div>

      {/* Security & Legal Micro Footer */}
      <div className="mt-8 text-center text-xs text-[#737373] space-y-2">
        <div className="flex items-center justify-center gap-1.5 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#34A853]" />
          <span>AES-256 Encrypted Session • RLS Isolated</span>
        </div>
        <p>
          By creating an account, you agree to our{' '}
          <Link href="/terms" className="underline hover:text-[#202124] dark:hover:text-white transition">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline hover:text-[#202124] dark:hover:text-white transition">
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF6B5E]" />
        </div>
      }
    >
      <SignupForm />
    </React.Suspense>
  );
}
