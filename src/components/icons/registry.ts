import * as simpleIcons from "simple-icons";
import type { SimpleIcon } from "simple-icons";

/**
 * 技術名 → ロゴと色の対応表。
 *
 * **ロゴを足したいときに触るのはこのファイルだけ。**
 *
 * 設計の考え方：
 *
 *   チップが基本形で、ロゴはその上乗せ。
 *   だから対応表に無い技術（「テスト設計」のような日本語や、
 *   商標上の理由でロゴを配布できないもの）も、色つきのチップとして
 *   同じ大きさ・同じ形で並ぶ。抜けではなく意図した変化に見える。
 *
 * AWS・Java・Oracle・Playwright は simple-icons が商標上の理由で
 * 配布していない。**それらしいロゴを自前で描くのはしない**（偽のロゴになる）。
 * 色を指定してチップとして出す。
 *
 * ブランド色は地の明暗で沈むことがある（Next.js の黒など）ので、
 * ライト用とダーク用を別々に持てるようにしてある。
 */

export type TechMark = {
  /** 表示名。content 側の文字列と一致させる。 */
  label: string;
  /** simple-icons のスラッグ。省略するとチップだけになる。 */
  slug?: string;
  /** ライト地での色。省略時はブランド色。 */
  light?: string;
  /** ダーク地での色。省略時はブランド色。 */
  dark?: string;
};

/** ブランド色が暗すぎてダーク地で沈むときの逃がし色 */
const PAPER = "#F2F4F8";
/** ブランド色が明るすぎてライト地で飛ぶときの逃がし色 */
const INK = "#1A1F2B";

const MARKS: TechMark[] = [
  /* ── 言語 ─────────────────────────────── */
  { label: "TypeScript", slug: "typescript" },
  { label: "JavaScript", slug: "javascript", light: "#8A7500" },
  { label: "PHP", slug: "php" },
  // simple-icons が商標上配布していない。チップとして出す。
  { label: "Java", light: "#8E3524", dark: "#F0776C" },
  { label: "Go", slug: "go" },

  /* ── フロントエンド ──────────────────────── */
  { label: "React", slug: "react", light: "#0B7C99" },
  { label: "Next.js", slug: "nextdotjs", light: INK, dark: PAPER },
  { label: "Vue.js", slug: "vuedotjs", light: "#2F8B63" },
  { label: "Nuxt", slug: "nuxt", light: "#008F55" },
  { label: "Vue.js / Nuxt", slug: "vuedotjs", light: "#2F8B63" },
  { label: "CSS 設計", slug: "css" },
  { label: "Sass", slug: "sass" },
  { label: "Storybook", slug: "storybook" },
  { label: "Chromatic", slug: "chromatic" },
  { label: "React Hook Form", slug: "reacthookform", light: "#C43668" },

  /* ── バックエンド / インフラ ───────────────── */
  { label: "Node.js", slug: "nodedotjs" },
  { label: "GraphQL", slug: "graphql" },
  { label: "MySQL", slug: "mysql" },
  { label: "PostgreSQL", slug: "postgresql" },
  { label: "PostgreSQL / MySQL", slug: "postgresql" },
  { label: "Laravel", slug: "laravel" },
  { label: "Spring", slug: "spring" },
  { label: "GCP", slug: "googlecloud" },
  { label: "Terraform", slug: "terraform" },
  { label: "Docker", slug: "docker" },
  // どちらも simple-icons が商標上配布していない。
  { label: "AWS", light: "#8A5200", dark: "#FF9900" },
  { label: "Oracle", light: "#8E3524", dark: "#F0776C" },

  /* ── 開発プロセス ───────────────────────── */
  { label: "GitHub Actions", slug: "githubactions", light: "#0B62C4" },
  { label: "Figma", slug: "figma" },
  { label: "Figma Tokens", slug: "figma" },
  { label: "Playwright", light: "#217346", dark: "#6BCB8B" },
  { label: "Chrome DevTools", slug: "googlechrome", light: "#1A62C9" },

  /* 日本語のスキル名。ロゴは無いが、チップとして同じ形で並ぶ。 */
  { label: "アクセシビリティ", light: "#6B4FA8", dark: "#C0A9F0" },
  { label: "テスト設計", light: "#6B4FA8", dark: "#C0A9F0" },
  { label: "CI/CD", light: "#0B62C4", dark: "#7FB4F5" },
  { label: "技術選定", light: "#6B4FA8", dark: "#C0A9F0" },
  { label: "オンボーディング設計", light: "#6B4FA8", dark: "#C0A9F0" },
];

const BY_LABEL = new Map(MARKS.map((m) => [m.label.toLowerCase(), m]));

const iconFor = (slug: string): SimpleIcon | undefined => {
  const key = `si${slug.charAt(0).toUpperCase()}${slug.slice(1)}` as keyof typeof simpleIcons;
  const icon = simpleIcons[key];
  return typeof icon === "object" && icon !== null && "path" in icon
    ? (icon as SimpleIcon)
    : undefined;
};

export type ResolvedMark = {
  label: string;
  /** SVG の path。無ければチップだけを描く。 */
  path?: string;
  /** ロゴ 1 個ぶんの viewBox 寸法（simple-icons は常に 24） */
  colorLight: string;
  colorDark: string;
};

/** 汎用色。対応表に無い名前はこれになる（壊れないための保険）。 */
const FALLBACK = { light: "#4A5568", dark: "#A0AEC0" };

/**
 * 表示名からロゴと色を引く。
 *
 * 対応表に無ければ、まず「/」で区切って前半だけで再試行し、
 * それでも見つからなければ汎用色のチップを返す。
 * **どの名前を渡しても必ず何かが返る** — content 側に自由な文字列を
 * 書いても表示が壊れない、というのがこの関数の契約。
 */
export function resolveMark(label: string): ResolvedMark {
  const mark =
    BY_LABEL.get(label.toLowerCase()) ??
    BY_LABEL.get(label.split("/")[0]!.trim().toLowerCase());

  const icon = mark?.slug ? iconFor(mark.slug) : undefined;
  const brand = icon ? `#${icon.hex}` : undefined;

  return {
    label,
    path: icon?.path,
    colorLight: mark?.light ?? brand ?? FALLBACK.light,
    colorDark: mark?.dark ?? brand ?? FALLBACK.dark,
  };
}

/** 対応表の全エントリ。検証（両テーマで沈まないか）に使う。 */
export const ALL_MARKS = MARKS.map((m) => m.label);
