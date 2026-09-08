"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { useEnvironment } from "@/lib/useEnvironment";

type Tilt3DProps = {
  children: ReactNode;
  className?: string;
};

/**
 * ポインタ位置に応じて 3D チルトするカード。
 * タッチ / reduced-motion では傾けず、通常のホバー浮きにフォールバックする。
 */
export function Tilt3D({ children, className = "" }: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { enablePointerFx } = useEnvironment();

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [7, -7]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-7, 7]), {
    stiffness: 200,
    damping: 20,
  });

  // グレアの位置（% 表現）
  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(240px circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.12), transparent 60%)`;

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!enablePointerFx || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={
        enablePointerFx
          ? { rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }
          : undefined
      }
      whileHover={enablePointerFx ? undefined : { y: -6 }}
      className={`group relative [perspective:1000px] ${className}`}
    >
      {children}
      {enablePointerFx && (
        <motion.div
          aria-hidden="true"
          data-print="hide"
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: glare }}
        />
      )}
    </motion.div>
  );
}
