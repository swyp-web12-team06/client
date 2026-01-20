import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import GlobalHeader from '@/components/GlobalHeader';
import { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PromptLook',
  description: 'A prompt creation and trading platform...',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="m-auto max-w-7xl antialiased">
        <AuthProvider>
          <Suspense fallback={<div className="h-20 w-full"></div>}>
            <GlobalHeader />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
