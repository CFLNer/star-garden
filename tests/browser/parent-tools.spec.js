const { test, expect } = require('@playwright/test');
const { GardenServer, sampleDocument, unlock, openGarden } = require('../helpers/garden-server');

let server;
test.beforeEach(async ({ context }) => { server = new GardenServer(); await server.connect(context); });

test('PIN gate excludes hidden controls and guards attempted parent actions', async ({ page }) => {
  await openGarden(page);
  await page.locator('.tab-button[data-view="parent"]').click();
  await expect(page.locator('#parentTools')).toBeHidden();
  await expect(page.locator('#pinGate')).toBeVisible();
  await page.locator('#pinForm button').click();
  await expect(page.locator('#pinError')).not.toBeEmpty();
  await page.locator('#pinInput').fill('0000');
  await page.locator('#pinForm button').click();
  await expect(page.locator('#pinError')).not.toBeEmpty();
  await page.evaluate(() => {
    document.querySelector('#childNameInput').value = 'Hidden save';
    document.querySelector('#profileForm').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    document.querySelector('#addQuickActionButton').click();
    document.querySelector('.action-button')?.click();
  });
  expect(server.commits).toBe(0);
  await page.locator('#pinInput').focus();
  await page.keyboard.press('Tab');
  await expect(page.locator('#pinForm button')).toBeFocused();
  await page.keyboard.press('Tab');
  expect(await page.evaluate(() => Boolean(document.activeElement.closest('#parentTools')))).toBe(false);
  await page.locator('#pinInput').fill('1234');
  await page.locator('#pinForm button').click();
  await expect(page.locator('#parentTools')).toBeVisible();
  await expect(page.locator('#pinError')).toBeEmpty();
});

test('leaving, explicit Lock, and reload clear unlock, drafts and expansion', async ({ page }) => {
  await openGarden(page);
  await unlock(page);
  await page.locator('#addQuickActionButton').click();
  await page.locator('#quickActionLabelInput').fill('A draft');
  await page.locator('#lockParentButton').click();
  await expect(page.locator('#parentTools')).toBeHidden();
  await unlock(page);
  await expect(page.locator('#quickActionsBody')).toBeHidden();
  await expect(page.locator('#quickActionForm')).toBeHidden();
  await page.locator('[data-section-toggle="history"]').click();
  await page.locator('.tab-button[data-view="kid"]').click();
  await unlock(page);
  await expect(page.locator('#historyBody')).toBeHidden();
  await page.reload();
  await page.locator('.tab-button[data-view="parent"]').click();
  await expect(page.locator('#parentTools')).toBeHidden();
});

test('profile stays concise until edited and cancel restores saved values', async ({ page }) => {
  await openGarden(page);
  await unlock(page);
  await expect(page.locator('#profileSummary')).toBeVisible();
  await expect(page.locator('#profileName')).toHaveText('Little Star');
  await expect(page.locator('#profileAvatar')).toHaveText('🦁');
  await expect(page.locator('#profileForm')).toBeHidden();
  await expect(page.getByText('Child name', { exact: true })).toBeHidden();
  await expect(page.getByText('Avatar', { exact: true })).toBeHidden();

  await page.locator('#editProfileButton').click();
  await expect(page.locator('#profileForm')).toBeVisible();
  await expect(page.locator('#editProfileButton')).toBeHidden();
  await expect(page.locator('#childNameInput')).toBeFocused();
  await page.locator('#childNameInput').fill('Unsaved name');
  await page.locator('#cancelProfileEditButton').click();
  await expect(page.locator('#profileSummary')).toBeVisible();
  await expect(page.locator('#profileName')).toHaveText('Little Star');
  await expect(page.locator('#editProfileButton')).toBeFocused();

  await page.locator('#editProfileButton').click();
  await page.locator('.avatar-choice').filter({ hasText: 'Panda' }).click();
  await expect.poll(() => server.garden.document.child.avatar).toBe('🐼');
  await page.locator('#cancelProfileEditButton').click();
  await expect(page.locator('#profileAvatar')).toHaveText('🐼');

  await page.locator('#languageSelect').selectOption('zh-CN');
  await expect(page.locator('#profileTitle')).toHaveText('资料');
  await expect(page.locator('#editProfileButton')).toHaveText('编辑');
  await page.locator('#editProfileButton').click();
  await page.locator('.tab-button[data-view="kid"]').click();
  await unlock(page);
  await expect(page.locator('#profileSummary')).toBeVisible();
  await expect(page.locator('#profileForm')).toBeHidden();
});

