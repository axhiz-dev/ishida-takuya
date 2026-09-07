import Link from "next/link";
import {
  about,
  capabilities,
  capabilitiesClosing,
  contact,
  demoIntro,
  demoNotes,
  demos,
  faqs,
  footerLine,
  hero,
  monitorOffer,
  priceAddons,
  priceExcludes,
  priceIncludes,
  priceTiers,
  processSteps,
  profile,
  promises,
  symptoms,
  symptomsClosing,
  takeaway,
} from "@/content";
import { ROUTES } from "@/config/site";
import { MarkedHeading } from "@/components/common/MarkedHeading";
import { EdgeNav } from "@/components/business/EdgeNav";
import { Portrait } from "@/components/business/Portrait";
import { DemoAggregate } from "@/components/business/DemoAggregate";
import { DemoInvoice } from "@/components/business/DemoInvoice";
import { SavingsCalculator } from "@/components/business/SavingsCalculator";
import { ContactForm } from "@/components/business/ContactForm";
import styles from "@/components/business/business.module.css";

/**
 * /business — 業務自動化の営業ページ。
 *
 * 読み手は IT に詳しくない会社の社長・事務責任者。
 * 判断軸は「うちの困りごとを分かっているか」「いくらか」「個人に頼んで大丈夫か」の 3 つだけ。
 *
 * 節の順番の意図：
 *   症状 → デモ → できること、の順で、**主張より先に証拠を置いている**。
 *   実績が公開できない段階では、動くものを触らせるのが唯一効く証明なので
 *   デモを上から 3 番目に置いて、料金より前に体験させる。
 */
