import { test, expect } from "@playwright/test";
import {
  aggregateSales,
  normalizeCustomer,
} from "../src/components/business/tour/data";
test("集計：重複・未登録の判断が正しく合計に反映される", () => {
  expect(normalizeCustomer("（株）青葉商事")).toBe("株式会社青葉商事");
  expect(aggregateSales(false, true).total).toBe(422000);
  expect(aggregateSales(true, true).total).toBe(470000);
  expect(aggregateSales(false, false).total).toBe(350000);
  expect(
    aggregateSales(false, true).totals.find(
      (r) => r.customer === "株式会社青葉商事",
    )?.amount,
  ).toBe(200000);
});
test("集計から費用・相談まで、戻っても判断を保持する", async ({ page }) => {
  await page.goto("/business/");
  await page.getByRole("button", { name: "集計・転記", exact: true }).click();
  await page.getByRole("button", { name: "体験する", exact: true }).click();
  await page.getByRole("tab", { name: "EC売上.csv" }).click();
  await expect(
    page.getByRole("cell", { name: "（株）青葉商事", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "統合・照合をはじめる" }).click();
  await expect(
    page.getByRole("button", { name: "確認してレポートを作成" }),
  ).toBeDisabled();
  await page.getByRole("radio", { name: "1件として集計", exact: true }).check();
  await page.getByRole("radio", { name: "この名称で含める" }).check();
  await page.getByRole("button", { name: "確認してレポートを作成" }).click();
  await expect(page.getByText("￥422,000", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "この自動化の費用を見る" }).click();
  await expect(page.getByText("買い切り", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "体験に戻る", exact: true }).click();
  await expect(page.getByText("￥422,000", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "この自動化の費用を見る" }).click();
  await page.getByRole("button", { name: "導入の流れ・相談へ" }).click();
  await page.getByRole("button", { name: "まずは質問する" }).click();
  await expect(
    page.getByRole("heading", { name: "気になる点を質問する" }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "送信する", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "フォームを閉じる" }).click();
});
for (const scenario of [
  { label: "請求書づくり", run: "請求書をまとめて作成", result: "請求書" },
  {
    label: "問い合わせ対応",
    run: "受付・振り分けを実行",
    result: "一次返信の下書き",
  },
]) {
  test(`${scenario.label}の体験`, async ({ page }) => {
    await page.goto("/business/");
    await page
      .getByRole("button", { name: scenario.label, exact: true })
      .click();
    await page.getByRole("button", { name: "体験する", exact: true }).click();
    await page.getByRole("button", { name: scenario.run }).click();
    await expect(
      page.getByText(scenario.result, { exact: true }),
    ).toBeVisible();
    await page.getByRole("button", { name: "この自動化の費用を見る" }).click();
    await expect(page.getByText("買い切り", { exact: true })).toBeVisible();
  });
}
test("スマホ：入口と詳細をタップ操作でき、横にはみ出さない", async ({
  page,
}) => {
  await page.goto("/business/");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole("button", { name: "集計・転記", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "体験する", exact: true }),
  ).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
});
