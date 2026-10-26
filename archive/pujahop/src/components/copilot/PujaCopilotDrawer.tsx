'use client';

// =============================================================================
// PujaHop Kolkata: Puja Copilot AI Drawer (Section 13)
// Bilingual Travel Assistant • Bengali & English NLP • Real Route Integration
// =============================================================================

import React, { useState } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { CopilotMessage } from '@/lib/ai/types';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Route,
  ArrowRight,
  Compass,
} from 'lucide-react';

export function PujaCopilotDrawer() {
  const { copilotOpen, setCopilotOpen, setCurrentTrip, setActiveTab } = usePujaHop();

  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init',
      role: 'assistant',
      content:
        'নমস্কার! আমি **PujaCopilot**, আপনার দুর্গাপূজা ভ্রমণ সঙ্গী।\n\nআপনি বাংলায় বা ইংরেজিতে বলতে পারেন। যেমন:\n- *"আমি দুপুর ২টো থেকে রাত ১০টা পর্যন্ত বেরোব। বেশি হাঁটতে পারব না। সেরা pandal দেখতে চাই।"*\n- *"North Kolkata-র সেরা traditional puja কোনগুলো?"*',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!copilotOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputValue('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, message: text }),
      });
      const data = await res.json();

      const assistantMsg: CopilotMessage = {
        id: 'asst-' + Date.now(),
        role: 'assistant',
        content: data.reply || 'Route optimized successfully.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        itineraryRecommendation: data.proposedItinerary,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: 'err-' + Date.now(),
          role: 'assistant',
          content: `দুঃখিত, সংযোগে সমস্যা হয়েছে। (${err.message})`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-full sm:max-w-md min-w-0 bg-[#0C0A1A] border-l border-amber-500/20 shadow-2xl flex flex-col">
      {/* Header (Matching Screen 6) */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#111017]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#D6A84F] to-[#E53935] flex items-center justify-center text-white shadow-md">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-bold text-white text-base">PujaCopilot AI</div>
            <div className="text-[11px] text-[#B7B1BC]">Ask anything about Kolkata Puja...</div>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          className="text-zinc-400 hover:text-white p-1.5 rounded-xl hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompt Chips (Section 16 & Mockup Screen 6) */}
      <div className="p-3 bg-[#171821] border-b border-white/5 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
        {[
          'আজ কোন পুজোগুলো খোলা?',
          'আমার Route বানাও',
          'Metro দিয়ে কোথায় যাব?',
          'কম হাঁটতে হয় এমন Route',
          'খাবার কোথায় পাব?',
          'বৃষ্টি হলে Plan বদলাও',
        ].map((chip) => (
          <button
            key={chip}
            onClick={() => handleSend(chip)}
            className="px-3 py-1.5 rounded-full bg-[#211923] hover:bg-[#D6A84F]/20 text-[#FFF7E8] hover:text-[#F5D887] border border-amber-500/25 whitespace-nowrap transition-all shadow-sm"
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs bg-[#08070D]">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                m.role === 'user' ? 'bg-[#D6A84F] text-black font-bold' : 'bg-[#E53935] text-white'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] p-4 rounded-2xl space-y-2 ${
                m.role === 'user'
                  ? 'bg-[#1F1929] text-white border border-white/10 rounded-tr-none shadow-md'
                  : 'bg-[#171821] text-[#FFF7E8] border border-white/10 rounded-tl-none leading-relaxed shadow-lg'
              }`}
            >
              <div className="whitespace-pre-line text-[13px]">{m.content}</div>

              {/* Proposed Itinerary CTA if returned */}
              {m.itineraryRecommendation && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setCurrentTrip(m.itineraryRecommendation!);
                      setActiveTab('route');
                      setCopilotOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#D6A84F] to-[#E53935] text-white font-bold text-[11px] shadow-md shadow-rose-950/40"
                  >
                    <Route className="w-3.5 h-3.5" />
                    <span>LOAD RECOMMENDED ITINERARY</span>
                  </button>
                </div>
              )}

              <div className="text-[10px] text-zinc-500 text-right">{m.timestamp}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs italic p-2 bg-[#171821] rounded-2xl border border-white/10">
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>Puja Copilot reasoning with Kolkata pandal &amp; metro data...</span>
          </div>
        )}
      </div>

      {/* Input Bar (Matching Screen 6) */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/10 bg-[#111017] flex items-center gap-2"
      >
        <div className="flex-1 flex items-center bg-[#171821] border border-white/10 rounded-2xl px-3.5 py-2 text-white shadow-inner focus-within:border-amber-400/40">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type in Bengali or English..."
            disabled={isLoading}
            className="flex-1 bg-transparent text-xs text-white placeholder-[#B7B1BC] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-[#D6A84F] to-[#F5D887] text-black font-bold flex items-center justify-center shadow-lg transition-all disabled:opacity-40 hover:scale-105 active:scale-95 flex-shrink-0"
          title="Send message"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
