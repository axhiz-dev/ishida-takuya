import { expect, test } from '@playwright/test';

for (const item of [
  { id: 'meeting', title: '会議メモをまとめる', result: '打ち合わせの共有メモ' },
  { id: 'planning', title: '今日の仕事を整理する', result: '今日の仕事の順番' },
  { id: 'proposal', title: '提案書の下書きを作る', result: '問い合わせ受付の改善提案（下書き）' },
]) {
  test(`${item.title}: 一覧から会話と成果物を見て戻れる`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('/business/');
    await page.getByRole('button', { name: new RegExp(item.title) }).click();
    const demo = page.getByTestId(`demo-${item.id}`);
    await expect(demo).toBeVisible();
    await expect(page.getByRole('button', { name: '戻る', exact: true })).toBeDisabled();
    await expect(page.getByRole('heading', { name: item.result })).toHaveCount(0);
    await page.getByRole('button', { name: '会話の続きを見る' }).click();
    await expect(page.getByRole('status', { name: '会話の進行' })).toHaveText('2 / 3');
    await page.getByRole('button', { name: '戻る', exact: true }).click();
    await expect(page.getByRole('status', { name: '会話の進行' })).toHaveText('1 / 3');
    await page.getByRole('button', { name: '会話の続きを見る' }).click();
    await page.getByRole('button', { name: '下書きを見る' }).click();
    await expect(demo.getByRole('heading', { name: item.result })).toBeVisible();
    await demo.getByText('次回も使うための指示を見る').click();
    await expect(demo.locator('details')).toHaveAttribute('open', '');
    await page.getByRole('button', { name: '活用例に戻る' }).click();
    await expect(page.getByRole('heading', { name: 'こんな仕事に使えます' })).toBeFocused();
    await expect(page.getByTestId(`demo-${item.id}`)).toHaveCount(0);
    expect(errors).toEqual([]);
  });
}

test('ステージ選択は同じ支援プランへつながる', async ({ page }) => {
  await page.goto('/business/');
  await page.getByRole('link', { name: /02 BUILD/ }).click();
  await expect(page).toHaveURL(/#examples$/);
  await expect(page.locator('#examples')).toContainText('毎回使える指示の作り方');
  await page.getByRole('navigation', { name: 'メインナビゲーション' }).getByRole('link', { name: '料金', exact: true }).click();
  await expect(page.locator('#pricing')).toContainText('55,000円');
  await expect(page.locator('#pricing')).toContainText('1名・1業務／自動更新なし');
  await expect(page.getByRole('button', { name: '無料相談を申し込む' })).toBeDisabled();
  await expect(page.locator('#contact')).toContainText('フォームの受付は準備中');
});

for (const width of [320, 390, 768]) {
  test(`${width}px: 会話・成果物・フォームがはみ出さない`, async ({ page }) => {
    await page.setViewportSize({ width, height: 740 });
    await page.goto('/business/');
    if (width <= 850) {
      await page.getByRole('button', { name: 'メニューを開く' }).click();
      await page.getByRole('navigation', { name: 'メインナビゲーション' }).getByRole('link', { name: '活用例' }).click();
      await expect(page.getByRole('button', { name: 'メニューを開く' })).toHaveAttribute('aria-expanded', 'false');
    }
    await page.getByRole('button', { name: /提案書の下書きを作る/ }).click();
    for (const button of ['会話の続きを見る', '下書きを見る']) await page.getByRole('button', { name: button }).click();
    await page.locator('#pricing summary').click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)).toBeLessThanOrEqual(1);
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.getByLabel('相談したい仕事', { exact: true })).toBeVisible();
  });
}

test('モーション低減でも会話を操作できる', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/business/');
  await page.getByRole('button', { name: /会議メモをまとめる/ }).click();
  await page.getByRole('button', { name: '会話の続きを見る' }).click();
  await expect(page.getByRole('status', { name: '会話の進行' })).toHaveText('2 / 3');
});
