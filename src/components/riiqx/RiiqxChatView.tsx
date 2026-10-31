'use client';

// =============================================================================
// RIIQX 2.0 — Tool-Using AI Agent Chat Workspace
// Streaming Responses • Zero Stuck Cards • Responsive Adaptive Layout
// =============================================================================

import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Plus,
  Trash2,
  RotateCcw,
  AlertTriangle,
  Code as CodeIcon,
  X,
} from 'lucide-react';
import { parseUploadedTextFile } from '@/lib/riiqx/documents';
import { AIThinkingOrb } from '@/components/riiqx/ai/AIThinkingOrb';

/**
 * Safe mathematical formula and symbol formatter
 * Converts LaTeX expressions into clean, legible mathematical typography
 * Handles Bengali Unicode numerals and text without escaping or corruption
 */
function formatMathText(latex: string): string {
  if (!latex) return '';
  let out = latex.trim();
  // Strip delimiters
  out = out.replace(/^(\$\$|\$|\\\[|\\\(|\\\)|\\])/, '').replace(/(\$\$|\$|\\\[|\\\(|\\\)|\\])$/, '').trim();
  
  // Fractions: \frac{a}{b} -> (a / b)
  out = out.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');
  out = out.replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)');
  
  // Roots
  out = out.replace(/\\sqrt\[(.*?)\]\{(.*?)\}/g, '$1√($2)');
  out = out.replace(/\\sqrt\{(.*?)\}/g, '√($1)');
  
  // Common math symbols
  out = out.replace(/\\times/g, '×');
  out = out.replace(/\\cdot/g, '·');
  out = out.replace(/\\div/g, '÷');
  out = out.replace(/\\pm/g, '±');
  out = out.replace(/\\mp/g, '∓');
  out = out.replace(/\\approx/g, '≈');
  out = out.replace(/\\neq/g, '≠');
  out = out.replace(/\\leq?/g, '≤');
  out = out.replace(/\\geq?/g, '≥');
  out = out.replace(/\\infty/g, '∞');
  out = out.replace(/\\in\b/g, '∈');
  out = out.replace(/\\to|\\rightarrow/g, '→');
  out = out.replace(/\\leftarrow/g, '←');
  
  // Greek & calculus
  out = out.replace(/\\int/g, '∫');
  out = out.replace(/\\sum/g, '∑');
  out = out.replace(/\\prod/g, '∏');
  out = out.replace(/\\partial/g, '∂');
  out = out.replace(/\\alpha/g, 'α');
  out = out.replace(/\\beta/g, 'β');
  out = out.replace(/\\gamma/g, 'γ');
  out = out.replace(/\\delta/g, 'δ');
  out = out.replace(/\\Delta/g, 'Δ');
  out = out.replace(/\\theta/g, 'θ');
  out = out.replace(/\\lambda/g, 'λ');
  out = out.replace(/\\mu/g, 'μ');
  out = out.replace(/\\pi/g, 'π');
  out = out.replace(/\\sigma/g, 'σ');
  out = out.replace(/\\omega/g, 'ω');
  
  // Superscripts & Subscripts
  out = out.replace(/\^2\b/g, '²');
  out = out.replace(/\^3\b/g, '³');
  out = out.replace(/\^\{2\}/g, '²');
  out = out.replace(/\^\{3\}/g, '³');
  out = out.replace(/\^\{([0-9a-zA-Z+-]+)\}/g, '^($1)');
  out = out.replace(/_\{([0-9a-zA-Z+-]+)\}/g, '_($1)');
  
  // Brackets & text wrappers
  out = out.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  out = out.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');
  out = out.replace(/\\text\{([^{}]+)\}/g, '$1');
  out = out.replace(/\\mathrm\{([^{}]+)\}/g, '$1');
  out = out.replace(/\\mathbf\{([^{}]+)\}/g, '$1');
  
  // Clean remaining stray backslashes
  out = out.replace(/\\([a-zA-Z]+)/g, '$1');
  out = out.replace(/\\/g, '');
  
  return out;
}

/**
 * Formats inline text styling: **bold**, `inline-code`, *italic*, and residual LaTeX
 */
