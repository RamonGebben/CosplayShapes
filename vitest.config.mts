import path from 'node:path';
import { defineConfig } from 'vitest/config';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  resolve: {
    alias: { '~': path.join(import.meta.dirname, 'src') },
  },
  test: {
    passWithNoTests: true,
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'node',
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['e2e/**', 'node_modules/**'],
        },
      },
      {
        extends: true,
        plugins: [
          // Runs tests for the stories defined in the Storybook config.
          storybookTest({
            configDir: path.join(import.meta.dirname, '.storybook'),
          }),
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            // Headless Chromium draws WebGL in software, where every model
            // takes seconds and times stories out; without it they show their
            // no-WebGL fallback.
            provider: playwright({
              launchOptions: { args: ['--disable-webgl', '--disable-3d-apis'] },
            }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
