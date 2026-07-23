import {
  ArrowUpRight,
  BookOpen,
  Briefcase,
  FileDown,
  GitBranch,
  Mail,
  PenLine,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { contactLinks } from "@/data/profile";

const icons: Record<string, React.ReactNode> = {
  GitHub: <GitBranch size={15} />,
  Zenn: <BookOpen size={15} />,
  Qiita: <PenLine size={15} />,
  LinkedIn: <Briefcase size={15} />,
  Email: <Mail size={15} />,
  "Resume PDF": <FileDown size={15} />,
};

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 py-24">
      <SectionHeading
        file="contact/links.json"
        title="Contact"
        lead="この Build Log が面白かったら、ぜひ。"
      />

      <div className="grid max-w-2xl grid-cols-1 gap-2 sm:grid-cols-2">
        {contactLinks.map((link, i) => {
          const external = link.href.startsWith("http");
          return (
            <Reveal key={link.label} delay={i * 0.04}>
              <a
                href={link.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 rounded-lg border border-line bg-card px-4 py-3 transition-colors hover:border-faint"
              >
                <span className="text-muted transition-colors group-hover:text-accent">
                  {icons[link.label]}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{link.label}</span>
                  {link.note ? (
                    <span className="block font-mono text-[11px] text-faint">
                      {link.note}
                    </span>
                  ) : null}
                </span>
                <ArrowUpRight
                  size={14}
                  className="text-faint opacity-0 transition-opacity group-hover:opacity-100"
                />
              </a>
            </Reveal>
          );
        })}
      </div>

      <Reveal className="mt-24">
        <p className="border-t border-line pt-6 font-mono text-xs text-faint">
          Build Log — not a resume. still building.
          <span className="cursor-blink text-accent">_</span>
        </p>
      </Reveal>
    </section>
  );
}
