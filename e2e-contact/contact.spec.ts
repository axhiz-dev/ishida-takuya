import { test, expect, type Page } from '@playwright/test';
const endpoint = 'https://formspree.io/f/**';
async function openForm(page: Page) {
  await page.goto('/business/');
  await page.getByRole('button', { name: '直接相談する' }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('会社名（任意）').fill('テスト株式会社');
  await dialog.getByLabel('お名前', { exact: true }).fill('確認 太郎');
  await dialog.getByLabel('メールアドレス', { exact: true }).fill('test@example.com');
  await dialog.getByLabel('相談したいこと').fill('日本語の送信・再送を確認します。');
  await dialog.getByRole('checkbox').check();
  return dialog;
}
// Every Formspree request is intercepted, including unexpected ones. No real email.
test.beforeEach(async ({ page }) => { await page.route(endpoint, route => route.abort()); });
test('成功：送信値が揃い、連打でも1件だけ送信する', async ({ page }) => {
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
  const send = dialog.getByRole('button', { name: '送信する', exact: true });
  // Synchronous duplicate events exercise the ref guard before React rerenders.
  await dialog.locator('form').evaluate(form => {
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
  });
  await expect.poll(() => count).toBe(1);
  await expect(dialog.getByRole('button', { name: '送信中…' })).toBeDisabled();
  for (const value of ['テスト株式会社', '確認 太郎', 'test@example.com', '日本語の送信・再送を確認します。', '売上日報のスキルづくり', '相談']) expect(body).toContain(value);
  expect(body).toContain('name="業務"');
  expect(body).toContain('name="種別"');
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
    await dialog.getByRole('button', { name: '送信する', exact: true }).click();
    await expect(dialog.getByRole('alert')).toContainText('入力内容は残っています', { timeout: 20000 });
    await expect(dialog.getByLabel('会社名（任意）')).toHaveValue('テスト株式会社');
    await expect(dialog.getByLabel('お名前', { exact: true })).toHaveValue('確認 太郎');
    await expect(dialog.getByLabel('メールアドレス', { exact: true })).toHaveValue('test@example.com');
    await expect(dialog.getByLabel('相談したいこと')).toHaveValue('日本語の送信・再送を確認します。');
    await expect(dialog.getByRole('checkbox')).toBeChecked();
    const send = dialog.getByRole('button', { name: '送信する', exact: true });
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
  const send = dialog.getByRole('button', { name: '送信する', exact: true });
  await dialog.getByLabel('お名前', { exact: true }).fill('');
  await send.click();
  await expect(dialog.getByLabel('お名前', { exact: true })).toBeFocused();
  await dialog.getByLabel('お名前', { exact: true }).fill('確認 太郎');
  await dialog.getByLabel('メールアドレス', { exact: true }).fill('invalid');
  await send.click();
  await expect(dialog.getByLabel('メールアドレス', { exact: true })).toBeFocused();
  await dialog.getByLabel('メールアドレス', { exact: true }).fill('test@example.com');
  await dialog.getByLabel('相談したいこと').fill('');
  await send.click();
  await expect(dialog.getByLabel('相談したいこと')).toBeFocused();
  await dialog.getByLabel('相談したいこと').fill('確認');
  await dialog.getByRole('checkbox').uncheck();
  await send.click();
  await expect(dialog.getByRole('checkbox')).toBeFocused();
  expect(count).toBe(0);
});
test('honeypotは送信しない・Escapeで閉じて元のボタンへ戻る', async ({ page }) => {
  let count = 0;
  await page.route(endpoint, route => { count++; return route.abort(); });
  const dialog = await openForm(page);
  await dialog.locator('input[name="_gotcha"]').evaluate((input: HTMLInputElement) => { input.value = 'bot'; });
  await dialog.getByRole('button', { name: '送信する', exact: true }).click();
  await expect(dialog.getByRole('button', { name: '送信する', exact: true })).toBeEnabled();
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(page.getByRole('button', { name: '直接相談する' })).toBeFocused();
  expect(count).toBe(0);
});
