import type { CSSProperties } from "react";
import Link from "next/link";
import { career, cases, profile, skills } from "@/content";
import { ROUTES, SITE_URL } from "@/config/site";
import { coreSkills, formatDate, totalExperienceYears } from "@/lib/derive";
import { MarkedHeading } from "@/components/common/MarkedHeading";
import { TechIcon } from "@/components/icons/TechIcon";
import { EngineerShell } from "@/components/engineer/EngineerShell";
import { StackCluster } from "@/components/engineer/StackCluster";
import { Timeline } from "@/components/engineer/Timeline";
import { CaseCards } from "@/components/engineer/CaseCards";
import styles from "@/components/engineer/engineer.module.css";

/** 章の入場順。--i は 70ms 刻みのディレイになる。合計は 500ms 以内に収める。 */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

const CH = Object.fromEntries(ROUTES.engineer.sections.map((s) => [s.id, s]));

export default function EngineerPage() {
  const years = totalExperienceYears(career);
  const core = coreSkills(skills).slice(0, 6);

  return (
    <>
      <a className="skip-link" href="#intro">
        本文へ移動
      </a>

      <EngineerShell name={profile.name}>
        <main className={styles.page}>
          {/* 印刷したときだけ出るヘッダ。画面では非表示。 */}
          <div className={styles.printHead} data-testid="print-head" aria-hidden="true">
            <p>
              {profile.name}（{profile.nameLatin}）／ {profile.role}
            </p>
            <p>
              {profile.email} ／ {SITE_URL}
              {ROUTES.engineer.path} ／ 最終更新 {formatDate(profile.updatedAt)}
            </p>
          </div>

          {/* ══ 00 はじめに ══════════════════════ */}
          <section id="intro" className={styles.chapter} data-snap={CH.intro?.snap || undefined}>
            <div className={styles.introInner}>
              <p className={`${styles.introName} enter`} style={step(0)}>
                {profile.name}
                <span className={styles.introNameLatin}>{profile.nameLatin}</span>
              </p>

              <h1 className={`${styles.statement} enter`} style={step(1)}>
                <MarkedHeading value={profile.headline} />
              </h1>

              <p className={`${styles.lede} enter`} style={step(2)}>
                {profile.lede}
              </p>

              <ul className={`${styles.chips} enter`} style={step(3)}>
                <li className={styles.chip} data-tone="accent">
                  {profile.status.label}
                </li>
                <li className={styles.chip}>
                  <span className="tnum">{years}</span> 年
                </li>
                <li className={styles.chip}>{profile.location}</li>
              </ul>

              <ul className={`${styles.coreStack} enter`} style={step(4)}>
                {core.map((tech) => (
                  <li key={tech}>
                    <TechIcon name={tech} size="sm" />
                  </li>
                ))}
              </ul>
            </div>

            <p className={styles.scrollHint} aria-hidden="true">
              scroll
            </p>
          </section>

          {/* ══ 01 スタック ══════════════════════ */}
          <section id="stack" className={styles.chapter} data-snap={CH.stack?.snap || undefined}>
            <h2 className={`${styles.chapterTitle} enter`} style={step(0)}>
              使う道具
            </h2>
            <div className="enter" style={step(1)}>
              <StackCluster groups={skills} />
            </div>
          </section>

          {/* ══ 02 経歴 ═════════════════════════
              中身が詰まっている章なので snap は効かせず、入場も入れない。
              読み進める面で要素が現れ続けると読みにくい。 */}
          <section id="work" className={styles.chapter} data-snap={CH.work?.snap || undefined}>
            <h2 className={styles.chapterTitle}>これまで</h2>

            <ul className={styles.summary}>
              {profile.summary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <Timeline entries={career} />
          </section>

          {/* ══ 03 事例 ═════════════════════════ */}
          <section id="cases" className={styles.chapter} data-snap={CH.cases?.snap || undefined}>
            <h2 className={styles.chapterTitle}>判断の記録</h2>
            <p className={styles.chapterLede}>
              経歴の一覧では伝わらない、なぜそうしたかの部分です。
            </p>
            <CaseCards items={cases} />
          </section>

          {/* ══ 04 連絡先 ═══════════════════════ */}
          <section
            id="contact"
            className={styles.chapter}
            data-snap={CH.contact?.snap || undefined}
          >
            <div className={styles.contactInner}>
              <h2 className={`${styles.contactLine} enter`} style={step(0)}>
                書ききれていない話のほうが、
                <br />
                たぶん面白いです。
              </h2>

              <ul className={`${styles.contactList} enter`} style={step(1)}>
                <li>
                  <a className={styles.contactLink} href={`mailto:${profile.email}`}>
                    {profile.email}
                  </a>
                </li>
                {profile.links.map((link) => (
                  <li key={link.href}>
                    <a
                      className={styles.contactLink}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {link.label}
                      <span aria-hidden="true"> ↗</span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className={`${styles.crossSell} enter`} style={step(2)}>
                開発のご依頼・ご相談をお考えの場合は
                <Link className={styles.textLink} href={ROUTES.business.path}>
                  こちらのページ
                </Link>
                をご覧ください。
              </p>
            </div>
          </section>

          {/* ══ Ft1 · マストヘッド ══════════════ */}
          <footer className={styles.foot}>
            <p className={styles.footWordmark}>{profile.name}</p>
            <p className={styles.footMeta}>
              最終更新 <time dateTime={profile.updatedAt}>{formatDate(profile.updatedAt)}</time>
              <span aria-hidden="true"> · </span>
              Bricolage Grotesque / Geist / Zen Kaku Gothic New
              <span aria-hidden="true"> · </span>
              このページは GitHub 上のデータから生成されています
            </p>
          </footer>
        </main>
      </EngineerShell>
    </>
  );
}
