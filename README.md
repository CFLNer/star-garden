# Star Garden

Star Garden is a static, installable family habit and reward tracker. Parents sign into one shared family account to synchronize the child profile, stars, actions, rewards, complete history, and avatar across devices. The frontend remains plain JavaScript and can be hosted on GitHub Pages.

The Parent tab always starts locked. Enter `1234` to open the account controls and parent tools; this PIN is a child gate, separate from the account password. Quick Actions, Custom Event, Growing Stars, Rewards, and History open independently. Children can redeem affordable rewards directly in Kid view while signed in and online. English and Simplified Chinese are available.

## Owner setup

1. Create a Supabase project using the free plan initially. Keep its database password in your password manager.
2. In the project's SQL Editor, run [`supabase/migrations/202609050001_shared_gardens.sql`](supabase/migrations/202609050001_shared_gardens.sql) once. It creates the garden and operation tables, atomic initialization/save functions, account ownership policies, the private `avatars` bucket, and Realtime publication membership. Do not make the bucket public or grant clients direct garden writes.
3. In Authentication → Users, use Add user → Create new user to provision `coflier320@gmail.com`. Set a dedicated Star Garden password and enable Auto Confirm User. The password is separate from the Gmail password; Gmail access is unnecessary. Keep email/password sign-in enabled, then disable **Allow new users to sign up** in Authentication settings. Leave anonymous sign-ins disabled. The app has no registration or password recovery screen. [Supabase authentication settings](https://supabase.com/docs/guides/auth/general-configuration)
4. Copy the project's URL and **publishable** API key from the project connection/API settings. For local development, fill `url` and `publishableKey` in [`config.js`](config.js); [`config.example.js`](config.example.js) shows the format. These values are intentionally public. Never put an account password, database password, `sb_secret_` key, or `service_role` key in the frontend or repository.
5. Open the app, enter Parent → `1234` → Unlock, then sign in with the shared email and Star Garden password. On the first device, choose **Import this device's garden** to preserve an existing garden, or **Start with defaults** for the defaults. Use the same account on each family device.

When a cloud garden already exists, it always takes precedence over another device's local data. Import preserves the original `star-garden-v1` local-storage entry as a backup, including its saved balance; the balance is not reconstructed from old events. There is no in-app Reset control. Keep a copy of important family data before manually changing it through the database owner tools.

Password recovery is owner-managed: select the existing Auth user and set a replacement password through an available Dashboard password action, or use the server-only Auth Admin `updateUserById` method with that user's ID. Retain the same user ID so the garden remains attached to the account. Never run an Admin API with a secret key in this frontend. Share the replacement Star Garden password with the family through your usual private channel. [Supabase Auth Admin](https://supabase.com/docs/reference/javascript/auth-admin-updateuserbyid)

Supabase free projects can pause after one week of inactivity. If this happens, open the project in the Supabase Dashboard, resume it using the restore action, wait until it is healthy, and reconnect the app. Cached data stays available for viewing while the project is unavailable. [Supabase pricing](https://supabase.com/pricing), [project availability guidance](https://supabase.com/docs/guides/platform/free-project-pausing)

## Running and deploying

Serve the project over HTTP; opening `index.html` as a file does not support the PWA and authentication reliably:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

Visit `http://127.0.0.1:8000`. Empty configuration shows setup guidance and keeps garden changes unavailable.

For GitHub Pages, select **GitHub Actions** as the Pages source. Add repository Actions **variables** named `SUPABASE_URL` and `SUPABASE_PUBLISHABLE_KEY` with the public values from step 4. The existing Pages workflow runs the browser and database checks before deploying. It builds an explicit public-file allowlist, excluding tests, migrations, dependencies, and prompts. The deploy step safely writes the two variables into the generated site's `config.js`; it does not modify your tracked local configuration. Push to `main`, or run the workflow manually.

The Supabase browser SDK is pinned at version 2.115.0 and vendored under `vendor/`, so the app shell does not depend on a CDN. Whenever changing application assets, increment the cache version in `service-worker.js`. This release upgrades previous shells to v13, adds device-local Classic and Modern appearances, and preserves account-owned photo caches. The service worker caches only allowlisted application assets. Public `config.js` refreshes from the network when available, so completing owner setup does not require a code release.

## Synchronization and offline behavior

Each account owns one versioned JSON garden. Every save includes its expected revision and a stable operation ID. Database row locking rejects stale edits; the operation ledger makes retrying an accepted request safe. The UI confirms success and star celebrations after the server confirms the save. Remote changes arrive through Realtime, reconnect/tab-focus refresh, and periodic refresh while visible.

Unsaved forms retain their original revision during remote updates. If another device changes the garden, choose **Use latest garden for this draft**, review the preserved draft, and submit it again. If a connection fails after a save may have reached the server, **Retry save** sends the original operation again. That pending operation survives reload. A later save waits until its outcome is known.

The app caches confirmed garden data by project and account. Offline use permits viewing and local language/page-size preferences; all garden changes are disabled. A previously viewed photo is cached privately on the device, with an animal fallback. Upload accepts JPEG, PNG, and WebP up to 5 MB and resizes proportionally to fit within 512 × 512 pixels; the displayed preview is square. Signing out clears this device's account and photo cache and locks Parent. Other devices remain signed in. [Device-local Supabase sign-out](https://supabase.com/docs/reference/javascript/auth-signout)

## Development checks

Install Node.js 22 or later, npm, Python 3, and PostgreSQL binaries. Runtime dependencies are already vendored; Node is only needed for development checks.

```sh
npm ci
npx playwright install chromium
npm test
npm run test:database
```

`npm test` checks JavaScript syntax, runs the Node-based storage/session tests, and runs Playwright against desktop Chromium and mobile emulation. The storage/session tests verify account races, cache separation, pending-save recovery, and request timeouts. The browser suite uses a shared in-memory transport double with the real application and session controller. Additional cases exercise the actual vendored Supabase SDK against mocked HTTP/WebSocket transport, including expired-token offline startup. Tests do not access a live Supabase account. It covers PIN access and hidden controls, disclosures/editor flows, both languages, account lifecycle, import, stale drafts, uncertain save retries, offline behavior, avatar upload, and PWA upgrade behavior.

The database command starts and stops a disposable PostgreSQL cluster, applies the production SQL migration with minimal local Auth/Storage schema stubs, and tests ownership policies, initialization, revision conflicts, retry receipts, avatar restrictions, and concurrent transactions. It does not touch an existing database or require live credentials. PostgreSQL is discovered via `PG_BIN`, `pg_config --bindir`, or Postgres.app on macOS. For another installation:

```sh
PG_BIN=/path/to/postgresql/bin npm run test:database
```

After provisioning a real project, perform a live smoke check on two independent devices: sign into both, add a star event, upload a photo, redeem a reward, and confirm both devices converge; sign out of one and confirm the other remains signed in. Database tests validate the SQL against PostgreSQL, while this smoke check verifies the hosted Auth, Realtime, and Storage configuration.

## Growing Stars

Choose Growing Star in Quick Actions or Custom Event and set the steps needed for one star (default 2). Saving a new quick action or submitting a custom event records the first step immediately. Help it grow adds one step; completion earns exactly one star. A target of 1 completes immediately. Progress never expires.

Unfinished activities with the same label (case-sensitive, ignoring surrounding whitespace) share one tracker across both forms. A matching submission adds a step and retains the tracker's original target, note, icon, and visibility. Editing a quick action affects future rounds without adding a step; deleting its template leaves current progress intact. After completion or cancellation, the next use begins a fresh round.

The Growing Stars panel provides Help it grow, Undo step (down to zero), and Cancel. Completed and canceled rounds remain in History; use an existing balance correction for a mistakenly awarded star. Children can view visible progress but only unlocked parents can change it. Private notes stay in Parent view. All changes require a connection and confirmed saves.

Refresh the app on every family device before using Growing Stars. Older clients can strip new quick-action fields when saving. No database migration is required.
