import type { SkillGroup, SkillLevel } from "@/content/types";
import styles from "./engineer.module.css";

const LEVEL_TEXT: Record<SkillLevel, string> = {
  1: "触れたことがある",
  2: "業務で使える",
  3: "主戦場",
  4: "設計と技術判断ができる",
};

/**
 * F3 · Tabular spec sheet。
 *
 * レベルだけの自己申告表にしないため、根拠（どこで使ったか）を必ず併記する。
 * レベルは目盛りで描くが、色や形だけに頼らず読み上げ用のテキストを添える。
 */
export function SkillMatrix({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className={styles.skillGroups}>
      {groups.map((group) => (
        <section key={group.category} className={styles.skillGroup}>
          <h3 className={styles.skillCategory}>{group.category}</h3>

          <table className={styles.skillTable}>
            <caption className="visually-hidden">
              {group.category}のスキル一覧。習熟度・経験年数・根拠。
            </caption>
            <thead>
              <tr>
                <th scope="col">技術</th>
                <th scope="col">習熟度</th>
                <th scope="col">年数</th>
                <th scope="col">どこで使ったか</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((skill) => (
                <tr key={skill.name}>
                  <th scope="row" className={styles.skillName}>
                    {skill.name}
                  </th>
                  <td className={styles.skillLevel}>
                    <Gauge level={skill.level} />
                  </td>
                  <td className={`${styles.skillYears} tnum`}>
                    {skill.years ? `${skill.years} 年` : "—"}
                  </td>
                  <td className={styles.skillEvidence}>{skill.evidence ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}

function Gauge({ level }: { level: SkillLevel }) {
  return (
    <span className={styles.gauge}>
      {/* 目盛りを先に置くと、行をまたいで目盛りの位置が揃う。 */}
      <span className={styles.gaugeTicks} aria-hidden="true">
        {[1, 2, 3, 4].map((step) => (
          <span key={step} className={styles.tick} data-filled={step <= level || undefined} />
        ))}
      </span>
      <span className={styles.gaugeText}>{LEVEL_TEXT[level]}</span>
    </span>
  );
}
