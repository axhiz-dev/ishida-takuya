import type { Metadata } from "next";
import { profile, tradeLawIntro, tradeLawRows } from "@/content";
import { Fillable } from "@/components/common/Fillable";
import { SubPage } from "@/components/business/SubPage";
import styles from "@/components/business/business.module.css";

export const metadata: Metadata = {
  title: `特定商取引法に基づく表記 — ${profile.name}`,
  description: "事業者の情報と、料金・支払い・提供時期・契約の解除についての表記。",
};

export default function LegalPage() {
  return (
    <SubPage title="特定商取引法に基づく表記" lede={tradeLawIntro}>
      <section className={styles.section}>
        <dl className={styles.legal}>
          {tradeLawRows.map((row) => (
            <div key={row.label} className={styles.legalRow}>
              <dt>{row.label}</dt>
              <dd>
                <Fillable value={row.value} />
                {row.note ? <span className={styles.legalNote}>{row.note}</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </SubPage>
  );
}
