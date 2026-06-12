const { test, expect } = require('./playwright-helper');

// Helper to navigate to homepage and wait for cards to render
async function gotoHomepage(page) {
  await page.goto('./index.html', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.tool-card', { timeout: 10000 });
}

test.describe('Global - Search', () => {
  test('TC-GLB-001: Search filters tool cards', async ({ page }) => {
    await gotoHomepage(page);

    const totalCards = await page.locator('.tool-card').count();
    expect(totalCards).toBeGreaterThan(0);

    // Use the navbar search input (first #searchInput, which app.js listens to)
    const searchInput = page.locator('.navbar-search #searchInput');
    await searchInput.fill('Base64');
    await page.waitForTimeout(1000);

    const visibleCards = await page.locator('.tool-card').filter({ hasNot: page.locator('[style*="display: none"]') }).count();
    // At least the Base64 converter card should be visible
    expect(visibleCards).toBeGreaterThanOrEqual(1);
  });

  test('TC-GLB-002: Search shows no results for gibberish', async ({ page }) => {
    await gotoHomepage(page);

    // Use the navbar search input (first #searchInput, which app.js listens to)
    const searchInput = page.locator('.navbar-search #searchInput');
    await searchInput.fill('xyznonexistenttool123');
    await page.waitForTimeout(1000);

    // The noResults element should become visible (display != none)
    const noResultsDisplay = await page.locator('#noResults').getAttribute('style');
    expect(noResultsDisplay).not.toContain('display: none');
    expect(noResultsDisplay).not.toContain('display:none');
  });

  test('TC-GLB-003: Clear search restores all cards', async ({ page }) => {
    await gotoHomepage(page);

    const totalCards = await page.locator('.tool-card').count();

    // Use the navbar search input
    const searchInput = page.locator('.navbar-search #searchInput');
    await searchInput.fill('Base64');
    await page.waitForTimeout(1000);

    await searchInput.clear();
    await page.waitForTimeout(500);

    // All cards should be visible again (no display:none)
    const hiddenCards = await page.locator('.tool-card[style*="display: none"]').count();
    expect(hiddenCards).toBe(0);
  });
});

test.describe('Global - Category Filter', () => {
  test('TC-GLB-004: Click category in sidebar filters cards', async ({ page }) => {
    await gotoHomepage(page);

    // Click "Calculators" category in sidebar
    await page.locator('.sidebar-item[data-category="calculators"]').click();
    await page.waitForTimeout(500);

    // All visible cards should have data-category="calculators"
    const allCards = await page.locator('.tool-card').all();
    for (const card of allCards) {
      const style = await card.getAttribute('style');
      const isHidden = style && (style.includes('display: none') || style.includes('display:none'));
      if (!isHidden) {
        const cat = await card.getAttribute('data-category');
        expect(cat).toBe('calculators');
      }
    }
  });

  test('TC-GLB-005: Click "All Tools" shows all cards', async ({ page }) => {
    await gotoHomepage(page);

    // First filter to a category
    await page.locator('.sidebar-item[data-category="calculators"]').click();
    await page.waitForTimeout(500);

    // Then click "All Tools"
    await page.locator('.sidebar-item[data-category="all"]').click();
    await page.waitForTimeout(500);

    const hiddenCards = await page.locator('.tool-card[style*="display: none"]').count();
    expect(hiddenCards).toBe(0);
  });
});

test.describe('Global - Theme Toggle', () => {
  test('TC-GLB-006: Theme toggle switches to dark mode', async ({ page }) => {
    await gotoHomepage(page);

    const html = page.locator('html');
    // Ensure starting in light mode (no dark class)
    await page.evaluate(() => document.documentElement.classList.remove('dark'));

    await page.locator('#themeToggle').click();
    await page.waitForTimeout(300);

    // Check that dark class is added or data-theme is set
    const hasDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ||
             document.documentElement.getAttribute('data-theme') === 'dark';
    });
    expect(hasDark).toBe(true);
  });

  test('TC-GLB-007: Theme toggle switches back to light', async ({ page }) => {
    await gotoHomepage(page);

    // Set dark mode first
    await page.evaluate(() => document.documentElement.classList.add('dark'));
    await page.locator('#themeToggle').click();
    await page.waitForTimeout(300);

    const hasDark = await page.evaluate(() => {
      return document.documentElement.classList.contains('dark') ||
             document.documentElement.getAttribute('data-theme') === 'dark';
    });
    expect(hasDark).toBe(false);
  });
});

test.describe('Global - Back to Top', () => {
  test('TC-GLB-008: Back to top button scrolls to top', async ({ page }) => {
    await gotoHomepage(page);

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 1000));
    await page.waitForTimeout(300);

    // Verify we scrolled down
    const scrollBefore = await page.evaluate(() => window.scrollY);
    expect(scrollBefore).toBeGreaterThan(500);

    // Trigger back-to-top by calling window.scrollTo directly (simulating button click)
    // The button uses smooth scroll which may not complete in time, so we verify the click handler works
    await page.evaluate(() => {
      const btn = document.getElementById('backToTop');
      if (btn) btn.click();
    });

    // Wait for smooth scroll animation to complete
    await page.waitForTimeout(2000);

    // Check scroll position is at top
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(100);
  });
});
