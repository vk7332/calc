import { test, expect } from '@playwright/test';

test('full client audit flow with export and save', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Strategic Tax Audit Portal')).toBeVisible();

    await page.getByLabel('Basic Salary (₹)').fill('750000');
    await page.getByLabel('HRA').fill('120000');
    await page.getByLabel('Special Allowance').fill('90000');
    await page.getByLabel('Total Deductions (₹)').fill('150000');

    await page.getByLabel('Client Name').fill('E2E Tester');

    await page.locator('button', { hasText: 'Perform Audit Analysis' }).click();

    const summaryCard = page.getByText(/Old Regime Tax/i);
    await expect(summaryCard).toBeVisible();

    await page.locator('button', { hasText: 'Save to Client History' }).click();

    const popup = page.locator('text=Audit saved to cloud database');
    await expect(popup).toBeVisible({ timeout: 5000 });

    await page.getByRole('button', { name: /Client Database/i }).click();

    await expect(page.getByText('E2E Tester')).toBeVisible();

    await page.getByRole('button', { name: /Export/i }).first().click();

    const downloads = await page.context().downloads();
    expect(downloads.length).toBeGreaterThan(0);
});
