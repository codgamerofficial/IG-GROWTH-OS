'use client';

// =============================================================================
// PujaHop Kolkata: Copilot AI Highlight Showcase Card
// Layer 4: AI Layer • Real Bengali & Banglish prompt triggers with Agent Router
// =============================================================================

import React from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { Sparkles, MessageSquare, ArrowRight, Bot, ShieldCheck } from 'lucide-react';

export function CopilotHighlightCard() {
  const { setCopilotOpen } = usePujaHop();

  const prompts = [
    'আজকের সেরা পুজো কোনগুলো?',
    'আমাদের ৪ জন, বেশি হাঁটতে পারব না — রুট বানাও',
    'Metro দিয়ে North Kolkata কীভাবে ঘুরব?',
    'কম ভিড়ের মণ্ডপ কোনগুলো এখন?',
    'খাবারের সেরা জায়গা কোথায়?',
    'বৃষ্টি হলে Plan কীভাবে বদলাব?',
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-[#151128] via-[#0E0C1C] to-[#0A0915] p-6 sm:p-8 space-y-6 shadow-2xl">
      {/* Background Subtle AI Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-0.5 text-xs font-semibold text-amber-300">
            <Bot className="w-3.5 h-3.5 text-amber-400" />
            <span>Puja Copilot AI • Connected to Live Database</span>
          </div>

          <h3 className="font-bengali text-2xl sm:text-3xl font-bold text-[#FFF7E8] leading-snug">
            “নমস্কার! আজ কলকাতায় তোমার পুজোটা কেমন হবে?”
          </h3>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            তোমার সময়, হাঁটার ক্ষমতা, গ্রুপের সদস্যসংখ্যা এবং মেট্রোর অবস্থান বিবেচনা করে রুট তৈরি করবে
            Puja Copilot। কোনো কাল্পনিক তথ্য নয় — সরাসরি রেজিস্ট্রি এবং OSRM ইঞ্জিন থেকে পাওয়া তথ্যের ভিত্তিতে।
          </p>
        </div>

        <button
          onClick={() => setCopilotOpen(true)}
          className="self-start md:self-auto flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-600 to-red-600 hover:from-amber-600 hover:to-red-700 text-white font-bold px-6 py-3.5 text-xs sm:text-sm shadow-xl shadow-rose-950/50 transition-all hover:scale-105 active:scale-95 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>START COPILOT CHAT</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Prompt Chips */}
      <div className="relative z-10 pt-2 border-t border-white/5 space-y-2">
        <div className="text-[11px] text-zinc-400 font-medium flex items-center gap-1">
          <MessageSquare className="w-3 h-3 text-amber-400" />
          <span>Quick Bengali Prompts:</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {prompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setCopilotOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 text-xs text-zinc-200 transition-all active:scale-95 text-left"
            >
              💬 {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
