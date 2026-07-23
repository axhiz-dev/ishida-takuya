import type { Metadata, Viewport } from "next";
import { Noto_Sans_JP, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { site } from "@/data/site";
import "./globals.css";

// next/font: ビルド時にダウンロードして自己ホストするため static export / basePath と互換。
const notoSansJp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: site.title,
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
};

export const viewport: Viewport = {
  themeColor: "#07070d",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang={site.lang}
      className={`${notoSansJp.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <body className="antialiased">{children}</body>
    </html>
  );
}
