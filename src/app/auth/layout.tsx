import React from 'react';
import Link from 'next/link';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import { ShieldCheck, ArrowLeft, ExternalLink } from 'lucide-react';

export const metadata = {
  title: 'Authentication — RIIQX 2.0 Identity',
  description: 'Sign in or register for your RIIQX Creator OS workspace with secure Supabase authentication.',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-[#151515] text-[#202124] dark:text-[#F7F7F7] flex flex-col justify-between relative overflow-x-hidden selection:bg-[#FFD43B]/40 selection:text-[#202124]">
      {/* Ambient iOS Background Accents */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[32rem] h-[32rem] bg-[#FFD43B]/10 dark:bg-[#FFD43B]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[32rem] h-[32rem] bg-[#FF4D4F]/10 dark:bg-[#FF4D4F]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Minimal Top Brand Bar */}
      <header className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-[#EAE7E1]/80 dark:border-[#2E2E2E]/80 bg-white/50 dark:bg-[#151515]/50 backdrop-blur-md">
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
        >
          <RiiqxEmblem size={28} glow={false} />
          <div className="flex flex-col">
            <span className="font-black text-lg tracking-tight font-heading text-[#202124] dark:text-white leading-none">
              RIIQX
            </span>
            <span className="text-[10px] font-semibold text-[#737373] dark:text-[#A3A3A3] tracking-wide mt-0.5">
              Creator OS • Identity
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#737373] dark:text-[#A3A3A3] hover:text-[#202124] dark:hover:text-white transition-colors px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Workspace</span>
          </Link>
        </div>
      </header>

      {/* Main Form Center Stage */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center px-4 py-8 sm:py-12">
        {children}
      </div>

      {/* Dedicated Legal & Security Footer */}
      <footer className="relative z-20 w-full px-6 py-4 border-t border-[#EAE7E1]/80 dark:border-[#2E2E2E]/80 bg-white/40 dark:bg-[#151515]/40 backdrop-blur-md text-[11px] text-[#737373] dark:text-[#A3A3A3] flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#16865D]" />
          <span>Encrypted with Row Level Security &amp; OAuth 2.0 PKCE</span>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/terms" className="hover:text-[#202124] dark:hover:text-white transition">
            Terms of Service
          </Link>
          <Link href="/privacy" className="hover:text-[#202124] dark:hover:text-white transition">
            Privacy Policy
          </Link>
          <span>&copy; {new Date().getFullYear()} RIIQX Labs</span>
        </div>
      </footer>
    </div>
  );
}
