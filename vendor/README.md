# Vendored Supabase browser SDK

`supabase.js` is the unmodified UMD build from `@supabase/supabase-js` **2.115.0**, pinned in `package-lock.json`. It defines `window.supabase` and runs without a CDN connection. The upstream MIT license is included in `SUPABASE-LICENSE`.

To reproduce this asset after `npm ci`:

```sh
cp node_modules/@supabase/supabase-js/dist/umd/supabase.js vendor/supabase.js
cp node_modules/@supabase/supabase-js/LICENSE vendor/SUPABASE-LICENSE
```

Update the service worker cache version whenever changing this vendored file. See the [official SDK installation documentation](https://supabase.com/docs/reference/javascript/installing).
