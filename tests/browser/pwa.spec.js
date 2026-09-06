const { test, expect } = require('@playwright/test');

test.use({ serviceWorkers: 'allow' });

test('shell upgrade removes old shell, keeps account photos, and restores a locked offline app', async ({ context, page }) => {
  // Seed the previous version before the app's first registration. Unregistering
  // an installing worker and deleting its cache races with its install event.
  await context.addInitScript(() => {
    window.__registerServiceWorker = navigator.serviceWorker.register.bind(navigator.serviceWorker);
    navigator.serviceWorker.register = async () => ({});
  });
  await page.goto('/');
  await page.evaluate(async () => {
    await caches.open('star-garden-v11');
    await caches.open('star-garden-photos-test-account');
    await window.__registerServiceWorker('./service-worker.js');
    await navigator.serviceWorker.ready;
  });
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes('star-garden-v12'))).toBe(true);
  await expect.poll(() => page.evaluate(async () => (await caches.keys()).includes('star-garden-v11'))).toBe(false);
  expect(await page.evaluate(async () => (await caches.keys()).includes('star-garden-photos-test-account'))).toBe(true);
  const cachedPaths = await page.evaluate(async () => (await (await caches.open('star-garden-v12')).keys()).map(request => new URL(request.url).pathname));
  expect(cachedPaths).toContain('/vendor/supabase.js');
  expect(cachedPaths).toContain('/garden-session.js');
  expect(cachedPaths.every(path => !path.includes('supabase.co') && !path.includes('storage/v1'))).toBe(true);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-appearance', 'modern');
  await expect(page.locator('#appearanceSelect')).toHaveValue('modern');
  await page.locator('.tab-button[data-view="parent"]').click();
  await expect(page.locator('#pinGate')).toBeVisible();
  await expect(page.locator('#parentTools')).toBeHidden();
  await expect(page.locator('#accountForm')).toBeHidden();
});
