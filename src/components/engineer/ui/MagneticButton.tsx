"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEnvironment } from "@/lib/useEnvironment";

type MagneticButtonProps = {
  children: ReactNode;
  href: string;
  className?: string;
  /** 外部リンクとして開くか。 */
  external?: boolean;
  ariaLabel?: string;
};

/**
 * カーソルにわずかに引き寄せられるボタン。
 * タッチ / reduced-motion では通常のリンクとして振る舞う。
 */
export function MagneticButton({
  children,
  href,
  className = "",
  external = false,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { enablePointerFx } = useEnvironment();

  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  const handleMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (!enablePointerFx || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3);
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      aria-label={ariaLabel}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={enablePointerFx ? { x, y } : undefined}
      className={className}
    >
      {children}
    </motion.a>
  );
}
