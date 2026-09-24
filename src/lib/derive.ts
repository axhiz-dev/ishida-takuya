import type { Period } from "@/content/types";
import type { EngineerCareerEntry, EngineerSkillCategory } from "@/content/engineer";

/**
 * コンテンツから導出できる数字だけを計算する。
 *
 * ここで出す数字は career / skills のデータから機械的に決まるものに限る。
 * 「◯◯% 改善」のような、データにない数字をここで作らないこと。
 */

const parseYearMonth = (value: string): { year: number; month: number } => {
  const [year, month] = value.split("-");
  return { year: Number(year), month: Number(month) };
};

/** 期間を月数に。to が "present" なら now までを数える。 */
export const periodMonths = (period: Period, now = new Date()): number => {
  const from = parseYearMonth(period.from);
  const to =
    period.to === "present"
      ? { year: now.getFullYear(), month: now.getMonth() + 1 }
      : parseYearMonth(period.to);
  return (to.year - from.year) * 12 + (to.month - from.month);
};

/**
 * 「2022.07 – 現在」の形に整形する。
 *
 * 表示用の文字列をデータに持たせず、期間そのものから組み立てる。
 * 手で書くと通算年数の計算とずれても誰も気づけない。
 */
export const formatDotPeriod = (period: Period): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  const from = parseYearMonth(period.from);
  const head = `${from.year}.${pad(from.month)}`;
  if (period.to === "present") return `${head} – 現在`;
  const to = parseYearMonth(period.to);
  return `${head} – ${to.year}.${pad(to.month)}`;
};

/** 経歴の期間を合算した通算年数（重複期間は考慮しない単純合算）。 */
export const totalExperienceYears = (
  entries: { period: Period }[],
  now = new Date(),
): number => {
  const months = entries.reduce((sum, entry) => sum + periodMonths(entry.period, now), 0);
  return Math.floor(months / 12);
};

/**
 * エンジニア職としての通算年数。営業職（kind: "sales"）は数えない。
 * 入口ページと /engineer のヘッダは必ずこれを使う。
 */
export const engineeringYears = (entries: EngineerCareerEntry[], now = new Date()): number =>
  totalExperienceYears(
    entries.filter((entry) => entry.kind !== "sales"),
    now,
  );

/** 職務要約などに書いた `{years}` を、エンジニア職の通算年数に置き換える。 */
export const withEngineeringYears = (
  text: string,
  entries: EngineerCareerEntry[],
  now = new Date(),
): string => text.replaceAll("{years}", String(engineeringYears(entries, now)));

/**
 * 経験年数の表記（"5年以上" など）を 0-100 の段階に直す。
 * スキルバーの長さと並び順に使う。
 */
export const skillLevel = (years: string): number => {
  if (years.startsWith("5年")) return 100;
  if (years.startsWith("3年")) return 72;
  if (years.startsWith("1年以上")) return 46;
  return 26;
};

/**
 * 経験年数の長い順にスキル名を返す。入口ページに添える 2〜3 語に使う。
 * 同じ段階の中では content/engineer.ts に書いた順を保つ。
 */
export const topSkillNames = (categories: EngineerSkillCategory[]): string[] =>
  categories
    .flatMap((category) => category.skills)
    .sort((a, b) => skillLevel(b.years) - skillLevel(a.years))
    .map((skill) => skill.name);

/** "2026-07-24" → "2026年7月24日" */
export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split("-").map(Number);
  return `${year}年${month}月${day}日`;
};
