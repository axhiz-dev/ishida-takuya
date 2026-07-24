import type { NextConfig } from "next";

/**
 * デプロイ契約は docs/ci-cd.md を参照。
 *
 *   NEXT_OUTPUT=export        → out/ に静的書き出し（GitHub Pages 用）
 *   NEXT_BASE_PATH=/<repo名>  → Pages のサブパス配信に対応
 *
 * 通常の `npm run dev` / `npm run build` には影響しない。
 * この 2 つはインフラ側の変数なので、アプリのコードからは
 * 直接読まず src/config/site.ts 経由で参照すること。
 */
const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT === "export" ? "export" : undefined,
  basePath: process.env.NEXT_BASE_PATH || undefined,

  // 静的書き出しでは Next の画像最適化サーバが存在しないため必須
  images: { unoptimized: true },

  // out/engineer/index.html の形で書き出す（Pages でも拡張子なし URL が引ける）
  trailingSlash: true,

  reactStrictMode: true,
};

export default nextConfig;
