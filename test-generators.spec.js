const { test, expect } = require('./playwright-helper');

// Helper to navigate and wait for JS initialization
async function gotoAndInit(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
}

test.describe('UUID Generator', () => {
  test('TC-GEN-001: Generate UUID v4', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/uuid.html');

    // Default is v4, click generate
    await page.locator('#btnGenerate').click();
    await page.waitForTimeout(500);

    const resultText = await page.locator('#uuidResults').textContent();
    // UUID v4 format: xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx
    expect(resultText).toMatch(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  });

  test('TC-GEN-002: Generate UUID v1', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/uuid.html');

    // Select v1 from dropdown using label/value
    await page.locator('#uuidVersion').selectOption({ value: 'v1' });
    await page.locator('#btnGenerate').click();
    await page.waitForTimeout(500);

    const resultText = await page.locator('#uuidResults').textContent();
    // UUID v1 format: xxxxxxxx-xxxx-1xxx-xxxx-xxxxxxxxxxxx (version bit is 1)
    expect(resultText).toMatch(/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-1[0-9a-fA-F]{3}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/);
  });

  test('TC-GEN-003: Generate multiple UUIDs', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/uuid.html');

    await page.locator('#uuidCount').fill('5');
    await page.locator('#btnGenerate').click();
    await page.waitForTimeout(500);

    const resultCount = await page.locator('#resultCount').textContent();
    expect(resultCount).toContain('5');
  });
});

test.describe('Password Generator', () => {
  test('TC-GEN-004: Generate default password', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/password.html');

    // Auto-generates on load
    const pwd = await page.locator('#pwdText').textContent();
    expect(pwd.length).toBe(16); // Default length is 16
  });

  test('TC-GEN-008: Password length 16', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/password.html');

    // The range slider default is 16, verify via the display
    const lengthDisplay = await page.locator('#pwdLengthDisplay').textContent();
    expect(lengthDisplay).toBe('16');

    // Set the range slider value using JS to ensure change event fires
    await page.evaluate(() => {
      const slider = document.getElementById('pwdLength');
      slider.value = 16;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(300);

    // Click generate
    await page.locator('#btnGenerate').click();
    await page.waitForTimeout(300);

    const pwd = await page.locator('#pwdText').textContent();
    expect(pwd.length).toBe(16);
  });

  test('TC-GEN-009: Password length 32', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/password.html');

    // Set the range slider value using JS
    await page.evaluate(() => {
      const slider = document.getElementById('pwdLength');
      slider.value = 32;
      slider.dispatchEvent(new Event('input', { bubbles: true }));
    });
    await page.waitForTimeout(300);

    await page.locator('#btnGenerate').click();
    await page.waitForTimeout(300);

    const pwd = await page.locator('#pwdText').textContent();
    expect(pwd.length).toBe(32);
  });

  test('TC-GEN-010: Strength indicator shows', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/password.html');

    const strengthLabel = await page.locator('#strengthLabel').textContent();
    expect(strengthLabel).toBeTruthy();
    expect(['Weak', 'Medium', 'Strong', 'Very Strong']).toContain(strengthLabel);
  });
});

test.describe('QR Code Generator', () => {
  test('TC-GEN-011: QR Code page loads and generates', async ({ page }) => {
    await gotoAndInit(page, './tools/generators/qrcode.html');

    // Fill input and click generate button
    await page.locator('#qrInput').fill('https://example.com');
    await page.locator('#btnGenerate').click();
    await page.waitForTimeout(2000);

    // Check that QR code was generated (canvas in preview or placeholder changed)
    // If QRCode library loaded, a canvas should exist; otherwise check for content change
    const hasCanvas = await page.locator('.qr-preview canvas').count();
    const previewHtml = await page.locator('.qr-preview').innerHTML();

    // Either canvas was created or the preview content changed from placeholder
    const hasQrContent = hasCanvas > 0 || !previewHtml.includes('Enter content above');
    expect(hasQrContent).toBe(true);
  });
});
