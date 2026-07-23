import { useMemo, useState } from "react";
import CountUp from "../components/CountUp";
import PrintButton from "../components/PrintButton";
import ResumeDocument from "../components/resume/ResumeDocument";
import Reveal from "../components/Reveal";
import Section from "../components/Section";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Tag from "../components/Tag";
import { careers, sideWorks } from "../data/career";
import { CONSTANTS } from "../data/constants";
import { profile } from "../data/profile";
import { skillCategories } from "../data/skills";
import type { Career, CareerProject } from "../data/types";

/* ===== 技術タグフィルタ ===== */

const techIncludes = (project: CareerProject, ...subs: string[]) =>
  project.tech.some((t) => subs.some((s) => t.toLowerCase().includes(s)));

const techHasWord = (project: CareerProject, word: string) =>
  project.tech.some((t) =>
    t.split(/[^A-Za-z#+.]+/).some((token) => token.toLowerCase() === word),
  );

interface Filter {
  id: string;
  label: string;
  match: (project: CareerProject) => boolean;
}

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

const allProjects = [...careers, ...sideWorks].flatMap((career) => career.projects);

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
    <div className="card-bar rounded-md border border-line bg-white transition-colors hover:border-accent/60">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
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
          <p
            className={`mt-2 text-[13px] leading-relaxed text-ink-soft ${open ? "" : "line-clamp-2"}`}
          >
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
        <div className="flex flex-wrap gap-1.5 px-5 pb-5 pt-2">
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
  career,
  activeFilter,
  openSet,
  onToggle,
}: {
  career: Career;
  activeFilter: Filter | null;
  openSet: Set<string>;
  onToggle: (name: string) => void;
}) {
  const visibleProjects = activeFilter
    ? career.projects.filter(activeFilter.match)
    : career.projects;
  const dimmed = activeFilter !== null && visibleProjects.length === 0;

  return (
    <Reveal>
      <div
        className={`relative pl-8 pb-12 transition-opacity duration-300 last:pb-0 ${
          dimmed ? "opacity-35" : ""
        }`}
      >
        <span className="tl-line absolute bottom-0 left-0 top-1.5 w-px bg-accent/25" />
        <span className="absolute -left-[5.5px] top-1.5 size-3 rounded-full border-2 border-accent bg-paper" />

        <p className="font-mono text-xs font-semibold tracking-wide text-accent">
          {career.period}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-xl font-bold tracking-tight">{career.company}</h3>
          <span className="text-xs text-ink-faint">{career.employmentType}</span>
          {activeFilter && !dimmed && (
            <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
              {visibleProjects.length}件
            </span>
          )}
        </div>
        <p className="mt-0.5 text-sm font-medium text-ink-soft">{career.role}</p>
        {!dimmed && career.summary && (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
            {career.summary}
          </p>
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

/* ===== スキルバー ===== */

function yearsToWidth(years: string): string {
  if (years.includes("5年")) return "100%";
  if (years.includes("3年")) return "72%";
  if (years.includes("1年以上")) return "46%";
  return "26%";
}

/* ===== ページ本体 ===== */

const stats = [
  { value: CONSTANTS.yearsOfExperience, label: "エンジニア経験" },
  { value: CONSTANTS.projectCount, label: "携わったプロジェクト" },
  { value: CONSTANTS.pmProjectCount, label: "PMとして完遂" },
  { value: CONSTANTS.salesYears, label: "法人営業の経験" },
];

export default function EngineerPage() {
  const [activeFilterId, setActiveFilterId] = useState<string | null>(null);
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());

  const activeFilter = FILTERS.find((f) => f.id === activeFilterId) ?? null;
  const filterCounts = useMemo(
    () =>
      Object.fromEntries(
        FILTERS.map((filter) => [filter.id, allProjects.filter(filter.match).length]),
      ),
    [],
  );
  const allOpen = openSet.size >= allProjects.length;

  const toggleProject = (name: string) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const toggleAll = () => {
    setOpenSet(allOpen ? new Set() : new Set(allProjects.map((p) => p.name)));
  };

  const selectFilter = (id: string | null) => {
    setActiveFilterId(id);
    if (id) {
      // 絞り込んだ案件は詳細まで見たいはずなので自動で開く
      const filter = FILTERS.find((f) => f.id === id);
      if (filter) {
        setOpenSet(new Set(allProjects.filter(filter.match).map((p) => p.name)));
      }
    }
  };

  return (
    <>
      {/* ===== 画面表示 ===== */}
      <div className="print-hidden">
        <SiteHeader current="engineer" />
        <main className="mx-auto max-w-5xl px-6 pb-16">
          {/* ヒーロー */}
          <header className="bg-grid -mx-6 px-6 pb-12 pt-14 sm:pb-16 sm:pt-20">
            <p className="intro intro-1 text-[11px] font-semibold tracking-[0.35em] text-accent uppercase">
              Curriculum Vitae
            </p>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-8">
              <div>
                <h1 className="intro intro-2 text-5xl font-bold tracking-tight sm:text-6xl">
                  {profile.nameJa}
                </h1>
                <p className="intro intro-3 mt-4 text-sm text-ink-soft">
                  {profile.nameEn} — {profile.title}
                </p>
              </div>
              <ul className="intro intro-4 space-y-1.5 text-xs text-ink-soft sm:text-right">
                <li>
                  <a href={`mailto:${profile.email}`} className="link-underline hover:text-accent">
                    {profile.email}
                  </a>
                </li>
                {profile.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="link-underline hover:text-accent"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <dl className="intro intro-5 mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.label} className="bg-white/90 p-5">
                  <dd className="text-3xl font-bold tracking-tight text-accent">
                    <CountUp value={stat.value} />
                  </dd>
                  <dt className="mt-1 text-[11px] text-ink-faint">{stat.label}</dt>
                </div>
              ))}
            </dl>
          </header>

          {/* 職務要約 */}
          <Section number="01" eyebrow="Summary" title="職務要約">
            <Reveal stagger className="max-w-3xl space-y-4">
              {profile.summary.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 20)}
                  className="text-sm leading-loose text-ink-soft"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </Section>

          {/* 職務経歴 */}
          <Section number="02" eyebrow="Career" title="職務経歴">
            {/* フィルタチップ */}
            <Reveal className="sticky top-[52px] z-20 -mx-6 mb-10 border-b border-line bg-paper/90 px-6 py-3 backdrop-blur-md">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => selectFilter(null)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    activeFilterId === null
                      ? "border-accent bg-accent text-white"
                      : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
                  }`}
                >
                  すべて {allProjects.length}
                </button>
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() =>
                      selectFilter(activeFilterId === filter.id ? null : filter.id)
                    }
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      activeFilterId === filter.id
                        ? "border-accent bg-accent text-white"
                        : "border-line bg-white text-ink-soft hover:border-accent hover:text-accent"
                    }`}
                  >
                    {filter.label}{" "}
                    <span className={activeFilterId === filter.id ? "text-white/70" : "text-ink-faint"}>
                      {filterCounts[filter.id]}
                    </span>
                  </button>
                ))}
                <span className="mx-1 hidden h-4 w-px bg-line sm:inline-block" />
                <button
                  type="button"
                  onClick={toggleAll}
                  className="text-xs text-ink-faint underline-offset-2 hover:text-accent hover:underline"
                >
                  {allOpen ? "すべて閉じる" : "すべて開く"}
                </button>
              </div>
            </Reveal>

            <div>
              {careers.map((career) => (
                <CareerBlock
                  key={career.company + career.period}
                  career={career}
                  activeFilter={activeFilter}
                  openSet={openSet}
                  onToggle={toggleProject}
                />
              ))}
            </div>
          </Section>

          {/* 副業・業務委託 */}
          <Section number="03" eyebrow="Side Works" title="副業・業務委託">
            <div>
              {sideWorks.map((career) => (
                <CareerBlock
                  key={career.company + career.period}
                  career={career}
                  activeFilter={activeFilter}
                  openSet={openSet}
                  onToggle={toggleProject}
                />
              ))}
            </div>
          </Section>

          {/* スキル */}
          <Section number="04" eyebrow="Skills" title="スキル">
            <div className="grid gap-4 sm:grid-cols-2">
              {skillCategories.map((category) => (
                <Reveal key={category.category}>
                  <div className="card-hover h-full rounded-md border border-line bg-white p-6">
                    <h3 className="text-sm font-bold">{category.category}</h3>
                    <ul className="mt-4 space-y-3">
                      {category.items.map((item) => (
                        <li key={item.name} className="text-[13px]">
                          <div className="flex items-baseline justify-between gap-2">
                            <span>{item.name}</span>
                            <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                              {item.years}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1 rounded-full bg-accent-soft">
                            <div
                              className="skill-bar h-full rounded-full bg-accent/70"
                              style={{ "--w": yearsToWidth(item.years) } as React.CSSProperties}
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
        </main>
        <SiteFooter />
        <PrintButton />
      </div>

      {/* ===== PDF出力（印刷）専用の文書レイアウト ===== */}
      <div className="hidden print:block">
        <ResumeDocument />
      </div>
    </>
  );
}
