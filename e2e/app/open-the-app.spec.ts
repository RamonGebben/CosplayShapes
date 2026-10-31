import { expect, test } from '@playwright/test';

test('opens the app on the home page', async ({ page }) => {
  const response = await page.goto('/');

  expect(response?.ok()).toBe(true);
  await expect(
    page.getByRole('heading', {
      level: 1,
      name: 'To get started, edit the page.tsx file.',
    }),
  ).toBeVisible();
  await expect(page.getByRole('img', { name: 'Next.js logo' })).toBeVisible();
});
