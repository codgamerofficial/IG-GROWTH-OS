'use client';

// =============================================================================
// RIIQX — Code Studio & Engineering Workspace
// iOS-Inspired Design System • Trending Yellow (#FFD43B) & Red/Coral (#FF4D4F)
// TypeScript / Python Synthesis • AST Generation • Sandboxed Verification
// =============================================================================

import React, { useState } from 'react';
import { Code2, Play, Copy, Check, Terminal, Sparkles } from 'lucide-react';

export function RiiqxCodeView() {
  const [selectedLanguage, setSelectedLanguage] = useState<'typescript' | 'python' | 'json'>('typescript');
  const [copied, setCopied] = useState(false);

  const sampleCode = `// RIIQX Autonomous Agent Dispatcher
import { BedrockRuntimeClient, ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

export async function executeAgentGoal(goal: string) {
  const client = new BedrockRuntimeClient({ region: 'ap-southeast-2' });
  const command = new ConverseCommand({
    modelId: 'au.anthropic.claude-sonnet-4-6',
    messages: [{ role: 'user', content: [{ text: goal }] }],
    inferenceConfig: { maxTokens: 2048, temperature: 0.7 }
  });
  
  const response = await client.send(command);
  return response.output?.message?.content?.[0]?.text;
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#FAF9F6] dark:bg-[#151515] p-4 sm:p-6 lg:p-8 transition-colors">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#FFD43B]/20 text-[#202124] dark:text-[#FFD43B] flex items-center justify-center">
                <Code2 className="h-4 w-4" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-[#202124] dark:text-white">Code Studio</h1>
            </div>
            <p className="mt-1.5 text-xs text-[#737373] dark:text-[#A3A3A3]">
              Automated Code Generation • AST Refactoring • Clean Production Architecture
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-2xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] px-4 py-2 text-xs font-semibold text-[#202124] dark:text-white hover:border-[#FFD43B] shadow-2xs transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-[#16865D]" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Editor Container */}
        <div className="rounded-3xl border border-[#EAE7E1] dark:border-[#2E2E2E] bg-white dark:bg-[#202020] overflow-hidden shadow-2xs">
          <div className="flex items-center justify-between border-b border-[#EAE7E1] dark:border-[#2E2E2E] bg-[#FAF9F6] dark:bg-[#1A1A1A] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#FF4D4F]" />
              <span className="h-3 w-3 rounded-full bg-[#FFD43B]" />
              <span className="h-3 w-3 rounded-full bg-[#16865D]" />
              <span className="ml-2 font-mono text-xs font-medium text-[#737373] dark:text-[#A3A3A3]">agent-dispatcher.ts</span>
            </div>
            <span className="rounded-full bg-[#FFD43B]/20 border border-[#FFD43B]/40 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#202124] dark:text-[#FFD43B]">
              TypeScript 5.3
            </span>
          </div>

          <pre className="p-5 sm:p-7 text-xs sm:text-sm font-mono text-[#202124] dark:text-[#F8FAFC] overflow-x-auto leading-relaxed bg-white dark:bg-[#151515]">
            <code>{sampleCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
