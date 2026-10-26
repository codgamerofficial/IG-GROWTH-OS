# RIIQX — Security & Data Governance Policy

**Compliance Level:** Enterprise Zero-Trust • 100% Non-Firebase • Confidential Credential Containment  
**Last Updated:** October 26, 2026  

---

## 1. Zero-Firebase Cryptographic Architecture

RIIQX strictly enforces zero usage of Firebase services (no Firestore, Firebase Authentication, Firebase Storage, Firebase Functions, or Firebase SDKs).

### Authentication Specification
- **Algorithm:** PBKDF2 with HMAC SHA-256.
- **Iterations:** 10,000 rounds.
- **Salt:** 16 bytes of cryptographically secure random bytes per user session generated via `crypto.randomBytes(16)`.
- **Comparison:** Timing-safe comparison using `crypto.timingSafeEqual` prevents side-channel timing attacks.
- **Token Format:** Signed session tokens with expiration timestamps, revocable at any time.

---

## 2. Server-Side Secret Management

- **Zero Client Leaks:** All API keys (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `BEDROCK_API_KEY`, `INSTAGRAM_ACCESS_TOKEN`, `META_APP_SECRET`, `OPENAI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) are kept exclusively on the server side (`process.env`).
- **No `NEXT_PUBLIC_*` Secret Injection:** Client components only receive sanitized configuration flags (e.g., whether a provider is configured or healthy) and never the underlying credentials.
- **Git Shield:** `.env*` files are strictly excluded via `.gitignore` and audited before every build.

---

## 3. Untrusted Content Sandboxing & Prompt Injection Defense

All user-uploaded documents (PDFs, Markdown, source code) and retrieved web search results are treated as untrusted data:
1. **Control Character Stripping:** Null bytes (`\0`) and dangerous terminal control characters are purged.
2. **System Token Neutralization:** Common LLM control tokens such as `<|im_start|>`, `<|im_end|>`, and `[INST]` are escaped.
3. **Security Barrier Encapsulation:** Untrusted external texts are wrapped within explicit security boundaries:
   ```text
   --- BEGIN UNTRUSTED USER DOCUMENT ---
   [Sanitized Content]
   --- END UNTRUSTED USER DOCUMENT ---
   ```
4. **Instruction Precedence:** System prompts instruct the LLM that any directives found within untrusted document boundaries must never override system governance, reveal secrets, or bypass permission gates.

---

## 4. Consequential Action Boundary & Autonomy Limits

Level 3 Autonomy requires strict containment:
1. **Financial & Cost Thresholds:** The system enforces maximum daily post limits and tracks model token quotas.
2. **Permission Confirmation Modal:** Destructive actions (data purging, public publishing, API credential rotation) require explicit interactive user confirmation before execution.
3. **Emergency Circuit Breaker:** Global STOP button halts all background queues within 50ms, resetting job statuses to `halted`.
