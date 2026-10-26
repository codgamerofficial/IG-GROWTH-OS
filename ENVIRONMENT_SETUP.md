# ♾️ NUVEXA AI — Environment Configuration & Dependency Manual
**Tagline:** *One Assistant. Many Possibilities.*  
**Security Policy:** Strict Zero Secret Exposure • Server-Side Only Credentials

---

## 1. Quickstart Configuration

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

---

## 2. Environment Variables Matrix

| Variable | Description | Default / Example | Required For Core? |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_APP_URL` | Base frontend URL | `http://localhost:3000` | Yes |
| `NODE_ENV` | App runtime environment | `development` / `production` | Yes |
| `OLLAMA_BASE_URL` | Local open-weight inference gateway | `http://localhost:11434` | Yes (for local AI) |
| `OPENAI_COMPATIBLE_BASE_URL` | Self-hosted or cluster endpoint (vLLM / LMStudio) | `http://localhost:8000/v1` | No (optional) |
| `OPENAI_COMPATIBLE_API_KEY` | Bearer token for OpenAI-compatible endpoint | `sk-...` | No (optional) |
| `SEARXNG_BASE_URL` | Privacy-preserving web search instance | `https://searx.be` | Yes (for research mode) |
| `DATABASE_URL` | PostgreSQL connection string with pgvector | `postgresql://nuvexa:...@localhost:5432/nuvexa_db` | No (SQLite/Memory fallback available) |
| `INSTAGRAM_ACCESS_TOKEN` | Meta Graph API User Token for Reels publishing | Server-side token | No (required only for IG Autopilot) |
| `INSTAGRAM_ACCOUNT_ID` | Instagram Professional / Business Account ID | `1784...` | No (required only for IG Autopilot) |
| `YOUTUBE_CLIENT_ID` | Google Cloud OAuth 2.0 Client ID | `...apps.googleusercontent.com` | No (required only for YouTube Autopilot) |
| `YOUTUBE_CLIENT_SECRET` | Google Cloud OAuth 2.0 Client Secret | Server-side secret | No (required only for YouTube Autopilot) |
| `YOUTUBE_REFRESH_TOKEN` | Persistent OAuth 2.0 refresh token for channel | Server-side token | No (required only for YouTube Autopilot) |

---

## 3. Hardware Requirements for Local AI

- **Meta Llama 3.2 (3B):** 4 GB RAM minimum (Runs on CPU, Apple Silicon, or discrete GPU).
- **Mistral 7B / Qwen 2.5 Coder 7B:** 8 GB RAM / 6 GB VRAM.
- **DeepSeek R1 Distill 8B:** 10 GB RAM / 8 GB VRAM.
- **Rendering 1080x1920 Videos:** Modern web browser supporting HTML5 Canvas & MediaRecorder API or 2 vCPUs on server.

---

## 4. Zero-Secret Invariant Guarantee

1. No secrets or credentials are ever logged to stdout or embedded in client bundles.
2. If external social tokens are missing, the UI gracefully enters a **Draft-Only Mode** where scripts, storyboards, and rendered videos are fully created and downloadable without error.
