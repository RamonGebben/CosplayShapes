import { expect, test } from '@playwright/test';

test('copies a link that opens the same pattern with its measurements', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/cone');
  await page.getByRole('button', { name: 'Imperial (in)' }).click();
  await page.getByLabel(/^Height/).fill('9');
  await expect(page).toHaveURL(/[?&]height=9(&|$)/);

  await page.getByRole('button', { name: 'More export options' }).click();
  await page.getByRole('menuitem', { name: /Copy link/ }).click();
  await expect(page.getByText(/^Link copied/)).toBeVisible();
  const link = new URL(
    await page.evaluate(() => navigator.clipboard.readText()),
  );

  expect(link.origin).toBe(new URL(page.url()).origin);
  await page.goto(link.href);
  await expect(page.getByLabel(/^Height/)).toHaveValue('9');
  await expect(
    page.getByRole('button', { name: 'Imperial (in)' }),
  ).toHaveAttribute('aria-pressed', 'true');
});

test('opens a link given as a diameter with the diameter as typed', async ({
  page,
}) => {
  await page.goto('/cylinder?v=1&unit=cm&circumference_d=10&height=20');
  await expect(page.getByLabel(/^Diameter/)).toHaveValue('10');
  await expect(page.getByLabel(/^Circumference/)).toHaveValue('31.4');
});

test('remembers the unit on the next shape from the rail', async ({ page }) => {
  await page.goto('/cone');
  await page.getByRole('button', { name: 'Imperial (in)' }).click();
  await page
    .getByRole('navigation', { name: 'Shapes' })
    .getByRole('link', { name: 'Cylinder' })
    .click();
  await expect(page).toHaveURL(/\/cylinder$/);
  await expect(
    page.getByRole('button', { name: 'Imperial (in)' }),
  ).toHaveAttribute('aria-pressed', 'true');
});
