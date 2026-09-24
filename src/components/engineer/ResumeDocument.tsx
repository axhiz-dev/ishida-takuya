import type { ReactNode } from "react";
import { profile } from "@/content";
import {
  engineerCareer,
  engineerHero,
  engineerLinks,
  engineerNow,
  engineerSideWorks,
  engineerSkills,
  engineerSummary,
  engineerTechTopics,
  type EngineerCareerEntry,
} from "@/content/engineer";
import { formatDate, formatDotPeriod, withEngineeringYears } from "@/lib/derive";

/**
 * PDF 出力（window.print）専用の職務経歴書。
 * 画面には出さず、印刷のときだけ使う（外枠の data-print="only"）。
 * 画面版のデザインを変えても紙の見え方が変わらないよう、マークアップを分けてある。
 */

function DocSection({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return (
    <section className="mt-7">
      <p className="text-[9px] font-semibold tracking-[0.25em] text-accent uppercase">{eyebrow}</p>
      <h2 className="mt-0.5 text-lg font-bold tracking-tight">{title}</h2>
      <div className="mt-2 h-px w-full bg-gray-300" />
      <div className="mt-4">{children}</div>
    </section>
  );
}

function DocTags({ tech }: { tech: string[] }) {
  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {tech.map((name) => (
        <span
          key={name}
          className="inline-block rounded-sm border border-gray-300 bg-white px-1.5 text-[9px] text-ink-soft"
        >
          {name}
        </span>
      ))}
    </div>
  );
}

/**
 * 現職での取り組み。画面はカルーセルだが、紙は全件を縦に並べる。
 * 見出しは h3 にしてある（紙版の案件数を数えるテストが h4 を案件カードとして数えるため）。
 */
