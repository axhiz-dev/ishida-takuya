import { JetBrains_Mono, Noto_Sans_JP } from "next/font/google";

/**
 * / と /engineer のフォント（本文 = Noto Sans JP / 年月・数字 = JetBrains Mono）。
 * /business の書体とは別系統なので、lib/fonts.ts とはファイルを分けてある。
 *
 * CSS 変数名は Tailwind の @theme（src/styles/engineer.css）と対になっている。
 * mono だけ `--font-mono-face` と別名にしているのは、Tailwind v4 の
 * テーマキーが `--font-mono` を占めていて、同名だと自己参照になるため。
 *
 * 和文フェイスは subsets を指定せず preload: false にする
 * （subsets: ["latin"] にすると和文グリフが落ちる）。
 * 欧文フェイスは adjustFontFallback を切る。next/font が挟むメトリクス調整
 * フォールバックは和文グリフを持たないので、そのままだと和文が意図しない
 * 書体に落ちる。
 */

export const engineerJpSans = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  variable: "--font-jp-sans",
  display: "swap",
  preload: false,
});

export const engineerMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono-face",
  display: "swap",
  adjustFontFallback: false,
});

/** <html> に付ける。 */
export const engineerFontVariables = [engineerMono.variable, engineerJpSans.variable].join(" ");
