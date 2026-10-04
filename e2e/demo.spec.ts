import { test, expect } from '@playwright/test';
import { assessedSales, total, products } from '../src/components/business/tour/skillSamples';
import { contactConfig } from '../src/components/business/tour/config';
import { skillScenarios } from '../src/components/business/tour/skillScenarios';
test('見本：送料・税・返品と重複の判断を反映し、合計と商品別内訳が一致する', () => {
  expect(total).toBe(11000);
  expect(products.reduce((sum, p) => sum + p.amount, 0)).toBe(total);
  expect(assessedSales.filter(r => r.duplicate)).toHaveLength(2);
  expect(assessedSales.filter(r => r.unknown)).toHaveLength(1);
  expect(assessedSales.find(r => r.id === 'S-102')?.net).toBe(-1000);
  expect(assessedSales.find(r => r.id === 'E-102')?.net).toBe(3000);
});
for (const [id, label] of [['aggregate', '売上日報'], ['invoice', '経費の確認'], ['inquiry', '問い合わせ対応']] as const) {
  test(`${label}：会話、確認、スキル保存、翌朝、料金・相談を通れる`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/business/');
    await page.getByRole('button', { name: label, exact: true }).click();
    await page.getByRole('button', { name: 'AIに相談する流れを見る', exact: true }).click();
    const demo = page.getByTestId(`skill-demo-${id}`);
    await expect(demo.getByRole('button', { name: '戻る', exact: true })).toBeDisabled();
    for (let i = 0; i < 5; i++) {
      await expect(demo.getByRole('status')).toHaveText(`${i + 1} / 7`);
      await demo.getByRole('button', { name: skillScenarios[id].scenes[i]!.next, exact: true }).click();
    }
    const confirm = demo.getByRole('button', { name: '確認して手順をまとめる', exact: true });
    await expect(confirm).toBeDisabled();
    for (const box of await demo.getByRole('checkbox').all()) await box.check();
    await confirm.click();
    await expect(demo.getByRole('status')).toHaveText('7 / 7');
    await demo.getByRole('button', { name: '戻る', exact: true }).click();
    for (const box of await demo.getByRole('checkbox').all()) await expect(box).toBeChecked();
    await confirm.click();
    await demo.getByRole('button', { name: 'この手順を保存する', exact: true }).click();
    await demo.getByLabel('平日の実行時刻（体験用）').selectOption('09:30');
    await demo.getByRole('button', { name: '翌朝を体験する', exact: true }).click();
    await expect(demo.getByRole('heading', { name: '翌朝 09:30 のイメージ' })).toBeVisible();
    await demo.getByRole('button', { name: '伴走支援と費用を見る', exact: true }).click();
    await expect(page.getByRole('heading', { name: 'AI活用・自動化の伴走支援', exact: true })).toBeVisible();
    await expect(page.getByText('買い切り', { exact: true })).toHaveCount(0);
    await page.getByRole('button', { name: '診断について相談する', exact: true }).click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('input[name="業務"]')).toHaveValue(`${id === 'aggregate' ? '売上日報' : id === 'invoice' ? '経費確認' : '問い合わせ対応'}のスキルづくり`);
    if (/^[a-zA-Z0-9]+$/.test(contactConfig.formId)) {
      await expect(dialog.getByRole('button', { name: '送信する', exact: true })).toBeEnabled();
    } else {
      await expect(dialog.getByRole('button', { name: '送信する', exact: true })).toBeDisabled();
    }
  });
}
test('モバイル：全場面で横にはみ出さず、戻る・履歴・リセットが動く', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/business/');
  await page.getByRole('button', { name: '2 体験する', exact: true }).click();
  const demo = page.getByTestId('skill-demo-aggregate');
  for (let i = 0; i < 6; i++) {
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    if (i < 5) await demo.getByRole('button', { name: skillScenarios.aggregate.scenes[i]!.next, exact: true }).click();
  }
  await demo.getByText('ここまでの会話を読む', { exact: true }).click();
  await expect(demo.getByText('毎朝、店舗・通販・代理店のExcelをまとめて、店長向けの売上日報を作っています。', { exact: true })).toBeVisible();
  await demo.getByRole('button', { name: '最初から見る', exact: true }).click();
  await expect(demo.getByRole('status')).toHaveText('1 / 7');
});

for (const width of [320, 390]) {
  test(`${width}px：最終場面・翌朝・料金・相談まで操作できる`, async ({ page }) => {
    await page.setViewportSize({ width, height: 640 });
    await page.goto('/business/');
    await page.getByRole('button', { name: '2 体験する', exact: true }).click();
    const demo = page.getByTestId('skill-demo-aggregate');
    const fits = async () => expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    for (let i = 0; i < 5; i++) await demo.getByRole('button', { name: skillScenarios.aggregate.scenes[i]!.next, exact: true }).click();
    await fits();
    for (const box of await demo.getByRole('checkbox').all()) await box.check();
    await demo.getByRole('button', { name: '確認して手順をまとめる', exact: true }).click();
    await fits();
    await demo.getByRole('button', { name: 'この手順を保存する', exact: true }).click();
    await fits();
    await demo.getByRole('button', { name: '翌朝を体験する', exact: true }).click();
    await expect(demo.getByRole('heading', { name: '翌朝 08:00 のイメージ' })).toBeVisible();
    await fits();
    await demo.getByRole('button', { name: '伴走支援と費用を見る', exact: true }).click();
    await fits();
    await page.getByRole('button', { name: '体験に戻る', exact: true }).click();
    await expect(demo.getByRole('heading', { name: '翌朝 08:00 のイメージ' })).toBeVisible();
    await demo.getByRole('button', { name: '伴走支援と費用を見る', exact: true }).click();
    await page.getByRole('button', { name: '導入の流れ・相談へ', exact: true }).click();
    await page.getByRole('button', { name: 'まずは質問する', exact: true }).click();
    await expect(page.getByRole('dialog').locator('input[name="種別"]')).toHaveValue('質問');
    await fits();
    await page.keyboard.press('Escape');
    await page.reload();
    await page.getByRole('button', { name: '2 体験する', exact: true }).click();
    await expect(demo.getByRole('status')).toHaveText('1 / 7');
  });
}
