// =============================================================================
// RIIQX — Client-Safe User Models & Default Identities
// Pure TypeScript • Zero Server-Only Dependencies • 100% Client-Safe
// =============================================================================

export interface RiiqxUser {
  id: string;
  email: string;
  name: string;
  role: 'creator' | 'developer' | 'admin';
  createdAt: string;
  preferences: {
    theme: 'dark' | 'midnight';
    defaultLanguage: 'en' | 'bn' | 'hi';
    autoSave: boolean;
    streamResponses: boolean;
  };
}

export function getDefaultUser(): RiiqxUser {
  return {
    id: 'usr_riiqx_primary',
    email: 'creator@riiqx.ai',
    name: 'RIIQX Creator',
    role: 'creator',
    createdAt: new Date().toISOString(),
    preferences: {
      theme: 'dark',
      defaultLanguage: 'en',
      autoSave: true,
      streamResponses: true,
    },
  };
}
