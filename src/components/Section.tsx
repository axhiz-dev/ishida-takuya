import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** セクション番号 + 英字eyebrow + 日本語見出しつきのセクション */
export default function Section({
  number,
  eyebrow,
  title,
  children,
  className = "",
}: {
  number?: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-24 ${className}`}>
      <Reveal>
        <div className="flex items-baseline gap-4">
          {number && (
            <span className="font-mono text-sm font-semibold text-ink-faint">
              {number}
            </span>
          )}
          <p className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
            {eyebrow}
          </p>
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="mt-5 h-px w-full bg-line" />
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}
