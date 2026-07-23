import type { NextConfig } from "next";

// CI 契約（.github/workflows）に厳密に一致させる:
//  - deploy 時のみ NEXT_OUTPUT=export / NEXT_BASE_PATH=/<repo> が渡される
//  - 通常ビルド（ci.yml）では両方 undefined
const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT === "export" ? "export" : undefined,
  basePath: process.env.NEXT_BASE_PATH || undefined,
  // 静的書き出しでは画像最適化サーバーが無いため無効化（画像自体は未使用だが防御的に設定）
  images: { unoptimized: true },
  // basePath 配下でも安定するよう末尾スラッシュを付与
  trailingSlash: true,
};

export default nextConfig;
