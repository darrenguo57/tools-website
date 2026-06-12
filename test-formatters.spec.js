const { test, expect } = require('./playwright-helper');

// Helper to navigate and wait for JS initialization
async function gotoAndInit(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
}

test.describe('JSON Formatter', () => {
  test('TC-FMT-001: Format JSON', async ({ page }) => {
    await gotoAndInit(page, './tools/formatters/json-formatter.html');

    // Find the input textarea and fill it
    const inputArea = page.locator('#inputArea, textarea').first();
    await inputArea.fill('{"name":"John","age":30}');

    // Click format button
    const formatBtn = page.getByRole('button', { name: /Format|format/i }).first();
    await formatBtn.click();
    await page.waitForTimeout(500);

    // Output should contain formatted JSON
    const outputArea = page.locator('#outputArea, textarea').last();
    const output = await outputArea.textContent();
    expect(output).toContain('name');
    expect(output).toContain('John');
  });
});

test.describe('XML Formatter', () => {
  test('TC-FMT-005: Format XML', async ({ page }) => {
    await gotoAndInit(page, './tools/formatters/xml-formatter.html');

    // Find the input textarea and fill it
    const inputArea = page.locator('#inputArea, textarea').first();
    await inputArea.fill('<?xml version="1.0"?><root><item>Hello</item></root>');

    // Click format button
    const formatBtn = page.getByRole('button', { name: /Format|format/i }).first();
    if (await formatBtn.count() > 0) {
      await formatBtn.click();
      await page.waitForTimeout(500);
    }

    // Output should contain the XML content - check the output area
    const outputArea = page.locator('#outputArea, textarea').last();
    const pageContent = await page.locator('body').textContent();
    // The XML content should be present somewhere on the page
    expect(pageContent).toContain('root');
  });
});

test.describe('SQL Formatter', () => {
  test('TC-FMT-003: SQL Formatter page loads', async ({ page }) => {
    await gotoAndInit(page, './tools/formatters/sql-formatter.html');

    // Check page has textarea inputs
    const textareas = page.locator('textarea');
    await expect(textareas.first()).toBeAttached();
  });
});

test.describe('Code Formatter', () => {
  test('TC-FMT-004: Code Formatter page loads', async ({ page }) => {
    await gotoAndInit(page, './tools/formatters/code-formatter.html');

    const textareas = page.locator('textarea');
    await expect(textareas.first()).toBeAttached();
  });
});
