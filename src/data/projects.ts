// 制作実績（Projects/Works）。※プレースホルダ。

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  /** カテゴリ / 役割の短いラベル */
  category: string;
  year: string;
  description: string;
  tech: string[];
  /** カードのアクセントに使うグラデーション（Tailwind の from/to クラス断片） */
  accent: string;
  links?: ProjectLink[];
};

export const projects: Project[] = [
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
