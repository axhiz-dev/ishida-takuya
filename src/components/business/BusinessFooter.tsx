import Link from "next/link";
import { footerLine, profile } from "@/content";
import { ROUTES } from "@/config/site";
import styles from "./business.module.css";

/**
 * フッター。4 ページで共有する。
 * 法定の表記は、探さなくても見つかる位置に置く。
 * 個人に発注するかどうかを決める人は、まずここを見にくる。
 */
export function BusinessFooter({ withSign = true }: { withSign?: boolean }) {
  return (
    <footer className={styles.footer}>
      {withSign ? (
        <>
          <p className={styles.footerLine}>{footerLine}</p>
          <p className={styles.footerSign}>— {profile.name}</p>
        </>
      ) : null}

      <nav className={styles.footerLinks} aria-label="このサイトについて">
        <Link className={styles.textLink} href={ROUTES.business.path}>
          トップ
        </Link>
        <Link className={styles.textLink} href={`${ROUTES.business.path}/profile`}>
          プロフィール
        </Link>
        <Link className={styles.textLink} href={`${ROUTES.business.path}/legal`}>
          特定商取引法に基づく表記
        </Link>
        <Link className={styles.textLink} href={`${ROUTES.business.path}/privacy`}>
          プライバシーポリシー
        </Link>
      </nav>

      <div className={styles.footerMeta}>
        <Link className={styles.textLink} href={ROUTES.engineer.path}>
          エンジニアとしての経歴はこちら
          <span aria-hidden="true"> →</span>
        </Link>
      </div>
    </footer>
  );
}
