import type { NextConfig } from "next";

// GitHub Pages 用の静的書き出し:
//   NEXT_OUTPUT=export NEXT_BASE_PATH=/<repo名> npm run build → out/ に生成
// 通常の `npm run build` / `npm run start` には影響しない。
const nextConfig: NextConfig = {
  output: process.env.NEXT_OUTPUT === "export" ? "export" : undefined,
  basePath: process.env.NEXT_BASE_PATH || undefined,
};

export default nextConfig;
