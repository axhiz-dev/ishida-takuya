# ishida-takuya

石田卓也の自己紹介サイト。読み手によって見せるものを URL で切り替えます。

| URL | 相手 | 中身 |
| --- | --- | --- |
| `/` | すべて | 1 画面の入口。どちらのページに進むかを選ぶ |
| `/engineer` | 採用担当・エージェント | 職務経歴書。URL を送ればそれだけで経歴が伝わる。PDF 出力あり |
| `/business` | 事業側の相談相手 | できることと実績。信頼性と親近感のためのページ |

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
│  ├─ (gate)/               /            テーマ: gate
│  ├─ (engineer)/engineer/  /engineer    テーマ: engineer-dark / engineer-light
│  └─ (business)/business/  /business    テーマ: business
├─ components/
│  ├─ common/               MarkedHeading・ダミー表示
│  ├─ icons/                ★ 技術ロゴの対応表と TechIcon
│  ├─ engineer/             章立て・進行レール・タイムライン・テーマ切替
│  └─ business/             デモ 2 つ・試算・浮遊ナビ・顔写真
├─ content/                 ★ 表示される文章とデータはすべてここ
├─ config/site.ts           ★ 定数・機能フラグ・章の一覧（環境変数ではない）
├─ lib/                     フォント定義・テーマ初期化・派生値・フック
└─ styles/
   ├─ tokens.css            デザイントークンの単一の出所（4 テーマ）
   ├─ base.css              リセット・ハイライト帯・章の入場・scroll-snap
   └─ print.css             @page と、印刷時に全テーマを白黒へ差し替える指定
```

### 設計上の決めごと

- **設定はコードに置く。** 環境変数は `NEXT_OUTPUT` / `NEXT_BASE_PATH` の 2 つだけで、
  これは GitHub Pages のデプロイ経路が要求するインフラ変数。`next.config.ts` と
  `src/config/site.ts` の中でしか読まない。
- **色と書体はトークン経由でしか使わない。** コンポーネントの CSS に生の
  `oklch()` や `font-family` を書かない。`src/styles/tokens.css` が唯一の出所。
- **CSS フレームワークを入れていない。** CSS Modules + カスタムプロパティ。
  トークンの規律をそのまま保てるため。
- **モーションライブラリを入れていない。** 動きは章ごとの入場（1 回だけ・戻っても
  再生しない）、現在地の追従、リンクの下線、ゲートのカーソル追従だけ。
  スクロールで全セクションを延々とフェードインさせることはしない。
- **数字は確認できたものだけ書く。** データ側で `value` を省略できるようにしてあり、
  未確定の数字は表示しない。

### ページごとのテーマ

`<html data-theme="...">` で切り替えます。フォント変数のクラスも
**同じ要素**に付けること（別要素に分けると `[data-theme]` から
`var(--font-*)` を解決できず、既定フォントに落ちます）。

| ページ | テーマ | 構造 | ナビ / フッター | アクセント |
| --- | --- | --- | --- | --- |
| `/engineer` | `engineer-dark`（既定）／ `engineer-light` | 1 スクロール 1 章・scroll-snap + 進行レール | 畳まるナビ / マストヘッド | 青 + 琥珀 |
| `/business` | `business`（ライト固定） | 左が固定・右がスクロールで入れ替わる | 浮遊ピル / レターの結び | 青 + 緑 |
| `/` | `gate` | 1 画面の分岐・カーソル追従の光 | — | 両方を 1 点ずつ |

書体は全ページ共通で **Bricolage Grotesque**（見出し・可変幅）/ **Geist**（本文）/
**JetBrains Mono**（ラベル）、和文は **Zen Kaku Gothic New** と **Noto Sans JP**。
**共通の青**が「同じ人が作った」ことを担保し、副色でページの温度を分けています。

### `/engineer` のテーマ切り替え

- 初回は**ダーク**。このページはダークの見え方そのものが作品なので、
  OS のライト設定に合わせて既定を変えると設計意図が隠れてしまう
- 一度でも切り替えたら `localStorage` に記憶して以後は必ず従う
- `<head>` の同期スクリプトが描画前に属性を確定させるので、リロードでチラつかない
- **印刷は常に白黒**。ダークで表示していても PDF は白黒 A4 で出る

### 1 スクロール 1 章（scroll-snap）

`src/config/site.ts` の `ROUTES.engineer.sections` が章の定義です。
**章を足したいときはこの配列に 1 行足すだけ。**

`snap: true` の章は 1 画面に収まり、スクロールで引っかかります。
中身の詰まった章（経歴・事例）は `snap: false` にして内部を普通にスクロールさせています。
引っかかりは `proximity` に留め、**低い画面（高さ 640px 未満）とモーション低減設定では
切れる**ようにしてあります。読者と戦わないための逃げ道です。

### 技術ロゴ

`src/components/icons/registry.ts` が唯一の対応表です。**ロゴを足すときはここだけ触ります。**

- `simple-icons`（MIT）をバンドルして自前配信。外部リクエストは発生しません
- AWS・Java・Oracle・Playwright は商標上の理由で simple-icons が配布していないので、
  **偽のロゴを描かず**、色つきのテキストチップとして出しています
- 地の明暗で沈むロゴ（Next.js の黒など）に備えて、ライト用とダーク用の色を別々に持てます
- 対応表に無い名前は汎用色のチップになるので、`content` に何を書いても表示は壊れません

デザインの選定根拠は各ページの CSS Module 冒頭のコメントと
`.hallmark/log.json` に記録してあります。
