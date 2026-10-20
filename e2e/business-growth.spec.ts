import { test, expect } from "@playwright/test";

const cases = [
  {
    kind: "prospecting",
    entry: "自社に合う営業先を見つけ、提案したい",
    reference: "営業先を見つけ、相手に合う提案を考える",
    samples: ["materials", "candidates", "qualified", "outreach", "revised-outreach", "sales-skill"],
    next: [
      "小ロットの造作家具が得意。首都圏で20〜100万円の案件を増やしたい",
      "全国チェーンは外して。1〜3店舗くらいで、部分的な改装を相談できる相手がいい",
      "ホテルKOTO向けに、施工事例を添えた初回メールを作って",
      "無料の現地調査は約束せず、まず写真と寸法で相談する形にして",
      "候補の選び方と、提案するときのルールをスキルにして",
    ],
  },
  {
    kind: "proposal",
    entry: "社長の提案力を、社員も使えるようにしたい",
    reference: "社長の提案力を社員も使えるようにする",
    samples: ["meeting", "first-proposal", "judgment", "revised-proposal", "revised-proposal", "proposal-skill"],
    next: [
      "店舗からの買い替え相談です。過去の提案書と商品資料も使って",
      "すぐ機種を選ばず、冷えない時間帯と席、使い方から確認して",
      "西日の当たる窓側だけ冷えにくい。清掃は未確認。提案を直して",
      "この提案書に、次に聞くことと、私の確認が必要なところも残して",
      "商談メモから同じ観点で提案を考えられるスキルにして",
    ],
  },
];

for (const width of [390, 1440]) {
  for (const example of cases) {
    test(`${width}px：${example.kind}の相談・修正・スキルと復帰`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ reducedMotion: "reduce" });
      const outbound: string[] = [];
      await page.route(/formspree\.io|gmail\.googleapis\.com|api\.openai\.com/, async route => {
        outbound.push(route.request().url());
        await route.abort();
      });
      await page.goto("/business/");
      const entry = page.getByRole("region", { name: "選択肢パネル" });
      const buttons = entry.getByRole("button");
      await expect(buttons.nth(0)).toHaveAccessibleName(cases[0].entry);
      await expect(buttons.nth(1)).toHaveAccessibleName(cases[1].entry);
      await page.getByRole("button", { name: example.entry, exact: true }).click();
      for (let index = 0; index < example.samples.length; index++) {
        const turn = page.locator("[data-chat-turn]").last();
        await expect(turn).toHaveAttribute("data-phase", "ready");
        await expect(turn.locator("[data-growth-sample]")).toHaveAttribute("data-growth-sample", example.samples[index]);
        if (example.kind === "prospecting" && index === 1) {
          await turn.getByRole("button", { name: "美容室nagi", exact: true }).click();
          await expect(turn.getByRole("heading", { name: "美容室nagi", exact: true })).toBeVisible();
          await page.getByRole("banner").getByRole("button", { name: "支援内容・費用", exact: true }).click();
          await page.getByRole("button", { name: "案内を閉じて元の画面に戻る" }).click();
          await expect(turn.getByRole("button", { name: "美容室nagi", exact: true })).toHaveAttribute("aria-pressed", "true");
        }
        if (index < example.next.length) await page.getByRole("button", { name: example.next[index], exact: true }).click();
      }
      await expect(page.locator("[data-chat-turn]")).toHaveCount(6);
      await expect(page.locator("main")).toContainText(example.kind === "prospecting" ? "写真と寸法から相談" : "日差しの影響は仮説");
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
      await expect(page.locator("[data-chat-turn]")).toHaveCount(6);
      await expect(page.locator('[data-chat-turn][data-phase="ready"]')).toHaveCount(6);
      await expect.poll(() => page.locator("main").evaluate(el => el.scrollTop)).toBe(position);
      await page.getByRole("button", { name: "もうひとつの事例を見る", exact: true }).click();
      await expect(page.getByRole("button", { name: example.entry, exact: true })).toHaveCount(0);
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

test("新しい事例も、回答完了から1秒待って選択肢を表示する", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/business/");
  await page.getByRole("button", { name: cases[0].entry, exact: true }).click();
  await page.getByRole("button", { name: cases[0].next[0], exact: true }).waitFor();
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const now = new Date("2026-10-20T16:00:00Z");
  await page.clock.install({ time: now });
  await page.clock.pauseAt(now);
  await page.getByRole("button", { name: cases[0].next[0], exact: true }).click();
  await page.getByRole("button", { name: "入力を完了して送信" }).click();
  await page.getByRole("button", { name: "回答をすべて表示" }).click();
  await page.clock.runFor(999);
  await expect(page.getByRole("region", { name: "選択肢パネル" })).toHaveCount(0);
  await page.clock.runFor(1);
  await expect(page.getByRole("button", { name: cases[0].next[1], exact: true })).toBeVisible();
});
