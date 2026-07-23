"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "motion/react";

type SkillBarProps = {
  name: string;
  /** 0-100 */
  level: number;
  /** スタガー用の遅延 */
  delay?: number;
};

/**
 * 表示時に width を 0 → level% までスプリングで満たし、
 * ラベルの数値を 0 → level までカウントアップするスキルバー。
 */
export function SkillBar({ name, level, delay = 0 }: SkillBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, level, {
      duration: 1.2,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, level, delay]);

  return (
    <div ref={ref} data-testid="skill-bar" className="w-full">
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <span className="text-sm font-medium text-ink">{name}</span>
        <span className="font-mono text-xs tabular-nums text-ink-muted">
          {display}
          <span className="text-ink-faint">%</span>
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-fuchsia"
          initial={{ width: 0 }}
          animate={inView ? { width: `${level}%` } : { width: 0 }}
          transition={{
            duration: 1.2,
            delay,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
      </div>
    </div>
  );
}
