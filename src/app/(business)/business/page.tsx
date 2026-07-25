import type { CSSProperties } from "react";
import Link from "next/link";
import {
  businessIntro,
  closingStatement,
  faqs,
  offerings,
  pricing,
  pricingNote,
  processSteps,
  profile,
  testimonials,
} from "@/content";
import { ROUTES } from "@/config/site";
import { MarkedHeading } from "@/components/common/MarkedHeading";
import { EdgeNav } from "@/components/business/EdgeNav";
import { Portrait } from "@/components/business/Portrait";
import { FeatureStack } from "@/components/business/FeatureStack";
import styles from "@/components/business/business.module.css";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

export default function BusinessPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>

      {/* ナビが浮くタイミングを測るための番兵。高さ 0 の目印。 */}
      <div id="nav-sentinel" aria-hidden="true" />

      <EdgeNav name={profile.name} email={profile.email} />

      <main id="main" className={styles.page}>
        {/* ── 宣言 ─────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={`${styles.statement} enter`} style={step(0)} data-entered="true">
              {businessIntro.statement.lines.map((line) => (
                <span key={line} className={styles.statementLine}>
                  <MarkedHeading value={{ text: line, mark: businessIntro.statement.mark }} />
                </span>
              ))}
            </h1>
            <p className={`${styles.lede} enter`} style={step(1)} data-entered="true">
              {businessIntro.lede}
            </p>
            <p className={`${styles.reassurance} enter`} style={step(2)} data-entered="true">
              {businessIntro.reassurance}
            </p>
          </div>

          <div className={`${styles.heroAside} enter`} style={step(3)} data-entered="true">
            <Portrait
              photo={profile.photo}
              name={profile.name}
              role={profile.role}
              location={profile.location}
            />
          </div>
        </section>

        {/* ── できること ↔ 証拠 ────────────────── */}
        <section className={styles.section} aria-labelledby="offerings-head">
          <h2 id="offerings-head" className={styles.sectionTitle}>
            できることと、その裏づけ
          </h2>
          <FeatureStack offerings={[...offerings]} />
        </section>

        {/* ── 進め方 ───────────────────────────── */}
        <section className={styles.section} aria-labelledby="process-head">
          <h2 id="process-head" className={styles.sectionTitle}>
            ご相談から引き渡しまで
          </h2>
          <p className={styles.sectionLede}>
            何をどの順で進めるか、何をご用意いただくかを先にお伝えします。
            進め方が見えないままお金の話になることはありません。
          </p>

          <ol className={styles.steps}>
            {processSteps.map((processStep) => (
              <li key={processStep.no} className={styles.step}>
                <p className={styles.stepNo} aria-hidden="true">
                  {processStep.no}
                </p>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{processStep.title}</h3>
                  <p>{processStep.body}</p>
                  {processStep.youProvide ? (
                    <p className={styles.stepProvide}>
                      <span className={styles.stepProvideLabel}>ご用意いただくもの</span>
                      {processStep.youProvide}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── お客様の声（T1 · 引用 + 余白に出典） ── */}
        <section className={styles.section} aria-labelledby="voices-head">
          <h2 id="voices-head" className={styles.sectionTitle}>
            ご一緒した方の言葉
          </h2>

          <div className={styles.voices}>
            {testimonials.map((voice) => (
              <figure key={voice.name} className={styles.voice}>
                <blockquote className={styles.voiceQuote}>{voice.quote}</blockquote>
                <figcaption className={styles.voiceSource}>
                  <span className={styles.voiceName}>{voice.name}</span>
                  <span>
                    {voice.role}／{voice.company}
                  </span>
                  <span className={styles.voiceContext}>{voice.context}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        {/* ── 費用の目安 ───────────────────────── */}
        <section className={styles.section} aria-labelledby="pricing-head">
          <h2 id="pricing-head" className={styles.sectionTitle}>
            費用の目安
          </h2>

          <dl className={styles.pricing}>
            {pricing.map((tier) => (
              <div key={tier.label} className={styles.tier}>
                <dt className={styles.tierLabel}>{tier.label}</dt>
                <dd className={styles.tierRange}>{tier.range}</dd>
                <dd className={styles.tierNote}>{tier.note}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.pricingNote}>{pricingNote}</p>
        </section>

        {/* ── よくある質問 ─────────────────────── */}
        <section className={styles.section} aria-labelledby="faq-head">
          <h2 id="faq-head" className={styles.sectionTitle}>
            よくある質問
          </h2>

          <dl className={styles.faq}>
            {faqs.map((item) => (
              <div key={item.q} className={styles.faqItem}>
                <dt className={styles.faqQ}>{item.q}</dt>
                <dd className={styles.faqA}>{item.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        {/* ── 締めの一文 + 行き先はひとつだけ ────── */}
        <section className={styles.cta}>
          <p className={styles.ctaLine}>{closingStatement}</p>
          <a className={`${styles.chip} ${styles.chipLarge}`} href={`mailto:${profile.email}`}>
            メールで相談する
            <span aria-hidden="true">→</span>
          </a>
          <p className={styles.ctaNote}>
            {profile.email} ／ 平日は 1 営業日以内にお返事します。
          </p>
        </section>
      </main>

      {/* ── Ft6 · レターの結び ────────────────── */}
      <footer className={styles.footer}>
        <p className={styles.footerLine}>
          つくるかどうかを決める前の相談が、いちばん役に立つと思っています。
        </p>
        <p className={styles.footerSign}>— {profile.name}</p>
        <div className={styles.footerMeta}>
          <Link className={styles.textLink} href={ROUTES.engineer.path}>
            エンジニアとしての経歴はこちら
            <span aria-hidden="true"> →</span>
          </Link>
        </div>
      </footer>
    </>
  );
}
