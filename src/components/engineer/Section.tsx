import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

/** セクション番号 + 英字の小見出し + 日本語見出しつきのセクション */
export function Section({
  id,
  number,
  eyebrow,
  title,
  children,
}: {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="mt-24 scroll-mt-20">
      <Reveal>
        <div className="flex items-baseline gap-4">
          <span className="font-mono text-sm font-semibold text-ink-faint">{number}</span>
          <p className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
            {eyebrow}
          </p>
        </div>
        <h2 id={`${id}-title`} className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h2>
        <div className="mt-5 h-px w-full bg-line" />
      </Reveal>
      <div className="mt-8">{children}</div>
    </section>
  );
}
