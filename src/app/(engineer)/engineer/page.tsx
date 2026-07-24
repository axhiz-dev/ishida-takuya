import type { CSSProperties } from "react";
import Link from "next/link";
import { career, cases, profile, skills } from "@/content";
import { ROUTES, SITE_URL } from "@/config/site";
import { coreSkills, formatDate, totalExperienceYears } from "@/lib/derive";
import { PlaceholderNotice } from "@/components/common/PlaceholderNotice";
import { SideRail } from "@/components/engineer/SideRail";
import { CareerList } from "@/components/engineer/CareerList";
import { SkillMatrix } from "@/components/engineer/SkillMatrix";
import { CaseList } from "@/components/engineer/CaseList";
import styles from "@/components/engineer/engineer.module.css";

/** ページロード時の入場順。--i は 60ms 刻みのディレイになる。 */
const step = (i: number) => ({ "--i": i }) as CSSProperties;

export default function EngineerPage() {
  const years = totalExperienceYears(career);
  const core = coreSkills(skills).slice(0, 4);

  return (
    <>
      <a className="skip-link" href="#summary">
        本文へ移動
      </a>
      <PlaceholderNotice />

      <div className={styles.shell}>
        <SideRail name={profile.name} role={profile.role} updatedAt={profile.updatedAt} />

        <article className={styles.doc}>
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

          <header className={styles.masthead}>
            <h1 className={`${styles.name} enter`} style={step(0)}>
              {profile.name}
              <span className={styles.nameLatin}>{profile.nameLatin}</span>
            </h1>

            <p className={`${styles.headline} enter`} style={step(1)}>
              {profile.headline}
            </p>

            <ul className={`${styles.links} enter`} style={step(2)}>
              <li>
                <a className={styles.textLink} href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              {profile.links.map((link) => (
                <li key={link.href}>
                  <a
                    className={styles.textLink}
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
          </header>

          {/* ── 要約 ─────────────────────────────── */}
          <section id="summary" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>要約</h2>
            </div>

            {/* 3 秒で判断するための行。ここだけ読めば会うかどうかが決まる。 */}
            <dl className={`${styles.facts} enter`} style={step(3)}>
              <div className={styles.fact}>
                <dt>状況</dt>
                <dd>
                  {profile.status.label}
                  {profile.status.detail ? (
                    <span className={styles.factNote}>{profile.status.detail}</span>
                  ) : null}
                </dd>
              </div>
              <div className={styles.fact}>
                <dt>通算</dt>
                <dd className="tnum">{years} 年</dd>
              </div>
              <div className={styles.fact}>
                <dt>拠点</dt>
                <dd>{profile.location}</dd>
              </div>
              <div className={styles.fact}>
                <dt>主戦場</dt>
                <dd>{core.join(" · ")}</dd>
              </div>
            </dl>

            <ul className={styles.summary}>
              {profile.summary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          </section>

          {/* ── 職務経歴 ─────────────────────────── */}
          <section id="career" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>職務経歴</h2>
            </div>
            <p className={styles.sectionNote}>新しい順に並べています。</p>
            <CareerList entries={career} />
          </section>

          {/* ── スキル ───────────────────────────── */}
          <section id="skills" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>スキル</h2>
            </div>
            <p className={styles.sectionNote}>
              習熟度は自己申告です。どこで使ったかを併記しています。
            </p>
            <SkillMatrix groups={skills} />
          </section>

          {/* ── 事例 ─────────────────────────────── */}
          <section id="cases" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>事例</h2>
            </div>
            <p className={styles.sectionNote}>
              経歴の一覧では伝わらない、判断の記録です。
            </p>
            <CaseList items={cases} />
          </section>

          {/* ── 連絡先 ───────────────────────────── */}
          <section id="contact" className={styles.section}>
            <div className={styles.sectionHead}>
              <h2>連絡先</h2>
            </div>

            <p className={styles.contactLede}>
              経歴の詳細や、ここに書ききれていない話は直接お伝えします。カジュアルな情報交換でも構いません。
            </p>

            <ul className={styles.contactList}>
              <li>
                <span className={styles.contactLabel}>メール</span>
                <a className={styles.textLink} href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
              </li>
              {profile.links.map((link) => (
                <li key={link.href}>
                  <span className={styles.contactLabel}>{link.label}</span>
                  <a
                    className={styles.textLink}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {link.href.replace(/^https?:\/\//, "")}
                    <span aria-hidden="true"> ↗</span>
                  </a>
                  {link.note ? <span className={styles.contactNote}>{link.note}</span> : null}
                </li>
              ))}
            </ul>

            <p className={styles.crossSell}>
              開発のご依頼・ご相談をお考えの場合は
              <Link className={styles.textLink} href={ROUTES.business.path}>
                こちらのページ
              </Link>
              をご覧ください。
            </p>
          </section>

          {/* ── Ft4 · コロフォン ─────────────────── */}
          <footer className={styles.colophon}>
            <p>
              この職務経歴書は GitHub
              上のデータから生成されています。内容を更新すると自動で再公開されるため、ここに表示されている情報が常に最新です。最終更新{" "}
              <time dateTime={profile.updatedAt}>{formatDate(profile.updatedAt)}</time>。書体は
              Hanken Grotesk と IBM Plex Mono、和文は Noto Sans JP。ブラウザの印刷機能から PDF
              として保存できます。 © 2026 {profile.name}
            </p>
          </footer>
        </article>
      </div>
    </>
  );
}
