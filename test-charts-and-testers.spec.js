const { test, expect } = require('./playwright-helper');

// Helper to navigate and wait for JS initialization
async function gotoAndInit(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
}

test.describe('Regex Tester', () => {
  test('TC-TEST-001: Default pattern matches', async ({ page }) => {
    await gotoAndInit(page, './tools/testers/regex.html');

    // Default pattern is \w+ with global flag, test string has words
    const matchCount = await page.locator('#regexStats').textContent();
    expect(matchCount).toContain('Matches');
  });

  test('TC-TEST-002: Toggle Global flag', async ({ page }) => {
    await gotoAndInit(page, './tools/testers/regex.html');

    // Global (g) flag is active by default - click to deactivate
    const globalBtn = page.locator('.regex-flag-btn[data-flag="g"]');
    await expect(globalBtn).toHaveClass(/active/);

    await globalBtn.click();
    await page.waitForTimeout(300);

    // After deactivating, should not have active class
    await expect(globalBtn).not.toHaveClass(/active/);
  });

  test('TC-TEST-003: Pattern input updates results', async ({ page }) => {
    await gotoAndInit(page, './tools/testers/regex.html');

    await page.locator('#patternInput').fill('\\d+');
    await page.waitForTimeout(300);

    const matchCount = await page.locator('#regexStats').textContent();
    expect(matchCount).toContain('Matches');
    // Should find numbers in the test string
    const matchList = await page.locator('#matchList').textContent();
    expect(matchList).toBeTruthy();
  });
});

test.describe('Charts - Basic Charts', () => {
  test('TC-CHART-001: Basic Charts page loads', async ({ page }) => {
    await gotoAndInit(page, './tools/charts/chart-basic.html');

    // Check that the page has loaded with a chart canvas or container
    const canvas = page.locator('canvas');
    const chartContainer = page.locator('.chart-container, .chart-wrapper, [id*="chart"]');
    const hasChart = (await canvas.count()) > 0 || (await chartContainer.count()) > 0;
    expect(hasChart).toBe(true);
  });
});
