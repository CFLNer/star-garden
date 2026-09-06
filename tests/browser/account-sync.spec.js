const { test, expect } = require('@playwright/test');
const { GardenServer, sampleDocument, unlock, openGarden, USER } = require('../helpers/garden-server');

test('sign-in lives behind PIN; sign-out clears this device and preserves another session', async ({ browser, context, page }) => {
  const server = new GardenServer();
  await server.connect(context, { signedIn: false });
  const secondContext = await browser.newContext();
  await server.connect(secondContext);
  const second = await secondContext.newPage();
  await openGarden(second);
  await page.goto('/');
  await expect(page.locator('#kidAccountMessage')).toBeVisible();
  await expect(page.locator('#kidGardenContent')).toBeHidden();
  await unlock(page);
  await page.locator('#accountEmailInput').fill(USER.email);
  await page.locator('#accountPasswordInput').fill('wrong-password');
  await page.locator('#signInButton').click();
  await expect(page.locator('#accountForm')).toBeVisible();
  await page.locator('#accountPasswordInput').fill('family-password');
  await page.locator('#signInButton').click();
  await expect(page.locator('#signOutButton')).toBeVisible();
  await page.locator('#signOutButton').click();
  await expect(page.locator('#parentTools')).toBeHidden();
  expect(await page.evaluate(uid => localStorage.getItem('test-cache-' + uid), USER.id)).toBeNull();
  await expect(second.locator('#kidGardenContent')).toBeVisible();
  await second.reload();
  await expect(second.locator('#kidGardenContent')).toBeVisible();
  await secondContext.close();
});

test('initial import preserves legacy balance and backup; existing cloud garden wins', async ({ context, page }) => {
  const legacy = sampleDocument();
  legacy.child.currentStars = 7;
  legacy.child.name = 'Imported child';
  legacy.events[0].starChange = -18;
  legacy.activityPresets.push({ id: 'zero-action', label: 'A note', defaultStarChange: 0, icon: '⭐', category: 'earning' });
  legacy.settings = { language: 'en', historyPageSize: 50 };
  const server = new GardenServer(null);
  await server.connect(context, { legacy });
  await page.goto('/');
  await unlock(page);
  await expect(page.locator('#setupGarden')).toBeVisible();
  await page.locator('#importGardenButton').click();
  await expect(page.locator('#gardenTools')).toBeVisible();
  expect(server.garden.document.child.currentStars).toBe(7);
  expect(server.garden.document.child.name).toBe('Imported child');
  expect(server.garden.document.activityPresets.find(action => action.id === 'zero-action').defaultStarChange).toBe(0);
  expect(await page.evaluate(() => JSON.parse(localStorage.getItem('star-garden-v1')).child.currentStars)).toBe(7);
  await page.reload();
  await expect(page.locator('#kidStars')).toHaveText('7');
  await unlock(page);
  await expect(page.locator('#setupGarden')).toBeHidden();
});

test('first device can initialize defaults and a later device cannot overwrite them with its local data', async ({ browser, context, page }) => {
  const server = new GardenServer(null);
  await server.connect(context);
  await page.goto('/');
  await unlock(page);
  await page.locator('#freshGardenButton').click();
  await expect(page.locator('#gardenTools')).toBeVisible();
  const otherContext = await browser.newContext();
  const legacy = sampleDocument();
  legacy.child.currentStars = 199;
  await server.connect(otherContext, { legacy });
  const other = await otherContext.newPage();
  await openGarden(other);
  await expect(other.locator('#kidStars')).toHaveText('10');
  await otherContext.close();
});

