import { MetadataRoute } from 'next';
import { riiqxBrand } from '@/lib/riiqx/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: riiqxBrand.seo.title,
    short_name: riiqxBrand.name,
    description: riiqxBrand.seo.description,
    start_url: '/',
    id: '/',
    scope: '/',
    display: 'standalone',
    display_override: ['window-controls-overlay', 'standalone', 'minimal-ui'],
    orientation: 'any',
    background_color: '#030712',
    theme_color: '#030712',
    categories: ['productivity', 'developer', 'utilities', 'creator'],
    lang: 'en',
    dir: 'ltr',
    prefer_related_applications: false,
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'AI Chat',
        short_name: 'Chat',
        description: 'Open clean streaming AI conversation on AWS Bedrock',
        url: '/?tab=chat',
      },
      {
        name: 'Creator Studio',
        short_name: 'Creator',
        description: 'Generate 9:16 vertical video storyboards and hooks',
        url: '/?tab=creator',
      },
      {
        name: 'Autopilot Center',
        short_name: 'Autopilot',
        description: 'Level 3 autonomous social media machine',
        url: '/?tab=autopilot',
      },
      {
        name: 'Task Planner',
        short_name: 'Tasks',
        description: 'Autonomous multi-step execution with permission gates',
        url: '/?tab=tasks',
      },
    ],
  };
}
