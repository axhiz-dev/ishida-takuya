import {
  Bricolage_Grotesque,
  Geist,
  JetBrains_Mono,
  Noto_Sans_JP,
  Zen_Kaku_Gothic_New,
} from "next/font/google";

/**
 * フォント。すべてビルド時にセルフホストされるので外部リクエストは発生しない。
 *
 * 役割は 3 つだけ（Hallmark の 2+1 ルールの上限）：
 *   見出し = Bricolage Grotesque + Zen Kaku Gothic New
 *   本文   = Geist + Noto Sans JP
 *   ラベル = JetBrains Mono
 *
 * Bricolage を選んだ理由：**幅（wdth）と光学サイズ（opsz）の軸を持つ**ので、
 * 見出しの大きさに応じて字面を締められる。これが「表情」の実体で、
 * Geist や Inter では出せない。本文の Geist は消えることが仕事なので地味でよく、
 * 性格はすべて Bricolage に持たせる。
 *
 * 2 つの約束事：
 *
 * 1. 和文フェイスは `subsets` を指定せず `preload: false` にする。
 *    subsets: ["latin"] にすると和文グリフが落ちるため。
 *
 * 2. 欧文フェイスは adjustFontFallback を切る。
 *    next/font が自動で挟むメトリクス調整フォールバックは和文グリフを持たないので、
 *    そのままだと和文が意図しない書体に落ちる。
 *    「欧文フェイス → 和文フェイス」の順でスタックを組むことで
 *    欧文は選んだ書体・和文は Zen / Noto、を担保する。
 */

/* ── 和文 ───────────────────────────────────── */

export const notoSansJp = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  variable: "--font-jp-sans",
  display: "swap",
  preload: false,
});

export const zenKakuGothicNew = Zen_Kaku_Gothic_New({
  weight: ["500", "700"],
  variable: "--font-jp-display",
  display: "swap",
  preload: false,
});

/* ── 欧文 ───────────────────────────────────── */

// 可変フォント。weight を列挙せず可変のまま使い、
// wdth / opsz は CSS 側の font-variation-settings で見出しごとに指定する。
export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
  adjustFontFallback: false,
});

export const geist = Geist({
  subsets: ["latin"],
  // ダークでは本文ウェイトを 350 に落とすので 300 も持っておく
  weight: ["300", "400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
  adjustFontFallback: false,
});

export const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  adjustFontFallback: false,
});

/** 全ページ共通。<html> に付ける（data-theme と同じ要素であることが必須）。 */
export const fontVariables = [
  bricolageGrotesque.variable,
  geist.variable,
  jetBrainsMono.variable,
  zenKakuGothicNew.variable,
  notoSansJp.variable,
].join(" ");
