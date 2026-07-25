import type { CareerEntry } from "@/content/types";
import { TechIcon } from "@/components/icons/TechIcon";
import { formatDuration, formatPeriod, periodMonths } from "@/lib/derive";
import styles from "./engineer.module.css";

/**
 * 02 WORK。
 *
 * 縦のタイムライン。左に年、右にカード。
 * **期間・役割・チーム規模の定型行は第 1 版のまま維持している** —
 * 読み手は複数社を横断で比較するので、同じ位置に同じ項目が並んでいること自体が
 * 読みやすさの実体で、そこは硬くて正解だった部分。
 *
 * 左の線はスクロールに合わせて描かれる（対応ブラウザのみ・CSS だけで完結）。
 */
export function Timeline({ entries }: { entries: CareerEntry[] }) {
  return (
    <ol className={styles.timeline}>
      {entries.map((entry) => (
        <li key={entry.id} className={styles.tlItem}>
          <div className={styles.tlYear}>
            <span className={`${styles.tlYearNum} tnum`}>{entry.period.from.slice(0, 4)}</span>
            <span className={styles.tlDot} aria-hidden="true" />
          </div>

          <article className={styles.tlCard}>
            <p className={styles.tlPeriod}>
              <time>{formatPeriod(entry.period)}</time>
              <span className={styles.tlDuration}>
                {formatDuration(periodMonths(entry.period))}
              </span>
            </p>

            <h3 className={styles.tlCompany}>{entry.company}</h3>
            <p className={styles.tlNote}>{entry.companyNote}</p>

            <dl className={styles.tlMeta}>
              <div>
                <dt>役割</dt>
                <dd>{entry.role}</dd>
              </div>
              {entry.teamSize ? (
                <div>
                  <dt>チーム</dt>
                  <dd className="tnum">{entry.teamSize} 名</dd>
                </div>
              ) : null}
              <div>
                <dt>状況</dt>
                <dd>{entry.context}</dd>
              </div>
            </dl>

            <div className={styles.tlBlocks}>
              <section>
                <h4 className={styles.tlBlockLabel}>担当</h4>
                <ul className={styles.tlBullets}>
                  {entry.responsibilities.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </section>

              <section>
                <h4 className={styles.tlBlockLabel}>やったこと</h4>
                <ul className={styles.tlOutcomes}>
                  {entry.outcomes.map((outcome) => (
                    <li key={outcome.label}>
                      <p className={styles.tlOutcomeLabel}>
                        {outcome.label}
                        {/* 数字は確認できたものだけ。無ければこの要素自体が出ない。 */}
                        {outcome.value ? (
                          <span className={`${styles.tlOutcomeValue} tnum`}>{outcome.value}</span>
                        ) : null}
                      </p>
                      {outcome.note ? (
                        <p className={styles.tlOutcomeNote}>{outcome.note}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </section>
            </div>

            <ul className={styles.tlStack}>
              {entry.stack.map((tech) => (
                <li key={tech}>
                  <TechIcon name={tech} size="sm" />
                </li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ol>
  );
}
