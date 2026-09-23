import type { Metadata } from "next";
import { engineerFontVariables } from "@/lib/engineerFonts";
import { ROUTES, SITE_URL } from "@/config/site";
import "@/styles/engineer.css";

/**
 * /engineer のルートレイアウト。
 *
 * Tailwind（src/styles/engineer.css）を読むのは / と /engineer だけ。
 * /business は tokens.css + base.css + CSS Modules のままなので、
 * Tailwind の preflight がそちらに漏れない。**この import を
 * (business) のレイアウトへ持っていかないこと。**
 */

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: ROUTES.engineer.title,
  description: ROUTES.engineer.description,
  openGraph: {
    title: ROUTES.engineer.title,
    description: ROUTES.engineer.description,
    type: "profile",
    locale: "ja_JP",
  },
};

export default function EngineerLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className={engineerFontVariables}>
      <body>{children}</body>
    </html>
  );
}
