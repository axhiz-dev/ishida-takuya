import { Reveal } from "@/components/ui/Reveal";

type SectionHeadingProps = {
  file: string;
  title: string;
  lead?: string;
};

export function SectionHeading({ file, title, lead }: SectionHeadingProps) {
  return (
    <Reveal className="mb-10">
      <p className="mb-2 font-mono text-xs text-faint">
        <span className="text-accent">$</span> cat {file}
      </p>
      <h2 className="font-heading text-2xl font-semibold tracking-tight sm:text-3xl">
        {title}
      </h2>
      {lead ? <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{lead}</p> : null}
    </Reveal>
  );
}
