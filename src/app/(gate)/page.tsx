"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { profile } from "@/content";
import { engineerCareer, engineerSkills } from "@/content/engineer";
import { ROUTES } from "@/config/site";
import { formatDate, topSkillNames, totalExperienceYears } from "@/lib/derive";
import { useCursorSpotlight } from "@/lib/useCursorSpotlight";
import { PlaceholderNotice } from "@/components/common/PlaceholderNotice";
import { MarkedHeading } from "@/components/common/MarkedHeading";
import styles from "./gate.module.css";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * 入口。1 画面で完結させる。
 *
 * ここに来た人がやることは「どちらの自分を見せるか」を選ぶことだけなので、
 * 情報は名前・一行・行き先 2 つに絞る。それぞれの扉が、
 * その先のページのテーマ（ダーク / ライト）を予告する。
 *
 * カーソル追従のスポットライトはこのページだけに置いている。
 * 「進みたいほうに光を当てる」という意味があるので装飾ではなく、
 * かつ読ませる面ではないので可読性を邪魔しない。
 */
export default function GatePage() {
  const spotlight = useCursorSpotlight<HTMLDivElement>();
  // /engineer と同じ 1 つのデータから出す。手で書くと 2 画面でずれる。
  const years = totalExperienceYears(engineerCareer);
  const core = topSkillNames(engineerSkills).slice(0, 3);

  const doors = [
    {
      href: ROUTES.engineer.path,
      kind: "engineer" as const,
      label: "採用・技術の方へ",
      title: "職務経歴",
      body: "担当領域・技術スタック・制作実績。PDF でも出せます。",
      meta: `${years} 年 / ${core.join(" · ")}`,
    },
    {
      href: ROUTES.business.path,
      kind: "business" as const,
      label: "お仕事のご相談の方へ",
      title: "業務の自動化",
      body: "エクセルへの打ち直しや、毎月おなじ書類を作る作業をなくします。",
      meta: "買い切り 10 万円から / 相談は無料",
    },
  ];

  return (
    <div className={styles.stage} ref={spotlight}>
      <div className={styles.light} aria-hidden="true" />

      <main className={styles.gate}>
        <header className={styles.head}>
          <p className={`${styles.name} enter`} style={step(0)} data-entered="true">
            {profile.name}
            <span className={styles.nameLatin}>{profile.nameLatin}</span>
            <PlaceholderNotice />
          </p>

          <h1 className={`${styles.statement} enter`} style={step(1)} data-entered="true">
            <MarkedHeading value={profile.headline} />
          </h1>
        </header>

        <nav className={styles.doors} aria-label="用途で選ぶ">
          {doors.map((door, index) => (
            <Link
              key={door.href}
              href={door.href}
              className={`${styles.door} enter`}
              data-kind={door.kind}
              style={step(2 + index)}
              data-entered="true"
            >
              <span className={styles.doorLabel}>{door.label}</span>
              <span className={styles.doorTitle}>{door.title}</span>
              <span className={styles.doorBody}>{door.body}</span>
              <span className={styles.doorFoot}>
                <span className={styles.doorMeta}>{door.meta}</span>
                <span className={styles.doorArrow} aria-hidden="true">
                  →
                </span>
              </span>
            </Link>
          ))}
        </nav>

        <footer className={`${styles.foot} enter`} style={step(4)} data-entered="true">
          <a className={styles.textLink} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className={styles.updated}>
            最終更新 <time dateTime={profile.updatedAt}>{formatDate(profile.updatedAt)}</time>
          </p>
        </footer>
      </main>
    </div>
  );
}
