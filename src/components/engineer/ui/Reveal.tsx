"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** 登場方向。reduced-motion 時は motion 側が transform を無視し opacity だけになる。 */
  direction?: "up" | "left" | "right" | "none";
  delay?: number;
  className?: string;
  /** 一度だけ再生するか（既定 true）。戻ってきたときに再生し直さない。 */
  once?: boolean;
  as?: "div" | "li" | "section";
};

const offset = 28;

const buildVariants = (direction: RevealProps["direction"]): Variants => {
  const hidden: { opacity: number; x?: number; y?: number } = { opacity: 0 };
  if (direction === "up") hidden.y = offset;
  if (direction === "left") hidden.x = -offset;
  if (direction === "right") hidden.x = offset;
  return {
    hidden,
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };
};

/** スクロールでビューに入ったらフェード＋スライドで登場する汎用ラッパー。 */
export function Reveal({
  children,
  direction = "up",
  delay = 0,
  className,
  once = true,
  as = "div",
}: RevealProps) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={buildVariants(direction)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  );
}
