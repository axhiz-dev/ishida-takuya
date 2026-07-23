# Ishida Takuya — Portfolio

Web エンジニアのポートフォリオサイト。**React（Next.js 静的書き出し）だけでフロント完結**し、**GitHub Pages** に自動デプロイされます。

🔗 **公開URL**: https://axhiz-dev.github.io/ishida-takuya/

## 技術スタック

- **Next.js 15**（App Router / `output: "export"` による静的書き出し）
- **React 19** / **TypeScript**
- **Tailwind CSS v4**（CSS-first の `@theme` トークン）
- **Motion**（Framer Motion）— スクロールリビール・タイムライン・マイクロインタラクション
- 自作 **Canvas** パーティクル（ヒーロー背景、依存ライブラリなし）
- **Playwright** による E2E スモークテスト

サーバー・バックエンド・API は一切なし。画像も使わず SVG / CSS / Canvas のみで表現しています。

## コンテンツの編集

サイトに表示される内容はすべて `src/data/` に型付きで集約しています。ここを編集するだけで中身を差し替えられます（コンポーネントを触る必要はありません）。

| ファイル | 内容 |
| --- | --- |
| `src/data/profile.ts` | 名前・肩書き・自己紹介・SNS・連絡先 |
| `src/data/career.ts` | 職務経歴（タイムライン） |
| `src/data/skills.ts` | スキル（カテゴリ・習熟度） |
| `src/data/projects.ts` | 制作実績 |
| `src/data/site.ts` | サイトタイトル・ナビ項目 |

> 現在の内容はプレースホルダです。実際の経歴に置き換えてご利用ください。

## 開発

```bash
npm install
npm run dev        # http://localhost:3000
```

## スクリプト

| コマンド | 説明 |
| --- | --- |
| `npm run dev` | 開発サーバー |
| `npm run build` | 本番ビルド |
| `npm run lint` | ESLint |
| `npm run test:e2e` | Playwright E2E（**事前に `npm run build` が必要**） |

E2E は `next start` でビルド済み成果物を配信してテストします。ローカルでは次の順で実行してください。

```bash
npm run build
npm run test:e2e
```

## デプロイ

`main` ブランチへの push で GitHub Actions（`.github/workflows/deploy-pages.yml`）が起動し、
`NEXT_OUTPUT=export` / `NEXT_BASE_PATH=/ishida-takuya` を付与して静的書き出しした `out/` を GitHub Pages に公開します。

ローカルでデプロイ相当のビルドを再現する場合:

```bash
NEXT_OUTPUT=export NEXT_BASE_PATH=/ishida-takuya npm run build
# → out/ が生成される
```

## アクセシビリティ / パフォーマンス

- `prefers-reduced-motion` を尊重（パーティクル停止・演出を不透明度のみに抑制）
- 小型タッチ端末ではパーティクルを静的グラデーションにフォールバック
- transform / opacity のみのアニメーション、非表示タブで Canvas を停止
- セマンティックなランドマーク・フォーカスリング・十分なコントラスト
