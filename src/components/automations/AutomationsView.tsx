'use client';

// =============================================================================
// IG GrowthOS: Automation Center (Section 30)
// =============================================================================

import React, { useState } from 'react';
import { useGrowthOS } from '@/context/GrowthOSContext';
import {
  Zap,
  Play,
  CheckCircle2,
  Clock,
  RotateCw,
  Power,
  TrendingUp,
  FileText,
  BarChart2,
  Calendar,
} from 'lucide-react';

interface AutomationItem {
  id: string;
  name: string;
  description: string;
  frequency: string;
  lastRun: string;
  nextRun: string;
  status: 'ACTIVE' | 'IDLE';
  enabled: boolean;
}

export function AutomationsView() {
  const { runTodayWorkflow, workflowRunning } = useGrowthOS();

  const [automations, setAutomations] = useState<AutomationItem[]>([
    {
      id: 'a1',
      name: 'Daily Trend Research',
      description: 'Scans Highsnobiety, Vogue, and Instagram Explore for emerging fashion microtrends & audio.',
      frequency: 'Every 6 hours',
      lastRun: '2 hours ago',
      nextRun: 'in 4 hours',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a2',
      name: 'Daily Content Ideas',
      description: 'Synthesizes active inventory and audience interest into 10 multi-factor scored ideas.',
      frequency: 'Daily at 8:00 AM EST',
      lastRun: 'Today, 8:00 AM',
      nextRun: 'Tomorrow, 8:00 AM',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a3',
      name: 'Daily Content Generation',
      description: 'Automatically drafts complete 5-phase Reel scripts for top 3 candidates into Approvals.',
      frequency: 'Daily at 8:30 AM EST',
      lastRun: 'Today, 8:30 AM',
      nextRun: 'Tomorrow, 8:30 AM',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a4',
      name: 'Approval Reminder',
      description: 'Notifies editors via dashboard badge and webhook when pending approvals exceed 3 items.',
      frequency: 'Every 12 hours',
      lastRun: '4 hours ago',
      nextRun: 'in 8 hours',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a5',
      name: 'Scheduled Publishing',
      description: 'Publishes approved items during optimal engagement windows (6:30 PM - 8:00 PM EST).',
      frequency: 'Daily at 6:30 PM EST',
      lastRun: 'Yesterday, 6:30 PM',
      nextRun: 'Today, 6:30 PM',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a6',
      name: 'Daily Analytics Sync',
      description: 'Pulls official Meta Graph API insights, calculates save/share rates, and updates database.',
      frequency: 'Daily at 11:59 PM EST',
      lastRun: 'Yesterday, 11:59 PM',
      nextRun: 'Today, 11:59 PM',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a7',
      name: 'Weekly Analytics Report',
      description: 'Generates comprehensive 7-day algorithmic diagnostic report and learning loop adjustments.',
      frequency: 'Every Sunday at 9:00 PM EST',
      lastRun: '3 days ago',
      nextRun: 'in 4 days',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a8',
      name: 'Weekly Content Strategy',
      description: 'Forecasts next week content calendar pillars based on top-performing historical formats.',
      frequency: 'Every Monday at 6:00 AM EST',
      lastRun: '2 days ago',
      nextRun: 'in 5 days',
      status: 'ACTIVE',
      enabled: true,
    },
    {
      id: 'a9',
      name: 'Monthly Growth Report',
      description: 'Executive recap of net audience gains, follower conversion efficiency, and revenue attribution.',
      frequency: '1st of every month',
      lastRun: '7 days ago',
      nextRun: 'in 23 days',
      status: 'ACTIVE',
      enabled: true,
    },
  ]);

  const toggleAutomation = (id: string) => {
    setAutomations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Zap className="h-6 w-6 text-amber-400" />
            <span>Automation Center</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Configure automated scheduling, background intelligence, publishing triggers, and reporting jobs.
          </p>
        </div>

        <button
          onClick={runTodayWorkflow}
          disabled={workflowRunning}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
        >
          {workflowRunning ? (
            <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Play className="h-4 w-4 fill-white" />
          )}
          <span>Trigger Full Workflow Now</span>
        </button>
      </div>

      {/* Automations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {automations.map((a) => (
          <div
            key={a.id}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#111114] p-6 shadow-xl space-y-4 hover:border-white/20 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{a.frequency}</span>
                </span>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleAutomation(a.id)}
                  className={`rounded-full p-1 transition-colors ${
                    a.enabled ? 'bg-rose-500 text-white' : 'bg-white/10 text-zinc-500'
                  }`}
                  title={a.enabled ? 'Disable Automation' : 'Enable Automation'}
                >
                  <Power className="h-3.5 w-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-white">{a.name}</h3>
              <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{a.description}</p>
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Last: {a.lastRun}</span>
              <span className="text-zinc-400 font-medium">Next: {a.nextRun}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
