import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'PujaHop Kolkata — One Day. One City. Maximum Puja.',
    short_name: 'PujaHop',
    description: 'Real-time AI-powered Kolkata Durga Puja pandal-hopping planner, crowd tracker, and travel companion.',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#f59e0b',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
