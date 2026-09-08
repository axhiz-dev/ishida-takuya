"use client";

import { motion } from "motion/react";
import { SectionHeading } from "../ui/SectionHeading";
import { SkillBar } from "../ui/SkillBar";
import { engineerSkills } from "@/content/engineer";

export function Skills() {
  return (
    <section id="skills" className="relative py-24 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="What I use" title="スキル" watermark="Skills" />

        <div className="grid gap-6 md:grid-cols-3">
          {engineerSkills.map((cat, ci) => (
            <motion.div
              key={cat.titleEn}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: ci * 0.12 }}
              className="relative overflow-hidden rounded-2xl border border-white/8 bg-surface/60 p-6"
            >
              {/* カテゴリ番号のウォーターマーク */}
              <span
                aria-hidden="true"
                data-print="hide"
                className="pointer-events-none absolute -right-2 -top-4 select-none font-display text-7xl font-bold text-white/[0.03]"
              >
                0{ci + 1}
              </span>

              <div className="relative">
                <p className="font-mono text-xs uppercase tracking-widest text-brand-cyan">
                  {cat.titleEn}
                </p>
                <h3 className="mt-1 font-display text-xl font-bold text-ink">{cat.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{cat.note}</p>

                <div className="mt-6 space-y-4">
                  {cat.skills.map((skill, si) => (
                    <SkillBar
                      key={skill.name}
                      name={skill.name}
                      level={skill.level}
                      delay={si * 0.08}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
