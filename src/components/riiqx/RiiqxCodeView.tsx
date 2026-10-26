'use client';

// =============================================================================
// RIIQX — Code Studio & Engineering Workspace
// TypeScript / Python Synthesis • AST Generation • Sandboxed Copy & Verification
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
    <div className="flex h-full flex-1 flex-col overflow-y-auto bg-[#030712] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Code2 className="h-5 w-5 text-cyan-400" />
              <h1 className="text-xl font-bold tracking-tight text-white">Code Studio</h1>
            </div>
            <p className="mt-1 text-xs text-[#94A3B8]">
              Automated Code Generation • AST Refactoring • Clean Production Architecture
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 rounded-xl border border-[#1E2A4A] bg-[#070D1F] px-3.5 py-1.5 text-xs font-semibold text-[#94A3B8] hover:text-white transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
          </div>
        </div>

        {/* Code Editor Container */}
        <div className="rounded-2xl border border-[#1E2A4A] bg-[#070D1F] overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#1E2A4A] bg-[#030712] px-4 py-2.5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-xs text-[#94A3B8]">agent-dispatcher.ts</span>
            </div>
            <span className="rounded bg-cyan-500/10 px-2 py-0.5 font-mono text-[10px] text-cyan-400">
              TypeScript 5.3
            </span>
          </div>

          <pre className="p-4 sm:p-6 text-xs sm:text-sm font-mono text-[#F8FAFC] overflow-x-auto leading-relaxed bg-[#050B1B]">
            <code>{sampleCode}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
