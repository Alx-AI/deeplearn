import type { Metadata, Viewport } from "next";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import { AppProviders } from "@/components/providers";
import "./globals.css";

/* ---------------------------------------------------------------------------
   Font Configuration

   Inter:          UI elements, headings, navigation
   IBM Plex Sans:  Long-form reading content (lesson text)
   IBM Plex Mono:  Code blocks, inline code, terminal output

   Each font is loaded with its own CSS variable so the design tokens
   in globals.css can reference them via var(--font-inter), etc.
   --------------------------------------------------------------------------- */

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "700"],
});

/* ---------------------------------------------------------------------------
   Metadata
   --------------------------------------------------------------------------- */

export const metadata: Metadata = {
  title: {
    default: "DeepLearn",
    template: "%s | DeepLearn",
  },
  description:
    "A focused deep learning education platform. Master neural networks through spaced repetition, clear explanations, and deliberate practice.",
  applicationName: "DeepLearn",
  keywords: [
    "deep learning",
    "machine learning",
    "neural networks",
    "education",
    "spaced repetition",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#1A1A18" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* ---------------------------------------------------------------------------
   Root Layout
   --------------------------------------------------------------------------- */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <body
        className={`
          ${inter.variable}
          ${ibmPlexSans.variable}
          ${ibmPlexMono.variable}
          antialiased
        `}
      >
        <AppProviders>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
        </AppProviders>
      </body>
    </html>
  );
}
