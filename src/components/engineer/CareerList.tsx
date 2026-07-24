import type { CareerEntry } from "@/content/types";
import { formatDuration, formatPeriod, periodMonths } from "@/lib/derive";
import styles from "./engineer.module.css";

/**
 * 職務経歴。1 社 1 ブロック、新しい順。
 *
 * 期間・役割・チーム規模の 3 行を全社で同じ位置に固定しているのが要点。
 * 読み手は複数社を横断で比較するので、揃っていること自体が読みやすさになる。
 */
export function CareerList({ entries }: { entries: CareerEntry[] }) {
  return (
    <ol className={styles.careerList}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.career}>
          <div className={styles.careerHead}>
            <p className={styles.careerDates}>
              <time>{formatPeriod(entry.period)}</time>
              <span className={styles.careerDuration}>
                {formatDuration(periodMonths(entry.period))}
              </span>
            </p>
            <h3 className={styles.careerCompany}>{entry.company}</h3>
            <p className={styles.careerNote}>{entry.companyNote}</p>
          </div>

          <dl className={styles.meta}>
            <div className={styles.metaRow}>
              <dt>役割</dt>
              <dd>{entry.role}</dd>
            </div>
            {entry.teamSize ? (
              <div className={styles.metaRow}>
                <dt>チーム</dt>
                <dd className="tnum">{entry.teamSize} 名</dd>
              </div>
            ) : null}
            <div className={styles.metaRow}>
              <dt>状況</dt>
              <dd>{entry.context}</dd>
            </div>
          </dl>

          <div className={styles.careerBody}>
            <section className={styles.careerBlock}>
              <h4 className={styles.blockLabel}>担当</h4>
              <ul className={styles.bullets}>
                {entry.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section className={styles.careerBlock}>
              <h4 className={styles.blockLabel}>やったこと</h4>
              <ul className={styles.outcomes}>
                {entry.outcomes.map((outcome) => (
                  <li key={outcome.label} className={styles.outcome}>
                    <p className={styles.outcomeLabel}>
                      {outcome.label}
                      {/* 数字は確認できたものだけ。無い場合は行ごと出さない。 */}
                      {outcome.value ? (
                        <span className={`${styles.outcomeValue} tnum`}>{outcome.value}</span>
                      ) : null}
                    </p>
                    {outcome.note ? <p className={styles.outcomeNote}>{outcome.note}</p> : null}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <p className={styles.stack}>
            <span className={styles.stackLabel}>技術</span>
            {entry.stack.join(" · ")}
          </p>
        </li>
      ))}
    </ol>
  );
}
