# RIIQX Free-First Model Strategy & Quota Management
**Document Version:** 2.0.0  
**Enforcement Level:** Mandatory  
**Monthly Budget:** ₹0 / $0.00 USD

---

## 1. Core Operating Philosophy

The RIIQX platform operates on a strict **zero-budget requirement**. This strategy treats free-tier infrastructure not as a temporary demo toy, but as an engineered distributed fleet capable of delivering production-grade AI agent workflows.

### The 4 Pillars of RIIQX Free-First Architecture:
1. **Multi-Cloud Redundancy**: Distributing workload across Groq LPU, OpenRouter Free, and Cohere Developer Tier guarantees continuous availability even if one provider encounters rate limits.
2. **Empirical Availability Verification**: No model is labeled "Free" based on public marketing. Every model in the RIIQX catalog must pass an active live completion request with verifiable token usage.
3. **Local Compute First**: Non-AI tasks (audio clipping, trimming, format validation, UI previewing) run locally in the browser or via host processes, conserving cloud inference quotas.
4. **Deterministic Token Economy**: System prompts are trimmed of redundant instructions, and temperature/max_tokens are optimized to maximize information density per free request.

---

## 2. Rate Limits & Quota Breakdown

| Provider | Free Quota Allocation | RPM Limit | Daily Limit | Quota Exhaustion Strategy |
|---|---|---|---|---|
| **Groq Cloud LPU** | 100% Free Developer Tier | 30 RPM | 14,400 RPD | Instant failover to OpenRouter `:free` models |
| **OpenRouter Gateway** | 16+ Free Variants (`:free`) | Dynamic (approx 20 RPM) | Shared community pool | Dynamic model rotation across Laguna, Nemotron, and North Mini |
| **Cohere Cloud** | Free Developer Trial | 20 RPM | 1,000 requests/mo | Reserved for grounded research and Bengali multilingual tasks |
| **AWS Bedrock** | Account Managed | Region-gated | Console allocated | Gated behind user IAM permissions in `ap-southeast-2` |
| **Local Ollama** | Infinite / Device bound | Unlimited | Unlimited | Ultimate offline safety net |

---

## 3. What Happens When Quotas are Exceeded?

1. **Step 1 — In-Memory Circuit Breaker**: If a model returns HTTP 429 (Too Many Requests), the router marks it as `RATE_LIMITED` for 60 seconds.
2. **Step 2 — Seamless Provider Failover**: The router immediately attempts the secondary eligible model from a different provider.
3. **Step 3 — Transparent User Notification**: If all free models across all providers are temporarily rate-limited, RIIQX presents an honest cooldown timer with exact retry timestamp. It **never** prompts for a credit card or executes a paid upgrade.

