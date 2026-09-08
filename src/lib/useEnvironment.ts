"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * クライアント環境（reduced-motion / タッチ / 画面幅）をまとめて返す。
 *
 * matchMedia は useEffect の中でしか読まない。SSR と初回描画では
 * 「演出あり」の前提でレンダーし、マウント後に必要なら抑制することで
 * ハイドレーションの不一致を避けている。
 */
export function useEnvironment() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const [isTouch, setIsTouch] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const touchMq = window.matchMedia("(pointer: coarse)");
    const smallMq = window.matchMedia("(max-width: 640px)");

    const update = () => {
      setIsTouch(touchMq.matches);
      setIsSmall(smallMq.matches);
    };
    update();

    touchMq.addEventListener("change", update);
    smallMq.addEventListener("change", update);
    return () => {
      touchMq.removeEventListener("change", update);
      smallMq.removeEventListener("change", update);
    };
  }, []);

  return {
    mounted,
    prefersReducedMotion,
    isTouch,
    isSmall,
    /** チルト・マグネティック等のポインタ演出を有効化してよいか */
    enablePointerFx: mounted && !prefersReducedMotion && !isTouch,
  };
}
