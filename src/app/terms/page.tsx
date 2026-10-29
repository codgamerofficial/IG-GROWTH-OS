import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import {
  FileText,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — RIIQX 2.0',
  description: 'Commercial ownership, acceptable use policies, and AI autonomy terms of service for RIIQX Creator OS.',
};

export default function TermsPage() {
  const lastUpdated = 'October 29, 2026';

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] dark:bg-[#121316] text-[#202124] dark:text-[#F3F4F6] selection:bg-[#FFD43B]/40 selection:text-[#202124]">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-30 w-full border-b border-[#EAE7E1] dark:border-[#27282D] bg-[#FAF9F6]/85 dark:bg-[#121316]/85 backdrop-blur-md px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <RiiqxEmblem size={28} glow={false} />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight font-heading text-[#202124] dark:text-white leading-tight">
              RIIQX
            </span>
            <span className="text-[10px] font-semibold text-[#737373] dark:text-[#9CA3AF] tracking-wide">
              Creator OS • Legal Center
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/privacy"
            className="text-xs font-semibold text-[#737373] dark:text-[#9CA3AF] hover:text-[#202124] dark:hover:text-white transition px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            Privacy Policy
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
      <section className="relative overflow-hidden border-b border-[#EAE7E1] dark:border-[#27282D] bg-gradient-to-b from-white to-[#FAF9F6] dark:from-[#18191E] dark:to-[#121316] py-12 sm:py-16 px-4 sm:px-8">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-[#FFD43B]/10 dark:bg-[#FFD43B]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#FF6B5E]/10 dark:bg-[#FF6B5E]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FFD43B]/20 dark:bg-[#FFD43B]/10 border border-[#FFD43B]/40 text-[#202124] dark:text-[#FFD43B] text-[11px] font-bold tracking-wider uppercase mb-4">
            <Scale className="w-3.5 h-3.5" />
            <span>Official Legal Governance</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#202124] dark:text-white font-heading">
            Terms of Service
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5F6368] dark:text-[#9CA3AF] max-w-2xl leading-relaxed">
            Welcome to RIIQX. These terms govern your commercial access, autonomy settings, API integrations, and creative ownership across our web and mobile applications.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-[#737373] dark:text-[#9CA3AF]">
            <span>Last Updated: <strong className="text-[#202124] dark:text-white">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Version: <strong className="text-[#202124] dark:text-white">2.0.0</strong></span>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-10">
        {/* Core Principles Callout */}
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#16865D]/10 text-[#16865D] dark:text-[#34D399] flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">100% Commercial Rights</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              You retain all copyright, commercial rights, and monetization ownership for all scripts, storyboards, and videos generated on RIIQX.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#FFD43B]/20 text-[#D97706] dark:text-[#FFD43B] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Bounded AI Autonomy</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              Level 3 agentic actions (publishing live posts, file modifications, budget actions) strictly require your explicit confirmation.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#FF6B5E]/15 text-[#E11D48] dark:text-[#FF6B5E] flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Zero Model Training</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              Your proprietary content, keys, and private brand assets are never used to train public foundation models.
            </p>
          </div>
        </div>

        {/* Section 1: Acceptance */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#FFD43B] text-[#202124] text-xs font-bold inline-flex items-center justify-center">
              1
            </span>
            Acceptance of Terms
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              By accessing, browsing, registering for, or using the RIIQX platform (&ldquo;Service&rdquo;), including its web interface, native mobile applications, APIs, and automated agent services, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of the Service immediately.
            </p>
            <p>
              If you are using RIIQX on behalf of an enterprise, company, agency, or brand, you represent and warrant that you have the authority to bind that entity to these Terms.
            </p>
          </div>
        </section>

        {/* Section 2: Creator Ownership & Commercial License */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#FFD43B] text-[#202124] text-xs font-bold inline-flex items-center justify-center">
              2
            </span>
            Intellectual Property &amp; Content Ownership
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              <strong>Your Content:</strong> You retain complete ownership and full commercial copyright to all text prompts, media assets, video storyboards, voice syntheses, rendered vertical videos, and captions created by you using RIIQX.
            </p>
            <p>
              <strong>Commercial Exploitation:</strong> You have the unrestricted right to monetize, publish, sponsor, license, and syndicate your output across platforms such as YouTube, Instagram, Facebook, TikTok, LinkedIn, and X (Twitter) without paying royalties to RIIQX.
            </p>
            <p>
              <strong>Platform Intellectual Property:</strong> RIIQX, its emblems, proprietary algorithmic code, UI architectures, orchestrators, and system prompts remain the exclusive intellectual property of RIIQX Labs.
            </p>
          </div>
        </section>

        {/* Section 3: Acceptable Use & Social Platform Guidelines */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#FFD43B] text-[#202124] text-xs font-bold inline-flex items-center justify-center">
              3
            </span>
            Acceptable Use &amp; Social Platform Compliance
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              When utilizing RIIQX to publish or schedule content to connected third-party networks, you agree to comply with all applicable third-party terms:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5F6368] dark:text-[#9CA3AF]">
              <li>YouTube Community Guidelines &amp; YouTube Terms of Service</li>
              <li>Meta Platform Terms &amp; Instagram Community Guidelines</li>
              <li>X (Twitter) Developer Agreement &amp; User Rules</li>
              <li>LinkedIn Professional Community Policies</li>
            </ul>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
              <span>
                <strong>Strictly Prohibited:</strong> Generating deceptive deepfakes without disclosure, coordinated disinformation campaigns, prohibited financial scams, automated unsolicited messaging, or harassing content. Violation results in immediate account termination.
              </span>
            </div>
          </div>
        </section>

        {/* Section 4: AI Autonomy & Consequential Gates */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#FFD43B] text-[#202124] text-xs font-bold inline-flex items-center justify-center">
              4
            </span>
            Agent Autonomy &amp; Permission Gates
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              RIIQX features an autonomous Level 3 agentic execution engine. By design, our architecture embeds hardcoded permission boundaries:
            </p>
            <p>
              Any action that modifies external databases, sends live social posts to public audiences, alters file hierarchies, or incurs third-party API spend will trigger an interactive permission prompt. The user remains the ultimate decision maker.
            </p>
          </div>
        </section>

        {/* Section 5: Limitation of Liability */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#FFD43B] text-[#202124] text-xs font-bold inline-flex items-center justify-center">
              5
            </span>
            Limitation of Liability &amp; Disclaimers
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              RIIQX provides tools, predictions, and automated publishing workflows on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. We do not guarantee virality, subscriber counts, or uninterrupted third-party API availability.
            </p>
            <p>
              To the maximum extent permitted by applicable law, RIIQX Labs shall not be liable for any indirect, incidental, or consequential damages resulting from platform API outages, social network policy changes, or algorithmic shifts.
            </p>
          </div>
        </section>

        {/* Section 6: Contact & Inquiries */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#FFD43B] text-[#202124] text-xs font-bold inline-flex items-center justify-center">
              6
            </span>
            Governing Law &amp; Legal Notices
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. Any legal disputes arising out of these Terms shall be subject to the exclusive jurisdiction of the competent courts in Kolkata, India.
            </p>
            <p>
              For formal legal inquiries, contract inquiries, or notice service, please reach out to:
            </p>
            <div className="p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#121316] border border-[#EAE7E1] dark:border-[#27282D] text-xs font-mono">
              legal@riiqx.ai • RIIQX Labs, Kolkata, West Bengal, India
            </div>
          </div>
        </section>
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
            <Link href="/terms" className="text-[#FF6B5E] hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-[#202124] dark:hover:text-white transition">
              Privacy Policy
            </Link>
            <Link href="/about" className="hover:text-[#202124] dark:hover:text-white transition">
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

