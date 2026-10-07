'use client';

// =============================================================================
// IG GrowthOS: Primary Application State & Workflow Context
// =============================================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Brand,
  ContentPillar,
  ContentItem,
  Product,
  Trend,
  AnalyticsRecord,
  AutomationJob,
  ApprovalStatus,
  ContentStatus,
} from '@/lib/supabase/types';
import { AggregateMetrics } from '@/lib/analytics/engine';
import { InstagramAccount } from '@/lib/instagram/types';

interface CopilotMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GrowthOSContextType {
  brand: Brand | null;
  pillars: ContentPillar[];
  products: Product[];
  trends: Trend[];
  contentItems: ContentItem[];
  analytics: AnalyticsRecord[];
  aggregates: AggregateMetrics | null;
  account: InstagramAccount | null;
  jobs: AutomationJob[];
  loading: boolean;
  workflowRunning: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMsg[];
  copilotLoading: boolean;
  sendCopilotMessage: (text: string) => Promise<void>;
  runTodayWorkflow: () => Promise<void>;
  approveContent: (id: string) => Promise<void>;
  rejectContent: (id: string, reason: string) => Promise<void>;
  scheduleContent: (id: string, scheduledAt: string) => Promise<void>;
  publishContent: (id: string) => Promise<{ success: boolean; instagram_media_id: string; message: string }>;
  createContentItem: (item: Partial<ContentItem>) => Promise<ContentItem>;
  refreshData: () => Promise<void>;
  commandInput: string;
  setCommandInput: (val: string) => void;
  executeCommand: (cmd: string) => Promise<string>;
}

const GrowthOSContext = createContext<GrowthOSContextType | undefined>(undefined);

