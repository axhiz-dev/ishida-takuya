"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";

const shortcuts = [
  { keys: ["Ctrl", "K"], label: "Command Palette" },
  { keys: ["J", "K"], label: "次・前の Build" },
  { keys: ["Enter"], label: "選択中の Build を開く" },
  { keys: ["Esc"], label: "閉じる" },
  { keys: ["?"], label: "このショートカット一覧" },
];

export function ShortcutsOverlay() {
  const { shortcutsOpen, setShortcutsOpen } = useApp();

  return (
    <AnimatePresence>
      {shortcutsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.button
            type="button"
            aria-label="Close shortcuts"
            className="absolute inset-0 bg-ink/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => setShortcutsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative w-full max-w-sm rounded-xl border border-line bg-card p-5 shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="Keyboard shortcuts"
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-sm font-medium">Keyboard Shortcuts</p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setShortcutsOpen(false)}
                className="text-muted transition-colors hover:text-ink"
              >
                <X size={15} />
              </button>
            </div>
            <ul className="space-y-2.5">
              {shortcuts.map((s) => (
                <li
                  key={s.label}
                  className="flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-muted">{s.label}</span>
                  <span className="flex gap-1">
                    {s.keys.map((key) => (
                      <kbd
                        key={key}
                        className="rounded border border-line bg-bg px-1.5 py-0.5 font-mono text-[11px] text-ink"
                      >
                        {key}
                      </kbd>
                    ))}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
