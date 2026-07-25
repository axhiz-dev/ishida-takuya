import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { NO_JS_INIT_SCRIPT } from "@/lib/theme";
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
    // 事業側の相手に切り替えを出す理由がないので、こちらはライト固定。
    <html lang="ja" data-theme="business" className={`no-js ${fontVariables}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_JS_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
