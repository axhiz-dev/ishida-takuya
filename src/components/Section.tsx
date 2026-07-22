import type { ReactNode } from "react";
import Reveal from "./Reveal";

/** 英字の小見出し（eyebrow）+ 日本語見出しつきのセクション */
export default function Section({
  eyebrow,
  title,
  children,
  className = "",
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mt-16 print:mt-6 ${className}`}>
      <Reveal>
        <p className="text-[11px] font-semibold tracking-[0.25em] text-accent uppercase">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-bold tracking-tight print:text-lg">
          {title}
        </h2>
        <div className="mt-3 h-px w-full bg-line" />
      </Reveal>
      <div className="mt-6 print:mt-3">{children}</div>
    </section>
  );
}
