"use client";

import { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { explorerTree, sections } from "@/data/sections";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

type ExplorerProps = {
  onNavigate?: () => void;
};

export function Explorer({ onNavigate }: ExplorerProps) {
  const ids = useMemo(() => sections.map((s) => s.id), []);
  const active = useScrollSpy(ids);
  const [closedFolders, setClosedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (label: string) => {
    setClosedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const go = (id: string) => {
    scrollToId(id);
    onNavigate?.();
  };

  return (
    <nav aria-label="Explorer" className="text-[13px]">
      <p className="mb-3 px-2 font-mono text-[10px] font-medium uppercase tracking-[0.14em] text-faint">
        Explorer
      </p>
      <ul className="space-y-0.5">
        {explorerTree.map((node) => {
          if (node.type === "file") {
            return (
              <li key={node.id}>
                <button
                  type="button"
                  onClick={() => go(node.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left font-mono transition-colors",
                    active === node.id
                      ? "bg-accent/8 text-accent"
                      : "text-muted hover:bg-line/40 hover:text-ink"
                  )}
                >
                  <FileText size={13} className="shrink-0" />
                  {node.label}
                </button>
              </li>
            );
          }

          const closed = closedFolders.has(node.label);
          const containsActive = node.children.some((c) => c.id === active);
          return (
            <li key={node.label}>
              <button
                type="button"
                onClick={() => toggleFolder(node.label)}
                aria-expanded={!closed}
                className={cn(
                  "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left font-mono transition-colors",
                  containsActive ? "text-ink" : "text-muted",
                  "hover:bg-line/40 hover:text-ink"
                )}
              >
                <span aria-hidden className="text-[13px] leading-none">
                  {closed ? "📁" : "📂"}
                </span>
                {node.label}
              </button>
              {!closed && (
                <ul className="mt-0.5 space-y-0.5 border-l border-line pl-2 ml-4">
                  {node.children.map((child) => (
                    <li key={`${node.label}-${child.id}-${child.label}`}>
                      <button
                        type="button"
                        onClick={() => go(child.id)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-1 text-left font-mono transition-colors",
                          active === child.id
                            ? "bg-accent/8 text-accent"
                            : "text-muted hover:bg-line/40 hover:text-ink"
                        )}
                      >
                        {child.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mt-8 px-2 font-mono text-[10px] leading-relaxed text-faint">
        press <kbd className="rounded border border-line bg-card px-1">?</kbd> for
        shortcuts
      </p>
    </nav>
  );
}
