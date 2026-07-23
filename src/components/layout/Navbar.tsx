"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { navItems } from "@/data/site";
import { profile } from "@/data/profile";

/**
 * 固定グラスモーフィズムのナビゲーション。
 * - アクティブセクションを単一 IntersectionObserver で追跡（scroll リスナ不使用）
 * - < md はハンバーガー → フルスクリーンオーバーレイ（stagger）
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>("");
  const [open, setOpen] = useState(false);

  // 背景の不透明度を切り替えるための最小限のスクロール検知
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // アクティブセクション追跡
  useEffect(() => {
    const ids = navItems.map((n) => n.id);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { threshold: 0.4, rootMargin: "-20% 0px -35% 0px" },
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // オーバーレイ表示中は背面スクロールをロック
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "glass border-b border-white/5" : "border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <a
            href="#hero"
            className="font-display text-lg font-bold tracking-tight"
            aria-label="トップへ"
          >
            <span className="text-gradient">{profile.nameEn}</span>
          </a>

          {/* デスクトップナビ */}
          <ul className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className={`relative rounded-full px-4 py-2 text-sm transition-colors ${
                    active === item.id
                      ? "text-ink"
                      : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {active === item.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <a
            href="#contact"
            className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-ink transition-colors hover:border-brand-violet/60 hover:bg-brand-violet/10 md:inline-block"
          >
            お問い合わせ
          </a>

          {/* モバイル: ハンバーガー */}
          <button
            type="button"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-white/10 md:hidden"
          >
            <span className="sr-only">メニュー</span>
            <div className="flex flex-col gap-1.5">
              <motion.span
                animate={open ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-ink"
              />
              <motion.span
                animate={open ? { opacity: 0 } : { opacity: 1 }}
                className="block h-0.5 w-5 bg-ink"
              />
              <motion.span
                animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                className="block h-0.5 w-5 bg-ink"
              />
            </div>
          </button>
        </nav>
      </header>

      {/* モバイルオーバーレイ */}
      <AnimatePresence>
        {open && (
          <motion.div
            data-testid="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-bg/95 px-8 backdrop-blur-xl md:hidden"
          >
            <motion.ul
              className="flex flex-col gap-2"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              }}
            >
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  variants={{
                    hidden: { opacity: 0, x: 24 },
                    visible: { opacity: 1, x: 0 },
                  }}
                >
                  <a
                    href={`#${item.id}`}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline gap-4 py-3"
                  >
                    <span className="font-mono text-xs text-brand-cyan">
                      0{i + 1}
                    </span>
                    <span className="font-display text-3xl font-bold text-ink">
                      {item.label}
                    </span>
                  </a>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
