'use client';

// =============================================================================
// PujaHop Kolkata: Admin Panel (Phase 19: Strict Audit Trail)
// Source Verification • Opening Hours • Coordinates • Audit Log with Diff & Reason
// =============================================================================

import React, { useState, useEffect } from 'react';
import { usePujaHop } from '@/context/PujaHopContext';
import { Pandal, PandalOpeningStatus } from '@/lib/types/pujahop';
import { SourceBadge } from '@/components/common/SourceBadge';
import {
  ShieldCheck,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  History,
  Save,
  Trash2,
  MapPin,
  Clock,
  Link,
  Train,
} from 'lucide-react';

export function AdminView() {
  const { pandals, trafficAlerts, refreshAllData } = usePujaHop();

  const [activeTab, setActiveTab] = useState<'pandals' | 'traffic' | 'audit'>('pandals');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [editingPandal, setEditingPandal] = useState<Pandal | null>(null);

  // Form State
  const [newStatus, setNewStatus] = useState<PandalOpeningStatus>('OPEN');
  const [newTheme, setNewTheme] = useState('');
  const [newLat, setNewLat] = useState<number>(22.56);
  const [newLng, setNewLng] = useState<number>(88.36);
  const [newSource, setNewSource] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');
  const [editReason, setEditReason] = useState('Routine 2026 pre-puja verification');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/audit')
      .then((r) => r.json())
      .then((data) => {
        if (data.logs) setAuditLogs(data.logs);
      })
      .catch(console.error);
  }, []);

  const handleStartEdit = (p: Pandal) => {
    setEditingPandal(p);
    setNewStatus(p.status);
    setNewTheme(p.theme);
    setNewLat(p.lat);
    setNewLng(p.lng);
    setNewSource(p.source);
    setNewSourceUrl(p.source_url || '');
    setEditReason('Routine field audit update');
  };

  const handleSavePandalUpdates = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPandal) return;

    try {
      const oldValue = {
        status: editingPandal.status,
        theme: editingPandal.theme,
        lat: editingPandal.lat,
        lng: editingPandal.lng,
        source: editingPandal.source,
      };

      const newValue = {
        status: newStatus,
        theme: newTheme || editingPandal.theme,
        lat: newLat,
        lng: newLng,
        source: newSource || editingPandal.source,
        source_url: newSourceUrl || editingPandal.source_url,
      };

      const res = await fetch(`/api/pandals/${editingPandal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newValue,
          verified_at: new Date().toISOString(),
          reason: editReason,
          old_value: oldValue,
          new_value: newValue,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`✔ Pandal '${editingPandal.name}' updated and logged to audit trail.`);
        setEditingPandal(null);
        await refreshAllData();
        const auditRes = await fetch('/api/audit').then((r) => r.json());
        if (auditRes.logs) setAuditLogs(auditRes.logs);
      }
    } catch (err: any) {
      setStatusMessage(`Error: ${err.message}`);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-400" />
            <span>PujaHop Admin & Provenance Control</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Editorial management: Verify sources, adjust opening status, calibrate GPS coordinates, and review immutable audit logs.
          </p>
          <div className="flex items-center gap-2 text-[11px] text-zinc-500 font-mono mt-1.5">
            <span>Engineering Credit:</span>
            <span className="text-amber-400 font-semibold">
              Created &amp; Conceptualized by Saswata Dey (Riik)
            </span>
          </div>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-1.5 bg-[#121124] p-1 rounded-xl border border-white/10 text-xs">
          <button
            onClick={() => setActiveTab('pandals')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'pandals' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Pandals ({pandals.length})
          </button>
          <button
            onClick={() => setActiveTab('traffic')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'traffic' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Traffic Advisories ({trafficAlerts.length})
          </button>
          <button
            onClick={() => setActiveTab('audit')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeTab === 'audit' ? 'bg-rose-600 text-white' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs text-emerald-300">
          {statusMessage}
        </div>
      )}

      {/* EDIT MODAL IF EDITING (Phase 19) */}
      {editingPandal && (
        <div className="p-6 rounded-2xl bg-[#15132B] border border-amber-500/40 space-y-4 shadow-2xl animate-in fade-in">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-amber-400" />
              <span>Edit Pandal: {editingPandal.name}</span>
            </h2>
            <button
              onClick={() => setEditingPandal(null)}
              className="text-zinc-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSavePandalUpdates} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Opening Status:</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as PandalOpeningStatus)}
                  className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white"
                >
                  <option value="OPEN">OPEN (Darshan active)</option>
                  <option value="EARLY OPENING">EARLY OPENING (Verified Pre-Puja)</option>
                  <option value="INAUGURATION">INAUGURATION</option>
                  <option value="UNDER PREPARATION">UNDER PREPARATION (Closed to public)</option>
                  <option value="UNKNOWN">UNKNOWN (Not verified)</option>
                  <option value="CLOSED">CLOSED</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">Theme Title:</label>
                <input
                  type="text"
                  value={newTheme}
                  placeholder={editingPandal.theme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-zinc-300 font-medium mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>Latitude:</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={newLat}
                  onChange={(e) => setNewLat(parseFloat(e.target.value))}
                  className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-zinc-300 font-medium mb-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  <span>Longitude:</span>
                </label>
                <input
                  type="number"
                  step="0.0001"
                  value={newLng}
                  onChange={(e) => setNewLng(parseFloat(e.target.value))}
                  className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">Source Name:</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-300 font-medium mb-1 flex items-center gap-1">
                  <Link className="w-3 h-3 text-cyan-400" />
                  <span>Source URL:</span>
                </label>
                <input
                  type="text"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-zinc-300 font-medium mb-1">Reason for Audit Log:</label>
              <input
                type="text"
                required
                value={editReason}
                onChange={(e) => setEditReason(e.target.value)}
                placeholder="e.g. Verified early opening via Kolkata Police circular"
                className="w-full bg-[#0D0B1C] border border-white/15 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingPandal(null)}
                className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold flex items-center gap-1.5 shadow-md shadow-amber-950/40"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes & Log Audit</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PANDALS MANAGEMENT TABLE */}
      {activeTab === 'pandals' && (
        <div className="rounded-2xl bg-[#121124] border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-zinc-300">
              <thead className="bg-white/5 text-zinc-400 uppercase text-[10px] font-bold border-b border-white/10">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Area</th>
                  <th className="p-3.5">Metro</th>
                  <th className="p-3.5">Opening Status</th>
                  <th className="p-3.5">Verified Source</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {pandals.map((p) => (
                  <tr key={p.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 font-bold text-white">
                      <div>{p.name}</div>
                      <div className="text-[11px] text-amber-300 font-normal">{p.name_bn}</div>
                    </td>
                    <td className="p-3.5 text-zinc-400">{p.area}</td>
                    <td className="p-3.5 font-medium text-zinc-200">🚇 {p.nearest_metro}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'OPEN'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : p.status === 'EARLY OPENING'
                          ? 'bg-amber-500/20 text-amber-300'
                          : p.status === 'UNDER PREPARATION'
                          ? 'bg-blue-500/20 text-blue-300'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3.5 max-w-[200px]">
                      <SourceBadge source={p.source} sourceUrl={p.source_url} sourceType={p.source_type} confidence={p.confidence} />
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TRAFFIC ALERTS MANAGEMENT */}
      {activeTab === 'traffic' && (
        <div className="space-y-3">
          {trafficAlerts.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-[#121124] border border-white/10 text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300">{a.category}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                  {a.status}
                </span>
              </div>
              <h3 className="font-bold text-white text-sm">{a.title}</h3>
              <p className="text-zinc-300 leading-relaxed">{a.description}</p>
              <div className="text-[10px] text-zinc-500 pt-1 flex items-center justify-between">
                <span>Source: {a.source}</span>
                <span>Valid: {new Date(a.valid_from).toLocaleDateString()} to {new Date(a.valid_until).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AUDIT LOGS */}
      {activeTab === 'audit' && (
        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3.5 rounded-xl bg-[#121124] border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <History className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-bold text-white">{log.action}</span>
                  <span className="text-zinc-400">on {log.resource_type}</span>
                </div>
                {log.metadata?.reason && (
                  <div className="text-[11px] text-zinc-400 pl-5">
                    Reason: <span className="text-zinc-200">{log.metadata.reason}</span>
                  </div>
                )}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono self-end sm:self-auto">
                {new Date(log.created_at).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
