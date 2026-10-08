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
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-[#0C0A1A] border-l border-amber-500/20 shadow-2xl flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#121024]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-white text-sm">Puja Copilot AI</div>
            <div className="text-[10px] text-amber-300 font-medium">Kolkata Travel Assistant</div>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          className="text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompt Chips (Phase 17) */}
      <div className="p-3 bg-white/5 border-b border-white/5 flex items-center gap-1.5 overflow-x-auto text-[11px] no-scrollbar">
        <button
          onClick={() =>
            handleSend('আমরা ৪ জন। দুপুর ২টা থেকে রাত ১০টা পর্যন্ত বেরোব। বেশি হাঁটতে পারব না। ১০টা best pandal দেখতে চাই।')
          }
          className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 whitespace-nowrap"
        >
          আমাদের ৪ জন (দুপুর ২টা - রাত ১০টা)
        </button>

        <button
          onClick={() => handleSend('বেশি হাঁটতে চাই না, মেট্রো দিয়ে সেরা প্যান্ডেলগুলো দেখাও।')}
          className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 whitespace-nowrap"
        >
          বেশি হাঁটতে চাই না
        </button>

        <button
          onClick={() => handleSend('সেরা ১০টা pandal-এর রুট বানাও।')}
          className="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 whitespace-nowrap"
        >
          সেরা ১০টা pandal
        </button>

        <button
          onClick={() => handleSend('North Kolkata route plan করে দাও।')}
          className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 whitespace-nowrap"
        >
          North Kolkata route
        </button>

        <button
          onClick={() => handleSend('South Kolkata route plan করে দাও।')}
          className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/30 whitespace-nowrap"
        >
          South Kolkata route
        </button>

        <button
          onClick={() => handleSend('আজকের জন্য একটি বাস্তবসম্মত route বানাও।')}
          className="px-2.5 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/30 whitespace-nowrap"
        >
          আজকের route বানাও
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2.5 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${
                m.role === 'user' ? 'bg-amber-500 text-black font-bold' : 'bg-rose-600 text-white'
              }`}
            >
              {m.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 ${
                m.role === 'user'
                  ? 'bg-amber-500/20 text-white border border-amber-500/30 rounded-tr-none'
                  : 'bg-[#15132B] text-zinc-200 border border-white/10 rounded-tl-none leading-relaxed'
              }`}
            >
              <div className="whitespace-pre-line">{m.content}</div>

              {/* Proposed Itinerary CTA if returned */}
              {m.itineraryRecommendation && (
                <div className="pt-2 border-t border-white/10">
                  <button
                    onClick={() => {
                      setCurrentTrip(m.itineraryRecommendation!);
                      setActiveTab('route');
                      setCopilotOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-600 text-white font-bold text-[11px] shadow-md shadow-rose-950/40"
                  >
                    <Route className="w-3.5 h-3.5" />
                    <span>LOAD RECOMMENDED ITINERARY</span>
                  </button>
                </div>
              )}

              <div className="text-[9px] text-zinc-500 text-right">{m.timestamp}</div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-400 text-xs italic p-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
            <span>Puja Copilot reasoning with Kolkata pandal & metro data...</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-white/10 bg-[#121024] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask in Bengali or English..."
          className="flex-1 bg-[#1A1830] border border-white/15 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50"
        />
        <button
          type="submit"
          disabled={!inputValue.trim() || isLoading}
          className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-black flex items-center justify-center disabled:opacity-50 transition-all flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