function DocNow() {
  const now = engineerNow;
  return (
    <>
      <div className="flex flex-wrap items-baseline gap-x-3">
        <h3 className="text-base font-bold tracking-tight">{now.company}</h3>
        <span className="font-mono text-[11px] font-semibold text-accent">{formatDotPeriod(now.period)}</span>
      </div>
      <p className="mt-2 text-[15px] leading-snug font-bold">{now.thesis.join("")}</p>
      <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">{now.description}</p>
      <p className="mt-1.5 text-[11px] text-ink-soft">
        役割：{now.role}　／　チーム：{now.team}
      </p>

      <div className="mt-3 space-y-3">
        {now.initiatives.map((initiative) => (
          <div key={initiative.title} className="rounded-md border border-gray-300 bg-white p-3" style={{ breakInside: "avoid" }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <div className="flex items-baseline gap-2">
                <h3 className="text-[12px] font-bold">{initiative.title}</h3>
                {initiative.status === "ongoing" && (
                  <span className="text-[9px] font-semibold text-[#2a6f51]">進行中</span>
                )}
              </div>
              <p className="text-[9px] text-ink-faint">
                {initiative.role} / {formatDotPeriod(initiative.period)}
              </p>
            </div>
            <dl className="mt-1.5 space-y-1 text-[11px] leading-relaxed">
              {(
                [
                  ["状況", initiative.situation],
                  ["取りに行ったこと", initiative.action],
                  [initiative.status === "ongoing" ? "現在" : "結果", initiative.outcome],
                ] as const
              ).map(([label, text]) => (
                <div key={label} className="grid grid-cols-[6.5em_1fr] gap-2">
                  <dt className="text-[10px] font-semibold text-ink-faint">{label}</dt>
                  <dd>{text}</dd>
                </div>
              ))}
            </dl>
            {initiative.tech.length > 0 && <DocTags tech={initiative.tech} />}
          </div>
        ))}
      </div>
    </>
  );
}

function DocCareerBlock({ entry }: { entry: EngineerCareerEntry }) {
  return (
    // ml-2: タイムラインのドット（-left-[7px]）がページ左端で見切れないための余白
    <div className="relative ml-2 border-l-2 border-line pb-9 pl-6 last:pb-0">
      <span className="absolute top-1 -left-[7px] size-3 rounded-full border-2 border-accent bg-white" />
      <p className="font-mono text-[11px] font-semibold tracking-wide text-accent">
        {formatDotPeriod(entry.period)}
      </p>
      <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-base font-bold tracking-tight">{entry.company}</h3>
        <span className="text-[10px] text-ink-faint">{entry.employmentType}</span>
      </div>
      <p className="mt-0.5 text-[12px] font-medium text-ink-soft">{entry.role}</p>
      {entry.summary && (
        <p className="mt-1.5 text-[12px] leading-relaxed text-ink-soft">{entry.summary}</p>
      )}
      {entry.tech && entry.tech.length > 0 && <DocTags tech={entry.tech} />}
      {entry.seeAlso && (
        <p className="mt-1.5 text-[11px] text-ink-faint">詳細は「{entry.seeAlso.label}」を参照</p>
      )}

      <div className="mt-3 space-y-3">
        {entry.projects.map((project) => (
          <div
            key={project.name}
            data-print="keep"
            className="rounded-md border border-gray-300 bg-white p-3"
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-[12px] font-bold">{project.name}</h4>
              <p className="text-[9px] text-ink-faint">
                {[project.role, project.teamSize && `チーム${project.teamSize}`]
                  .filter(Boolean)
                  .join(" / ")}
              </p>
            </div>
            <p className="mt-1.5 text-[11px] leading-relaxed text-ink-soft">{project.description}</p>
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
            {project.tech.length > 0 && <DocTags tech={project.tech} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export function ResumeDocument() {
  return (
    <div data-print="only" data-testid="resume-document" className="bg-white text-ink">
      <header>
        <p className="text-[9px] font-semibold tracking-[0.3em] text-accent uppercase">
          Curriculum Vitae
        </p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
          <div>
            {/* ページの h1 は画面版が持つので、ここは見出し要素にしない */}
            <p className="text-3xl font-bold tracking-tight">{profile.name}</p>
            <p className="mt-1.5 text-[12px] text-ink-soft">
              {profile.nameLatin} — {engineerHero.role}
            </p>
          </div>
          <ul className="space-y-0.5 text-right text-[10px] text-ink-soft">
            <li>{profile.email}</li>
            {engineerLinks.map((link) => (
              <li key={link.href}>
                {link.label}: {link.href.replace(/^https?:\/\//, "")}
              </li>
            ))}
            <li>最終更新 {formatDate(profile.updatedAt)}</li>
          </ul>
        </div>
      </header>

      <DocSection eyebrow="Summary" title="職務要約">
        <div className="space-y-2">
          {engineerSummary.map((paragraph) => (
            <p key={paragraph.slice(0, 20)} className="text-[12px] leading-relaxed text-ink-soft">
              {withEngineeringYears(paragraph, engineerCareer)}
            </p>
          ))}
        </div>
      </DocSection>

      <DocSection eyebrow="Now" title="現職での取り組み">
        <DocNow />
      </DocSection>

      <DocSection eyebrow="Career" title="職務経歴">
        {engineerCareer.map((entry) => (
          <DocCareerBlock key={entry.company + entry.period.from} entry={entry} />
        ))}
      </DocSection>

      <DocSection eyebrow="Side Works" title="副業・業務委託">
        {engineerSideWorks.map((entry) => (
          <DocCareerBlock key={entry.company + entry.period.from} entry={entry} />
        ))}
      </DocSection>

      <DocSection eyebrow="Tech Topics" title="技術トピック">
        <div className="space-y-3">
          {engineerTechTopics.map((topic) => (
            <div key={topic.title} className="rounded-md border border-gray-300 bg-white p-3" style={{ breakInside: "avoid" }}>
              <p className="text-[9px] text-ink-faint">
                {topic.source} ・ {formatDotPeriod(topic.period)}
              </p>
              <h3 className="mt-0.5 text-[12px] font-bold">{topic.title}</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-ink-soft">{topic.summary}</p>
              {topic.tech.length > 0 && <DocTags tech={topic.tech} />}
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection eyebrow="Skills" title="スキル">
        <div className="grid grid-cols-2 gap-3">
          {engineerSkills.map((category) => (
            <div
              key={category.title}
              data-print="keep"
              className="rounded-md border border-gray-300 bg-white p-3"
            >
              <h3 className="text-[12px] font-bold">{category.title}</h3>
              <ul className="mt-2 space-y-1">
                {category.skills.map((skill) => (
                  <li key={skill.name} className="flex items-baseline justify-between gap-2 text-[11px]">
                    <span>{skill.name}</span>
                    <span className="shrink-0 font-mono text-[9px] text-ink-faint">{skill.years}</span>
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
