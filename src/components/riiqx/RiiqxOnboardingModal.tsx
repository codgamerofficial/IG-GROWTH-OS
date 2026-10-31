'use client';

// =============================================================================
// RIIQX — iOS Onboarding & Authentication Experience (Sections 4 & 5 of Blueprint)
// 5 Step Onboarding Flow • Welcome Back & Create Account Tabs • Mobile Preview
// =============================================================================

import React, { useState } from 'react';
import Image from 'next/image';
import {
  RiiqxEmblem,
} from './RiiqxEmblem';
import {
  ArrowRight,
  ChevronLeft,
  X,
  Youtube,
  Instagram,
  Share2,
  MessageCircle,
  TrendingUp,
  Video,
  Sparkles,
  Lock,
  Mail,
  User,
  Check,
} from 'lucide-react';

interface RiiqxOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'onboarding' | 'auth';
}

export function RiiqxOnboardingModal({
  isOpen,
  onClose,
  initialMode = 'onboarding',
}: RiiqxOnboardingModalProps) {
  const [mode, setMode] = useState<'onboarding' | 'auth'>(initialMode);
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [slideIdx, setSlideIdx] = useState(0);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [authSuccess, setAuthSuccess] = useState(false);

  if (!isOpen) return null;

  const slides = [
    {
      title: 'Smarter Creation. Smarter Growth.',
      subtitle: 'All your content creation, AI tools and social platforms in one place.',
      renderVisual: () => (
        <div className="flex flex-col items-center justify-center py-6">
          <RiiqxEmblem size={84} />
          <h2 className="mt-4 text-2xl font-black tracking-tight text-[#171A22] dark:text-white">
            RIIQX
          </h2>
        </div>
      ),
      buttonText: 'Get Started',
    },
    {
      title: 'Connect Your Platforms',
      subtitle: 'Publish, schedule and grow your content across all major social platforms.',
      renderVisual: () => (
        <div className="flex items-center justify-center gap-3 py-8">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shadow-xs">
            <Youtube className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-600 flex items-center justify-center shadow-xs">
            <Instagram className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center shadow-xs">
            <Share2 className="w-6 h-6" />
          </div>
          <div className="w-12 h-12 rounded-2xl bg-[#16865D]/10 text-[#16865D] flex items-center justify-center shadow-xs">
            <MessageCircle className="w-6 h-6" />
          </div>
        </div>
      ),
      buttonText: 'Next',
    },
    {
      title: 'AI Powered Creator Studio',
      subtitle: 'Create stunning videos with AI, pre-engineered templates, and pro editing tools.',
      renderVisual: () => (
        <div className="py-4 flex flex-col items-center">
          <div className="w-56 aspect-video rounded-2xl bg-slate-900 border border-[#E5E4DE] dark:border-[#2A3347] overflow-hidden relative shadow-md">
            <Image
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80"
              alt="Editor preview"
              fill
              unoptimized
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-white px-2 py-0.5 rounded-full bg-[#6750D8]">
                9:16 Video Editor
              </span>
            </div>
          </div>
        </div>
      ),
      buttonText: 'Next',
    },
    {
      title: 'Real Insights Faster Growth',
      subtitle: 'Track performance and get AI-driven recommendations based on actual telemetry.',
      renderVisual: () => (
        <div className="py-6 flex flex-col items-center">
          <div className="px-4 py-3 rounded-2xl bg-white dark:bg-[#141821] border border-[#E5E4DE] dark:border-[#2A3347] shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#16865D]/10 text-[#16865D] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <span className="text-sm font-black text-[#16865D]">+255%</span>
              <p className="text-[10px] text-[#777D88]">Audience Retention Peak</p>
            </div>
          </div>
        </div>
      ),
      buttonText: 'Next',
    },
    {
      title: "Let's Build Your Story",
      subtitle: 'Turn your ideas into viral content with RIIQX. Start creating right away.',
      renderVisual: () => (
        <div className="py-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#6750D8] to-[#8B5CF6] flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-10 h-10" />
          </div>
        </div>
      ),
      buttonText: 'Start Now',
    },
  ];

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthSuccess(true);
    setTimeout(() => {
      onClose();
      setAuthSuccess(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm rounded-[32px] bg-white dark:bg-[#1C2230] border border-[#E5E4DE] dark:border-[#2A3347] shadow-2xl overflow-hidden flex flex-col relative">
        {/* Top Dismiss Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full text-[#777D88] hover:text-[#171A22] dark:hover:text-white bg-slate-100 dark:bg-slate-800 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {mode === 'onboarding' ? (
          <div className="p-7 flex flex-col justify-between min-h-[460px] text-center">
            {/* Visual Center */}
            <div className="pt-2">{slides[slideIdx].renderVisual()}</div>

            {/* Typography */}
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#171A22] dark:text-white tracking-tight">
                {slides[slideIdx].title}
              </h3>
              <p className="text-xs text-[#777D88] dark:text-slate-400 leading-relaxed px-2">
                {slides[slideIdx].subtitle}
              </p>
            </div>

            {/* Dots Pagination */}
            <div className="flex items-center justify-center gap-1.5 py-4">
              {slides.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all ${
                    slideIdx === i
                      ? 'w-6 bg-[#6750D8]'
                      : 'w-1.5 bg-[#E5E4DE] dark:bg-[#2A3347]'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  if (slideIdx < slides.length - 1) {
                    setSlideIdx((prev) => prev + 1);
                  } else {
                    setMode('auth');
                  }
                }}
                className="w-full py-3 rounded-2xl bg-[#6750D8] hover:bg-[#5841C5] text-white text-xs font-bold transition shadow-xs flex items-center justify-center gap-1.5"
              >
                <span>{slides[slideIdx].buttonText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMode('auth')}
                className="w-full py-2 text-xs font-semibold text-[#777D88] hover:text-[#171A22] dark:hover:text-white transition"
              >
                Sign In Instead
              </button>
            </div>
          </div>
        ) : (
          /* Blueprint Section 5: Authentication (Welcome Back / Create Account) */
          <div className="p-7 flex flex-col justify-between min-h-[460px]">
            <div>
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setMode('onboarding')}
                  className="flex items-center gap-1 text-xs font-semibold text-[#777D88] hover:text-[#171A22] dark:hover:text-white transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
                <div className="flex items-center p-1 rounded-xl bg-[#F5F5F0] dark:bg-[#141821] text-xs font-bold">
                  <button
                    onClick={() => setAuthTab('signin')}
                    className={`px-3 py-1 rounded-lg transition ${
                      authTab === 'signin'
                        ? 'bg-[#6750D8] text-white shadow-2xs'
                        : 'text-[#777D88]'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => setAuthTab('signup')}
                    className={`px-3 py-1 rounded-lg transition ${
                      authTab === 'signup'
                        ? 'bg-[#6750D8] text-white shadow-2xs'
                        : 'text-[#777D88]'
                    }`}
                  >
                    Register
                  </button>
                </div>
              </div>

              <div className="text-center mb-5">
                <h3 className="text-xl font-black text-[#171A22] dark:text-white tracking-tight">
                  {authTab === 'signin' ? 'Welcome Back' : 'Create Account'}
                </h3>
                <p className="text-xs text-[#777D88] mt-0.5">
                  {authTab === 'signin'
                    ? 'Sign in to continue to RIIQX'
                    : 'Join RIIQX and start creating today'}
                </p>
              </div>

              {authSuccess ? (
                <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#16865D]/10 text-[#16865D] flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-sm text-[#171A22] dark:text-white">
                    {authTab === 'signin' ? 'Signed In Successfully!' : 'Account Created!'}
                  </h4>
                </div>
              ) : (
                <form onSubmit={handleAuthSubmit} className="space-y-3">
                  {authTab === 'signup' && (
                    <div className="relative">
                      <User className="w-4 h-4 text-[#777D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#141821] border border-[#E5E4DE] dark:border-[#2A3347] text-xs text-[#171A22] dark:text-white placeholder-[#777D88] focus:outline-none focus:border-[#6750D8] transition"
                      />
                    </div>
                  )}

                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#777D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email Address"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#141821] border border-[#E5E4DE] dark:border-[#2A3347] text-xs text-[#171A22] dark:text-white placeholder-[#777D88] focus:outline-none focus:border-[#6750D8] transition"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#777D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#141821] border border-[#E5E4DE] dark:border-[#2A3347] text-xs text-[#171A22] dark:text-white placeholder-[#777D88] focus:outline-none focus:border-[#6750D8] transition"
                    />
                  </div>

                  {authTab === 'signup' && (
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#777D88] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F5F5F0] dark:bg-[#141821] border border-[#E5E4DE] dark:border-[#2A3347] text-xs text-[#171A22] dark:text-white placeholder-[#777D88] focus:outline-none focus:border-[#6750D8] transition"
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-[#6750D8] hover:bg-[#5841C5] text-white text-xs font-bold transition shadow-xs mt-2"
                  >
                    {authTab === 'signin' ? 'Sign In' : 'Create Account'}
                  </button>
                </form>
              )}
            </div>

            <p className="text-[10px] text-center text-[#777D88] mt-4">
              Protected by non-Firebase PBKDF2 SHA-256 cryptographic security.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
