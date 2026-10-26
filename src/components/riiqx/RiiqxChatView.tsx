'use client';

// =============================================================================
// RIIQX 2.0 — Tool-Using AI Agent Chat Workspace
// Step-by-Step Tool Execution Checklist • Media Cards • Emergency Stop
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
  Mic,
  Square,
  Play,
  ArrowRight,
  ChevronDown,
  Wand2,
  Video,
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
    selectedModel,
    setSelectedModel,
    models,
    setActiveTab,
    globalPrompt,
    setGlobalPrompt,
  } = useRiiqx();

  const [inputContent, setInputContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isModelMenuOpen, setIsModelMenuOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // If globalPrompt was passed from Home Dashboard, trigger it immediately
  useEffect(() => {
    if (globalPrompt) {
      sendMessage(globalPrompt);
      setGlobalPrompt('');
    }
  }, [globalPrompt, sendMessage, setGlobalPrompt]);

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
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-white">
      {/* Top Header / Model Switcher Bar */}
      <div className="h-12 border-b border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0">
        <div className="relative">
          <button
            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200 hover:border-violet-300 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-violet-600 animate-pulse" />
            <span>{selectedModel.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isModelMenuOpen && (
            <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2 shadow-xl z-50 animate-fadeIn">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                Choose Online AI Model
              </div>
              {models.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setSelectedModel(m);
                    setIsModelMenuOpen(false);
                  }}
                  className={`w-full text-left p-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    selectedModel.id === m.id
                      ? 'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-400 font-bold'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex flex-col">
                    <span>{m.name}</span>
                    <span className="text-[10px] text-slate-400 font-normal">{m.provider.toUpperCase()}</span>
                  </div>
                  {selectedModel.id === m.id && <Check className="w-4 h-4 text-violet-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Emergency Stop / Status */}
        <div className="flex items-center gap-2">
          {isGenerating && (
            <button
              onClick={cancelGeneration}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 dark:bg-red-950/40 dark:border-red-900/50 transition-colors"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Emergency STOP</span>
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Message Stream */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 lg:px-20 space-y-6">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto py-12">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-white mb-4 shadow-sm">
              <Bot className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              RIIQX Agentic Assistant
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Give a goal or task. I will analyze requirements, select tools, synthesize storyboards, plan social posts, and produce real exportable results.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full mt-6 text-left">
              {[
                'Create a trending reel from my travel photos',
                'Research viral hooks for tech shorts in India',
                'Inspect repository code and propose improvements',
                'Plan a 7-day social media calendar with captions',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-2xs transition-all text-left"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            const isUser = m.role === 'user';
            const isReelTask =
              !isUser &&
              (m.content.toLowerCase().includes('reel') ||
                m.content.toLowerCase().includes('photos') ||
                m.content.toLowerCase().includes('storyboard'));

            return (
              <div
                key={m.id}
                className={`flex w-full gap-3 sm:gap-4 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-600 to-pink-500 text-white shadow-2xs mt-1">
                    <Bot className="h-4 w-4" />
                  </div>
                )}

                <div
                  className={`relative max-w-2xl sm:max-w-3xl rounded-3xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm rounded-tr-none'
                      : 'border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-2xs rounded-tl-none'
                  }`}
                >
                  {/* Assistant Model Tag & Copy Button */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2 mb-3 text-[11px] text-slate-400">
                      <span className="font-bold text-violet-600 dark:text-violet-400">
                        {m.modelUsed || selectedModel.name}
                      </span>
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="flex items-center gap-1 hover:text-slate-900 dark:hover:text-white transition"
                      >
                        {copiedId === m.id ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                        <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  )}

                  {/* Tool Execution Step-by-Step Checklist (Matching Image 2 Screen 3) */}
                  {!isUser && isReelTask && (
                    <div className="mb-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2">
                      <p className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Tool Execution Loop
                      </p>

                      {/* Detected photos strip */}
                      <div className="flex items-center gap-2 overflow-x-auto pb-1">
                        {[
                          'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=200&auto=format&fit=crop&q=60',
                          'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&auto=format&fit=crop&q=60',
                          'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=60',
                        ].map((img, idx) => (
                          <div key={idx} className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                            <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                            <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                              <Check className="w-2.5 h-2.5" />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Checklist items */}
                      <div className="space-y-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300 pt-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Detected 12 travel photos</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Generating cinematic storyline</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Creating kinetic captions & hooks</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span>Preparing 9:16 video project...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Message Body */}
                  <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-wrap leading-relaxed">
                    {m.content}
                  </div>

                  {/* Reel Ready Output Card (Matching Image 2 Screen 3) */}
                  {!isUser && isReelTask && (
                    <div className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                          <span>Your Reel is Ready!</span>
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40">
                          30 FPS MP4
                        </span>
                      </div>

                      {/* Video Preview Card */}
                      <div
                        onClick={() => setActiveTab('editor')}
                        className="relative aspect-video rounded-xl overflow-hidden cursor-pointer group border border-slate-200"
                      >
                        <img
                          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80"
                          alt="Reel Preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/90 text-slate-900 flex items-center justify-center shadow-lg">
                            <Play className="w-5 h-5 ml-0.5" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-white">
                          00:28
                        </div>
                      </div>

                      {/* Suggested Caption */}
                      <div className="text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">Suggested Caption:</p>
                        <p className="italic">&ldquo;Lost in beautiful places 🌄 #travel #explore #adventure #india #mountains #wanderlust&rdquo;</p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => setActiveTab('editor')}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
                        >
                          <Wand2 className="w-3.5 h-3.5" />
                          <span>Edit in Studio</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('editor')}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Video className="w-3.5 h-3.5 text-pink-500" />
                          <span>Export Video</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Research Citations (if present) */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-4 border-t border-slate-100 dark:border-slate-800 pt-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                        Verified Sources & Citations
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {m.citations.map((c, idx) => (
                          <a
                            key={c.id}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 text-[11px] text-slate-600 dark:text-slate-300 hover:border-violet-300 hover:text-violet-600 transition"
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
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Persistent Composer (Matching Image 2 Screen 3 Bottom Composer) */}
      <div className="border-t border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-3 md:p-4 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-2">
          {/* Document Attachment Badges */}
          {attachedDocuments.length > 0 && (
            <div className="flex flex-wrap gap-2 pb-1">
              {attachedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 text-xs font-semibold"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="truncate max-w-[180px]">{doc.name}</span>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-center bg-slate-50 dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-2 focus-within:border-violet-400 focus-within:ring-2 focus-within:ring-violet-100 transition-all shadow-2xs">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <input
              type="text"
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              placeholder="Ask RIIQX anything or give a task..."
              className="w-full bg-transparent px-3 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
            />

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => setEnableWebSearch(!enableWebSearch)}
                title={enableWebSearch ? 'Web Search Active' : 'Toggle Web Search'}
                className={`p-2 rounded-full transition-colors ${
                  enableWebSearch
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                <Globe className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach files"
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full transition-colors"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!inputContent.trim() || isGenerating}
                className="w-9 h-9 rounded-full bg-slate-900 hover:bg-violet-600 text-white flex items-center justify-center transition-colors disabled:opacity-40 shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
