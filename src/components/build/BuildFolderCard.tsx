"use client";

import { useState } from "react";
import { useApp } from "@/components/providers/AppProvider";
import { orderedBuilds, type Build } from "@/data/builds";
import { cn } from "@/lib/utils";

type BuildFolderCardProps = {
  build: Build;
  size?: "lg" | "sm";
  dimmed?: boolean;
  highlighted?: boolean;
};

export function BuildFolderCard({
  build,
  size = "sm",
  dimmed = false,
  highlighted = false,
}: BuildFolderCardProps) {
  const { openBuild, focusIndex } = useApp();
  const [hovered, setHovered] = useState(false);
  const focused = orderedBuilds[focusIndex]?.id === build.id;
  const open = hovered || focused;

  return (
    <button
      type="button"
      data-build-id={build.id}
      onClick={() => openBuild(build.id)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "group w-full rounded-lg border bg-card text-left transition-all duration-300",
        size === "lg" ? "p-6 sm:p-8" : "p-4",
        highlighted
          ? "border-accent/60 shadow-[0_0_0_1px_var(--color-accent)]"
          : "border-line hover:border-faint",
        focused && "border-accent shadow-[0_0_0_1px_var(--color-accent)]",
        dimmed && "opacity-40"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <span
          aria-hidden
          className={cn(
            "leading-none transition-transform duration-300",
            size === "lg" ? "text-3xl" : "text-xl",
            open && "-translate-y-0.5"
          )}
        >
          {open ? "📂" : "📁"}
        </span>
        <span className="font-mono text-[11px] text-faint">{build.year}</span>
      </div>

      <p
        className={cn(
          "mt-3 font-heading font-semibold tracking-tight",
          size === "lg" ? "text-xl sm:text-2xl" : "text-base"
        )}
      >
        {build.name}
        {build.inProgress ? (
          <span className="ml-2 align-middle font-mono text-[10px] font-normal text-accent">
            ● in progress
          </span>
        ) : null}
      </p>

      <p
        className={cn(
          "mt-1.5 leading-relaxed text-muted",
          size === "lg" ? "text-sm" : "text-xs"
        )}
      >
        {build.tagline}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {build.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-sm border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      <p
        className={cn(
          "mt-4 font-mono text-[11px] text-accent transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0"
        )}
      >
        open →
      </p>
    </button>
  );
}
