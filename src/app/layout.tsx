import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans'; // Corrected import from geist/font/sans
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

const geistSans = GeistSans({ 
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

// Removed Geist_Mono as it's not explicitly used or in the provided font import
// If Geist_Mono is needed, it should be imported correctly as GeistMono from 'geist/font/mono'

export const metadata: Metadata = {
  title: 'ContentForge - SEO Content Generator',
  description: 'Generate optimized YouTube titles, Instagram captions, and hashtags with ContentForge.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(geistSans.variable, "antialiased font-sans")}>
        <main className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-background">
          <div className="w-full max-w-4xl">
            {children}
          </div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
