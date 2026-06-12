const { test, expect } = require('./playwright-helper');

// Helper to navigate and wait for JS initialization
async function gotoAndInit(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
}

test.describe('Image Tools - File Input Exists', () => {
  // All image tools have hidden file inputs (display:none), so we use toBeAttached() instead of toBeVisible()

  test('TC-IMG-001: Image Compress has file input', async ({ page }) => {
    await gotoAndInit(page, './tools/image-tools/compress.html');
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toBeAttached();
    expect(await fileInput.getAttribute('accept')).toBe('image/*');
  });

  test('TC-IMG-002: Image Format Convert has file input', async ({ page }) => {
    await gotoAndInit(page, './tools/image-tools/format-convert.html');
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toBeAttached();
    expect(await fileInput.getAttribute('accept')).toBe('image/*');
  });

  test('TC-IMG-003: Image Resize has file input', async ({ page }) => {
    await gotoAndInit(page, './tools/image-tools/resize.html');
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toBeAttached();
    expect(await fileInput.getAttribute('accept')).toBe('image/*');
  });

  test('TC-IMG-004: Image Filters has file input', async ({ page }) => {
    await gotoAndInit(page, './tools/image-tools/filters.html');
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toBeAttached();
    expect(await fileInput.getAttribute('accept')).toBe('image/*');
  });

  test('TC-IMG-005: Image Crop & Rotate has file input', async ({ page }) => {
    await gotoAndInit(page, './tools/image-tools/crop-rotate.html');
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toBeAttached();
    expect(await fileInput.getAttribute('accept')).toBe('image/*');
  });

  test('TC-IMG-006: Image to Base64 has file input', async ({ page }) => {
    await gotoAndInit(page, './tools/image-tools/base64.html');
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toBeAttached();
    expect(await fileInput.getAttribute('accept')).toBe('image/*');
  });

  test('TC-IMG-007: Color Palette has file input', async ({ page }) => {
    await gotoAndInit(page, './tools/image-tools/color-palette.html');
    const fileInput = page.locator('#fileInput');
    await expect(fileInput).toBeAttached();
    expect(await fileInput.getAttribute('accept')).toBe('image/*');
  });
});

test.describe('SEO - Meta Tags', () => {
  test('TC-SEO-001: Homepage has meta description', async ({ page }) => {
    await gotoAndInit(page, './index.html');
    const metaDesc = page.locator('meta[name="description"]');
    await expect(metaDesc).toHaveAttribute('content', /./);
  });

  test('TC-SEO-002: Tool page has canonical URL', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/standard.html');
    const canonical = page.locator('link[rel="canonical"]');
    await expect(canonical).toHaveAttribute('href', /useeasytool\.com/);
  });

  test('TC-SEO-003: Tool page has Open Graph tags', async ({ page }) => {
    await gotoAndInit(page, './tools/calculators/standard.html');
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toBeAttached();
    const ogType = page.locator('meta[property="og:type"]');
    await expect(ogType).toHaveAttribute('content', 'website');
  });
});
