"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";
import { useApp } from "@/components/providers/AppProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { currentBuild } from "@/data/builds";

const BLOCKS = 10;

export function CurrentBuild() {
  const { openBuild } = useApp();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, currentBuild.progress, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setProgress(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView]);

  const filled = Math.round((progress / 100) * BLOCKS);
  const bar = "█".repeat(filled) + "░".repeat(BLOCKS - filled);

  return (
    <section id="current" className="scroll-mt-16 py-24">
      <SectionHeading file="builds/current.build" title="Current Build" />

      <Reveal>
        <button
          type="button"
          onClick={() => openBuild(currentBuild.buildId)}
          className="w-full max-w-xl rounded-lg border border-line bg-card p-6 text-left transition-colors hover:border-faint sm:p-8"
        >
          <div className="flex items-center gap-2">
            <span
              aria-hidden
              className="h-2 w-2 animate-pulse rounded-full bg-accent"
            />
            <p className="font-heading text-xl font-semibold tracking-tight">
              {currentBuild.name}
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {currentBuild.chips.map((chip) => (
              <span
                key={chip}
                className="rounded-sm border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
              >
                {chip}
              </span>
            ))}
          </div>

          <div ref={ref} className="mt-6">
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-faint">
              Progress
            </p>
            <p className="font-mono text-lg tracking-tight">
              <span className="text-accent">{bar}</span>
              <span className="ml-3 text-sm text-muted">{progress}%</span>
            </p>
          </div>
        </button>
      </Reveal>
    </section>
  );
}