test('successful profile save updates the summary and closes the editor', async ({ page }) => {
  await openGarden(page);
  await unlock(page);
  await page.locator('#editProfileButton').click();
  await page.locator('#childNameInput').fill('Nova');
  await page.locator('#profileForm button[type="submit"]').click();
  await expect.poll(() => server.garden.document.child.name).toBe('Nova');
  await expect(page.locator('#profileForm')).toBeHidden();
  await expect(page.locator('#profileName')).toHaveText('Nova');
  await expect(page.locator('#editProfileButton')).toBeFocused();
});

test('independent disclosures and quick action editor survive rendering in both languages', async ({ page }) => {
  await openGarden(page);
  await unlock(page);
  for (const section of ['quickActions', 'customEvent', 'rewards', 'history']) {
    await expect(page.locator(`#${section}Body`)).toBeHidden();
    const toggle = page.locator(`[data-section-toggle="${section}"]`);
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(page.locator(`#${section}Body`)).toBeVisible();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  }
  await expect(page.locator('#quickActionForm')).toBeHidden();
  await page.locator('#languageSelect').selectOption('zh-CN');
  await expect(page.locator('#quickActionsTitle')).toHaveText('快捷操作');
  await expect(page.locator('#historyBody')).toBeVisible();
  await page.locator('#languageSelect').selectOption('en');
  await page.locator('#addQuickActionButton').click();
  await page.locator('#quickActionLabelInput').fill('Read together');
  await page.locator('#quickActionStarsInput').fill('3');
  await page.locator('#quickActionForm button[type="submit"]').click();
  await expect(page.locator('#quickActionForm')).toBeHidden();
  await expect(page.locator('.action-card').filter({ hasText: 'Read together' })).toBeVisible();
  const card = page.locator('.action-card').filter({ hasText: 'Read together' });
  await card.locator('.small-button').click();
  await expect(page.locator('#quickActionLabelInput')).toHaveValue('Read together');
  await page.locator('#cancelQuickActionEditButton').click();
  await expect(page.locator('#quickActionForm')).toBeHidden();
  await card.locator('.small-button').click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#removeQuickActionButton').click();
  await expect(page.locator('#quickActionForm')).toBeHidden();
  await expect(card).toHaveCount(0);
  expect(server.garden.document.activityPresets).toHaveLength(1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('custom events retain shared parent notes and history filters stay inside the disclosure', async ({ page }) => {
  await openGarden(page);
  await unlock(page);
  await page.locator('[data-section-toggle="customEvent"]').click();
  await page.locator('#eventLabelInput').fill('Helped a friend');
  await page.locator('#eventNoteInput').fill('Shared parent context');
  await page.locator('#customEventForm button[type="submit"]').click();
  await expect.poll(() => server.garden.document.events.some(event => event.note === 'Shared parent context')).toBe(true);
  await expect(page.locator('#historyPageSizeSelect')).toBeHidden();
  await page.locator('[data-section-toggle="history"]').click();
  await expect(page.locator('#historyPageSizeSelect')).toBeVisible();
  await expect(page.locator('#historyList')).toContainText('Shared parent context');
  await expect(page.locator('#resetDataButton')).toHaveCount(0);
  await page.locator('.tab-button[data-view="kid"]').click();
  await expect(page.locator('#kidTodayList')).not.toContainText('Shared parent context');
});
