// スキル（Skills セクション）。level は 0-100 の主観的な習熟度。※プレースホルダ。

export type Skill = {
  name: string;
  /** 0-100。バーの充填率とカウントアップに使用 */
  level: number;
};

export type SkillCategory = {
  title: string;
  titleEn: string;
  /** カテゴリの一言 */
  note: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    title: "フロントエンド",
    titleEn: "Frontend",
    note: "最も得意とする領域。設計から表現・パフォーマンスまで。",
    skills: [
      { name: "TypeScript", level: 95 },
      { name: "React", level: 93 },
      { name: "Next.js", level: 90 },
      { name: "Tailwind CSS", level: 88 },
      { name: "アクセシビリティ / Web 標準", level: 82 },
      { name: "アニメーション / Canvas", level: 78 },
    ],
  },
  {
    title: "バックエンド",
    titleEn: "Backend",
    note: "0→1 を一人で立ち上げられる程度には手が届く。",
    skills: [
      { name: "Node.js", level: 84 },
      { name: "REST / GraphQL API 設計", level: 80 },
      { name: "PostgreSQL / RDB 設計", level: 76 },
      { name: "Go", level: 62 },
    ],
  },
  {
    title: "インフラ / DX",
    titleEn: "Infra & DX",
    note: "壊れにくく、開発が続けやすい仕組みづくり。",
    skills: [
      { name: "CI/CD (GitHub Actions)", level: 85 },
      { name: "Docker", level: 80 },
      { name: "AWS / Cloudflare", level: 72 },
      { name: "テスト設計 (E2E / Unit)", level: 82 },
    ],
  },
];
