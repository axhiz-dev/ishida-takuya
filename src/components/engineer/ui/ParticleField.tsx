"use client";

import { useEffect, useRef } from "react";
import { useEnvironment } from "@/lib/useEnvironment";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

/**
 * ヒーロー背景のパーティクル・コンステレーション。
 *
 * · rAF ループで漂う粒と近接線を描き、ポインタにゆるく引き寄せる
 * · DPR 対応（上限 2）、面積に応じて粒数を決める
 * · document.hidden で停止する（裏に回したまま CPU を焼かない）
 * · reduced-motion / 小型タッチ端末では描かず静的グラデにフォールバックする
 */
export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { mounted, prefersReducedMotion, isSmall, isTouch } = useEnvironment();

  const disabled = !mounted || prefersReducedMotion || (isSmall && isTouch);

  useEffect(() => {
    if (disabled) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];
    let raf = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const LINK_DIST = 130;

    const setup = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 面積に比例した粒数（上限あり）
      const target = Math.min(
        Math.round((width * height) / 15000),
        window.innerWidth < 640 ? 40 : 96,
      );
      particles = Array.from({ length: target }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
      }));
    };

    const step = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        // ポインタへの弱い引力
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 200 * 200 && dist2 > 1) {
            const f = 0.6 / dist2;
            p.vx += dx * f;
            p.vy += dy * f;
          }
        }
        // 減衰しつつ移動
        p.vx *= 0.99;
        p.vy *= 0.99;
        p.x += p.vx;
        p.y += p.vy;

        // 画面端で反射
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        p.x = Math.max(0, Math.min(width, p.x));
        p.y = Math.max(0, Math.min(height, p.y));
      }

      // 近接線
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i]!;
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.hypot(dx, dy);
          if (dist < LINK_DIST) {
            const alpha = (1 - dist / LINK_DIST) * 0.5;
            ctx.strokeStyle = `rgba(139, 122, 246, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      // 粒
      for (const p of particles) {
        ctx.fillStyle = "rgba(34, 211, 238, 0.85)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(step);
    };

    const start = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(step);
    };
    const stop = () => cancelAnimationFrame(raf);

    const onResize = () => setup();
    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onPointerLeave = () => {
      pointer.active = false;
      pointer.x = -9999;
      pointer.y = -9999;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };

    setup();
    start();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerout", onPointerLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [disabled]);

  // 静的フォールバック（reduced-motion / 小型タッチ端末 / マウント前）
  if (disabled) {
    return (
      <div
        aria-hidden="true"
        data-print="hide"
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(139,122,246,0.18),transparent_70%)]"
      />
    );
  }

  return (
    <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />
  );
}
