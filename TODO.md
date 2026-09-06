# Future work

## Make CI checks required before merging pull requests

The GitHub Actions workflow at [`.github/workflows/pages.yml`](.github/workflows/pages.yml) already runs on every pull request and executes:

```sh
npm ci
npx playwright install --with-deps chromium
npm test
npm run test:database
```

Before relying on it for releases, configure the repository's branch protection rules for `main` so the workflow's **checks** job is a required status check. Require pull requests before merging and prevent direct pushes to `main` as appropriate for the project.

Keep the deploy job limited to `main` after the checks job passes. When adding a test command, add it to the `checks` job so it also runs for pull requests.
