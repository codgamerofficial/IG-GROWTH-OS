'use client';

// =============================================================================
// RIIQX — Master AI Workflow Builder UI Component
// Visual Node Graph • Natural Language Synthesizer • Human Approval Gate • Node Inspector
// =============================================================================

import React, { useState, useEffect } from 'react';
import {
  GitBranch,
  Play,
  Sparkles,
  Plus,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Layers,
  ChevronRight,
  Eye,
  Check,
  Terminal,
  Compass,
  Sliders,
  Settings,
  X,
  Code,
  FileText,
  RotateCcw,
} from 'lucide-react';
import {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowExecutionRun,
} from '@/services/workflows/types';

export function WorkflowBuilderTab() {
  const [workflows, setWorkflows] = useState<WorkflowDefinition[]>([]);
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowDefinition | null>(null);
  const [activeRun, setActiveRun] = useState<WorkflowExecutionRun | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [promptText, setPromptText] = useState(
    'Create an autonomous 9:16 video generation pipeline from product upload with human sign-off'
  );
  const [synthesizing, setSynthesizing] = useState(false);
  const [executing, setExecuting] = useState(false);

  useEffect(() => {
    fetchWorkflows();
  }, []);

  const fetchWorkflows = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/riiqx/workflows');
      if (res.ok) {
        const data = await res.json();
        if (data.success && Array.isArray(data.workflows) && data.workflows.length > 0) {
          setWorkflows(data.workflows);
          setActiveWorkflow(data.workflows[0]);
          if (data.workflows[0].nodes?.length > 0) {
            setSelectedNodeId(data.workflows[0].nodes[0].id);
          }
        }
      }
    } catch (err) {
      console.warn('Failed to load workflows:', err);
    } finally {
      setLoading(false);
    }
  };

  // Synthesize Workflow from Natural Language Prompt
  const handleSynthesize = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    setSynthesizing(true);
    try {
      const res = await fetch('/api/riiqx/workflows/synthesize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText }),
      });

      const data = await res.json();
      if (data.success && data.workflow) {
        setWorkflows((prev) => [data.workflow, ...prev]);
        setActiveWorkflow(data.workflow);
        setSelectedNodeId(data.workflow.nodes[0]?.id || null);
        setActiveRun(null);
      } else {
        alert(data.error || 'Failed to synthesize workflow');
      }
    } catch (err: any) {
      alert('Synthesis error: ' + err.message);
    } finally {
      setSynthesizing(false);
    }
  };

  // Execute Workflow
  const handleExecute = async () => {
    if (!activeWorkflow) return;

    setExecuting(true);
    try {
      const res = await fetch(`/api/riiqx/workflows/${activeWorkflow.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payload: { topic: `${activeWorkflow.name} Run` },
        }),
      });

      const data = await res.json();
      if (data.success && data.run) {
        setActiveRun(data.run);
      } else {
        alert(data.error || 'Execution failed');
      }
    } catch (err: any) {
      alert('Execution error: ' + err.message);
    } finally {
      setExecuting(false);
    }
  };

  // Human Approval Checkpoint Action
  const handleApproveCheckpoint = async (nodeId?: string) => {
    if (!activeWorkflow || !activeRun) return;

    // Dynamically find approval node if not explicitly passed
    const approvalNode = activeWorkflow.nodes.find(
      (n) => n.type === 'human_approval' || n.subType === 'approval_checkpoint'
    );
    const targetNodeId = nodeId || activeRun.currentNodeId || approvalNode?.id || 'n4';

    try {
      const res = await fetch(`/api/riiqx/workflows/${activeWorkflow.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          runId: activeRun.id,
          nodeId: targetNodeId,
        }),
      });

      const data = await res.json();
      if (data.success && data.run) {
        setActiveRun(data.run);
      } else {
        alert(data.error || 'Failed to grant approval');
      }
    } catch (err: any) {
      alert('Approval error: ' + err.message);
    }
  };

  const selectedNode = activeWorkflow?.nodes.find((n) => n.id === selectedNodeId) || null;
  const selectedNodeState = selectedNode && activeRun ? activeRun.nodeStates?.[selectedNode.id] : null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl border border-[#27272A] bg-[#121215] shadow-lg">
        <div className="flex items-center gap-4">
          <div className="h-11 w-11 rounded-lg bg-[#FFD43B]/10 border border-[#FFD43B]/30 flex items-center justify-center text-[#FFD43B]">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-white">AI Workflow Builder</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono tracking-wide bg-[#06B6D4]/10 text-[#06B6D4] border border-[#06B6D4]/30">
                Autonomous DAG Engine
              </span>
            </div>
            <p className="text-xs text-[#9E9EA4] mt-0.5">
              Natural language workflow synthesis with connected DAG execution and human approval gates.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {activeRun && (
            <button
              onClick={() => setActiveRun(null)}
              title="Reset Execution Telemetry"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#A1A1AA] hover:text-white transition"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Run</span>
            </button>
          )}

          {activeWorkflow && (
            <button
              onClick={handleExecute}
              disabled={executing || activeRun?.status === 'running'}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition shadow-md shadow-[#FFD43B]/10 disabled:opacity-50"
            >
              {executing ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Running Pipeline...</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 fill-current" />
                  <span>Run Workflow</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Natural Language to Workflow Prompt Bar */}
      <form
        onSubmit={handleSynthesize}
        className="p-3.5 rounded-xl border border-[#27272A] bg-[#121215] flex flex-col sm:flex-row items-center gap-3 shadow-md"
      >
        <div className="flex items-center gap-2 px-2 text-[#FFD43B]">
          <Sparkles className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          placeholder="Describe your desired workflow in plain English..."
          className="flex-1 bg-transparent border-none text-xs text-white placeholder-[#71717A] focus:outline-none"
        />
        <button
          type="submit"
          disabled={synthesizing || !promptText.trim()}
          className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#27272A] hover:bg-[#323238] border border-[#3F3F46] text-xs font-semibold text-white transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {synthesizing ? (
            <>
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#FFD43B]" />
              <span>Synthesizing Graph...</span>
            </>
          ) : (
            <>
              <Compass className="h-3.5 w-3.5 text-[#FFD43B]" />
              <span>Synthesize Graph</span>
            </>
          )}
        </button>
      </form>

      {/* Human Approval Checkpoint Alert Banner (When Paused) */}
      {activeRun?.status === 'waiting_approval' && (
        <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/40 text-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
            <div>
              <p className="text-xs font-bold text-white">PAUSED AT HUMAN APPROVAL CHECKPOINT</p>
              <p className="text-[11px] text-amber-300/80">
                Generated scripts and scenes are ready. Review output and grant explicit sign-off to proceed to video render.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApproveCheckpoint()}
              className="px-4 py-2 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition flex items-center gap-1.5 shadow-md shadow-[#FFD43B]/20"
            >
              <Check className="h-4 w-4" />
              <span>Approve &amp; Continue Render</span>
            </button>
          </div>
        </div>
      )}

      {/* Workflow Tabs Selector */}
      {workflows.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-[#27272A]">
          <span className="text-xs font-semibold text-[#71717A] uppercase tracking-wider mr-2">
            Workflows ({workflows.length}):
          </span>
          {workflows.map((wf) => (
            <button
              key={wf.id}
              onClick={() => {
                setActiveWorkflow(wf);
                setActiveRun(null);
                setSelectedNodeId(wf.nodes[0]?.id || null);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-2 whitespace-nowrap ${
                activeWorkflow?.id === wf.id
                  ? 'bg-[#27272A] text-white border border-[#FFD43B]/40'
                  : 'text-[#A1A1AA] hover:text-white hover:bg-[#18181B]'
              }`}
            >
              <GitBranch className="h-3.5 w-3.5 text-[#06B6D4]" />
              <span>{wf.name}</span>
              {wf.isTemplate && (
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  Template
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Main Studio Viewport (Graph + Inspector) */}
      {activeWorkflow ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Visual Node Graph Stage (8 or 12 Cols depending on Inspector) */}
            <div className={`${selectedNode ? 'lg:col-span-8' : 'lg:col-span-12'} rounded-2xl border border-[#27272A] bg-[#0C0C0E] p-6 overflow-x-auto shadow-2xl space-y-6 transition-all`}>
              {/* Visual Header */}
              <div className="flex items-center justify-between pb-4 border-b border-[#1E1E22]">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{activeWorkflow.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#18181B] text-[#71717A]">
                      {activeWorkflow.nodes.length} Connected Nodes
                    </span>
                  </h3>
                  <p className="text-xs text-[#71717A] mt-0.5">{activeWorkflow.description}</p>
                </div>

                {activeRun && (
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="text-[#71717A]">Status:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                        activeRun.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : activeRun.status === 'waiting_approval'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : activeRun.status === 'running'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 animate-pulse'
                          : 'bg-red-500/10 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {activeRun.status.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Connected Horizontal Node Sequence */}
              <div className="flex items-center gap-3 min-w-[700px] py-4 overflow-x-auto">
                {activeWorkflow.nodes.map((node, idx) => {
                  const nodeState = activeRun?.nodeStates?.[node.id]?.status || 'idle';
                  const isPaused = nodeState === 'paused_for_approval';
                  const isRunning = nodeState === 'running';
                  const isCompleted = nodeState === 'completed';
                  const isSelected = selectedNodeId === node.id;

                  // Find outgoing edge label
                  const matchingEdge = activeWorkflow.edges.find((e) => e.sourceNodeId === node.id);

                  return (
                    <React.Fragment key={node.id}>
                      {/* Node Card */}
                      <div
                        onClick={() => setSelectedNodeId(node.id)}
                        className={`w-[210px] shrink-0 rounded-xl border p-4 flex flex-col justify-between transition cursor-pointer shadow-xl ${
                          isSelected
                            ? 'ring-2 ring-[#FFD43B] border-[#FFD43B] bg-[#18181D]'
                            : isPaused
                            ? 'border-amber-400 bg-amber-950/30 ring-2 ring-amber-400/20'
                            : isRunning
                            ? 'border-blue-400 bg-blue-950/30 ring-2 ring-blue-400/20 animate-pulse'
                            : isCompleted
                            ? 'border-emerald-500/60 bg-[#121215]'
                            : 'border-[#27272A] bg-[#121215] hover:border-[#3F3F46]'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-mono uppercase tracking-wider text-[#71717A]">
                              Node 0{idx + 1}
                            </span>
                            <span
                              className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase ${
                                isCompleted
                                  ? 'bg-emerald-500/10 text-emerald-400'
                                  : isPaused
                                  ? 'bg-amber-500/10 text-amber-400'
                                  : isRunning
                                  ? 'bg-blue-500/10 text-blue-400'
                                  : 'bg-[#27272A] text-[#A1A1AA]'
                              }`}
                            >
                              {nodeState.replace('_', ' ')}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-white leading-snug">
                            {node.label}
                          </h4>
                          <p className="text-[10px] text-[#A1A1AA] line-clamp-2">
                            {node.subType.replace(/_/g, ' ')}
                          </p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-[#27272A]/50 flex items-center justify-between text-[10px] text-[#71717A] font-mono">
                          <span className="capitalize">{node.type.replace('_', ' ')}</span>
                          {isCompleted && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
                          {isPaused && <Clock className="h-3.5 w-3.5 text-amber-400 animate-bounce" />}
                        </div>
                      </div>

                      {/* Edge Connector Arrow */}
                      {idx < activeWorkflow.nodes.length - 1 && (
                        <div className="flex flex-col items-center px-1 text-[#71717A] shrink-0">
                          <ArrowRight className="h-4 w-4 text-[#FFD43B]/70" />
                          <span className="text-[8px] font-mono text-[#71717A] mt-0.5 whitespace-nowrap">
                            {matchingEdge?.label || activeWorkflow.edges[idx]?.label || 'Next'}
                          </span>
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Node Inspector Drawer (4 Cols) */}
            {selectedNode && (
              <div className="lg:col-span-4 rounded-2xl border border-[#27272A] bg-[#121215] p-5 shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-[#1E1E22] pb-3">
                  <div className="flex items-center gap-2">
                    <Sliders className="h-4 w-4 text-[#06B6D4]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                      Node Inspector
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedNodeId(null)}
                    className="text-[#71717A] hover:text-white p-1 text-xs"
                    title="Close Inspector"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-mono uppercase text-[#71717A] block">
                      Node Identity
                    </label>
                    <p className="font-bold text-white mt-0.5">{selectedNode.label}</p>
                    <span className="text-[10px] font-mono text-[#06B6D4]">
                      ID: {selectedNode.id} • Type: {selectedNode.type}
                    </span>
                  </div>

                  <div>
                    <label className="text-[10px] font-mono uppercase text-[#71717A] block">
                      SubType / Role
                    </label>
                    <p className="text-[#A1A1AA] text-[11px] capitalize mt-0.5">
                      {selectedNode.subType.replace(/_/g, ' ')}
                    </p>
                  </div>

                  {selectedNodeState && (
                    <div className="p-3 rounded-lg bg-[#18181B] border border-[#27272A] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#71717A]">Execution State:</span>
                        <span className="font-bold text-emerald-400 uppercase">
                          {selectedNodeState.status}
                        </span>
                      </div>
                      {selectedNodeState.output && (
                        <div>
                          <span className="text-[10px] font-mono text-[#71717A] block">Output:</span>
                          <pre className="text-[10px] font-mono text-[#D4D4D8] overflow-x-auto max-h-[100px] p-1.5 rounded bg-black/50 border border-white/5">
                            {JSON.stringify(selectedNodeState.output, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  )}

                  {selectedNode.config && Object.keys(selectedNode.config).length > 0 && (
                    <div>
                      <label className="text-[10px] font-mono uppercase text-[#71717A] block mb-1">
                        Node Configuration
                      </label>
                      <pre className="text-[10px] font-mono text-[#A1A1AA] overflow-x-auto max-h-[140px] p-2 rounded-lg bg-[#18181B] border border-[#27272A]">
                        {JSON.stringify(selectedNode.config, null, 2)}
                      </pre>
                    </div>
                  )}

                  {selectedNode.type === 'human_approval' && activeRun?.status === 'waiting_approval' && (
                    <div className="pt-2">
                      <button
                        onClick={() => handleApproveCheckpoint(selectedNode.id)}
                        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-bold text-xs transition"
                      >
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve This Checkpoint</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Execution Telemetry Log Drawer */}
          {activeRun?.logs && (
            <div className="p-4 rounded-xl border border-[#27272A] bg-[#121215] space-y-2">
              <div className="flex items-center gap-2 border-b border-[#1E1E22] pb-2">
                <Terminal className="h-4 w-4 text-[#06B6D4]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Live Execution Telemetry
                </h4>
              </div>
              <div className="max-h-[160px] overflow-y-auto space-y-1 font-mono text-[11px]">
                {activeRun.logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[#A1A1AA]">
                    <span className="text-[#71717A]">
                      [{new Date(log.timestamp).toLocaleTimeString()}]
                    </span>
                    <span
                      className={
                        log.level === 'warn'
                          ? 'text-amber-400'
                          : log.level === 'error'
                          ? 'text-red-400'
                          : 'text-[#D4D4D8]'
                      }
                    >
                      {log.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
