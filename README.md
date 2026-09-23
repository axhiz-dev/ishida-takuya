# ishida-takuya

石田卓也の自己紹介サイト。読み手によって見せるものを URL で切り替えます。

| URL | 相手 | 中身 |
| --- | --- | --- |
| `/` | すべて | 1 画面の入口。左右のパネルでどちらのページに進むかを選ぶ |
| `/engineer` | 採用担当・エージェント | 職務経歴書。URL を送ればそれだけで経歴が伝わる。技術タグで案件を絞り込める。PDF 出力あり |
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
│  ├─ (gate)/               /            Tailwind v4（engineer.css を共有）
│  ├─ (engineer)/engineer/  /engineer    Tailwind v4
│  └─ (business)/business/  /business    トークン + CSS Modules
├─ components/
│  ├─ common/               MarkedHeading・ダミー表示
│  ├─ engineer/             画面版（EngineerScreen）・紙版（ResumeDocument）・演出の小物
│  └─ business/             デモ 2 つ・試算・浮遊ナビ・顔写真
├─ content/                 ★ 表示される文章とデータはすべてここ
│  ├─ profile.ts            氏名・連絡先・最終更新（3 面で共有する唯一の身元）
│  ├─ engineer.ts           ★ /engineer の職務要約・経歴・副業・スキル
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

`/` と `/engineer` は **Tailwind v4**、`/business` は
**CSS Modules + カスタムプロパティ**です。混ざっていません。

**分離は import の位置だけで保っています。** ルートグループごとに
`<html>` を持つ構成なので、`src/styles/engineer.css` を
`(gate)/layout.tsx` と `(engineer)/layout.tsx` からしか読まなければ、
Tailwind の preflight は `/business` に届きません。
**この import を `(business)` のレイアウトへ持っていかないこと。**
`e2e/smoke.spec.ts` の「Tailwind が /business へ漏れていない」が
実際にユーティリティが効くかどうかを見ているので、持っていくとそこで落ちます。

### 設計上の決めごと

- **設定はコードに置く。** 環境変数は `NEXT_OUTPUT` / `NEXT_BASE_PATH` の 2 つだけで、
  これは GitHub Pages のデプロイ経路が要求するインフラ変数。`next.config.ts` と
  `src/config/site.ts` の中でしか読まない。
- **色と書体はトークン経由でしか使わない。** `/` と `/business` は
  `src/styles/tokens.css`、`/engineer` は `src/styles/engineer.css` の `@theme` が出所。
  コンポーネントに生の色を書かない。
- **導出できる数字は導出する。** 通算年数は `content/engineer.ts` の在籍期間から
  計算していて（営業職の期間は除く）、入口の左パネルと `/engineer` のヘッダに出る数字は
  必ず一致します。手で書ける場所を作らないための決めごとです。
- **数字は確認できたものだけ書く。** スキルは経験年数の段階（5年以上 / 3年以上 / …）で持ち、
  バーの長さはそこから決まります。

### ページごとの見え方

| ページ | 地 | 構造 | ナビ / フッター | アクセント |
| --- | --- | --- | --- | --- |
| `/engineer` | オフホワイト・方眼 | ヘッダ・職務要約・経歴（技術タグで絞り込み・開閉カード）・スキル | 細いスティッキーナビ | 藍 |
| `/business` | ほぼ白 | 左が固定・右がスクロールで入れ替わる | 浮遊ピル / レターの結び | 青 + 緑 |
| `/` | オフホワイト・方眼 | 1 画面の分岐・hover で広がる左右パネル | — | 藍 |

書体は `/business` が **Bricolage Grotesque** / **Geist** / **JetBrains Mono** ＋
**Zen Kaku Gothic New**、`/` と `/engineer` は **Noto Sans JP** / **JetBrains Mono**
です（`src/lib/fonts.ts` と `src/lib/engineerFonts.ts`）。

### 印刷（PDF）

`/engineer` の右下「PDF出力」はブラウザの印刷を呼ぶだけです。サーバーを持たないので
生成は端末側に任せています。

**画面版と紙版はマークアップが別です。** 画面は
`src/components/engineer/EngineerScreen.tsx`、紙は
`src/components/engineer/ResumeDocument.tsx` が描き、`src/styles/engineer.css` の
`@media print` が属性だけを見て出し分けます。画面のデザインを変えても紙は変わりません。

| 属性 | 意味 |
| --- | --- |
| `data-print="hide"` | 紙には出さない（画面版の外枠） |
| `data-print="only"` | 紙にだけ出す（ResumeDocument の外枠） |
| `data-print="keep"` | 途中で改ページしない（案件・スキルの箱） |

紙は A4・白地に藍の差し色で、画面で絞り込んでいても全案件が載ります。
文字は画像化されないので検索とコピーができます（実測 5 ページ）。
`e2e/pdf.spec.ts` が毎回確かめています。

### コントラスト

`e2e/contrast.spec.ts` が 3 ページすべての文字を実測し、WCAG の 4.5:1 / 3:1 に
届かないものがあれば落とします。半透明の面はきちんと下地に重ねてから測るので、
`bg-white/[0.02]` のような面も正しく評価されます。

`/` と `/engineer` の `--color-ink-faint`（小さい注記の灰色）は、紙の色の上で
4.5:1 を保てる最も淡い値にしてあります。これより淡くすると落ちます。

デザインの選定根拠は各ページの CSS のコメントと
`.hallmark/log.json` に記録してあります。
