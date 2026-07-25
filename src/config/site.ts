/**
 * サイト全体の定数。
 *
 * 方針：設定は環境変数ではなく **このファイル** に置く。
 * 例外は NEXT_OUTPUT / NEXT_BASE_PATH の 2 つだけで、これは
 * GitHub Pages のデプロイ経路が要求するインフラ変数のため
 * next.config.ts とこのファイルの中でしか読まない。
 *
 * 内部リンクと画像は next/link・next/image が basePath を
 * 自動で付けるので、アプリのコードで basePath を意識する必要はない。
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
    title: "石田拓也 — ソフトウェアエンジニア",
    description:
      "Web エンジニア 石田拓也の自己紹介サイト。採用・技術の方向けの職務経歴と、お仕事のご相談の方向けのご案内に分かれています。",
  },
  engineer: {
    path: "/engineer",
    title: "職務経歴 — 石田拓也",
    description:
      "石田拓也の職務経歴書。担当領域・技術スタック・意思決定の記録をこの 1 ページにまとめています。",
    /**
     * 章。id は各 <section> の id と一致させる。
     *
     * `snap: true` の章は 1 画面に収まり、スクロールで引っかかる。
     * 中身の詰まった章（経歴・事例）は `snap: false` にして
     * 内部を普通にスクロールさせる。ここを間違えると読者と戦うことになる。
     *
     * **章を足したいときはこの配列に 1 行足すだけでよい。**
     */
    sections: [
      { id: "intro", no: "00", label: "はじめに", snap: true },
      { id: "stack", no: "01", label: "スタック", snap: true },
      { id: "work", no: "02", label: "経歴", snap: false },
      { id: "cases", no: "03", label: "事例", snap: false },
      { id: "contact", no: "04", label: "連絡先", snap: true },
    ],
  },
  business: {
    path: "/business",
    title: "お仕事のご相談 — 石田拓也",
    description:
      "Web エンジニア 石田拓也の、できることとこれまでの実績。開発のご相談・システム導入のご検討にあたっての判断材料としてご覧ください。",
  },
} as const;

/** 機能フラグ。 */
export const FEATURES = {
  /** 職務経歴ページに「PDFで保存」ボタンを出す。 */
  pdfExport: true,
} as const;
