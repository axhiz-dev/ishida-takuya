// サイト全体のメタ情報・ナビゲーション定義。
// ここを編集すればタイトルやナビ項目を差し替えられる。

export type NavItem = {
  /** 遷移先セクションの id（page 内アンカー） */
  id: string;
  /** ナビに表示する日本語ラベル */
  label: string;
  /** 装飾用の英語ラベル */
  labelEn: string;
};

export const site = {
  title: "Ishida Takuya — Web Engineer Portfolio",
  shortTitle: "Ishida Takuya",
  description:
    "Web エンジニア 石田拓也のポートフォリオ。フロントエンドを軸に、設計・実装・パフォーマンス・DX までを一貫して手掛けます。",
  url: "https://axhiz-dev.github.io/ishida-takuya/",
  lang: "ja",
} as const;

export const navItems: NavItem[] = [
  { id: "about", label: "私について", labelEn: "About" },
  { id: "career", label: "職務経歴", labelEn: "Career" },
  { id: "skills", label: "スキル", labelEn: "Skills" },
  { id: "projects", label: "制作実績", labelEn: "Works" },
  { id: "contact", label: "お問い合わせ", labelEn: "Contact" },
];
