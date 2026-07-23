import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { lessons } from "@/data/lessons";

export function Lessons() {
  return (
    <section id="lessons" className="scroll-mt-16 py-24">
      <SectionHeading
        file="lessons/lessons.md"
        title="Lessons"
        lead="Build を横断して残った考え。"
      />

      <ul className="max-w-2xl space-y-5">
        {lessons.map((lesson, i) => (
          <Reveal key={lesson} delay={i * 0.05}>
            <li className="flex items-baseline gap-3 border-b border-line pb-5">
              <span className="font-mono text-xs text-accent">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="font-heading text-base font-medium leading-relaxed sm:text-lg">
                {lesson}
              </p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
