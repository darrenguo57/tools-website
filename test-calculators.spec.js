const { test, expect } = require('./playwright-helper');

// Helper to navigate and wait for JS initialization
async function gotoAndInit(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500); // Wait for IIFE calculator script to initialize
}

test.describe('Standard Calculator', () => {
  test('TC-CALC-001: 5 + 3 = 8', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/standard.html');

    await page.locator('.calc-btn[data-action="number"][data-value="5"]').click();
    await page.locator('.calc-btn[data-action="operator"][data-value="+"]').click();
    await page.locator('.calc-btn[data-action="number"][data-value="3"]').click();
    await page.locator('.calc-btn[data-action="equals"]').click();

    await expect(page.locator('#resultEl')).toHaveText('8');
  });

  test('TC-CALC-002: 10 - 4 = 6', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/standard.html');

    await page.locator('.calc-btn[data-action="number"][data-value="1"]').click();
    await page.locator('.calc-btn[data-action="number"][data-value="0"]').click();
    await page.locator('.calc-btn[data-action="operator"][data-value="-"]').click();
    await page.locator('.calc-btn[data-action="number"][data-value="4"]').click();
    await page.locator('.calc-btn[data-action="equals"]').click();

    await expect(page.locator('#resultEl')).toHaveText('6');
  });

  test('TC-CALC-003: 6 * 7 = 42', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/standard.html');

    await page.locator('.calc-btn[data-action="number"][data-value="6"]').click();
    await page.locator('.calc-btn[data-action="operator"][data-value="*"]').click();
    await page.locator('.calc-btn[data-action="number"][data-value="7"]').click();
    await page.locator('.calc-btn[data-action="equals"]').click();

    await expect(page.locator('#resultEl')).toHaveText('42');
  });

  test('TC-CALC-004: 20 / 4 = 5', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/standard.html');

    await page.locator('.calc-btn[data-action="number"][data-value="2"]').click();
    await page.locator('.calc-btn[data-action="number"][data-value="0"]').click();
    await page.locator('.calc-btn[data-action="operator"][data-value="/"]').click();
    await page.locator('.calc-btn[data-action="number"][data-value="4"]').click();
    await page.locator('.calc-btn[data-action="equals"]').click();

    await expect(page.locator('#resultEl')).toHaveText('5');
  });

  test('TC-CALC-005: Clear resets display', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/standard.html');

    await page.locator('.calc-btn[data-action="number"][data-value="5"]').click();
    await page.locator('.calc-btn[data-action="number"][data-value="5"]').click();
    await page.locator('.calc-btn[data-action="clear"]').click();

    await expect(page.locator('#resultEl')).toHaveText('0');
  });
});

test.describe('Scientific Calculator', () => {
  test('TC-CALC-006: sin(30) in DEG mode', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/scientific.html');

    await page.locator('.sci-calc-btn[data-action="number"][data-value="3"]').click();
    await page.locator('.sci-calc-btn[data-action="number"][data-value="0"]').click();
    await page.locator('.sci-calc-btn[data-action="func"][data-value="sin"]').click();

    const result = await page.locator('#resultEl').textContent();
    expect(parseFloat(result)).toBeCloseTo(0.5, 5);
  });

  test('TC-CALC-007: 2^3 = 8', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/scientific.html');

    await page.locator('.sci-calc-btn[data-action="number"][data-value="2"]').click();
    // Use data-value selector for x^y button (text is x<sup>y</sup>)
    await page.locator('.sci-calc-btn[data-action="operator"][data-value="^"]').click();
    await page.locator('.sci-calc-btn[data-action="number"][data-value="3"]').click();
    await page.locator('.sci-calc-btn[data-action="equals"]').click();

    const result = await page.locator('#resultEl').textContent();
    expect(parseFloat(result)).toBeCloseTo(8, 5);
  });

  test('TC-CALC-008: e constant', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/scientific.html');

    // Use data-value selector for e button
    await page.locator('.sci-calc-btn[data-action="const"][data-value="e"]').click();

    const result = await page.locator('#resultEl').textContent();
    expect(parseFloat(result)).toBeCloseTo(Math.E, 5);
  });
});

test.describe('Loan Calculator', () => {
  test('TC-CALC-009: Loan 100000 5% 30years', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/loan.html');

    // The loan calculator auto-calculates on load with default values (100000, 5%, 30 years)
    await page.waitForSelector('#resultsSection.visible', { timeout: 5000 });

    const monthlyPayment = await page.locator('#monthlyPayment').textContent();
    expect(monthlyPayment).toContain('536.82');
  });

  test('TC-CALC-010: Loan 100000 0% 12 months', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/loan.html');

    await page.locator('#loanAmount').fill('100000');
    await page.locator('#annualRate').fill('0');
    await page.locator('#loanTerm').fill('12');
    await page.locator('#termUnit').selectOption('months');
    await page.locator('#btnCalculate').click();

    await page.waitForSelector('#resultsSection.visible', { timeout: 5000 });

    const monthlyPayment = await page.locator('#monthlyPayment').textContent();
    // 100000 / 12 = 8333.33...
    expect(monthlyPayment).toContain('8,333');
  });
});
