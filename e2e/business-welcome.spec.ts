import { test, expect } from "@playwright/test";

test("漫画が一コマずつ現れ、再訪時には待たずに体験を選べる", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const now = new Date("2026-10-16T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.goto("/business/");
  const intro = page.locator("[data-welcome-phase]");
  const panels = page.locator("[data-comic-visible]").filter({ has: page.locator("img") });
  const choices = page.getByRole("region", { name: "選択肢パネル" });
  const before = await intro.boundingBox();
  await page.clock.runFor(1000);
  await expect(panels.nth(0)).toHaveAttribute("data-comic-visible", "true");
  await expect(panels.nth(1)).toHaveAttribute("data-comic-visible", "false");
  await expect(choices).toHaveCount(0);
  await page.clock.runFor(2200);
  await expect(panels.nth(1)).toHaveAttribute("data-comic-visible", "true");
  await expect(panels.nth(2)).toHaveAttribute("data-comic-visible", "false");
  await page.clock.runFor(2000);
  await expect(panels.nth(2)).toHaveAttribute("data-comic-visible", "true");
  await expect(choices).toHaveCount(0);
  await page.clock.runFor(2200);
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
  expect((await intro.boundingBox())!.height).toBeCloseTo(before!.height, 0);
  await page.clock.runFor(1000);
  await expect(choices).toBeVisible();
  await page.reload();
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
});

test("まとめて見るとタイマーで漫画が非表示に戻らない", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto("/business/");
  await page.getByRole("button", { name: "まとめて見る" }).click();
  await page.clock.runFor(3000);
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "ready");
  await expect(page.locator('[data-comic-visible="false"]')).toHaveCount(0);
});

test("1280x720で漫画と体験の入口が一画面に収まる", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/business/");
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toBeVisible();
  expect(await page.locator("main").evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
});
test("導入の表示中は選択肢を出さず、完了後に仕事を選べる", async ({ page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto(`${baseURL}/business/`);
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "streaming");
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
  await page.clock.runFor(8500);
  await page.getByRole("button", { name: /^毎月、数字の照合と確認に時間がかかる/ }).click();
  await expect(page.locator("[data-chat-turn]")).toHaveCount(1);
  await page.getByRole("button", { name: "最初の画面に戻る" }).click();
  await page.clock.runFor(8500);
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "ready");
  await expect(page.getByRole("button", { name: /^毎月、数字の照合と確認に時間がかかる/ })).toBeVisible();
});

for (const width of [320, 1440]) {
  test(`${width}pxで動きを減らす設定に対応し、発言の間に余白がある`, async ({ page, baseURL }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${baseURL}/business/`);
    await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "ready");
    await page.screenshot({ path: testInfo.outputPath(`welcome-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.getByRole("button", { name: /^毎月、数字の照合と確認に時間がかかる/ }).click();
    const turn = page.locator("[data-chat-turn]").first();
    await expect(turn).toHaveAttribute("data-phase", "ready");
    const user = await turn.locator('[aria-label="ユーザーの発言"]').boundingBox();
    const bot = await turn.locator('[class*="botResponse"] > [class*="guide"]').first().boundingBox();
    expect(bot!.y - user!.y - user!.height).toBeGreaterThanOrEqual(width <= 680 ? 36 : 52);
    await page.locator("main").evaluate((el) => { el.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath(`conversation-${width}.png`) });
    await page.getByRole("button", { name: /^同じ会社です。このルールで照合して/ }).click();
    const next = page.locator("[data-chat-turn]").last();
    await expect(next).toHaveAttribute("data-phase", "ready");
    const firstBox = await turn.boundingBox();
    const nextBox = await next.boundingBox();
    expect(nextBox!.y - firstBox!.y - firstBox!.height).toBeGreaterThanOrEqual(width <= 680 ? 40 : 56);
  });
}

test("表示中に動きを減らす設定に切り替えると全文が現れる", async ({ page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto(`${baseURL}/business/`);
  await page.clock.runFor(500);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "ready");
});

test("スマホは再訪でも3コマ目まで自動送りし、その後に案内とカードを出す", async ({ page }, testInfo) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => sessionStorage.setItem("business-welcome-seen-v3", "true"));
  await page.goto("/business/");
  const invitation = page.locator('[class*="comicInvitation"]');
  const choices = page.getByRole("region", { name: "選択肢パネル" });
  await expect(page.getByRole("button", { name: "1コマ目を見る" })).toHaveAttribute("aria-current", "step");
  await expect(invitation).toHaveAttribute("data-comic-visible", "false");
  // A tap on the first panel must not cancel automatic playback.
  await page.getByAltText('部長が資料を渡す。「これ、いつもの感じでやっておいて！」').click();
  await expect(page.getByRole("button", { name: "2コマ目を見る" })).toHaveAttribute("aria-current", "step", { timeout: 4500 });
  await expect(invitation).toHaveAttribute("data-comic-visible", "false");
  await expect(choices).toHaveCount(0);
  await expect(page.getByRole("button", { name: "3コマ目を見る" })).toHaveAttribute("aria-current", "step", { timeout: 4500 });
  await expect(invitation).toHaveAttribute("data-comic-visible", "false");
  await expect(choices).toHaveCount(0);
  await expect(invitation).toHaveAttribute("data-comic-visible", "true", { timeout: 4000 });
  await expect(choices).toBeVisible();
  const strip = await page.locator('[class*="comicStrip"]').boundingBox();
  const last = await page.getByAltText('AI君が声をかける。「その準備、ぼくも手伝えそうです」').locator('..').boundingBox();
  expect(Math.abs(last!.x - strip!.x)).toBeLessThanOrEqual(2);
  await page.screenshot({ path: testInfo.outputPath("mobile-comic-complete.png") });
});
