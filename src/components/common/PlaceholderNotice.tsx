import { IS_PLACEHOLDER_CONTENT } from "@/config/site";
import styles from "./PlaceholderNotice.module.css";

/**
 * 中身がダミーであることを明示する 1 行。
 * src/config/site.ts の IS_PLACEHOLDER_CONTENT を false にすると消える。
 * 印刷時も非表示。
 */
export function PlaceholderNotice() {
  if (!IS_PLACEHOLDER_CONTENT) return null;

  return (
    <p className={styles.notice} role="note">
      このページの内容はまだダミーです。
      <code>src/content/</code> を編集して push すると更新されます。
    </p>
  );
}
