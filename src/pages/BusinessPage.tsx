import Reveal from "../components/Reveal";
import Section from "../components/Section";
import SiteFooter from "../components/SiteFooter";
import SiteHeader from "../components/SiteHeader";
import { CONSTANTS } from "../data/constants";
import { profile } from "../data/profile";
import { caseStudies, personalNotes, serviceAreas } from "../data/projects";

const stats = [
  { value: CONSTANTS.yearsOfExperience, label: "エンジニア経験" },
  { value: CONSTANTS.projectCount, label: "携わったプロジェクト" },
  { value: CONSTANTS.pmProjectCount, label: "責任者として完遂" },
  { value: CONSTANTS.salesYears, label: "法人営業の経験" },
];

export default function BusinessPage() {
  return (
    <>
      <SiteHeader current="business" />
      <main className="mx-auto max-w-4xl px-6 pt-16 pb-10">
        {/* ヒーロー */}
        <Reveal>
          <header className="max-w-2xl">
            <p className="text-[11px] font-semibold tracking-[0.3em] text-accent uppercase">
              {profile.nameEn}
            </p>
            <h1 className="mt-3 text-3xl font-bold leading-snug tracking-tight sm:text-4xl">
              {profile.bizTagline}
            </h1>
            <p className="mt-5 text-sm leading-relaxed text-ink-soft">
              {profile.nameJa}と申します。Webサービスの開発を専門とするエンジニアです。
              前職では法人営業として3年間お客様と向き合っていたので、専門用語を使わずに、
              ビジネスの言葉で課題からご一緒できます。
            </p>
          </header>
        </Reveal>

        {/* 数字で信頼 */}
        <Reveal className="mt-12">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-white p-5 text-center">
                <dd className="text-2xl font-bold tracking-tight text-accent">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-[11px] text-ink-faint">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </Reveal>

        {/* 実績事例 */}
        <Section eyebrow="Case Studies" title="これまでの実績">
          <p className="-mt-2 mb-6 text-sm text-ink-soft">
            守秘義務の範囲で、業種と成果ベースでご紹介します。
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {caseStudies.map((caseStudy) => (
              <Reveal key={caseStudy.title}>
                <article className="flex h-full flex-col rounded-md border border-line bg-white p-6">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-ink-faint uppercase">
                    {caseStudy.clientType}
                  </p>
                  <h3 className="mt-2 text-base font-bold leading-snug tracking-tight">
                    {caseStudy.title}
                  </h3>
                  {caseStudy.metric && (
                    <p className="mt-4 border-l-2 border-accent pl-3">
                      <span className="block text-xl font-bold text-accent">
                        {caseStudy.metric.value}
                      </span>
                      <span className="text-[11px] text-ink-faint">
                        {caseStudy.metric.label}
                      </span>
                    </p>
                  )}
                  <dl className="mt-4 space-y-3 text-[13px] leading-relaxed">
                    {caseStudy.problem !== "—" && (
                      <div>
                        <dt className="text-[11px] font-semibold text-ink-faint">
                          課題
                        </dt>
                        <dd className="mt-0.5 text-ink-soft">
                          {caseStudy.problem}
                        </dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-[11px] font-semibold text-ink-faint">
                        やったこと
                      </dt>
                      <dd className="mt-0.5 text-ink-soft">{caseStudy.action}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold text-ink-faint">
                        成果
                      </dt>
                      <dd className="mt-0.5 text-ink-soft">{caseStudy.result}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* できること */}
        <Section eyebrow="Services" title="お力になれること">
          <div className="grid gap-4 sm:grid-cols-2">
            {serviceAreas.map((area, index) => (
              <Reveal key={area.title}>
                <div className="h-full rounded-md border border-line bg-white p-6">
                  <p className="font-mono text-xs font-semibold text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 text-base font-bold tracking-tight">
                    {area.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-soft">
                    {area.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* 人となり */}
        <Section eyebrow="About Me" title="人となり">
          <div className="space-y-6">
            {personalNotes.map((note) => (
              <Reveal key={note.heading}>
                <div className="border-l-2 border-line pl-5">
                  <h3 className="text-sm font-bold">{note.heading}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-ink-soft">
                    {note.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* CTA */}
        <Reveal className="mt-20">
          <div className="rounded-md bg-accent px-8 py-10 text-center text-white">
            <h2 className="text-xl font-bold tracking-tight">
              まずはお気軽にご相談ください
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/80">
              「こんなことで困っている」という段階のご相談も歓迎です。
              できること・できないことを率直にお答えします。
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-6 inline-block rounded-full bg-white px-8 py-3 text-sm font-semibold text-accent transition hover:opacity-90"
            >
              メールで相談する
            </a>
            <p className="mt-4 text-xs text-white/60">{profile.email}</p>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
