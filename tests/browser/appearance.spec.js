const { test, expect } = require('@playwright/test');
const { GardenServer, openGarden, unlock } = require('../helpers/garden-server');

let server;
test.beforeEach(async ({ context }) => {
  server = new GardenServer();
  await server.connect(context);
});

test('appearance defaults to Modern and persists Classic on this device', async ({ page }) => {
  await openGarden(page);

  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'modern');
  await expect(page.locator('#appearanceSelect')).toHaveValue('modern');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#2f6b50');
  expect(await page.locator('#appearanceSelect').evaluate(element => element.getBoundingClientRect().height)).toBeGreaterThanOrEqual(44);
  expect(await page.locator('.animal-card').evaluate(element => parseFloat(getComputedStyle(element).borderRadius))).toBeGreaterThan(20);

  await page.locator('#appearanceSelect').selectOption('classic');
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'classic');
  await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#7ac36a');
  expect(await page.locator('.animal-card').evaluate(element => getComputedStyle(element).borderRadius)).toBe('8px');
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('star-garden-preferences')).appearance)).toBe('classic');

  await page.reload();
  await expect(page.locator('#kidGardenContent')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'classic');
  await expect(page.locator('#appearanceSelect')).toHaveValue('classic');

  await page.locator('.tab-button[data-view="parent"]').click();
  await expect(page.locator('#pinGate')).toBeVisible();
  await unlock(page);
  await expect(page.locator('#parentTools')).toBeVisible();
  await page.locator('#appearanceSelect').selectOption('modern');
  expect(await page.locator('.panel').first().evaluate(element => parseFloat(getComputedStyle(element).borderRadius))).toBeGreaterThan(20);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('appearance fallback, localization, and reduced motion remain accessible', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('star-garden-preferences', JSON.stringify({ appearance: 'neon', language: 'en' }));
  });
  await openGarden(page);

  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'modern');
  await page.locator('#languageSelect').selectOption('zh-CN');
  await expect(page.locator('#appearanceSelect')).toHaveAttribute('aria-label', '视觉样式');
  await expect(page.locator('#appearanceSelect option[value="modern"]')).toHaveText('现代');
  await expect(page.locator('#appearanceSelect option[value="classic"]')).toHaveText('经典');

  await page.evaluate(() => localStorage.setItem('star-garden-preferences', '{invalid json'));
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'modern');

  await page.emulateMedia({ reducedMotion: 'reduce' });
  const transitionSeconds = await page.locator('#progressFill').evaluate(element => parseFloat(getComputedStyle(element).transitionDuration));
  expect(transitionSeconds).toBeLessThanOrEqual(0.001);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});
