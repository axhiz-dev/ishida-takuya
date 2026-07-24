import type { CaseStudy } from "@/content/types";
import styles from "./engineer.module.css";

/** 深掘り事例。読み手が本当に見たいのは「なぜその手を選んだか」なので、
 *  課題 → 打ち手 → 判断 → 結果 の並びを崩さない。 */
const PARTS = [
  { key: "problem", label: "課題" },
  { key: "approach", label: "打ち手" },
  { key: "reasoning", label: "なぜそうしたか" },
  { key: "result", label: "結果" },
] as const;

export function CaseList({ items }: { items: CaseStudy[] }) {
  return (
    <div className={styles.caseList}>
      {items.map((item) => (
        <article key={item.id} className={styles.case}>
          <header className={styles.caseHead}>
            <h3 className={styles.caseTitle}>{item.title}</h3>
            <p className={styles.caseOneLiner}>{item.oneLiner}</p>
            <p className={styles.caseMeta}>
              <span>{item.period}</span>
              <span aria-hidden="true">·</span>
              <span>{item.role}</span>
            </p>
          </header>

          <dl className={styles.caseParts}>
            {PARTS.map((part) => (
              <div key={part.key} className={styles.casePart}>
                <dt className={styles.blockLabel}>{part.label}</dt>
                <dd>{item[part.key]}</dd>
              </div>
            ))}
          </dl>

          <p className={styles.stack}>
            <span className={styles.stackLabel}>技術</span>
            {item.stack.join(" · ")}
          </p>

          {item.links?.length ? (
            <ul className={styles.caseLinks}>
              {item.links.map((link) => (
                <li key={link.href}>
                  <a
                    className={styles.textLink}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {link.label}
                    <span aria-hidden="true"> →</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </article>
      ))}
    </div>
  );
}
