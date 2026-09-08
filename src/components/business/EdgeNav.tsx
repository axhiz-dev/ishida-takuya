"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/site";
import { PlaceholderNotice } from "@/components/common/PlaceholderNotice";
import styles from "./business.module.css";

/**
 * 浮遊ピルのナビ。
 *
 * 上部に浮かせて、少しスクロールしたら地色を敷いて読めるようにする。
 * 節のリンクは狭い画面では畳んで、行き先（相談する）だけ残す。
 * スマートフォンで見る割合が高い相手なので、ここで場所を取らない。
 */
export function EdgeNav({ name }: { name: string }) {
  const [lifted, setLifted] = useState(false);

  useEffect(() => {
    // scroll イベントは使わず、先頭に置いた番兵の交差で判定する
    const sentinel = document.getElementById("nav-sentinel");
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setLifted(!entry?.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header className={styles.nav} data-lifted={lifted || undefined}>
      <div className={styles.navInner}>
        <div className={styles.navBrand}>
          <Link href={ROUTES.gate.path} className={styles.wordmark}>
            {name}
          </Link>
          <span className={styles.navRole}>業務自動化</span>
          <PlaceholderNotice />
        </div>

        <nav className={styles.navLinks} aria-label="ページ内の移動">
          {ROUTES.business.sections.map((section) => (
            <a key={section.id} href={`#${section.id}`}>
              {section.label}
            </a>
          ))}
        </nav>

        <a className={styles.chip} href={ROUTES.business.cta.href}>
          {ROUTES.business.cta.label}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
