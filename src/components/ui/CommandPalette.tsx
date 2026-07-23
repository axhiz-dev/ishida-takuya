"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, FileText, Folder, Keyboard, Search } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { sections } from "@/data/sections";
import { orderedBuilds } from "@/data/builds";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";

type PaletteItem = {
  id: string;
  label: string;
  hint: string;
  icon: React.ReactNode;
  action: () => void;
};

export function CommandPalette() {
  const { paletteOpen, setPaletteOpen, openBuild, setShortcutsOpen } = useApp();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const items = useMemo<PaletteItem[]>(() => {
    const close = () => setPaletteOpen(false);
    return [
      ...sections.map((s) => ({
        id: `section-${s.id}`,
        label: s.title,
        hint: s.file,
        icon: <FileText size={14} />,
        action: () => {
          close();
          scrollToId(s.id);
        },
      })),
      ...orderedBuilds.map((b) => ({
        id: `build-${b.id}`,
        label: `Open build: ${b.name}`,
        hint: `builds/${b.id}/`,
        icon: <Folder size={14} />,
        action: () => {
          close();
          openBuild(b.id);
        },
      })),
      {
        id: "action-shortcuts",
        label: "Keyboard shortcuts",
        hint: "?",
        icon: <Keyboard size={14} />,
        action: () => {
          close();
          setShortcutsOpen(true);
        },
      },
    ];
  }, [setPaletteOpen, openBuild, setShortcutsOpen]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.hint.toLowerCase().includes(q)
    );
  }, [items, query]);

  // 開くたびに入力をリセット(render 中の状態調整パターン)
  const [prevOpen, setPrevOpen] = useState(paletteOpen);
  if (paletteOpen !== prevOpen) {
    setPrevOpen(paletteOpen);
    if (paletteOpen) {
      setQuery("");
      setIndex(0);
    }
  }

  useEffect(() => {
    if (paletteOpen) {
      // AnimatePresence のマウント後にフォーカス
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [paletteOpen]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape" || ((e.metaKey || e.ctrlKey) && e.key === "k")) {
      e.preventDefault();
      setPaletteOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      filtered[index]?.action();
    }
  };

  return (
    <AnimatePresence>
      {paletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[14vh]">
          <motion.button
            type="button"
            aria-label="Close command palette"
            className="absolute inset-0 bg-ink/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setPaletteOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-line bg-card shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
          >
            <div className="flex items-center gap-2 border-b border-line px-4">
              <Search size={14} className="text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIndex(0);
                }}
                onKeyDown={onKeyDown}
                placeholder="Jump to section, open a build…"
                className="w-full bg-transparent py-3 font-mono text-sm outline-none placeholder:text-faint"
              />
              <kbd className="rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint">
                esc
              </kbd>
            </div>

            <ul className="max-h-72 overflow-y-auto p-1.5">
              {filtered.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={item.action}
                    onMouseEnter={() => setIndex(i)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors",
                      i === index ? "bg-accent/8 text-ink" : "text-muted"
                    )}
                  >
                    <span
                      className={cn(i === index ? "text-accent" : "text-faint")}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.label}</span>
                    <span className="font-mono text-[10px] text-faint">
                      {item.hint}
                    </span>
                    {i === index && (
                      <CornerDownLeft size={12} className="text-faint" />
                    )}
                  </button>
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3 py-6 text-center font-mono text-xs text-faint">
                  {"// nothing found — maybe the next build?"}
                </li>
              )}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
