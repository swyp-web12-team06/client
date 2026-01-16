import type { Metadata } from "next";
import localFont from "next/font/local";
import { Theme } from "@radix-ui/themes";
import "./globals.css";
import Header from "@/components/Header";
import { Suspense } from "react";

const suit = localFont({
  src: [
    {
      path: "../public/fonts/SUIT-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/SUIT-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    { path: "../public/fonts/SUIT-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-suit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptLook",
  description: "A prompt creation and trading platform...",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={suit.variable}>
      <body className="antialiased">
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
