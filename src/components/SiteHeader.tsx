import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { profile } from "../data/profile";

/** ページ上部の細いナビゲーション。スクロールすると背景が締まる。印刷時は非表示 */
export default function SiteHeader({ current }: { current: "engineer" | "business" }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`print-hidden sticky top-0 z-30 border-b transition-all duration-300 ${
        scrolled
          ? "border-line bg-paper/85 shadow-[0_1px_12px_rgba(30,58,95,0.08)] backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3.5">
        <Link
          to="/"
          className="link-underline text-sm font-bold tracking-wide hover:text-accent"
        >
          {profile.nameJa}
        </Link>
        <nav className="flex items-center gap-6 text-xs">
          {(
            [
              ["engineer", "/engineer", "職務経歴"],
              ["business", "/business", "事業者さま向け"],
            ] as const
          ).map(([key, path, label]) => (
            <Link
              key={key}
              to={path}
              className={`relative pb-0.5 transition-colors ${
                current === key
                  ? "font-semibold text-accent after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-accent"
                  : "link-underline text-ink-soft hover:text-accent"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
