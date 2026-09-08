import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

/**
 * 印刷まわり。今回いちばんの回帰リスクなので厚めに見る。
 *
 * 画面はダーク一色だが、紙は必ず白黒の A4 で出る。
 * Tailwind のユーティリティは 1 つ足すたびに色が増えるので、
 * 「押さえ込めているか」を毎回ここで測る。
 */

test("ダークで表示していても、印刷は白黒で出る", async ({ page }) => {
  await page.goto("/engineer/");

  // 画面はダーク
  const screenBg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(screenBg).toBe("rgb(7, 7, 13)");

  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);

  const printed = await page.evaluate(() => {
    const body = getComputedStyle(document.body);
    // 地が残っていない（＝トナーを食う面が無い）ことを、
    // 画面いっぱいの要素をひととおり見て確かめる
    const painted = [...document.querySelectorAll("section, main, footer, div")]
      .map((el) => getComputedStyle(el).backgroundColor)
      .filter((c) => c !== "rgba(0, 0, 0, 0)" && c !== "transparent");
    return { bg: body.backgroundColor, color: body.color, painted };
  });

  expect(printed.bg).toBe("rgb(255, 255, 255)");
  expect(printed.color).toBe("rgb(0, 0, 0)");
  expect(printed.painted, `紙に地が残っている: ${printed.painted.join(" / ")}`).toEqual([]);
});

test("印刷ではナビ・PDF ボタン・装飾が消え、印刷用ヘッダが出る", async ({ page }) => {
  await page.goto("/engineer/");
  await page.emulateMedia({ media: "print" });

  await expect(page.getByRole("navigation", { name: "ページ内の移動" })).toBeHidden();
  await expect(page.getByRole("button", { name: "PDF" })).toBeHidden();
  await expect(page.locator("canvas")).toBeHidden();
  await expect(page.getByTestId("print-head")).toBeVisible();
});

test("印刷では経歴が 1 列に落ちる", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/engineer/");
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);

  // 左右交互の 2 段組は紙では読み順が壊れるので、display: block に落としている
  const display = await page
    .getByTestId("career-entry")
    .first()
    .evaluate((el) => getComputedStyle(el).display);
  expect(display).toBe("block");
});

test("スキルの数値は紙にも文字として残る", async ({ page }) => {
  await page.goto("/engineer/");
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(300);

  // バーは消えるが、隣の「95%」は読める（紙でバーは意味を持たない）
  const bar = page.getByTestId("skill-bar").first();
  await expect(bar).toContainText("%");
});

test("職務経歴ページが A4 の PDF として出力できる", async ({ page, browserName }) => {
  test.skip(browserName !== "chromium", "page.pdf() は Chromium のみ");

  await page.goto("/engineer/");
  await page.waitForLoadState("networkidle");
  // 入場アニメーションを起こしてから刷る（途中の状態で固まらせない）
  await page.evaluate(async () => {
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += window.innerHeight * 0.8) {
      window.scrollTo({ top: y, behavior: "instant" });
      await new Promise((r) => setTimeout(r, 100));
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  });
  await page.waitForTimeout(600);

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

  // パーティクルは描かず静的グラデにフォールバックする
  await expect(page.locator("canvas")).toHaveCount(0);

  const behavior = await page.evaluate(
    () => getComputedStyle(document.documentElement).scrollBehavior,
  );
  expect(behavior).toBe("auto");
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
