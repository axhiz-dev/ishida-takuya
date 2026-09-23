import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

/**
 * 印刷まわり。
 *
 * 画面版（EngineerScreen）と紙版（ResumeDocument）はマークアップが別で、
 * engineer.css の @media print が data-print 属性を見て出し分けている。
 * 出し分けが崩れると、画面のフィルタやボタンが紙に載ったり、
 * 紙に何も載らなかったりするので、ここで毎回確かめる。
 */

test("画面では紙版が出ず、印刷では画面版が消えて紙版だけが出る", async ({ page }) => {
  await page.goto("/engineer/");

  await expect(page.getByTestId("resume-document")).toBeHidden();
  await expect(page.getByRole("button", { name: "PDF出力" })).toBeVisible();

  await page.emulateMedia({ media: "print" });

  await expect(page.getByTestId("resume-document")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "サイト内の移動" })).toBeHidden();
  await expect(page.getByRole("toolbar", { name: "技術で案件を絞り込む" })).toBeHidden();
  await expect(page.getByRole("button", { name: "PDF出力" })).toBeHidden();
});

test("紙版には、画面で絞り込んでいても全案件が載る", async ({ page }) => {
  await page.goto("/engineer/");
  const total = await page.getByTestId("project-card").count();

  // 画面で絞り込んだまま印刷しても、紙は職務経歴書として全部載せる
  await page
    .getByRole("toolbar", { name: "技術で案件を絞り込む" })
    .getByRole("button", { name: /^Go \d+$/ })
    .click();
  await page.emulateMedia({ media: "print" });

  const printed = page.getByTestId("resume-document").locator('[data-print="keep"] h4');
  await expect(printed).toHaveCount(total);
});

test("紙の地は白で、待遇の情報が載っていない", async ({ page }) => {
  await page.goto("/engineer/");
  await page.emulateMedia({ media: "print" });

  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(255, 255, 255)");

  const text = await page.getByTestId("resume-document").innerText();
  for (const word of ["年収", "万円", "Offers"]) {
    expect(text, `紙に「${word}」が載っている`).not.toContain(word);
  }
});

test("職務経歴ページが A4 の PDF として出力できる", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "page.pdf() は Chromium のみ");

  await page.goto("/engineer/");
  await page.waitForLoadState("networkidle");

  const path = "screenshots/職務経歴-石田卓也.pdf";
  await page.pdf({ path, format: "A4", printBackground: false, preferCSSPageSize: true });

  const pdf = await readFile(path);
  expect(pdf.byteLength).toBeGreaterThan(10_000);
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");

  const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  expect(pageCount).toBeGreaterThan(0);
  expect(pageCount).toBeLessThanOrEqual(10);
  console.log(`PDF: ${pageCount} ページ / ${Math.round(pdf.byteLength / 1024)} KB`);
});

test("モーション低減の設定でアニメーションが止まる", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/engineer/");
  await page.waitForTimeout(400);

  const state = await page.evaluate(() => ({
    scroll: getComputedStyle(document.documentElement).scrollBehavior,
    // スクロールで浮かび上がる要素も、最初から見えている
    revealOpacity: getComputedStyle(document.querySelector(".reveal")!).opacity,
  }));
  expect(state.scroll).toBe("auto");
  expect(state.revealOpacity).toBe("1");
});
