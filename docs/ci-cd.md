# CI / CD

このリポジトリの GitHub Actions ワークフローの説明。

## ワークフロー

| ファイル | トリガー | 内容 |
| --- | --- | --- |
| `.github/workflows/ci.yml` | main への push / PR / 手動 | lint → build → Playwright E2E。スクリーンショット付きレポートを Artifacts に保存 |
| `.github/workflows/deploy-pages.yml` | main への push / 手動 | Next.js を静的書き出しして GitHub Pages へデプロイ |

どちらも **`package.json` が存在しない間は全ステップをスキップして green で終わる**ため、アプリ実装前の main にマージしても安全。

## アプリ側に求められる契約

新しいアプリを実装するときは以下を満たすこと。

### npm scripts

```jsonc
{
  "scripts": {
    "lint": "eslint",            // 静的解析
    "build": "next build",       // プロダクションビルド
    "test:e2e": "playwright test" // E2E テスト
  }
}
```

### next.config.ts(Pages 用の静的書き出し対応)

```ts
const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT === "export" ? "export" : undefined,
  basePath: process.env.NEXT_BASE_PATH || undefined,
};
```

デプロイ時は `NEXT_OUTPUT=export NEXT_BASE_PATH=/<repo名>` が渡され、`out/` が公開される。
通常の `npm run dev` / `npm run build` には影響しない。

## リポジトリ設定(設定済み・変更時の参考)

- **Settings → Pages → Source: GitHub Actions**
- **Settings → Environments → `github-pages` → Deployment branches**: main を許可
  - ⚠️ Pages を無効化→再有効化すると environment が初期化され、この設定も消える
  - 別ブランチのプレビューをデプロイしたい場合: そのブランチを許可に追加し、
    `deploy-pages.yml` の `push.branches` にも一時追加する(マージ後に戻す)

## デプロイ先

https://axhiz-dev.github.io/ishida-takuya/
