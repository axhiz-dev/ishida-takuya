"use client";

import { useEffect, useState } from "react";
import type { Offering } from "@/content/types";
import styles from "./business.module.css";

/**
 * Feature Stack。
 *
 * 左に「できること」の一覧が固定され、右の証拠がスクロールで入れ替わる。
 * 左のどれが今の話題かは、右のどの証拠が画面にあるかで決まる。
 *
 * 「主張の隣に必ず証拠がある」という第 1 版の思想はそのままに、
 * 見せ方だけを変えたもの。スクロール連動をここで使うのは、
 * 装飾ではなく「いまどの主張の話をしているか」を運ぶため。
 *
 * 狭い画面では固定をやめ、主張 → 証拠 の縦積みに落とす。
 */
export function FeatureStack({ offerings }: { offerings: Offering[] }) {
  const [activeId, setActiveId] = useState(offerings[0]?.id);

  useEffect(() => {
    const elements = offerings
      .map((o) => document.getElementById(`proof-${o.id}`))
      .filter((el): el is HTMLElement => el !== null);

    if (elements.length === 0) return;

    const intersecting = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id.replace("proof-", "");
          if (entry.isIntersecting) intersecting.add(id);
          else intersecting.delete(id);
        }
        const current = [...offerings].reverse().find((o) => intersecting.has(o.id));
        if (current) setActiveId(current.id);
      },
      { rootMargin: "-30% 0px -45% 0px", threshold: 0 },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [offerings]);

  return (
    <div className={styles.stack}>
      {/* 左：主張。固定されて、いまの話題が強調される。 */}
      <ol className={styles.claims}>
        {offerings.map((offering) => {
          const isActive = offering.id === activeId;
          return (
            <li key={offering.id}>
              <a
                href={`#proof-${offering.id}`}
                className={styles.claim}
                data-active={isActive || undefined}
                aria-current={isActive ? "true" : undefined}
              >
                <span className={styles.claimTitle}>{offering.title}</span>
                <span className={styles.claimFor}>{offering.forWhom}</span>
              </a>
            </li>
          );
        })}
      </ol>

      {/* 右：証拠。スクロールで入れ替わる。 */}
      <div className={styles.proofs}>
        {offerings.map((offering) => (
          <section
            key={offering.id}
            id={`proof-${offering.id}`}
            className={styles.proofRow}
            aria-label={offering.title}
          >
            {/* 狭い画面ではここが主張の見出しになる（左の一覧は隠れる） */}
            <div className={styles.proofClaim}>
              <h3 className={styles.proofClaimTitle}>{offering.title}</h3>
              <p className={styles.proofClaimFor}>{offering.forWhom}</p>
              <p className={styles.proofClaimBody}>{offering.body}</p>
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
        ))}
      </div>
    </div>
  );
}
