import { test, expect } from "@playwright/test";

test("導入文の完了後に選択肢が現れ、再訪時は入力が省略される", async ({ page, baseURL }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const now = new Date("2026-10-11T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.goto(`${baseURL}/business/`);
  const intro = page.locator("[data-welcome-phase]");
  const title = intro.locator('h1 > [aria-hidden="true"] > span').first();
  const lead = intro.getByText("そんな仕事、ありませんか？");
  const choices = page.getByRole("region", { name: "選択肢パネル" });
  await expect(choices).toHaveCount(0);
  const before = await intro.boundingBox();
  await page.clock.runFor(500);
  expect((await title.innerText()).length).toBeGreaterThan(0);
  expect((await title.innerText()).length).toBeLessThan("毎回やっているけれど、毎回ちょっと大変。".length);
  await expect(lead).toBeVisible();
  await page.clock.runFor(6000);
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
  await expect(title).toHaveText("毎回やっているけれど、毎回ちょっと大変。");
  await expect(lead).toHaveText("そんな仕事、ありませんか？");
  expect((await intro.boundingBox())!.height).toBeCloseTo(before!.height, 0);
  await expect(choices).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("welcome-desktop.png") });
  await page.getByRole("button", { name: "費用・FAQ" }).click();
  await page.getByRole("button", { name: "最初の画面に戻る" }).click();
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
  await page.reload();
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
});

test("導入の表示中は選択肢を出さず、完了後に仕事を選べる", async ({ page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto(`${baseURL}/business/`);
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "streaming");
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
  await page.clock.runFor(6500);
  await page.getByRole("button", { name: /^毎月、数字の照合と確認に時間がかかる/ }).click();
  await expect(page.locator("[data-chat-turn]")).toHaveCount(1);
  await page.getByRole("button", { name: "最初の画面に戻る" }).click();
  await page.clock.runFor(6500);
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
