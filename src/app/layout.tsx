
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';

// The GeistSans object imported above already contains the necessary properties.
// It should not be called as a function.
// The .variable property (e.g., GeistSans.variable) provides a className
// that sets up the CSS custom property (e.g., --font-geist-sans).

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
      {/*
        Apply GeistSans.variable to ensure the CSS variable for the font is defined.
        The 'font-sans' class from Tailwind will then use this variable.
        'antialiased' enables font anti-aliasing.
      */}
      <body className={cn(GeistSans.variable, "antialiased font-sans")}>
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
