// =============================================================================
// RIIQX — Server-Side Creator Projects Persistent Store
// Multi-Device Persistence • Synchronizes Web & Mobile Workspaces
// =============================================================================

import { CreatorProject } from './creator-types';
import { createDefaultProject } from './creator-engine';
import { getSafeTempFilePath, safeReadJson, safeWriteJson } from './temp-storage';

const PROJECTS_FILE = getSafeTempFilePath('creator_projects.json');

const INITIAL_PROJECTS: CreatorProject[] = [
  (() => {
    const p = createDefaultProject({
      topic: 'Online-First Cloud Intelligence vs Local Model Bottlenecks',
      niche: 'TECH & AI',
      durationSeconds: 30,
      platform: 'both',
    });
    p.id = 'proj_001_cloud_vs_local';
    p.name = 'Online-First Cloud Intelligence vs Local Model Bottlenecks';
    p.status = 'ready_to_publish';
    return p;
  })(),
  (() => {
    const p = createDefaultProject({
      topic: '50x growth strategi in stocks on end of 2026',
      niche: 'AI & AUTOMATION',
      durationSeconds: 30,
      platform: 'instagram_reels',
    });
    p.id = 'proj_002_growth_strategi';
    p.name = '50x growth strategi in stocks on end of 2026';
    p.status = 'ready_to_publish';
    return p;
  })(),
  (() => {
    const p = createDefaultProject({
      topic: 'Online-First Cloud Intelligence vs Local Model Bottlenecks',
      niche: 'MR BEAN',
      durationSeconds: 30,
      platform: 'youtube_shorts',
    });
    p.id = 'proj_003_mr_bean';
    p.name = 'Online-First Cloud Intelligence vs Local Model Bottlenecks';
    p.status = 'ready_to_publish';
    return p;
  })(),
  (() => {
    const p = createDefaultProject({
      topic: '3 Prompt Hacks That 10x Claude Sonnet Output',
      niche: 'Tech & Productivity',
      durationSeconds: 30,
      platform: 'both',
    });
    p.id = 'proj_004_claude_sonnet';
    p.name = '3 Prompt Hacks That 10x Claude Sonnet Output';
    p.status = 'scheduled';
    return p;
  })(),
  (() => {
    const p = createDefaultProject({
      topic: 'Why Bedrock Cloud + Local Edge AI is the Winning Hybrid in 2026',
      niche: 'AI Engineering',
      durationSeconds: 30,
      platform: 'both',
    });
    p.id = 'proj_005_bedrock_hybrid';
    p.name = 'Why Bedrock Cloud + Local Edge AI is the Winning Hybrid in 2026';
    p.status = 'published';
    return p;
  })(),
  (() => {
    const p = createDefaultProject({
      topic: 'DeepSeek R1 vs Claude 3.7 Sonnet: The Ultimate Reasoning Benchmark',
      niche: 'Developer Tools',
      durationSeconds: 60,
      platform: 'youtube_shorts',
    });
    p.id = 'proj_006_deepseek_reasoning';
    p.name = 'DeepSeek R1 vs Claude 3.7 Sonnet: The Ultimate Reasoning Benchmark';
    p.status = 'producing';
    return p;
  })(),
];

// In-memory cache synced with disk
let cachedProjects: CreatorProject[] | null = null;

export function listCreatorProjects(): CreatorProject[] {
  if (cachedProjects && cachedProjects.length > 0) {
    return cachedProjects;
  }

  const loaded = safeReadJson<CreatorProject[]>(PROJECTS_FILE, []);
  if (loaded && loaded.length > 0) {
    cachedProjects = loaded;
    return cachedProjects;
  }

  // Seed with initial 6 projects
  cachedProjects = [...INITIAL_PROJECTS];
  safeWriteJson(PROJECTS_FILE, cachedProjects);
  return cachedProjects;
}

export function getCreatorProject(id: string): CreatorProject | null {
  const projects = listCreatorProjects();
  return projects.find((p) => p.id === id) || null;
}

export function saveCreatorProject(project: CreatorProject): CreatorProject {
  const projects = listCreatorProjects();
  const existingIdx = projects.findIndex((p) => p.id === project.id);

  if (existingIdx >= 0) {
    projects[existingIdx] = { ...project, updatedAt: new Date().toISOString() };
  } else {
    projects.unshift({
      ...project,
      createdAt: project.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  cachedProjects = projects;
  safeWriteJson(PROJECTS_FILE, projects);
  return project;
}

export function saveAllCreatorProjects(projects: CreatorProject[]): void {
  cachedProjects = projects;
  safeWriteJson(PROJECTS_FILE, projects);
}

export function deleteCreatorProject(id: string): boolean {
  const projects = listCreatorProjects();
  const filtered = projects.filter((p) => p.id !== id);
  if (filtered.length !== projects.length) {
    cachedProjects = filtered;
    safeWriteJson(PROJECTS_FILE, filtered);
    return true;
  }
  return false;
}

const BRAND_KIT_FILE = getSafeTempFilePath('creator_brand_kit.json');

export function getStoredBrandKit() {
  return safeReadJson(BRAND_KIT_FILE, null);
}

export function saveStoredBrandKit(brandKit: any) {
  safeWriteJson(BRAND_KIT_FILE, brandKit);
  return brandKit;
}
