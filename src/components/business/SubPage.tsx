import type { ReactNode } from "react";
import Link from "next/link";
import { profile } from "@/content";
import { ROUTES } from "@/config/site";
import { EdgeNav } from "./EdgeNav";
import { BusinessFooter } from "./BusinessFooter";
import styles from "./business.module.css";

/**
 * 下層ページの外枠。
 * トップと同じナビとフッターを載せて、迷子にならないようにする。
 */
export function SubPage({ title, lede, children }: { title: string; lede?: string; children: ReactNode }) {
  return (
    <>
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <div id="nav-sentinel" aria-hidden="true" />
      <EdgeNav name={profile.name} />

      <main id="main" className={styles.page}>
        <header className={styles.subHead}>
          <Link className={styles.backLink} href={ROUTES.business.path}>
            <span aria-hidden="true">←</span> トップへ
          </Link>
          <h1 className={styles.subTitle}>{title}</h1>
          {lede ? <p className={styles.lede}>{lede}</p> : null}
        </header>

        {children}
      </main>

      <BusinessFooter withSign={false} />
    </>
  );
}
