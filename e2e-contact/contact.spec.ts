import { test, expect, type Page } from "@playwright/test";
const endpoint = "https://formspree.io/f/**";
async function openForm(page: Page) {
  await page.goto("/business/");
  await page.getByRole("button", { name: "相談する", exact: true }).click();
  const form = page.getByRole("region", { name: "相談フォーム" });
  await form.getByLabel("お名前", { exact: true }).fill("確認 太郎");
  await form.getByLabel("メールアドレス").fill("test@example.com");
  await form
    .getByLabel("相談したいこと（任意）")
    .fill("日本語の送信・再送を確認します。");
  await form.getByRole("checkbox").check();
  return form;
}
test.beforeEach(async ({ page }) => {
  await page.route(endpoint, (route) => route.abort());
});
test("確認後に送信：内容が揃い、連打でも1件だけ送信する", async ({ page }) => {
  let count = 0;
  let data: Record<string, string> = {};
  let release!: () => void;
  const gate = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route(endpoint, async (route) => {
    count++;
    data = route.request().postDataJSON();
    await gate;
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: '{"ok":true}',
    });
  });
  const form = await openForm(page);
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  expect(count).toBe(0);
  const send = form.getByRole("button", { name: "この内容で無料相談を申し込む" });
  await send.evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect.poll(() => count).toBe(1);
  await expect(form.getByRole("button", { name: "送信中…" })).toBeDisabled();
  await expect(form.getByRole("button", { name: "送信中…" })).toHaveAttribute("aria-busy", "true");
  await expect(form.getByText("送信しています。このままお待ちください。")).toBeVisible();
  expect(data).toMatchObject({
    name: "確認 太郎",
    email: "test@example.com",
    message: "日本語の送信・再送を確認します。",
    参考に見た事例: "なし",
    希望日時_第1希望: "未指定",
    希望日時_第2希望: "未指定",
    希望日時_第3希望: "未指定",
  });
  release();
  await expect(page.getByRole("status")).toContainText(
    "無料相談のお申し込みを受け付けました",
  );
  expect(count).toBe(1);
});
for (const failure of ["http", "network", "timeout"] as const)
  test(`${failure}：失敗後も入力を保持し再送できる`, async ({ page }) => {
    let count = 0;
    await page.route(endpoint, async (route) => {
      count++;
      if (count > 1) return route.fulfill({ status: 200, body: '{"ok":true}' });
      if (failure === "http") return route.fulfill({ status: 503, body: "{}" });
      if (failure === "network") return route.abort();
    });
    const form = await openForm(page);
    await form.getByRole("button", { name: "相談内容を確認する" }).click();
    await form.getByRole("button", { name: "この内容で無料相談を申し込む" }).click();
    await expect(form.getByRole("alert")).toContainText(
      "入力内容は残っています",
      { timeout: 20000 },
    );
    await form.getByRole("button", { name: "戻って修正" }).click();
    await expect(form.getByLabel("お名前", { exact: true })).toHaveValue(
      "確認 太郎",
    );
    await expect(form.getByRole("checkbox")).toBeChecked();
    await form.getByRole("button", { name: "相談内容を確認する" }).click();
    await form.getByRole("button", { name: "この内容で無料相談を申し込む" }).click();
    await expect(page.getByRole("status")).toContainText(
      "無料相談のお申し込みを受け付けました",
    );
    expect(count).toBe(2);
  });
test("必須入力・不正メール・同意なしは確認へ進めない", async ({ page }) => {
  const form = await openForm(page);
  const confirm = form.getByRole("button", { name: "相談内容を確認する" });
  await form.getByLabel("お名前", { exact: true }).fill("");
  await confirm.click();
  await expect(form.getByLabel("お名前", { exact: true })).toBeFocused();
  await form.getByLabel("お名前", { exact: true }).fill("確認 太郎");
  await form.getByLabel("メールアドレス").fill("invalid");
  await confirm.click();
  await expect(form.getByLabel("メールアドレス")).toBeFocused();
  await form.getByLabel("メールアドレス").fill("test@example.com");
  await form.getByRole("checkbox").uncheck();
  await confirm.click();
  await expect(form.getByRole("checkbox")).toBeFocused();
  await expect(
    form.getByRole("button", { name: "この内容で無料相談を申し込む" }),
  ).toHaveCount(0);
});
test("自動入力でチェック項目が埋まっても無反応にならず、確認して再送できる", async ({ page }) => {
  let count = 0;
  await page.route(endpoint, (route) => {
    count++;
    return route.fulfill({ status: 200, body: '{"ok":true}' });
  });
  const form = await openForm(page);
  await form.locator('input[name="_gotcha"]').fill("bot", { force: true });
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await expect(form.getByRole("alert")).toContainText("入力内容を確認できませんでした");
  await expect(form.getByLabel("お名前", { exact: true })).toHaveValue("確認 太郎");
  await expect(form.locator('input[name="_gotcha"]')).toHaveValue("");
  expect(count).toBe(0);
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await form.getByRole("button", { name: "この内容で無料相談を申し込む" }).click();
  await expect(page.getByRole("status")).toContainText("無料相談のお申し込みを受け付けました");
  expect(count).toBe(1);
});

