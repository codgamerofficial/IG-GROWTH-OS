# RIIQX Database Change Plan & Schema Architecture
**Project**: RIIQX Native AI Creative Ecosystem  
**Target Database**: Supabase PostgreSQL  
**Policy**: Non-Destructive • Strict RLS • Backward Compatible • User Data Isolation  

---

## 1. Current Database State vs Proposed Additions

The existing Supabase deployment contains active tables for user profiles, social accounts, encrypted OAuth credentials, publishing jobs, audit logs, and financial intelligence:
- `public.profiles`
- `public.connected_accounts`
- `public.oauth_credentials` (AES-256-GCM vault)
- `public.social_publishing_jobs`
- `public.social_audit_logs`
- `public.user_portfolios`, `portfolio_holdings`, `market_data_sources`, `instruments`, `market_data_points`

### Critical Preservation Rule:
**None of the existing tables will be dropped, altered, or overwritten.**  
The new creative ecosystem tables extend the database with clean foreign key links to `public.profiles(id)` and `auth.users(id)`.

---

## 2. Proposed Creative Ecosystem Schema

### A. AI Brand Intelligence
Stores structured Brand DNA extracted from websites or user uploads with complete version history.

```sql
-- 1. Brand Profiles
CREATE TABLE IF NOT EXISTS public.brand_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  website_url TEXT,
  tagline TEXT,
  description TEXT,
  industry TEXT,
  target_audience TEXT,
  mission TEXT,
  tone_of_voice TEXT DEFAULT 'Professional, innovative, confident',
  brand_personality TEXT[] DEFAULT '{}',
  core_messages TEXT[] DEFAULT '{}',
  color_palette JSONB NOT NULL DEFAULT '{"primary": "#FFD43B", "secondary": "#202124", "accent": "#06B6D4", "neutral": "#FFFFFF", "background": "#0C0C0E"}'::jsonb,
  typography JSONB NOT NULL DEFAULT '{"heading": "Inter", "body": "Inter", "code": "JetBrains Mono"}'::jsonb,
  logo_urls JSONB NOT NULL DEFAULT '[]'::jsonb,
  visual_rules TEXT[] DEFAULT '{}',
  do_not_use_rules TEXT[] DEFAULT '{}',
  raw_analysis JSONB DEFAULT '{}'::jsonb,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_brand_profiles_user ON public.brand_profiles(user_id);

-- 2. Brand Profile Versions
CREATE TABLE IF NOT EXISTS public.brand_profile_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_profile_id UUID NOT NULL REFERENCES public.brand_profiles(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  snapshot JSONB NOT NULL,
  change_summary TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_brand_profile_version UNIQUE (brand_profile_id, version_number)
);
```

---

### B. AI Campaign Studio
Manages multi-channel marketing campaigns, content pillars, platform briefs, and deliverables.

```sql
-- 3. Campaign Projects
CREATE TABLE IF NOT EXISTS public.campaign_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  objective TEXT NOT NULL CHECK (objective IN ('product_launch', 'brand_awareness', 'sales_promotion', 'seasonal', 'social_engagement', 'lead_generation', 'product_education', 'influencer', 'festival')),
  target_platforms TEXT[] NOT NULL DEFAULT '{"instagram", "youtube", "facebook"}',
  duration_days INT DEFAULT 14,
  language TEXT DEFAULT 'en',
  tone TEXT DEFAULT 'engaging',
  call_to_action TEXT NOT NULL,
  offer_details TEXT,
  strategy_overview TEXT,
  content_pillars JSONB NOT NULL DEFAULT '[]'::jsonb,
  calendar_schedule JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'scheduled', 'completed', 'archived')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaign_projects_user ON public.campaign_projects(user_id);

-- 4. Campaign Assets & Briefs
CREATE TABLE IF NOT EXISTS public.campaign_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES public.campaign_projects(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'youtube', 'tiktok', 'linkedin', 'twitter')),
  asset_type TEXT NOT NULL CHECK (asset_type IN ('reel_script', 'video_hook', 'carousel_copy', 'ad_copy', 'static_post', 'caption_set')),
  title TEXT NOT NULL,
  headline TEXT,
  content_body TEXT NOT NULL,
  visual_prompt TEXT,
  cta_variant TEXT,
  hashtags TEXT[] DEFAULT '{}',
  approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected', 'in_production', 'published')),
  media_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_campaign_assets_campaign ON public.campaign_assets(campaign_id);
```

---

### C. AI Creative Canvas
Stores infinite whiteboard projects, block graphs (images, text, prompts, moodboards), and connectors.

