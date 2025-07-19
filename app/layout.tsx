import "./globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster"
import { ViewTransitions } from "next-view-transitions";

export const metadata: Metadata = {
  title: "alen rubilar-muñoz",
  description: "alen's personal website",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white p-6 font-mono flex items-center justify-center">
              {children}
            </div>
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
