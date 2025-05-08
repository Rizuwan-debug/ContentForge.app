
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { cn } from '@/lib/utils';
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthProvider } from '@/providers/auth-provider'; // Added AuthProvider

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
      <body className={cn(GeistSans.variable, "antialiased font-sans")}>
        <ThemeProvider
          storageKey="contentforge-theme"
          defaultTheme="system"
        >
          <AuthProvider> {/* Added AuthProvider wrapper */}
            <main className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-background">
              <div className="w-full max-w-4xl">
                {children}
              </div>
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
