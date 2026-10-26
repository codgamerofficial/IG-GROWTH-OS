// =============================================================================
// PujaHop Kolkata: Official Brand & Festival Identity Configuration
// Product: PujaHop Kolkata — One Day. One City. Maximum Puja.
// Bengali Festival Aesthetics: Warm Saffron, Vermilion, Gold & Midnight Indigo
// =============================================================================

export const brandConfig = {
  name: 'PujaHop Kolkata',
  nameBengali: 'পূজাহপ কলকাতা',
  shortName: 'PujaHop',
  tagline: 'One Day. One City. Maximum Puja.',
  taglineBengali: 'একদিন। এক শহর। সেরা পুজো।',
  subTagline: 'AI-Powered Durga Puja Hop Companion',
  category: 'Durga Puja Pandal Hopping Planner & Travel Companion',
  description:
    'Real-time AI-powered Kolkata Durga Puja pandal-hopping planner, metro navigator, and verified travel companion for the world’s grandest festival.',
  philosophy:
    '“সব প্যান্ডেল দেখানো নয় — তোমার হাতে যত সময় আছে তার মধ্যে সবচেয়ে ভালো combination দেখানো।”',
  seo: {
    title: 'PujaHop Kolkata — One Day. One City. Maximum Puja.',
    description:
      'Plan your perfect Kolkata Durga Puja pandal-hopping day. Real verified pandals, live Metro routing, traffic alerts, walking directions, and AI travel copilot.',
  },
  colors: {
    nightSky: '#0A0915',
    vermilion: '#E11D48',
    marigoldGold: '#F59E0B',
    saffron: '#EA580C',
    alponaWhite: '#FFFBEB',
    metroBlue: '#005691',
    metroGreen: '#008751',
    cardDark: '#121124',
    borderGlass: 'rgba(255, 255, 255, 0.1)',
  },
  creator: {
    name: 'Saswata Dey (Riik)',
    credit: 'Created & Conceptualized by Saswata Dey (Riik)',
    tagline: 'An independent cultural-tech experience by Saswata Dey (Riik).',
  },
} as const;

export type BrandConfig = typeof brandConfig;
