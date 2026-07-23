"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Image as ImageIcon, X } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { builds, type Build } from "@/data/builds";

const TABS = [
  "README.md",
  "Architecture.md",
  "Implementation.md",
  "Lessons.md",
  "Gallery/",
] as const;

type TabName = (typeof TABS)[number];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
        {label}
      </p>
      <p className="text-sm leading-relaxed text-ink">{children}</p>
    </div>
  );
}

function TabContent({ build, tab }: { build: Build; tab: TabName }) {
  switch (tab) {
    case "README.md":
      return (
        <div className="space-y-6">
          <Field label="課題">{build.readme.challenge}</Field>
          <Field label="背景">{build.readme.background}</Field>
          <Field label="成果">{build.readme.outcome}</Field>
        </div>
      );
    case "Architecture.md":
      return (
        <div className="space-y-6">
          <div>
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              構成図
            </p>
            <pre className="overflow-x-auto rounded-md border border-line bg-bg p-4 font-mono text-xs leading-relaxed text-muted">
              {build.architecture.diagram}
            </pre>
          </div>
          <div>
            <p className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
              使用技術
            </p>
            <div className="flex flex-wrap gap-1.5">
              {build.architecture.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-sm border border-line bg-bg px-2 py-0.5 font-mono text-[11px] text-muted"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
          <Field label="設計思想">{build.architecture.philosophy}</Field>
        </div>
      );
    case "Implementation.md":
      return (
        <div className="space-y-6">
          <Field label="担当範囲">{build.implementation.scope}</Field>
          <Field label="工夫">{build.implementation.craft}</Field>
          <Field label="難しかったこと">{build.implementation.hardest}</Field>
        </div>
      );
    case "Lessons.md":
      return (
        <ul className="space-y-3">
          {build.lessons.map((lesson) => (
            <li key={lesson} className="flex gap-2 text-sm leading-relaxed">
              <span className="font-mono text-accent">·</span>
              {lesson}
            </li>
          ))}
        </ul>
      );
    case "Gallery/":
      return (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {build.gallery.map((item) => (
            <figure
              key={item.file}
              className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-bg p-3 text-center"
            >
              <ImageIcon size={18} className="text-faint" />
              <figcaption>
                <p className="font-mono text-[10px] text-faint">{item.file}</p>
                <p className="mt-0.5 text-[11px] text-muted">{item.label}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      );
  }
}

export function BuildDetailModal() {
  const { openBuildId, openBuild } = useApp();
  const [tab, setTab] = useState<TabName>("README.md");
  const [prevBuildId, setPrevBuildId] = useState(openBuildId);
  const build = builds.find((b) => b.id === openBuildId) ?? null;

  // 別の Build を開いたらタブをリセット(render 中の状態調整パターン)
  if (openBuildId !== prevBuildId) {
    setPrevBuildId(openBuildId);
    setTab("README.md");
  }

  return (
    <AnimatePresence>
      {build && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={`${build.name} details`}
        >
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 bg-ink/25"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => openBuild(null)}
          />

          <motion.div
            key={build.id}
            initial={{ opacity: 0, y: 24, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.99 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex max-h-[92dvh] w-full max-w-3xl flex-col overflow-hidden rounded-t-xl border border-line bg-card shadow-xl sm:max-h-[85vh] sm:rounded-xl"
          >
            {/* ウィンドウバー */}
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <span aria-hidden className="text-lg leading-none">
                📂
              </span>
              <p className="min-w-0 flex-1 truncate font-mono text-sm">
                builds/{build.id}/
                <span className="ml-2 text-faint">{build.year}</span>
              </p>
              <p className="hidden font-mono text-[10px] text-faint sm:block">
                J / K で次・前の Build
              </p>
              <button
                type="button"
                aria-label="Close"
                onClick={() => openBuild(null)}
                className="text-muted transition-colors hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            {/* タブ */}
            <div className="flex gap-0.5 overflow-x-auto border-b border-line bg-bg px-2 pt-2">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`whitespace-nowrap rounded-t-md border border-b-0 px-3 py-1.5 font-mono text-xs transition-colors ${
                    tab === t
                      ? "border-line bg-card text-ink"
                      : "border-transparent text-muted hover:text-ink"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* コンテンツ */}
            <div className="overflow-y-auto p-5 sm:p-6">
              <div className="mb-6">
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  {build.name}
                </h3>
                <p className="mt-1 text-sm text-muted">{build.tagline}</p>
              </div>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                >
                  <TabContent build={build} tab={tab} />
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
