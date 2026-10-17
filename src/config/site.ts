/**
 * サイト全体の定数。
 *
 * 方針：設定は環境変数ではなく **このファイル** に置く。
 * 例外は NEXT_OUTPUT / NEXT_BASE_PATH と公開フォームID。前者は
 * GitHub Pages のデプロイ経路が要求するインフラ変数のため
 * next.config.ts とこのファイルで読む。NEXT_PUBLIC_FORMSPREE_FORM_ID は
 * components/business/tour/config.ts で読む公開設定（秘密鍵ではない）。
 *
 * next/link は内部リンクに basePath を付ける。
 * next/image の src と通常の a の静的ファイルには BASE_PATH を明示する。
 */

/** GitHub Pages のサブパス。ローカルでは空文字。 */
export const BASE_PATH = process.env.NEXT_BASE_PATH ?? "";

/** 公開 URL。OGP と印刷ヘッダに出る。 */
export const SITE_URL = "https://axhiz-dev.github.io/ishida-takuya";

/**
 * 中身がまだダミーであることを明示するフラグ。
 * 実データに差し替えたら false にする（表示上の注意書きが消える）。
 */
export const IS_PLACEHOLDER_CONTENT = true;

/** ページのメタ情報。オーディエンスごとに文言を変える。 */
export const ROUTES = {
  gate: {
    path: "/",
    title: "石田卓也 — ソフトウェアエンジニア",
    description:
      "Web エンジニア 石田卓也の自己紹介サイト。採用・技術の方向けの職務経歴と、お仕事のご相談の方向けのご案内に分かれています。",
  },
  engineer: {
    path: "/engineer",
    title: "職務経歴 — 石田卓也",
    description:
      "石田卓也の職務経歴書。担当領域・技術スタック・制作実績をこの 1 ページにまとめています。",
  },
  business: {
    path: "/business",
    title: "AI活用・伴走支援 — 石田卓也",
    description:
      "いつもの仕事に合わせて、AIの使い方を一緒に考えます。Excel集計やLINEでのシフト回収・調整を、会話形式のサンプルで体験できます。",
    /**
     * ページ内ナビ。**並べ替えたいときはこの配列を触るだけでよい。**
     * デモを最初に置いているのは、実績がない段階で唯一機能する証拠だから。
     */
    sections: [
      { id: "pricing", label: "支援内容・費用" },
      { id: "process", label: "相談から利用開始まで" },
      { id: "faq", label: "よくある質問" },
      { id: "about", label: "自己紹介" },
      { id: "contact", label: "無料相談" },
    ],
    cta: { label: "無料で相談する", href: "/business#contact" },
  },
} as const;

/** 機能フラグ。 */
export const FEATURES = {
  /**
   * 職務経歴ページに「PDF出力」ボタンを出す。
   * 押すとブラウザの印刷を呼ぶ（サーバーを持たないので生成は端末側）。
   * 紙のレイアウトは src/components/engineer/ResumeDocument.tsx が持つ。
   */
  pdfExport: true,
} as const;
