import { defineConfig, devices } from "@playwright/test";

/**
 * E2E は「実際に配信される静的ファイル」に対して走らせる。
 * dev サーバではなく NEXT_OUTPUT=export でビルドした out/ を配信するのは、
 * basePath や静的書き出し固有の壊れ方をここで捕まえたいため。
 *
 * ローカルで dev サーバを立てている場合は
 *   PLAYWRIGHT_BASE_URL=http://localhost:4400 npx playwright test
 * のように向き先を差し替えられる。
 */
const PORT = 4321;
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? `http://127.0.0.1:${PORT}`;

export default defineConfig({
  testDir: "./e2e",
  outputDir: "./test-results",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never", outputFolder: "playwright-report" }], ["list"]],

  use: {
    baseURL,
    trace: "retain-on-failure",
    locale: "ja-JP",
    timezoneId: "Asia/Tokyo",
    // ブラウザが同梱されていない環境向けの逃げ道。
    // CI は `npx playwright install chromium` を走らせるので通常は未設定。
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : undefined,
  },

  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],

  webServer: process.env.PLAYWRIGHT_BASE_URL
    ? undefined
    : {
        command: `npm run build:export && npx serve out -l ${PORT} --no-clipboard`,
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 5 * 60 * 1000,
        stdout: "ignore",
        stderr: "pipe",
      },
});
