// =============================================================================
// NUVEXA — Client-Safe User Models & Default Identities
// Pure TypeScript • Zero Server-Only Dependencies • 100% Client-Safe
// =============================================================================

export interface NuvexaUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'guest';
  createdAt: string;
  preferences: {
    theme: 'dark';
    defaultModel: string;
    enableWebSearch: boolean;
    streamSpeed: 'fast' | 'normal' | 'precise';
    autoSaveChats: boolean;
  };
}

export const DEFAULT_DEV_USER: NuvexaUser = {
  id: 'usr_local_dev_01',
  email: 'developer@nuvexa.local',
  name: 'Local Developer',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
  preferences: {
    theme: 'dark',
    defaultModel: 'llama-3.2-3b',
    enableWebSearch: true,
    streamSpeed: 'fast',
    autoSaveChats: true,
  },
};

export function getDefaultUser(): NuvexaUser {
  return DEFAULT_DEV_USER;
}
