import { IS_PLACEHOLDER_CONTENT } from "@/config/site";
import styles from "./PlaceholderNotice.module.css";

/**
 * 中身がまだダミーであることの表示。
 *
 * 画面上部に帯として敷くと固定ナビと重なるので、
 * **ナビの中に並ぶ小さなチップ**にしてある。常に見えるが邪魔にならない。
 * src/config/site.ts の IS_PLACEHOLDER_CONTENT を false にすると消える。
 */
export function PlaceholderNotice() {
  if (!IS_PLACEHOLDER_CONTENT) return null;

  return (
    <span
      className={styles.chip}
      role="note"
      title="表示されている経歴・実績はすべてダミーです。src/content/ を編集して push すると更新されます。"
    >
      ダミー
    </span>
  );
}
