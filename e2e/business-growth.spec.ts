import { test, expect } from "@playwright/test";

const cases = [
  {
    kind: "proposal", entry: "会議の議事録から、提案資料を作りたい", reference: "Web会議の議事録から提案資料を作る",
    samples: ["proposal-notes", "proposal-draft", "proposal-reuse"],
    next: ["この過去の提案書と見積一覧で、見積も一緒に作って", "次からは、会議の議事録を渡すだけでここまで作りたい"],
    documents: [["Web会議の議事録", "まず何を変えるとよいか"]],
  },
];

for (const width of [390, 1440]) {
  for (const example of cases) {
    test(`${width}px：${example.kind}を最後まで体験し、資料の中身と復帰を確認`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const outbound: string[] = [];
      await page.route(/formspree\.io|gmail\.googleapis\.com|api\.openai\.com/, async route => { outbound.push(route.request().url()); await route.abort(); });
      await page.goto("/business/");
      const buttons = page.getByRole("region", { name: "選択肢パネル" }).getByRole("button");
      await expect(buttons.nth(0)).toHaveAccessibleName(cases[0].entry);
      await expect(buttons.nth(1)).toHaveAccessibleName("毎月、数字の照合と確認に時間がかかる");
      await expect(buttons.nth(2)).toHaveAccessibleName("返信の確認や催促、シフト調整に追われる");
      await expect(page.getByRole("button", { name: "自社に合う営業先を見つけ、提案したい", exact: true })).toHaveCount(0);
      if (width === 1440) expect(await page.locator("main").evaluate(el => el.scrollHeight - el.clientHeight)).toBeLessThanOrEqual(1);
      await page.getByRole("button", { name: example.entry, exact: true }).click();
      for (const [title, evidence] of example.documents) {
        const trigger = page.locator('[aria-label="ユーザーの発言"]').getByRole("button", { name: `${title}を見る`, exact: true });
        await trigger.click();
        const dialog = page.getByRole("dialog", { name: title, exact: true });
        await expect(dialog).toBeVisible();
        await expect(dialog).toContainText(evidence);
        await expect(dialog).toContainText("架空のサンプルデータ");
        expect(await dialog.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
        await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
        if (title === "過去の提案書") {
          await page.screenshot({ path: testInfo.outputPath(`source-${width}.png`) });
          await page.keyboard.press("Escape");
        } else await dialog.getByRole("button", { name: "資料を閉じる" }).click();
        await expect(dialog).toHaveCount(0);
        await expect(trigger).toBeFocused();
      }
      for (let index = 0; index < example.samples.length; index++) {
        const turn = page.locator("[data-chat-turn]").last();
        await expect(turn).toHaveAttribute("data-phase", "ready");
        await expect(turn.locator("[data-growth-sample]")).toHaveAttribute("data-growth-sample", example.samples[index]);
        if (index === 0 && example.kind === "proposal") {
          const notes = turn.locator('[data-growth-sample="proposal-notes"]');
          await expect(notes.getByRole("list")).toHaveCount(3);
          await expect(notes.getByRole("listitem")).toHaveCount(9);
          await expect(notes.getByRole("button")).toHaveCount(0);
          await expect(notes).not.toContainText("架空の");
          await expect(turn).toContainText("過去の提案書はありますか？");
        }
        if (index === 1 && example.kind === "proposal") {
          const navigation = turn.getByRole("group", { name: "提案資料のページ切り替え" });
          await expect(navigation.getByRole("button", { name: "前へ", exact: true })).toBeDisabled();
          for (let slide = 1; slide <= 4; slide++) {
            const current = turn.getByRole("group", { name: `提案資料 ${slide}ページ目`, exact: true });
            if (slide < 4) await expect(current).toContainText("現状の課題");
            else await expect(current).toContainText("合計 175,000円（税別）");
            await expect(current.getByRole("img")).toHaveCount(1);
            const rect = await current.boundingBox();
            expect(rect!.width / rect!.height).toBeCloseTo(16 / 9, 1);
            await expect.poll(() => current.getByRole("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
            await current.scrollIntoViewIfNeeded();
            await current.screenshot({ path: testInfo.outputPath(`deck-${slide}-${width}.png`) });
            if (slide < 4) await navigation.getByRole("button", { name: "次へ", exact: true }).click();
          }
          await expect(navigation.getByRole("button", { name: "次へ", exact: true })).toBeDisabled();
          await turn.getByRole("button", { name: "過去の提案書を見る", exact: true }).click();
          const dialog = page.getByRole("dialog", { name: "過去の提案書", exact: true });
          await expect(dialog).toContainText("こはるオフィス様");
          await expect(dialog).toContainText("募集条件を、職種ごとに比べやすく");
          for (let slide = 1; slide <= 3; slide++) {
            const previous = dialog.getByRole("group", { name: `提案資料 ${slide}ページ目`, exact: true });
            await expect.poll(() => previous.getByRole("img").evaluateAll(images => images.length === 1 && images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
            expect(await dialog.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
            if (slide < 3) await dialog.getByRole("button", { name: "次へ", exact: true }).click();
          }
          await page.keyboard.press("Escape");
          await expect(turn.getByRole("group", { name: "提案資料 4ページ目", exact: true })).toBeVisible();
          await expect(turn.getByRole("button", { name: "過去の提案書を見る", exact: true })).toBeFocused();
          await turn.getByRole("button", { name: "過去の対応・見積一覧を見る", exact: true }).click();
          const history = page.getByRole("dialog", { name: "過去の対応・見積一覧", exact: true });
          await expect(history.getByRole("row")).toHaveCount(7);
          await expect(history.getByRole("columnheader").first()).toHaveText("対応内容");
          await expect(history.getByRole("columnheader").last()).toHaveText("管理番号・年月");
          await page.screenshot({ path: testInfo.outputPath(`estimate-${width}.png`) });
          await expect(history.getByRole("row").filter({ hasText: "E-01" })).toContainText("90,000円");
          await expect(history.getByRole("row").filter({ hasText: "E-03" })).toContainText("40,000円");
          await expect(history.getByRole("row").filter({ hasText: "E-06" })).toContainText("45,000円");
          expect(await history.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
          await page.keyboard.press("Escape");
          const download = turn.getByRole("link", { name: "PowerPointをダウンロード", exact: true });
          const response = await page.request.get((await download.getAttribute("href"))!);
          expect(response.ok()).toBe(true);
          expect((await response.body()).subarray(0, 2).toString()).toBe("PK");
        }
        if (index === 2 && example.kind === "proposal") {
          const reuse = turn.locator('[data-growth-sample="proposal-reuse"]');
          await expect(reuse).toContainText("/proposal-maker この議事録から提案資料と概算見積を作って");
          await expect(turn).toContainText("/proposal-maker というスキルにまとめました");
          await expect(reuse).toContainText("毎回デザインや見積の出し方を説明する必要はありません");
          await expect(reuse).not.toContainText("会議のあと、そのまま提案へ");
          await expect(reuse).not.toContainText("架空の");
        }
        if (index < example.next.length) await page.getByRole("button", { name: example.next[index], exact: true }).click();
      }
      await expect(page.locator("[data-chat-turn]")).toHaveCount(example.samples.length);
      const rules = page.locator("details").filter({ has: page.getByText("スキルに残すルールを見る", { exact: true }) });
      await expect(rules).not.toHaveAttribute("open", "");
      await rules.locator("summary").click();
      await expect(rules).toHaveAttribute("open", "");
      await expect(rules).toContainText("足りない情報は確認事項に残す");
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
      expect(await page.locator("main").evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
      await page.getByRole("button", { name: "自分の仕事について相談する", exact: true }).waitFor();
      await page.locator("main").evaluate(el => { el.scrollTop = el.scrollHeight; });
      const position = await page.locator("main").evaluate(el => el.scrollTop);
      const shot = testInfo.outputPath(`${example.kind}-${width}.png`);
      await page.screenshot({ path: shot });
      await testInfo.attach(example.kind, { path: shot, contentType: "image/png" });
      await page.getByRole("button", { name: "自分の仕事について相談する", exact: true }).click();
      await expect(page.getByRole("region", { name: "相談フォーム" })).toContainText(example.reference);
      await page.getByRole("button", { name: "案内を閉じて元の画面に戻る" }).click();
      await expect(page.locator('[data-chat-turn][data-phase="ready"]')).toHaveCount(example.samples.length);
      await expect(rules).toHaveAttribute("open", "");
      await expect.poll(() => page.locator("main").evaluate(el => el.scrollTop)).toBe(position);
      await page.getByRole("button", { name: "もうひとつの事例を見る", exact: true }).click();
      await page.getByRole("button", { name: "元の選択肢に戻る", exact: true }).click();
      await expect(page.getByRole("button", { name: "自分の仕事について相談する", exact: true })).toBeVisible();
      await page.getByRole("button", { name: "もうひとつの事例を見る", exact: true }).click();
      await expect(page.getByRole("button", { name: "自社に合う営業先を見つけ、提案したい", exact: true })).toHaveCount(0);
      await page.getByRole("button", { name: "毎月、数字の照合と確認に時間がかかる", exact: true }).click();
      await expect(page.locator("[data-chat-turn]")).toHaveCount(1);
      await expect(page.getByRole("button", { name: "同じ会社です。このルールで照合して", exact: true })).toBeVisible();
      expect(outbound).toEqual([]);
    });
  }
}

test("資料を読んでいる間は回答を止め、閉じると続きから再開する", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/business/");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: cases[0].entry, exact: true }).click();
  await page.getByRole("button", { name: "入力を完了して送信" }).click();
  const now = new Date("2026-10-21T01:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.clock.runFor(2500);
  const turn = page.locator("[data-chat-turn]").last();
  await expect(turn).toHaveAttribute("data-phase", "streaming");
  await page.getByRole("button", { name: "Web会議の議事録を見る", exact: true }).click();
  const before = await turn.locator('[class*="botResponse"]').textContent();
  await page.clock.runFor(30000);
  expect(await turn.locator('[class*="botResponse"]').textContent()).toBe(before);
  await page.keyboard.press("Escape");
  await page.clock.runFor(450);
  expect(await turn.locator('[class*="botResponse"]').textContent()).not.toBe(before);
  await page.getByRole("button", { name: "回答をすべて表示" }).click();
  await page.clock.runFor(999);
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
  await page.clock.runFor(1);
  await expect(page.getByRole("button", { name: cases[0].next[0], exact: true })).toBeVisible();
});
