import { readFile } from "node:fs/promises";
import { test, type Page } from "@playwright/test";

/**
 * 見た目の記録。
 *
 * screenshots/ に書き出しつつ、Playwright のレポートにも添付する。
 * CI では Artifacts の playwright-report をダウンロードすれば
 * ブラウザ上で並べて見られる。
 */

type Shot = { path: string; name: string };

const SHOTS: Shot[] = [
  { path: "/", name: "gate" },
  { path: "/engineer/", name: "engineer" },
  { path: "/business/", name: "business" },
];

const WIDTHS = [
  { width: 1440, name: "desktop" },
  { width: 768, name: "tablet" },
  { width: 390, name: "mobile" },
] as const;

/** 入場を終わらせてから撮る。ページ全体を一度スクロールして起こす。 */
const settle = async (page: Page) => {
  await page.waitForLoadState("networkidle");
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += window.innerHeight * 0.8) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(900);
};

for (const shot of SHOTS) {
  for (const size of WIDTHS) {
    test(`screenshot ${shot.name} @ ${size.name}`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: size.width, height: 1000 });
      await page.goto(shot.path);
      await settle(page);

      const path = `screenshots/${shot.name}-${size.name}.png`;
      await page.screenshot({ path, fullPage: true });
      await testInfo.attach(`${shot.name}-${size.name}`, { path, contentType: "image/png" });
    });
  }
}

test("screenshot engineer @ print", async ({ page }, testInfo) => {
  // A4（210mm）から左右 14mm の余白を引いた幅で印刷レイアウトを撮る
  await page.setViewportSize({ width: 688, height: 1000 });
  await page.goto("/engineer/");
  await settle(page);
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(600);

  const path = "screenshots/engineer-print.png";
  await page.screenshot({ path, fullPage: true });
  await testInfo.attach("engineer-print", { path, contentType: "image/png" });
});

test("職務経歴の PDF をレポートに添付する", async ({ page }, testInfo) => {
  await page.goto("/engineer/");
  await settle(page);

  const path = "screenshots/職務経歴-石田卓也.pdf";
  await page.pdf({ path, format: "A4", printBackground: false, preferCSSPageSize: true });
  await testInfo.attach("職務経歴.pdf", {
    body: await readFile(path),
    contentType: "application/pdf",
  });
});
