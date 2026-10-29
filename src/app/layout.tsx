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
    <html lang="en" className={inter.variable}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(regs) {
                  for (var i = 0; i < regs.length; i++) { regs[i].unregister(); }
                });
                if ('caches' in window) {
                  caches.keys().then(function(keys) {
                    for (var j = 0; j < keys.length; j++) { caches.delete(keys[j]); }
                  });
                }
              }
            `,
          }}
        />
      </head>
      <body className="h-[100dvh] min-h-[100dvh] bg-[#FAF9F6] text-[#202124] dark:bg-[#151515] dark:text-[#F7F7F7] antialiased selection:bg-[#FFD43B]/40 selection:text-[#202124] flex flex-col font-sans w-full max-w-full overflow-hidden">
        <RiiqxProvider>
          <RiiqxAppShell>{children}</RiiqxAppShell>
          <RiiqxPermissionModal />
        </RiiqxProvider>
      </body>
    </html>
  );
}

