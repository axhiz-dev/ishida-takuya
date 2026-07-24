import type { Offering } from "@/content/types";
import styles from "./business.module.css";

/**
 * Split Studio の 1 行。
 *
 * 左に「できること」、右に「その裏づけ」。行ごとに左右が入れ替わる。
 * 主張の隣に必ず証拠が並んでいる、という配置そのものが信頼性の設計。
 */
export function Diptych({ offering, flipped }: { offering: Offering; flipped: boolean }) {
  return (
    <section className={styles.row} data-flipped={flipped || undefined}>
      <div className={styles.claim}>
        <h3 className={styles.claimTitle}>{offering.title}</h3>
        <p className={styles.claimFor}>{offering.forWhom}</p>
        <p className={styles.claimBody}>{offering.body}</p>
      </div>

      <div className={styles.proof}>
        <p className={styles.proofKind}>{offering.proof.kind}</p>
        <h4 className={styles.proofTitle}>{offering.proof.title}</h4>
        <p className={styles.proofDetail}>{offering.proof.detail}</p>

        {offering.proof.facts?.length ? (
          <ul className={styles.proofFacts}>
            {offering.proof.facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
        ) : null}

        {offering.proof.link ? (
          <a
            className={styles.textLink}
            href={offering.proof.link.href}
            target="_blank"
            rel="noreferrer noopener"
          >
            {offering.proof.link.label}
            <span aria-hidden="true"> →</span>
          </a>
        ) : null}
      </div>
    </section>
  );
}
