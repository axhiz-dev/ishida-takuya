import { test, expect } from "@playwright/test";

/**
 * デモは実績の代わりに置いている証拠なので、壊れると
 * このページの一番大事な部分が黙って死ぬ。ここで押さえておく。
 *
 * 隠れているタブパネルはアクセシビリティツリーに載らないので、
 * getByRole("tabpanel") は常に「表示中の 1 枚」だけを指す。
 */
const panel = (page: import("@playwright/test").Page) => page.getByRole("tabpanel");

test.beforeEach(async ({ page }) => {
  await page.goto("/business/");
});

test("集計デモ：サンプルを読み、グラフを切り替えられる", async ({ page }) => {
  await page.getByRole("button", { name: "試すファイルがない方はこちら" }).click();
  await expect(page.getByText("サンプル 3 拠点から 6 行を読みました。")).toBeVisible();

  for (const kind of ["縦棒", "横棒", "構成比"]) {
    await page.getByRole("button", { name: kind, exact: true }).click();
    await expect(page.getByRole("button", { name: kind, exact: true })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    await expect(panel(page).locator("svg")).toBeVisible();
  }

  // 拠点別を折れ線にすると、拠点のあいだに中間の値があるように見える。
  // 日付の列でまとめたときだけ押せること。
  await expect(page.getByRole("button", { name: "折れ線", exact: true })).toBeDisabled();
});

test("デモ：タブを行き来しても入力が消えない", async ({ page }) => {
  await page.getByRole("button", { name: "試すファイルがない方はこちら" }).click();
  await expect(page.getByText(/6 行を読みました/)).toBeVisible();

  await page.getByRole("tab", { name: /請求書/ }).click();
  await page.getByRole("tab", { name: /エクセル/ }).click();
  await expect(page.getByText(/6 行を読みました/)).toBeVisible();
});

test("請求書デモ：プリセット・行削除・支払期日", async ({ page }) => {
  await page.getByRole("tab", { name: /請求書/ }).click();

  await page.getByRole("button", { name: "毎月の保守" }).click();
  await expect(panel(page).getByLabel("1 行目の品目")).toHaveValue("システム保守（月額）");

  await page.getByRole("button", { name: "制作物の納品" }).click();
  await expect(panel(page).getByLabel("2 行目の品目")).toHaveValue("操作マニュアル作成");

  await panel(page).getByRole("button", { name: /2 行目「操作マニュアル作成」を削除/ }).click();
  await expect(panel(page).getByLabel("2 行目の品目")).toHaveValue("導入時の説明会");

  // 1 行だけになったら消せない（空の請求書を作らせない）
  await panel(page).getByRole("button", { name: /2 行目.*削除/ }).click();
  await expect(panel(page).getByRole("button", { name: /1 行目.*削除/ })).toBeDisabled();

  // 支払サイトから期日が引ける
  await page.getByRole("button", { name: "翌々月末", exact: true }).click();
  const due = await panel(page).getByLabel("支払期日").inputValue();
  const issued = await panel(page).getByLabel("請求日").inputValue();
  expect(new Date(due).getTime()).toBeGreaterThan(new Date(issued).getTime());
});

test("ページ内リンクの着地点が固定ナビの下に隠れない", async ({ page }) => {
  await page.getByRole("link", { name: "料金" }).click();
  await page.waitForTimeout(700);

  const heading = page.getByRole("heading", { name: "料金", level: 2 });
  const box = await heading.boundingBox();
  const nav = await page.locator("header").boundingBox();
  expect(box).not.toBeNull();
  expect(nav).not.toBeNull();
  // 見出しの上端がナビの下端より下にあること
  expect(box!.y).toBeGreaterThan(nav!.y + nav!.height);
});
