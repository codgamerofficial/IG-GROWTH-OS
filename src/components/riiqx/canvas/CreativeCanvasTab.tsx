'use client';

// =============================================================================
// RIIQX — Master AI Creative Canvas Tab
// Infinite Pan/Zoom • 7 Block Types • Dynamic Connectors • Contextual AI Transforms
// =============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Plus,
  Sparkles,
  Video,
  Megaphone,
  Save,
  Trash2,
  Palette,
  FileText,
  Image as ImageIcon,
  Check,
  Copy,
  FolderOpen,
  RefreshCw,
  Sliders,
  Move,
  Layers,
  StickyNote as StickyIcon,
  Grid,
  Bot,
  ExternalLink,
} from 'lucide-react';
import {
  CanvasBlock,
  CanvasBlockType,
  CanvasConnector,
  CanvasProject,
  CanvasViewport,
} from '@/services/canvas/types';
import { BrandDNA } from '@/services/brand/types';

export function CreativeCanvasTab() {
  const [projects, setProjects] = useState<CanvasProject[]>([]);
  const [activeProject, setActiveProject] = useState<CanvasProject | null>(null);
  const [brandDNA, setBrandDNA] = useState<BrandDNA | null>(null);
  const [viewport, setViewport] = useState<CanvasViewport>({ x: 0, y: 0, zoom: 1.0 });
  const [selectedBlockIds, setSelectedBlockIds] = useState<string[]>([]);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // AI Transform Drawer / Modal
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiInstruction, setAiInstruction] = useState('Generate 3 high-retention video hooks based on these elements');
  const [aiTransforming, setAiTransforming] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);

  // Initial load
  useEffect(() => {
    fetchInitialData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const fetchInitialData = async () => {
    try {
      // 1. Fetch Brand DNA
      const brandRes = await fetch('/api/riiqx/brand');
      if (brandRes.ok) {
        const brandData = await brandRes.json();
        if (brandData.success && brandData.brand) {
          setBrandDNA(brandData.brand);
        }
      }

      // 2. Fetch Projects
      const projRes = await fetch('/api/riiqx/canvas');
      if (projRes.ok) {
        const projData = await projRes.json();
        if (projData.success && Array.isArray(projData.projects) && projData.projects.length > 0) {
          setProjects(projData.projects);
          setActiveProject(projData.projects[0]);
          setViewport(projData.projects[0].viewport || { x: 0, y: 0, zoom: 1.0 });
        } else {
          // Initialize default starter canvas
          initializeDefaultCanvas();
        }
      }
    } catch (err) {
      console.warn('Canvas initial data load error:', err);
      initializeDefaultCanvas();
    }
  };

  const initializeDefaultCanvas = () => {
    const starterBlocks: CanvasBlock[] = [
      {
        id: 'block_hero_copy',
        type: 'text',
        x: 120,
        y: 100,
        width: 340,
        height: 200,
        zIndex: 2,
        data: {
          title: 'Brand Hook Narrative',
          text: 'Scale your creative output 10x with autonomous AI agents. Zero manual bottlenecks.',
          fontSize: 16,
          fontWeight: 'bold',
          statusTag: 'Approved',
        },
      },
      {
        id: 'block_palette',
        type: 'color_swatch',
        x: 520,
        y: 100,
        width: 300,
        height: 180,
        zIndex: 2,
        data: {
          title: 'Obsidian & Gold Palette',
          hexCode: '#FFD43B',
          paletteName: 'RIIQX Brand Kinetic',
          paletteColors: ['#FFD43B', '#0C0C0E', '#06B6D4', '#202124'],
        },
      },
      {
        id: 'block_video_concept',
        type: 'video',
        x: 120,
        y: 340,
        width: 340,
        height: 280,
        zIndex: 2,
        data: {
          title: '9:16 Vertical Reel Preview',
          videoUrl: '/uploads/sample_vertical.mp4',
          aspectRatio: '9:16',
          caption: 'Opening 3-second kinetic pattern interrupt',
          statusTag: 'In Production',
        },
      },
      {
        id: 'block_sticky_note',
        type: 'sticky_note',
        x: 520,
        y: 340,
        width: 260,
        height: 180,
        zIndex: 2,
        data: {
          title: 'Pacing Directive',
          text: 'Maintain 120-140 WPM spoken cadence. Highlight primary keywords in yellow overlay.',
          noteColor: 'yellow',
          statusTag: 'Review',
        },
      },
    ];

    const starterConnectors: CanvasConnector[] = [
      {
        id: 'conn_1',
        fromBlockId: 'block_hero_copy',
        toBlockId: 'block_video_concept',
        label: 'Drives Reel Hook',
        color: '#FFD43B',
      },
      {
        id: 'conn_2',
        fromBlockId: 'block_palette',
        toBlockId: 'block_sticky_note',
        label: 'Style Match',
        color: '#06B6D4',
      },
    ];

    const starterProject: CanvasProject = {
      id: `canvas_${Date.now()}`,
      name: 'Omnichannel Creator Moodboard',
      description: 'Unified visual and copy sandbox',
      blocks: starterBlocks,
      connectors: starterConnectors,
      viewport: { x: 50, y: 30, zoom: 0.95 },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProjects([starterProject]);
    setActiveProject(starterProject);
    setViewport(starterProject.viewport);
  };

  // Zoom handlers
  const handleZoom = (delta: number) => {
    setViewport((prev) => ({
      ...prev,
      zoom: Math.min(Math.max(0.3, Number((prev.zoom + delta).toFixed(2))), 2.5),
    }));
  };

  const handleResetZoom = () => {
    setViewport({ x: 0, y: 0, zoom: 1.0 });
  };

  // Wheel zoom / pan
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? -0.1 : 0.1;
      handleZoom(zoomFactor);
    } else {
      setViewport((prev) => ({
        ...prev,
        x: prev.x - e.deltaX * 0.8,
        y: prev.y - e.deltaY * 0.8,
      }));
    }
  };

  // Canvas backdrop drag (pan)
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).id === 'canvas-grid-bg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      setSelectedBlockIds([]);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setViewport((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }));
    } else if (draggingBlockId && activeProject) {
      const mouseXInCanvas = (e.clientX - viewport.x) / viewport.zoom;
      const mouseYInCanvas = (e.clientY - viewport.y) / viewport.zoom;

      const updatedBlocks = activeProject.blocks.map((b) =>
        b.id === draggingBlockId
          ? {
              ...b,
              x: Math.round(mouseXInCanvas - dragOffset.x),
              y: Math.round(mouseYInCanvas - dragOffset.y),
            }
          : b
      );

      setActiveProject({ ...activeProject, blocks: updatedBlocks });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    setDraggingBlockId(null);
  };

  // Block dragging start
  const handleBlockMouseDown = (e: React.MouseEvent, block: CanvasBlock) => {
    e.stopPropagation();
    if (e.shiftKey) {
      setSelectedBlockIds((prev) =>
        prev.includes(block.id) ? prev.filter((id) => id !== block.id) : [...prev, block.id]
      );
    } else {
      setSelectedBlockIds([block.id]);
    }

    setDraggingBlockId(block.id);
    const mouseXInCanvas = (e.clientX - viewport.x) / viewport.zoom;
    const mouseYInCanvas = (e.clientY - viewport.y) / viewport.zoom;
    setDragOffset({
      x: mouseXInCanvas - block.x,
      y: mouseYInCanvas - block.y,
    });
  };

  // Add new block
  const handleAddBlock = (type: CanvasBlockType) => {
    if (!activeProject) return;

    const newId = `block_${Date.now()}`;
    const centerX = Math.round((-viewport.x + 300) / viewport.zoom);
    const centerY = Math.round((-viewport.y + 200) / viewport.zoom);

    let newBlockData: any = { title: `New ${type} Block` };

    if (type === 'text') {
      newBlockData = {
        title: 'New Narrative Block',
        text: 'Enter high-converting copy or campaign hooks here...',
        fontSize: 14,
        statusTag: 'Draft',
      };
    } else if (type === 'color_swatch') {
      newBlockData = {
        title: 'Brand Color Swatch',
        hexCode: brandDNA?.colorPalette.primary || '#FFD43B',
        paletteColors: [brandDNA?.colorPalette.primary || '#FFD43B', '#0C0C0E', '#06B6D4'],
      };
    } else if (type === 'sticky_note') {
      newBlockData = {
        title: 'Quick Note',
        text: 'Action item or creative direction note.',
        noteColor: 'yellow',
        statusTag: 'Ideas',
      };
    } else if (type === 'video') {
      newBlockData = {
        title: '9:16 Video Asset',
        videoUrl: '/uploads/sample_vertical.mp4',
        aspectRatio: '9:16',
        caption: 'Autonomous video cut preview',
        statusTag: 'Draft',
      };
    } else if (type === 'image') {
      newBlockData = {
        title: 'Visual Concept',
        aspectRatio: '1:1',
        caption: 'High-contrast product visual',
        statusTag: 'Draft',
      };
    }

    const newBlock: CanvasBlock = {
      id: newId,
      type,
      x: centerX,
      y: centerY,
      width: type === 'sticky_note' ? 240 : 320,
      height: type === 'sticky_note' ? 180 : 220,
      zIndex: activeProject.blocks.length + 1,
      data: newBlockData,
    };

    const updated = {
      ...activeProject,
      blocks: [...activeProject.blocks, newBlock],
    };
    setActiveProject(updated);
    setSelectedBlockIds([newId]);
    showToast(`Added new ${type} block to canvas`);
  };

  // Delete selected blocks
  const handleDeleteSelected = () => {
    if (!activeProject || selectedBlockIds.length === 0) return;
    const updatedBlocks = activeProject.blocks.filter((b) => !selectedBlockIds.includes(b.id));
    const updatedConnectors = activeProject.connectors.filter(
      (c) => !selectedBlockIds.includes(c.fromBlockId) && !selectedBlockIds.includes(c.toBlockId)
    );
    setActiveProject({ ...activeProject, blocks: updatedBlocks, connectors: updatedConnectors });
    setSelectedBlockIds([]);
    showToast('Deleted selected blocks');
  };

  // Save Project
  const handleSaveProject = async () => {
    if (!activeProject) return;
    try {
      const res = await fetch('/api/riiqx/canvas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...activeProject,
          viewport,
        }),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Canvas project saved successfully');
      }
    } catch (err) {
      showToast('Error saving project');
    }
  };

  // Apply Brand DNA to selected blocks
  const handleApplyBrandDNA = () => {
    if (!activeProject || selectedBlockIds.length === 0 || !brandDNA) return;

    const updatedBlocks = activeProject.blocks.map((b) => {
      if (!selectedBlockIds.includes(b.id)) return b;

      return {
        ...b,
        data: {
          ...b.data,
          color: brandDNA.colorPalette.primary,
          backgroundColor: '#18181B',
          hexCode: b.type === 'color_swatch' ? brandDNA.colorPalette.primary : b.data.hexCode,
        },
      };
    });

    setActiveProject({ ...activeProject, blocks: updatedBlocks });
    showToast(`Applied Brand DNA (${brandDNA.brandName}) to selected blocks`);
  };

  // Execute AI Transform
  const handleExecuteAiTransform = async () => {
    if (!activeProject || selectedBlockIds.length === 0) return;

    setAiTransforming(true);
    const selectedBlocks = activeProject.blocks.filter((b) => selectedBlockIds.includes(b.id));

    try {
      const res = await fetch('/api/riiqx/canvas/ai-transform', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          instruction: aiInstruction,
          selectedBlocks,
          brandDNA,
        }),
      });

      const data = await res.json();
      if (data.success && data.result) {
        // Apply updates
        let currentBlocks = [...activeProject.blocks];
        for (const updateItem of data.result.updatedBlocks || []) {
          currentBlocks = currentBlocks.map((b) =>
            b.id === updateItem.id ? { ...b, data: { ...b.data, ...updateItem.updates } } : b
          );
        }

        // Add suggested new blocks
        const newSuggested: CanvasBlock[] = (data.result.suggestedNewBlocks || []).map(
          (sb: any, idx: number) => ({
            id: `block_suggested_${Date.now()}_${idx}`,
            type: sb.type,
            x: sb.x || 200,
            y: sb.y || 200,
            width: sb.width || 280,
            height: sb.height || 180,
            zIndex: currentBlocks.length + idx + 1,
            data: sb.data,
          })
        );

        setActiveProject({
          ...activeProject,
          blocks: [...currentBlocks, ...newSuggested],
        });

        setShowAiModal(false);
        showToast(data.result.summary || 'AI Transform applied cleanly!');
      } else {
        alert(data.error || 'AI Transform failed');
      }
    } catch (err: any) {
      alert('AI Transform error: ' + err.message);
    } finally {
      setAiTransforming(false);
    }
  };

  // Bridge to AI Video Editor
  const handleExportToVideo = async () => {
    if (!activeProject) return;
    try {
      showToast('Bridging canvas elements to Video Editor...');
      const res = await fetch('/api/riiqx/canvas/export-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          selectedBlockIds: selectedBlockIds.length > 0 ? selectedBlockIds : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.bridge) {
        showToast(`Video Storyboard created! ID: ${data.bridge.storyboardId}`);
      } else {
        alert(data.error || 'Failed to export to video');
      }
    } catch (err: any) {
      alert('Export to video error: ' + err.message);
    }
  };

  // Bridge to Campaign Studio
  const handleExportToCampaign = async () => {
    if (!activeProject) return;
    try {
      showToast('Synthesizing omnichannel campaign from canvas...');
      const res = await fetch('/api/riiqx/canvas/export-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: activeProject.id,
          selectedBlockIds: selectedBlockIds.length > 0 ? selectedBlockIds : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.campaign) {
        showToast(`Campaign Studio draft created: "${data.campaign.name}"!`);
      } else {
        alert(data.error || 'Failed to export to campaign');
      }
    } catch (err: any) {
      alert('Export to campaign error: ' + err.message);
    }
  };

  // Update block text directly
  const handleBlockTextChange = (blockId: string, newText: string) => {
    if (!activeProject) return;
    const updated = activeProject.blocks.map((b) =>
      b.id === blockId ? { ...b, data: { ...b.data, text: newText } } : b
    );
    setActiveProject({ ...activeProject, blocks: updated });
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0C0C0E] select-none flex flex-col">
      {/* Top Floating Control Bar */}
      <header className="z-20 h-14 border-b border-[#27272A] bg-[#121215]/95 backdrop-blur-md px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[#FFD43B]/10 border border-[#FFD43B]/30 flex items-center justify-center text-[#FFD43B]">
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-white tracking-wide flex items-center gap-2">
                {activeProject?.name || 'Creative Canvas'}
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#FFD43B]/10 text-[#FFD43B] border border-[#FFD43B]/30">
                  Infinite Pan/Zoom
                </span>
              </h1>
            </div>
          </div>

          <div className="h-4 w-px bg-[#27272A] mx-1" />

          {/* Add Block Toolbar */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAddBlock('text')}
              title="Add Text Block"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#D4D4D8] transition"
            >
              <FileText className="h-3.5 w-3.5 text-[#FFD43B]" />
              <span className="hidden sm:inline">Text</span>
            </button>
            <button
              onClick={() => handleAddBlock('color_swatch')}
              title="Add Color Swatch"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#D4D4D8] transition"
            >
              <Palette className="h-3.5 w-3.5 text-[#06B6D4]" />
              <span className="hidden sm:inline">Palette</span>
            </button>
            <button
              onClick={() => handleAddBlock('video')}
              title="Add Video Block"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#D4D4D8] transition"
            >
              <Video className="h-3.5 w-3.5 text-purple-400" />
              <span className="hidden sm:inline">Video 9:16</span>
            </button>
            <button
              onClick={() => handleAddBlock('sticky_note')}
              title="Add Sticky Note"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#27272A] text-xs text-[#D4D4D8] transition"
            >
              <StickyIcon className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Note</span>
            </button>
          </div>
        </div>

        {/* Center / Action Toolbar */}
        <div className="flex items-center gap-2">
          {/* Contextual AI Transform Button */}
          {selectedBlockIds.length > 0 && (
            <div className="flex items-center gap-2 animate-fadeIn">
              <button
                onClick={() => setShowAiModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-semibold text-xs transition shadow-md shadow-[#FFD43B]/10"
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Transform ({selectedBlockIds.length})</span>
              </button>

              <button
                onClick={handleApplyBrandDNA}
                title="Apply active Brand DNA tokens to selected"
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-[#FFD43B]/40 text-xs text-[#FFD43B] transition"
              >
                <Palette className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Sync Brand</span>
              </button>

              <button
                onClick={handleDeleteSelected}
                title="Delete Selected Blocks"
                className="p-1.5 rounded-lg bg-[#18181B] hover:bg-red-950/40 border border-[#27272A] text-[#71717A] hover:text-red-400 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          )}

          <div className="h-4 w-px bg-[#27272A] mx-1" />

          {/* Cross Engine Bridges */}
          <button
            onClick={handleExportToVideo}
            title="Convert canvas blocks to Storyboard in AI Video Editor"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-purple-500/40 text-xs text-purple-300 font-medium transition"
          >
            <Video className="h-3.5 w-3.5 text-purple-400" />
            <span className="hidden lg:inline">Send to Video</span>
          </button>

          <button
            onClick={handleExportToCampaign}
            title="Convert canvas blocks to Multi-Channel Campaign"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] border border-blue-500/40 text-xs text-blue-300 font-medium transition"
          >
            <Megaphone className="h-3.5 w-3.5 text-blue-400" />
            <span className="hidden lg:inline">Send to Campaign</span>
          </button>

          <button
            onClick={handleSaveProject}
            title="Save Project"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#27272A] hover:bg-[#3F3F46] text-white text-xs font-medium transition"
          >
            <Save className="h-3.5 w-3.5" />
            <span>Save</span>
          </button>
        </div>
      </header>

      {/* Floating Canvas Viewport HUD */}
      <div className="absolute bottom-5 right-5 z-20 flex items-center gap-1.5 p-1.5 rounded-xl border border-[#27272A] bg-[#121215]/90 backdrop-blur-md shadow-2xl">
        <button
          onClick={() => handleZoom(-0.1)}
          className="p-1.5 rounded-lg hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4" />
        </button>
        <span className="text-[11px] font-mono text-[#D4D4D8] px-2 min-w-[48px] text-center">
          {Math.round(viewport.zoom * 100)}%
        </span>
        <button
          onClick={() => handleZoom(0.1)}
          className="p-1.5 rounded-lg hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1.5 rounded-lg hover:bg-[#27272A] text-[#A1A1AA] hover:text-white transition text-xs"
          title="Reset Zoom & Pan"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-4 py-2 rounded-xl border border-[#FFD43B]/40 bg-[#121215]/95 text-xs text-[#FFD43B] shadow-2xl backdrop-blur-md animate-fadeIn flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#FFD43B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Infinite Canvas Stage */}
      <div
        ref={canvasRef}
        id="canvas-grid-bg"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="relative flex-1 w-full h-full overflow-hidden cursor-grab active:cursor-grabbing bg-[#0C0C0E]"
        style={{
          backgroundImage:
            'radial-gradient(circle, #27272A 1px, transparent 1px)',
          backgroundSize: `${32 * viewport.zoom}px ${32 * viewport.zoom}px`,
          backgroundPosition: `${viewport.x}px ${viewport.y}px`,
        }}
      >
        {/* Scaled/Panned Container */}
        <div
          className="absolute origin-top-left pointer-events-none"
          style={{
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          }}
        >
          {/* SVG Connector Layer */}
          <svg className="absolute top-0 left-0 overflow-visible w-[5000px] h-[5000px] pointer-events-none">
            {activeProject?.connectors.map((conn) => {
              const fromBlock = activeProject.blocks.find((b) => b.id === conn.fromBlockId);
              const toBlock = activeProject.blocks.find((b) => b.id === conn.toBlockId);
              if (!fromBlock || !toBlock) return null;

              const x1 = fromBlock.x + fromBlock.width;
              const y1 = fromBlock.y + fromBlock.height / 2;
              const x2 = toBlock.x;
              const y2 = toBlock.y + toBlock.height / 2;
              const dx = (x2 - x1) * 0.5;

              return (
                <g key={conn.id}>
                  <path
                    d={`M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`}
                    fill="none"
                    stroke={conn.color || '#FFD43B'}
                    strokeWidth="2"
                    strokeDasharray="5,5"
                    className="opacity-70"
                  />
                  {conn.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 8}
                      fill="#A1A1AA"
                      fontSize="10"
                      textAnchor="middle"
                      className="font-mono bg-black"
                    >
                      {conn.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Blocks Render Loop */}
          {activeProject?.blocks.map((block) => {
            const isSelected = selectedBlockIds.includes(block.id);

            return (
              <div
                key={block.id}
                onMouseDown={(e) => handleBlockMouseDown(e, block)}
                className={`absolute rounded-xl border pointer-events-auto transition-shadow shadow-lg overflow-hidden flex flex-col justify-between ${
                  isSelected
                    ? 'border-[#FFD43B] ring-2 ring-[#FFD43B]/20 shadow-2xl'
                    : 'border-[#27272A] hover:border-[#3F3F46]'
                } ${
                  block.type === 'sticky_note'
                    ? block.data.noteColor === 'cyan'
                      ? 'bg-cyan-950/40 border-cyan-800/40 text-cyan-200'
                      : block.data.noteColor === 'purple'
                      ? 'bg-purple-950/40 border-purple-800/40 text-purple-200'
                      : 'bg-amber-950/40 border-amber-800/40 text-amber-200'
                    : 'bg-[#151518]'
                }`}
                style={{
                  transform: `translate(${block.x}px, ${block.y}px)`,
                  width: `${block.width}px`,
                  minHeight: `${block.height}px`,
                  zIndex: block.zIndex,
                }}
              >
                {/* Block Drag Handle Header */}
                <div className="p-2.5 px-3 border-b border-[#27272A]/70 flex items-center justify-between cursor-move bg-[#18181B]/80">
                  <div className="flex items-center gap-2">
                    <Move className="h-3 w-3 text-[#71717A]" />
                    <span className="text-[11px] font-semibold text-white truncate max-w-[160px]">
                      {block.data.title || block.type.toUpperCase()}
                    </span>
                  </div>

                  {block.data.statusTag && (
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#27272A] text-[#A1A1AA]">
                      {block.data.statusTag}
                    </span>
                  )}
                </div>

                {/* Block Body Content */}
                <div className="p-3 flex-1 flex flex-col justify-center">
                  {block.type === 'text' && (
                    <textarea
                      value={block.data.text || ''}
                      onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
                      rows={4}
                      className="w-full bg-transparent border-none text-xs text-white placeholder-[#71717A] focus:outline-none resize-none leading-relaxed font-sans"
                    />
                  )}

                  {block.type === 'color_swatch' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-lg border border-white/20 shadow-inner"
                          style={{ backgroundColor: block.data.hexCode || '#FFD43B' }}
                        />
                        <div>
                          <div className="text-xs font-mono font-bold text-white">
                            {block.data.hexCode || '#FFD43B'}
                          </div>
                          <div className="text-[10px] text-[#71717A]">
                            {block.data.paletteName || 'Primary Accent'}
                          </div>
                        </div>
                      </div>

                      {block.data.paletteColors && (
                        <div className="flex items-center gap-1.5 pt-1">
                          {block.data.paletteColors.map((color, i) => (
                            <div
                              key={i}
                              className="w-5 h-5 rounded-md border border-white/10"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {block.type === 'video' && (
                    <div className="space-y-2">
                      <div className="relative aspect-[9/16] max-h-[140px] rounded-lg bg-black border border-[#27272A] overflow-hidden flex items-center justify-center">
                        <Video className="h-8 w-8 text-purple-400 opacity-60" />
                        <span className="absolute bottom-1 right-1 text-[8px] font-mono px-1 bg-black/80 text-white rounded">
                          9:16
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A1A1AA] truncate">
                        {block.data.caption || 'Vertical Reel Storyboard Cut'}
                      </p>
                    </div>
                  )}

                  {block.type === 'sticky_note' && (
                    <textarea
                      value={block.data.text || ''}
                      onChange={(e) => handleBlockTextChange(block.id, e.target.value)}
                      rows={3}
                      className="w-full bg-transparent border-none text-xs text-inherit placeholder-current/40 focus:outline-none resize-none leading-relaxed font-sans"
                    />
                  )}
                </div>

                {/* Block Footer Indicator */}
                <div className="p-1 px-3 border-t border-[#27272A]/40 flex items-center justify-between text-[9px] text-[#71717A] font-mono">
                  <span>{block.type}</span>
                  <span>{Math.round(block.x)}, {Math.round(block.y)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contextual AI Transform Modal */}
      {showAiModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg rounded-2xl border border-[#27272A] bg-[#121215] p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#27272A] pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#FFD43B]" />
                <h3 className="text-sm font-bold text-white">
                  Contextual AI Transform ({selectedBlockIds.length} Block Selected)
                </h3>
              </div>
              <button
                onClick={() => setShowAiModal(false)}
                className="text-[#71717A] hover:text-white p-1 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider block mb-1">
                Instruction for Selected Canvas Elements
              </label>
              <textarea
                value={aiInstruction}
                onChange={(e) => setAiInstruction(e.target.value)}
                rows={3}
                placeholder="e.g. Turn this visual concept into 3 high retention video hooks, or enhance the copy tone."
                className="w-full rounded-lg bg-[#18181B] border border-[#27272A] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#FFD43B] resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#71717A]">
                Brand DNA tokens ({brandDNA?.brandName || 'RIIQX'}) will be injected.
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAiModal(false)}
                  disabled={aiTransforming}
                  className="px-3 py-1.5 rounded-lg bg-[#18181B] hover:bg-[#27272A] text-xs text-[#A1A1AA]"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteAiTransform}
                  disabled={aiTransforming || !aiInstruction.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#FFD43B] hover:bg-[#FFE066] text-black font-semibold text-xs transition disabled:opacity-50"
                >
                  {aiTransforming ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Synthesizing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>Execute Transform</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

