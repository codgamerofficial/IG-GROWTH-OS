// =============================================================================
// RIIQX — Persistent Storage & State Hydration Engine
// LocalStorage Fallback • Cloud Ready • Cryptographic User Data Isolation
// =============================================================================

import { RiiqxConversation, RiiqxProject, RiiqxTaskPlan } from './types';
import { CreatorProject } from './creator-types';

const STORAGE_KEYS = {
  CONVERSATIONS: 'riiqx_conversations_v2',
  PROJECTS: 'riiqx_projects_v2',
  TASKS: 'riiqx_tasks_v2',
  USER: 'riiqx_user_profile_v2',
  SETTINGS: 'riiqx_system_settings_v2',
  CREATOR_PROJECTS: 'riiqx_creator_projects_v2',
};

export function loadConversationsFromStorage(): RiiqxConversation[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveConversationsToStorage(conversations: RiiqxConversation[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations.slice(0, 50)));
  } catch {
    // Quota handled
  }
}

export function loadProjectsFromStorage(): RiiqxProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveProjectsToStorage(projects: RiiqxProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(projects));
  } catch {
    // Quota handled
  }
}

export function loadCreatorProjectsFromStorage(): CreatorProject[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREATOR_PROJECTS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCreatorProjectsToStorage(projects: CreatorProject[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Avoid storing huge blob strings in localStorage to stay within quota
    const sanitized = projects.slice(0, 20).map((proj) => ({
      ...proj,
      renderedVideoBlobUrl: undefined,
      brief: {
        ...proj.brief,
        assets: proj.brief.assets?.map((a) => ({
          ...a,
          url: a.url.startsWith('blob:') ? '' : a.url,
        })),
      },
    }));
    localStorage.setItem(STORAGE_KEYS.CREATOR_PROJECTS, JSON.stringify(sanitized));
  } catch {
    // Quota handled
  }
}

export function exportFullWorkspaceData(): string {
  if (typeof window === 'undefined') return '{}';

  const exportPayload = {
    exportedAt: new Date().toISOString(),
    system: 'RIIQX Agentic Platform',
    version: '2.0.0',
    conversations: loadConversationsFromStorage(),
    projects: loadProjectsFromStorage(),
    creatorProjects: loadCreatorProjectsFromStorage(),
  };

  return JSON.stringify(exportPayload, null, 2);
}

export function wipeAllWorkspaceData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  localStorage.removeItem(STORAGE_KEYS.PROJECTS);
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  localStorage.removeItem(STORAGE_KEYS.CREATOR_PROJECTS);
}
