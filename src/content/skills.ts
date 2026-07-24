import type { SkillGroup } from "./types";

/**
 * スキル。
 *
 * level は自己申告なので、evidence（どこで使ったか）を必ず添える。
 * 根拠のないレベル表は読み手にとって情報量がゼロに等しい。
 *
 *   1 = 触れたことがある
 *   2 = 業務で使える
 *   3 = 主戦場
 *   4 = 設計と技術判断ができる
 */
export const skills: SkillGroup[] = [
  {
    category: "言語",
    items: [
      {
        name: "TypeScript",
        level: 4,
        years: 7,
        evidence: "ミナトソフトで型設計の方針策定とレビューを担当",
      },
      {
        name: "JavaScript",
        level: 4,
        years: 9,
        evidence: "全社で使用。レガシーコードの読み解きを含む",
      },
      { name: "PHP", level: 3, years: 3, evidence: "ホシノデジタルで受託案件を担当" },
      { name: "Java", level: 2, years: 2, evidence: "北村システムズで基幹システム改修" },
      { name: "Go", level: 2, years: 1, evidence: "社内ツールの実装" },
    ],
  },
  {
    category: "フロントエンド",
    items: [
      {
        name: "React",
        level: 4,
        years: 6,
        evidence: "設計方針の策定・移行計画の立案・レビュー",
      },
      {
        name: "Next.js",
        level: 4,
        years: 5,
        evidence: "App Router での本番運用。レンダリング戦略の選定を含む",
      },
      { name: "Vue.js / Nuxt", level: 3, years: 3, evidence: "受託案件で複数本" },
      {
        name: "CSS 設計",
        level: 4,
        years: 9,
        evidence: "デザイントークンの設計とデザイナーとの運用ルール整備",
      },
      {
        name: "アクセシビリティ",
        level: 3,
        years: 4,
        evidence: "WCAG 2.1 AA を基準にした実装とレビュー観点の整備",
      },
    ],
  },
  {
    category: "バックエンド / インフラ",
    items: [
      { name: "Node.js", level: 3, years: 6, evidence: "BFF・バッチの実装" },
      { name: "GraphQL", level: 3, years: 4, evidence: "スキーマ設計とクライアント実装" },
      { name: "PostgreSQL / MySQL", level: 3, years: 7, evidence: "設計・チューニング" },
      { name: "AWS", level: 3, years: 5, evidence: "ECS / Lambda / S3 を中心に構築と運用" },
      { name: "Terraform", level: 2, years: 2, evidence: "既存構成のコード化" },
    ],
  },
  {
    category: "開発プロセス",
    items: [
      {
        name: "テスト設計",
        level: 4,
        years: 6,
        evidence: "ユニット / E2E / ビジュアルリグレッションの使い分け",
      },
      { name: "CI/CD", level: 3, years: 6, evidence: "GitHub Actions でのパイプライン整備" },
      {
        name: "技術選定",
        level: 3,
        years: 4,
        evidence: "ADR による記録運用の立ち上げ",
      },
      { name: "オンボーディング設計", level: 3, years: 3, evidence: "資料整備とメンター" },
    ],
  },
];
