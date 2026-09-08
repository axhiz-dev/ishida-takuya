import type { ReactNode } from "react";
import type { Demo } from "@/content";
import styles from "./business.module.css";

/**
 * デモ 1 件の外枠。
 *
 * 「今こうなっていませんか」→「自動にするとこうなります」→「削減の目安」の
 * 並びは 2 つのデモで共通なので、触れる部分だけを children で差し替える。
 */
export function DemoShell({
  demo,
  code,
  children,
}: {
  demo: Demo;
  /** 「中で動いているコードを見る」で開く抜粋。 */
  code: string;
  children: ReactNode;
}) {
  return (
    <article className={styles.demo}>
      {/* 名前はタブのラベルが持っているのでここには出さない */}
      <p className={styles.demoInvitation}>{demo.invitation}</p>

      <div className={styles.demoStage}>{children}</div>

      <div className={styles.demoCompare}>
        <div>
          <h3 className={styles.demoCompareTitle}>今こうなっていませんか</h3>
          <ol className={styles.demoBefore}>
            {demo.before.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </div>

        <div>
          <h3 className={styles.demoCompareTitle}>自動にするとこうなります</h3>
          <p className={styles.demoAfter}>{demo.after}</p>
          <p className={styles.demoSaving}>
            <span className={styles.demoSavingLabel}>削減の目安</span>
            {demo.saving}
          </p>
        </div>
      </div>

      <details className={styles.demoCode}>
        <summary>中で動いているコードを見る</summary>
        <pre>
          <code>{code}</code>
        </pre>
      </details>
    </article>
  );
}
