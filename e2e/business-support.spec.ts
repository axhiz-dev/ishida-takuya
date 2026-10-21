import { test, expect } from "@playwright/test";

for (const width of [320, 390, 1440]) {
  test(`${width}px：案内・自己紹介・相談と履歴操作`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/business/");
    const header = page.getByRole("banner");
    await header.getByRole("button", { name: "自己紹介", exact: true }).click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(page).toHaveURL(/#about$/);
    await expect(dialog).toContainText("というか、してほしいのです。");
    await expect(dialog).toContainText("大切な時間が増えることには変わりありません。");
    await expect(dialog.getByRole("heading", { name: "自己紹介", exact: true })).toBeFocused();
    expect(await dialog.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
    const shot = testInfo.outputPath(`self-introduction-${width}.png`);
    await page.screenshot({ path: shot });
    await testInfo.attach(`自己紹介-${width}px`, { path: shot, contentType: "image/png" });
    await expect(dialog.getByText("エンジニア・AI活用支援", { exact: true })).toHaveCount(0);
    for (const [label, key] of [["支援内容・費用", "pricing"], ["相談から利用開始まで", "process"]]) {
      await dialog.getByRole("button", { name: label, exact: true }).click();
      const cta = dialog.getByRole("button", { name: "自分の仕事について相談する", exact: true });
      const box = await cta.boundingBox();
      const parent = await dialog.locator('[class*="panelCta"]').boundingBox();
      expect(Math.abs((box!.x + box!.width / 2) - (parent!.x + parent!.width / 2))).toBeLessThan(2);
      expect(await dialog.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      if (key === "process") {
        const process = dialog.getByRole("region", { name: "相談から利用開始まで", exact: true });
        await expect(process.getByRole("listitem")).toHaveCount(4);
        await expect(process.getByRole("img")).toHaveCount(4);
        await expect.poll(() => process.getByRole("img").first().evaluate(img => (img as HTMLImageElement).naturalWidth > 0)).toBe(true);
      }
      const path = testInfo.outputPath(`${key}-${width}.png`);
      await page.screenshot({ path });
      await testInfo.attach(`${label}-${width}px`, { path, contentType: "image/png" });
    }
    await expect(dialog.getByText("相談から利用開始までを見る", { exact: true })).toHaveCount(0);
    await dialog.getByRole("button", { name: "よくある質問", exact: true }).click();
    await dialog.getByText("AIを使ったことがなくても相談できますか？", { exact: true }).click();
    await expect(dialog.getByText(/個人事業の方も、会社の担当者の方も/)).toBeVisible();
    await expect(dialog.getByText("ユーザーが入力中…")).toHaveCount(0);
    await dialog.getByRole("button", { name: "自分の仕事について相談する", exact: true }).click();
    await dialog.getByLabel("お名前", { exact: true }).fill("相談 花子");
    await page.goBack();
    await expect(dialog).not.toBeVisible();
    await page.goForward();
    await expect(dialog).toBeVisible();
    await expect(dialog.getByLabel("お名前", { exact: true })).toHaveValue("相談 花子");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(header.getByRole("button", { name: "自己紹介", exact: true })).toBeFocused();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeLessThanOrEqual(1);
  });
}

test("法定ページから無料相談に直接移動でき、旧ナビが出ない", async ({ page }) => {
  await page.goto("/business/privacy/");
  await expect(page.getByText("ダミー", { exact: true })).toHaveCount(0);
  await page.goto("/business/legal/");
  await expect(page.locator("main")).toContainText("月5万円から");
  await expect(page.locator("main")).not.toContainText("3か月から");
  await page.getByRole("banner").getByRole("link", { name: "相談する", exact: true }).click();
  await expect(page).toHaveURL(/\/business\/?#contact$/);
  await expect(page.getByRole("dialog", { name: "無料相談" })).toBeVisible();
  await page.getByRole("button", { name: "案内を閉じて元の画面に戻る" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await expect(page).toHaveURL(/\/business\/$/);
});

test("事例の最後から支援内容を確認し、続きと別の事例に移れる", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/business/");
  await page.getByRole("button", { name: /^毎月、数字の照合と確認に時間がかかる/ }).click();
  for (const name of ["同じ会社です。このルールで照合して", "担当者を伝えて、確認メールを下書きして", "件数の多いサンプルで月次レポートを見てみる", "月次レポートまで毎月使えるスキルにして"]) await page.getByRole("button", { name }).click();
  await expect(page.getByRole("button", { name: "石田ってどんな人？", exact: true })).toBeVisible();
  await page.getByRole("button", { name: "費用や支援の進め方を確認する" }).waitFor();
  await page.locator("main").evaluate(el => { el.scrollTop = el.scrollHeight; });
  const readingPosition = await page.locator("main").evaluate(el => el.scrollTop);
  await page.getByRole("button", { name: "費用や支援の進め方を確認する" }).click();
  await expect(page.getByRole("dialog")).toContainText("5万円〜");
  await page.getByRole("button", { name: "案内を閉じて元の画面に戻る" }).click();
  await expect.poll(() => page.locator("main").evaluate(el => el.scrollTop)).toBe(readingPosition);
  await page.getByRole("button", { name: "もうひとつの事例を見る" }).click();
  await page.getByRole("button", { name: "返信の確認や催促、シフト調整に追われる", exact: true }).click();
  await expect(page.locator("[data-chat-turn]")).toHaveCount(1);
  await expect(page.locator("[data-chat-turn]")).toContainText("毎月LINEでシフト希望を集めています");
});
