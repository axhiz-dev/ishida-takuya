"use client";

import { useEffect, useState } from "react";

/**
 * 章の現在地と、章ごとの「一度だけの入場」をまとめて面倒みる。
 *
 * · 現在地：進行レールとナビの表示に使う
 * · 入場：章に入ったら data-entered="true" を立てて CSS のアニメーションを起こし、
 *   **その章はもう観測をやめる**。戻ってきても再生しない。
 *   Hallmark が禁じている「全セクションが延々とフェードし続ける」状態を避けるため。
 *
 * scroll イベントは使わない（IntersectionObserver のみ）。
 */
export function useChapters(ids: readonly string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // ── 入場：一度きり ──────────────────────────
    const enterObserver = new IntersectionObserver(
      (entries, observer) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.entered = "true";
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
    );

    // ── 現在地 ────────────────────────────────
    const intersecting = new Set<string>();
    const activeObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }
        // 帯に入っているもののうち文書順でいちばん後ろを現在地とする。
        // 「いちばん上」で選ぶと、画面外まで伸びた長い章が下端だけ残った状態で
        // 勝ってしまい、現在地が前に戻る。
        const current = [...ids].reverse().find((id) => intersecting.has(id));
        if (current) setActiveId(current);
      },
      { rootMargin: "0px 0px -68% 0px", threshold: 0 },
    );

    elements.forEach((el) => {
      enterObserver.observe(el);
      activeObserver.observe(el);
    });

    return () => {
      enterObserver.disconnect();
      activeObserver.disconnect();
    };
  }, [ids]);

  return activeId;
}
