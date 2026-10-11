import { test, expect } from "@playwright/test";

test("導入文が順番に現れ、選択肢の位置は動かず、再訪時は省略される", async ({ page, baseURL }, testInfo) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const now = new Date("2026-10-11T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.goto(`${baseURL}/business/`);
  const intro = page.locator("[data-welcome-phase]");
  const title = intro.locator('h1 > [aria-hidden="true"] > span').first();
  const lead = intro.locator('p > [aria-hidden="true"] > span').first();
  const choices = page.getByRole("region", { name: "選択肢パネル" });
  await expect(choices).toBeVisible();
  // Measure layout separately from the panel's entrance transform.
  const panelTop = () => choices.evaluate((el) => el.getBoundingClientRect().y - new DOMMatrixReadOnly(getComputedStyle(el).transform).m42);
  const before = await intro.boundingBox();
  const panelBefore = await panelTop();
  await page.clock.runFor(500);
  expect((await title.innerText()).length).toBeGreaterThan(0);
  expect((await title.innerText()).length).toBeLessThan("AIって、自分の仕事にも使えるの？".length);
  await expect(lead).toBeEmpty();
  await page.clock.runFor(6000);
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
  await expect(title).toHaveText("AIって、自分の仕事にも使えるの？");
  await expect(lead).toHaveText("まずは、いつもの仕事がどう変わるか、サンプルで体験してみてください。");
  expect((await intro.boundingBox())!.height).toBeCloseTo(before!.height, 0);
  expect(await panelTop()).toBeCloseTo(panelBefore, 0);
  await page.screenshot({ path: testInfo.outputPath("welcome-desktop.png") });
  await page.getByRole("button", { name: "費用・FAQ" }).click();
  await page.getByRole("button", { name: "最初の画面に戻る" }).click();
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
  await page.reload();
  await expect(intro).toHaveAttribute("data-welcome-phase", "ready");
});

test("導入の表示中でも仕事を選べ、戻った後の演出は正常に完了する", async ({ page, baseURL }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.clock.install();
  await page.goto(`${baseURL}/business/`);
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "streaming");
  await page.getByRole("button", { name: /^毎月のExcel集計/ }).click();
  await expect(page.locator("[data-chat-turn]")).toHaveCount(1);
  await page.getByRole("button", { name: "最初の画面に戻る" }).click();
  await page.clock.runFor(6500);
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "ready");
  await expect(page.getByRole("button", { name: /^毎月のExcel集計/ })).toBeVisible();
});

for (const width of [320, 1440]) {
  test(`${width}pxで動きを減らす設定に対応し、発言の間に余白がある`, async ({ page, baseURL }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto(`${baseURL}/business/`);
    await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "ready");
    await page.screenshot({ path: testInfo.outputPath(`welcome-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    await page.getByRole("button", { name: /^毎月のExcel集計/ }).click();
    const turn = page.locator("[data-chat-turn]").first();
    await expect(turn).toHaveAttribute("data-phase", "ready");
    const user = await turn.locator('[aria-label="ユーザーの発言"]').boundingBox();
    const bot = await turn.locator('[class*="botResponse"] > [class*="guide"]').first().boundingBox();
    expect(bot!.y - user!.y - user!.height).toBeGreaterThanOrEqual(width <= 680 ? 36 : 52);
    await page.locator("main").evaluate((el) => { el.scrollTop = 0; });
    await page.screenshot({ path: testInfo.outputPath(`conversation-${width}.png`) });
    await page.getByRole("button", { name: /^取引先コードで照合する/ }).click();
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
