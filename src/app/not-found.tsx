import React from 'react';
import Link from 'next/link';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import { ArrowLeft, Home, ShieldCheck, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-between bg-[#FAF9F6] dark:bg-[#121316] px-6 py-10 text-center text-[#202124] dark:text-[#F3F4F6] selection:bg-[#FFD43B]/40">
      {/* Top Header */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <RiiqxEmblem size={28} glow={false} />
          <span className="font-extrabold text-base tracking-tight font-heading text-[#202124] dark:text-white">
            RIIQX
          </span>
        </Link>
        <Link
          href="/"
          className="text-xs font-semibold text-[#737373] dark:text-[#9CA3AF] hover:text-[#202124] dark:hover:text-white transition"
        >
          Workspace
        </Link>
      </div>

      {/* Center 404 Hero */}
      <div className="my-auto max-w-md flex flex-col items-center">
        <div className="relative mb-6">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#FFD43B]/30 to-[#FF6B5E]/30 blur-2xl opacity-70 pointer-events-none" />
          <span className="relative font-black text-8xl sm:text-9xl tracking-tighter font-heading text-transparent bg-clip-text bg-gradient-to-r from-[#FFD43B] via-[#FF6B5E] to-[#FF4D4F] drop-shadow-sm">
            404
          </span>
        </div>

        <h1 className="mb-2.5 text-2xl sm:text-3xl font-extrabold tracking-tight text-[#202124] dark:text-white font-heading">
          Page Not Found
        </h1>
        <p className="mb-8 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed max-w-sm">
          The page or workspace module you are looking for does not exist, has been moved, or has an outdated link.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FFD43B] hover:bg-[#ffcd20] px-6 py-3 text-xs font-bold text-[#202124] shadow-sm transition transform hover:scale-[1.02]"
          >
            <Home className="w-4 h-4" />
            <span>Return to Workspace</span>
          </Link>
          <Link
            href="/auth/login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#EAE7E1] dark:border-[#2E3038] bg-white dark:bg-[#1A1B20] px-5 py-3 text-xs font-bold text-[#202124] dark:text-white transition hover:bg-black/5 dark:hover:bg-white/5"
          >
            <span>Sign In</span>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full max-w-4xl pt-8 border-t border-[#EAE7E1] dark:border-[#27282D] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#737373] dark:text-[#9CA3AF]">
        <span>&copy; {new Date().getFullYear()} RIIQX Labs • All Rights Reserved</span>
        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-[#202124] dark:hover:text-white transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-[#202124] dark:hover:text-white transition">
            Privacy Policy
          </Link>
          <Link href="/about" className="hover:text-[#202124] dark:hover:text-white transition">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
