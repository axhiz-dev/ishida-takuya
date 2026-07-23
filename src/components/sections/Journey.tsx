"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { journeyNodes } from "@/data/journey";
import { cn } from "@/lib/utils";

export function Journey() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="journey" className="scroll-mt-16 py-24">
      <SectionHeading
        file="journey/path.md"
        title="Journey"
        lead="一本の線。クリックすると、その時のことを少しだけ話します。"
      />

      <div className="relative ml-2">
        <span aria-hidden className="absolute bottom-3 left-0 top-3 w-px bg-line" />
        <ul>
          {journeyNodes.map((node, i) => {
            const open = openIndex === i;
            const isLast = i === journeyNodes.length - 1;
            return (
              <Reveal key={node.label} delay={i * 0.04}>
                <li className="relative pb-2 pl-8">
                  <span
                    aria-hidden
                    className={cn(
                      "absolute -left-[5px] top-[15px] h-[11px] w-[11px] rounded-full border-2 bg-bg transition-colors",
                      open || isLast ? "border-accent" : "border-faint"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    className={cn(
                      "py-2 font-mono text-base transition-colors sm:text-lg",
                      open ? "text-accent" : "text-ink hover:text-accent",
                      isLast && "text-faint hover:text-accent"
                    )}
                  >
                    {node.label}
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                        className="max-w-md overflow-hidden text-sm leading-relaxed text-muted"
                      >
                        {node.note}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
