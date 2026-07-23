"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/**
 * クライアント環境（reduced-motion / タッチ / 画面幅）をまとめて返す。
 * matchMedia は useEffect 内でのみ読むことで SSR とのハイドレーション不一致を避ける。
 * 初期値は「効果を出す側」ではなく「安全側（アニメOFF寄り）」に倒さないよう、
 * SSR では常にリッチ表示前提でレンダーし、マウント後に必要なら抑制する。
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
