import type { CaseStudy } from "@/content/types";
import { TechIcon } from "@/components/icons/TechIcon";
import styles from "./engineer.module.css";

/** 読み手がいちばん見たいのは reasoning（なぜその手を選んだか）。順序を崩さない。 */
const PARTS = [
  { key: "problem", label: "課題" },
  { key: "approach", label: "打ち手" },
  { key: "reasoning", label: "なぜそうしたか" },
  { key: "result", label: "結果" },
] as const;

/**
 * 03 CASES。
 *
 * 畳んだ状態では 1 件 3 行なので、3 件を一望できる。
 * 開くと判断の記録が出る。<details> なので JS 無しでも動き、
 * 印刷時は全部開いた状態で出す（紙は畳めないため）。
 */
export function CaseCards({ items }: { items: CaseStudy[] }) {
  return (
    <div className={styles.cases}>
      {items.map((item) => (
        <details key={item.id} className={styles.case}>
          <summary className={styles.caseSummary}>
            <span className={styles.caseHead}>
              <span className={styles.caseTitle}>{item.title}</span>
              <span className={styles.caseOneLiner}>{item.oneLiner}</span>
              <span className={styles.caseMeta}>
                {item.period}
                <span aria-hidden="true"> · </span>
                {item.role}
              </span>
            </span>
            <span className={styles.caseChevron} aria-hidden="true" />
          </summary>

          <div className={styles.caseBody}>
            <dl className={styles.caseParts}>
              {PARTS.map((part) => (
                <div key={part.key}>
                  <dt>{part.label}</dt>
                  <dd>{item[part.key]}</dd>
                </div>
              ))}
            </dl>

            <ul className={styles.caseStack}>
              {item.stack.map((tech) => (
                <li key={tech}>
                  <TechIcon name={tech} size="sm" />
                </li>
              ))}
            </ul>

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
          </div>
        </details>
      ))}
    </div>
  );
}
