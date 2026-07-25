"use client";

import { useEffect, useRef } from "react";

/**
 * カーソルに追従するスポットライト。
 *
 * 実装の要点は「React に一切通さないこと」。
 * pointermove のたびに setState すると毎フレーム再描画が走る。
 * ここでは CSS 変数 2 つを直接書き換えるだけにして、
 * 描画はブラウザのコンポジタに任せる。
 *
 * 無効化する条件：
 *   · 細かい位置を指せない入力（タッチ）
 *   · モーション低減の設定
 * どちらの場合も data-spotlight が付かず、CSS 側が静的な光に落とす。
 */
export function useCursorSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const fine = window.matchMedia("(pointer: fine)");
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || calm.matches) return;

    let frame = 0;
    let x = 0;
    let y = 0;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--mx", `${x}px`);
      el.style.setProperty("--my", `${y}px`);
    };

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      x = event.clientX - rect.left;
      y = event.clientY - rect.top;
      // 1 フレームに 1 回だけ書き込む
      if (!frame) frame = requestAnimationFrame(apply);
    };

    // 初期位置は中央やや上。マウスを動かす前でも成立する絵にしておく。
    el.style.setProperty("--mx", "50%");
    el.style.setProperty("--my", "40%");
    el.dataset.spotlight = "on";

    el.addEventListener("pointermove", onMove);
    return () => {
      el.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
      delete el.dataset.spotlight;
    };
  }, []);

  return ref;
}
