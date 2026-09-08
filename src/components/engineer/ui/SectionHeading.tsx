"use client";

import { motion } from "motion/react";

type SectionHeadingProps = {
  /** 日本語見出し。 */
  title: string;
  /** 背景に薄く敷く英語ウォーターマーク。紙には出さない。 */
  watermark: string;
  /** 見出し上の小ラベル。 */
  eyebrow?: string;
  align?: "left" | "center";
};

export function SectionHeading({
  title,
  watermark,
  eyebrow,
  align = "left",
}: SectionHeadingProps) {
  const isCenter = align === "center";
  return (
    <div className={`relative mb-14 ${isCenter ? "text-center" : "text-left"}`}>
      <span
        aria-hidden="true"
        data-print="hide"
        className={`pointer-events-none absolute -top-8 select-none font-display text-[18vw] font-bold leading-none tracking-tight text-white/[0.03] sm:text-[9rem] ${
          isCenter ? "left-1/2 -translate-x-1/2" : "-left-2"
        }`}
      >
        {watermark}
      </span>

      <div className="relative">
        {eyebrow && (
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-brand-cyan">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          {title}
        </h2>
        <motion.div
          data-print="hide"
          className={`mt-5 h-px w-24 origin-left bg-gradient-to-r from-brand-cyan via-brand-violet to-brand-fuchsia ${
            isCenter ? "mx-auto origin-center" : ""
          }`}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