function renderFormattedText(text: string): React.ReactNode {
  if (!text) return null;

  // Clean any remaining un-delimited LaTeX fractions
  const cleanText = text
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1 / $2)')
    .replace(/\\frac\s*(\d+)\s*(\d+)/g, '($1 / $2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, '√($1)')
    .replace(/\\times/g, '×')
    .replace(/\\cdot/g, '·')
    .replace(/\\approx/g, '≈')
    .replace(/\\neq/g, '≠')
    .replace(/\\leq?/g, '≤')
    .replace(/\\geq?/g, '≥')
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³');

  // Tokenize by **bold**, `code`, and *italic*
  const tokens = cleanText.split(/(\*\*[^*]+\*\*|`[^`]+`|\*[^*]+\*)/g);
  return tokens.map((token, i) => {
    if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      return (
        <strong key={i} className="font-bold text-[#202124] dark:text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith('`') && token.endsWith('`') && token.length > 2) {
      return (
        <code
          key={i}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-[#FAF9F6] dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] font-mono text-[11px] text-[#202124] dark:text-[#FFD43B]"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith('*') && token.endsWith('*') && token.length > 2) {
      return (
        <em key={i} className="italic text-[#737373] dark:text-[#A3A3A3]">
          {token.slice(1, -1)}
        </em>
      );
    }
    return token;
  });
}

/**
 * Renders an inline text line with support for $...$ inline math, bare LaTeX formulas (\frac, \sqrt), **bold**, and Bengali unicode
 */
function renderInlineContent(line: string): React.ReactNode {
  if (!line) return '';
  
  // Normalize bare LaTeX patterns outside of $ delimiters: \frac{a}{b} -> $ \frac{a}{b} $
  const normalized = line
    .replace(/(?<!\$)\\frac\{([^{}]+)\}\{([^{}]+)\}(?!\$)/g, '$$$$ \\frac{$1}{$2} $$$$')
    .replace(/(?<!\$)\\sqrt\{([^{}]+)\}(?!\$)/g, '$$$$ \\sqrt{$1} $$$$');

  const parts: React.ReactNode[] = [];
  const mathRegex = /\$([^$]+)\$/g;
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = mathRegex.exec(normalized)) !== null) {
    if (match.index > lastIdx) {
      parts.push(renderFormattedText(normalized.slice(lastIdx, match.index)));
    }
    const rawFormula = match[1];
    const formatted = formatMathText(rawFormula);
    parts.push(
      <span
        key={`math-${match.index}`}
        className="inline-block px-2 py-0.5 mx-1 rounded-md bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] font-mono text-xs font-semibold border border-[#FFD43B]/40 align-middle"
      >
        {formatted}
      </span>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < normalized.length) {
    parts.push(renderFormattedText(normalized.slice(lastIdx)));
  }

  return parts.length > 0 ? parts : renderFormattedText(line);
}

/**
 * Lightweight safe markdown & mathematical notation formatter
 */
function MarkdownRenderer({ content, onRetry }: { content: string; onRetry?: () => void }) {
  const [copiedCodeIdx, setCopiedCodeIdx] = useState<number | null>(null);

  const handleCopyCode = (code: string, idx: number) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeIdx(idx);
    setTimeout(() => setCopiedCodeIdx(null), 2000);
  };

  // Parse code blocks & block math ($$...$$ or \[...\])
  const parts = useMemo(() => {
    const segments: Array<{ type: 'text' | 'code' | 'math'; text: string; lang?: string }> = [];
    const blockRegex = /(?:```([a-zA-Z0-9_-]*)\n([\s\S]*?)```)|(?:\$\$([\s\S]*?)\$\$)|(?:\\\[([\s\S]*?)\\\])/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        segments.push({ type: 'text', text: content.slice(lastIndex, match.index) });
      }

      if (match[1] !== undefined || match[2] !== undefined) {
        // Code block
        segments.push({
          type: 'code',
          lang: match[1] || 'plaintext',
          text: (match[2] || '').trimEnd(),
        });
      } else if (match[3] !== undefined || match[4] !== undefined) {
        // Block Math
        segments.push({
          type: 'math',
          text: (match[3] || match[4] || '').trim(),
        });
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      segments.push({ type: 'text', text: content.slice(lastIndex) });
    }

    return segments;
  }, [content]);

  // Check if content is an error / notice callout
  const isErrorNotice = content.includes('⚠️') || content.includes('Gateway Notice') || content.includes('Service Error');

  if (isErrorNotice) {
    return (
      <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/30 p-4 space-y-3">
        <div className="flex items-start gap-2.5 text-amber-900 dark:text-amber-200 font-semibold text-xs sm:text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div className="flex-1 whitespace-pre-wrap leading-relaxed">
            {content.replace(/^>\s*/gm, '')}
          </div>
        </div>
        {onRetry && (
          <div className="pt-2 flex items-center gap-2 border-t border-amber-200/60 dark:border-amber-900/40">
            <button
              onClick={onRetry}
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Request</span>
            </button>
            <span className="text-[11px] text-amber-700/80 dark:text-amber-400">
              Or switch models in the selector above
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 text-xs sm:text-sm leading-relaxed text-[#171A22] dark:text-[#FFFFFF]">
      {parts.map((part, idx) => {
        if (part.type === 'code') {
          return (
            <div
              key={idx}
              className="my-3 rounded-2xl overflow-hidden border border-[#2A3347] bg-[#141821] text-slate-100 font-mono text-xs shadow-md"
            >
              <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#1C2230] border-b border-[#2A3347] text-[11px] text-[#777D88]">
                <span className="font-semibold uppercase tracking-wider">{part.lang}</span>
                <button
                  onClick={() => handleCopyCode(part.text, idx)}
                  className="flex items-center gap-1 hover:text-white transition"
                >
                  {copiedCodeIdx === idx ? (
                    <Check className="w-3 h-3 text-[#16865D]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                  <span>{copiedCodeIdx === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="p-3.5 overflow-x-auto text-[11.5px] leading-relaxed">
                <code>{part.text}</code>
              </pre>
            </div>
          );
        }

        if (part.type === 'math') {
          const formattedFormula = formatMathText(part.text);
          return (
            <div
              key={idx}
              className="my-3 p-3.5 rounded-2xl bg-[#FAF9F6] dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-center font-mono text-xs sm:text-sm text-[#202124] dark:text-[#FFD43B] shadow-2xs overflow-x-auto"
            >
              <span className="font-semibold tracking-wide">{formattedFormula}</span>
            </div>
          );
        }

        // Render plain/markdown text
        const lines = part.text.split('\n');
        return (
          <div key={idx} className="space-y-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) {
                return <div key={lineIdx} className="h-2" />;
              }

              // Heading 1-3
              if (trimmed.startsWith('### ')) {
                return (
                  <h4 key={lineIdx} className="text-sm font-bold text-[#202124] dark:text-white pt-1">
                    {renderInlineContent(trimmed.slice(4))}
                  </h4>
                );
              }
              if (trimmed.startsWith('## ')) {
                return (
                  <h3 key={lineIdx} className="text-base font-extrabold text-[#202124] dark:text-white pt-2">
                    {renderInlineContent(trimmed.slice(3))}
                  </h3>
                );
              }
              if (trimmed.startsWith('# ')) {
                return (
                  <h2 key={lineIdx} className="text-lg font-extrabold text-[#202124] dark:text-white pt-2">
                    {renderInlineContent(trimmed.slice(2))}
                  </h2>
                );
              }

              // Blockquote >
              if (trimmed.startsWith('> ')) {
                return (
                  <blockquote key={lineIdx} className="border-l-2 border-[#FFD43B] pl-3 py-1 my-1 italic text-[#202124]/90 dark:text-white/90 bg-[#FFD43B]/5 rounded-r-lg">
                    {renderInlineContent(trimmed.slice(2))}
                  </blockquote>
                );
              }

              // Numbered lists e.g. 1. , 2. 
              const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numberedMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="font-bold text-[#FFD43B] shrink-0 text-xs mt-0.5">{numberedMatch[1]}.</span>
                    <span className="flex-1">{renderInlineContent(numberedMatch[2])}</span>
                  </div>
                );
              }

              // Bullet points
              if (trimmed.startsWith('- ') || trimmed.startsWith('* ') || trimmed.startsWith('• ')) {
                const bulletContent = trimmed.startsWith('• ') ? trimmed.slice(2) : trimmed.slice(2);
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FFD43B] mt-1.5 shrink-0" />
                    <span className="flex-1">{renderInlineContent(bulletContent)}</span>
                  </div>
                );
              }

              return (
                <p key={lineIdx} className="whitespace-pre-wrap break-words">
                  {renderInlineContent(line)}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export function RiiqxChatView() {
  const {
    activeConversation,
    sendMessage,
    retryLastMessage,
    clearCurrentConversation,
    createNewConversation,
    isGenerating,
    cancelGeneration,
    enableWebSearch,
    setEnableWebSearch,
    attachedDocuments,
    addAttachedDocument,
    removeAttachedDocument,
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
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUserNearBottomRef = useRef(true);

  const toggleVoiceRecording = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use a Chromium or WebKit browser.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setInputContent(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsRecording(false);
    }
  };

  // Track user scroll position in conversation container
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    // Consider user at bottom if within 140px of bottom
    isUserNearBottomRef.current = scrollHeight - scrollTop - clientHeight <= 140;
  };

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollTo({
      top: scrollContainerRef.current.scrollHeight,
      behavior,
    });
  };

  // If globalPrompt was passed from Home Dashboard, trigger it immediately
  useEffect(() => {
    if (globalPrompt) {
      sendMessage(globalPrompt);
      setGlobalPrompt('');
    }
  }, [globalPrompt, sendMessage, setGlobalPrompt]);

  // Smart auto-scroll: Only auto-scrolls to bottom if user is near bottom, or when user sends a message
  useEffect(() => {
    if (!activeConversation?.messages?.length) return;
    const lastMsg = activeConversation.messages[activeConversation.messages.length - 1];
    
    // Always scroll on user message submission
    if (lastMsg.role === 'user') {
      isUserNearBottomRef.current = true;
      scrollToBottom('smooth');
      return;
    }

    // During streaming or new assistant reply, only auto-scroll if user is following at bottom
    if (isUserNearBottomRef.current) {
      scrollToBottom(isGenerating ? 'auto' : 'smooth');
    }
  }, [activeConversation?.messages, isGenerating]);

  // Auto-adjust textarea height
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [inputContent]);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputContent.trim() || isGenerating) return;
    const msg = inputContent;
    setInputContent('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    await sendMessage(msg);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
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
    <div className="flex h-full flex-1 flex-col min-h-0 overflow-hidden bg-[#FAF9F6] dark:bg-[#151515] text-[#202124] dark:text-[#F7F7F7]">
      {/* Top Header / Model Switcher Bar */}
      <div className="h-14 border-b border-[#EAE7E1] dark:border-[#2E2E2E] bg-white/80 dark:bg-[#151515]/80 backdrop-blur-md px-4 md:px-8 flex items-center justify-between shrink-0 z-20">
        <div className="relative flex items-center gap-2">
          {/* Model Selector Dropdown */}
          <button
            onClick={() => setIsModelMenuOpen(!isModelMenuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FAF9F6] dark:bg-[#1C1C20] border border-[#EAE7E1] dark:border-white/[0.08] text-xs font-bold text-[#202124] dark:text-white hover:border-[#FFD43B] transition-colors shadow-2xs"
          >
            <AIThinkingOrb state={isGenerating ? 'generating' : 'idle'} size={18} />
            <span className="truncate max-w-[180px] sm:max-w-[280px]">{selectedModel.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#737373] shrink-0" />
          </button>

          {isModelMenuOpen && (
            <div className="absolute left-0 top-full mt-2 w-[calc(100vw-2rem)] max-w-xs sm:w-80 rounded-2xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] p-2 shadow-2xl z-50 animate-fadeIn">
              <div className="text-[10px] font-bold text-[#737373] uppercase tracking-wider px-2 py-1 flex items-center justify-between">
                <span>Select Online AI Model</span>
                <span className="text-[#16865D] font-semibold">Online Live</span>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-1">
                {models.map((m) => {
                  const isSelected = selectedModel.id === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setIsModelMenuOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] font-bold border border-[#FFD43B]/40'
                          : 'text-[#202124] dark:text-slate-300 hover:bg-[#FAF9F6] dark:hover:bg-[#282828]'
                      }`}
                    >
                      <div className="flex flex-col pr-2">
                        <span className="font-semibold">{m.name}</span>
                        <span className="text-[10px] text-[#737373] font-normal line-clamp-1">
                          {m.tag || m.provider.toUpperCase()}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#202124] dark:text-[#FFD43B] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Action Controls: New Chat, Clear, Stop */}
        <div className="flex items-center gap-2">
          {isGenerating ? (
            <button
              onClick={cancelGeneration}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white bg-[#FF4D4F] hover:bg-red-600 transition-colors shadow-2xs"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Stop Generating</span>
            </button>
          ) : (
            <>
              {messages.length > 0 && (
                <button
                  onClick={clearCurrentConversation}
                  title="Clear conversation"
                  className="p-1.5 rounded-xl text-[#737373] hover:text-[#202124] dark:hover:text-white hover:bg-[#FAF9F6] dark:hover:bg-[#202020] transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => createNewConversation()}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-[#202124] dark:text-white bg-[#FAF9F6] dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] hover:border-[#FFD43B] transition"
              >
                <Plus className="w-3.5 h-3.5 text-[#FFD43B]" />
                <span className="hidden sm:inline">New Chat</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scrollable Message Stream — Tightened Mobile Spacing */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto px-3 py-3 sm:px-6 md:px-8 lg:px-16 space-y-3 sm:space-y-4 overflow-x-hidden"
      >
        {messages.length === 0 ? (
          <div className="h-full min-h-[360px] flex flex-col items-center justify-center text-center max-w-lg mx-auto py-12">
            <div className="mb-4">
              <AIThinkingOrb state="idle" size="lg" showLabel={false} />
            </div>
            <h2 className="text-xl font-bold text-[#202124] dark:text-white">
              RIIQX Agentic Workspace
            </h2>
            <p className="text-xs text-[#737373] dark:text-[#A3A3A3] mt-1 leading-relaxed max-w-sm">
              State your goal or task. The AI agent routes tasks across providers, synthesizes scripts and storyboards, and integrates directly with Creator Studio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full mt-6 text-left">
              {[
                'Create a trending reel script from my ideas',
                'Research viral hooks for YouTube Shorts in tech',
                'Inspect project configuration and dependencies',
                'Plan a 7-day social media calendar with captions',
              ].map((prompt, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(prompt)}
                  className="p-3.5 rounded-2xl bg-white dark:bg-[#202020] border border-[#EAE7E1] dark:border-[#2E2E2E] text-xs font-medium text-[#202124] dark:text-[#F7F7F7] hover:border-[#FFD43B] hover:shadow-2xs transition-all text-left group"
                >
                  <span className="group-hover:text-[#FF6B5E] transition-colors">&ldquo;{prompt}&rdquo;</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, idx) => {
            const isUser = m.role === 'user';
            const isLatest = idx === messages.length - 1;
            const isStreamingThis = !isUser && isLatest && isGenerating;
            const isEmptyContent = !m.content || m.content.trim().length === 0;

            return (
              <div
                key={m.id || idx}
                className={`flex w-full gap-2.5 sm:gap-4 ${
                  isUser ? 'justify-end' : 'justify-start'
                }`}
              >
                {!isUser && (
                  <div className="shrink-0 mt-0.5">
                    <AIThinkingOrb state={isStreamingThis ? 'generating' : 'completed'} size={28} />
                  </div>
                )}

                <div
                  className={`relative transition-all break-words overflow-hidden ${
                    isUser
                      ? 'max-w-[85%] sm:max-w-xl rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-xs sm:text-sm leading-relaxed bg-[#202124] text-white dark:bg-[#1E1E22] dark:text-[#F4F4F6] border border-black/10 dark:border-[#FFD43B]/25 dark:shadow-[0_0_20px_-4px_rgba(255,212,59,0.12)] shadow-sm rounded-tr-none font-medium'
                      : 'w-full max-w-[calc(100%-2.5rem)] sm:max-w-2xl lg:max-w-3xl rounded-2xl sm:rounded-3xl p-3 sm:p-4.5 text-xs sm:text-sm leading-relaxed border border-[#EAE7E1] dark:border-white/[0.08] bg-white/90 dark:bg-[#151518]/90 backdrop-blur-md text-[#202124] dark:text-[#F7F7F7] shadow-2xs rounded-tl-none'
                  }`}
                >
                  {/* Assistant Model Tag & Copy Button */}
                  {!isUser && (
                    <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-2 mb-2.5 text-[11px] text-[#737373]">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD43B] shrink-0" />
                        <span className="font-semibold text-[#202124] dark:text-slate-200 truncate">
                          {m.modelUsed || selectedModel.name}
                        </span>
                      </div>
                      {!isEmptyContent && (
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="flex items-center gap-1 text-[#737373] hover:text-[#202124] dark:hover:text-white transition shrink-0 ml-2"
                        >
                          {copiedId === m.id ? (
                            <Check className="h-3 w-3 text-[#16865D]" />
                          ) : (
                            <Copy className="h-3 w-3" />
                          )}
                          <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Message Body or Thinking Indicator */}
                  {isEmptyContent && isStreamingThis ? (
                    <div className="flex items-center gap-2.5 py-1 text-[#737373]">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-[#FFD43B] animate-pulse" />
                        <span className="w-2 h-2 rounded-full bg-[#FFC928] animate-pulse [animation-delay:200ms]" />
                        <span className="w-2 h-2 rounded-full bg-[#FF6B5E] animate-pulse [animation-delay:400ms]" />
                      </div>
                      <span className="text-xs font-medium">Formulating response...</span>
                    </div>
                  ) : (
                    <MarkdownRenderer
                      content={m.content}
                      onRetry={!isUser ? retryLastMessage : undefined}
                    />
                  )}

                  {/* Research Citations — Shown only when authentic sources exist */}
                  {m.citations && m.citations.length > 0 && (
                    <div className="mt-3 border-t border-[#EAE7E1] dark:border-[#2E2E2E] pt-2.5">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-[#737373] mb-1.5 flex items-center gap-1">
                        <Globe className="w-3 h-3 text-[#FFD43B]" />
                        <span>Verified Sources ({m.citations.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {m.citations.map((c, cIdx) => (
                          <a
                            key={c.id || cIdx}
                            href={c.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#151515] px-2 py-1 text-[11px] text-[#202124] dark:text-slate-300 hover:border-[#FFD43B] hover:text-[#FF6B5E] transition max-w-full"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0 text-[#737373]" />
                            <span className="truncate max-w-[140px] sm:max-w-[220px]">
                              [{cIdx + 1}] {c.title}
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

      {/* Persistent Bottom Composer with Mobile Safe-Area */}
      <div className="border-t border-[#EAE7E1] dark:border-[#2E2E2E] bg-white/95 dark:bg-[#151515]/95 backdrop-blur-md px-3 pt-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:px-6 md:py-3.5 shrink-0 z-20 shadow-sm">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-1.5 w-full">
          {/* Document Attachment Badges */}
          {attachedDocuments.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pb-1">
              {attachedDocuments.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] border border-[#FFD43B]/30 text-xs font-semibold"
                >
                  <Paperclip className="w-3 h-3" />
                  <span className="truncate max-w-[140px] sm:max-w-[180px]">{doc.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAttachedDocument(doc.id)}
                    className="hover:text-red-500 transition ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative flex items-end bg-[#FAF9F6] dark:bg-[#202020] rounded-2xl sm:rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] p-1.5 sm:p-2 focus-within:border-[#FFD43B] focus-within:ring-2 focus-within:ring-[#FFD43B]/20 transition-all shadow-2xs">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <textarea
              ref={textareaRef}
              rows={1}
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask RIIQX anything... (Enter to send, Shift+Enter for newline)"
              className="w-full bg-transparent px-2.5 py-1.5 text-xs sm:text-sm text-[#202124] dark:text-white placeholder-[#737373] focus:outline-none resize-none max-h-32 min-h-[36px]"
            />

            <div className="flex items-center gap-1 shrink-0 pb-0.5">
              <button
                type="button"
                onClick={() => setEnableWebSearch(!enableWebSearch)}
                title={enableWebSearch ? 'Web Search Active' : 'Toggle Web Search'}
                className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                  enableWebSearch
                    ? 'bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B]'
                    : 'text-[#737373] hover:text-[#202124] dark:hover:text-white'
                }`}
              >
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Attach files"
                className="p-1.5 sm:p-2 text-[#737373] hover:text-[#202124] dark:hover:text-white rounded-full transition-colors"
              >
                <Paperclip className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
              <button
                type="button"
                onClick={toggleVoiceRecording}
                title={isRecording ? 'Listening... Click to stop' : 'Voice Input (Speech-to-text)'}
                className={`relative p-1.5 sm:p-2 rounded-full transition-colors ${
                  isRecording
                    ? 'bg-[#FF4D4F] text-white shadow-[0_0_15px_-2px_rgba(255,77,79,0.5)] animate-pulse'
                    : 'text-[#737373] hover:text-[#202124] dark:hover:text-white'
                }`}
              >
                <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                {isRecording && (
                  <span className="absolute -top-1 -right-1 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D4F] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D4F]" />
                  </span>
                )}
              </button>

              {isGenerating ? (
                <button
                  type="button"
                  onClick={cancelGeneration}
                  title="Stop generating"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FF4D4F] hover:bg-red-600 text-white flex items-center justify-center transition-colors shadow-xs"
                >
                  <Square className="w-3 h-3 fill-current" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!inputContent.trim() || isGenerating}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#FFD43B] hover:bg-[#FFC928] text-[#202124] font-bold flex items-center justify-center transition-colors disabled:opacity-40 shadow-xs"
                >
                  <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
