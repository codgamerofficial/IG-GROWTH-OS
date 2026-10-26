# ♾️ NUVEXA AI — One Assistant. Many Possibilities.

[![License](https://img.shields.io/badge/license-Apache--2.0%20%2F%20MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-emerald.svg)](https://fastapi.tiangolo.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org)
[![Ollama](https://img.shields.io/badge/AI-Ollama%20Open--Weights-cyan.svg)](https://ollama.com)
[![Auth](https://img.shields.io/badge/Auth-Non--Firebase%20PBKDF2-violet.svg)](#security-and-account-isolation)

> **One Assistant. Many Possibilities.**  
> A production-oriented, open-source, multi-model AI assistant platform supporting general conversation, verifiable deep research, sandboxed coding, untrusted document analysis, and autonomous multi-step task planning.

---

## 🌟 Key Architecture & Capabilities

```
┌─────────────────────────────────────────────────────────────┐
│ 1. CLIENT WORKSPACE (Next.js 14 App Router, TypeScript, PWA)│
│    • Deep Navy Identity (#030712), Dual-Orbit Infinity Logo │
│    • Responsive Multi-Tab Shell: Chat, Research, Code, Tasks│
├─────────────────────────────────────────────────────────────┤
│ 2. MODEL ORCHESTRATION & ZERO-FABRICATION HEALTH ENGINE     │
│    • Local-first via Ollama (Llama 3.2, Mistral, Qwen 2.5)  │
│    • Configurable OpenAI-compatible server (vLLM / LMStudio)│
│    • Live active/offline probe with zero fake availability  │
├─────────────────────────────────────────────────────────────┤
│ 3. RESEARCH & CITATION LAYER                                │
│    • SearXNG & Open Web Search Adapters                     │
│    • Verifiable source URLs, domain badges & footnotes      │
├─────────────────────────────────────────────────────────────┤
│ 4. TASK PLANNER & CONSEQUENTIAL PERMISSION GATE             │
│    • Multi-step autonomous task decomposition state machine │
│    • Mandatory Human-in-the-Loop authorization before tools │
├─────────────────────────────────────────────────────────────┤
│ 5. UNTRUSTED DOCUMENT SANDBOX                               │
│    • PDF, Markdown, JSON, Code text extraction              │
│    • Prompt-injection barriers ([ESC_IM_START])             │
├─────────────────────────────────────────────────────────────┤
│ 6. NON-FIREBASE CRYPTOGRAPHIC AUTHENTICATION                │
│    • PBKDF2 HMAC SHA-256 salted credentials                 │
│    • Full account isolation, JSON data export & cascade wipe│
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quickstart

### 1. Bare-Metal Local Development
```bash
# 1. Install frontend dependencies
npm install

# 2. Run local open-weight model in Ollama
ollama run llama3.2

# 3. Start Next.js Development Server
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Full Docker Compose Deployment
```bash
docker compose up -d
```
- **Web App:** `http://localhost:3000`
- **FastAPI Core Service:** `http://localhost:8000/docs`
- **SearXNG Search:** `http://localhost:8080`
- **Ollama Engine:** `http://localhost:11434`

---

## 🧪 Automated Test Results

Run all test suites locally:
```bash
# Node.js / Next.js Test Suite
npm test

# Python Standard Library Test Suite
python -m unittest backend/tests/test_nuvexa_unittest.py

# TypeScript Typecheck
npm run typecheck
```

**Real Execution Status:**
- ✅ `test:nuvexa`: 6/6 tests passed (Brand, Auth, Model Registry, Document Sandbox, Task Gate, Citations).
- ✅ `backend:unittest`: 4/4 tests passed in 0.060s.
- ✅ `typecheck`: Zero errors across the entire codebase.

---

## 🛡️ Security & Absolute Constraints Compliance

1. **Zero Firebase Guarantee:** Completely free from Firebase, Firestore, Firebase Auth, or Firebase SDKs.
2. **Zero Mandatory Paid APIs:** Designed to run 100% locally with open-weight models (`llama3.2`, `mistral`, `qwen2.5-coder`, `deepseek-r1`).
3. **Zero-Fabrication Policy:** Never fakes model availability, search results, or task completion. Offline models clearly display exact setup commands.
4. **Data Isolation:** User data is partitioned by account ID with cryptographic session cookies and 1-click JSON export and wipe.

---

## 📜 Documentation

- [Architecture Blueprint](docs/NUVEXA_ARCHITECTURE.md)
- [Self-Hosting Guide](docs/SELF_HOSTING.md)
- [Supported Open-Weight Models & Licenses](docs/MODELS.md)
