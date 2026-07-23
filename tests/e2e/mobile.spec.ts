import { test, expect } from "@playwright/test";

test("モバイルでは Explorer が Drawer になる", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Build Log", level: 1 })).toBeVisible();

  // PC 用サイドバーは非表示
  await expect(page.locator("aside")).toBeHidden();

  // ハンバーガーから Drawer を開く
  await page.getByRole("button", { name: "Open explorer" }).click();
  const drawer = page.getByRole("navigation", { name: "Explorer" });
  await expect(drawer).toBeVisible();

  // Drawer からセクションへ移動すると Drawer は閉じる
  await drawer.getByRole("button", { name: "history.log" }).click();
  await expect(drawer).toBeHidden();
  await expect(page.locator("#history")).toBeInViewport();
});
