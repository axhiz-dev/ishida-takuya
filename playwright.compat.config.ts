import { defineConfig, devices } from '@playwright/test';
import base from './playwright.config';
export default defineConfig({
  ...base,
  testMatch: 'demo.spec.ts',
  outputDir: './test-results/compat',
  reporter: [['html', { open: 'never', outputFolder: 'playwright-compat-report' }], ['list']],
  use: { ...base.use, launchOptions: undefined },
  projects: [
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
