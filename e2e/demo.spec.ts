import { test, expect } from "@playwright/test";
import { shiftSteps } from "../src/components/business/chat/content";

test("集計：判断、結果、相談への引き継ぎと未設定時の送信防止", async ({
  page,
}) => {
  await page.goto("/business/");
  await page.getByRole("button", { name: /^毎月のExcel集計/ }).click();
  await page
    .getByRole("button", { name: /^判断が難しいものは確認に回す/ })
    .click();
  await expect(
    page.getByText("判断できない取引先を、確認用に分けました。"),
  ).toBeVisible();
  await page.getByRole("button", { name: "自分の仕事で考えてみる" }).click();
  await page
    .getByRole("button", { name: "数字の違いを確認する", exact: true })
    .click();
  await page.getByRole("button", { name: /^この仕事について相談する/ }).click();
  const form = page.getByRole("region", { name: "相談フォーム" });
  await expect(form).toContainText("毎月のExcel集計");
  await expect(form).toContainText("数字の違いを確認する");
  await form.getByLabel("お名前", { exact: true }).fill("確認 太郎");
  await form.getByLabel("メールアドレス").fill("test@example.com");
  await form.getByRole("checkbox").check();
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await expect(
    form.getByRole("button", { name: "送信受付は準備中" }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "費用・FAQ", exact: true }).click();
  await page.getByRole("button", { name: "相談する", exact: true }).click();
  await expect(form).toContainText("test@example.com");
  await form.getByRole("button", { name: "戻って修正" }).click();
  await expect(form.getByLabel("お名前", { exact: true })).toHaveValue(
    "確認 太郎",
  );
});

test("LINE：FAQへ寄り道しても進行を保ち、最後まで体験できる", async ({
  page,
}) => {
  await page.goto("/business/");
  await page
    .getByRole("button", { name: /^シフトの回収・調整をおまかせ/ })
    .click();
  for (let i = 0; i < 3; i++)
    await page
      .getByRole("button", { name: shiftSteps[i]!.next, exact: true })
      .click();
  await expect(
    page.getByText("金曜の18〜22時が1人足りません。入れる方はいますか？"),
  ).toBeVisible();
  await page.getByRole("button", { name: "費用・FAQ", exact: true }).click();
  await page
    .getByRole("button", { name: "月額には何が含まれますか？", exact: true })
    .click();
  await expect(page.getByText(/一定量のLINE・AI利用料/)).toBeVisible();
  await page
    .getByRole("group", { name: "回答のあとに" })
    .getByRole("button", { name: "体験の続きに戻る" })
    .click();
  for (let i = 3; i < 6; i++)
    await page
      .getByRole("button", { name: shiftSteps[i]!.next, exact: true })
      .click();
  await page.getByRole("button", { name: "希望を集める", exact: true }).click();
  await expect(
    page.getByRole("button", { name: /^この仕事について相談する/ }),
  ).toBeVisible();
});

test("メニューは検索・キーボード・閉じた後のフォーカス復帰が動く", async ({
  page,
}) => {
  await page.goto("/business/");
  const launcher = page.getByRole("button", {
    name: "メニューから、できることを選ぶ",
  });
  await launcher.click();
  await page.getByLabel("メニューを検索").fill("費用");
  await expect(
    page
      .getByRole("region", { name: "できること", exact: true })
      .getByRole("button", { name: "よくある質問" }),
  ).toHaveCount(0);
  await page.getByLabel("メニューを検索").press("Escape");
  await expect(launcher).toBeFocused();
  await expect(launcher).toHaveAttribute("aria-expanded", "false");
});

for (const width of [320, 390, 768])
  test(`LINE各場面：${width}pxでも横溢れせずメニューが見える`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    await page.goto("/business/");
    await page
      .getByRole("button", { name: /^シフトの回収・調整をおまかせ/ })
      .click();
    for (const step of shiftSteps) {
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      const box = await page
        .getByRole("button", { name: "メニューから、できることを選ぶ" })
        .boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      await page.getByRole("button", { name: step.next, exact: true }).click();
    }
  });
