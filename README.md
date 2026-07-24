# ishida-takuya

石田拓也の自己紹介サイト。読み手によって見せるものを URL で切り替えます。

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
│  ├─ (engineer)/engineer/  /engineer    テーマ: almanac
│  └─ (business)/business/  /business    テーマ: studio
├─ components/              ページ専用のコンポーネントと、その CSS Module
├─ content/                 ★ 表示される文章とデータはすべてここ
├─ config/site.ts           ★ 定数と機能フラグ（環境変数ではない）
├─ lib/                     フォント定義・派生値の計算・フック
└─ styles/
   ├─ tokens.css            デザイントークンの単一の出所
   ├─ base.css              リセットと土台
   └─ print.css             @page と印刷時の色の差し替え
```

### 設計上の決めごと

- **設定はコードに置く。** 環境変数は `NEXT_OUTPUT` / `NEXT_BASE_PATH` の 2 つだけで、
  これは GitHub Pages のデプロイ経路が要求するインフラ変数。`next.config.ts` と
  `src/config/site.ts` の中でしか読まない。
- **色と書体はトークン経由でしか使わない。** コンポーネントの CSS に生の
  `oklch()` や `font-family` を書かない。`src/styles/tokens.css` が唯一の出所。
- **CSS フレームワークを入れていない。** CSS Modules + カスタムプロパティ。
  トークンの規律をそのまま保てるため。
- **モーションライブラリを入れていない。** 動きは 1 ページ 3 種類まで
  （ロード時の入場・現在地の追従・リンクの下線）。スクロールで全セクションを
  フェードインさせることはしない。
- **数字は確認できたものだけ書く。** データ側で `value` を省略できるようにしてあり、
  未確定の数字は表示しない。

### ページごとのテーマ

`<html data-theme="...">` で切り替えます。フォント変数のクラスも
**同じ要素**に付けること（別要素に分けると `[data-theme]` から
`var(--font-*)` を解決できず、既定フォントに落ちます）。

| ページ | テーマ | 構造 | 書体 | アクセント |
| --- | --- | --- | --- | --- |
| `/engineer` | `almanac` | 1 カラムの文書 + 索引レール | Hanken Grotesk / IBM Plex Mono / Noto Sans JP | 青 |
| `/business` | `studio` | 主張と証拠の左右交互 | Fraunces / Geist / Zen Old Mincho | 深緑 |
| `/` | `gate` | 1 画面の分岐 | 上記の予告 | 両方を 1 点ずつ |

デザインの選定根拠は各ページの CSS Module 冒頭のコメントと
`.hallmark/log.json` に記録してあります。
