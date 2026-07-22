import type { Profile } from "./types";

export const profile: Profile = {
  nameJa: "石田 卓也",
  nameEn: "Takuya Ishida",
  title: "フルスタックエンジニア",
  bizTagline: "業務の困りごとを、Webとシステムの力で解決するエンジニアです。",
  summary: [
    "エンジニア歴5年のフルスタックエンジニアです。フロントエンドは React、バックエンドは Node.js / Go をメインとして、領域を問わず実装します。",
    "「本当にユーザーへ価値を届けられる仕様とは何か？」を常に考え、仕様に疑問を感じた際は簡易PoCを実装してPdMに提案するなど、より良いプロダクトにするためのコミュニケーションや開発を心がけています。",
    "現職ではHR系SaaSのノーコードツール・ダッシュボードの2プロダクトを主に担当し、設計から保守運用まで一貫してフルスタックで携わっています。また、Claude Code を積極活用・社内推進するなど開発サイクルの高速化にも取り組んでいます。",
    "直近では「LiveDriver」という個人開発サービスをローンチし、開発だけでなくマーケティング・営業まで自ら行っています。前職（DELL）での営業経験も活かしながら、エンジニアとビジネスの両軸で動ける人材を目指しています。",
  ],
  links: [
    // TODO: GitHubアカウントのURLをご自身のものに変更してください
    { label: "GitHub", url: "https://github.com/axhiz-dev" },
    { label: "LiveDriver（個人開発）", url: "https://livedriver.app" },
  ],
  // TODO: 公開サイトに載せる連絡先です。別のアドレスにしたい場合は変更してください
  email: "axhiz.ozi@gmail.com",
};
