import type { Metadata } from "next";
import { engineerFontVariables } from "@/lib/engineerFonts";
import { ROUTES, SITE_URL } from "@/config/site";
import "@/styles/engineer.css";

/**
 * /engineer のルートレイアウト。
 *
 * このルートグループだけが Tailwind（src/styles/engineer.css）を読む。
 * / と /business は tokens.css + base.css + CSS Modules のままなので、
 * Tailwind の preflight がそちらに漏れない。**ここに書いた import を
 * 別のレイアウトへ持っていかないこと。**
 *
 * テーマは切り替えを持たないダーク固定。公開中のサイトがそうであり、
 * このページはダークの見え方そのものが中身だから。
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
