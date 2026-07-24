"use client";

import { useEffect, useState } from "react";

/**
 * いま画面上部にあるセクションの id を返す。
 *
 * scroll イベントではなく IntersectionObserver を使う（Hallmark の規約）。
 * 装飾ではなく現在地表示という機能のためのスクロール連動なので、
 * 「全セクションがスクロールでフェードイン」の禁止事項には当たらない。
 */
export function useActiveSection(ids: readonly string[]): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>(ids[0]);

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    // コールバックには「状態が変わったもの」しか渡ってこないので、
    // 交差中のセクションを自分で覚えておく。
    // これをしないと、前のセクションが抜けたときに現在地が更新されない。
    const intersecting = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) intersecting.add(entry.target.id);
          else intersecting.delete(entry.target.id);
        }

        // 帯に入っているもののうち、文書順でいちばん後ろのものを現在地とする。
        // 「いちばん上にあるもの」で選ぶと、画面外まで伸びている長いセクションが
        // 下端だけ帯に残っている状態で勝ってしまい、現在地が前に戻ってしまう。
        const current = [...ids].reverse().find((id) => intersecting.has(id));
        if (current) setActiveId(current);
      },
      // 画面上部 30% の帯に入ったセクションを「読み始めた位置」とみなす。
      { rootMargin: "0px 0px -70% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [ids]);

  return activeId;
}
