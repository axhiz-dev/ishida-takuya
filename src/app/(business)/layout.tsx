import type { Metadata } from "next";
import { studioFonts } from "@/lib/fonts";
import { ROUTES, SITE_URL } from "@/config/site";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/print.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: ROUTES.business.title,
  description: ROUTES.business.description,
  openGraph: {
    title: ROUTES.business.title,
    description: ROUTES.business.description,
    type: "website",
    locale: "ja_JP",
  },
};

export default function BusinessLayout({ children }: { children: React.ReactNode }) {
  return (
    // フォント変数のクラスは data-theme と同じ要素に置く。
    // 別々の要素に分けると [data-theme] 側から var(--font-*) を解決できず、
    // font-family 全体が無効になって既定フォントに落ちる。
    <html lang="ja" data-theme="studio" className={studioFonts}>
      <body>{children}</body>
    </html>
  );
}
