"use client";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BuildFolderCard } from "@/components/build/BuildFolderCard";
import { featuredBuilds } from "@/data/builds";

export function FeaturedBuilds() {
  return (
    <section id="featured" className="scroll-mt-16 py-24">
      <SectionHeading
        file="builds/featured/"
        title="Featured Builds"
        lead="フォルダを開いてみてください。README から Lessons まで入っています。"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {featuredBuilds.map((build, i) => (
          <Reveal key={build.id} delay={i * 0.08}>
            <BuildFolderCard build={build} size="lg" />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
