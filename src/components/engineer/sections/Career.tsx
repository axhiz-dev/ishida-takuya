"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { SectionHeading } from "../ui/SectionHeading";
import { engineerCareer } from "@/content/engineer";
import { formatDotPeriod } from "@/lib/derive";

export function Career() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 80%", "end 60%"],
  });
  const lineScale = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <section id="career" className="relative bg-bg-alt py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="My journey" title="職務経歴" watermark="Career" />

        <div ref={ref} className="relative">
          {/* タイムラインの縦線（背景トラック） */}
          <div
            aria-hidden="true"
            data-print="hide"
            className="absolute bottom-0 left-4 top-2 w-px bg-white/8 md:left-1/2 md:-translate-x-1/2"
          />
          {/* スクロール連動で描かれる線 */}
          <motion.div
            aria-hidden="true"
            data-print="hide"
            style={{ scaleY: lineScale }}
            className="absolute bottom-0 left-4 top-2 w-px origin-top bg-gradient-to-b from-brand-cyan via-brand-violet to-brand-fuchsia md:left-1/2 md:-translate-x-1/2"
          />

          <ul className="space-y-12 md:space-y-4">
            {engineerCareer.map((entry, i) => {
              const isLeft = i % 2 === 0;
              return (
                <li
                  key={`${entry.company}-${entry.period.from}`}
                  data-testid="career-entry"
                  data-print="linear"
                  className="relative md:grid md:grid-cols-2 md:gap-x-12"
                >
                  {/* ノード */}
                  <motion.span
                    aria-hidden="true"
                    data-print="hide"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ type: "spring", stiffness: 400, damping: 16 }}
                    className="absolute left-4 top-6 z-10 h-3.5 w-3.5 -translate-x-1/2 rounded-full border-2 border-bg-alt bg-gradient-to-br from-brand-cyan to-brand-fuchsia shadow-[0_0_0_4px_rgba(139,122,246,0.15)] md:left-1/2"
                  />

                  {/* カード */}
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -32 : 32, y: 8 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className={`ml-10 md:ml-0 ${
                      isLeft
                        ? "md:col-start-1 md:pr-4 md:text-right"
                        : "md:col-start-2 md:pl-4"
                    }`}
                  >
                    <div className="group rounded-2xl border border-white/8 bg-surface/70 p-6 transition-colors hover:border-brand-violet/40">
                      <span className="inline-block font-mono text-xs text-brand-cyan">
                        {formatDotPeriod(entry.period)}
                      </span>
                      <h3 className="mt-2 font-display text-xl font-bold text-ink">
                        {entry.company}
                      </h3>
                      <p className="mt-0.5 text-sm text-ink-muted">
                        {entry.role}
                        <span className="mx-1.5 text-ink-faint">·</span>
                        <span className="text-ink-faint">{entry.companyNote}</span>
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                        {entry.summary}
                      </p>

                      <ul
                        className={`mt-4 space-y-1.5 text-sm text-ink-muted ${
                          isLeft ? "md:text-right" : ""
                        }`}
                      >
                        {entry.highlights.map((h) => (
                          <li
                            key={h}
                            className={`flex gap-2 ${isLeft ? "md:flex-row-reverse" : ""}`}
                          >
                            <span
                              aria-hidden="true"
                              className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-brand-violet"
                            />
                            <span>{h}</span>
                          </li>
                        ))}
                      </ul>

                      <div
                        className={`mt-4 flex flex-wrap gap-1.5 ${
                          isLeft ? "md:justify-end" : ""
                        }`}
                      >
                        {entry.tech.map((t) => (
                          <span
                            key={t}
                            className="rounded-md border border-white/8 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-ink-muted"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