```sql
-- 5. Creative Canvas Projects
CREATE TABLE IF NOT EXISTS public.creative_canvas_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Canvas',
  description TEXT,
  viewport_x FLOAT DEFAULT 0.0,
  viewport_y FLOAT DEFAULT 0.0,
  viewport_zoom FLOAT DEFAULT 1.0,
  thumbnail_url TEXT,
  is_favorite BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_canvas_projects_user ON public.creative_canvas_projects(user_id);

-- 6. Creative Canvas Blocks
CREATE TABLE IF NOT EXISTS public.creative_canvas_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID NOT NULL REFERENCES public.creative_canvas_projects(id) ON DELETE CASCADE,
  block_type TEXT NOT NULL CHECK (block_type IN ('image', 'text', 'prompt', 'palette', 'brand_asset', 'reference_image', 'moodboard', 'ai_concept', 'connector', 'note')),
  position_x FLOAT NOT NULL DEFAULT 0.0,
  position_y FLOAT NOT NULL DEFAULT 0.0,
  width FLOAT DEFAULT 320.0,
  height FLOAT DEFAULT 240.0,
  z_index INT DEFAULT 1,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_canvas_blocks_canvas ON public.creative_canvas_blocks(canvas_id);

-- 7. Creative Canvas Versions (Snapshots)
CREATE TABLE IF NOT EXISTS public.creative_canvas_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  canvas_id UUID NOT NULL REFERENCES public.creative_canvas_projects(id) ON DELETE CASCADE,
  version_number INT NOT NULL,
  blocks_snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT uq_canvas_version UNIQUE (canvas_id, version_number)
);
```

---

### D. AI Workflow Builder
Manages automation graphs, step-by-step executions, and audit records with strict approval checkpoints.

```sql
-- 8. AI Workflows
CREATE TABLE IF NOT EXISTS public.ai_workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  nlp_prompt TEXT,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN ('manual', 'schedule', 'webhook', 'file_uploaded', 'event')),
  cron_schedule TEXT,
  graph_nodes JSONB NOT NULL DEFAULT '[]'::jsonb,
  graph_edges JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_active BOOLEAN DEFAULT FALSE,
  requires_approval_for_actions BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_workflows_user ON public.ai_workflows(user_id);

-- 9. AI Workflow Runs (Executions)
CREATE TABLE IF NOT EXISTS public.ai_workflow_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES public.ai_workflows(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('queued', 'running', 'waiting_approval', 'completed', 'failed', 'cancelled')),
  trigger_source TEXT NOT NULL DEFAULT 'manual',
  step_count INT DEFAULT 0,
  completed_steps INT DEFAULT 0,
  execution_logs JSONB NOT NULL DEFAULT '[]'::jsonb,
  error_message TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  completed_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_workflow_runs_workflow ON public.ai_workflow_runs(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_runs_status ON public.ai_workflow_runs(status);

-- 10. AI Workflow Run Steps
CREATE TABLE IF NOT EXISTS public.ai_workflow_run_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  run_id UUID NOT NULL REFERENCES public.ai_workflow_runs(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL,
  node_name TEXT NOT NULL,
  node_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'running', 'waiting_approval', 'completed', 'failed', 'skipped')),
  input_data JSONB DEFAULT '{}'::jsonb,
  output_data JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  duration_ms INT,
  requires_user_approval BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_workflow_steps_run ON public.ai_workflow_run_steps(run_id);
```

---

### E. AI Product Studio
Stores product assets, feature preservation masks, and generated photography concepts with side-by-side comparison data.

```sql
-- 11. Product Creative Projects
CREATE TABLE IF NOT EXISTS public.product_creative_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  brand_profile_id UUID REFERENCES public.brand_profiles(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_description TEXT,
  original_image_url TEXT NOT NULL,
  extracted_subject_mask_url TEXT,
  preserved_features TEXT[] DEFAULT '{"logo", "label", "packaging", "color"}',
  concept_preset TEXT NOT NULL CHECK (concept_preset IN ('clean_studio', 'lifestyle', 'premium_ad', 'social_promo', 'festival', 'ecommerce', 'feature_highlight')),
  target_aspect_ratios TEXT[] DEFAULT '{"1:1", "9:16", "16:9"}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_projects_user ON public.product_creative_projects(user_id);

-- 12. Product Creative Assets (Generated Variants)
CREATE TABLE IF NOT EXISTS public.product_creative_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.product_creative_projects(id) ON DELETE CASCADE,
  aspect_ratio TEXT NOT NULL CHECK (aspect_ratio IN ('1:1', '9:16', '16:9', '4:5')),
  generated_image_url TEXT NOT NULL,
  prompt_used TEXT NOT NULL,
  provider_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  fidelity_score FLOAT DEFAULT 0.98,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_product_assets_project ON public.product_creative_assets(project_id);
```

