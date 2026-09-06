const { test, expect } = require('@playwright/test');
const { GardenServer, unlock, openGarden } = require('../helpers/garden-server');

async function photoFile(page) {
  const bytes = await page.evaluate(async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024; canvas.height = 768;
    const context = canvas.getContext('2d');
    context.fillStyle = '#e379b9'; context.fillRect(0, 0, 1024, 768);
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
    return Array.from(new Uint8Array(await blob.arrayBuffer()));
  });
  return { name: 'child.png', mimeType: 'image/png', buffer: Buffer.from(bytes) };
}

test('uploaded avatar resizes, shares across devices and can be removed', async ({ browser, context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  const otherContext = await browser.newContext();
  await server.connect(otherContext);
  const other = await otherContext.newPage();
  await openGarden(page);
  await openGarden(other);
  await unlock(page);
  await page.locator('#avatarFileInput').setInputFiles(await photoFile(page));
  await expect.poll(() => server.garden.document.child.avatarPhotoPath).toBeTruthy();
  await expect(page.locator('#avatarPreview')).toBeVisible();
  await expect(other.locator('#kidAvatar img')).toBeVisible();
  const dimensions = await other.locator('#kidAvatar img').evaluate(image => ({ width: image.naturalWidth, height: image.naturalHeight }));
  expect(dimensions).toEqual({ width: 512, height: 384 });
  await page.locator('#removePhotoButton').click();
  await expect(other.locator('#kidAvatar img')).toHaveCount(0);
  await expect(other.locator('#kidAvatar')).toContainText('🦁');
  await otherContext.close();
});

test('invalid and oversized photos or failed upload preserve the existing avatar', async ({ context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  await openGarden(page);
  await unlock(page);
  await page.locator('#avatarFileInput').setInputFiles({ name: 'bad.txt', mimeType: 'text/plain', buffer: Buffer.from('not an image') });
  expect(server.photos.size).toBe(0);
  await page.locator('#avatarFileInput').setInputFiles({ name: 'large.png', mimeType: 'image/png', buffer: Buffer.alloc(5 * 1024 * 1024 + 1) });
  expect(server.photos.size).toBe(0);
  server.failUpload = true;
  await page.locator('#avatarFileInput').setInputFiles(await photoFile(page));
  await expect(page.locator('#avatarUploadError')).not.toBeEmpty();
  expect(server.garden.document.child.avatarPhotoPath).toBeFalsy();
  expect(server.commits).toBe(0);
  await page.locator('.tab-button[data-view="kid"]').click();
  await expect(page.locator('#kidAvatar')).toContainText('🦁');
});
