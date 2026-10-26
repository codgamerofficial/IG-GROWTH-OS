import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { RiiqxProvider } from '@/context/RiiqxContext';
import { RiiqxHeader } from '@/components/riiqx/RiiqxHeader';
import { RiiqxSidebar } from '@/components/riiqx/RiiqxSidebar';
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
  themeColor: '#7C3AED',
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
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] dark:bg-[#0B0F19] dark:text-[#F8FAFC] antialiased selection:bg-violet-500/20 selection:text-violet-900 flex flex-col font-sans w-full max-w-full overflow-x-hidden">
        <RiiqxProvider>
          <div className="flex h-screen w-full flex-col overflow-hidden bg-[#F8FAFC] dark:bg-[#0B0F19]">
            <RiiqxHeader />
            <div className="flex flex-1 overflow-hidden">
              <RiiqxSidebar />
              <main className="flex flex-1 flex-col overflow-hidden">{children}</main>
            </div>
          </div>
          <RiiqxPermissionModal />
        </RiiqxProvider>
      </body>
    </html>
  );
}

