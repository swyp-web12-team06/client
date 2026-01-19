import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import { Theme } from '@radix-ui/themes';
import './globals.css';
import Header from '@/components/Header';
import { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';

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
      <body className="antialiased">
        <AuthProvider>
          <Theme accentColor="tomato" className="m-auto max-w-7xl">
            <Suspense fallback={<div className="h-20 w-full"></div>}>
              <Header />
            </Suspense>
            {children}
          </Theme>
        </AuthProvider>
      </body>
    </html>
  );
}
