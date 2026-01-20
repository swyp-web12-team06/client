<<<<<<< HEAD
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import Header from "@/components/Header";
import { Suspense } from "react";
import { AuthProvider } from "@/context/AuthContext";
=======
import type { Metadata } from 'next';
import { Roboto } from 'next/font/google';
import './globals.css';
import GlobalHeader from '@/components/GlobalHeader';
import { Suspense } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';
>>>>>>> 34dd7b48b790a175ce2f15d47e9a0be47138f22f

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
<<<<<<< HEAD
    <html lang="en" className={suit.variable}>
      <body className="antialiased">
        <AuthProvider>
          <Theme accentColor="tomato" className="max-w-7xl m-auto">
            <Suspense fallback={<div className="h-20 w-full"></div>}>
              <Header />
            </Suspense>
            {children}
          </Theme>
=======
    <html lang="en" className={roboto.variable}>
      <body className="p-4 antialiased">
        <AuthProvider>
          <Suspense fallback={<div className="h-20 w-full"></div>}>
            <GlobalHeader />
          </Suspense>
          {children}
>>>>>>> 34dd7b48b790a175ce2f15d47e9a0be47138f22f
        </AuthProvider>
      </body>
    </html>
  );
}
