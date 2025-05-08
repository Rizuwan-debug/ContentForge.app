
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/components/providers/theme-provider";

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
        'suppressHydrationWarning' is added to the html tag because the theme
        can cause a mismatch between server and client render for the class attribute.
      */}
      <body className={cn(GeistSans.variable, "antialiased font-sans")}>
        <ThemeProvider
          storageKey="contentforge-theme"
          defaultTheme="system"
        >
          <main className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-background">
            <div className="w-full max-w-4xl">
              {children}
            </div>
          </main>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

