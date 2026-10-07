# 🚨 IG GrowthOS — Critical Production Blockers

**Audit Standard:** ZERO MOCK • ZERO DEMO • ZERO FAKE DATA • PRODUCTION READINESS  
**Date:** October 7, 2026  
**Status:** 2 EXTERNAL CONFIGURATION ACTIONS REQUIRED  

---

This document lists **ONLY** the external dependencies preventing live production execution against external third-party APIs. There are **zero** internal code defects, broken routes, or unhandled compilation errors remaining.

---

### Blocker 1: Amazon Bedrock Anthropic Claude Model Access Approval

- **Service:** Amazon Bedrock Runtime (Selected Region: `ap-southeast-2`)
- **Impacted Subsystems:** Live Claude 3.5 Sonnet Converse API calls for Content Agent, Reel Agent, UGC Agent, and Copilot.
- **Current Verified Status:**
  - Authentication: **PASSED** (AWS IAM credentials in `ap-southeast-2` authenticate successfully via AWS SDK v3 BedrockRuntimeClient).
  - Model Access: **BLOCKED BY AWS**
  - Live AWS Error Returned:
    ```text
    ResourceNotFoundException: Model use case details have not been submitted for this account. 
    Fill out the Anthropic use case details form before using the model. 
    If you have already filled out the form, try again in 15 minutes.
    ```
- **Exact User Action Required:**
  1. Open AWS Bedrock Console: `https://ap-southeast-2.console.aws.amazon.com/bedrock/home?region=ap-southeast-2#/modelaccess`
  2. Click **Modify model access**.
  3. Locate **Anthropic** -> **Claude 3.5 Sonnet**.
  4. Submit the one-time Anthropic Use Case Details form (company name, intended use, etc.).
  5. Wait 5-15 minutes for AWS automated approval.
  6. Verify by requesting: `GET http://localhost:3000/api/health/bedrock`.

---

### Blocker 2: Meta / Instagram Graph API Credentials Missing

- **Service:** Meta Graph API v19.0+ / Instagram Graph API
- **Impacted Subsystems:** Live publishing to Instagram feed/reels, live account metrics lookup, and live post reach/impressions analytics.
- **Current Verified Status:**
  - Code Implementation: **COMPLETE & HARDENED** (No mock container IDs, no fake publishing).
  - Status: **BLOCKED — CONFIG REQUIRED**
  - Live Diagnostic Message:
    ```text
    BLOCKED — EXTERNAL CONFIGURATION REQUIRED: INSTAGRAM_ACCESS_TOKEN is not configured.
    ```
- **Exact User Action Required:**
  1. Go to [Meta for Developers](https://developers.facebook.com/apps/).
  2. Create an App with **Business** type and connect your Instagram Professional / Creator account to an associated Facebook Page.
  3. Ensure permissions are granted:
     - `instagram_basic`
     - `instagram_content_publish`
     - `instagram_manage_insights`
     - `pages_show_list`
     - `pages_read_engagement`
  4. Generate a Long-Lived Page/User Access Token.
  5. Add credentials to `.env.local`:
     ```env
     INSTAGRAM_ACCESS_TOKEN="EAAB..."
     INSTAGRAM_BUSINESS_ACCOUNT_ID="178414..."
     INSTAGRAM_CLIENT_ID="your_meta_app_id"
     INSTAGRAM_CLIENT_SECRET="your_meta_app_secret"
     ```
  6. Verify by requesting: `GET http://localhost:3000/api/health/instagram`.
