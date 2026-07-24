import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

/**
 * 職務経歴ページを実際に PDF 化して、印刷スタイルが壊れていないことを確認する。
 * 生成物は screenshots/ に置く（そのまま提出物として使える）。
 */
test("職務経歴ページが A4 の PDF として出力できる", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "page.pdf() は Chromium のみ");

  await page.goto("/engineer/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1200);

  const path = "screenshots/職務経歴-石田拓也.pdf";
  await page.pdf({
    path,
    format: "A4",
    printBackground: false,
    // 余白は print.css の @page に任せる
    preferCSSPageSize: true,
  });

  const pdf = await readFile(path);
  expect(pdf.byteLength).toBeGreaterThan(10_000);
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");

  // ページ数が極端だと印刷スタイルが効いていない可能性が高い
  const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  expect(pageCount).toBeGreaterThan(0);
  expect(pageCount).toBeLessThanOrEqual(8);
  console.log(`PDF: ${pageCount} ページ / ${Math.round(pdf.byteLength / 1024)} KB`);
});

test("印刷時にレールと注意書きが消える", async ({ page }) => {
  await page.goto("/engineer/");
  await page.emulateMedia({ media: "print" });

  await expect(page.getByRole("navigation", { name: "ページ内の目次" })).toBeHidden();
  await expect(page.getByRole("note")).toBeHidden();

  // 画面では隠している印刷用ヘッダ（氏名・連絡先・URL・更新日）が出ていること
  await expect(page.getByTestId("print-head")).toBeVisible();
});
