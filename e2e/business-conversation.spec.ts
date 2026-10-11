import { test, expect } from "@playwright/test";

const confirmLabel = "同じ会社です。このルールで照合して";
const mailLabel = "担当者を伝えて、確認メールを下書きして";
const skillLabel = "毎月使えるスキルにして";

for (const width of [320, 390, 1440]) {
  test(`${width}px：コードなしのExcelからメール下書き・スキル保存・相談まで進む`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 844 });
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/business/");
    await page.getByRole("button", { name: /^毎月のExcel集計/ }).click();
    const attachment = page.getByRole("button", { name: /月末集計サンプル.xlsx/ });
    await attachment.click();
    const preview = page.getByRole("dialog");
    await expect(preview.getByRole("table")).not.toContainText("取引先コード");
    await expect(preview.getByRole("table")).toContainText("田中工業");
    await preview.getByRole("button", { name: "入金明細", exact: true }).click();
    await expect(preview.getByRole("table")).toContainText("㈱田中工業");
    await expect(preview.getByRole("table")).toContainText("200,000");
    await page.keyboard.press("Escape");
    await expect(attachment).toBeFocused();
    await page.getByRole("button", { name: confirmLabel }).click();
    await expect(page.getByText("差額は30,000円。理由を社内担当者に確認します。")).toBeVisible();
    await page.getByRole("button", { name: mailLabel }).click();
    const draft = page.getByRole("region", { name: "Gmail下書きのサンプル" });
    await expect(draft).toContainText("sato@example.com");
    await expect(draft).toContainText("230,000円");
    await expect(draft).toContainText("30,000円");
    await expect(draft).toContainText("実際のGmail保存・メール送信は行いません");
    await page.getByRole("button", { name: skillLabel }).waitFor();
    await page.locator("main").evaluate(el => { el.scrollTop = el.scrollHeight; });
    await page.screenshot({ path: testInfo.outputPath(`mail-${width}.png`) });
    await page.getByRole("button", { name: skillLabel }).click();
    const skill = page.getByRole("region", { name: "finance-checkerスキルのサンプル" });
    await expect(skill).toContainText("確認済みの対応");
    await expect(skill).toContainText("sato@example.com");
    await expect(skill).toContainText("送信は人が確認して行う");
    await expect(page.locator('[aria-label="ユーザーの発言"]').last().locator("strong")).toHaveText("スキル");
    await expect(page.getByText(/取引先の表記ルールや社内担当者の情報は、毎回渡す必要がありません/)).toBeVisible();
    await expect(page.locator("[data-chat-turn]")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "回答をすべて表示" })).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
    expect(await page.evaluate(() => document.documentElement.scrollHeight - innerHeight)).toBeLessThanOrEqual(1);
    await page.evaluate(() => window.scrollTo(0, 10000));
    expect(await page.evaluate(() => scrollY)).toBe(0);
    await page.getByRole("button", { name: "自分の仕事について相談する", exact: true }).waitFor();
    await page.locator("main").evaluate(el => { el.scrollTop = el.scrollHeight; });
    expect((await page.getByRole("banner").boundingBox())!.y).toBe(0);
    await page.screenshot({ path: testInfo.outputPath(`skill-${width}.png`) });
    await page.getByRole("button", { name: "選択肢を閉じる" }).click();
    await expect(page.getByRole("button", { name: "メニューから、できることを選ぶ" })).toBeFocused();
    await page.getByRole("button", { name: "選択肢を表示" }).click();
    await page.getByRole("button", { name: "自分の仕事について相談する", exact: true }).click();
    await expect(page.getByRole("region", { name: "相談フォーム" })).toContainText("毎月のExcel集計");
  });
}

test("応答全体の表示完了から1秒後に選択肢を出し、読み位置を動かさない", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/business/");
  await page.getByRole("button", { name: /^毎月のExcel集計/ }).click();
  await page.getByRole("button", { name: "入力を完了して送信" }).click();
  await page.getByRole("button", { name: "回答をすべて表示" }).click();
  await page.getByRole("button", { name: confirmLabel }).waitFor();
  const now = new Date("2026-10-11T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.getByRole("button", { name: confirmLabel }).click();
  await page.getByRole("button", { name: "入力を完了して送信" }).click();
  await page.clock.runFor(1000);
  const turn = page.locator("[data-chat-turn]").last();
  await expect(turn).toHaveAttribute("data-phase", "thinking");
  await page.clock.runFor(1000);
  await expect(turn).toHaveAttribute("data-phase", "streaming");
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
  // Drive the final character and completion tick individually, then test the delay boundary.
  for (let ticks = 0; ticks < 600; ticks++) {
    await page.clock.runFor(45);
    if (await turn.getAttribute("data-phase") === "ready") break;
  }
  await expect(turn).toHaveAttribute("data-phase", "ready");
  await page.locator("main").evaluate(el => { el.scrollTop = 0; });
  await page.clock.runFor(999);
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
  await page.clock.runFor(1);
  await expect(page.getByRole("button", { name: mailLabel })).toBeVisible();
  expect(await page.locator("main").evaluate(el => el.scrollTop)).toBe(0);
});

test("回答をすべて表示しても1秒待ち、途中で離れた回答の選択肢は出ない", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/business/");
  await page.getByRole("button", { name: /^毎月のExcel集計/ }).click();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: confirmLabel }).waitFor();
  const now = new Date("2026-10-11T00:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.getByRole("button", { name: confirmLabel }).click();
  await page.getByRole("button", { name: "入力を完了して送信" }).click();
  await page.getByRole("button", { name: "回答をすべて表示" }).click();
  await page.clock.runFor(999);
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
  await page.clock.runFor(1);
  await expect(page.getByRole("button", { name: mailLabel })).toBeVisible();
  await page.getByRole("button", { name: mailLabel }).click();
  await page.getByRole("button", { name: "最初の画面に戻る" }).click();
  await page.clock.runFor(30000);
  await expect(page.locator("[data-welcome-phase]")).toHaveAttribute("data-welcome-phase", "ready");
  await page.clock.runFor(1000);
  await expect(page.getByRole("button", { name: /^毎月のExcel集計/ })).toBeVisible();
  await expect(page.getByRole("button", { name: skillLabel })).toHaveCount(0);
});
