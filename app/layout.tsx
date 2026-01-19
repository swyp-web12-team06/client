import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Header from '@/components/Header';
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
    <html lang="en" className={suit.variable}>
      <body className="antialiased m-auto max-w-7xl">
        <AuthProvider>
          <Suspense fallback={<div className="h-20 w-full"></div>}>
            <Header />
          </Suspense>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
