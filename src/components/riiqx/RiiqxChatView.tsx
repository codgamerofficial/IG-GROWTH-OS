'use client';

// =============================================================================
// RIIQX — Primary AI Agent Conversational Workspace
// Cinematic Spacing • Real Research Citations • Task Observability • Document Drop
// =============================================================================

import React, { useState, useRef, useEffect } from 'react';
import { useRiiqx } from '@/context/RiiqxContext';
import {
  Send,
  Globe,
  Paperclip,
  CheckCircle2,
  ExternalLink,
  Bot,
  User,
  Copy,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';
import { parseUploadedTextFile } from '@/lib/riiqx/documents';

export function RiiqxChatView() {
  const {
    activeConversation,
    sendMessage,
    isGenerating,
    cancelGeneration,
    enableWebSearch,
    setEnableWebSearch,
    attachedDocuments,
    addAttachedDocument,
    removeAttachedDocument,
    selectedModel,
    setActiveTab,
  } = useRiiqx();

  const [inputContent, setInputContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputContent.trim() || isGenerating) return;
    const msg = inputContent;
    setInputContent('');
    await sendMessage(msg);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const doc = parseUploadedTextFile(text, file.name, file.type);
        addAttachedDocument(doc);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const messages = activeConversation?.messages || [];

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#030712]">
      {/* Scrollable Message Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-16 space-y-6">
        {messages.map((m) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={m.id}
              className={`flex w-full gap-3 sm:gap-4 ${
                isUser ? 'justify-end' : 'justify-start'
              }`}
            >
              {!isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30">
                  <Bot className="h-5 w-5" />
                </div>
              )}

              <div
                className={`relative max-w-2xl sm:max-w-3xl rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-950/40 rounded-tr-none'
                    : 'border border-[#1E2A4A] bg-[#070D1F] text-[#F8FAFC] shadow-xl rounded-tl-none'
                }`}
              >
                {/* Assistant Model Tag & Copy Button */}
                {!isUser && (
                  <div className="flex items-center justify-between border-b border-[#1E2A4A]/60 pb-2 mb-3 text-[11px] text-[#64748B]">
                    <span className="font-semibold text-cyan-400">
                      {m.modelUsed || selectedModel.name}
                    </span>
                    <button
                      onClick={() => handleCopy(m.id, m.content)}
                      className="flex items-center gap-1 hover:text-white transition"
                    >
                      {copiedId === m.id ? (
                        <Check className="h-3 w-3 text-emerald-400" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Message Body */}
                <div className="prose prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                  {m.content}
                </div>

                {/* Embedded Task Plan (if active) */}
                {m.taskPlan && (
                  <div className="mt-4 rounded-xl border border-cyan-500/30 bg-[#0B132B]/80 p-3.5 space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-bold text-white">
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4 text-cyan-400" />
                        <span>Autonomous Task Plan ({m.taskPlan.steps.length} Steps)</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('tasks')}
                        className="text-[10px] text-cyan-400 hover:underline font-mono"
                      >
                        View Execution &rarr;
                      </button>
                    </div>
                    <div className="space-y-1.5 text-[11px]">
                      {m.taskPlan.steps.map((s) => (
                        <div
                          key={s.id}
                          className="flex items-center justify-between rounded-lg bg-[#030712] p-2 border border-[#1E2A4A]"
                        >
                          <span className="truncate pr-2 text-[#94A3B8]">
                            {s.order}. {s.description}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                              s.status === 'completed'
                                ? 'bg-emerald-500/15 text-emerald-400'
                                : s.status === 'in_progress'
                                ? 'bg-cyan-500/15 text-cyan-400 animate-pulse'
                                : s.status === 'blocked'
                                ? 'bg-rose-500/15 text-rose-400'
                                : 'bg-[#1E2A4A] text-[#64748B]'
                            }`}
                          >
                            {s.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citations Footer */}
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-4 border-t border-[#1E2A4A]/80 pt-3">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                      Verified Research Citations
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {m.citations.map((c, idx) => (
                        <a
                          key={c.id}
                          href={c.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 rounded-lg border border-[#1E2A4A] bg-[#030712] px-2.5 py-1 text-[11px] text-[#94A3B8] hover:border-cyan-500/40 hover:text-cyan-400 transition"
                        >
                          <ExternalLink className="h-3 w-3" />
                          <span className="truncate max-w-[160px]">
                            [{idx + 1}] {c.title}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isUser && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#0B132B] text-white border border-[#1E2A4A]">
                  <User className="h-5 w-5 text-cyan-400" />
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Control Deck */}
      <div className="border-t border-[#1E2A4A] bg-[#070D1F]/90 p-4 sm:px-8 lg:px-16 backdrop-blur-md">
        {/* Attached Documents Tags */}
        {attachedDocuments.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-2">
            {attachedDocuments.map((doc) => (
              <span
                key={doc.id}
                className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-2.5 py-1 text-xs text-cyan-400"
              >
                <Paperclip className="h-3 w-3" />
                <span className="truncate max-w-[140px]">{doc.name}</span>
                <button
                  onClick={() => removeAttachedDocument(doc.id)}
                  className="hover:text-white"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative">
          <textarea
            value={inputContent}
            onChange={(e) => setInputContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Type your goal, task, or question for RIIQX..."
            rows={2}
            className="w-full resize-none rounded-2xl border border-[#1E2A4A] bg-[#030712] p-3.5 pr-28 text-xs sm:text-sm text-white placeholder-[#64748B] focus:border-cyan-500/50 focus:outline-none"
          />

          {/* Quick Actions in Input */}
          <div className="absolute right-3 bottom-3 flex items-center gap-2">
            {/* Search Toggle */}
            <button
              type="button"
              onClick={() => setEnableWebSearch(!enableWebSearch)}
              title={enableWebSearch ? 'Web Search: ON' : 'Web Search: OFF'}
              className={`flex h-8 w-8 items-center justify-center rounded-xl border transition ${
                enableWebSearch
                  ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400'
                  : 'border-[#1E2A4A] bg-[#070D1F] text-[#64748B] hover:text-white'
              }`}
            >
              <Globe className="h-4 w-4" />
            </button>

            {/* Document Attach */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.md,.json,.js,.ts,.py"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach Document Sandbox"
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#1E2A4A] bg-[#070D1F] text-[#64748B] hover:text-white transition"
            >
              <Paperclip className="h-4 w-4" />
            </button>

            {/* Send / Stop */}
            {isGenerating ? (
              <button
                type="button"
                onClick={cancelGeneration}
                className="flex h-8 px-3 items-center justify-center rounded-xl bg-rose-600 text-xs font-bold text-white shadow-lg shadow-rose-950/40 hover:brightness-110 transition"
              >
                Halt
              </button>
            ) : (
              <button
                type="submit"
                disabled={!inputContent.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-950/40 hover:brightness-110 transition disabled:opacity-40 disabled:hover:brightness-100"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
