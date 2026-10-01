import { defineConfig } from '@playwright/test';
import base from './playwright.config';
export default defineConfig({
  ...base,
  testDir: './e2e-contact',
  outputDir: './test-results/contact',
  reporter: [['html', { open: 'never', outputFolder: 'playwright-contact-report' }], ['list']],
  use: { ...base.use, baseURL: 'http://127.0.0.1:4322' },
  webServer: {
    command: 'node scripts/serve-contact-e2e.mjs',
    url: 'http://127.0.0.1:4322',
    reuseExistingServer: false,
    timeout: 300000,
  },
});
