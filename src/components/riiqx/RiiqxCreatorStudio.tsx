'use client';

// =============================================================================
// RIIQX Creator Studio 3.0 — AI Creator & Social Media Growth Studio
// 14 Specialized Workspaces • Complete YouTube Shorts & Instagram Reels Workflow
// Research → Create → Edit → Review → Schedule → Publish → Analyze → Improve
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  CreatorStudioTab,
  CreatorProject,
} from '@/lib/riiqx/creator-types';
import {
  createDefaultProject,
  generateStoryboard,
  generateScript,
} from '@/lib/riiqx/creator-engine';
import {
  loadCreatorProjectsFromStorage,
  saveCreatorProjectsToStorage,
} from '@/lib/riiqx/storage';
import { useRiiqx } from '@/context/RiiqxContext';

// 14 Modular Sub-Workspaces
import { CreatorStudioNav } from './creator/CreatorStudioNav';
import { CreatorOverviewTab } from './creator/CreatorOverviewTab';
import { AICreationLabTab } from './creator/AICreationLabTab';
import { AutopilotStudioTab } from './creator/AutopilotStudioTab';
import { IdeasTrendsTab } from './creator/IdeasTrendsTab';
import { ContentPlannerTab } from './creator/ContentPlannerTab';
import { ScriptStudioTab } from './creator/ScriptStudioTab';
import { StoryboardTab } from './creator/StoryboardTab';
import { VideoProductionTab } from './creator/VideoProductionTab';
import { AIAssetsTab } from './creator/AIAssetsTab';
import { CaptionsMetadataTab } from './creator/CaptionsMetadataTab';
import { PublishingQueueTab } from './creator/PublishingQueueTab';
import { CalendarTab } from './creator/CalendarTab';
import { PublishedContentTab } from './creator/PublishedContentTab';
import { PerformanceAnalyticsTab } from './creator/PerformanceAnalyticsTab';
import { TemplatesTab } from './creator/TemplatesTab';
import { BrandKitTab } from './creator/BrandKitTab';
import { CampaignStudioTab } from './creator/CampaignStudioTab';
import { CreativeCanvasTab } from './canvas/CreativeCanvasTab';
import { ProductStudioTab } from './products/ProductStudioTab';
import { WorkflowBuilderTab } from './workflows/WorkflowBuilderTab';
import { VoiceStudioTab } from './creator/VoiceStudioTab';
import { ShortsFactoryTab } from './creator/ShortsFactoryTab';
import { CaptureStudioTab } from './creator/CaptureStudioTab';
import { SEOIntelligenceTab } from './creator/SEOIntelligenceTab';

