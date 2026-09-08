import type { Metadata } from "next";
import { fontVariables } from "@/lib/fonts";
import { NO_JS_INIT_SCRIPT } from "@/lib/noJs";
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
    <html lang="ja" data-theme="gate" className={`no-js ${fontVariables}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: NO_JS_INIT_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
