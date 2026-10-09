import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display, Noto_Serif_Bengali } from 'next/font/google';
import './globals.css';
import { PujaHopProvider } from '@/context/PujaHopContext';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Footer } from '@/components/layout/Footer';
import { OneDayWizard } from '@/components/planner/OneDayWizard';
import { PandalDetailModal } from '@/components/pandals/PandalDetailModal';
import { EmergencyModal } from '@/components/sos/EmergencyModal';
import { PujaCopilotDrawer } from '@/components/copilot/PujaCopilotDrawer';
import { OpenInAppBanner } from '@/components/common/OpenInAppBanner';
import { PWARegister } from '@/components/common/PWARegister';
import { AndroidPWAInstallPrompt } from '@/components/common/AndroidPWAInstallPrompt';
import { AndroidBackButtonHandler } from '@/components/common/AndroidBackButtonHandler';
import { NavigationScrollReset } from '@/components/common/NavigationScrollReset';
import { FestiveSoundscapePlayer } from '@/components/audio/FestiveSoundscapePlayer';
import { brandConfig } from '@/lib/brand/config';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  weight: ['400', '600', '700', '800', '900'],
});

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  display: 'swap',
  variable: '--font-bengali',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: brandConfig.seo.title,
  description: brandConfig.seo.description,
  keywords: [
    'PujaHop Kolkata',
    'Durga Puja 2026',
    'Kolkata Durga Puja Planner',
    'Pandal Hopping Route',
    'Kolkata Metro Puja Timetable',
    'Bagbazar Sarbojanin',
    'College Square',
    'Ekdalia Evergreen',
    'Kumartuli Park',
    'Sreebhumi Sporting Club',
    'Puja Copilot AI',
  ],
  authors: [{ name: 'Saswata Dey (Riik)' }],
  creator: 'Saswata Dey (Riik)',
  publisher: 'Saswata Dey (Riik)',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'PujaHop',
  },
  other: {
    'mobile-web-app-capable': 'yes',
    'application-name': 'PujaHop',
    'theme-color': '#070611',
  },
  openGraph: {
    title: brandConfig.seo.title,
    description: brandConfig.seo.description,
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: brandConfig.name }],
  },
};

export const viewport: Viewport = {
  themeColor: '#070611',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" className={`dark ${inter.variable} ${playfair.variable} ${notoSerifBengali.variable}`}>
      <body className="min-h-screen bg-[#070611] text-zinc-100 antialiased selection:bg-rose-500/30 selection:text-white flex flex-col font-sans w-full max-w-full overflow-x-hidden">
        <PujaHopProvider>
          <PWARegister />
          <AndroidBackButtonHandler />
          <AndroidPWAInstallPrompt />
          <NavigationScrollReset />
          <OpenInAppBanner />
          <Header />
          <div className="flex flex-1 w-full max-w-full min-w-0">
            <Sidebar />
            <div
              id="pujahop-scroll-container"
              className="flex-1 flex flex-col min-h-0 min-w-0 w-full max-w-full"
            >
              <main className="flex-1 pb-24 lg:pb-8 w-full max-w-full min-w-0">{children}</main>
              <Footer />
            </div>
          </div>
          <MobileBottomNav />
          <OneDayWizard />
          <PandalDetailModal />
          <EmergencyModal />
          <PujaCopilotDrawer />
          <FestiveSoundscapePlayer />
        </PujaHopProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
