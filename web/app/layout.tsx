import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import ApiGuard from "@/components/ApiGuard";
import ApiStatusBanner from "@/components/ApiStatusBanner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LenisScroll } from "@/lib/lenis-scroll";

// Font configurations
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const siteName = "AI Predicted Signals";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://aipredictedsignals.cloud";
const siteDescription = "Real-time AI-powered cryptocurrency trading signals with <500ms latency. Track transparent P&L, performance metrics, and live equity curves for informed crypto trading decisions.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - AI Crypto Trading Signals`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    "crypto trading signals",
    "AI trading",
    "cryptocurrency signals",
    "bitcoin trading",
    "crypto AI bot",
    "trading signals discord",
    "crypto signals live",
    "algorithmic trading",
    "crypto trading bot",
    "bitcoin signals",
    "ethereum signals",
    "real-time crypto signals"
  ],
  authors: [{ name: "Crypto-AI-Bot" }],
  creator: "Crypto-AI-Bot",
  publisher: siteName,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: siteName,
    title: `${siteName} - AI Crypto Trading Signals`,
    description: siteDescription,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: `${siteName} - AI Trading Signals Platform`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - AI Crypto Trading Signals`,
    description: siteDescription,
    images: [`${siteUrl}/og-image.png`],
    creator: "@CryptoAIBot",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [
      { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: siteUrl,
  },
  category: "finance",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Structured data for SEO (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": siteName,
    "url": siteUrl,
    "description": siteDescription,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "127",
    },
    "creator": {
      "@type": "Organization",
      "name": "Crypto-AI-Bot",
      "url": siteUrl,
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-bg text-text font-sans flex flex-col antialiased">
        <LenisScroll />
        <a href="#main-content" className="skip-to-main">
          Skip to main content
        </a>
        <ApiGuard />
        <Navbar />
        <ApiStatusBanner />
        <main id="main-content" className="flex-1" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}