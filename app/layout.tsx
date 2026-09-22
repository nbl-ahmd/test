import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Grain from "@/components/ui/Grain";
import Cursor from "@/components/ui/Cursor";
import SectionIndicator from "@/components/ui/SectionIndicator";
import ScrollProgress from "@/components/ui/ScrollProgress";
import SceneCanvas from "@/components/three/SceneCanvas";
import SceneSections from "@/components/three/SceneSections";
import SceneDebug from "@/components/three/SceneDebug";
import Preloader from "@/components/sections/Preloader";
import { site } from "@/content/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  weight: "400",
  style: "italic",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "web studio",
    "website design",
    "landing pages",
    "web apps",
    "custom software",
    "Next.js development",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable}`}
    >
      <body>
        <Script id="dw-intro-boot" strategy="beforeInteractive">
          {`try{var d=document.documentElement;var r=window.matchMedia('(prefers-reduced-motion: reduce)').matches;if(sessionStorage.getItem('dw:preloaded')==='1'||r){d.dataset.preloaded='true'}else{d.dataset.intro='pending'}}catch(e){}`}
        </Script>
        <Preloader />
        <SceneCanvas />
        <a
          href="#main"
          className="skip-link label rounded-full bg-fg px-4 py-2.5 text-bg"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <SceneSections />
          <SectionIndicator />
        </SmoothScroll>
        <ScrollProgress />
        <Grain />
        <Cursor />
        <SceneDebug />
      </body>
    </html>
  );
}
