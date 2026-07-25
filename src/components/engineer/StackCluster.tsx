import type { SkillGroup, SkillLevel } from "@/content/types";
import { TechIcon } from "@/components/icons/TechIcon";
import styles from "./engineer.module.css";

const LEVEL_TEXT: Record<SkillLevel, string> = {
  1: "触れたことがある",
  2: "業務で使える",
  3: "主戦場",
  4: "設計と技術判断ができる",
};

/**
 * 01 STACK。
 *
 * 一目で「この人はこれを使う」が伝わることだけを狙う章なので、
 * 画面にはロゴと年数しか出さない。
 *
 * ただし**根拠は捨てない**。習熟度と「どこで使ったか」は
 * 下の <details> に畳んで置く。自己申告のレベル表を顔に出さず、
 * それでも聞かれたら答えられる、という並びにしている。
 */
export function StackCluster({ groups }: { groups: SkillGroup[] }) {
  return (
    <div className={styles.stack}>
      {groups.map((group) => (
        <section key={group.category} className={styles.stackGroup}>
          <h3 className={styles.stackCategory}>{group.category}</h3>
          <ul className={styles.stackItems}>
            {group.items.map((skill) => (
              <li key={skill.name} className={styles.stackItem}>
                <TechIcon name={skill.icon ?? skill.name} size="lg" />
                {skill.years ? (
                  <span className={`${styles.stackYears} tnum`}>{skill.years}y</span>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}

      <details className={styles.evidence}>
        <summary className={styles.evidenceSummary}>
          習熟度と、どこで使ったかを見る
        </summary>

        <div className={styles.evidenceBody}>
          <p className={styles.evidenceNote}>
            習熟度は自己申告です。根拠のない数値（「Python 95%」のようなもの）は出しません。
            代わりに、どこで何をしたかを併記しています。
          </p>

          {groups.map((group) => (
            <table key={group.category} className={styles.evidenceTable}>
              <caption>{group.category}</caption>
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
                    <th scope="row">{skill.name}</th>
                    <td>{LEVEL_TEXT[skill.level]}</td>
                    <td className="tnum">{skill.years ? `${skill.years} 年` : "—"}</td>
                    <td>{skill.evidence ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </details>
    </div>
  );
}
