import { test } from "@playwright/test";

// 動作確認用のスクリーンショットを撮り、CI のレポートに添付する。
// CI の Artifacts(playwright-report)からダウンロードして目視確認できる。
const sections = [
  "readme",
  "history",
  "featured",
  "stack",
  "current",
  "contact",
] as const;

test("主要セクションのスクリーンショットを記録する", async ({ page }, testInfo) => {
  await page.goto("/");
  for (const id of sections) {
    await page.evaluate(
      (sectionId) => document.getElementById(sectionId)?.scrollIntoView(),
      id
    );
    // Reveal アニメーションの完了を待つ
    await page.waitForTimeout(900);
    const shot = await page.screenshot();
    await testInfo.attach(`section-${id}`, { body: shot, contentType: "image/png" });
  }
});
