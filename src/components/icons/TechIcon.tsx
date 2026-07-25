import type { CSSProperties } from "react";
import { resolveMark } from "./registry";
import styles from "./TechIcon.module.css";

type Size = "lg" | "sm";

/**
 * 技術の印。
 *
 * チップが基本形で、ロゴはその上乗せ。ロゴを配布できない技術
 * （AWS・Java・Oracle・Playwright）は、名前そのものを大きく組んで
 * ワードマークとして見せる。AWS のロゴが元々ワードマークであることを
 * 考えると、これは妥協ではなく妥当な扱い。
 *
 * 色はライト用とダーク用の 2 つを CSS 変数に流し、
 * light-dark() で地の明暗に応じて切り替える。
 * テーマを切り替えても再描画は起きない。
 */
export function TechIcon({
  name,
  size = "sm",
  showLabel = true,
}: {
  name: string;
  size?: Size;
  showLabel?: boolean;
}) {
  const mark = resolveMark(name);

  const style = {
    "--mark-light": mark.colorLight,
    "--mark-dark": mark.colorDark,
  } as CSSProperties;

  return (
    <span className={styles.chip} data-size={size} data-wordmark={!mark.path || undefined} style={style}>
      {mark.path ? (
        <svg className={styles.glyph} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d={mark.path} fill="currentColor" />
        </svg>
      ) : (
        // ロゴが無いものは名前自体を印にする
        <span className={styles.wordmark} aria-hidden="true">
          {name}
        </span>
      )}

      {/* ロゴが無いものは既にワードマークとして名前が出ているので、
          ラベルを足すと同じ文字が 2 回並ぶ。 */}
      {showLabel && mark.path ? (
        <span className={styles.label}>{name}</span>
      ) : (
        <span className="visually-hidden">{name}</span>
      )}
    </span>
  );
}
