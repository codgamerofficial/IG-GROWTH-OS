---
name: instagram-growth
description: AI Command Center skill for IG GrowthOS and brand RIIQX. Controls content creation, scheduling, official Meta publishing, analytics diagnostics, and automated growth workflows.
---

# IG GrowthOS — Instagram Command Center Skill

Use this skill when orchestrating or automating Instagram operations for **RIIQX** (Fashion / Clothing / Lifestyle) or executing workflows through the `instagram-growth-mcp` server.

---

## 1. Safety Rules & Prime Directives

1. **Strict Approval Gate**:
   - **A non-approved post MUST NEVER publish.**
   - Before publishing any item, verify that `approval_status === "APPROVED"`.
   - Never bypass the approval state unless explicit autonomous mode is enabled.
2. **Never Fabricate Data**:
   - Never fabricate analytics, subscriber numbers, trends, product prices, discounts, or reviews.
   - If live Meta API data is missing, report the limitation or indicate development mock simulation.
3. **Never Expose Secrets**:
   - Never output Meta User Access Tokens, App Secrets, or Supabase Service-Role Keys.
4. **Duplicate Protection**:
   - Never publish an item that already has an assigned `instagram_media_id` or is in `PUBLISHED` state.

---

## 2. Common User Commands & Tool Execution

### A. "Run today's workflow"
Executes the official 12-step autonomous loop:
1. Call `instagram_run_daily_workflow`.
2. Inspect the returned candidate items (top 3 packages).
3. Report back to the user that ideas were generated, scored, and saved with `approval_status = PENDING`.
4. **DO NOT** publish them immediately. Ask the user to review in the Approvals Center.

### B. "Analyze my Instagram" / "What worked?"
1. Call `instagram_analyze_performance`.
2. Summarize:
   - What worked (top-performing hooks, formats, fabric tear-downs)
   - What didn't (generic flat lays, late-night posting)
   - Which content drove saves vs. shares
   - Top 3 next actions to test

### C. "Create a Reel for [Product]"
1. Call `instagram_generate_ideas` with format `Reel`.
2. Select the top concept and call `instagram_create_content`.
3. Ensure the script contains:
   - **0–3s**: High tension Hook
   - **3–8s**: Problem / Context
   - **8–20s**: Value / Story
   - **20–30s**: Payoff & Drape
   - **Final seconds**: Specific keyword CTA

### D. "Approve content [ID]"
1. Call `instagram_approve_content` with `{ content_id: "<ID>" }`.
2. Confirm state transition to `APPROVED`.

### E. "Publish approved content [ID]"
1. Verify `approval_status === "APPROVED"`.
2. Call `instagram_publish_content` with `{ content_id: "<ID>" }`.
3. Return the confirmed Meta `instagram_media_id`.

---

## 3. Available MCP Tools Reference

| Tool | Purpose | Key Parameters |
|---|---|---|
| `instagram_get_account` | View connected account stats | None |
| `instagram_get_media` | Fetch recent posts & Reels | `limit` (number) |
| `instagram_get_insights` | Retrieve account-level reach & metrics | `period` ('day', 'week') |
| `instagram_get_comments` | Read post comments | `media_id` (string) |
| `instagram_create_content` | Create new post draft | `title`, `content_type`, `caption` |
| `instagram_update_content` | Edit existing draft | `content_id`, `title`, `caption` |
| `instagram_approve_content` | Approve draft for scheduling/publishing | `content_id` (string) |
| `instagram_reject_content` | Reject draft with reason | `content_id`, `reason` |
| `instagram_schedule_content` | Schedule approved item | `content_id`, `scheduled_at` |
| `instagram_publish_content` | Publish approved post to Meta Graph API | `content_id` (string) |
| `instagram_get_calendar` | Get scheduled/published calendar | None |
| `instagram_get_trends` | Discover current fashion & audio trends | None |
| `instagram_generate_ideas` | Generate 10 AI ideas with Opportunity Scores | `pillar`, `count` |
| `instagram_analyze_performance`| Full performance diagnostic report | None |
| `instagram_run_daily_workflow` | Run the complete 12-step autonomous loop | None |

---

## 4. Error Recovery & Handling

- **`APPROVAL_GATE_REJECTION`**: Explain to the user that the item must be reviewed and approved first. Offer to approve it if requested.
- **`INSTAGRAM_RATE_LIMIT`**: Inform the user that Meta rate limits apply; wait 15 minutes before repeating heavy media polls.
- **`INSTAGRAM_TOKEN_EXPIRED`**: Direct the user to the Instagram Connection tab to re-authorize via Meta OAuth.
- **`API limitation`**: When an unsupported Meta API feature is requested (e.g. personal account auto-posting without a Business Page link), explain the limitation clearly and provide the compliant manual workflow.
