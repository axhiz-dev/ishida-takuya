import Link from "next/link";
import { ROUTES } from "@/config/site";
import styles from "./business.module.css";

/**
 * N9 · Edge-aligned minimal。
 * ワードマークを左端、行き先をひとつだけ右端に。あいだは埋めない。
 * 空きが設計そのものなので、ここにリンクを足さないこと。
 */
export function EdgeNav({ name, email }: { name: string; email: string }) {
  return (
    <header className={styles.nav}>
      <Link href={ROUTES.gate.path} className={styles.wordmark}>
        {name}
      </Link>

      <a className={styles.chip} href={`mailto:${email}`}>
        相談する
        <span aria-hidden="true">→</span>
      </a>
    </header>
  );
}
