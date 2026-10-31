import { expect, test } from '@playwright/test';

test('picks a shape, enters measurements and downloads a true-scale PDF', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Truncated cone/ }).click();
  await expect(
    page.getByRole('heading', { level: 1, name: 'Truncated cone' }),
  ).toBeVisible();

  await page.getByLabel(/^Height/).fill('22');
  await expect(page.getByText(/^Seam length 22\.0\s+cm/)).toBeVisible();

  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: /Download PDF/ }).click();
  expect((await download).suggestedFilename()).toBe(
    'truncated-cone-pattern-a4.pdf',
  );
});

test('keeps the last pattern while a measurement is invalid', async ({
  page,
}) => {
  await page.goto('/cone');
  await page.getByLabel(/^Height/).fill('0');
  await expect(page.getByText('Enter a length greater than 0.')).toBeVisible();
  await expect(
    page.getByText('Showing the last pattern that worked.', { exact: false }),
  ).toBeVisible();
  await expect(
    page.getByRole('button', { name: /Download PDF/ }),
  ).toBeDisabled();
});
