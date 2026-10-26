# ♾️ NUVEXA AI — Self-Hosting & Deployment Manual
**Tagline:** *One Assistant. Many Possibilities.*  
**Production Ready • Zero Firebase • Open-Weight First • Privacy-Preserving**

---

## 1. Quickstart (Bare-Metal Local Development)

NUVEXA AI runs without requiring any paid APIs or cloud dependencies.

### Prerequisites
- **Node.js** >= 18.0 (Tested on Node 20 & 24)
- **Python** >= 3.10 (Tested on Python 3.14)
- **Ollama** (for local edge model inference)

### Step 1: Clone and Install Dependencies
```bash
# Install Next.js frontend dependencies
npm install

# Install Python backend dependencies (optional if running Next.js standalone)
pip install -r backend/requirements.txt
```

### Step 2: Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

### Step 3: Run Open-Weight Model
Ensure Ollama is running and pull your preferred model:
```bash
ollama run llama3.2
```

### Step 4: Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser. NUVEXA will automatically probe Ollama on `http://localhost:11434` and display active status.

---

## 2. Docker Compose Deployment (Single Command)

To deploy the entire production stack (Next.js PWA, FastAPI Backend, PostgreSQL with pgvector, Ollama, and SearXNG):

```bash
docker compose up -d
```

### Port Mapping
- **Web App (Frontend):** `http://localhost:3000`
- **FastAPI Core Backend:** `http://localhost:8000/docs`
- **Ollama API:** `http://localhost:11434`
- **SearXNG Search:** `http://localhost:8080`
- **PostgreSQL Database:** `localhost:5432`

---

## 3. Security & Governance Invariants

1. **Non-Firebase Authentication:**
   - Account credentials are cryptographically protected via **PBKDF2 HMAC SHA-256** with unique salts.
   - Sessions are managed with cryptographic cookies, ensuring 100% account isolation.
2. **Untrusted Data Isolation:**
   - Uploaded files are encapsulated with safety markers (`[ESC_IM_START]`) to prevent prompt-injection attacks.
3. **Consequential Permission Gate:**
   - High-impact tools (network search, code execution in sandbox) require explicit user authorization before execution.
