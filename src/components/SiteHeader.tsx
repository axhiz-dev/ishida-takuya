import { Link } from "react-router-dom";
import { profile } from "../data/profile";

/** ページ上部の細いナビゲーション。印刷時は非表示 */
export default function SiteHeader({ current }: { current: "engineer" | "business" }) {
  return (
    <header className="print-hidden border-b border-line bg-paper/90 backdrop-blur sticky top-0 z-10">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3">
        <Link to="/" className="text-sm font-bold tracking-wide hover:text-accent">
          {profile.nameJa}
        </Link>
        <nav className="flex items-center gap-5 text-xs text-ink-soft">
          <Link
            to="/engineer"
            className={
              current === "engineer"
                ? "font-semibold text-accent"
                : "hover:text-accent"
            }
          >
            職務経歴
          </Link>
          <Link
            to="/business"
            className={
              current === "business"
                ? "font-semibold text-accent"
                : "hover:text-accent"
            }
          >
            事業者さま向け
          </Link>
        </nav>
      </div>
    </header>
  );
}
