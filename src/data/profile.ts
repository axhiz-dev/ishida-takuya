// プロフィール（ヒーロー・About・Contact で使用）。
// ※内容はプレースホルダ。オーナーがここを実データに差し替える想定。

export type SocialLink = {
  label: string;
  /** aria-label 等に使う識別子 */
  kind: "github" | "x" | "zenn" | "mail" | "linkedin";
  href: string;
};

export type Stat = {
  /** 数値部分（カウントアップ対象） */
  value: number;
  /** 数値のあとに付く記号（+ や % など） */
  suffix?: string;
  label: string;
};

export const profile = {
  name: "石田 拓也",
  nameEn: "Ishida Takuya",
  role: "Web エンジニア / フロントエンド",
  /** ヒーローのキャッチコピー（1行目・2行目に分割） */
  tagline: ["体験を、", "コードで設計する。"],
  location: "Tokyo, Japan",
  available: true,
  availableText: "新規のお仕事・ご相談を受付中",
  /** ヒーロー直下の1行サマリ */
  lead: "ユーザー体験の質にこだわる Web エンジニアです。要件定義から UI 設計、フロントエンド実装、パフォーマンス改善、CI/CD の整備までを一気通貫で担当します。",
  /** About セクションの本文（段落配列） */
  bio: [
    "受託開発からスタートし、自社プロダクトのスタートアップを経て、現在はフリーランスとして複数のプロダクト開発に携わっています。得意領域はフロントエンドですが、「動くもの」だけでなく「速く・壊れにくく・関わる人が幸せに開発を続けられるもの」を作ることを大切にしています。",
    "TypeScript と React / Next.js を軸に、デザインシステムの構築、アクセシビリティ、Core Web Vitals の最適化を得意とします。バックエンドや IaC にも手が届くため、小〜中規模のプロダクトなら一人で 0 → 1 を立ち上げられます。",
    "「なぜこの実装なのか」を言語化してチームに残すことを信条にしており、レビュー文化やドキュメント整備を通じてチーム全体の開発速度を底上げすることに喜びを感じます。",
  ],
  stats: [
    { value: 8, suffix: "年", label: "Web 開発の経験" },
    { value: 40, suffix: "+", label: "手掛けたプロジェクト" },
    { value: 15, suffix: "+", label: "関わったチーム" },
  ] as Stat[],
  socials: [
    { label: "GitHub", kind: "github", href: "https://github.com/axhiz-dev" },
    { label: "X (Twitter)", kind: "x", href: "https://x.com/" },
    { label: "Zenn", kind: "zenn", href: "https://zenn.dev/" },
    { label: "Email", kind: "mail", href: "mailto:axhiz.ozi@gmail.com" },
  ] as SocialLink[],
  email: "axhiz.ozi@gmail.com",
};
