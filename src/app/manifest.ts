import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GlowFit AI — Your Smartest Beauty Cart',
    short_name: 'GlowFit AI',
    description: 'AI beauty analysis, personalized recommendations, and virtual try-on powered by YouCam technology.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF8F5',
    theme_color: '#FAF8F5',
    icons: [
      {
        src: '/icon',
        sizes: '32x32',
        type: 'image/png',
      },
    ],
  };
}
