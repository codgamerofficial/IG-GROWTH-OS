'use client';

// =============================================================================
// RIIQX — Privacy, Legal & AI Disclosure Modals (Section 13 of Blueprint)
// Privacy Policy • Terms of Service • AI Usage Disclosure • About • Support
// =============================================================================

import React from 'react';
import {
  Shield,
  FileText,
  AlertCircle,
  Info,
  HelpCircle,
  X,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export type LegalDocType = 'privacy' | 'terms' | 'ai-disclosure' | 'about' | 'support';

interface RiiqxLegalModalProps {
  type: LegalDocType | null;
  onClose: () => void;
}

export function RiiqxLegalModal({ type, onClose }: RiiqxLegalModalProps) {
  if (!type) return null;

  const contentMap: Record<
    LegalDocType,
    { title: string; subtitle: string; icon: React.ElementType; body: React.ReactNode }
  > = {
    privacy: {
      title: 'Privacy Policy',
      subtitle: 'Zero-telemetry cryptographic security & data governance',
      icon: Shield,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#171A22] dark:text-slate-200">
          <p>
            <strong>Last Updated: October 2026</strong>
          </p>
          <p>
            RIIQX operates on a strict zero-compromise privacy framework. Your creative assets, scripts, voice syntheses, and account tokens belong solely to you.
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">1. Data Isolation</h4>
          <p>
            All OAuth tokens for YouTube, Instagram, Facebook, and WhatsApp are encrypted on the server side using AES-GCM-256 and are never sent to the client bundle. We never sell your personal information or media files to third-party data brokers.
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">2. AI Model Processing</h4>
          <p>
            When utilizing configured AI providers (AWS Bedrock, Anthropic, Cohere, OpenAI, Google Gemini), your prompt inputs and private assets are processed strictly via secure API contracts that guarantee zero training on customer data.
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">3. User Rights & Data Deletion</h4>
          <p>
            You have the absolute right to export your complete workspace archive at any time in standard JSON format, or permanently wipe your account and all associated media from our storage nodes with a single click.
          </p>
        </div>
      ),
    },
    terms: {
      title: 'Terms of Service',
      subtitle: 'Commercial rights, acceptable use & platform guidelines',
      icon: FileText,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#171A22] dark:text-slate-200">
          <p>
            <strong>Effective Date: October 2026</strong>
          </p>
          <p>
            By accessing or using RIIQX, you agree to comply with our Terms of Service and adhere to community guidelines across all target platforms.
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">1. Content Ownership & Commercial Rights</h4>
          <p>
            You retain 100% full commercial copyright to all original videos, scripts, audio mixes, and exported media generated inside RIIQX.
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">2. Social Platform Compliance</h4>
          <p>
            Users must abide by YouTube Community Guidelines, Meta Developer Policies, and WhatsApp Business Messaging Policies. Automated spamming, prohibited medical advice, or deceptive financial guarantees are strictly forbidden.
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">3. Service Availability</h4>
          <p>
            RIIQX relies on verified third-party platform APIs for social publishing. Platform quota limitations, temporary maintenance, or API token expirations are governed by the respective providers.
          </p>
        </div>
      ),
    },
    'ai-disclosure': {
      title: 'AI Usage Disclosure',
      subtitle: 'Transparency, synthetic media labeling & ethics standards',
      icon: AlertCircle,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#171A22] dark:text-slate-200">
          <p>
            <strong>Transparency & Ethics Standard</strong>
          </p>
          <p>
            RIIQX adheres to modern international standards regarding AI safety, synthetic media labeling, and creator attribution.
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">1. Synthetic Media Labeling</h4>
          <p>
            When publishing AI-generated content (including text-to-speech voiceovers, photorealistic AI avatars, or AI-synthesized b-roll), RIIQX automatically applies the appropriate platform flags (e.g., YouTube &ldquo;Altered or synthetic content&rdquo; badge).
          </p>
          <h4 className="text-sm font-bold pt-2 text-[#171A22] dark:text-white">2. No Guaranteed Virality</h4>
          <p>
            RIIQX provides research tools, hook pacing blueprints, and predictive retention curves based on established patterns. We never fabricate metrics or guarantee viral success. Quality content and authentic engagement remain the creator&apos;s responsibility.
          </p>
        </div>
      ),
    },
    about: {
      title: 'About RIIQX',
      subtitle: 'One Platform. Infinite Possibilities. Smarter Creation. Smarter Growth.',
      icon: Info,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#171A22] dark:text-slate-200">
          <p>
            <strong>RIIQX 2.0</strong> is the next-generation AI Creator OS and Social Media Productivity Platform.
          </p>
          <p>
            Our core mission is to unify the fragmented creator production pipeline into one seamless, responsive, and genuinely intelligent workspace:
          </p>
          <div className="p-3 rounded-xl bg-[#6750D8]/10 text-[#6750D8] dark:text-[#8B5CF6] font-semibold border border-[#6750D8]/20">
            Discover → Research → Ideate → Script → Storyboard → Create → Edit → Review → Schedule → Publish → Analyze → Improve.
          </div>
          <p>
            Whether producing YouTube Shorts, Instagram Reels, Facebook Reels, or managing WhatsApp broadcasts, RIIQX provides professional-grade tools with zero fluff.
          </p>
        </div>
      ),
    },
    support: {
      title: 'Contact & Support',
      subtitle: 'Technical assistance, integration help & creator community',
      icon: HelpCircle,
      body: (
        <div className="space-y-4 text-xs leading-relaxed text-[#171A22] dark:text-slate-200">
          <p>
            Need assistance with social account authorization, API keys, or video export rendering? Our engineering team is here to assist.
          </p>
          <div className="space-y-2.5 pt-2">
            <div className="p-3 rounded-xl border border-[#E5E4DE] dark:border-[#2A3347] bg-[#F5F5F0] dark:bg-[#141821] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#171A22] dark:text-white block">Email Support</span>
                <span className="text-[#777D88]">support@riiqx.ai</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#16865D]/10 text-[#16865D]">
                &lt; 2h Response
              </span>
            </div>

            <div className="p-3 rounded-xl border border-[#E5E4DE] dark:border-[#2A3347] bg-[#F5F5F0] dark:bg-[#141821] flex items-center justify-between">
              <div>
                <span className="font-bold text-[#171A22] dark:text-white block">Developer Documentation</span>
                <span className="text-[#777D88]">docs.riiqx.ai</span>
              </div>
              <ExternalLink className="w-4 h-4 text-[#777D88]" />
            </div>
          </div>
        </div>
      ),
    },
  };

  const current = contentMap[type];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-[#1C2230] border border-[#E5E4DE] dark:border-[#2A3347] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-[#EAE7E1] dark:border-[#2E2E2E] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center font-bold">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#202124] dark:text-white">
                {current.title}
              </h3>
              <p className="text-[11px] text-[#737373]">
                {current.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-[#FAF9F6] dark:hover:bg-[#202020] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {current.body}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] text-xs font-bold transition shadow-xs"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
