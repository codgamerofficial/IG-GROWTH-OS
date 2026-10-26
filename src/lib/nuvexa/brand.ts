// =============================================================================
// NUVEXA AI — Master Brand, Identity & Design Configuration
// Tagline: One Assistant. Many Possibilities.
// Open-source • Multi-Model • Zero-Firebase • Deep Navy Visual Identity
// =============================================================================

export interface BrandConfig {
  name: string;
  shortName: string;
  tagline: string;
  version: string;
  status: 'production-ready' | 'alpha' | 'beta';
  license: string;
  palette: {
    bg: string;
    navy: string;
    card: string;
    surface: string;
    elevated: string;
    border: string;
    cyan: string;
    blue: string;
    violet: string;
    magenta: string;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export const nuvexaBrand: BrandConfig = {
  name: 'NUVEXA AI',
  shortName: 'Nuvexa',
  tagline: 'One Assistant. Many Possibilities.',
  version: '1.0.0-PROD',
  status: 'production-ready',
  license: 'Apache-2.0 / MIT Open-Weight First',
  palette: {
    bg: '#030712',
    navy: '#070D1F',
    card: '#0B132B',
    surface: '#0D1734',
    elevated: '#132147',
    border: '#1E2A4A',
    cyan: '#06B6D4',
    blue: '#3B82F6',
    violet: '#8B5CF6',
    magenta: '#EC4899',
  },
  seo: {
    title: 'NUVEXA AI — One Assistant. Many Possibilities.',
    description:
      'Production-oriented, open-source, multi-model AI assistant platform for chat, research, coding, document extraction, and multi-step task execution.',
    keywords: [
      'NUVEXA AI',
      'Open Source AI Assistant',
      'Multi-Model AI',
      'Ollama Local Models',
      'Autonomous Task Planner',
      'Safe AI Code Workspace',
      'Research Assistant with Citations',
      'Non-Firebase AI Platform',
    ],
  },
};
