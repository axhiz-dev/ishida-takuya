import { test, expect, type Page } from "@playwright/test";

async function gotoTop(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Build Log", level: 1 })).toBeVisible();
  return errors;
}

test("Hero が表示され、ページエラーがない", async ({ page }) => {
  const errors = await gotoTop(page);
  await expect(page.getByText("Takuya Ishida")).toBeVisible();
  await expect(page.getByText("This is not a resume.")).toBeVisible();
  expect(errors).toEqual([]);
});

test("Explorer からセクションへ移動できる", async ({ page }) => {
  await gotoTop(page);
  await page.getByRole("navigation", { name: "Explorer" }).getByRole("button", { name: "history.log" }).click();
  await expect(page.locator("#history")).toBeInViewport();
  await page.getByRole("navigation", { name: "Explorer" }).getByRole("button", { name: "links.json" }).click();
  await expect(page.locator("#contact")).toBeInViewport();
});

test("Featured Build を開いてタブを切り替え、Esc で閉じられる", async ({ page }) => {
  await gotoTop(page);
  await page.locator('[data-build-id="mato-message"]').click();
  const dialog = page.getByRole("dialog", { name: "MatoMessage details" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText("課題", { exact: true })).toBeVisible();

  await dialog.getByRole("button", { name: "Architecture.md" }).click();
  await expect(dialog.getByText("構成図", { exact: true })).toBeVisible();
  await expect(dialog.getByText("設計思想", { exact: true })).toBeVisible();

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("J / K で次・前の Build に切り替えられる", async ({ page }) => {
  await gotoTop(page);
  await page.locator('[data-build-id="mato-message"]').click();
  await expect(page.getByRole("dialog", { name: "MatoMessage details" })).toBeVisible();
  await page.keyboard.press("j");
  await expect(page.getByRole("dialog", { name: "Streaming Platform details" })).toBeVisible();
  await page.keyboard.press("k");
  await expect(page.getByRole("dialog", { name: "MatoMessage details" })).toBeVisible();
  await page.keyboard.press("Escape");
});

test("コマンドパレットから Build を開ける", async ({ page }) => {
  await gotoTop(page);
  await page.keyboard.press("Control+k");
  const input = page.getByPlaceholder("Jump to section, open a build…");
  await expect(input).toBeVisible();
  await input.fill("mato");
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog", { name: "MatoMessage details" })).toBeVisible();
});

test("Build Archive のタグフィルターが機能する", async ({ page }) => {
  await gotoTop(page);
  const archive = page.locator("#archive");
  await archive.scrollIntoViewIfNeeded();
  await archive.getByRole("button", { name: "Show All Builds" }).click();
  await expect(page.locator('[data-build-id="realtime-chat"]')).toBeVisible();

  await archive.getByRole("button", { name: "AI", exact: true }).click();
  await expect(page.locator('[data-build-id="ai-review-bot"]')).toBeVisible();
  await expect(page.locator('[data-build-id="realtime-chat"]')).toBeHidden();

  await archive.getByRole("button", { name: "All", exact: true }).click();
  await expect(page.locator('[data-build-id="realtime-chat"]')).toBeVisible();
});

test("ショートカット一覧が ? で開く", async ({ page }) => {
  await gotoTop(page);
  await page.keyboard.press("Shift+Slash");
  await expect(page.getByRole("dialog", { name: "Keyboard shortcuts" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog", { name: "Keyboard shortcuts" })).toBeHidden();
});
