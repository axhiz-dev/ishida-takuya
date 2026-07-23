import { careers, sideWorks } from "../../data/career";
import { profile } from "../../data/profile";
import { skillCategories } from "../../data/skills";
import type { Career } from "../../data/types";

/**
 * PDF出力（window.print）専用の職務経歴書レイアウト。
 * 画面には表示されず、印刷時のみ使われる（EngineerPage側で hidden print:block）。
 * A4の文書として静的・堅めのデザインに固定している。
 */

function DocSection({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-7">
      <p className="text-[9px] font-semibold tracking-[0.25em] text-accent uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-0.5 text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-2 h-px w-full bg-gray-300" />
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DocTag({ children }: { children: string }) {
  return (
    <span className="inline-block rounded-sm border border-gray-300 bg-white px-1.5 text-[9px] text-ink-soft">
      {children}
    </span>
  );
}

function DocCareerBlock({ career }: { career: Career }) {
  return (
    // ml-2: タイムラインのドット（-left-[7px]）がページ左端で見切れないための余白
    <div className="relative ml-2 border-l-2 border-line pl-6 pb-9 last:pb-0">
      <span className="absolute -left-[7px] top-1 size-3 rounded-full border-2 border-accent bg-white" />
      <p className="font-mono text-[11px] font-semibold tracking-wide text-accent">
        {career.period}
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-base font-bold tracking-tight">{career.company}</h3>
        <span className="text-[10px] text-ink-faint">{career.employmentType}</span>
      </div>
      <p className="mt-0.5 text-[12px] font-medium text-ink-soft">{career.role}</p>
      {career.summary && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">
          {career.summary}
        </p>
      )}

      <div className="mt-3 space-y-3">
        {career.projects.map((project) => (
          <div
            key={project.name}
            className="print-avoid-break rounded-md border border-gray-300 bg-white p-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-[12px] font-bold">{project.name}</h4>
              <p className="text-[9px] text-ink-faint">
                {[project.role, project.teamSize && `チーム${project.teamSize}`]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft">
              {project.description}
            </p>
            {project.highlights.length > 0 && (
              <ul className="mt-2 space-y-1">
                {project.highlights.map((highlight) => (
                  <li key={highlight} className="flex gap-2 text-[11px] leading-relaxed">
                    <span className="mt-[6px] size-1 shrink-0 rounded-full bg-accent" />
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
            {project.tech.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1">
                {project.tech.map((tech) => (
                  <DocTag key={tech}>{tech}</DocTag>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ResumeDocument() {
  return (
    <div className="bg-white text-ink">
      {/* ヘッダー */}
      <header>
        <p className="text-[9px] font-semibold tracking-[0.3em] text-accent uppercase">
          Curriculum Vitae
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{profile.nameJa}</h1>
            <p className="mt-1.5 text-[12px] text-ink-soft">
              {profile.nameEn} — {profile.title}
            </p>
          </div>
          <ul className="space-y-0.5 text-right text-[10px] text-ink-soft">
            <li>{profile.email}</li>
            {profile.links.map((link) => (
              <li key={link.url}>
                {link.label}: {link.url.replace(/^https?:\/\//, "")}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* 職務要約 */}
      <DocSection eyebrow="Summary" title="職務要約">
        <div className="space-y-2">
          {profile.summary.map((paragraph) => (
            <p
              key={paragraph.slice(0, 20)}
              className="text-[12px] leading-relaxed text-ink-soft"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </DocSection>

      {/* 職務経歴 */}
      <DocSection eyebrow="Career" title="職務経歴">
        <div>
          {careers.map((career) => (
            <DocCareerBlock key={career.company + career.period} career={career} />
          ))}
        </div>
      </DocSection>

      {/* 副業・業務委託 */}
      <DocSection eyebrow="Side Works" title="副業・業務委託">
        <div>
          {sideWorks.map((career) => (
            <DocCareerBlock key={career.company + career.period} career={career} />
          ))}
        </div>
      </DocSection>

      {/* スキル */}
      <DocSection eyebrow="Skills" title="スキル">
        <div className="grid grid-cols-2 gap-3">
          {skillCategories.map((category) => (
            <div
              key={category.category}
              className="print-avoid-break rounded-md border border-gray-300 bg-white p-3"
            >
              <h3 className="text-[12px] font-bold">{category.category}</h3>
              <ul className="mt-2 space-y-1">
                {category.items.map((item) => (
                  <li
                    key={item.name}
                    className="flex items-baseline justify-between gap-2 text-[11px]"
                  >
                    <span>{item.name}</span>
                    <span className="shrink-0 font-mono text-[9px] text-ink-faint">
                      {item.years}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DocSection>
    </div>
  );
}
