import {
  Fraunces,
  Geist,
  Hanken_Grotesk,
  IBM_Plex_Mono,
  Noto_Sans_JP,
  Zen_Old_Mincho,
} from "next/font/google";

/**
 * フォント。すべてビルド時にセルフホストされるので外部リクエストは発生しない。
 *
 * 2 つの約束事：
 *
 * 1. 和文フェイスは `subsets` を指定せず `preload: false` にする。
 *    subsets: ["latin"] にすると和文グリフが落ちてしまうため。
 *    preload しないのは、和文は容量が大きく、unicode-range 分割により
 *    ブラウザが必要な範囲だけ取りに行くほうが速いから。
 *
 * 2. 欧文フェイスは adjustFontFallback を切る。
 *    next/font が自動で挟むメトリクス調整フォールバックは和文グリフを
 *    持たないので、そのままだと和文が意図しない書体に落ちる。
 *    「欧文フェイス → 和文フェイス」の順でスタックを組むことで
 *    欧文は選んだ書体・和文は Noto / Zen、を担保する。
 */

/* ── 和文 ───────────────────────────────────── */

// 和文は 1 ウェイトあたり 100 ファイル超（unicode-range 分割）になるので
// 実際に使うウェイトだけに絞る。強調は 400/700 の対比で足りる。
export const notoSansJp = Noto_Sans_JP({
  weight: ["400", "700"],
  variable: "--font-jp-sans",
  display: "swap",
  preload: false,
});

export const zenOldMincho = Zen_Old_Mincho({
  weight: ["400"],
  variable: "--font-jp-serif",
  display: "swap",
  preload: false,
});

/* ── Almanac（/engineer）── 欧文 ─────────────── */

export const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-grotesk",
  display: "swap",
  adjustFontFallback: false,
});

export const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-label",
  display: "swap",
  adjustFontFallback: false,
});

/* ── Studio（/business）── 欧文 ───────────────── */

// 可変フォント。weight を列挙せず可変のまま使い、SOFT（字面のやわらかさ）と
// opsz（光学サイズ）を CSS 側の font-variation-settings で指定する。
export const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "opsz"],
  variable: "--font-serif-display",
  display: "swap",
  adjustFontFallback: false,
});

export const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans-body",
  display: "swap",
  adjustFontFallback: false,
});

/* ── ルートごとの組み合わせ ───────────────────── */

const join = (...classNames: string[]) => classNames.join(" ");

/** /engineer — Hanken Grotesk + IBM Plex Mono + Noto Sans JP */
export const almanacFonts = join(
  hankenGrotesk.variable,
  ibmPlexMono.variable,
  notoSansJp.variable,
);

/** /business — Fraunces + Geist + Zen Old Mincho + Noto Sans JP */
export const studioFonts = join(
  fraunces.variable,
  geist.variable,
  zenOldMincho.variable,
  notoSansJp.variable,
);

/** / — 両テーマの予告として display にセリフ、body にグロテスクを使う */
export const gateFonts = join(
  fraunces.variable,
  hankenGrotesk.variable,
  ibmPlexMono.variable,
  zenOldMincho.variable,
  notoSansJp.variable,
);
