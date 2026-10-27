import { defineConfig } from '@playwright/test';
import base from './playwright.config';

export default defineConfig({
  ...base,
  testIgnore: [],
  testMatch: ['screenshots.spec.ts'],
  outputDir: './test-results/screenshots',
  reporter: [['html', { open: 'never', outputFolder: 'playwright-screenshots-report' }], ['list']],
});
