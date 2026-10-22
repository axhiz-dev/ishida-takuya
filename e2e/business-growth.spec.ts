import { test, expect } from "@playwright/test";

const cases = [
  {
    kind: "prospecting", entry: "自社に合う営業先を見つけ、提案したい", reference: "営業先を見つけ、相手に合う提案を考える",
    samples: ["sales-draft", "sales-revised", "sales-reuse"],
    next: ["全国チェーンは外して。写真と寸法から相談する形にして", "この選び方をスキルにして、次は美容室で探して"],
    documents: [["会社案内", "こもれび家具製作所"], ["施工事例集", "幅1,800mm・奥行き350mm"]],
  },
  {
    kind: "proposal", entry: "会議の議事録から、提案資料を作りたい", reference: "Web会議の議事録から提案資料を作る",
    samples: ["proposal-notes", "proposal-draft", "proposal-reuse"],
    next: ["この過去の提案書とサービス案内を使って作って", "次からは、会議の議事録を渡すだけでここまで作りたい"],
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
      await expect(buttons.nth(0)).toHaveAccessibleName(cases[1].entry);
      await expect(buttons.nth(1)).toHaveAccessibleName(cases[0].entry);
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
        if (example.kind === "prospecting" && index === 0) {
          await turn.getByRole("button", { name: "全国ホテルチェーンA", exact: true }).click();
          await expect(turn).toContainText("全国で50施設");
          await page.getByRole("banner").getByRole("button", { name: "支援内容・費用", exact: true }).click();
          await page.getByRole("button", { name: "案内を閉じて元の画面に戻る" }).click();
          await expect(turn.getByRole("button", { name: "全国ホテルチェーンA", exact: true })).toHaveAttribute("aria-pressed", "true");
        }
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
          for (let slide = 1; slide <= 3; slide++) {
            const current = turn.getByRole("group", { name: `提案資料 ${slide}ページ目`, exact: true });
            await expect(current).toContainText("現状の課題");
            await expect(current).toContainText("改善のご提案");
            await expect(current.getByRole("img")).toHaveCount(2);
            await expect.poll(() => current.getByRole("img").evaluateAll(images => images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
            await current.scrollIntoViewIfNeeded();
            await current.screenshot({ path: testInfo.outputPath(`deck-${slide}-${width}.png`) });
            if (slide < 3) await navigation.getByRole("button", { name: "次へ", exact: true }).click();
          }
          await expect(navigation.getByRole("button", { name: "次へ", exact: true })).toBeDisabled();
          await turn.getByRole("button", { name: "過去の提案書を見る", exact: true }).click();
          const dialog = page.getByRole("dialog", { name: "過去の提案書", exact: true });
          await expect(dialog).toContainText("こはるオフィス様");
          for (let slide = 1; slide <= 3; slide++) {
            const previous = dialog.getByRole("group", { name: `提案資料 ${slide}ページ目`, exact: true });
            await expect.poll(() => previous.getByRole("img").evaluateAll(images => images.length === 2 && images.every(image => (image as HTMLImageElement).naturalWidth > 0))).toBe(true);
            expect(await dialog.evaluate(el => el.scrollWidth - el.clientWidth)).toBeLessThanOrEqual(1);
            if (slide < 3) await dialog.getByRole("button", { name: "次へ", exact: true }).click();
          }
          await page.keyboard.press("Escape");
          await expect(turn.getByRole("group", { name: "提案資料 3ページ目", exact: true })).toBeVisible();
          await expect(turn.getByRole("button", { name: "過去の提案書を見る", exact: true })).toBeFocused();
        }
        if (index === 2 && example.kind === "proposal") {
          const reuse = turn.locator('[data-growth-sample="proposal-reuse"]');
          await expect(reuse).toContainText("この議事録から、いつもの型で提案資料を作って");
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
      await expect(rules).toContainText(example.kind === "prospecting" ? "全国チェーンは対象外" : "足りない情報は確認事項に残す");
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
      const other = cases.find(item => item.kind !== example.kind)!;
      await page.getByRole("button", { name: other.entry, exact: true }).click();
      await expect(page.locator("[data-chat-turn]")).toHaveCount(1);
      await expect(page.locator("[data-growth-sample]")).toHaveAttribute("data-growth-sample", other.samples[0]);
      expect(outbound).toEqual([]);
    });
  }
}

test("資料を読んでいる間は回答を止め、閉じると続きから再開する", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/business/");
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.getByRole("button", { name: cases[1].entry, exact: true }).click();
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
  await expect(page.getByRole("button", { name: cases[1].next[0], exact: true })).toBeVisible();
});
