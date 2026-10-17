import { test, expect } from "@playwright/test";
import { shiftSteps } from "../src/components/business/chat/content";

// Apply media emulation to each page before navigation, including in CI.
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  expect(await page.evaluate(() => matchMedia("(prefers-reduced-motion: reduce)").matches)).toBe(true);
});

test("集計：判断、結果、相談への引き継ぎと未設定時の送信防止", async ({
  page,
}) => {
  await page.goto("/business/");
  await page.getByRole("button", { name: /^毎月、数字の照合と確認に時間がかかる/ }).click();
  await page.getByRole("button", { name: "同じ会社です。このルールで照合して" }).click();
  await page.getByRole("button", { name: "担当者を伝えて、確認メールを下書きして" }).click();
  await page.getByRole("button", { name: "件数の多いサンプルで月次レポートを見てみる" }).click();
  await expect(page.getByRole("region", { name: "月次レポートのサンプル" })).toContainText("5,360,000円");
  await page.getByRole("button", { name: "月次レポートまで毎月使えるスキルにして" }).click();
  await expect(page.getByRole("button", { name: "自分の仕事で考えてみる" })).toHaveCount(0);
  await page.getByRole("button", { name: "自分の仕事について相談する", exact: true }).click();
  const form = page.getByRole("region", { name: "相談フォーム" });
  await expect(form).toContainText("毎月のExcel集計");
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

test("LINE：相談でルールを決め、FAQへ寄り道しても会話を保つ", async ({
  page,
}) => {
  await page.goto("/business/");
  await page
    .getByRole("button", { name: /^返信の確認や催促、シフト調整に追われる/ })
    .click();
  // Start with questions about the work, before showing a finished bot.
  await expect(page.getByText(/毎月いつ募集して、いつまでに希望を集めていますか/)).toBeVisible();
  await expect(page.getByRole("region", { name: "LINE連携のサンプル体験" })).toHaveCount(0);
  for (let i = 0; i < 2; i++)
    await page
      .getByRole("button", { name: shiftSteps[i]!.next, exact: true })
      .click();
  const replySample = page.getByRole("region", { name: "LINE連携のサンプル体験" }).last();
  await expect(replySample.locator("small + div")).toHaveText([
    "火曜は夕方から入れます",
    "火曜日は何時から勤務できますか？",
    "17時からです",
    "山田さん、火曜日17時からLASTで登録しました！",
  ]);
  await expect(page.locator("[data-chat-turn]")).toHaveCount(3);
  await page.getByRole("button", { name: "費用・FAQ", exact: true }).click();
  await page
    .getByRole("button", { name: "月額には何が含まれますか？", exact: true })
    .click();
  await expect(page.getByText(/一定量のLINE・AI利用料/)).toBeVisible();
  await page
    .getByRole("group", { name: "回答のあとに" })
    .getByRole("button", { name: "体験の続きに戻る" })
    .click();
  await expect(page.locator("[data-chat-turn]:visible")).toHaveCount(3);
  await expect(replySample).toContainText("山田さん、火曜日17時からLASTで登録しました！");
  for (let i = 2; i < shiftSteps.length - 1; i++)
    await page
      .getByRole("button", { name: shiftSteps[i]!.next, exact: true })
      .click();
  const trial = page.locator("[data-chat-turn]").last();
  const timeline = trial.getByRole("region", { name: "募集から確定までのLINEトーク" });
  await expect(timeline).toContainText("20日 · 設定した日に自動で募集");
  await expect(timeline).toContainText("24日 · 未回答の人に1回だけ催促");
  await expect(timeline).toContainText("募集から確認・共有まで完了");
  await expect(timeline).not.toContainText("いつもの言葉で、このLINEに返信してください。");
  const weeklyRows = timeline.getByRole("table", { name: "1週間のシフト案" }).locator("tbody tr");
  await expect(weeklyRows).toHaveCount(7);
  await expect(timeline.getByRole("table", { name: "確定した1週間のシフト" }).locator("tbody tr")).toHaveCount(7);
  await expect(weeklyRows.locator("th")).toHaveText([
    "月曜17〜22時", "火曜17〜22時", "水曜17〜22時", "木曜17〜22時", "金曜17〜22時", "土曜18〜22時", "日曜18〜22時",
  ]);
  await expect(weeklyRows.locator("td:last-child")).toHaveText(["2人", "2人", "2人", "2人", "2人", "3人", "3人"]);
  expect(await timeline.evaluate(el => el.scrollHeight > el.clientHeight)).toBe(true);
  await timeline.focus();
  const mainScroll = await page.locator("main").evaluate(el => el.scrollTop);
  await page.keyboard.press("End");
  await expect.poll(() => timeline.evaluate(el => el.scrollTop)).toBeGreaterThan(0);
  expect(await page.locator("main").evaluate(el => el.scrollTop)).toBe(mainScroll);
  await trial.getByText("AIと整理した指示文を見る", { exact: true }).click();
  await expect(page.getByRole("region", { name: "シフト調整の指示文の見本" })).toContainText("24日に未回答者へ1回だけ");
  await expect(page.locator("[data-chat-turn]")).toHaveCount(7);
  await page.getByRole("button", { name: "自分の仕事について相談する", exact: true }).click();
  await expect(page.getByRole("region", { name: "相談フォーム" })).toContainText("LINEのシフト調整をAIと仕組みにする");
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
      .getByRole("button", { name: /^返信の確認や催促、シフト調整に追われる/ })
      .click();
    for (const step of shiftSteps) {
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth - innerWidth,
        ),
      ).toBeLessThanOrEqual(1);
      const panel = page.getByRole("region", { name: "選択肢パネル" });
      await expect(panel).toBeVisible();
      const box = await panel.boundingBox();
      expect(box!.y + box!.height).toBeLessThanOrEqual(844);
      await page.getByRole("button", { name: step.next, exact: true }).click();
    }
  });