test("changeイベントを発火しないブラウザー自動入力も確認画面と送信に反映する", async ({ page }) => {
  let data: Record<string, string> = {};
  await page.route(endpoint, (route) => {
    data = route.request().postDataJSON();
    return route.fulfill({ status: 200, body: '{"ok":true}' });
  });
  const form = await openForm(page);
  await form.getByRole("checkbox").uncheck();
  await form.getByRole("checkbox").evaluate((input) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "checked")!.set!.call(input, true);
  });
  await form.locator('input[name="email"]').evaluate((input) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!.call(input, "autofill@example.com");
  });
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await expect(form).toContainText("autofill@example.com");
  await form.getByRole("button", { name: "この内容で無料相談を申し込む" }).click();
  await expect(page.getByRole("status")).toContainText("無料相談のお申し込みを受け付けました");
  expect(data.email).toBe("autofill@example.com");
});

test("第1〜第3希望を選択し、確認・修正・エラー後も保持して送信する", async ({ page }) => {
  let count = 0;
  let data: Record<string, string> = {};
  await page.route(endpoint, (route) => {
    count++;
    data = route.request().postDataJSON();
    return route.fulfill({ status: count === 1 ? 503 : 200, body: count === 1 ? "{}" : '{"ok":true}' });
  });
  const form = await openForm(page);
  const dates = [
    { date: "2099-10-25", start: "18:00", end: "20:00", label: "2099年10月25日 18:00〜20:00" },
    { date: "2099-10-26", start: "10:30", end: "12:00", label: "2099年10月26日 10:30〜12:00" },
    { date: "2099-11-02", start: "18:00", end: "19:00", label: "2099年11月2日 18:00〜19:00" },
  ];
  for (const [index, slot] of dates.entries()) {
    await form.getByLabel(`第${index + 1}希望の日付`, { exact: true }).fill(slot.date);
    await form.getByLabel(`第${index + 1}希望の開始時間`, { exact: true }).selectOption(slot.start);
    await form.getByLabel(`第${index + 1}希望の終了時間`, { exact: true }).selectOption(slot.end);
  }
  await expect(form).toContainText("平日は18時以降");
  await expect(form).toContainText("土日は、早めにご相談いただければ調整可能");
  await expect(form).toContainText("平日日中をご希望の場合も、まずはご相談ください。");
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  for (const slot of dates) await expect(form).toContainText(slot.label);
  await form.getByRole("button", { name: "戻って修正" }).click();
  for (const [index, slot] of dates.entries()) {
    await expect(form.getByLabel(`第${index + 1}希望の日付`, { exact: true })).toHaveValue(slot.date);
    await expect(form.getByLabel(`第${index + 1}希望の開始時間`, { exact: true })).toHaveValue(slot.start);
    await expect(form.getByLabel(`第${index + 1}希望の終了時間`, { exact: true })).toHaveValue(slot.end);
  }
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await form.getByRole("button", { name: "この内容で無料相談を申し込む" }).click();
  await expect(form.getByRole("alert")).toContainText("入力内容は残っています");
  const email = new URL((await form.getByRole("link", { name: "メールでご連絡ください" }).getAttribute("href"))!);
  for (const slot of dates) expect(email.searchParams.get("body")).toContain(slot.label);
  await form.getByRole("button", { name: "戻って修正" }).click();
  for (const [index, slot] of dates.entries()) await expect(form.getByLabel(`第${index + 1}希望の日付`, { exact: true })).toHaveValue(slot.date);
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await form.getByRole("button", { name: "この内容で無料相談を申し込む" }).click();
  await expect(page.getByRole("status")).toContainText("無料相談のお申し込みを受け付けました");
  expect(data).toMatchObject({ 希望日時_第1希望: dates[0]!.label, 希望日時_第2希望: dates[1]!.label, 希望日時_第3希望: dates[2]!.label });
});

test("希望日時の途中入力・時間の逆転・過去日を防ぎ、スマホでも選べる", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const form = await openForm(page);
  const date = form.getByLabel("第1希望の日付", { exact: true });
  const start = form.getByLabel("第1希望の開始時間", { exact: true });
  const end = form.getByLabel("第1希望の終了時間", { exact: true });
  await expect(date).toHaveAttribute("type", "date");
  await date.fill("2099-10-25");
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await expect(form.getByRole("alert")).toContainText("開始時間を選択");
  await start.selectOption("18:00");
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await expect(form.getByRole("alert")).toContainText("終了時間を選択");
  for (const value of ["17:30", "18:00"]) {
    await end.selectOption(value);
    await form.getByRole("button", { name: "相談内容を確認する" }).click();
    await expect(form.getByRole("alert")).toContainText("終了時間は開始時間より後");
  }
  await date.fill("2000-01-01");
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await expect(date).toBeFocused();
  await expect(form.getByRole("button", { name: "この内容で無料相談を申し込む" })).toHaveCount(0);
  await date.fill("2099-10-25");
  await end.selectOption("19:00");
  const panel = page.getByRole("dialog");
  expect(await panel.evaluate((node) => node.scrollWidth <= node.clientWidth)).toBe(true);
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await expect(form).toContainText("2099年10月25日 18:00〜19:00");
});
