"use client";

import Link from "next/link";
import { useActiveSection } from "@/lib/useActiveSection";
import { FEATURES, ROUTES } from "@/config/site";
import { formatDate } from "@/lib/derive";
import styles from "./SideRail.module.css";

type Props = {
  name: string;
  role: string;
  updatedAt: string;
};

const SECTION_IDS = ROUTES.engineer.sections.map((s) => s.id);

/**
 * N3 · Side-rail（幅を持たせた索引レール版）。
 *
 * 目次であると同時に現在地表示でもある。長い文書を上から下まで読ませる
 * ページなので、「いまどこか」が常に見えていることが読みやすさの実体。
 * 760px 未満では上部の横並びバーに変形する。
 */
export function SideRail({ name, role, updatedAt }: Props) {
  const activeId = useActiveSection(SECTION_IDS);

  return (
    <nav className={styles.rail} aria-label="ページ内の目次">
      <div className={styles.identity}>
        <p className={styles.name}>{name}</p>
        <p className={styles.role}>{role}</p>
      </div>

      <ul className={styles.list}>
        {ROUTES.engineer.sections.map((section) => {
          const isActive = section.id === activeId;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={styles.item}
                data-active={isActive || undefined}
                aria-current={isActive ? "true" : undefined}
              >
                <span className={styles.marker} aria-hidden="true" />
                <span className={styles.itemLabel}>{section.label}</span>
              </a>
            </li>
          );
        })}
      </ul>

      <div className={styles.tail}>
        {FEATURES.pdfExport ? <PrintButton /> : null}

        <p className={styles.updated}>
          最終更新 <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
        </p>

        <Link href={ROUTES.business.path} className={styles.crossLink}>
          お仕事のご相談の方へ
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </nav>
  );
}

function PrintButton() {
  return (
    <button type="button" className={styles.print} onClick={() => window.print()}>
      PDFで保存
    </button>
  );
}
