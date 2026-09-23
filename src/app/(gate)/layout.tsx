import type { Metadata } from "next";
import { engineerFontVariables } from "@/lib/engineerFonts";
import { ROUTES, SITE_URL } from "@/config/site";
import "@/styles/engineer.css";

/**
 * 入口（/）のルートレイアウト。/engineer と同じスタイル（Tailwind）と書体を使う。
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: ROUTES.gate.title,
  description: ROUTES.gate.description,
  openGraph: {
    title: ROUTES.gate.title,
    description: ROUTES.gate.description,
    type: "website",
    locale: "ja_JP",
  },
};

export default function GateLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={engineerFontVariables}>
      <body>{children}</body>
    </html>
  );
}
