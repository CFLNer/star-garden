# Star Garden

Star Garden is a small, kid-friendly habit and reward tracker for families. It uses stars, rewards, simple visuals, and a parent-only tools view to make everyday progress visible.

## Features

- Kid view with current stars, reward progress, and friendly daily history
- Parent view with quick actions for earning stars and gentle corrections
- Custom events with private parent notes
- Reward creation, editing, targeting, and redemption
- Local browser storage so events persist after refresh
- PWA support for adding the app to a phone home screen

## Running Locally

Open `index.html` in a browser, or serve the folder with any static file server.

For example:

```bash
python3 -m http.server 8000
```

Then visit:

```text
http://localhost:8000
```

## Deployment

This app is designed to run as a static site on GitHub Pages. Publish from the `main` branch and the repository root.

## Notes

- Data is stored in the browser's local storage on each device.
- The parent PIN is a simple child gate, not real authentication.
- No backend or cloud sync is included yet.
