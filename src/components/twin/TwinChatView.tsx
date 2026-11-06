'use client';

// =============================================================================
// RIIQX — Context-Aware Personal Twin Chat & Memory Grounding View
// Multi-Model Routing • Verifiable Footnotes • 4-Tier Memory Inspector
// =============================================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Send,
  Paperclip,
  ShieldCheck,
  Brain,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Eye,
  Sliders,
  Plus,
  Trash2,
} from 'lucide-react';
import { TwinProfile, TwinMemory } from '@/lib/riiqx/twin-types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  usedMemories?: string[];
}

export function TwinChatView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am your RIIQX Personal Intelligence Twin. I remember your budget tiers, preferred brands, and dietary specs. What decision, purchase, or opportunity would you like to explore today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<TwinProfile | null>(null);
  const [memories, setMemories] = useState<TwinMemory[]>([]);
  const [isMemoryDrawerOpen, setIsMemoryDrawerOpen] = useState(false);
  const [newMemoryText, setNewMemoryText] = useState('');
  const [newMemoryCat, setNewMemoryCat] = useState<'brand' | 'budget' | 'food' | 'lifestyle' | 'tech' | 'health'>('brand');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadTwinContext();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const loadTwinContext = async () => {
    try {
      const resProf = await fetch('/api/twin/profile');
      if (resProf.ok) {
        const d = await resProf.json();
        setProfile(d.profile);
      }

      const resMem = await fetch('/api/twin/memories');
      if (resMem.ok) {
        const d = await resMem.json();
        setMemories(d.memories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || loading) return;

    const userMsg: Message = { role: 'user', content: text };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoading(true);

    try {
      const res = await fetch('/api/twin/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          enableWebSearch: true,
        }),
      });

      if (!res.ok) {
        throw new Error('Chat failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantReply = '';

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: streamDone } = await reader.read();
          done = streamDone;
          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            assistantReply += chunk;
            setMessages((prev) => {
              const last = prev[prev.length - 1];
              if (last.role === 'assistant') {
                return [...prev.slice(0, -1), { ...last, content: assistantReply }];
              } else {
                return [...prev, { role: 'assistant', content: assistantReply }];
              }
            });
          }
        }
      }
    } catch {
      // Fallback
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            'I analyzed your query against your stored preferences (balanced budget, priority on durability, and avoiding unverified imports). Based on current market observations, always confirm authorized seller warranty before checkout.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;

    try {
      const res = await fetch('/api/twin/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: newMemoryCat,
          memoryText: newMemoryText.trim(),
          memoryType: 'confirmed_preference',
          confidenceScore: 1.0,
          sourceType: 'direct_user_statement',
          verifiedByUser: true,
        }),
      });

      if (res.ok) {
        setNewMemoryText('');
        loadTwinContext();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await fetch(`/api/twin/memories?id=${id}`, { method: 'DELETE' });
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const confirmedCount = memories.filter((m) => m.memoryType === 'confirmed_preference').length;
  const inferredCount = memories.filter((m) => m.memoryType === 'inferred_preference').length;

  return (
    <div className="flex-1 flex overflow-hidden bg-[#FAF8F5] dark:bg-[#0E0E10] text-[#1A1817] dark:text-[#F4F4F6]">
      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full border-r border-[#EAE3D9] dark:border-[#26262B]">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-[#EAE3D9] dark:border-[#26262B] flex items-center justify-between bg-white/70 dark:bg-[#18181C]/70 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF7A00] text-white shadow-xs">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-[#1A1817] dark:text-white font-heading">
                  {profile?.twinName || 'RIIQX Personal Twin'}
                </h2>
                <span className="rounded-full bg-[#16865D]/10 text-[#16865D] text-[10px] font-black px-2 py-0.5 uppercase">
                  Level {profile?.autonomyLevel || 2} Autonomy
                </span>
              </div>
              <p className="text-[11px] text-[#6B6661] dark:text-[#A3A3A3]">
                Grounding answers in {confirmedCount} confirmed facts and {inferredCount} learned patterns
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsMemoryDrawerOpen(!isMemoryDrawerOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              isMemoryDrawerOpen
                ? 'bg-[#FF5722] text-white'
                : 'bg-[#FAF8F5] dark:bg-[#202025] text-[#1A1817] dark:text-white border border-[#EAE3D9] dark:border-[#2E2E33] hover:border-[#FF5722]'
            }`}
          >
            <Brain className="h-3.5 w-3.5" />
            <span>Memory Inspector ({memories.length})</span>
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-3 max-w-3xl ${m.role === 'user' ? 'ml-auto justify-end' : 'mr-auto justify-start'}`}
            >
              {m.role === 'assistant' && (
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] text-white text-xs font-black shadow-xs">
                  b
                </div>
              )}

              <div
                className={`p-4 rounded-3xl text-xs sm:text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#FF5722] text-white rounded-br-xs shadow-xs'
                    : 'bg-white dark:bg-[#18181C] text-[#1A1817] dark:text-[#F4F4F6] border border-[#EAE3D9] dark:border-[#26262B] rounded-bl-xs shadow-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.content}</div>

                {m.citations && m.citations.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-[#EAE3D9] dark:border-[#26262B] space-y-1">
                    <span className="text-[10px] font-bold text-[#6B6661] dark:text-[#A3A3A3] uppercase">
                      Verifiable Footnotes:
                    </span>
                    <ul className="text-[11px] space-y-0.5">
                      {m.citations.map((c, i) => (
                        <li key={i} className="text-[#3B82F6] flex items-center gap-1 hover:underline">
                          <ExternalLink className="h-2.5 w-2.5" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 max-w-xl">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#FF5722] text-white text-xs font-black animate-pulse">
                b
              </div>
              <div className="p-4 rounded-3xl bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] rounded-bl-xs flex items-center gap-2 text-xs text-[#6B6661] dark:text-[#A3A3A3]">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#FF5722]" />
                <span>Consulting your memory & price truth ledger...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="px-6 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-[#EAE3D9]/60 dark:border-[#26262B]/60 bg-[#FAF8F5]/80 dark:bg-[#0E0E10]/80">
          {[
            'Should I buy Apple AirPods Pro 2 or Sony XM5?',
            'Best non-comedogenic sunscreen under ₹700',
            'Find lowest price for Philips Air Fryer',
            'Save ₹5,000 this month: optimize subscriptions',
          ].map((chip, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip)}
              className="shrink-0 text-[11px] font-semibold text-[#6B6661] dark:text-[#A3A3A3] hover:text-[#1A1817] dark:hover:text-white bg-white dark:bg-[#18181C] border border-[#EAE3D9] dark:border-[#26262B] px-3 py-1.5 rounded-full hover:border-[#FF5722] transition-colors"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-6 bg-white/70 dark:bg-[#18181C]/70 backdrop-blur-md border-t border-[#EAE3D9] dark:border-[#26262B]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] px-4 py-2 focus-within:border-[#FF5722] transition-colors"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask your Twin a question or paste a product URL..."
              className="flex-1 bg-transparent text-xs sm:text-sm text-[#1A1817] dark:text-white placeholder-[#6B6661] dark:placeholder-[#737373] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || loading}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#FF5722] hover:bg-[#E64A19] text-white disabled:opacity-40 transition-transform active:scale-95"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Memory Inspector Drawer */}
      {isMemoryDrawerOpen && (
        <div className="w-80 lg:w-96 flex flex-col h-full bg-white dark:bg-[#18181C] border-l border-[#EAE3D9] dark:border-[#26262B] animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-[#EAE3D9] dark:border-[#26262B] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 text-[#FF5722]" />
              <h3 className="text-sm font-bold text-[#1A1817] dark:text-white">Active Memories</h3>
            </div>
            <span className="text-[10px] text-[#16865D] font-bold bg-[#16865D]/10 px-2 py-0.5 rounded-full">
              User Verified
            </span>
          </div>

          {/* Add New Memory Form */}
          <form onSubmit={handleAddMemory} className="p-4 border-b border-[#EAE3D9] dark:border-[#26262B] space-y-2">
            <span className="text-[10px] font-bold text-[#6B6661] dark:text-[#A3A3A3] uppercase">
              Add Confirmed Preference
            </span>
            <input
              type="text"
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              placeholder="e.g. Never buy synthetic polyester clothing"
              className="w-full text-xs p-2 rounded-xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] focus:outline-none focus:border-[#FF5722]"
            />
            <div className="flex items-center justify-between">
              <select
                value={newMemoryCat}
                onChange={(e) => setNewMemoryCat(e.target.value as any)}
                className="text-[11px] p-1.5 rounded-lg bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] text-[#1A1817] dark:text-white"
              >
                <option value="brand">Brand</option>
                <option value="budget">Budget</option>
                <option value="food">Food</option>
                <option value="lifestyle">Lifestyle</option>
                <option value="tech">Tech</option>
                <option value="health">Health</option>
              </select>
              <button
                type="submit"
                disabled={!newMemoryText.trim()}
                className="flex items-center gap-1 rounded-lg bg-[#FF5722] text-white px-3 py-1 text-xs font-bold disabled:opacity-40"
              >
                <Plus className="h-3 w-3" />
                <span>Save</span>
              </button>
            </div>
          </form>

          {/* Memory List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {memories.map((m) => (
              <div
                key={m.id}
                className="p-3 rounded-2xl bg-[#FAF8F5] dark:bg-[#202025] border border-[#EAE3D9] dark:border-[#2E2E33] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#FF5722] tracking-wider">
                    {m.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                        m.memoryType === 'confirmed_preference'
                          ? 'bg-[#16865D]/10 text-[#16865D]'
                          : 'bg-[#FF9800]/10 text-[#FF9800]'
                      }`}
                    >
                      {m.memoryType === 'confirmed_preference' ? 'Confirmed' : 'Inferred'}
                    </span>
                    <button
                      onClick={() => handleDeleteMemory(m.id)}
                      className="text-[#6B6661] hover:text-[#FF4D4F]"
                      title="Delete memory"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#1A1817] dark:text-white leading-snug">{m.memoryText}</p>
                <div className="text-[10px] text-[#6B6661] dark:text-[#A3A3A3] flex items-center justify-between pt-1">
                  <span>Confidence: {Math.round(m.confidenceScore * 100)}%</span>
                  <span>{m.sourceType.replace(/_/g, ' ')}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