export default function BusinessPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>

      {/* ナビが浮くタイミングを測るための番兵。高さ 0 の目印。 */}
      <div id="nav-sentinel" aria-hidden="true" />

      <EdgeNav name={profile.name} />

      <main id="main" className={styles.page}>
        {/* ── 1. ヒーロー ───────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroText}>
            <h1 className={styles.statement}>
              {hero.lines.map((line) => (
                <span key={line} className={styles.statementLine}>
                  <MarkedHeading value={{ text: line, mark: hero.mark }} />
                </span>
              ))}
            </h1>

            <p className={styles.lede}>{hero.lede}</p>

            <div className={styles.heroActions}>
              <a className={`${styles.chip} ${styles.chipLarge}`} href="#demo">
                デモを触ってみる
                <span aria-hidden="true">→</span>
              </a>
              <a className={styles.chipGhost} href="#contact">
                無料で相談する
              </a>
            </div>

            <ul className={styles.terms}>
              {hero.terms.map((term) => (
                <li key={term}>{term}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── 2. よくある作業 ───────────────────── */}
        <section className={styles.section} aria-labelledby="symptoms-head">
          <h2 id="symptoms-head" className={styles.sectionTitle}>
            よくある作業
          </h2>

          <ul className={styles.symptoms}>
            {symptoms.map((symptom) => (
              <li key={symptom} className={styles.symptom}>
                {symptom}
              </li>
            ))}
          </ul>

          <p className={styles.sectionClosing}>{symptomsClosing}</p>
        </section>

        {/* ── 3. デモ（このページの中心） ────────── */}
        <section id="demo" className={styles.section} aria-labelledby="demo-head">
          <h2 id="demo-head" className={styles.sectionTitle}>
            デモ
          </h2>
          <p className={styles.sectionLede}>{demoIntro}</p>

          <div className={styles.demos}>
            <DemoAggregate demo={demos[0]!} />
            <DemoInvoice demo={demos[1]!} />
          </div>

          <ul className={styles.notes}>
            {demoNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>

          {/* 持ち帰り。断りの話と値段の話を段落で分けてある。 */}
          <div className={styles.takeaway}>
            <h3 className={styles.takeawayTitle}>{takeaway.title}</h3>
            <p>{takeaway.body}</p>
            <p className={styles.takeawayLimits}>
              {takeaway.limits.map((limit) => (
                <span key={limit}>{limit}</span>
              ))}
            </p>
            <p className={styles.takeawayUpsell}>{takeaway.upsell}</p>
          </div>
        </section>

        {/* ── 4. 対応できる作業 ─────────────────── */}
        <section id="capabilities" className={styles.section} aria-labelledby="capabilities-head">
          <h2 id="capabilities-head" className={styles.sectionTitle}>
            対応できる作業
          </h2>

          <ul className={styles.capabilities}>
            {capabilities.map((item) => (
              <li key={item} className={styles.capability}>
                {item}
              </li>
            ))}
          </ul>

          <p className={styles.sectionClosing}>{capabilitiesClosing}</p>
        </section>

        {/* ── 5. 進め方 ─────────────────────────── */}
        <section id="process" className={styles.section} aria-labelledby="process-head">
          <h2 id="process-head" className={styles.sectionTitle}>
            進め方
          </h2>

          <ol className={styles.steps}>
            {processSteps.map((step) => (
              <li key={step.no} className={styles.step}>
                <p className={styles.stepNo} aria-hidden="true">
                  {step.no}
                </p>
                <div className={styles.stepBody}>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p>{step.body}</p>
                  {step.youProvide ? (
                    <p className={styles.stepProvide}>
                      <span className={styles.stepProvideLabel}>ご用意いただくもの</span>
                      {step.youProvide}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* ── 6. お約束 ─────────────────────────── */}
        <section className={styles.section} aria-labelledby="promises-head">
          <h2 id="promises-head" className={styles.sectionTitle}>
            お約束
          </h2>

          <ul className={styles.promises}>
            {promises.map((promise) => (
              <li key={promise} className={styles.promise}>
                {promise}
              </li>
            ))}
          </ul>
        </section>

        {/* ── 7. 料金 ───────────────────────────── */}
        <section id="pricing" className={styles.section} aria-labelledby="pricing-head">
          <h2 id="pricing-head" className={styles.sectionTitle}>
            料金
          </h2>

          {/* 金額より「範囲」を先に読ませる。数字だけ大きいと出どころを疑われる。 */}
          <div className={styles.tiers}>
            {priceTiers.map((tier) => (
              <article key={tier.id} className={styles.tier}>
                <h3 className={styles.tierLabel}>{tier.label}</h3>
                <p className={styles.tierScope}>{tier.scope}</p>

                {/* 金額と、金額を出さない理由は同じ 1 枠に収める。
                    subgrid で 3 枚の「納期」の行を揃えるため、枠の数は段によらず一定。 */}
                <div className={styles.tierPrice}>
                  {tier.amount ? <p className={styles.tierAmount}>{tier.amount}</p> : null}
                  {tier.reason ? <p className={styles.tierReason}>{tier.reason}</p> : null}
                </div>

                <p className={styles.tierLead}>
                  <span className={styles.tierLeadLabel}>納期</span>
                  {tier.lead}
                </p>
              </article>
            ))}
          </div>

          <div className={styles.scopeLists}>
            <div>
              <h3 className={styles.scopeTitle}>含まれるもの</h3>
              <ul className={styles.scopeList}>
                {priceIncludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className={styles.scopeTitle}>含まれないもの</h3>
              <ul className={styles.scopeList} data-tone="excluded">
                {priceExcludes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.addons}>
            {priceAddons.map((addon) => (
              <article key={addon.id} className={styles.addon}>
                <h3 className={styles.addonLabel}>{addon.label}</h3>
                <p className={styles.addonAmount}>{addon.amount}</p>
                <p className={styles.addonSummary}>{addon.summary}</p>
                {addon.includes ? (
                  <ul className={styles.addonList}>
                    {addon.includes.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ) : null}
                {addon.note ? <p className={styles.addonNote}>{addon.note}</p> : null}
              </article>
            ))}
          </div>

          <aside className={styles.monitor}>
            <h3 className={styles.monitorHead}>{monitorOffer.headline}</h3>
            <p className={styles.monitorBody}>{monitorOffer.body}</p>
            <ol className={styles.monitorConditions}>
              {monitorOffer.conditions.map((condition) => (
                <li key={condition}>{condition}</li>
              ))}
            </ol>
            <p className={styles.monitorNote}>{monitorOffer.note}</p>
          </aside>
        </section>

        {/* ── 8. 削減額の試算 ───────────────────── */}
        <section className={styles.section} aria-labelledby="savings-head">
          <h2 id="savings-head" className={styles.sectionTitle}>
            削減額の試算
          </h2>
          <SavingsCalculator />
        </section>

        {/* ── 9. 私について ─────────────────────── */}
        <section id="about" className={styles.section} aria-labelledby="about-head">
          <h2 id="about-head" className={styles.sectionTitle}>
            {profile.name}
          </h2>

          <div className={styles.about}>
            <Portrait
              photo={profile.photo}
              name={profile.name}
              role="業務自動化"
              location={about.facts[0]?.value ?? ""}
            />

            <div className={styles.aboutBody}>
              <p className={styles.aboutLead}>{about.lead}</p>
              {about.career.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{about.motive}</p>

              <dl className={styles.aboutFacts}>
                {about.facts.map((fact) => (
                  <div key={fact.label}>
                    <dt>{fact.label}</dt>
                    <dd>{fact.value}</dd>
                  </div>
                ))}
                <div>
                  <dt>連絡先</dt>
                  <dd>
                    <a className={styles.textLink} href={`mailto:${profile.email}`}>
                      {profile.email}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* ── 10. よくある質問 ──────────────────── */}
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

        {/* ── 11. お問い合わせ ──────────────────── */}
        <section id="contact" className={styles.section} aria-labelledby="contact-head">
          <h2 id="contact-head" className={styles.sectionTitle}>
            お問い合わせ
          </h2>
          <p className={styles.sectionLede}>{contact.lead}</p>
          <ContactForm email={profile.email} />
        </section>
      </main>

      {/* ── 12. フッター ──────────────────────── */}
      <footer className={styles.footer}>
        <p className={styles.footerLine}>{footerLine}</p>
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
