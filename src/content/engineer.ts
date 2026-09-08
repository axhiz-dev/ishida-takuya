import type { Link, Period } from "./types";

/**
 * /engineer の中身。
 *
 * 公開中の https://axhiz-dev.github.io/ishida-takuya/ に載っている
 * 文言をそのまま持ち込んでいる。**内容はまだプレースホルダ**なので、
 * 実データに差し替えたら src/config/site.ts の
 * IS_PLACEHOLDER_CONTENT を false にすること。
 *
 * 氏名・メール・リンク・最終更新日はサイト全体で 1 つ（./profile.ts）を
 * 使う。ここに置くのは /engineer の画面にしか出ない原稿だけ。
 *
 * 在籍期間は from / to（"YYYY-MM"）で持ち、画面に出る
 * 「2022.07 – 現在」は lib/derive.ts で組み立てる。表示用の文字列を
 * 直接持たせると、通算年数の計算と表示がずれても誰も気づけない。
 */

/* ────────────────────────────── ヒーロー ── */

export const engineerHero = {
  role: "Web エンジニア / フロントエンド",
  location: "Tokyo, Japan",
  /** 見出し。和文は自動改行に任せず 2 行を明示する。2 行目にグラデーションが乗る。 */
  tagline: ["体験を、", "コードで設計する。"],
  available: true,
  availableText: "新規のお仕事・ご相談を受付中",
  lead: "ユーザー体験の質にこだわる Web エンジニアです。要件定義から UI 設計、フロントエンド実装、パフォーマンス改善、CI/CD の整備までを一気通貫で担当します。",
} as const;

/* ────────────────────────────── About ── */

/** About の本文。段落ごとに配列の 1 要素。 */
export const engineerBio: string[] = [
  "受託開発からスタートし、自社プロダクトのスタートアップを経て、現在はフリーランスとして複数のプロダクト開発に携わっています。得意領域はフロントエンドですが、「動くもの」だけでなく「速く・壊れにくく・関わる人が幸せに開発を続けられるもの」を作ることを大切にしています。",
  "TypeScript と React / Next.js を軸に、デザインシステムの構築、アクセシビリティ、Core Web Vitals の最適化を得意とします。バックエンドや IaC にも手が届くため、小〜中規模のプロダクトなら一人で 0 → 1 を立ち上げられます。",
  "「なぜこの実装なのか」を言語化してチームに残すことを信条にしており、レビュー文化やドキュメント整備を通じてチーム全体の開発速度を底上げすることに喜びを感じます。",
];

export type Stat = {
  value: number;
  /** 数値のあとに付く記号（+ や 年 など）。 */
  suffix?: string;
  label: string;
};

/**
 * About の数字。
 *
 * **経験年数はここに書かない。** career の期間から導出して
 * ゲート（/）の「◯ 年」と同じ 1 つの数字を使う。手で書くと
 * 2 箇所がずれて、同じサイトの中で違う年数が出る。
 */
export const engineerStats: Stat[] = [
  { value: 40, suffix: "+", label: "手掛けたプロジェクト" },
  { value: 15, suffix: "+", label: "関わったチーム" },
];

/* ────────────────────────────── ナビ ── */

export type NavItem = {
  /** 遷移先セクションの id（ページ内アンカー）。 */
  id: string;
  label: string;
  /** 装飾用の英語ラベル。 */
  labelEn: string;
};

/** 固定ナビの項目。**節を足したいときはここに 1 行足す。** */
export const engineerNav: NavItem[] = [
  { id: "about", label: "私について", labelEn: "About" },
  { id: "career", label: "職務経歴", labelEn: "Career" },
  { id: "skills", label: "スキル", labelEn: "Skills" },
  { id: "projects", label: "制作実績", labelEn: "Works" },
  { id: "contact", label: "お問い合わせ", labelEn: "Contact" },
];

/* ────────────────────────────── 職務経歴 ── */

export type EngineerCareerEntry = {
  period: Period;
  company: string;
  /** 会社の一言説明。読み手はたいてい社名を知らない。 */
  companyNote: string;
  role: string;
  /** 概要。1〜2 文。 */
  summary: string;
  highlights: string[];
  tech: string[];
};

