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
  const send = form.getByRole("button", { name: "この内容で相談を送信" });
  await send.evaluate((button) => {
    (button as HTMLButtonElement).click();
    (button as HTMLButtonElement).click();
  });
  await expect.poll(() => count).toBe(1);
  await expect(form.getByRole("button", { name: "送信中…" })).toBeDisabled();
  expect(data).toMatchObject({
    name: "確認 太郎",
    email: "test@example.com",
    message: "日本語の送信・再送を確認します。",
    業務: "AI活用について",
  });
  release();
  await expect(page.getByRole("status")).toContainText(
    "お問い合わせを受け付けました",
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
    await form.getByRole("button", { name: "この内容で相談を送信" }).click();
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
    await form.getByRole("button", { name: "この内容で相談を送信" }).click();
    await expect(page.getByRole("status")).toContainText(
      "お問い合わせを受け付けました",
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
    form.getByRole("button", { name: "この内容で相談を送信" }),
  ).toHaveCount(0);
});
test("honeypotが埋まっていたら送信しない", async ({ page }) => {
  let count = 0;
  await page.route(endpoint, (route) => {
    count++;
    return route.abort();
  });
  const form = await openForm(page);
  await form.locator('input[name="_gotcha"]').fill("bot", { force: true });
  await form.getByRole("button", { name: "相談内容を確認する" }).click();
  await form.getByRole("button", { name: "この内容で相談を送信" }).click();
  await expect(
    form.getByRole("button", { name: "この内容で相談を送信" }),
  ).toBeEnabled();
  expect(count).toBe(0);
});