export function RiiqxCreatorStudio() {
  const { setActiveTab: setGlobalWorkspaceTab } = useRiiqx();

  // Active Creator Studio Sub-Tab
  const [activeSubTab, setActiveSubTab] = useState<CreatorStudioTab>('overview');

  // Multi-Project State
  const [projects, setProjects] = useState<CreatorProject[]>(() => {
    const saved = loadCreatorProjectsFromStorage();
    if (saved && saved.length > 0) return saved;

    // Seed 3 high-impact default projects if none exist
    const p1 = createDefaultProject({
      topic: 'Why Online-First AI Wins in 2026',
      niche: 'AI & SaaS',
      durationSeconds: 30,
      platform: 'both',
    });
    p1.status = 'published';

    const p2 = createDefaultProject({
      topic: '3 Prompt Hacks That 10x Claude Sonnet Output',
      niche: 'Tech & Productivity',
      durationSeconds: 30,
      platform: 'youtube_shorts',
    });
    p2.status = 'scheduled';

    const p3 = createDefaultProject({
      topic: 'How to Build an AI Automation Business with Zero Code',
      niche: 'Creator Economy',
      durationSeconds: 60,
      platform: 'instagram_reels',
    });
    p3.status = 'editing';

    return [p1, p2, p3];
  });

  const [activeProject, setActiveProject] = useState<CreatorProject | null>(() => {
    return projects[0] || null;
  });

  // Initial load from Shared Server Endpoint (/api/riiqx/creator) with localStorage fallback
  useEffect(() => {
    let isMounted = true;
    async function fetchServerProjects() {
      try {
        const res = await fetch('/api/riiqx/creator');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.projects) && data.projects.length > 0) {
            if (isMounted) {
              setProjects(data.projects);
              setActiveProject(data.projects[0] || null);
              saveCreatorProjectsToStorage(data.projects);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to fetch server creator projects, using cached:', err);
      }
    }
    fetchServerProjects();
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync projects with localStorage
  useEffect(() => {
    if (projects.length > 0) {
      saveCreatorProjectsToStorage(projects);
    }
  }, [projects]);

  // Update a single project & persist to Server Endpoint
  const handleUpdateProject = useCallback((updated: CreatorProject) => {
    setProjects((prev) => {
      const idx = prev.findIndex((p) => p.id === updated.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = updated;
        return next;
      }
      return [updated, ...prev];
    });
    setActiveProject(updated);

    // Durable Server Persistence
    fetch('/api/riiqx/creator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_project', project: updated }),
    }).catch((err) => console.warn('Failed to persist project to server:', err));
  }, []);

  // Delete project & remove from Server Endpoint
  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (activeProject?.id === id) {
        setActiveProject(next[0] || null);
      }
      return next;
    });

    // Durable Server Delete
    fetch('/api/riiqx/creator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_project', id }),
    }).catch((err) => console.warn('Failed to delete project on server:', err));
  }, [activeProject]);

  // New Project Wizard
  const handleNewProject = useCallback(() => {
    const topic = prompt('Enter your video topic or hook idea:', '10x Your Productivity With AI Agents');
    if (!topic || !topic.trim()) return;

    const newProj = createDefaultProject({
      topic: topic.trim(),
      niche: 'AI & Automation',
      durationSeconds: 30,
      platform: 'both',
    });

    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    setActiveSubTab('script');

    // Durable Server Persistence
    fetch('/api/riiqx/creator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_project', project: newProj }),
    }).catch((err) => console.warn('Failed to persist new project to server:', err));
  }, []);

  // Convert Idea to Project with durable server save
  const handleConvertIdeaToProject = useCallback((newProj: CreatorProject) => {
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    setActiveSubTab('script');

    // Durable Server Persistence
    fetch('/api/riiqx/creator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'save_project', project: newProj }),
    }).catch((err) => console.warn('Failed to persist new project to server:', err));
  }, []);

  return (
    <div className="flex h-full w-full flex-col min-h-0 overflow-y-auto bg-[#0C0C0E] text-[#F4F4F6] select-none">
      {/* Unified 14-Stage Workflow Navigation */}
      <CreatorStudioNav
        activeTab={activeSubTab}
        onTabChange={setActiveSubTab}
        projects={projects}
        activeProject={activeProject}
        onSelectProject={setActiveProject}
        onNewProject={handleNewProject}
      />

      {/* Main Workspace Stage Container */}
      <main className="flex-1 pb-16">
        {activeSubTab === 'overview' && (
          <CreatorOverviewTab
            projects={projects}
            activeProject={activeProject}
            onSelectProject={setActiveProject}
            onTabChange={setActiveSubTab}
            onNewProject={handleNewProject}
            onDeleteProject={handleDeleteProject}
          />
        )}

        {activeSubTab === 'ai_creation' && (
          <AICreationLabTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'shorts_factory' && (
          <ShortsFactoryTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'voice_studio' && (
          <VoiceStudioTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'capture_studio' && (
          <CaptureStudioTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'seo_intelligence' && (
          <SEOIntelligenceTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
            onNewProjectFromKeyword={(kw) => {
              const newProj = createDefaultProject({
                topic: kw,
                niche: 'AI & SaaS',
                durationSeconds: 30,
                platform: 'both',
              });
              handleConvertIdeaToProject(newProj);
            }}
          />
        )}

        {activeSubTab === 'autopilot' && (
          <AutopilotStudioTab
            project={activeProject}
            projects={projects}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'ideas' && (
          <IdeasTrendsTab onConvertToProject={handleConvertIdeaToProject} />
        )}

        {activeSubTab === 'planner' && (
          <ContentPlannerTab
            projects={projects}
            onSelectProject={setActiveProject}
            onTabChange={setActiveSubTab}
            onNewProject={handleNewProject}
            onUpdateProject={handleUpdateProject}
          />
        )}

        {activeSubTab === 'script' && (
          <ScriptStudioTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'storyboard' && (
          <StoryboardTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'editor' && (
          <VideoProductionTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'assets' && (
          <AIAssetsTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'metadata' && (
          <CaptionsMetadataTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'queue' && (
          <PublishingQueueTab
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'calendar' && (
          <CalendarTab
            projects={projects}
            onSelectProject={setActiveProject}
            onTabChange={setActiveSubTab}
            onNewProject={handleNewProject}
          />
        )}

        {activeSubTab === 'published' && (
          <PublishedContentTab
            projects={projects}
            onSelectProject={setActiveProject}
            onTabChange={setActiveSubTab}
          />
        )}

        {activeSubTab === 'analytics' && (
          <PerformanceAnalyticsTab project={activeProject} />
        )}

        {activeSubTab === 'templates' && (
          <TemplatesTab
            onSelectProject={setActiveProject}
            onTabChange={setActiveSubTab}
            onApplyTemplateProject={(p) => {
              handleConvertIdeaToProject(p);
              setActiveSubTab('editor');
            }}
          />
        )}

        {activeSubTab === 'brand_kit' && <BrandKitTab />}
        {activeSubTab === 'campaign_studio' && <CampaignStudioTab />}
        {activeSubTab === 'creative_canvas' && <CreativeCanvasTab />}
        {activeSubTab === 'product_studio' && (
          <ProductStudioTab onTabChange={setActiveSubTab} />
        )}
        {activeSubTab === 'workflow_builder' && <WorkflowBuilderTab />}
      </main>
    </div>
  );
}
