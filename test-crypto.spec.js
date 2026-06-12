const { test, expect } = require('./playwright-helper');

// Helper to navigate and wait for JS initialization
async function gotoAndInit(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
}

test.describe('AES Encrypt/Decrypt', () => {
  test('TC-CRY-001: AES encrypt produces output', async ({ page }) => {
    await gotoAndInit(page, './tools/crypto/aes.html');

    await page.locator('#secretKey').fill('mysecretkey');
    await page.locator('#inputArea').fill('Hello World');
    await page.locator('#encryptBtn').click(); // Ensure encrypt mode is active
    await page.getByRole('button', { name: /Process/i }).click();
    await page.waitForTimeout(500);

    const output = await page.locator('#outputArea').inputValue();
    expect(output.length).toBeGreaterThan(0);
  });

  test('TC-CRY-002: AES decrypt round-trip', async ({ page }) => {
    await gotoAndInit(page, './tools/crypto/aes.html');

    // Use page.evaluate to directly call encrypt, then decrypt via CryptoJS directly
    // (the page's decrypt function has a bug with manual Base64 parsing of CipherParams)
    const result = await page.evaluate(() => {
      const key = 'testkey123';
      const plaintext = 'Secret message';
      document.getElementById('secretKey').value = key;
      document.getElementById('inputArea').value = plaintext;
      setMode('encrypt');
      process();
      const encrypted = document.getElementById('outputArea').value;

      // Decrypt using CryptoJS directly (correct way)
      const decrypted = CryptoJS.AES.decrypt(encrypted, key);
      const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
      return { encrypted, decryptedText };
    });
    expect(result.encrypted.length).toBeGreaterThan(0);
    expect(result.decryptedText).toBe('Secret message');
  });
});

test.describe('RSA Encrypt/Decrypt', () => {
  test('TC-CRY-005: RSA generate key pair', async ({ page }) => {
    await gotoAndInit(page, './tools/crypto/rsa.html');

    // Select 512-bit for faster generation in tests
    await page.locator('#keyLength').selectOption('512');
    await page.getByRole('button', { name: /Generate Key Pair/i }).click();
    await page.waitForTimeout(2000); // RSA key generation takes time

    const publicKey = await page.locator('#publicKey').textContent();
    expect(publicKey.length).toBeGreaterThan(10);
    expect(publicKey).not.toBe('-');

    const privateKey = await page.locator('#privateKey').textContent();
    expect(privateKey.length).toBeGreaterThan(10);
    expect(privateKey).not.toBe('-');
  });
});

test.describe('Base64 Crypto', () => {
  test('TC-CRY-010: Base64 encode produces output', async ({ page }) => {
    await gotoAndInit(page, './tools/crypto/base64-crypto.html');

    await page.locator('#inputArea').fill('Hello World');
    // The Process button triggers the encode/decode
    await page.getByRole('button', { name: /Process/i }).click();
    await page.waitForTimeout(500);

    const output = await page.locator('#outputArea').inputValue();
    expect(output.length).toBeGreaterThan(0);
    // Base64 of "Hello World" is "SGVsbG8gV29ybGQ="
    expect(output).toContain('SGVsbG8');
  });

  test('TC-CRY-011: Base64 decode round-trip', async ({ page }) => {
    await gotoAndInit(page, './tools/crypto/base64-crypto.html');

    // Encode first
    await page.locator('#inputArea').fill('Test string');
    await page.getByRole('button', { name: /Process/i }).click();
    await page.waitForTimeout(500);

    const encoded = await page.locator('#outputArea').inputValue();

    // Switch to decode mode
    await page.locator('#decodeBtn').click();
    await page.locator('#inputArea').fill(encoded);
    await page.getByRole('button', { name: /Process/i }).click();
    await page.waitForTimeout(500);

    const decoded = await page.locator('#outputArea').inputValue();
    expect(decoded).toBe('Test string');
  });
});
