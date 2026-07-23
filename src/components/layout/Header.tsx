"use client";

import { Command, Menu } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { profile } from "@/data/profile";

export function Header() {
  const { setPaletteOpen, setDrawerOpen, devMode } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur-sm">
      <div className="flex h-12 items-center gap-3 px-4">
        <button
          type="button"
          aria-label="Open explorer"
          onClick={() => setDrawerOpen(true)}
          className="text-muted transition-colors hover:text-ink md:hidden"
        >
          <Menu size={18} />
        </button>

        {/* ウィンドウ風トラフィックライト */}
        <div aria-hidden className="hidden items-center gap-1.5 md:flex">
          <span className="h-2.5 w-2.5 rounded-full border border-line bg-card" />
          <span className="h-2.5 w-2.5 rounded-full border border-line bg-card" />
          <span className="h-2.5 w-2.5 rounded-full border border-line bg-accent/80" />
        </div>

        <p className="min-w-0 flex-1 truncate text-center font-mono text-xs text-muted">
          ~/ishida-takuya
          <span className="text-faint"> — </span>
          build.log
          {devMode ? (
            <span className="ml-2 rounded-sm border border-accent/40 px-1.5 py-0.5 text-[10px] text-accent">
              DEV MODE · BUILD #{profile.buildNumber}
            </span>
          ) : null}
        </p>

        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="flex items-center gap-1.5 rounded-md border border-line bg-card px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-faint hover:text-ink"
        >
          <Command size={12} />
          <span>K</span>
        </button>
      </div>
    </header>
  );
}
