import CountUp from "../components/CountUp";
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
      <main className="mx-auto max-w-5xl px-6 pb-16">
        {/* ヒーロー */}
        <header className="bg-grid -mx-6 px-6 pb-14 pt-16 sm:pb-20 sm:pt-24">
          <p className="intro intro-1 text-[11px] font-semibold tracking-[0.35em] text-accent uppercase">
            {profile.nameEn}
          </p>
          <h1 className="mt-5 max-w-3xl text-3xl font-bold leading-snug tracking-tight sm:text-5xl sm:leading-tight">
            <span className="intro intro-2 block">業務の困りごとを、</span>
            <span className="intro intro-3 block">
              <span className="text-accent">Webとシステムの力</span>で
            </span>
            <span className="intro intro-4 block">解決するエンジニアです。</span>
          </h1>
          <p className="intro intro-5 mt-7 max-w-xl text-sm leading-relaxed text-ink-soft">
            {profile.nameJa}と申します。Webサービスの開発を専門とするエンジニアです。
            前職では法人営業として3年間お客様と向き合っていたので、専門用語を使わずに、
            ビジネスの言葉で課題からご一緒できます。
          </p>
        </header>

        {/* 数字で信頼 */}
        <Reveal stagger className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 text-center">
              <dd className="text-3xl font-bold tracking-tight text-accent">
                <CountUp value={stat.value} />
              </dd>
              <dt className="mt-1.5 text-[11px] text-ink-faint">{stat.label}</dt>
            </div>
          ))}
        </Reveal>

        {/* 実績事例 */}
        <Section number="01" eyebrow="Case Studies" title="これまでの実績">
          <p className="-mt-3 mb-8 text-sm text-ink-soft">
            守秘義務の範囲で、業種と成果ベースでご紹介します。
          </p>
          <div className="grid gap-5 sm:grid-cols-2">
            {caseStudies.map((caseStudy) => (
              <Reveal key={caseStudy.title}>
                <article className="card-hover card-bar flex h-full flex-col rounded-md border border-line bg-white p-7">
                  <p className="text-[10px] font-semibold tracking-[0.15em] text-ink-faint uppercase">
                    {caseStudy.clientType}
                  </p>
                  <h3 className="mt-2 text-lg font-bold leading-snug tracking-tight">
                    {caseStudy.title}
                  </h3>
                  {caseStudy.metric && (
                    <p className="mt-5 border-l-2 border-accent pl-4">
                      <span className="block text-3xl font-bold tracking-tight text-accent">
                        {caseStudy.metric.value}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-ink-faint">
                        {caseStudy.metric.label}
                      </span>
                    </p>
                  )}
                  <dl className="mt-5 space-y-3.5 text-[13px] leading-relaxed">
                    {caseStudy.problem !== "—" && (
                      <div>
                        <dt className="text-[11px] font-semibold tracking-wide text-accent">
                          課題
                        </dt>
                        <dd className="mt-1 text-ink-soft">{caseStudy.problem}</dd>
                      </div>
                    )}
                    <div>
                      <dt className="text-[11px] font-semibold tracking-wide text-accent">
                        やったこと
                      </dt>
                      <dd className="mt-1 text-ink-soft">{caseStudy.action}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] font-semibold tracking-wide text-accent">
                        成果
                      </dt>
                      <dd className="mt-1 text-ink-soft">{caseStudy.result}</dd>
                    </div>
                  </dl>
                </article>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* できること */}
        <Section number="02" eyebrow="Services" title="お力になれること">
          <div className="grid gap-5 sm:grid-cols-2">
            {serviceAreas.map((area, index) => (
              <Reveal key={area.title}>
                <div className="card-hover h-full rounded-md border border-line bg-white p-7">
                  <p className="font-mono text-2xl font-bold text-accent/25">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-base font-bold tracking-tight">
                    {area.title}
                  </h3>
                  <p className="mt-2.5 text-[13px] leading-relaxed text-ink-soft">
                    {area.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>

        {/* 人となり */}
        <Section number="03" eyebrow="About Me" title="人となり">
          <Reveal stagger className="space-y-8">
            {personalNotes.map((note) => (
              <div key={note.heading} className="group border-l-2 border-line pl-6 transition-colors hover:border-accent">
                <h3 className="text-base font-bold">{note.heading}</h3>
                <p className="mt-2 max-w-2xl text-[13px] leading-relaxed text-ink-soft">
                  {note.body}
                </p>
              </div>
            ))}
          </Reveal>
        </Section>

        {/* CTA */}
        <Reveal className="mt-24">
          <div className="relative overflow-hidden rounded-md bg-accent px-8 py-14 text-center text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.14),transparent_55%)]"
            />
            <h2 className="relative text-2xl font-bold tracking-tight">
              まずはお気軽にご相談ください
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/80">
              「こんなことで困っている」という段階のご相談も歓迎です。
              できること・できないことを率直にお答えします。
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="relative mt-8 inline-block rounded-full bg-white px-9 py-3.5 text-sm font-semibold text-accent transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              メールで相談する
            </a>
            <p className="relative mt-5 text-xs text-white/60">{profile.email}</p>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </>
  );
}