test('two sessions synchronize profile and quick actions while preserving an older draft', async ({ browser, context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  const otherContext = await browser.newContext();
  await server.connect(otherContext);
  const other = await otherContext.newPage();
  await openGarden(page);
  await openGarden(other);
  await unlock(page);
  await unlock(other);
  await page.locator('#editProfileButton').click();
  await other.locator('#editProfileButton').click();
  await page.locator('#childNameInput').fill('Unsaved name');
  await other.locator('#childNameInput').fill('Cloud name');
  await other.locator('#profileForm button[type="submit"]').click();
  await expect.poll(() => server.garden.document.child.name).toBe('Cloud name');
  await expect(other.locator('#profileForm')).toBeHidden();
  await expect(page.locator('#childNameInput')).toHaveValue('Unsaved name');
  await page.locator('#profileForm button[type="submit"]').click();
  await expect(page.locator('#profileForm')).toBeVisible();
  await expect(page.locator('#childNameInput')).toHaveValue('Unsaved name');
  expect(server.garden.document.child.name).toBe('Cloud name');
  await expect(page.locator('#retrySaveButton')).toBeVisible();
  await page.locator('#retrySaveButton').click();
  await page.locator('#profileForm button[type="submit"]').click();
  await expect.poll(() => server.garden.document.child.name).toBe('Unsaved name');
  await expect(page.locator('#profileSummary')).toBeVisible();
  await other.locator('.tab-button[data-view="kid"]').click();
  await expect(other.locator('#kidName')).toHaveText('Unsaved name');
  await otherContext.close();
});

test('a lost save response keeps the balance unconfirmed; retry uses the same operation once', async ({ context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  await openGarden(page);
  await unlock(page);
  await page.locator('[data-section-toggle="quickActions"]').click();
  server.loseCommitResponse = true;
  await page.locator('.action-button').first().click();
  await expect(page.locator('#retrySaveButton')).toBeVisible();
  expect(server.commits).toBe(1);
  await expect(page.locator('#parentBalance')).toContainText('10');
  await page.locator('#retrySaveButton').click();
  await expect(page.locator('#parentBalance')).toContainText('12');
  expect(server.commits).toBe(1);
  expect(server.commitAttempts[0].operationId).toBe(server.commitAttempts[1].operationId);
});

test('offline viewing disables writes and expired auth clears parent access', async ({ context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  await openGarden(page);
  await unlock(page);
  await page.locator('[data-section-toggle="quickActions"]').click();
  await context.setOffline(true);
  await expect(page.locator('.action-button').first()).toBeDisabled();
  await page.locator('.tab-button[data-view="kid"]').click();
  await expect(page.locator('[data-action="kid-redeem"]').first()).toBeDisabled();
  await expect(page.locator('#kidStars')).toHaveText('10');
  await context.setOffline(false);
  await expect(page.locator('[data-action="kid-redeem"]').first()).toBeEnabled();
  await unlock(page);
  await page.evaluate(() => window.__expireSession());
  await expect(page.locator('#parentTools')).toBeHidden();
  await page.locator('.tab-button[data-view="kid"]').click();
  await expect(page.locator('#kidAccountMessage')).toBeVisible();
  expect(server.commits).toBe(0);
});

test('competing kid redemptions cannot spend the same stars twice', async ({ browser, context, page }) => {
  const document = sampleDocument();
  document.child.currentStars = 5;
  const server = new GardenServer(document);
  await server.connect(context);
  const otherContext = await browser.newContext();
  await server.connect(otherContext);
  const other = await otherContext.newPage();
  await openGarden(page);
  await openGarden(other);
  server.synchronizeNextCommits(2);
  await Promise.all([page, other].map(tab => tab.locator('[data-action="kid-redeem"]').click()));
  await expect.poll(() => server.commits).toBe(1);
  await expect(page.locator('#kidStars')).toHaveText('0');
  await expect(other.locator('#kidStars')).toHaveText('0');
  expect(server.garden.document.events).toHaveLength(2);
  await expect(page.locator('[data-action="kid-redeem"]')).toBeDisabled();
  await expect(other.locator('[data-action="kid-redeem"]')).toBeDisabled();
  await otherContext.close();
});

test('an uncertain accepted operation survives reload and retries without duplication', async ({ context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  await openGarden(page);
  await unlock(page);
  await page.locator('[data-section-toggle="quickActions"]').click();
  server.loseCommitResponse = true;
  await page.locator('.action-button').first().click();
  await expect(page.locator('#retrySaveButton')).toBeVisible();
  const operationId = server.commitAttempts[0].operationId;
  await page.reload();
  await unlock(page);
  await expect(page.locator('#retrySaveButton')).toBeVisible();
  await page.locator('#retrySaveButton').click();
  await expect(page.locator('#retrySaveButton')).toBeHidden();
  expect(server.commits).toBe(1);
  expect(server.commitAttempts.at(-1).operationId).toBe(operationId);
  expect(server.garden.document.child.currentStars).toBe(12);
});

test('a restored profile draft reopens the profile editor', async ({ context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  await openGarden(page);
  await unlock(page);
  await page.locator('#editProfileButton').click();
  await page.locator('#childNameInput').fill('Recovered name');
  server.loseCommitResponse = true;
  await page.locator('#profileForm button[type="submit"]').click();
  await expect(page.locator('#retrySaveButton')).toBeVisible();

  await page.reload();
  await unlock(page);
  await expect(page.locator('#profileForm')).toBeVisible();
  await expect(page.locator('#profileSummary')).toBeHidden();
  await expect(page.locator('#childNameInput')).toHaveValue('Recovered name');
});

test('new actions, rewards and complete parent history reach another device', async ({ browser, context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  const otherContext = await browser.newContext();
  await server.connect(otherContext);
  const other = await otherContext.newPage();
  await openGarden(page);
  await openGarden(other);
  await unlock(page);
  await page.locator('#addQuickActionButton').click();
  await page.locator('#quickActionLabelInput').fill('Practice piano');
  await page.locator('#quickActionForm button[type="submit"]').click();
  await expect(page.locator('#quickActionForm')).toBeHidden();
  await page.locator('[data-section-toggle="rewards"]').click();
  await page.locator('#rewardLabelInput').fill('Family picnic');
  await page.locator('#rewardCostInput').fill('8');
  await page.locator('#rewardForm button[type="submit"]').click();
  await expect(other.locator('#kidRewardList')).toContainText('Family picnic');
  await page.locator('[data-section-toggle="customEvent"]').click();
  await page.locator('#eventLabelInput').fill('Helped with lunch');
  await page.locator('#eventNoteInput').fill('Remember the shared parent note');
  await page.locator('#customEventForm button[type="submit"]').click();
  await expect(other.locator('#kidStars')).toHaveText('11');
  await unlock(other);
  await other.locator('[data-section-toggle="quickActions"]').click();
  await expect(other.locator('#earningActions')).toContainText('Practice piano');
  await other.locator('[data-section-toggle="history"]').click();
  await expect(other.locator('#historyList')).toContainText('Remember the shared parent note');
  await otherContext.close();
});

test('an offline boot restores only the confirmed account cache', async ({ context, page }) => {
  const server = new GardenServer();
  await server.connect(context);
  await openGarden(page);
  await expect.poll(() => page.evaluate(uid => Boolean(localStorage.getItem('test-cache-' + uid)), USER.id)).toBe(true);
  // Simulate offline navigator at boot; the separate PWA test proves physical shell reload offline.
  await context.addInitScript(() => Object.defineProperty(navigator, 'onLine', { configurable: true, get: () => false }));
  await page.reload();
  await expect(page.locator('#kidStars')).toHaveText('10');
  await expect(page.locator('#kidSyncStatus')).toContainText('Offline');
  await expect(page.locator('[data-action="kid-redeem"]')).toBeDisabled();
  await unlock(page);
  await page.locator('#editProfileButton').click();
  await expect(page.locator('#profileForm button[type="submit"]')).toBeDisabled();
  await page.locator('#languageSelect').selectOption('zh-CN');
  await expect(page.locator('#quickActionsTitle')).toHaveText('快捷操作');
  expect(server.commits).toBe(0);
});
