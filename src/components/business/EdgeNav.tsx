"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/site";
import { PlaceholderNotice } from "@/components/common/PlaceholderNotice";
import styles from "./business.module.css";

/**
 * N5 · 浮遊ピルのナビ。
 *
 * 上部に浮かせて、少しスクロールしたら地色を敷いて読めるようにする。
 * 行き先はひとつだけ。事業側の相手に迷う余地を作らない。
 */
export function EdgeNav({ name, email }: { name: string; email: string }) {
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
          <PlaceholderNotice />
        </div>

        <a className={styles.chip} href={`mailto:${email}`}>
          相談する
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </header>
  );
}
