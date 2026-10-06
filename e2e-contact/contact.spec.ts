import { test, expect, type Page } from '@playwright/test';
const endpoint = 'https://formspree.io/f/**';
async function openForm(page: Page) {
  await page.goto('/business/');
  const dialog = page.locator('#contact');
  await dialog.scrollIntoViewIfNeeded();
  await dialog.getByLabel('お名前', { exact: true }).fill('確認 太郎');
  await dialog.getByLabel('メールアドレス', { exact: true }).fill('test@example.com');
  await dialog.getByLabel('相談したい仕事').fill('日本語の送信・再送を確認します。');
  await dialog.getByRole('checkbox').check();
  return dialog;
}
// Every Formspree request is intercepted, including unexpected ones. No real email.
test.beforeEach(async ({ page }) => { await page.route(endpoint, route => route.abort()); });
test('成功：送信値が揃い、連打でも1件だけ無料相談を申し込む', async ({ page }) => {
  let count = 0;
  let body = '';
  let release!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  await page.route(endpoint, async route => {
    count++;
    body = route.request().postData() ?? '';
    await gate;
    await route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' });
  });
  const dialog = await openForm(page);
  const send = dialog.getByRole('button', { name: '無料相談を申し込む', exact: true });
  // Synchronous duplicate events exercise the ref guard before React rerenders.
  await dialog.locator('form').evaluate(form => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await expect.poll(() => count).toBe(1);
  await expect(dialog.getByRole('button', { name: '送信中…' })).toBeDisabled();
  for (const value of ['確認 太郎', 'test@example.com', '日本語の送信・再送を確認します。', 'Slack', '確認済み']) expect(body).toContain(value);
  expect(body).toContain('name="contact_method"');
  expect(body).toContain('name="privacy_consent"');
  release();
  await expect(dialog.getByRole('status')).toContainText('お問い合わせを受け付けました');
  await expect(send).toHaveCount(0);
  expect(count).toBe(1);
});
for (const failure of ['http', 'network', 'timeout'] as const) {
  test(`${failure}：失敗後も入力・同意を保持し再送できる`, async ({ page }) => {
    let count = 0;
    await page.route(endpoint, async route => {
      count++;
      if (count > 1) return route.fulfill({ status: 200, body: '{"ok":true}' });
      if (failure === 'http') return route.fulfill({ status: 503, body: '{}' });
      if (failure === 'network') return route.abort();
      // Leave the first response pending so the application's real 15s abort fires.
    });
    const dialog = await openForm(page);
    await dialog.getByRole('button', { name: '無料相談を申し込む', exact: true }).click();
    await expect(dialog.getByRole('alert')).toContainText('入力内容は残っています', { timeout: 20000 });
    await expect(dialog.getByLabel('お名前', { exact: true })).toHaveValue('確認 太郎');
    await expect(dialog.getByLabel('メールアドレス', { exact: true })).toHaveValue('test@example.com');
    await expect(dialog.getByLabel('相談したい仕事')).toHaveValue('日本語の送信・再送を確認します。');
    await expect(dialog.getByRole('checkbox')).toBeChecked();
    const send = dialog.getByRole('button', { name: '無料相談を申し込む', exact: true });
    await expect(send).toBeEnabled();
    await send.click();
    await expect(dialog.getByRole('status')).toContainText('お問い合わせを受け付けました');
    expect(count).toBe(2);
  });
}
test('必須入力・不正メール・同意なしは送信しない', async ({ page }) => {
  let count = 0;
  await page.route(endpoint, route => { count++; return route.abort(); });
  const dialog = await openForm(page);
  const send = dialog.getByRole('button', { name: '無料相談を申し込む', exact: true });
  await dialog.getByLabel('お名前', { exact: true }).fill('');
  await send.click();
  await expect(dialog.getByLabel('お名前', { exact: true })).toBeFocused();
  await dialog.getByLabel('お名前', { exact: true }).fill('確認 太郎');
  await dialog.getByLabel('メールアドレス', { exact: true }).fill('invalid');
  await send.click();
  await expect(dialog.getByLabel('メールアドレス', { exact: true })).toBeFocused();
  await dialog.getByLabel('メールアドレス', { exact: true }).fill('test@example.com');
  await dialog.getByLabel('相談したい仕事').fill('');
  await send.click();
  await expect(dialog.getByLabel('相談したい仕事')).toBeFocused();
  await dialog.getByLabel('相談したい仕事').fill('確認');
  await dialog.getByRole('checkbox').uncheck();
  await send.click();
  await expect(dialog.getByRole('checkbox')).toBeFocused();
  expect(count).toBe(0);
});
test('honeypotは送信しない', async ({ page }) => {
  let count = 0;
  await page.route(endpoint, route => { count++; return route.abort(); });
  const dialog = await openForm(page);
  await dialog.locator('input[name="_gotcha"]').evaluate((input: HTMLInputElement) => { input.value = 'bot'; });
  await dialog.getByRole('button', { name: '無料相談を申し込む', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '無料相談を申し込む', exact: true })).toBeEnabled();
  expect(count).toBe(0);
});
