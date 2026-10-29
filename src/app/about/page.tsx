import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import {
  Sparkles,
  Zap,
  Bot,
  Video,
  Share2,
  Workflow,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Layers,
  ArrowLeft,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About RIIQX 2.0 — One Goal. An AI That Gets It Done.',
  description: 'Learn about RIIQX 2.0, the next-generation AI Creator OS and Level 3 Autopilot platform.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-[#121316] text-[#202124] dark:text-[#F3F4F6] selection:bg-[#FFD43B]/40 selection:text-[#202124]">
      {/* Top Header */}
      <header className="sticky top-0 z-30 w-full border-b border-[#EAE7E1] dark:border-[#27282D] bg-[#FAF9F6]/85 dark:bg-[#121316]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <RiiqxEmblem size={28} glow={false} />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight font-heading text-[#202124] dark:text-white leading-tight">
              RIIQX
            </span>
            <span className="text-[10px] font-semibold text-[#737373] dark:text-[#9CA3AF] tracking-wide">
              Creator OS • About Platform
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/terms"
            className="text-xs font-semibold text-[#737373] dark:text-[#9CA3AF] hover:text-[#202124] dark:hover:text-white transition px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-xs font-semibold text-[#737373] dark:text-[#9CA3AF] hover:text-[#202124] dark:hover:text-white transition px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            Privacy
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFD43B] hover:bg-[#ffcd20] text-[#202124] font-bold text-xs shadow-xs transition transform hover:scale-[1.02]"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Workspace</span>
          </Link>
        </div>
      </header>

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-[#EAE7E1] dark:border-[#27282D] bg-gradient-to-b from-white to-[#FAF9F6] dark:from-[#18191E] dark:to-[#121316] py-16 sm:py-24 px-4 sm:px-8 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[24rem] bg-gradient-to-tr from-[#FFD43B]/20 via-[#FF6B5E]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#1A1B20] border border-[#EAE7E1] dark:border-[#2E3038] shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-[#FFD43B]" />
            <span className="text-xs font-bold tracking-wider text-[#202124] dark:text-white uppercase">
              RIIQX 2.0 • The Modern Creator OS
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-[#202124] dark:text-white font-heading leading-tight">
            One Goal. An AI That Gets It Done.
          </h1>

          <p className="text-base sm:text-lg text-[#5F6368] dark:text-[#9CA3AF] max-w-2xl mx-auto leading-relaxed">
            RIIQX unifies the entire creator production pipeline into one cohesive, lightning-fast operating system. From raw trend discovery to AI scriptwriting, multi-scene storyboarding, automated scheduling, and performance analytics.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#202124] dark:bg-white text-white dark:text-[#202124] font-bold text-sm shadow-md transition transform hover:scale-[1.02]"
            >
              <span>Launch Creator Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#FFD43B] text-[#202124] font-bold text-sm shadow-md transition transform hover:scale-[1.02]"
            >
              <span>Sign Up for Free</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Production Pipeline Architecture */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16 space-y-12">
        <div className="space-y-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-black text-[#202124] dark:text-white font-heading">
            The 12-Step Creator Machine
          </h2>
          <p className="text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] max-w-xl mx-auto">
            No more jumping between 8 different fragmented apps. RIIQX binds your complete lifecycle together:
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            {[
              { step: '1', title: 'Discover', desc: 'Real-time trending topics' },
              { step: '2', title: 'Research', desc: 'Perplexity-grade synthesis' },
              { step: '3', title: 'Ideate', desc: 'Viral hook variations' },
              { step: '4', title: 'Script', desc: 'Paced narrative blueprints' },
              { step: '5', title: 'Storyboard', desc: 'Visual scene mapping' },
              { step: '6', title: 'Synthesize', desc: 'Voiceover & audio timing' },
              { step: '7', title: 'Edit', desc: '9:16 vertical video layout' },
              { step: '8', title: 'Review', desc: 'Brand compliance guard' },
              { step: '9', title: 'Schedule', desc: 'Automated queue calendar' },
              { step: '10', title: 'Publish', desc: 'Multi-channel social delivery' },
              { step: '11', title: 'Analyze', desc: 'Retention & engagement math' },
              { step: '12', title: 'Improve', desc: 'Algorithmic iteration loops' },
            ].map((item) => (
              <div
                key={item.step}
                className="p-3.5 rounded-2xl border border-[#EAE7E1]/80 dark:border-[#2E3038]/80 bg-[#FAF9F6] dark:bg-[#121316] text-left"
              >
                <div className="w-5 h-5 rounded-full bg-[#FFD43B] text-[#202124] font-bold text-[10px] flex items-center justify-center mb-2">
                  {item.step}
                </div>
                <h4 className="font-bold text-xs text-[#202124] dark:text-white">{item.title}</h4>
                <p className="text-[10px] text-[#737373] dark:text-[#9CA3AF] mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD43B]/20 text-[#D97706] dark:text-[#FFD43B] flex items-center justify-center font-bold">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Multi-Model Agent Core</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              Connect to Groq LPU, OpenRouter, Cohere Command R+, and AWS Bedrock with automatic capability routing and fallback protection.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6B5E]/15 text-[#E11D48] dark:text-[#FF6B5E] flex items-center justify-center font-bold">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Creator Studio 2.0</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              Dedicated 9:16 vertical video storyboard studio with pacing graphs, audio wave monitors, and multi-track timing controls.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-[#16865D]/15 text-[#16865D] dark:text-[#34D399] flex items-center justify-center font-bold">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Level 3 Autopilot</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              Autonomous social publishing across YouTube Shorts, Instagram Reels, X/Twitter, and LinkedIn with strict human authorization gates.
            </p>
          </div>
        </div>

        {/* Brand Core Values */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-[#202124] to-[#121316] text-white space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-[#FFD43B]">
            Creator-First Engineering
          </span>
          <h3 className="text-2xl font-black font-heading tracking-tight">
            Built with Zero Compromise on Privacy &amp; Performance
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
            RIIQX was built from the ground up to respect creative ownership. No hidden telemetries, no secret data harvesting, no model training on private ideas. You own 100% of your outputs, guaranteed.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-[#EAE7E1] dark:border-[#27282D] bg-white/50 dark:bg-[#121316]/50 py-8 px-4 sm:px-8 text-center text-xs text-[#737373] dark:text-[#9CA3AF]">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <RiiqxEmblem size={20} glow={false} />
            <span className="font-bold text-[#202124] dark:text-white">RIIQX 2.0</span>
            <span>&copy; {new Date().getFullYear()} RIIQX Labs</span>
          </div>

          <div className="flex items-center gap-6 font-semibold">
            <Link href="/terms" className="hover:text-[#202124] dark:hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#202124] dark:hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/about" className="text-[#FF6B5E] hover:underline">
              About Platform
            </Link>
            <Link href="/" className="hover:text-[#202124] dark:hover:text-white transition">
              Open Workspace
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

