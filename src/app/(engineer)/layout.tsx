import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { THEME_INIT_SCRIPT } from "@/lib/theme";
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
    // フォント変数のクラスは data-theme と同じ要素に置くこと。
    // 別々の要素に分けると [data-theme] 側から var(--font-*) を解決できず、
    // font-family 全体が無効になって既定フォントに落ちる。
    //
    // data-theme はここでの値が初期値で、<head> の同期スクリプトが
    // 描画前に OS 設定 / 保存値で上書きする。
    <html lang="ja" data-theme="engineer-dark" className={`no-js ${fontVariables}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
