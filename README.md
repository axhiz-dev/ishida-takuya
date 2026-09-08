# ishida-takuya

石田卓也の自己紹介サイト。読み手によって見せるものを URL で切り替えます。

| URL | 相手 | 中身 |
| --- | --- | --- |
| `/` | すべて | 1 画面の入口。どちらのページに進むかを選ぶ |
| `/engineer` | 採用担当・エージェント | 職務経歴書。URL を送ればそれだけで経歴が伝わる。PDF 出力あり（ダーク固定） |
| `/business` | 仕事を頼みたい会社の人 | 業務の自動化。触れるデモと料金 |

公開先: https://axhiz-dev.github.io/ishida-takuya/

**内容を更新したいだけの場合は [docs/content-guide.md](docs/content-guide.md) を見てください。**
`src/content/` を編集して push すれば自動で再公開されます。

---

## 開発

```bash
npm install
npm run dev          # http://localhost:3000
```

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバ |
| `npm run build` | プロダクションビルド |
| `npm run build:export` | 静的書き出し（`out/`）。公開されるものと同じ形 |
| `npm run lint` | 静的解析 |
| `npm run typecheck` | 型チェック |
| `npm run test:e2e` | E2E。`out/` を配信して実行し、`screenshots/` にキャプチャと PDF を出す |

CI とデプロイの仕組みは [docs/ci-cd.md](docs/ci-cd.md) にあります。

---

## 構成

```
src/
├─ app/                     ルートグループごとに独立した root layout を持つ
│  ├─ (gate)/               /            トークン + CSS Modules
│  ├─ (engineer)/engineer/  /engineer    Tailwind v4 + motion（ダーク固定）
│  └─ (business)/business/  /business    トークン + CSS Modules
├─ components/
│  ├─ common/               MarkedHeading・ダミー表示
│  ├─ engineer/             ナビ・進捗バー・6 つの節・演出プリミティブ
│  └─ business/             デモ 2 つ・試算・浮遊ナビ・顔写真
├─ content/                 ★ 表示される文章とデータはすべてここ
│  ├─ profile.ts            氏名・連絡先・最終更新（3 面で共有する唯一の身元）
│  ├─ engineer.ts           ★ /engineer の原稿・経歴・スキル・制作実績
│  └─ business.ts           ★ /business の原稿
├─ config/site.ts           ★ 定数・機能フラグ（環境変数ではない）
├─ lib/                     フォント定義・派生値・フック
└─ styles/
   ├─ tokens.css            / と /business のデザイントークン
   ├─ base.css              / と /business のリセット・入場
   ├─ print.css             / と /business の @page
   └─ engineer.css          ★ /engineer だけの Tailwind + トークン + 印刷
```

### 2 系統のスタイルが同居している

`/engineer` だけ **Tailwind v4 + motion**、`/` と `/business` は
**CSS Modules + カスタムプロパティ**です。混ざっていません。

`/engineer` は[公開中のサイト](https://axhiz-dev.github.io/ishida-takuya/)の
実装をそのまま持ち込んだもので、あの見え方を再現するのが目的なので、
配色・書体・組み方をあちらに合わせてあります。

**分離は import の位置だけで保っています。** ルートグループごとに
`<html>` を持つ構成なので、`src/styles/engineer.css` を
`(engineer)/layout.tsx` からしか読まなければ、Tailwind の preflight は
`/engineer` の中に閉じます。**この import をほかのレイアウトへ持っていかないこと。**
`e2e/smoke.spec.ts` の「Tailwind が /engineer の外へ漏れていない」が
3 ページすべてで実際にユーティリティが効くかどうかを見ているので、
持っていくとそこで落ちます。

### 設計上の決めごと

- **設定はコードに置く。** 環境変数は `NEXT_OUTPUT` / `NEXT_BASE_PATH` の 2 つだけで、
  これは GitHub Pages のデプロイ経路が要求するインフラ変数。`next.config.ts` と
  `src/config/site.ts` の中でしか読まない。
- **色と書体はトークン経由でしか使わない。** `/` と `/business` は
  `src/styles/tokens.css`、`/engineer` は `src/styles/engineer.css` の `@theme` が出所。
  コンポーネントに生の色を書かない。
- **導出できる数字は導出する。** 通算年数は `content/engineer.ts` の在籍期間から
  計算していて、ゲートの扉（「10 年 / …」）と `/engineer` の About に出る数字は
  必ず一致します。手で書ける場所を作らないための決めごとです。
- **数字は確認できたものだけ書く。** スキルの習熟度（0-100）は主観値で、
  そのことを含めて公開中のサイトから引き継いでいます。

### ページごとの見え方

| ページ | 地 | 構造 | ナビ / フッター | アクセント |
| --- | --- | --- | --- | --- |
| `/engineer` | ほぼ黒（切り替えなし） | 6 つの節・スクロール連動のタイムライン | 固定グラスナビ / マストヘッド | シアン → 紫 → フクシア |
| `/business` | ほぼ白 | 左が固定・右がスクロールで入れ替わる | 浮遊ピル / レターの結び | 青 + 緑 |
| `/` | ほぼ黒 | 1 画面の分岐・カーソル追従の光 | — | 両方を 1 点ずつ |

書体は `/` と `/business` が **Bricolage Grotesque** / **Geist** / **JetBrains Mono** ＋
**Zen Kaku Gothic New**、`/engineer` は **Space Grotesk** / **Noto Sans JP** /
**JetBrains Mono** です（`src/lib/fonts.ts` と `src/lib/engineerFonts.ts`）。

### `/engineer` の節を足す

`src/content/engineer.ts` の `engineerNav` に 1 行足し、
`src/app/(engineer)/engineer/page.tsx` に同じ `id` の `<section>` を置きます。
ナビの現在地は `IntersectionObserver` が拾うので、ほかに触る場所はありません。

### 印刷（PDF）

`/engineer` の右上「PDF」はブラウザの印刷を呼ぶだけです。サーバーを持たないので
生成は端末側に任せています。紙のレイアウトは `src/styles/engineer.css` の
`@media print` が持ちます。

Tailwind のユーティリティはクラス名が意味を持たないので、**印刷で消したい装飾には
JSX 側で `data-print="hide"` を付けます。** 印刷用 CSS はその属性と構造セレクタしか
見ません（クラス名を並べると、ユーティリティを 1 つ足すたびに印刷が壊れます）。

| 属性 | 意味 |
| --- | --- |
| `data-print="hide"` | 紙には出さない（ナビ・パーティクル・ぼかし・バー・ウォーターマーク） |
| `data-print="only"` | 紙にだけ出す（氏名・連絡先・URL・最終更新のヘッダ） |
| `data-print="linear"` | 左右交互の 2 段組を 1 列に落とす（経歴） |

**ダークで表示していても紙は必ず白黒の A4 で出ます。** 文字は画像化されないので
検索とコピーができます（実測 4 ページ）。`e2e/pdf.spec.ts` が毎回測っています。

### コントラスト

`e2e/contrast.spec.ts` が 3 ページすべての文字を実測し、WCAG の 4.5:1 / 3:1 に
届かないものがあれば落とします。半透明の面はきちんと下地に重ねてから測るので、
`bg-white/[0.02]` のような面も正しく評価されます。

公開中のサイトから 1 つだけ値を変えているのが `--color-ink-faint` です。
`#6b6b80` は地の上で 3.7:1 しかなく、小さい文字に使われていたので
`#82829a`（実測 5.0:1）まで持ち上げました。

デザインの選定根拠は各ページの CSS のコメントと
`.hallmark/log.json` に記録してあります。
