import type { Metadata } from "next";
import { gateFonts } from "@/lib/fonts";
import { ROUTES, SITE_URL } from "@/config/site";
import "@/styles/tokens.css";
import "@/styles/base.css";
import "@/styles/print.css";

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
    // フォント変数のクラスは data-theme と同じ要素に置く（(business)/layout.tsx を参照）
    <html lang="ja" data-theme="gate" className={gateFonts}>
      <body>{children}</body>
    </html>
  );
}
