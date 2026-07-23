"use client";

import { motion, useScroll, useSpring } from "motion/react";

/** ページ最上部のスクロール進捗バー。 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[60] h-0.5 w-full origin-left bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-fuchsia"
    />
  );
}
