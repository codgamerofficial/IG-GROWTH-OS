# ♾️ NUVEXA AI — Master Architectural Blueprint
**Tagline:** *One Assistant. Many Possibilities.*  
**Production Ready • Open Source • Multi-Model • Zero Firebase • Open Weights First**

---

## 1. Executive Overview

NUVEXA AI is a privacy-first, production-oriented multi-model AI assistant platform designed to run completely on open-source infrastructure without reliance on proprietary black-box APIs or commercial platform locks (zero Firebase, zero mandatory paid APIs).

### Core Pillars
1. **Zero-Fabrication Engine:** Never hallucinates or fabricates provider availability, live search results, or task progress.
2. **Local-First & Multi-Model:** First-class support for Ollama (`llama3.2`, `mistral`, `deepseek-coder`, `qwen2.5`) and custom OpenAI-compatible vLLM/LMStudio endpoints.
3. **Account Isolation & Non-Firebase Auth:** Cryptographic session tokens, PBKDF2 password hashing, project scoping, full data export, and deletion.
4. **Safety & Permission Gate:** High-consequence tools (file writes, network requests, code execution) require explicit user authorization.
5. **Deep Navy Aesthetics:** An original cyberpunk-minimalist design system with cyan, electric blue, violet, and restrained magenta accents, anchored by the infinity emblem.

---

## 2. Layered Architecture

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CLIENT LAYER (Next.js 14 App Router, TypeScript, PWA)   │
│    • Deep Navy UI, Infinity Emblem, Accessible Contrast     │
│    • Dynamic Workspaces, Project Folders, Multi-Tab Views   │
│    • Streaming Chat (SSE/NDJSON), Markdown & Code Sandbox   │
├─────────────────────────────────────────────────────────────┤
│ 2. GATEWAY & ADAPTER LAYER                                  │
│    • Next.js API Routes (/api/nuvexa/*)                     │
│    • Python 3.14 FastAPI Modular Service (backend/*)        │
│    • Provider Adapters (Ollama, OpenAI-Compatible, Custom)  │
│    • Live Health Probes & Offline Status Reporting          │
├─────────────────────────────────────────────────────────────┤
│ 3. INTELLIGENCE & RESEARCH LAYER                            │
│    • Untrusted Document Parser (PDF, MD, Code, JSON)        │
│    • Live Search Adapter (SearXNG + DuckDuckGo open search) │
│    • Citation Engine with verifiable source links           │
├─────────────────────────────────────────────────────────────┤
│ 4. AUTONOMOUS TASK PLANNER & TOOL SANDBOX                   │
│    • Multi-step Task Decomposition & State Machine          │
│    • Interactive Permission Gate (Prompt before execution)  │
│    • Code Execution Simulator & File Inspector              │
├─────────────────────────────────────────────────────────────┤
│ 5. DATA & SECURITY LAYER                                    │
│    • PostgreSQL Schema with pgvector & Supabase integration │
│    • Non-Firebase Auth: PBKDF2 + Cryptographic Sessions    │
│    • User Data Export & Complete Account Deletion           │
└─────────────────────────────────────────────────────────────┘
```
