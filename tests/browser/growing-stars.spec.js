const { test, expect } = require('@playwright/test');
const { GardenServer, sampleDocument, unlock, openGarden } = require('../helpers/garden-server');
let server;
test.beforeEach(async ({ context, page }) => {
  server = new GardenServer();
  await server.connect(context);
  await openGarden(page);
  await unlock(page);
});
async function custom(page, label = 'Dress', target = 2, note = '') {
  if (!(await page.locator('#customEventBody').isVisible())) await page.locator('[data-section-toggle="customEvent"]').click();
  await page.locator('#eventModeInput').selectOption('growing');
  await page.locator('#eventLabelInput').fill(label);
  await page.locator('#eventTargetInput').fill(String(target));
  await page.locator('#eventNoteInput').fill(note);
}
async function submit(page) {
  await page.locator('#customEventForm button[type="submit"]').click();
  await expect(page.locator('#eventLabelInput')).toHaveValue('');
}
const card = page => page.locator('#growingStarsList .growing-card');

test('custom growth merges labels, keeps settings, completes once and starts a fresh round', async ({ page }) => {
  await custom(page, ' Dress ', 2, 'Private');
  await submit(page);
  expect(server.garden.document.child.currentStars).toBe(10);
  await expect(card(page)).toContainText('1 of 2 steps');
  await custom(page, 'Dress', 8, 'Different note');
  await expect(page.locator('#eventGrowingHelp')).toContainText('1 of 2');
  await submit(page);
  expect(server.garden.document.child.currentStars).toBe(11);
  expect(server.garden.document.growingStars).toHaveLength(1);
  expect(server.garden.document.growingStars[0]).toMatchObject({ status: 'completed', targetSteps: 2, note: 'Private' });
  expect(server.garden.document.events[0]).toMatchObject({ growingAction: 'Completed', starChange: 1, progress: 2 });
  await custom(page);
  await submit(page);
  expect(server.garden.document.growingStars).toHaveLength(2);
  await custom(page, 'dress', 1);
  await submit(page);
  expect(server.garden.document.child.currentStars).toBe(12);
  await page.locator('[data-section-toggle="history"]').click();
  await expect(page.locator('#historyList')).toContainText('Grown! Earned 1 star');
});

test('template save starts progress; edits and deletion preserve its active tracker', async ({ page }) => {
  await page.locator('#addQuickActionButton').click();
  await page.locator('#quickActionModeInput').selectOption('growing');
  await page.locator('#quickActionLabelInput').fill('Dress');
  await page.locator('#quickActionForm button[type="submit"]').click();
  await expect(card(page)).toContainText('1 of 2 steps');
  const action = page.locator('.action-card').filter({ hasText: 'Dress' });
  await action.getByRole('button', { name: 'Edit', exact: true }).click();
  await page.locator('#quickActionTargetInput').fill('4');
  await page.locator('#quickActionForm button[type="submit"]').click();
  await expect(card(page)).toContainText('1 of 2 steps');
  await action.locator('.action-button').click();
  await expect(card(page)).toHaveCount(0);
  expect(server.garden.document.child.currentStars).toBe(11);
  await action.locator('.action-button').click();
  await expect(card(page)).toContainText('1 of 4 steps');
  await action.getByRole('button', { name: 'Edit', exact: true }).click();
  page.once('dialog', dialog => dialog.accept());
  await page.locator('#removeQuickActionButton').click();
  await expect(action).toHaveCount(0);
  await expect(card(page)).toContainText('1 of 4 steps');
});

test('undo to zero, merge, cancel and private kid visibility', async ({ page, context }) => {
  await custom(page, 'Dress', 3, 'Secret');
  await submit(page);
  await card(page).getByRole('button', { name: 'Undo step:' }).click();
  await expect(card(page)).toContainText('0 of 3');
  await expect(card(page).getByRole('button', { name: 'Undo step:' })).toBeDisabled();
  await custom(page, 'Dress');
  await submit(page);
  await expect(card(page)).toContainText('1 of 3');
  await page.locator('.tab-button[data-view="kid"]').click();
  await expect(page.locator('#kidGrowingSection')).toContainText('1 of 3');
  await expect(page.locator('#kidGrowingSection')).not.toContainText('Secret');
  await expect(page.locator('#kidGrowingSection button')).toHaveCount(0);
  await page.evaluate(() => document.querySelector('#growingStarsList button').click());
  expect(server.garden.document.growingStars[0].progress).toBe(1);
  await unlock(page);
  await page.locator('[data-section-toggle="growingStars"]').click();
  await context.setOffline(true);
  await expect(card(page).getByRole('button', { name: 'Help it grow:' })).toBeDisabled();
  await context.setOffline(false);
  await expect(card(page).getByRole('button', { name: 'Help it grow:' })).toBeEnabled();
  page.once('dialog', dialog => dialog.accept());
  await card(page).getByRole('button', { name: 'Cancel:' }).click();
  await expect(card(page)).toHaveCount(0);
  expect(server.garden.document.child.currentStars).toBe(10);
  await custom(page, 'Hidden', 3, 'Secret');
  await page.locator('#eventVisibleInput').uncheck();
  await submit(page);
  await page.locator('.tab-button[data-view="kid"]').click();
  await expect(page.locator('#kidGrowingSection')).toBeHidden();
});

test('lost completion response survives reload and retries without a second award', async ({ page }) => {
  await custom(page);
  await submit(page);
  server.loseCommitResponse = true;
  await card(page).getByRole('button', { name: 'Help it grow:' }).click();
  await expect(page.locator('#retrySaveButton')).toBeVisible();
  expect(server.garden.document.child.currentStars).toBe(11);
  await page.reload();
  await unlock(page);
  await page.locator('#retrySaveButton').click();
  await expect(page.locator('#parentBalance')).toContainText('11');
  expect(server.commits).toBe(2);
  expect(server.garden.document.events.filter(e => e.growingAction === 'Completed')).toHaveLength(1);
});

