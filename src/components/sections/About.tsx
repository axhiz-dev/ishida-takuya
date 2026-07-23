"use client";

import { motion } from "motion/react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/data/profile";

export function About() {
  return (
    <section id="about" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Who I am" title="私について" watermark="About" />

        <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] md:gap-16">
          {/* ポートレート（SVG モノグラム + 回転リング） */}
          <Reveal direction="left" className="mx-auto w-full max-w-xs md:sticky md:top-28">
            <div className="relative aspect-square">
              {/* 回転コニックリング */}
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-3xl p-px"
                style={{
                  background:
                    "conic-gradient(from var(--angle), #22d3ee, #8b5cf6, #e879f9, #22d3ee)",
                  animation: "border-rotate 8s linear infinite",
                }}
              >
                <div className="h-full w-full rounded-3xl bg-surface" />
              </div>

              {/* モノグラム */}
              <div className="absolute inset-px flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br from-surface to-bg-alt">
                <span className="font-display text-7xl font-bold text-gradient">
                  IT
                </span>
                <span className="mt-2 font-mono text-xs tracking-[0.3em] text-ink-muted">
                  {profile.nameEn.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {profile.stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-white/5 bg-white/[0.02] px-3 py-4 text-center"
                >
                  <div className="font-display text-2xl font-bold text-ink">
                    {s.value}
                    <span className="text-brand-violet">{s.suffix}</span>
                  </div>
                  <div className="mt-1 text-[11px] leading-tight text-ink-muted">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* 本文 */}
          <div>
            <Reveal direction="right">
              <p className="font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
                「速く・壊れにくく・
                <span className="text-gradient">開発が続けやすい</span>
                」を、
                <br className="hidden sm:block" />
                当たり前にするエンジニアです。
              </p>
            </Reveal>

            <div className="mt-8 space-y-5">
              {profile.bio.map((para, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  className="leading-relaxed text-ink-muted"
                >
                  {para}
                </motion.p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
