"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { profile } from "@/content";
import { FEATURES, ROUTES } from "@/config/site";
import { PrintButton } from "./PrintButton";

/** ページ上部の細いナビ。スクロールすると背景が締まる。 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-paper/85 shadow-[0_1px_12px_rgba(30,58,95,0.08)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <Link
          href={ROUTES.gate.path}
          className="link-underline text-sm font-bold tracking-wide hover:text-accent"
        >
          {profile.name}
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <nav aria-label="サイト内の移動" className="flex items-center gap-4 text-xs sm:gap-6">
            <Link
              href={ROUTES.engineer.path}
              aria-current="page"
              className="relative pb-0.5 font-semibold text-accent after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-accent"
            >
              職務経歴
            </Link>
            <Link
              href={ROUTES.business.path}
              className="link-underline pb-0.5 text-ink-soft transition-colors hover:text-accent"
            >
              お仕事のご相談
            </Link>
          </nav>
          {FEATURES.pdfExport && <PrintButton variant="header" />}
        </div>
      </div>
    </header>
  );
}
