import type { SkillCategory } from "./types";

/** スキルと経験年数（カテゴリ別・主要なもの） */
export const skillCategories: SkillCategory[] = [
  {
    category: "フロントエンド",
    items: [
      { name: "React", years: "5年以上" },
      { name: "TypeScript", years: "3年以上" },
      { name: "JavaScript", years: "3年以上" },
      { name: "HTML / CSS", years: "3年以上" },
      { name: "Nuxt.js / Vue.js", years: "3年以上" },
      { name: "Next.js", years: "1年以上" },
      { name: "Redux", years: "1年以上" },
      { name: "Electron", years: "1年以上" },
    ],
  },
  {
    category: "バックエンド",
    items: [
      { name: "Node.js", years: "3年以上" },
      { name: "Python", years: "3年以上" },
      { name: "Go", years: "1年以上" },
      { name: "NestJS", years: "1年以上" },
      { name: "FastAPI", years: "1年以上" },
      { name: "PHP / Laravel", years: "1年以上" },
    ],
  },
  {
    category: "インフラ / CI・CD",
    items: [
      { name: "AWS", years: "3年以上" },
      { name: "ECS", years: "3年以上" },
      { name: "Docker", years: "3年以上" },
      { name: "マイクロサービス", years: "3年以上" },
      { name: "AWS CDK", years: "1年以上" },
      { name: "GCP", years: "1年以上" },
      { name: "GitHub Actions", years: "3年以上" },
    ],
  },
  {
    category: "データベース",
    items: [
      { name: "PostgreSQL", years: "3年以上" },
      { name: "MySQL", years: "3年以上" },
      { name: "DynamoDB", years: "1年以上" },
    ],
  },
  {
    category: "AI",
    items: [
      { name: "LLM連携（Azure OpenAI）", years: "1年以上" },
      { name: "プロンプト設計", years: "1年以上" },
      { name: "Claude Code 活用・社内推進", years: "1年" },
    ],
  },
];
