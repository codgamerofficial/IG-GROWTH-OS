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

  // Sync projects with localStorage
  useEffect(() => {
    if (projects.length > 0) {
      saveCreatorProjectsToStorage(projects);
    }
  }, [projects]);

  // Update a single project
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
  }, []);

  // Delete project
  const handleDeleteProject = useCallback((id: string) => {
    setProjects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      if (activeProject?.id === id) {
        setActiveProject(next[0] || null);
      }
      return next;
    });
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
  }, []);

  // Convert Idea to Project
  const handleConvertIdeaToProject = useCallback((newProj: CreatorProject) => {
    setProjects((prev) => [newProj, ...prev]);
    setActiveProject(newProj);
    setActiveSubTab('script');
  }, []);

  return (
    <div className="flex h-full w-full flex-col min-h-0 overflow-y-auto bg-[#030712] text-slate-100 select-none">
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

        {activeSubTab === 'ideas' && (
          <IdeasTrendsTab onConvertToProject={handleConvertIdeaToProject} />
        )}

        {activeSubTab === 'planner' && (
          <ContentPlannerTab
            projects={projects}
            onSelectProject={setActiveProject}
            onTabChange={setActiveSubTab}
            onNewProject={handleNewProject}
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
          />
        )}

        {activeSubTab === 'brand_kit' && <BrandKitTab />}
      </main>
    </div>
  );
}
