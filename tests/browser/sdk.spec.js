const { test, expect } = require('@playwright/test');
const { sampleDocument, unlock, USER } = require('../helpers/garden-server');

// Exercise the actual pinned SDK and GardenStore together. Only HTTP/WebSocket
// transport is replaced; credentials here are synthetic and never leave the test.
async function configureSDK(context) {
  const remote = { garden: { document: sampleDocument(), revision: 1, schema_version: 1 }, calls: [] };
  const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url');
  const token = `${encode({ alg: 'HS256', typ: 'JWT' })}.${encode({ sub: USER.id, role: 'authenticated', exp: Math.floor(Date.now() / 1000) + 3600 })}.dGVzdA`;
  await context.route('**/config.js', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.STAR_GARDEN_CONFIG={url:"https://sdk-test.supabase.co",publishableKey:"sb_publishable_test"};'
  }));
  await context.routeWebSocket('wss://sdk-test.supabase.co/**', () => {});
  await context.route('https://sdk-test.supabase.co/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    remote.calls.push({ path: url.pathname, query: url.search, authorization: request.headers().authorization });
    let data;
    if (url.pathname === '/auth/v1/token') {
      if (url.searchParams.get('grant_type') === 'refresh_token') return route.abort('internetdisconnected');
      data = { access_token: token, refresh_token: 'synthetic-refresh-token', expires_in: 3600,
        token_type: 'bearer', user: { ...USER, aud: 'authenticated', role: 'authenticated' } };
    } else if (url.pathname === '/auth/v1/logout') {
      return route.fulfill({ status: 204 });
    } else if (url.pathname === '/rest/v1/gardens') data = [remote.garden];
    else if (url.pathname === '/rest/v1/rpc/commit_garden') {
      const payload = request.postDataJSON();
      expect(payload.p_expected_revision).toBe(remote.garden.revision);
      remote.garden = { ...remote.garden, document: payload.p_document, revision: remote.garden.revision + 1 };
      data = { status: 'saved', garden: remote.garden };
    } else throw new Error(`Unexpected SDK request: ${url.pathname}`);
    await route.fulfill({ json: data, headers: { 'access-control-allow-origin': '*' } });
  });
  return remote;
}

async function signIn(page) {
  await page.goto('/');
  await unlock(page);
  await page.locator('#accountPasswordInput').fill('synthetic-password');
  await page.locator('#signInButton').click();
  await expect(page.locator('#gardenTools')).toBeVisible();
}

test('real SDK signs in, loads and commits the garden, then signs out only this device', async ({ context, page }) => {
  const remote = await configureSDK(context);
  await signIn(page);
  await page.locator('#editProfileButton').click();
  await page.locator('#childNameInput').fill('SDK garden');
  await page.locator('#profileForm button[type="submit"]').click();
  await expect.poll(() => remote.garden.document.child.name).toBe('SDK garden');
  expect(remote.calls.find(call => call.path.includes('commit_garden')).authorization).toMatch(/^Bearer /);
  await page.locator('#signOutButton').click();
  await expect.poll(() => remote.calls.some(call => call.path === '/auth/v1/logout' && call.query === '?scope=local')).toBe(true);
  await page.reload();
  await expect(page.locator('#kidGardenContent')).toBeHidden();
  await expect(page.locator('#kidAccountMessage')).toBeVisible();
  await unlock(page);
  await page.locator('#accountPasswordInput').fill('synthetic-password');
  await page.locator('#signInButton').click();
  await expect(page.locator('#gardenTools')).toBeVisible();
});

test('real SDK token expiry cannot block cached viewing or restore an offline signed-out account', async ({ context, page }) => {
  await configureSDK(context);
  await signIn(page);
  await page.evaluate(() => {
    const key = 'sb-sdk-test-auth-token';
    const session = JSON.parse(localStorage.getItem(key));
    session.expires_at = 1;
    localStorage.setItem(key, JSON.stringify(session));
  });
  await context.addInitScript(() => Object.defineProperty(navigator, 'onLine', { get: () => false }));
  await page.reload();
  await expect(page.locator('#kidGardenContent')).toBeVisible();
  await expect(page.locator('#kidStars')).toHaveText('10');
  await expect(page.locator('[data-action="kid-redeem"]')).toBeDisabled();
  await unlock(page);
  await page.locator('#signOutButton').click();
  await expect(page.locator('#gardenTools')).toBeHidden();
  await page.reload();
  await expect(page.locator('#kidGardenContent')).toBeHidden();
});
