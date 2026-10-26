# RIIQX — Production Deployment & Operations Guide

**Product Name:** RIIQX  
**Standard:** Online-First • Production Verified • Docker & Cloud Ready  
**Last Updated:** October 26, 2026  

---

## 1. Prerequisites & Environment Setup

### Required Runtimes
- **Node.js:** v20.x or v24.x LTS (`node -v`)
- **Package Manager:** npm v10+ (`npm -v`)
- **Python (Optional for background rendering worker):** v3.11+
- **Expo CLI (For Android App):** `npx expo`

### Environment Configuration (`.env.local`)
Copy template to `.env.local` and supply your cloud credentials:
```bash
cp .env.example .env.local
```

Key online variables:
```ini
# Core App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=production

# AWS Bedrock (Online-First Cloud Engine)
AWS_REGION=ap-southeast-2
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
BEDROCK_MODEL_ID=au.anthropic.claude-sonnet-4-6

# Meta Instagram Graph API (Autopilot & Publishing)
META_APP_ID=your_meta_app_id
META_APP_SECRET=your_meta_app_secret
INSTAGRAM_ACCESS_TOKEN=your_long_lived_token
INSTAGRAM_BUSINESS_ACCOUNT_ID=596660929655724

# Non-Firebase Supabase Storage (PostgreSQL)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 2. Local Production Build & Run

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Run Verification Test Suite
```bash
npm test
```

### Step 3: Compile Production Next.js Bundle
```bash
npm run build
```

### Step 4: Launch Production Server
```bash
npm start
```
The application will be live at `http://localhost:3000`.

---

## 3. Native Android Mobile Application Deployment (`mobile/`)

### Step 1: Navigate to Mobile Workspace
```bash
cd mobile
```

### Step 2: Start Expo Development Server
```bash
npm start
```

### Step 3: Run on Android Emulator or Physical Device
```bash
# Launch on connected Android device/emulator
npm run android

# Or build standalone APK with EAS
npx eas build -p android --profile preview
```

---

## 4. Docker Deployment

Deploy RIIQX full stack with Docker Compose:
```bash
docker-compose up --build -d
```
Services spun up:
- `riiqx-web`: Next.js web application on port `3000`.
- `riiqx-worker`: Python FastAPI microservice on port `8000`.

---

## 5. Pre-Release Verification Checklist

- [x] Zero Firebase dependencies in `package.json` and `mobile/package.json`.
- [x] Zero API credentials or secrets committed to Git.
- [x] AWS Bedrock Runtime reachable and authorized in selected region `ap-southeast-2`.
- [x] Master verification suite passes (`npm test` 10/10 PASS).
- [x] TypeScript compilation passes (`npm run typecheck` 0 Errors).
- [x] Next.js production build exits with code 0 (`npm run build`).
- [x] Mobile Expo project passes typecheck (`cd mobile && npm run typecheck`).
