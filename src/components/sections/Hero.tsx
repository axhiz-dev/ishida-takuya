"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { BlinkingCursor } from "@/components/ui/BlinkingCursor";
import { profile } from "@/data/profile";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function Hero() {
  return (
    <section
      id="readme"
      className="flex min-h-[calc(100vh-3rem)] flex-col justify-center py-24"
    >
      <motion.div variants={container} initial="hidden" animate="show">
        <motion.p variants={item} className="mb-6 font-mono text-xs text-faint">
          <span className="text-accent">$</span> cat README.md
        </motion.p>

        <motion.h1
          variants={item}
          className="font-heading text-5xl font-semibold tracking-tight sm:text-7xl"
        >
          Build Log
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-6 font-mono text-lg text-ink sm:text-xl"
        >
          {profile.name}
          <BlinkingCursor />
        </motion.p>

        <motion.p variants={item} className="mt-2 text-sm text-muted sm:text-base">
          {profile.title} — {profile.tagline}
        </motion.p>

        <motion.blockquote
          variants={item}
          className="mt-10 max-w-md border-l-2 border-line pl-4 text-sm leading-relaxed text-muted"
        >
          This is not a resume.
          <br />
          It is my build log.
        </motion.blockquote>

        <motion.div
          variants={item}
          className="mt-20 flex items-center gap-2 font-mono text-xs text-faint"
        >
          <ArrowDown size={13} className="text-accent" />
          Scroll
        </motion.div>
      </motion.div>
    </section>
  );
}
