// 職務経歴（Career タイムライン）。※プレースホルダ。

export type CareerEntry = {
  /** 表示期間（例: 2023.04 - 現在） */
  period: string;
  company: string;
  /** 会社の一言説明 */
  companyNote: string;
  role: string;
  /** 概要（1〜2文） */
  summary: string;
  /** 主な成果（箇条書き） */
  highlights: string[];
  /** 使用技術タグ */
  tech: string[];
};

export const career: CareerEntry[] = [
  {
    period: "2022.07 – 現在",
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
    period: "2019.04 – 2022.06",
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
    period: "2016.04 – 2019.03",
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
