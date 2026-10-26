'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useNuvexa } from '@/context/NuvexaContext';
import {
  Send,
  Square,
  Globe,
  Paperclip,
  CheckCircle2,
  Copy,
  Check,
  Sparkles,
  Bot,
  User,
  FileText,
  X,
  AlertCircle,
  ExternalLink,
  Download,
  UploadCloud,
} from 'lucide-react';
import { NuvexaEmblem } from './NuvexaEmblem';

export function NuvexaChatView() {
  const {
    activeConversation,
    sendMessage,
    isGenerating,
    cancelGeneration,
    selectedModel,
    setSelectedModel,
    models,
    enableWebSearch,
    setEnableWebSearch,
    attachedDocuments,
    addAttachedDocument,
    removeAttachedDocument,
    providerHealth,
  } = useNuvexa();

  const [input, setInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOllamaOnline = providerHealth?.ollama.status === 'online';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isGenerating) return;
    const msg = input;
    setInput('');
    sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const processFile = async (file: File) => {
    try {
      const text = await file.text();
      const res = await fetch('/api/nuvexa/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          rawContent: text,
          fileType: file.type || 'text/plain',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        addAttachedDocument(data.document);
      }
    } catch {
      alert('Failed to parse uploaded document.');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const exportConversationMarkdown = () => {
    if (!activeConversation) return;
    let md = `# ${activeConversation.title || 'NUVEXA Chat'}\n\n`;
    md += `*Exported from NUVEXA AI on ${new Date().toLocaleString()}*\n`;
    md += `*Model: ${selectedModel.name} (${selectedModel.license})*\n\n---\n\n`;

    for (const msg of activeConversation.messages) {
      const author = msg.role === 'user' ? '👤 User' : `♾️ NUVEXA (${msg.modelUsed || selectedModel.name})`;
      md += `### ${author}\n\n${msg.content}\n\n---\n\n`;
    }

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(activeConversation.title || 'chat').replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const starterPrompts = [
    {
      title: 'Analyze Local Model Architectures',
      desc: 'Compare Llama 3.2, Mistral, and Qwen 2.5 Coder for edge workloads.',
      prompt: 'Compare the architecture and trade-offs of Llama 3.2 3B, Mistral 7B, and Qwen 2.5 Coder for local development.',
    },
    {
      title: 'Generate FastAPI SSE Streamer',
      desc: 'Write a production Python FastAPI endpoint for Server-Sent Events.',
      prompt: 'Write a production-ready Python FastAPI service with an asynchronous endpoint that streams AI completion tokens via Server-Sent Events (SSE).',
    },
    {
      title: 'Open-Weight Licensing Audit',
      desc: 'Verify Apache 2.0 vs Llama Community terms for commercial software.',
      prompt: 'Provide a rigorous breakdown of Apache 2.0 vs Llama 3.2 Community License terms for deploying an enterprise multi-model platform.',
    },
    {
      title: 'Autonomous Multi-Step Plan',
      desc: 'Plan a zero-downtime database migration for PostgreSQL.',
      prompt: 'Create a step-by-step task plan to execute a zero-downtime PostgreSQL schema migration with pgvector integration.',
    },
  ];

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="relative flex h-full flex-1 flex-col overflow-hidden bg-[#030712]"
    >
      {/* Drag & Drop Overlay */}
      {isDragging && (
        <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-[#070D1F]/90 p-6 backdrop-blur-md border-2 border-dashed border-cyan-400">
          <UploadCloud className="h-12 w-12 text-cyan-400 animate-bounce mb-3" />
          <p className="text-lg font-bold text-white">Drop file to attach as untrusted context</p>
          <p className="text-xs text-[#94A3B8] mt-1">Supports .md, .txt, .json, .py, .ts, .csv</p>
        </div>
      )}

      {/* Chat Top Subheader Bar */}
      {activeConversation && activeConversation.messages.length > 0 && (
        <div className="flex items-center justify-between border-b border-[#1E2A4A] bg-[#070D1F]/80 px-4 py-2 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="font-semibold text-white truncate max-w-[280px]">
              {activeConversation.title || 'Conversation'}
            </span>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-[10px] text-cyan-300 border border-cyan-500/20 font-mono">
              {selectedModel.name}
            </span>
          </div>

          <button
            onClick={exportConversationMarkdown}
            className="flex items-center gap-1.5 rounded-lg border border-[#1E2A4A] bg-[#0B132B] px-2.5 py-1 text-xs text-[#94A3B8] hover:text-white hover:border-cyan-500/40 transition"
            title="Download Chat as Markdown"
          >
            <Download className="h-3 w-3 text-cyan-400" />
            <span className="hidden sm:inline">Export .md</span>
          </button>
        </div>
      )}

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {!activeConversation || activeConversation.messages.length === 0 ? (
          // Empty State
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-10 text-center">
            <NuvexaEmblem size={56} animate={true} />
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-white">
              NUVEXA AI Workspace
            </h2>
            <p className="mt-1 text-sm text-[#94A3B8]">
              One Assistant. Many Possibilities. • Powered by Open-Weight Intelligence.
            </p>

            {/* Offline notification card if Ollama not running */}
            {!isOllamaOnline && (
              <div className="mt-6 flex w-full items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left text-xs text-amber-200">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-400 mt-0.5" />
                <div>
                  <div className="font-semibold text-amber-300">Local Provider Notice</div>
                  <p className="mt-0.5 text-amber-200/80">
                    Ollama is currently offline at <code className="bg-black/30 px-1 py-0.5 rounded">http://localhost:11434</code>. Run <code className="bg-black/30 px-1 py-0.5 rounded text-amber-300">ollama run {selectedModel.modelString}</code> in your terminal to enable local zero-latency inference.
                  </p>
                </div>
              </div>
            )}

            {/* Starter Prompts Grid */}
            <div className="mt-8 grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {starterPrompts.map((sp, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(sp.prompt);
                    sendMessage(sp.prompt);
                  }}
                  className="flex flex-col items-start rounded-xl border border-[#1E2A4A] bg-[#070D1F] p-4 text-left transition hover:border-cyan-500/40 hover:bg-[#0B132B] active:scale-[0.98]"
                >
                  <span className="text-xs font-semibold text-cyan-400">{sp.title}</span>
                  <span className="mt-1 text-xs text-[#94A3B8]">{sp.desc}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          // Message Thread
          activeConversation.messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`mx-auto flex max-w-3xl gap-3 sm:gap-4 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#1E2A4A] bg-[#0B132B]">
                    <NuvexaEmblem size={18} />
                  </div>
                )}

                <div
                  className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[78%] ${
                    isUser
                      ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 text-white shadow-lg shadow-cyan-600/15'
                      : 'border border-[#1E2A4A] bg-[#070D1F] text-[#F8FAFC]'
                  }`}
                >
                  {/* Model & Source Meta Header */}
                  {!isUser && (
                    <div className="mb-2 flex items-center justify-between border-b border-[#1E2A4A]/60 pb-1.5 text-[10px] text-[#64748B]">
                      <span className="font-semibold text-cyan-400">
                        {msg.modelUsed || selectedModel.name}
                      </span>
                      <button
                        onClick={() => copyToClipboard(msg.content, msg.id)}
                        className="flex items-center gap-1 hover:text-white transition"
                        title="Copy Response"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {/* Body Text */}
                  <div className="whitespace-pre-wrap font-sans text-xs sm:text-sm">
                    {msg.content}
                    {msg.isStreaming && (
                      <span className="inline-block h-3.5 w-1.5 animate-pulse bg-cyan-400 ml-1 rounded-sm" />
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-500/30 bg-cyan-500/20 text-cyan-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Model Quick Switcher Ribbon */}
      <div className="flex items-center gap-1.5 overflow-x-auto border-t border-[#1E2A4A] bg-[#070D1F] px-4 py-1.5 text-xs">
        <span className="text-[10px] font-semibold text-[#64748B] shrink-0">Model:</span>
        {models.map((m) => (
          <button
            key={m.id}
            onClick={() => setSelectedModel(m)}
            className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] transition ${
              selectedModel.id === m.id
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                : 'text-[#94A3B8] hover:bg-[#0B132B] hover:text-white'
            }`}
          >
            {m.name.split(' (')[0]}
          </button>
        ))}
      </div>

      {/* Attached Documents Pill Bar */}
      {attachedDocuments.length > 0 && (
        <div className="flex items-center gap-2 border-t border-[#1E2A4A] bg-[#070D1F] px-4 py-2">
          <span className="text-[11px] font-semibold text-[#64748B] flex items-center gap-1">
            <Paperclip className="h-3 w-3" /> Context:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {attachedDocuments.map((doc) => (
              <span
                key={doc.id}
                className="flex items-center gap-1 rounded-md bg-[#0B132B] border border-[#1E2A4A] px-2 py-0.5 text-[11px] text-[#94A3B8]"
              >
                <FileText className="h-3 w-3 text-cyan-400" />
                <span className="max-w-[120px] truncate">{doc.fileName}</span>
                <button
                  onClick={() => removeAttachedDocument(doc.id)}
                  className="text-[#64748B] hover:text-rose-400 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Composer Input Area */}
      <div className="border-t border-[#1E2A4A] bg-[#070D1F] p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
          <div className="relative rounded-2xl border border-[#1E2A4A] bg-[#030712] p-2 transition focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/50">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask NUVEXA anything, drop files, or toggle live research..."
              rows={2}
              className="w-full resize-none bg-transparent px-2 text-xs sm:text-sm text-white placeholder-[#64748B] focus:outline-none"
            />

            {/* Bottom Bar: Capabilities & Actions */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Live Web Search Toggle */}
                <button
                  type="button"
                  onClick={() => setEnableWebSearch(!enableWebSearch)}
                  className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition ${
                    enableWebSearch
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-[#64748B] hover:bg-[#0B132B] hover:text-[#94A3B8]'
                  }`}
                  title="Enable Real Web Search & Citations (SearXNG / Open Web)"
                >
                  <Globe className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Web Search</span>
                  {enableWebSearch && <span className="text-[10px] text-cyan-400">ON</span>}
                </button>

                {/* File Attachment Button */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.md,.json,.csv,.py,.js,.ts,.tsx,.html"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-[#64748B] hover:bg-[#0B132B] hover:text-[#94A3B8] transition"
                  title="Attach Untrusted Document (.txt, .md, .json, .py, etc.)"
                >
                  <Paperclip className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Attach Doc</span>
                </button>
              </div>

              {/* Submit or Stop Button */}
              {isGenerating ? (
                <button
                  type="button"
                  onClick={cancelGeneration}
                  className="flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-rose-500 active:scale-95"
                >
                  <Square className="h-3.5 w-3.5 fill-current" />
                  <span>Stop</span>
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold text-white transition ${
                    input.trim()
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 shadow-md shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 active:scale-95'
                      : 'cursor-not-allowed bg-[#1E2A4A] text-[#64748B]'
                  }`}
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send</span>
                </button>
              )}
            </div>
          </div>
          <div className="mt-1.5 flex items-center justify-between px-1 text-[10px] text-[#64748B]">
            <span>Drag & drop documents anywhere to attach context</span>
            <span>Zero-Fabrication • Non-Firebase Private AI</span>
          </div>
        </form>
      </div>
    </div>
  );
}
