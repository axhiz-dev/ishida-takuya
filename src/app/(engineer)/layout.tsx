import type { Metadata } from "next";
import { almanacFonts } from "@/lib/fonts";
import { ROUTES, SITE_URL } from "@/config/site";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/print.css";

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
    // フォント変数のクラスは data-theme と同じ要素に置く（(business)/layout.tsx を参照）
    <html lang="ja" data-theme="almanac" className={almanacFonts}>
      <body>{children}</body>
    </html>
  );
}
