"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { profile } from "@/content";
import {
  engineerCareer,
  engineerHero,
  engineerLinks,
  engineerSideWorks,
  engineerSkills,
  engineerSummary,
  engineerTechTopics,
  type CareerProject,
  type EngineerCareerEntry,
} from "@/content/engineer";
import { FEATURES } from "@/config/site";
import { formatDotPeriod, skillLevel, withEngineeringYears } from "@/lib/derive";
import { NowSection } from "./NowSection";
import { PrintButton } from "./PrintButton";
import { Reveal } from "./Reveal";
import { Section } from "./Section";
import { SiteHeader } from "./SiteHeader";
import { Tag } from "./Tag";

/* ===== 技術タグのフィルタ ===== */

const techIncludes = (project: CareerProject, ...subs: string[]) =>
  project.tech.some((t) => subs.some((s) => t.toLowerCase().includes(s)));

const techHasWord = (project: CareerProject, word: string) =>
  project.tech.some((t) =>
    t.split(/[^A-Za-z#+.]+/).some((token) => token.toLowerCase() === word),
  );

type Filter = {
  id: string;
  label: string;
  match: (project: CareerProject) => boolean;
};

/** フィルタのチップ。**並びを変えたい・増やしたいときはここを触る。** */
const FILTERS: Filter[] = [
  { id: "react", label: "React / Next.js", match: (p) => techIncludes(p, "react", "next.js") },
  { id: "vue", label: "Vue / Nuxt", match: (p) => techIncludes(p, "vue", "nuxt") },
  { id: "node", label: "TypeScript / Node.js", match: (p) => techIncludes(p, "typescript", "node", "nestjs") },
  { id: "go", label: "Go", match: (p) => techHasWord(p, "go") },
  { id: "python", label: "Python", match: (p) => techIncludes(p, "python", "fastapi") },
  { id: "aws", label: "AWS", match: (p) => techIncludes(p, "aws", "ecs", "lambda", "dynamodb", "cognito", "s3") },
  { id: "gcp", label: "GCP", match: (p) => techHasWord(p, "gcp") },
  { id: "ai", label: "AI / LLM", match: (p) => techIncludes(p, "openai", "llm") || p.name.includes("AI") },
  { id: "pm", label: "PM経験", match: (p) => (p.role ?? "").includes("PM") },
];

const allProjects = [...engineerCareer, ...engineerSideWorks].flatMap((entry) => entry.projects);

/* ===== プロジェクトカード（開閉式） ===== */

function ProjectCard({
  project,
  open,
  onToggle,
}: {
  project: CareerProject;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      data-testid="project-card"
      className="card-bar rounded-md border border-line bg-white transition-colors hover:border-accent/60"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        data-multiline
        className="flex w-full items-start justify-between gap-3 p-5 text-left"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h4 className="text-sm font-bold">{project.name}</h4>
            <p className="text-[11px] text-ink-faint">
              {[project.role, project.teamSize && `チーム${project.teamSize}`]
                .filter(Boolean)
                .join(" / ")}
            </p>
          </div>
          <p className={`mt-2 text-[13px] leading-relaxed text-ink-soft ${open ? "" : "line-clamp-2"}`}>
            {project.description}
          </p>
        </div>
        <span
          aria-hidden
          className={`mt-0.5 shrink-0 text-ink-faint transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </span>
      </button>

      <div className={`acc ${open ? "acc-open" : ""}`}>
        <div>
          {project.highlights.length > 0 && (
            <ul className="space-y-1.5 px-5 pb-1">
              {project.highlights.map((highlight) => (
                <li key={highlight} className="flex gap-2 text-[13px] leading-relaxed">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-accent" />
                  {highlight}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {project.tech.length > 0 && (
        <div className="flex flex-wrap gap-1.5 px-5 pt-2 pb-5">
          {project.tech.map((tech) => (
            <Tag key={tech}>{tech}</Tag>
          ))}
        </div>
      )}
    </div>
  );
}

/* ===== 会社ブロック ===== */

function CareerBlock({
  entry,
  activeFilter,
  openSet,
  onToggle,
  isLast,
}: {
  entry: EngineerCareerEntry;
  activeFilter: Filter | null;
  openSet: Set<string>;
  onToggle: (name: string) => void;
  /** Reveal で包んでいるので last: が効かない。最後の会社かどうかは親から渡す */
  isLast: boolean;
}) {
  const visibleProjects = activeFilter ? entry.projects.filter(activeFilter.match) : entry.projects;
  // 詳細を別の節に置いた会社は、案件カードを持たないので絞り込みで薄くしない
  const dimmed = activeFilter !== null && visibleProjects.length === 0 && !entry.seeAlso;

  return (
    <Reveal>
      <div
        data-testid="career-entry"
        className={`relative pl-8 transition-opacity duration-300 ${isLast ? "" : "pb-14"} ${dimmed ? "opacity-50" : ""}`}
      >
        <span className="tl-line absolute top-1.5 bottom-0 left-0 w-px bg-accent/25" />
        <span className="absolute top-1.5 -left-[5.5px] size-3 rounded-full border-2 border-accent bg-paper" />

        <p className="font-mono text-xs font-semibold tracking-wide text-accent">
          {formatDotPeriod(entry.period)}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-xl font-bold tracking-tight">{entry.company}</h3>
          <span className="text-xs text-ink-faint">{entry.employmentType}</span>
          {activeFilter && !dimmed && !entry.seeAlso && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
              {visibleProjects.length}件
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm font-medium text-ink-soft">{entry.role}</p>
        {!dimmed && entry.summary && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">{entry.summary}</p>
        )}
        {entry.tech && entry.tech.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {entry.tech.map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
        )}
        {entry.seeAlso && (
          <a
            href={entry.seeAlso.href}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-accent bg-white px-3 py-1 text-xs text-accent transition-colors hover:bg-accent hover:text-white"
          >
            詳細は「{entry.seeAlso.label}」へ ↑
          </a>
        )}

        {!dimmed && visibleProjects.length > 0 && (
          <div className="mt-5 space-y-4">
            {visibleProjects.map((project) => (
              <ProjectCard
                key={project.name}
                project={project}
                open={openSet.has(project.name)}
                onToggle={() => onToggle(project.name)}
              />
            ))}
          </div>
        )}
        {dimmed && (
          <p className="mt-2 text-xs text-ink-faint">
            「{activeFilter?.label}」に該当する案件はありません
          </p>
        )}
      </div>
    </Reveal>
  );
}

/* ===== 画面全体 ===== */

/** 職務経歴の画面版。紙は ResumeDocument が別に持つ。 */
export function EngineerScreen() {
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const activeFilter = FILTERS.find((f) => f.id === activeFilterId) ?? null;
  const filterCounts = useMemo(
    () => Object.fromEntries(FILTERS.map((f) => [f.id, allProjects.filter(f.match).length])),
    [],
  );
  // 該当する案件がないチップは押しても何も出ないので並べない
  const visibleFilters = FILTERS.filter((f) => (filterCounts[f.id] ?? 0) > 0);
  const allOpen = openSet.size >= allProjects.length;

  const toggleProject = (name: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const selectFilter = (id: string | null) => {
    setActiveFilterId(id);
    const filter = FILTERS.find((f) => f.id === id);
    // 絞り込んだ案件は詳細まで見たいはずなので、まとめて開く
    if (filter) setOpenSet(new Set(allProjects.filter(filter.match).map((p) => p.name)));
  };

  const chipClass = (active: boolean) =>
    `rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
      active
        ? "border-accent bg-accent text-white"
        : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
    }`;

  return (
    <div data-print="hide">
      <SiteHeader />
      <main id="main" className="mx-auto max-w-5xl px-6 pb-16">
        {/* ヘッダ */}
        <header className="bg-grid -mx-6 px-6 pt-14 pb-12 sm:pt-20 sm:pb-16">
          <p className="intro intro-1 text-[11px] font-semibold tracking-[0.35em] text-accent uppercase">
            Curriculum Vitae
          </p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-8">
            <div>
              <h1 className="intro intro-2 text-5xl font-bold tracking-tight sm:text-6xl">
                {profile.name}
              </h1>
              <p className="intro intro-3 mt-4 text-sm text-ink-soft">
                {profile.nameLatin} — {engineerHero.role}
              </p>
            </div>
            <ul className="intro intro-4 space-y-1.5 text-xs text-ink-soft sm:text-right">
              <li>
                <a href={`mailto:${profile.email}`} className="link-underline hover:text-accent">
                  {profile.email}
                </a>
              </li>
              {engineerLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noreferrer" className="link-underline hover:text-accent">
                    {link.label} ↗
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </header>

        <Section id="summary" number="01" eyebrow="Summary" title="職務要約">
          <Reveal stagger className="max-w-3xl space-y-4">
            {engineerSummary.map((paragraph) => (
              <p key={paragraph.slice(0, 20)} className="text-sm leading-loose text-ink-soft">
                {withEngineeringYears(paragraph, engineerCareer)}
              </p>
            ))}
          </Reveal>
        </Section>

        <Section id="now" number="02" eyebrow="Now @ HRBrain" title="現職での取り組み">
          <NowSection />
        </Section>

        <Section id="career" number="03" eyebrow="Career" title="職務経歴">
          {/* フィルタ。スクロールしても上に張り付く */}
          <div
            role="toolbar"
            aria-label="技術で案件を絞り込む"
            className="sticky top-[52px] z-20 -mx-6 mb-10 border-b border-line bg-paper/90 px-6 py-3 backdrop-blur-md"
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                aria-pressed={activeFilterId === null}
                onClick={() => selectFilter(null)}
                className={chipClass(activeFilterId === null)}
              >
                すべて {allProjects.length}
              </button>
              {visibleFilters.map((filter) => {
                const active = activeFilterId === filter.id;
                return (
                  <button
                    key={filter.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => selectFilter(active ? null : filter.id)}
                    className={chipClass(active)}
                  >
                    {filter.label} <span className={active ? "text-white/80" : "text-ink-faint"}>{filterCounts[filter.id]}</span>
                  </button>
                );
              })}
              <span className="mx-1 hidden h-4 w-px bg-line sm:inline-block" />
              <button
                type="button"
                onClick={() => setOpenSet(allOpen ? new Set() : new Set(allProjects.map((p) => p.name)))}
                className="text-xs text-ink-faint underline-offset-2 hover:text-accent hover:underline"
              >
                {allOpen ? "すべて閉じる" : "すべて開く"}
              </button>
            </div>
          </div>

          {engineerCareer.map((entry, i) => (
            <CareerBlock
              isLast={i === engineerCareer.length - 1}
              key={entry.company + entry.period.from}
              entry={entry}
              activeFilter={activeFilter}
              openSet={openSet}
              onToggle={toggleProject}
            />
          ))}
        </Section>

        <Section id="side-works" number="04" eyebrow="Side Works" title="副業・業務委託">
          {engineerSideWorks.map((entry, i) => (
            <CareerBlock
              isLast={i === engineerSideWorks.length - 1}
              key={entry.company + entry.period.from}
              entry={entry}
              activeFilter={activeFilter}
              openSet={openSet}
              onToggle={toggleProject}
            />
          ))}
        </Section>

        <Section id="topics" number="05" eyebrow="Tech Topics" title="技術トピック">
          <div className="grid gap-3.5 md:grid-cols-2">
            {engineerTechTopics.map((topic) => {
              const body = (
                <>
                  <p className="text-[10px] font-bold tracking-[0.15em] text-ink-faint uppercase">
                    {topic.source} ・ {formatDotPeriod(topic.period)}
                  </p>
                  <h3 className="mt-1.5 text-[15px] leading-relaxed font-bold">{topic.title}</h3>
                  <p className="mt-2 flex-1 text-[13px] leading-[1.8] text-ink-soft">{topic.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {topic.tech.map((tech) => (
                      <Tag key={tech}>{tech}</Tag>
                    ))}
                  </div>
                  {topic.href && <span className="mt-3 text-xs font-semibold text-accent">詳しく →</span>}
                </>
              );
              const cardClass = "flex h-full flex-col rounded-md border border-line bg-white p-5";
              return (
                <Reveal key={topic.title}>
                  {topic.href ? (
                    <a href={topic.href} target="_blank" rel="noreferrer" className={`${cardClass} card-hover`}>
                      {body}
                    </a>
                  ) : (
                    <article className={cardClass}>{body}</article>
                  )}
                </Reveal>
              );
            })}
          </div>
        </Section>

        <Section id="skills" number="06" eyebrow="Skills" title="スキル">
          <div className="grid gap-4 sm:grid-cols-2">
            {engineerSkills.map((category) => (
              <Reveal key={category.title}>
                <div className="card-hover h-full rounded-md border border-line bg-white p-6">
                  <h3 className="text-sm font-bold">{category.title}</h3>
                  <ul className="mt-4 space-y-3">
                    {category.skills.map((skill) => (
                      <li key={skill.name} data-testid="skill-bar" className="text-[13px]">
                        <div className="flex items-baseline justify-between gap-2">
                          <span>{skill.name}</span>
                          <span className="shrink-0 font-mono text-[11px] text-ink-faint">{skill.years}</span>
                        </div>
                        <div className="mt-1.5 h-1 rounded-full bg-accent-soft">
                          <div
                            className="skill-bar h-full rounded-full bg-accent/70"
                            style={{ "--w": `${skillLevel(skill.years)}%` } as CSSProperties}
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {FEATURES.pdfExport && (
          <Reveal className="mt-24">
            <div className="rounded-md border border-line bg-white px-6 py-10 text-center">
              <p className="text-sm font-bold">このページの内容は、そのまま職務経歴書として保存できます</p>
              <p className="mt-2 text-xs text-ink-soft">
                A4 の書類の体裁で出力されます。絞り込みの状態にかかわらず、全案件が載ります。
              </p>
              <div className="mt-6">
                <PrintButton variant="footer" />
              </div>
            </div>
          </Reveal>
        )}
      </main>

      <footer className="mt-20 border-t border-line">
        <div className="mx-auto max-w-5xl px-6 py-8 text-xs text-ink-faint">
          © {new Date().getFullYear()} {profile.name} ({profile.nameLatin})
        </div>
      </footer>

    </div>
  );
}
