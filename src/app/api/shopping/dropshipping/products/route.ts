// =============================================================================
// GlowFit AI / RIIQX — High-Margin Dropshipping Products Catalog API
// Route: GET /api/shopping/dropshipping/products
// =============================================================================

import { NextResponse } from 'next/server';
import { DropshippingProductItem } from '@/services/shopping/types';

export const DROPSHIPPING_CATALOG: DropshippingProductItem[] = [
  {
    id: 'drop_lumina_01',
    title: 'Lumina RGB Aura Kinetic Levitating Desk Lamp',
    category: 'Home & Gadgets',
    description: 'Magnetic levitation floating ambient orb with 16 million colors, touch brightness control, and Qi wireless fast-charging base.',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop',
    supplierPrice: 850,
    suggestedSellingPrice: 2899,
    potentialProfitPerUnit: 2049,
    profitMarginPct: 70.6,
    trendingScore: 98,
    supplierName: 'Shenzhen Apex Tech Ltd',
    supplierRating: 4.8,
    shippingDays: '3-5 Days Expedited',
    readyAdHooks: [
      'Stop buying boring lamps. This one literally floats in thin air!',
      'Everyone who walks into my room asks where I got this desk upgrade.',
      'How to transform your setup from ordinary to 2050 in 3 seconds.'
    ],
    recommendedAngles: ['Aesthetic Desk Setup', 'Dorm Room Upgrade', 'Late Night Coding Vibe'],
    creatorStudioProjectId: 'proj_vid_canvas_1793868551331',
  },
  {
    id: 'drop_pulse_02',
    title: 'SonicPulse Deep Tissue Mini Massage Gun (Type-C Fast Charge)',
    category: 'Fitness & Health',
    description: 'Pocket-sized ultra-silent brushless motor delivers 3200 RPM percussion with 4 interchangeable heads for instant muscle knot relief.',
    imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop',
    supplierPrice: 620,
    suggestedSellingPrice: 2199,
    potentialProfitPerUnit: 1579,
    profitMarginPct: 71.8,
    trendingScore: 94,
    supplierName: 'Guangzhou BioFlex Recovery Co.',
    supplierRating: 4.9,
    shippingDays: '2-4 Days Express',
    readyAdHooks: [
      'Desk workers: your neck pain ends today.',
      'I thought I needed a ₹15,000 massage gun until I tested this ₹2,000 beast.',
      'Gym recovery cheat code that fits right in your pocket.'
    ],
    recommendedAngles: ['Post-Gym Soreness', 'Office Neck Strain', 'Gift for Fitness Addicts'],
    creatorStudioProjectId: 'proj_vid_1793868517855_0gl9',
  },
  {
    id: 'drop_aero_03',
    title: 'AeroGlide Ultrasonic Ceramic Air Humidifier & Diffuser',
    category: 'Home & Wellness',
    description: 'Zero-noise flame mist simulation with essential oil aromatherapy tray and warm ambient nightlight ring.',
    imageUrl: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=600&auto=format&fit=crop',
    supplierPrice: 480,
    suggestedSellingPrice: 1749,
    potentialProfitPerUnit: 1269,
    profitMarginPct: 72.5,
    trendingScore: 91,
    supplierName: 'Zhejiang Aroma Craft',
    supplierRating: 4.7,
    shippingDays: '3-5 Days Direct',
    readyAdHooks: [
      'Make your room smell like a 5-star luxury hotel for under ₹2,000.',
      'The satisfying flame mist everyone on TikTok is obsessing over.',
      'Wake up with hydrated skin and zero morning throat dryness.'
    ],
    recommendedAngles: ['Luxury Hotel Aesthetic', 'Skin Glow Routine', 'Cozy Winter Bedroom'],
  },
  {
    id: 'drop_hyper_04',
    title: 'HyperLens 4K Magnetic Macro & Wide Smartphone Attachment',
    category: 'Creator & Tech',
    description: 'Universal clip-on multi-coated optical glass with 120° distortion-free wide angle and 15x macro zoom for high-converting content creation.',
    imageUrl: 'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop',
    supplierPrice: 390,
    suggestedSellingPrice: 1499,
    potentialProfitPerUnit: 1109,
    profitMarginPct: 73.9,
    trendingScore: 96,
    supplierName: 'Dongguan Optical Labs',
    supplierRating: 4.8,
    shippingDays: '2-4 Days Express',
    readyAdHooks: [
      'Turn your budget phone into a ₹1,00,000 cinema camera for ₹1,499.',
      'How content creators shoot those insane macro eye and product shots.',
      'Never crop your friends out of a group selfie again.'
    ],
    recommendedAngles: ['Content Creator Secret', 'Travel Photography', 'Budget Cinematic Quality'],
  },
];

export async function GET() {
  return NextResponse.json({
    success: true,
    totalProducts: DROPSHIPPING_CATALOG.length,
    products: DROPSHIPPING_CATALOG,
    currency: 'INR',
    averageMarginPct: 72.2,
  });
}