---

### F. Shared Asynchronous Job Engine & Usage Telemetry
Provides a durable asynchronous job queue for long-running AI and media tasks, preventing serverless HTTP timeouts.

```sql
-- 13. Shared AI Jobs Queue
CREATE TABLE IF NOT EXISTS public.ai_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  job_type TEXT NOT NULL CHECK (job_type IN ('brand_analysis', 'campaign_generation', 'image_generation', 'image_edit', 'workflow_run', 'video_transcribe', 'video_render', 'asset_export')),
  status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'completed', 'failed', 'cancelled')),
  progress_pct INT DEFAULT 0 CHECK (progress_pct BETWEEN 0 AND 100),
  stage_message TEXT DEFAULT 'Queued for processing...',
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result JSONB DEFAULT '{}'::jsonb,
  error_message TEXT,
  retry_count INT DEFAULT 0,
  max_retries INT DEFAULT 3,
  worker_id TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_jobs_user_status ON public.ai_jobs(user_id, status);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_type ON public.ai_jobs(job_type);

-- 14. AI Provider Usage Tracking
CREATE TABLE IF NOT EXISTS public.ai_provider_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  operation_type TEXT NOT NULL,
  prompt_tokens INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  total_tokens INT DEFAULT 0,
  latency_ms INT DEFAULT 0,
  cost_usd NUMERIC(8, 6) DEFAULT 0.000000,
  is_free_tier BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_ai_usage_user ON public.ai_provider_usage(user_id, created_at DESC);
```

---

## 3. Row Level Security (RLS) Implementation

Every creative table enforces strict Row Level Security. Users can only select, insert, update, or delete records belonging to their authenticated `auth.uid()`.

```sql
-- Apply RLS to all new creative tables
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_canvas_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_canvas_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creative_canvas_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_workflow_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_workflow_run_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_creative_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_creative_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_provider_usage ENABLE ROW LEVEL SECURITY;

-- Standard User Isolation Policies
DO $$
DECLARE
  tbl TEXT;
BEGIN
  FOR tbl IN
    SELECT unnest(ARRAY[
      'brand_profiles', 'campaign_projects', 'creative_canvas_projects',
      'ai_workflows', 'ai_workflow_runs', 'product_creative_projects',
      'ai_jobs', 'ai_provider_usage'
    ])
  LOOP
    EXECUTE format('
      DROP POLICY IF EXISTS "Users manage their own %1$s" ON public.%1$s;
      CREATE POLICY "Users manage their own %1$s"
        ON public.%1$s FOR ALL
        USING (auth.uid() = user_id OR auth.role() = ''service_role'')
        WITH CHECK (auth.uid() = user_id OR auth.role() = ''service_role'');
    ', tbl);
  END LOOP;
END $$;
```

---

## 4. Supabase Storage Buckets Setup

The creative ecosystem utilizes 3 dedicated storage buckets with signed URLs:
1. `brand-assets`: Private bucket for logos, custom fonts, brand guidelines PDFs.
2. `creative-media`: Private bucket for product photos, raw footage, canvas block images.
3. `rendered-exports`: Public/authenticated bucket for final rendered MP4s, thumbnail snapshots, and exported marketing graphics.

---

## 5. Rollback Strategy

All migrations are designed to be rolled back without impacting core profiles or social accounts:
```sql
-- Emergency Rollback Script
DROP TABLE IF EXISTS public.ai_provider_usage CASCADE;
DROP TABLE IF EXISTS public.ai_jobs CASCADE;
DROP TABLE IF EXISTS public.product_creative_assets CASCADE;
DROP TABLE IF EXISTS public.product_creative_projects CASCADE;
DROP TABLE IF EXISTS public.ai_workflow_run_steps CASCADE;
DROP TABLE IF EXISTS public.ai_workflow_runs CASCADE;
DROP TABLE IF EXISTS public.ai_workflows CASCADE;
DROP TABLE IF EXISTS public.creative_canvas_versions CASCADE;
DROP TABLE IF EXISTS public.creative_canvas_blocks CASCADE;
DROP TABLE IF EXISTS public.creative_canvas_projects CASCADE;
DROP TABLE IF EXISTS public.campaign_assets CASCADE;
DROP TABLE IF EXISTS public.campaign_projects CASCADE;
DROP TABLE IF EXISTS public.brand_profile_versions CASCADE;
DROP TABLE IF EXISTS public.brand_profiles CASCADE;
```

