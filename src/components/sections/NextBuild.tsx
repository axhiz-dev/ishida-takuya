import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { BlinkingCursor } from "@/components/ui/BlinkingCursor";

export function NextBuild() {
  return (
    <section id="next" className="scroll-mt-16 py-24">
      <SectionHeading file="builds/next.build" title="Next Build" />

      <Reveal>
        <div className="max-w-xl rounded-lg border border-dashed border-line bg-card/50 p-8">
          <p className="font-mono text-4xl text-faint">
            ?<BlinkingCursor className="ml-1" />
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            終わらない Build Log。次に何を作るかは、次の課題が決める。
          </p>
        </div>
      </Reveal>
    </section>
  );
}
