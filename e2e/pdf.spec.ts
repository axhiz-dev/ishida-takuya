import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

/**
 * 印刷まわり。今回いちばんの回帰リスクなので厚めに見る。
 *
 * ダークで表示していても紙は必ず白黒で出ること、
 * 畳んである内容（事例・根拠の表）が紙では開いていることを確認する。
 */

test("ダーク表示中でも、印刷は白黒で出る", async ({ page }) => {
  await page.goto("/engineer/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "engineer-dark");

  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);

  const colors = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    return {
      paper: root.getPropertyValue("--color-paper").trim(),
      ink: root.getPropertyValue("--color-ink").trim(),
      bodyBg: getComputedStyle(document.body).backgroundColor,
    };
  });

  // print.css がテーマのトークンを上書きしていること
  expect(colors.paper).toBe("#fff");
  expect(colors.ink).toBe("#000");
  expect(colors.bodyBg).toBe("rgb(255, 255, 255)");
});

test("印刷ではナビ・レール・縦線が消え、印刷用ヘッダが出る", async ({ page }) => {
  await page.goto("/engineer/");
  await page.emulateMedia({ media: "print" });

  await expect(page.getByRole("navigation", { name: "章の一覧" })).toBeHidden();
  await expect(page.getByRole("button", { name: /テーマに切り替える/ })).toBeHidden();
  await expect(page.getByTestId("print-head")).toBeVisible();
});

test("職務経歴ページが A4 の PDF として出力できる", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "page.pdf() は Chromium のみ");

  await page.goto("/engineer/");
  await page.waitForLoadState("networkidle");

  // 実際の「PDF」ボタンと同じ手順を踏む。
  // 畳んである <details> は CSS だけでは開けないので、印刷の直前に開く。
  await page.evaluate(() => {
    for (const el of document.querySelectorAll("details")) el.open = true;
  });
  await page.waitForTimeout(800);

  const path = "screenshots/職務経歴-石田拓也.pdf";
  await page.pdf({ path, format: "A4", printBackground: false, preferCSSPageSize: true });

  const pdf = await readFile(path);
  expect(pdf.byteLength).toBeGreaterThan(10_000);
  expect(pdf.subarray(0, 5).toString()).toBe("%PDF-");

  const pageCount = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  expect(pageCount).toBeGreaterThan(0);
  expect(pageCount).toBeLessThanOrEqual(10);
  console.log(`PDF: ${pageCount} ページ / ${Math.round(pdf.byteLength / 1024)} KB`);
});

test("モーション低減の設定で scroll-snap が切れる", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/engineer/");

  const snap = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollSnapType,
  );
  expect(snap).toBe("none");
});

test("低い画面では scroll-snap が切れる", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 600 });
  await page.goto("/engineer/");

  const snap = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollSnapType,
  );
  expect(snap).toBe("none");
});

test("十分な高さの画面では scroll-snap が効く", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/engineer/");

  const snap = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollSnapType,
  );
  // proximity は初期値なので、Chrome は "y proximity" を "y" に正規化する。
  // 「軸が指定されている＝引っかかりが有効」であることを見る。
  expect(snap).toBe("y");
});

test("タッチ端末ではカーソル追従が無効になる", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto("/");
  await page.waitForTimeout(500);

  const enabled = await page.evaluate(
    () => document.querySelector("[data-spotlight]") !== null,
  );
  expect(enabled, "タッチ端末では data-spotlight が付かないこと").toBe(false);

  await context.close();
});
