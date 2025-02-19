import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import { siteConfig } from "@/config/site";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/lib/providers/provider";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "./globals.css";


const inter = Inter({ subsets: ["latin"] })

// Metadata
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.name,
      url: new URL(siteConfig.url),
    },
  ],
  creator: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: "/favicon.ico",
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: ["/favicon.ico"],
    creator: "@akkhil_dev",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AppProvider>
        <body
          className={`${inter.className} antialiased bg-black`}
        >
          <Header />
          {children}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </body>
      </AppProvider>
    </html >
  );
}
