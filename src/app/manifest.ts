import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PujaHop Kolkata — One Day. One City. Maximum Puja.',
    short_name: 'PujaHop',
    description: 'Kolkata Durga Puja Cultural Discovery, Autonomous Route Engine, Metro Reality & Darshan Companion by Saswata Dey (Riik)',
    start_url: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#070611',
    theme_color: '#E11D48',
    categories: ['travel', 'navigation', 'culture', 'lifestyle'],
    icons: [
      {
        src: '/icon',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    shortcuts: [
      {
        name: 'Explore Map',
        short_name: 'Map',
        description: 'Open Kolkata Durga Puja Live Map & Metro Nodes',
        url: '/?tab=explore',
        icons: [{ src: '/icon', sizes: '96x96' }],
      },
      {
        name: 'Pandals Directory',
        short_name: 'Pandals',
        description: 'Browse Verified 2026 Puja Pandals & Darshan Status',
        url: '/?tab=pandals',
        icons: [{ src: '/icon', sizes: '96x96' }],
      },
      {
        name: 'Metro Guide',
        short_name: 'Metro',
        description: 'Check Honest Kolkata Metro Timetables & Night Specials',
        url: '/?tab=metro',
        icons: [{ src: '/icon', sizes: '96x96' }],
      },
      {
        name: 'Digital Passport',
        short_name: 'Passport',
        description: 'View Digital Puja Stamps & Visited Pandals',
        url: '/?tab=passport',
        icons: [{ src: '/icon', sizes: '96x96' }],
      },
    ],
  };
}
