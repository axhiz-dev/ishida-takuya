"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useApp } from "@/components/providers/AppProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BlinkingCursor } from "@/components/ui/BlinkingCursor";
import { commits, headCommit, hiddenCommit, type Commit } from "@/data/commits";
import { copyText } from "@/lib/utils";

function CommitRow({ commit }: { commit: Commit }) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    const ok = await copyText(
      `commit ${commit.hash} (#${commit.no}) — ${commit.message}`
    );
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <Reveal className="relative pl-10">
      {/* graph 上のドット */}
      <span
        aria-hidden
        className="absolute left-[13px] top-2 h-2 w-2 rounded-full border-2 border-accent bg-bg"
      />
      <div className="group pb-10">
        <button
          type="button"
          onClick={onCopy}
          title="Click to copy"
          className="flex items-center gap-2 font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          <span className="text-accent">commit {commit.hash}</span>
          <span className="text-faint">#{commit.no}</span>
          <span className="text-faint">· {commit.year}</span>
          <span className="opacity-0 transition-opacity group-hover:opacity-100">
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </span>
        </button>
        <p className="mt-1.5 font-heading text-lg font-medium tracking-tight sm:text-xl">
          {commit.message}
        </p>
      </div>
    </Reveal>
  );
}

export function BuildHistory() {
  const { devMode } = useApp();

  return (
    <section id="history" className="scroll-mt-16 py-24">
      <SectionHeading
        file="journey/history.log"
        title="Build History"
        lead="スクロールするたび、新しい commit が積まれていく。これまでの主要な commit。"
      />

      <div className="relative">
        {/* graph の縦線 */}
        <span
          aria-hidden
          className="absolute bottom-4 left-4 top-2 w-px bg-line"
        />

        {commits.map((commit) => (
          <CommitRow key={commit.no} commit={commit} />
        ))}

        {/* HEAD */}
        <Reveal className="relative pl-10">
          <span
            aria-hidden
            className="absolute left-[11px] top-2 h-3 w-3 rounded-full bg-accent"
          />
          <div className="pb-4">
            <p className="font-mono text-xs">
              <span className="rounded-sm border border-accent/40 bg-accent/8 px-1.5 py-0.5 text-accent">
                {headCommit.ref}
              </span>
              <span className="ml-2 text-faint">· {headCommit.year}</span>
            </p>
            <p className="mt-2 font-heading text-lg font-medium tracking-tight sm:text-xl">
              {headCommit.message}
              <BlinkingCursor className="ml-1" />
            </p>
          </div>
        </Reveal>

        {/* 隠し commit: hover か Developer Mode でだけ見える */}
        <div
          className={`relative pl-10 pt-6 transition-opacity duration-500 ${
            devMode ? "opacity-70" : "opacity-0 hover:opacity-60"
          }`}
        >
          <p className="font-mono text-xs text-faint">
            commit {hiddenCommit.hash} — {hiddenCommit.message}
          </p>
        </div>
      </div>
    </section>
  );
}
