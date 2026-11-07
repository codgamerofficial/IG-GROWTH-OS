import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RiiqxProvider } from '@/context/RiiqxContext';
import { RiiqxAppShell } from '@/components/riiqx/RiiqxAppShell';
import { RiiqxPermissionModal } from '@/components/riiqx/RiiqxPermissionModal';
import { riiqxBrand } from '@/lib/riiqx/brand';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: riiqxBrand.seo.title,
  description: riiqxBrand.seo.description,
  keywords: riiqxBrand.seo.keywords,
  authors: [{ name: 'RIIQX Engineering Core' }],
  creator: 'RIIQX Platform Team',
  icons: {
    icon: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RIIQX',
  },
  openGraph: {
    title: riiqxBrand.seo.title,
    description: riiqxBrand.seo.description,
    siteName: riiqxBrand.name,
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#FFD43B',
  colorScheme: 'light dark',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${inter.variable}`}>
      <head>
        <script
          src="https://quge5.com/88/tag.min.js"
          data-zone="307132"
          async
          data-cfasync="false"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="h-[100dvh] min-h-[100dvh] bg-[#FAF9F6] text-[#202124] dark:bg-[#0C0C0E] dark:text-[#F4F4F6] antialiased selection:bg-[#FFD43B]/40 selection:text-[#202124] flex flex-col font-sans w-full max-w-full overflow-hidden">
        <RiiqxProvider>
          <RiiqxAppShell>{children}</RiiqxAppShell>
          <RiiqxPermissionModal />
        </RiiqxProvider>
      </body>
    </html>
  );
}

