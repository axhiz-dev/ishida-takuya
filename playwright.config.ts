import { defineConfig, devices } from "@playwright/test";

// CI (ci.yml) は test:e2e の直前に環境変数なしの `npm run build` を実行済み。
// そのビルド成果物 (.next) を `next start` で再利用してテストする。
// next dev のオンデマンドコンパイルによるフレークを避けるため。
const PORT = 3210;
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  timeout: 30_000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "on",
    // アニメーション過多のUIをCIで安定化させる（描画レース回避）
    reducedMotion: "reduce",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
  webServer: {
    command: `npx next start -p ${PORT}`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
