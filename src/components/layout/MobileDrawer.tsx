"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { Explorer } from "@/components/layout/Explorer";

export function MobileDrawer() {
  const { drawerOpen, setDrawerOpen } = useApp();

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.button
            type="button"
            aria-label="Close explorer"
            className="absolute inset-0 bg-ink/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setDrawerOpen(false)}
          />
          <motion.div
            className="absolute inset-y-0 left-0 w-72 overflow-y-auto border-r border-line bg-bg p-4"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="font-mono text-xs text-muted">~/ishida-takuya</p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => setDrawerOpen(false)}
                className="text-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>
            <Explorer onNavigate={() => setDrawerOpen(false)} />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
