import type { CareerEntry, Period, SkillGroup } from "@/content/types";

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

/** 「2022年4月 — 現在」の形に整形する。 */
export const formatPeriod = (period: Period): string => {
  const from = parseYearMonth(period.from);
  const head = `${from.year}年${from.month}月`;
  if (period.to === "present") return `${head} — 現在`;
  const to = parseYearMonth(period.to);
  return `${head} — ${to.year}年${to.month}月`;
};

/** 「3年2か月」の形に整形する。 */
export const formatDuration = (months: number): string => {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${rest}か月`;
  if (rest === 0) return `${years}年`;
  return `${years}年${rest}か月`;
};

/** 経歴の期間を合算した通算年数（重複期間は考慮しない単純合算）。 */
export const totalExperienceYears = (entries: CareerEntry[], now = new Date()): number => {
  const months = entries.reduce((sum, entry) => sum + periodMonths(entry.period, now), 0);
  return Math.floor(months / 12);
};

/** level 4（設計と技術判断ができる）のスキル名。要約の裏づけに使う。 */
export const coreSkills = (groups: SkillGroup[]): string[] =>
  groups.flatMap((group) => group.items.filter((s) => s.level >= 4).map((s) => s.name));

/** 経歴に登場する技術の重複なし一覧。 */
export const allStack = (entries: CareerEntry[]): string[] =>
  Array.from(new Set(entries.flatMap((entry) => entry.stack)));

/** "2026-07-24" → "2026年7月24日" */
export const formatDate = (iso: string): string => {
  const [year, month, day] = iso.split("-").map(Number);
  return `${year}年${month}月${day}日`;
};
