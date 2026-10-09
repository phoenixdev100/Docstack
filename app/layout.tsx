import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SearchProvider } from "@/components/search-context";
import { SearchModal } from "@/components/search-modal";
import { Navbar } from "@/components/navbar";
import { Announcement } from "@/components/announcement";
import { ShortcutsModal } from "@/components/shortcuts-modal";
import { ShortcutsButton } from "@/components/shortcuts-button";
import { site } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} Documentation`,
    template: `%s · ${site.name} Docs`,
  },
  description: site.description,
  openGraph: {
    siteName: `${site.name} Docs`,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f12" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable}`}
    >
      <body>
        <ThemeProvider>
          <SearchProvider>
            <a href="#main" className="skip-link">
              Skip to content
            </a>
            <Announcement />
            <Navbar />
            <div id="main">{children}</div>
            <SearchModal />
            <ShortcutsModal />
            <ShortcutsButton />
          </SearchProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