export function GrowthOSProvider({ children }: { children: React.ReactNode }) {
  const [brand, setBrand] = useState<Brand | null>(null);
  const [pillars, setPillars] = useState<ContentPillar[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [trends, setTrends] = useState<Trend[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsRecord[]>([]);
  const [aggregates, setAggregates] = useState<AggregateMetrics | null>(null);
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [jobs, setJobs] = useState<AutomationJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [workflowRunning, setWorkflowRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [commandInput, setCommandInput] = useState('');
  const [copilotOpen, setCopilotOpen] = useState(false);
  const [copilotLoading, setCopilotLoading] = useState(false);

  const [copilotMessages, setCopilotMessages] = useState<CopilotMsg[]>([
    {
      id: 'init-msg',
      role: 'assistant',
      content:
        '👋 Welcome to **IG GrowthOS Command Center** for **RIIQX**.\n\nI am your AI Growth Copilot. You can ask me to run today’s workflow, draft high-converting Reels, analyze engagement spikes, or inspect approvals.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [brandRes, contentRes, analyticsRes, trendsRes, productsRes, accountRes, jobsRes] =
        await Promise.all([
          fetch('/api/brand').then((r) => r.json()),
          fetch('/api/content').then((r) => r.json()),
          fetch('/api/analytics').then((r) => r.json()),
          fetch('/api/trends').then((r) => r.json()),
          fetch('/api/products').then((r) => r.json()),
          fetch('/api/instagram/account').then((r) => r.json()),
          fetch('/api/automations').then((r) => r.json()),
        ]);

      if (brandRes.success) {
        setBrand(brandRes.brand);
        setPillars(brandRes.pillars || []);
      }
      if (contentRes.success) setContentItems(contentRes.items || []);
      if (analyticsRes.success) {
        setAnalytics(analyticsRes.records || []);
        setAggregates(analyticsRes.aggregates || null);
      }
      if (trendsRes.success) setTrends(trendsRes.trends || []);
      if (productsRes.success) setProducts(productsRes.products || []);
      if (accountRes.success) setAccount(accountRes.account || null);
      if (jobsRes.success) setJobs(jobsRes.jobs || []);
    } catch (err) {
      console.error('Failed to load IG GrowthOS data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // RUN TODAY'S WORKFLOW
  const runTodayWorkflow = async () => {
    try {
      setWorkflowRunning(true);
      const res = await fetch('/api/workflow/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandSlug: 'riiqx-fashion' }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Workflow execution failed');
      }

      await refreshData();
      setActiveTab('approvals');

      setCopilotMessages((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          role: 'assistant',
          content: `✅ **Today's Workflow Completed!**\n\nGenerated 10 content ideas, selected the top 3 scored concepts, and prepared complete Reel packages with scripts, shot lists, captions, and tags.\n\nAll items are queued in **Approvals** with \`approval_status = PENDING\`. No posts were published automatically.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err: any) {
      alert(`Error running workflow: ${err.message}`);
    } finally {
      setWorkflowRunning(false);
    }
  };

  // APPROVE CONTENT
  const approveContent = async (id: string) => {
    const res = await fetch(`/api/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    const data = await res.json();
    if (data.success) {
      setContentItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, approval_status: 'APPROVED', status: 'APPROVED' } : item))
      );
    } else {
      alert(`Approval error: ${data.error}`);
    }
  };

  // REJECT CONTENT
  const rejectContent = async (id: string, reason: string) => {
    const res = await fetch(`/api/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', reason }),
    });
    const data = await res.json();
    if (data.success) {
      setContentItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, approval_status: 'REJECTED', status: 'REJECTED' } : item))
      );
    } else {
      alert(`Rejection error: ${data.error}`);
    }
  };

  // SCHEDULE CONTENT
  const scheduleContent = async (id: string, scheduledAt: string) => {
    const res = await fetch(`/api/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'schedule', scheduled_at: scheduledAt }),
    });
    const data = await res.json();
    if (data.success) {
      setContentItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: 'SCHEDULED', scheduled_at: scheduledAt } : item))
      );
    } else {
      alert(`Scheduling error: ${data.error}`);
    }
  };

  // PUBLISH CONTENT
  const publishContent = async (id: string) => {
    const res = await fetch(`/api/content/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'publish' }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.error || 'Failed to publish');
    }
    await refreshData();
    return data.publishResult;
  };

  // CREATE CONTENT ITEM
  const createContentItem = async (item: Partial<ContentItem>): Promise<ContentItem> => {
    const res = await fetch('/api/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        brand_id: brand?.id || '00000000-0000-0000-0000-000000000001',
        title: item.title || 'Untitled Post',
        content_type: item.content_type || 'Reel',
        content_pillar: item.content_pillar || 'Product Showcase',
        hook: item.hook || '',
        caption: item.caption || '',
        hashtags: item.hashtags || ['#riiqx', '#streetwear'],
        cta: item.cta || 'Link in bio',
        status: item.status || 'DRAFT',
        approval_status: item.approval_status || 'DRAFT',
        ai_score: item.ai_score || 85.0,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setContentItems((prev) => [data.item, ...prev]);
      return data.item;
    }
    throw new Error(data.error || 'Failed to create item');
  };

  // SEND COPILOT MESSAGE
  const sendCopilotMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: CopilotMsg = {
      id: String(Date.now()),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCopilotMessages((prev) => [...prev, userMsg]);
    setCopilotLoading(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...copilotMessages, userMsg].map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await res.json();
      const replyText = data.message || 'I am processing your command.';

      setCopilotMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: replyText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch {
      setCopilotMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          role: 'assistant',
          content: 'Apologies, there was an issue processing your request. Please try again.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setCopilotLoading(false);
    }
  };

  // NATURAL LANGUAGE COMMAND INTERFACE (Section 31)
  const executeCommand = async (cmd: string): Promise<string> => {
    const lower = cmd.toLowerCase().trim();

    if (lower.includes("run today's workflow") || lower.includes('run workflow')) {
      await runTodayWorkflow();
      return "Running today's 12-step autonomous workflow for RIIQX...";
    }

    if (lower.includes('approv') && lower.includes('pending')) {
      setActiveTab('approvals');
      return 'Navigated to Pending Approvals center.';
    }

    if (lower.includes('calendar')) {
      setActiveTab('calendar');
      return 'Switched to Content Calendar.';
    }

    if (lower.includes('analytics') || lower.includes('analyze')) {
      setActiveTab('analytics');
      return 'Switched to Analytics Command Center.';
    }

    if (lower.includes('ideas') || lower.includes('idea')) {
      setActiveTab('ideas');
      return 'Switched to Content Idea Engine.';
    }

    // Default to Copilot
    setCopilotOpen(true);
    await sendCopilotMessage(cmd);
    return `Processed with Growth Copilot: "${cmd}"`;
  };

  return (
    <GrowthOSContext.Provider
      value={{
        brand,
        pillars,
        products,
        trends,
        contentItems,
        analytics,
        aggregates,
        account,
        jobs,
        loading,
        workflowRunning,
        activeTab,
        setActiveTab,
        copilotOpen,
        setCopilotOpen,
        copilotMessages,
        copilotLoading,
        sendCopilotMessage,
        runTodayWorkflow,
        approveContent,
        rejectContent,
        scheduleContent,
        publishContent,
        createContentItem,
        refreshData,
        commandInput,
        setCommandInput,
        executeCommand,
      }}
    >
      {children}
    </GrowthOSContext.Provider>
  );
}

export function useGrowthOS() {
  const context = useContext(GrowthOSContext);
  if (!context) {
    throw new Error('useGrowthOS must be used within a GrowthOSProvider');
  }
  return context;
}
