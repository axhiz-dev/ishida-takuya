import { test, expect } from "@playwright/test";

// 構造ベースのスモークテスト（アニメーションのタイミングに依存しない）。
// CI は test:e2e の前に `npm run build` 済み → playwright.config の webServer が
// `next start` でその成果物を配信する。

test("ページが読み込まれ、タイトルとヒーロー見出しが表示される", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Ishida Takuya|石田/);
  await expect(page.locator("h1")).toBeVisible();
});

test("6 つのセクションがすべて存在する", async ({ page }) => {
  await page.goto("/");
  for (const id of ["hero", "about", "career", "skills", "projects", "contact"]) {
    const section = page.locator(`#${id}`);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toBeVisible();
  }
});

test("データ層が結線されている（経歴・スキル・実績が描画される）", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByTestId("career-entry").first(),
  ).toBeAttached();
  expect(await page.getByTestId("career-entry").count()).toBeGreaterThan(0);
  expect(await page.getByTestId("skill-bar").count()).toBeGreaterThan(0);
  expect(await page.getByTestId("project-card").count()).toBeGreaterThan(0);
});

test("ページ実行時に JS エラーが発生しない", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (err) => errors.push(err.message));
  await page.goto("/", { waitUntil: "networkidle" });
  // 全セクションを通過させてクライアント側の副作用を発火
  await page.evaluate(async () => {
    await new Promise((r) => {
      let y = 0;
      const timer = setInterval(() => {
        window.scrollTo(0, y);
        y += 600;
        if (y > document.body.scrollHeight) {
          clearInterval(timer);
          r(null);
        }
      }, 30);
    });
  });
  expect(errors).toEqual([]);
});

test.describe("デスクトップナビ", () => {
  test.skip(({ isMobile }) => !!isMobile, "デスクトップ専用");

  test("ナビリンクで該当セクションへ移動する", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: "職務経歴" }).click();
    await expect(page.locator("#career")).toBeInViewport({ ratio: 0.1 });
  });
});

test.describe("モバイルメニュー", () => {
  test.skip(({ isMobile }) => !isMobile, "モバイル専用");

  test("ハンバーガーでオーバーレイが開きリンクが表示される", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "メニューを開く" }).click();
    const menu = page.getByTestId("mobile-menu");
    await expect(menu).toBeVisible();
    await expect(menu.getByRole("link", { name: /職務経歴/ })).toBeVisible();
  });
});
