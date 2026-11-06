import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { RiiqxEmblem } from '@/components/riiqx/RiiqxEmblem';
import {
  Shield,
  Lock,
  EyeOff,
  Database,
  KeyRound,
  CheckCircle2,
  Trash2,
  Download,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy — RIIQX 2.0 Cryptographic Data Governance',
  description: 'Zero-telemetry cryptographic security, token vault isolation, and privacy policies for RIIQX Creator OS.',
};

export default function PrivacyPage() {
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
              Creator OS • Privacy Vault
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/terms"
            className="text-xs font-semibold text-[#737373] dark:text-[#9CA3AF] hover:text-[#202124] dark:hover:text-white transition px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/5"
          >
            Terms of Service
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
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-[#16865D]/10 dark:bg-[#16865D]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#FFD43B]/10 dark:bg-[#FFD43B]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16865D]/15 dark:bg-[#16865D]/10 border border-[#16865D]/30 text-[#16865D] dark:text-[#34D399] text-[11px] font-bold tracking-wider uppercase mb-4">
            <Shield className="w-3.5 h-3.5" />
            <span>Cryptographic Privacy Framework</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#202124] dark:text-white font-heading">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm sm:text-base text-[#5F6368] dark:text-[#9CA3AF] max-w-2xl leading-relaxed">
            Your creative concepts, video scripts, client keys, and identity tokens belong exclusively to you. Learn how our zero-telemetry architecture protects your data.
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs text-[#737373] dark:text-[#9CA3AF]">
            <span>Last Updated: <strong className="text-[#202124] dark:text-white">{lastUpdated}</strong></span>
            <span>•</span>
            <span>Zero Data Brokerage Guarantee</span>
          </div>
        </div>
      </section>

      {/* Main Privacy Pillars */}
      <main className="max-w-4xl mx-auto px-4 sm:px-8 py-10 sm:py-14 space-y-10">
        <div className="p-6 rounded-3xl bg-white dark:bg-[#1A1B20] border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#16865D]/10 text-[#16865D] dark:text-[#34D399] flex items-center justify-center font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">AES-256 Encrypted Vault</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              OAuth tokens for YouTube, Instagram, X/Twitter, and LinkedIn are encrypted with AES-256-GCM symmetric keys.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#FFD43B]/20 text-[#D97706] dark:text-[#FFD43B] flex items-center justify-center font-bold">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Zero Model Training</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              We never use your creative scripts, prompt history, or private media files to train any public AI model.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="w-9 h-9 rounded-2xl bg-[#FF6B5E]/15 text-[#E11D48] dark:text-[#FF6B5E] flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-[#202124] dark:text-white">Row Level Security</h3>
            <p className="text-xs text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
              PostgreSQL Row Level Security (RLS) ensures only your authenticated user ID can access your records.
            </p>
          </div>
        </div>

        {/* Section 1: Information Collected */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#16865D] text-white text-xs font-bold inline-flex items-center justify-center">
              1
            </span>
            Information We Collect &amp; Store
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              We only collect data strictly necessary to operate your RIIQX creator workspace:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5F6368] dark:text-[#9CA3AF]">
              <li>
                <strong>Account Credentials:</strong> Email address, hashed password (PBKDF2 with unique cryptographic salt), and profile metadata (display name, avatar URL).
              </li>
              <li>
                <strong>Connected Social Tokens:</strong> OAuth 2.0 access &amp; refresh tokens granted when you explicitly connect YouTube, Meta (Instagram/Facebook), X/Twitter, or LinkedIn. These are stored in an isolated server vault.
              </li>
              <li>
                <strong>Workspace Artifacts:</strong> Video scripts, storyboard scenes, hook variations, and scheduled post queue metadata created inside your workspace.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 2: How We Use Your Data */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#16865D] text-white text-xs font-bold inline-flex items-center justify-center">
              2
            </span>
            How We Process &amp; Protect Your Data
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              Your data is processed strictly to provide the features you initiate:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-[#5F6368] dark:text-[#9CA3AF]">
              <li>
                <strong>Publishing Execution:</strong> When you schedule a post, our worker retrieves your decrypted token at publish time and delivers the media to the platform API with an idempotency guard.
              </li>
              <li>
                <strong>AI Inference:</strong> When requesting script ideation or hook generation, prompts are routed directly through enterprise-grade endpoints (AWS Bedrock, Anthropic, Cohere, OpenAI, Groq) with commercial zero-retention contracts.
              </li>
              <li>
                <strong>No Data Resale:</strong> We never sell, rent, monetize, or disclose your personal data or creative concepts to third-party advertisers or data aggregators.
              </li>
            </ul>
          </div>
        </section>

        {/* Section 3: Token Vault Security */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#16865D] text-white text-xs font-bold inline-flex items-center justify-center">
              3
            </span>
            Token Vault Security &amp; Token Masking
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              RIIQX implements strict token isolation principles. Raw tokens, initialization vectors (IVs), and authentication tags are stored in a dedicated database table accessible solely via backend service role keys.
            </p>
            <p>
              Client-facing APIs return strictly sanitized objects with masked tokens (e.g., <code className="px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[11px]">ya29.***e0a</code>) ensuring credentials can never be inspected via browser developer tools.
            </p>
          </div>
        </section>

        {/* Section 4: Data Rights & Export */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#16865D] text-white text-xs font-bold inline-flex items-center justify-center">
              4
            </span>
            DPDP Act 2023 &amp; Global Data Principal Rights
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              Under India&apos;s <strong>Digital Personal Data Protection (DPDP) Act, 2023</strong> and international data protection standards (GDPR, CCPA), you are guaranteed specific statutory rights as a Data Principal:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-4 rounded-2xl border border-[#EAE7E1] dark:border-[#27282D] bg-[#FAF9F6] dark:bg-[#121316] flex items-start gap-3">
                <Download className="w-5 h-5 text-[#16865D] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#202124] dark:text-white">Right to Access &amp; Portability</h4>
                  <p className="text-[11px] text-[#737373] dark:text-[#9CA3AF] mt-1">
                    Export your complete transaction history, creator scripts, and account logs at any time in machine-readable JSON format.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl border border-[#EAE7E1] dark:border-[#27282D] bg-[#FAF9F6] dark:bg-[#121316] flex items-start gap-3">
                <Trash2 className="w-5 h-5 text-[#FF4D4F] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-xs text-[#202124] dark:text-white">Right to Erasure (&quot;Right to be Forgotten&quot;)</h4>
                  <p className="text-[11px] text-[#737373] dark:text-[#9CA3AF] mt-1">
                    Delete your profile, revoke social platform tokens, and purge all customer database records permanently within 48 hours.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-200">
              <strong>Zero Financial Credential Access:</strong> RIIQX never asks for, records, scrapes, or stores bank login credentials, UPI PINs, netbanking passwords, or one-time passwords (OTPs). Shopping screenshots analyzed by vision AI are processed ephemerally and discarded immediately after OCR analysis.
            </div>
          </div>
        </section>

        {/* Section 5: Security Inquiries & Data Officer */}
        <section className="space-y-3.5 bg-white dark:bg-[#1A1B20] p-6 sm:p-8 rounded-3xl border border-[#EAE7E1] dark:border-[#2E3038] shadow-xs">
          <h2 className="text-lg sm:text-xl font-black text-[#202124] dark:text-white flex items-center gap-2.5">
            <span className="w-6 h-6 rounded-full bg-[#16865D] text-white text-xs font-bold inline-flex items-center justify-center">
              5
            </span>
            Data Protection &amp; Grievance Redressal Officer
          </h2>
          <div className="space-y-3 text-xs sm:text-sm text-[#5F6368] dark:text-[#9CA3AF] leading-relaxed">
            <p>
              For privacy inquiries, statutory DPDP Act requests, or grievance escalation, please reach out to our designated Data Protection &amp; Grievance Redressal Officer:
            </p>
            <div className="p-4 rounded-2xl bg-[#FAF9F6] dark:bg-[#121316] border border-[#EAE7E1] dark:border-[#27282D] space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-[#737373] dark:text-[#9CA3AF]">Officer Name:</span>
                <strong className="text-[#202124] dark:text-white">Saswata Dey</strong>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-[#737373] dark:text-[#9CA3AF]">Official Email:</span>
                <a href="mailto:grievance@riiqx.com" className="text-[#16865D] font-mono hover:underline">grievance@riiqx.com</a>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-[#737373] dark:text-[#9CA3AF]">Statutory Redressal Window:</span>
                <span className="text-[#202124] dark:text-white">48 hours acknowledgment • 30 days resolution</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                <span className="text-[#737373] dark:text-[#9CA3AF]">Postal Address:</span>
                <span className="text-[#202124] dark:text-white">Data Governance Office, RIIQX Labs, Salt Lake Sector V, Kolkata, WB 700091, India</span>
              </div>
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
            <Link href="/terms" className="hover:text-[#202124] dark:hover:text-white transition">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-[#16865D] dark:text-[#34D399] hover:underline">
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

