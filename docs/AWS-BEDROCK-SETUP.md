# ☁️ Amazon Bedrock Setup Guide for IG GrowthOS

This guide covers connecting **Amazon Bedrock** as the primary and default AI engine for **IG GrowthOS** and **RIIQX**.

---

## 1. Overview & Architecture

IG GrowthOS interacts with Amazon Bedrock via the AWS SDK:
```text
IG GrowthOS (Client/Agents)
       │
       ▼
  AIProvider (Abstraction Layer)
       │
       ▼
 BedrockProvider (@aws-sdk/client-bedrock-runtime)
       │
       ├── ModelRouter (Task-Specific Routing)
       └── Converse API (with Server-Side Tool Calling)
```

No external Anthropic or third-party keys are required when using Bedrock. All Anthropic models (such as Claude 3.5 Sonnet v2) are executed strictly via the **AWS Bedrock Runtime**.

---

## 2. AWS Account & Model Access Prerequisites

### Step 1: Sign in to AWS Console
1. Navigate to the [AWS Management Console](https://console.aws.amazon.com/bedrock/).
2. Select your desired AWS Region (recommended: `us-east-1` (N. Virginia) or `us-west-2` (Oregon)).

### Step 2: Request Model Access
1. In the Amazon Bedrock console, click **Model access** in the left navigation sidebar.
2. Click **Manage model access** or **Modify model access**.
3. Select the models you want to enable for IG GrowthOS:
   - **Anthropic Claude 3.5 Sonnet** (`anthropic.claude-3-5-sonnet-20241022-v2:0` or cross-region inference profile `us.anthropic.claude-3-5-sonnet-20241022-v2:0`)
   - **Amazon Nova Pro** (`amazon.nova-pro-v1:0`)
   - **Meta Llama 3.1 70B** (`meta.llama3-1-70b-instruct-v1:0`)
4. Submit the request. Access is typically granted immediately.

---

## 3. IAM Permissions & Security

### Least-Privilege IAM Policy
Create an IAM Policy named `IGGrowthOSBedrockPolicy`:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "BedrockRuntimeAccess",
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:InvokeModelWithResponseStream",
        "bedrock:Converse",
        "bedrock:ConverseStream"
      ],
      "Resource": "*"
    }
  ]
}
```

> **Security Rule (Section 4):** NEVER put AWS credentials in frontend code or client bundles. All Bedrock requests in IG GrowthOS execute strictly on the Next.js Node.js server runtime.

---

## 4. Environment Variables Configuration

Copy `.env.example` to `.env.local` and configure your AWS credentials:

```env
# AWS Region
AWS_REGION=us-east-1

# Local Development Credentials
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

# Primary Bedrock AI Provider
AI_PROVIDER=bedrock

# Master Default Bedrock Model
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Optional Dynamic Model Routing (Section 49)
# If left empty, these automatically fall back to BEDROCK_MODEL_ID
CONTENT_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
ANALYTICS_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
TREND_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
CHAT_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
```

---

## 5. Production Deployment (IAM Roles)

When deploying to AWS ECS, AWS App Runner, AWS Lambda, or EC2:
- Do **NOT** store `AWS_ACCESS_KEY_ID` or `AWS_SECRET_ACCESS_KEY` in environment variables.
- Attach `IGGrowthOSBedrockPolicy` directly to the **ECS Task Execution Role** or **Instance Profile**.
- IG GrowthOS uses the AWS SDK Default Credential Provider Chain and will automatically resolve the IAM role.

---

## 6. Verification & Testing

Run the automated test suite to verify model routing and resilience:
```bash
npm test
```

When `MOCK_MODE=true` is enabled, IG GrowthOS automatically falls back to deterministic RIIQX fashion outputs if AWS credentials are not yet entered.
