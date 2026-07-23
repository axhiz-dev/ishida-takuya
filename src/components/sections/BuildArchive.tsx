"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { BuildFolderCard } from "@/components/build/BuildFolderCard";
import { builds, tags, type Tag } from "@/data/builds";
import { cn } from "@/lib/utils";

export function BuildArchive() {
  const { archiveOpen, setArchiveOpen, selectedTech, selectTech } = useApp();
  const [activeTag, setActiveTag] = useState<Tag | null>(null);

  const archiveBuilds = builds.filter((b) => !b.featured);
  const filtered = activeTag
    ? archiveBuilds.filter((b) => b.tags.includes(activeTag))
    : archiveBuilds;

  const usesTech = (stack: string[]) =>
    selectedTech !== null && stack.includes(selectedTech);

  return (
    <section id="archive" className="scroll-mt-16 py-24">
      <SectionHeading
        file="builds/archive/"
        title="Build Archive"
        lead="Featured 以外の Build たち。タグで絞り込めます。"
      />

      {!archiveOpen ? (
        <button
          type="button"
          onClick={() => setArchiveOpen(true)}
          className="group flex items-center gap-2 rounded-md border border-line bg-card px-4 py-2.5 font-mono text-sm text-muted transition-colors hover:border-faint hover:text-ink"
        >
          <ChevronDown
            size={14}
            className="text-accent transition-transform group-hover:translate-y-0.5"
          />
          Show All Builds
          <span className="text-faint">({archiveBuilds.length})</span>
        </button>
      ) : (
        <div>
          {/* タグフィルター */}
          <div className="mb-6 flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTag(null)}
              className={cn(
                "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                activeTag === null
                  ? "border-accent bg-accent/8 text-accent"
                  : "border-line text-muted hover:border-faint hover:text-ink"
              )}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={cn(
                  "rounded-md border px-2.5 py-1 font-mono text-xs transition-colors",
                  activeTag === tag
                    ? "border-accent bg-accent/8 text-accent"
                    : "border-line text-muted hover:border-faint hover:text-ink"
                )}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Tech Map からのハイライト表示 */}
          {selectedTech ? (
            <div className="mb-4 flex items-center gap-2 font-mono text-xs text-muted">
              <span>
                highlighting builds using{" "}
                <span className="text-accent">{selectedTech}</span>
              </span>
              <button
                type="button"
                onClick={() => selectTech(null)}
                aria-label="Clear tech highlight"
                className="rounded-sm border border-line p-0.5 transition-colors hover:text-ink"
              >
                <X size={11} />
              </button>
            </div>
          ) : null}

          <motion.div layout className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence initial={false}>
              {filtered.map((build) => (
                <motion.div
                  key={build.id}
                  layout
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <BuildFolderCard
                    build={build}
                    dimmed={selectedTech !== null && !usesTech(build.stack)}
                    highlighted={usesTech(build.stack)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {filtered.length === 0 && (
            <p className="font-mono text-sm text-faint">
              {"// no builds found for this tag"}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
