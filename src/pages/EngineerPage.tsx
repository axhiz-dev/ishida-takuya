import PrintButton from "../components/PrintButton";
import Reveal from "../components/Reveal";
import Section from "../components/Section";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import Tag from "../components/Tag";
import { careers, sideWorks } from "../data/career";
import { CONSTANTS } from "../data/constants";
import { profile } from "../data/profile";
import { skillCategories } from "../data/skills";
import type { Career } from "../data/types";

function CareerBlock({ career }: { career: Career }) {
  return (
    <Reveal>
      <div className="relative border-l-2 border-line pl-6 pb-10 last:pb-0 print:pb-4">
        <span className="absolute -left-[7px] top-1 size-3 rounded-full border-2 border-accent bg-paper" />
        <p className="font-mono text-xs font-semibold tracking-wide text-accent">
          {career.period}
        </p>
        <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-bold tracking-tight print:text-base">
            {career.company}
          </h3>
          <span className="text-xs text-ink-faint">{career.employmentType}</span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-ink-soft">{career.role}</p>
        {career.summary && (
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            {career.summary}
          </p>
        )}

        <div className="mt-4 space-y-5 print:space-y-3">
          {career.projects.map((project) => (
            <div
              key={project.name}
              className="print-avoid-break rounded-md border border-line bg-white p-5 print:border-gray-300 print:p-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <h4 className="text-sm font-bold">{project.name}</h4>
                <p className="text-[11px] text-ink-faint">
                  {[project.role, project.teamSize && `チーム${project.teamSize}`]
                    .filter(Boolean)
                    .join(" / ")}
                </p>
              </div>
              <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                {project.description}
              </p>
              {project.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {project.highlights.map((highlight) => (
                    <li
                      key={highlight}
                      className="flex gap-2 text-[13px] leading-relaxed"
                    >
                      <span className="mt-[7px] size-1 shrink-0 rounded-full bg-accent" />
                      {highlight}
                    </li>
                  ))}
                </ul>
              )}
              {project.tech.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <Tag key={tech}>{tech}</Tag>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export default function EngineerPage() {
  return (
    <>
      <SiteHeader current="engineer" />
      <main className="mx-auto max-w-4xl px-6 pt-14 pb-10 print:max-w-none print:px-0 print:pt-0">
        {/* ヘッダー */}
        <Reveal>
          <header>
            <p className="text-[11px] font-semibold tracking-[0.3em] text-accent uppercase">
              Curriculum Vitae
            </p>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-bold tracking-tight print:text-3xl">
                  {profile.nameJa}
                </h1>
                <p className="mt-2 text-sm text-ink-soft">
                  {profile.nameEn} — {profile.title}
                </p>
              </div>
              <ul className="space-y-1 text-right text-xs text-ink-soft">
                <li>
                  <a
                    href={`mailto:${profile.email}`}
                    className="hover:text-accent"
                  >
                    {profile.email}
                  </a>
                </li>
                {profile.links.map((link) => (
                  <li key={link.url}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-accent"
                    >
                      {link.label} ↗
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* 希望条件 */}
            <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4 print:mt-4 print:border-gray-300">
              {[
                ["希望年収（正社員）", CONSTANTS.desiredAnnualSalary],
                ["Offers 想定年収診断", CONSTANTS.offersAssessedSalary],
                ["転職スタンス", CONSTANTS.jobChangeStance],
                ["副業の稼働", CONSTANTS.sideJobAvailability],
              ].map(([label, value]) => (
                <div key={label} className="bg-white p-4 print:p-2">
                  <dt className="text-[10px] tracking-wide text-ink-faint">
                    {label}
                  </dt>
                  <dd className="mt-1 text-sm font-semibold text-ink">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </header>
        </Reveal>

        {/* 職務要約 */}
        <Section eyebrow="Summary" title="職務要約">
          <Reveal className="space-y-3">
            {profile.summary.map((paragraph) => (
              <p
                key={paragraph.slice(0, 20)}
                className="text-sm leading-relaxed text-ink-soft print:text-[12px]"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>
        </Section>

        {/* 職務経歴 */}
        <Section eyebrow="Career" title="職務経歴">
          <div>
            {careers.map((career) => (
              <CareerBlock key={career.company + career.period} career={career} />
            ))}
          </div>
        </Section>

        {/* 副業・業務委託 */}
        <Section eyebrow="Side Works" title="副業・業務委託">
          <div>
            {sideWorks.map((career) => (
              <CareerBlock key={career.company + career.period} career={career} />
            ))}
          </div>
        </Section>

        {/* スキル */}
        <Section eyebrow="Skills" title="スキル">
          <div className="grid gap-4 sm:grid-cols-2 print:grid-cols-2">
            {skillCategories.map((category) => (
              <Reveal key={category.category}>
                <div className="print-avoid-break h-full rounded-md border border-line bg-white p-5 print:border-gray-300 print:p-3">
                  <h3 className="text-sm font-bold">{category.category}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {category.items.map((item) => (
                      <li
                        key={item.name}
                        className="flex items-baseline justify-between gap-2 text-[13px]"
                      >
                        <span>{item.name}</span>
                        <span className="shrink-0 font-mono text-[11px] text-ink-faint">
                          {item.years}
                        </span>
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
    </>
  );
}
