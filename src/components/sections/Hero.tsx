"use client";

import { motion, type Variants } from "motion/react";
import { ParticleField } from "@/components/ui/ParticleField";
import { profile } from "@/data/profile";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export function Hero() {
  return (
    <section
      id="hero"
      className="relative flex min-h-svh items-center overflow-hidden"
    >
      {/* パーティクル背景 */}
      <ParticleField />

      {/* グラデーションメッシュのブロブ */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-blob absolute -left-32 top-10 h-96 w-96 rounded-full bg-brand-cyan/20 blur-3xl" />
        <div
          className="animate-blob absolute -right-24 top-40 h-[28rem] w-[28rem] rounded-full bg-brand-violet/20 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />
        <div
          className="animate-blob absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-brand-fuchsia/15 blur-3xl"
          style={{ animationDelay: "-12s" }}
        />
      </div>

      {/* グリッド */}
      <div aria-hidden="true" className="bg-grid absolute inset-0" />

      {/* 下端フェード */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="relative mx-auto w-full max-w-6xl px-6"
      >
        {profile.available && (
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-sm text-ink-muted"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            {profile.availableText}
          </motion.div>
        )}

        <motion.p
          variants={item}
          className="mb-4 font-mono text-sm tracking-wide text-brand-cyan"
        >
          {profile.role} · {profile.location}
        </motion.p>

        <h1 className="font-display text-[clamp(2.75rem,9vw,6.5rem)] font-bold leading-[0.98] tracking-tight">
          <motion.span variants={item} className="block">
            {profile.tagline[0]}
          </motion.span>
          <motion.span variants={item} className="block">
            <span className="text-gradient animate-shimmer">
              {profile.tagline[1]}
            </span>
          </motion.span>
        </h1>

        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg"
        >
          {profile.lead}
        </motion.p>

        <motion.div variants={item} className="mt-10 flex flex-wrap items-center gap-4">
          <a
            href="#projects"
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-fuchsia px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-violet/25 transition-transform hover:scale-[1.03]"
          >
            制作実績を見る
            <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-1">
              →
            </span>
          </a>
          <a
            href="#contact"
            className="rounded-full border border-white/15 px-7 py-3 text-sm font-semibold text-ink transition-colors hover:border-white/40 hover:bg-white/5"
          >
            お問い合わせ
          </a>
        </motion.div>
      </motion.div>

      {/* スクロールキュー */}
      <div
        aria-hidden="true"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-ink-faint sm:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <svg
          className="animate-cue"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </div>
    </section>
  );
}
