import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import Header from "@/components/Header";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptLook",
  description: "A prompt creation and trading platform based on a verified lookbook, where creators who want to reduce trial and error in AI image generation can input variables such as face, pose, and background.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Theme accentColor="tomato" className="max-w-7xl m-auto">
          <Suspense fallback={<div className="h-20 w-full"></div>}>
            <Header isLoggedIn={true} creditAmount={100} userName="John Doe" />
          </Suspense>
          {children}
        </Theme>
      </body>
    </html>
  );
}