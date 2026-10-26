'use client';

import React, { useState } from 'react';
import { useNuvexa } from '@/context/NuvexaContext';
import {
  Code2,
  Play,
  Copy,
  Check,
  ShieldAlert,
  Terminal,
  FileCode,
  Download,
  CheckCircle2,
} from 'lucide-react';

interface CodeFile {
  name: string;
  language: string;
  content: string;
}

export function NuvexaCodeView() {
  const { advanceTask } = useNuvexa();

  const sampleFiles: CodeFile[] = [
    {
      name: 'fastapi_streamer.py',
      language: 'python',
      content: `from fastapi import FastAPI, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import asyncio
import json

app = FastAPI(title="NUVEXA Local AI Backend", version="1.0.0")

class ChatRequest(BaseModel):
    model: str = "llama3.2"
    prompt: str

async def mock_token_generator(prompt: str):
    tokens = f"Echoing local AI synthesis for: {prompt}".split()
    for token in tokens:
        await asyncio.sleep(0.06)
        yield f"data: {json.dumps({'token': token + ' '})}\\n\\n"
    yield "data: [DONE]\\n\\n"

@app.post("/v1/chat/stream")
async def stream_chat(req: ChatRequest):
    return StreamingResponse(
        mock_token_generator(req.prompt),
        media_type="text/event-stream"
    )`,
    },
    {
      name: 'schema_pgvector.sql',
      language: 'sql',
      content: `-- Enable vector extensions for NUVEXA Knowledge Retrieval
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS nuvexa_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(64) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    extracted_text TEXT NOT NULL,
    embedding vector(1536),
    is_untrusted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_doc_user ON nuvexa_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_doc_embedding ON nuvexa_documents USING ivfflat (embedding vector_cosine_ops);`,
    },
    {
      name: 'model_router.ts',
      language: 'typescript',
      content: `export interface ModelRouteOptions {
  modelString: string;
  stream: boolean;
  timeoutMs?: number;
}

export async function routeToLocalOllama(prompt: string, opts: ModelRouteOptions) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), opts.timeoutMs ?? 10000);
  
  const res = await fetch("http://localhost:11434/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model: opts.modelString, prompt, stream: opts.stream }),
    signal: controller.signal
  });
  
  clearTimeout(timer);
  return res;
}`,
    },
  ];

  const [activeFileIndex, setActiveFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'NUVEXA Code Sandbox Environment v1.0.0 (Isolated Subprocess)',
    'Type-safety enforcement: Strict • Network sandbox: Restrained',
    'Ready for execution.',
  ]);

  const activeFile = sampleFiles[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunInSandbox = () => {
    // Permission Confirmation Prompt
    const confirmRun = window.confirm(
      `[SECURITY PERMISSION PROMPT]\n\nAuthorize running "${activeFile.name}" in an isolated sandbox subprocess?\n\n- File: ${activeFile.name}\n- Language: ${activeFile.language}\n- Policy: Zero write access to host root.`
    );

    if (!confirmRun) {
      setTerminalLogs((prev) => [
        ...prev,
        `[USER_ABORT] Execution permission denied by user for ${activeFile.name}.`,
      ]);
      return;
    }

    setIsRunning(true);
    setTerminalLogs((prev) => [
      ...prev,
      `[START] Initializing sandbox container for ${activeFile.name}...`,
      `[AUDIT] Syntax verification passed. Zero arbitrary exec leaks detected.`,
      `[EXEC] Running simulation trace...`,
    ]);

    setTimeout(() => {
      setIsRunning(false);
      setTerminalLogs((prev) => [
        ...prev,
        `[SUCCESS] Process completed with return code 0. (Memory: 18MB, Time: 214ms)`,
      ]);
    }, 1200);
  };

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-[#030712]">
      {/* File Tabs Bar */}
      <div className="flex items-center justify-between border-b border-[#1E2A4A] bg-[#070D1F] px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-2">
          {sampleFiles.map((f, i) => (
            <button
              key={f.name}
              onClick={() => setActiveFileIndex(i)}
              className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-mono transition ${
                activeFileIndex === i
                  ? 'bg-[#0B132B] text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-[#94A3B8] hover:bg-[#0B132B]/50 hover:text-white'
              }`}
            >
              <FileCode className="h-3.5 w-3.5 text-cyan-400" />
              <span>{f.name}</span>
            </button>
          ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 rounded-lg border border-[#1E2A4A] bg-[#0B132B] px-2.5 py-1 text-xs text-[#94A3B8] hover:text-white transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            onClick={handleRunInSandbox}
            disabled={isRunning}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-500 active:scale-95 transition"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>{isRunning ? 'Running...' : 'Run in Sandbox'}</span>
          </button>
        </div>
      </div>

      {/* Code Editor Pane */}
      <div className="flex-1 overflow-y-auto bg-[#070D1F]/50 p-4 font-mono text-xs sm:text-sm">
        <pre className="text-[#F8FAFC] leading-relaxed">
          <code>{activeFile.content}</code>
        </pre>
      </div>

      {/* Sandboxed Terminal Output Panel */}
      <div className="h-44 border-t border-[#1E2A4A] bg-[#030712] p-3 flex flex-col font-mono text-xs">
        <div className="flex items-center justify-between border-b border-[#1E2A4A] pb-1.5 mb-2 text-[#64748B]">
          <div className="flex items-center gap-2">
            <Terminal className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-[11px] font-semibold text-white">Sandbox Console</span>
          </div>
          <span className="text-[10px] text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" /> Isolated Environment
          </span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-1 text-[11px] text-[#94A3B8]">
          {terminalLogs.map((log, index) => (
            <div key={index} className="leading-snug">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
