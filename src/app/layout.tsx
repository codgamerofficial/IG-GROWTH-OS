import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { GrowthOSProvider } from '@/context/GrowthOSContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { GrowthCopilotDrawer } from '@/components/copilot/GrowthCopilotDrawer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

import { brandConfig } from '@/lib/brand/config';

export const metadata: Metadata = {
  title: brandConfig.seo.title,
  description: brandConfig.seo.description,
  keywords: [
    'IG GrowthOS',
    'AI-Powered Social Growth',
    'Instagram Automation',
    'Amazon Bedrock',
    'RIIQX Fashion',
    'AI Reel Generator',
    'Content Scheduling',
    'Instagram Analytics',
  ],
  authors: [{ name: 'IG GrowthOS Engineering' }],
  icons: {
    icon: [
      { url: '/brand/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/brand/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  openGraph: {
    title: brandConfig.seo.title,
    description: brandConfig.seo.description,
    images: [{ url: '/brand/brand-mark.png', width: 1024, height: 1024, alt: brandConfig.name }],
  },
};

export const viewport: Viewport = {
  themeColor: '#070812',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <body className="min-h-screen bg-[#09090B] text-zinc-100 antialiased selection:bg-rose-500/30 selection:text-white flex flex-col font-sans">
        <GrowthOSProvider>
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 pb-24 lg:pb-12 overflow-y-auto">{children}</main>
          </div>
          <MobileBottomNav />
          <GrowthCopilotDrawer />
        </GrowthOSProvider>
      </body>
    </html>
  );
}