test('target validation, languages and appearances', async ({ page }) => {
  await custom(page);
  for (const value of ['0', '1.5', '9007199254740992']) {
    await page.locator('#eventTargetInput').fill(value);
    await page.locator('#customEventForm button[type="submit"]').click();
    expect(server.commits).toBe(0);
  }
  await page.locator('#eventTargetInput').fill('3');
  await submit(page);
  await page.locator('#languageSelect').selectOption('zh-CN');
  await expect(card(page)).toContainText('已完成 1 / 3 步');
  await expect(card(page).getByRole('button', { name: '帮它成长:' })).toBeVisible();
  await expect(card(page).getByRole('progressbar')).toHaveAttribute('value', '1');
  for (const appearance of ['classic', 'modern']) {
    await page.evaluate(value => { document.querySelector('#appearanceSelect').value = value; document.querySelector('#appearanceSelect').dispatchEvent(new Event('change', { bubbles: true })); }, appearance);
    await expect(card(page)).toBeVisible();
  }
});


test('two devices completing the same tracker award only one star', async ({ browser, page }) => {
  await custom(page);
  await submit(page);
  const otherContext = await browser.newContext();
  await server.connect(otherContext);
  const other = await otherContext.newPage();
  await openGarden(other);
  await unlock(other);
  await other.locator('[data-section-toggle="growingStars"]').click();
  server.synchronizeNextCommits(2);
  await Promise.all([
    card(page).getByRole('button', { name: 'Help it grow:' }).click(),
    card(other).getByRole('button', { name: 'Help it grow:' }).click()
  ]);
  await expect.poll(() => server.commitAttempts.length).toBe(3);
  expect(server.commits).toBe(2);
  expect(server.garden.document.child.currentStars).toBe(11);
  expect(server.garden.document.events.filter(e => e.growingAction === 'Completed')).toHaveLength(1);
  await expect(card(page)).toHaveCount(0);
  await expect(card(other)).toHaveCount(0);
  await otherContext.close();
});

test('template creation matches custom progress and n=1 completes atomically', async ({ page }) => {
  await custom(page, 'Dress', 3, 'Keep me');
  await submit(page);
  await page.locator('#addQuickActionButton').click();
  await page.locator('#quickActionModeInput').selectOption('growing');
  await page.locator('#quickActionLabelInput').fill('Dress');
  await page.locator('#quickActionTargetInput').fill('1');
  await expect(page.locator('#quickActionGrowingHelp')).toContainText('1 of 3');
  await page.locator('#quickActionForm button[type="submit"]').click();
  await expect(card(page)).toContainText('2 of 3');
  expect(server.garden.document.growingStars).toHaveLength(1);
  expect(server.garden.document.growingStars[0].note).toBe('Keep me');
  await page.locator('#addQuickActionButton').click();
  await page.locator('#quickActionModeInput').selectOption('growing');
  await page.locator('#quickActionLabelInput').fill('Instant');
  await page.locator('#quickActionTargetInput').fill('1');
  await page.locator('#quickActionForm button[type="submit"]').click();
  await expect(page.locator('#quickActionForm')).toBeHidden();
  expect(server.garden.document.child.currentStars).toBe(11);
  expect(server.garden.document.growingStars[1]).toMatchObject({ status: 'completed', progress: 1 });
});

test('a stale growing form preserves mode and target until explicit review', async ({ page }) => {
  await custom(page, 'Draft', 5, 'Preserved note');
  server.garden.revision += 1;
  server.garden.document.child.name = 'Remote edit';
  await server.notify();
  await page.locator('#customEventForm button[type="submit"]').click();
  await expect(page.locator('#retrySaveButton')).toBeVisible();
  expect(server.commits).toBe(0);
  await expect(page.locator('#eventModeInput')).toHaveValue('growing');
  await expect(page.locator('#eventTargetInput')).toHaveValue('5');
  await page.locator('#retrySaveButton').click();
  await submit(page);
  expect(server.garden.document.growingStars[0]).toMatchObject({ progress: 1, targetSteps: 5, note: 'Preserved note' });
  expect(server.garden.document.child.name).toBe('Remote edit');
});

test('import and reload retain growing fields and the saved balance', async ({ browser }) => {
  const legacy = sampleDocument();
  legacy.child.currentStars = 7;
  legacy.activityPresets.push({ id: 'grow', label: 'Dress', mode: 'growing', targetSteps: 3, defaultStarChange: 1, category: 'earning', icon: '👕', visibleToKid: true });
  legacy.growingStars = [{ id: 'tracker', label: 'Dress', targetSteps: 3, progress: 1, status: 'active', note: 'Private', visibleToKid: true, icon: '👕' }];
  const importServer = new GardenServer(null);
  const context = await browser.newContext();
  await importServer.connect(context, { legacy });
  const page = await context.newPage();
  await page.goto('/');
  await unlock(page);
  await page.locator('#importGardenButton').click();
  await expect(page.locator('#gardenTools')).toBeVisible();
  expect(importServer.garden.document.activityPresets.find(p => p.id === 'grow')).toMatchObject({ mode: 'growing', targetSteps: 3 });
  expect(importServer.garden.document.growingStars).toEqual(legacy.growingStars);
  await page.reload();
  await expect(page.locator('#kidGrowingSection')).toContainText('1 of 3');
  await expect(page.locator('#kidStars')).toHaveText('7');
  await context.close();
});
