import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";

export const metadata: Metadata = {
  title: "Build Log — Takuya Ishida",
  description:
    "This is not a resume. It is my build log. Takuya Ishida — Full Stack Engineer, building products people enjoy using.",
  openGraph: {
    title: "Build Log — Takuya Ishida",
    description:
      "This is not a resume. It is my build log. Full Stack Engineer, building products people enjoy using.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={GeistSans.variable}>
      <body className="bg-bg font-sans text-ink antialiased">{children}</body>
    </html>
  );
}
