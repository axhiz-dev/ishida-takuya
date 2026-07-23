"use client";

import { useApp } from "@/components/providers/AppProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { builds } from "@/data/builds";
import { techs } from "@/data/tech";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

export function TechMap() {
  const { selectedTech, selectTech } = useApp();

  const siteBuildCount = (name: string) =>
    builds.filter((b) => b.stack.includes(name)).length;

  const onSelect = (name: string) => {
    if (selectedTech === name) {
      selectTech(null);
      return;
    }
    selectTech(name);
    // Archive 側のハイライトを見せる
    setTimeout(() => scrollToId("archive"), 60);
  };

  return (
    <section id="stack" className="scroll-mt-16 py-24">
      <SectionHeading
        file="stack/tech-map.json"
        title="Tech Map"
        lead="技術一覧ではなく、Build との関係。クリックすると使われた Build がハイライトされます。"
      />

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {techs.map((tech, i) => {
          const selected = selectedTech === tech.name;
          const inArchive = siteBuildCount(tech.name);
          return (
            <Reveal key={tech.name} delay={i * 0.03}>
              <button
                type="button"
                onClick={() => onSelect(tech.name)}
                title={`Used in ${tech.careerBuilds} builds`}
                className={cn(
                  "group w-full rounded-lg border bg-card p-4 text-left transition-all",
                  selected
                    ? "border-accent shadow-[0_0_0_1px_var(--color-accent)]"
                    : "border-line hover:border-faint"
                )}
              >
                <p className="font-mono text-sm font-medium">{tech.name}</p>
                <p
                  className={cn(
                    "mt-1 font-mono text-[11px] transition-colors",
                    selected ? "text-accent" : "text-faint group-hover:text-muted"
                  )}
                >
                  <span className="hidden group-hover:inline">
                    Used in {tech.careerBuilds} builds
                  </span>
                  <span className="group-hover:hidden">
                    {tech.careerBuilds} Builds
                  </span>
                </p>
                <p
                  className={cn(
                    "mt-2 font-mono text-[10px] text-accent transition-opacity",
                    selected || inArchive === 0 ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                  )}
                >
                  highlight →
                </p>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
