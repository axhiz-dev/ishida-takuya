import { isPlaceholder } from "@/config/owner";
import styles from "./fillable.module.css";

/**
 * 未入力の項目を、目立つ形で出す。
 *
 * 空文字や「-」で誤魔化すと、埋め忘れたまま公開されて気づかない。
 * 法定の表記で空欄が残るのはいちばんまずいので、あえて赤く出す。
 */
export function Fillable({ value }: { value: string }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <span className={styles.blank} title="この項目はまだ設定されていません">
      未入力
    </span>
  );
}
