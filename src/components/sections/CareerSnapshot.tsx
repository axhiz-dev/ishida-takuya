import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { CountUp } from "@/components/ui/CountUp";
import { snapshotStats } from "@/data/lessons";

export function CareerSnapshot() {
  return (
    <section id="snapshot" className="scroll-mt-16 py-24">
      <SectionHeading file="journey/stats.json" title="Career Snapshot" />

      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
        {snapshotStats.map((stat, i) => (
          <div key={stat.label} className="bg-card px-8 py-10">
            <Reveal delay={i * 0.08}>
              <p className="font-heading text-5xl font-semibold tracking-tight text-ink">
                <CountUp to={stat.value} suffix={stat.suffix} />
              </p>
              <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {stat.label}
              </p>
            </Reveal>
          </div>
        ))}
      </div>
    </section>
  );
}