export const engineerCareer: EngineerCareerEntry[] = [
  {
    period: { from: "2022-07", to: "present" },
    company: "フリーランス",
    companyNote: "受託・技術顧問",
    role: "フロントエンドリード / フルスタックエンジニア",
    summary:
      "複数のスタートアップ・事業会社に対し、フロントエンド設計から実装・改善、開発体制づくりまでを支援。",
    highlights: [
      "SaaS の管理画面を Next.js App Router で刷新し、初期表示を 4.2s → 1.1s に短縮",
      "デザインシステムを Tailwind + Storybook で整備し、UI 実装工数を約 40% 削減",
      "E2E / CI パイプラインを導入し、リリース時のデグレを継続的に検知できる体制を構築",
    ],
    tech: ["TypeScript", "Next.js", "React", "Tailwind CSS", "Playwright", "GitHub Actions"],
  },
  {
    period: { from: "2019-04", to: "2022-06" },
    company: "自社プロダクト系スタートアップ",
    companyNote: "BtoB SaaS",
    role: "Web エンジニア → フロントエンドリード",
    summary:
      "創業期に3人目のエンジニアとして参画。プロダクトの立ち上げから拡大期までフロントエンドを牽引。",
    highlights: [
      "React / TypeScript への移行を主導し、型安全な開発基盤へ刷新",
      "コンポーネント設計とレビュー文化を整え、増員したチームのオンボーディングを高速化",
      "アクセシビリティ対応と Core Web Vitals 改善でプロダクト品質を底上げ",
    ],
    tech: ["TypeScript", "React", "Redux", "Node.js", "GraphQL", "AWS"],
  },
  {
    period: { from: "2016-04", to: "2019-03" },
    company: "受託開発企業（SIer）",
    companyNote: "Web 受託開発",
    role: "Web エンジニア",
    summary:
      "コーポレートサイトから業務系 Web アプリまで、多様な案件で設計・実装・運用を経験。",
    highlights: [
      "10 件以上の Web 制作・開発案件をフロント〜サーバーサイドまで担当",
      "jQuery ベースの実装から SPA への移行を経験し、モダンフロントの基礎を確立",
      "顧客折衝・要件定義から入り、非エンジニアと合意形成する力を磨く",
    ],
    tech: ["JavaScript", "PHP", "Vue.js", "MySQL", "Docker"],
  },
];

/* ────────────────────────────── スキル ── */

export type EngineerSkill = {
  name: string;
  /** 0-100 の主観的な習熟度。バーの充填率とカウントアップに使う。 */
  level: number;
};

export type EngineerSkillCategory = {
  title: string;
  titleEn: string;
  /** カテゴリの一言。 */
  note: string;
  skills: EngineerSkill[];
};

export const engineerSkills: EngineerSkillCategory[] = [
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

/* ────────────────────────────── 制作実績 ── */

export type EngineerProject = {
  title: string;
  /** カテゴリ / 役割の短いラベル。 */
  category: string;
  year: string;
  description: string;
  tech: string[];
  /** カードのアクセントに使う Tailwind の from/to クラス断片。 */
  accent: string;
  links?: Link[];
};

export const engineerProjects: EngineerProject[] = [
  {
    title: "SaaS 管理ダッシュボード刷新",
    category: "フロントエンド設計 / パフォーマンス改善",
    year: "2024",
    description:
      "レガシー化した管理画面を Next.js App Router で再設計。データ量の多い一覧・グラフ表示を仮想化とサーバーコンポーネントで最適化し、初期表示を大幅に高速化しました。",
    tech: ["Next.js", "TypeScript", "TanStack Query", "Recharts", "Tailwind CSS"],
    accent: "from-cyan-400 to-violet-500",
    links: [{ label: "ケーススタディ", href: "#contact" }],
  },
  {
    title: "デザインシステム構築",
    category: "デザインシステム / DX",
    year: "2023",
    description:
      "散在していた UI をトークン設計から見直し、再利用可能なコンポーネント群として整備。Storybook とビジュアルリグレッションテストで品質を担保しました。",
    tech: ["React", "Storybook", "Tailwind CSS", "Chromatic"],
    accent: "from-violet-500 to-fuchsia-500",
    links: [{ label: "詳細を見る", href: "#contact" }],
  },
  {
    title: "リアルタイム・コラボツール",
    category: "フルスタック / 0→1",
    year: "2023",
    description:
      "複数人が同時編集できるドキュメントツールを個人開発。WebSocket による同期、楽観的更新、オフライン対応まで実装し、フロントからインフラまで一人で構築しました。",
    tech: ["Next.js", "Node.js", "WebSocket", "PostgreSQL", "Docker"],
    accent: "from-emerald-400 to-cyan-500",
    links: [{ label: "GitHub", href: "https://github.com/axhiz-dev" }],
  },
  {
    title: "インタラクティブ LP 制作",
    category: "表現 / アニメーション",
    year: "2022",
    description:
      "Canvas と WebGL を用いたスクロール連動の演出を持つブランドサイトを制作。リッチな表現とパフォーマンス・アクセシビリティの両立をテーマにしました。",
    tech: ["TypeScript", "Canvas", "GSAP", "Vite"],
    accent: "from-amber-400 to-fuchsia-500",
    links: [{ label: "サイトを見る", href: "#contact" }],
  },
];
