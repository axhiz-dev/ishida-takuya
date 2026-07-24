import type { CSSProperties } from "react";
import Link from "next/link";
import { career, profile, skills } from "@/content";
import { ROUTES } from "@/config/site";
import { coreSkills, formatDate, totalExperienceYears } from "@/lib/derive";
import { PlaceholderNotice } from "@/components/common/PlaceholderNotice";
import styles from "./gate.module.css";

const step = (i: number) => ({ "--i": i }) as CSSProperties;

/**
 * 入口。1 画面で完結させる。
 *
 * ここに来た人がやることは「どちらの自分を見せるか」を選ぶことだけなので、
 * 情報は名前・肩書き・行き先 2 つに絞る。それぞれの扉が、
 * その先のページのテーマ（書体とアクセント色）を予告する。
 */
export default function GatePage() {
  const years = totalExperienceYears(career);
  const core = coreSkills(skills).slice(0, 3);

  const doors = [
    {
      href: ROUTES.engineer.path,
      kind: "engineer" as const,
      label: "採用・技術の方へ",
      title: "職務経歴",
      body: "これまでの担当領域・技術スタック・判断の記録を 1 ページにまとめています。PDF でも出せます。",
      meta: `${years} 年 / ${core.join(" · ")}`,
    },
    {
      href: ROUTES.business.path,
      kind: "business" as const,
      label: "お仕事のご相談の方へ",
      title: "できることと実績",
      body: "何を頼めて、どう進んで、いくらくらいかかるのか。つくらない相談も承っています。",
      meta: "初回 30 分の相談は無料",
    },
  ];

  return (
    <>
      <PlaceholderNotice />

      <main className={styles.gate}>
        <header className={styles.head}>
          <h1 className={`${styles.name} enter`} style={step(0)}>
            {profile.name}
            <span className={styles.nameLatin}>{profile.nameLatin}</span>
          </h1>
          <p className={`${styles.role} enter`} style={step(1)}>
            {profile.role}・{profile.location}
          </p>
        </header>

        <nav className={styles.doors} aria-label="用途で選ぶ">
          {doors.map((door, index) => (
            <Link
              key={door.href}
              href={door.href}
              className={`${styles.door} enter`}
              data-kind={door.kind}
              style={step(2 + index)}
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

        <footer className={`${styles.foot} enter`} style={step(4)}>
          <a className={styles.textLink} href={`mailto:${profile.email}`}>
            {profile.email}
          </a>
          <p className={styles.updated}>
            最終更新 <time dateTime={profile.updatedAt}>{formatDate(profile.updatedAt)}</time>
          </p>
        </footer>
      </main>
    </>
  );
}
