# Jones Automation Exercise

Playwright automation project for the callback form at [test.netlify.app](https://test.netlify.app/), following the Page Object Model (POM) design pattern.

## Project Structure

```
jones-automation-exercise/
├── pages/
│   └── callbackPage.js      # Page Object: selectors + actions for the callback form
├── tests/
│   └── callback.test.js     # Test suite
├── screenshots/             # Auto-created on first run; stores pre-submission screenshots
├── playwright.config.js     # Playwright configuration (browser, timeouts, reporter)
├── package.json
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- Internet access to reach `https://test.netlify.app/`

## Installation

```bash
# 1. Install Node dependencies
npm install

# 2. Install Playwright browser binaries
npx playwright install chromium
```

## Running the Tests

### Headless (default — CI-friendly)

```bash
npm test
```

### Headed (watch the browser)

```bash
npm run test:headed
```

### View the HTML report after a run

```bash
npm run test:report
```

## What the test does

1. Navigates to `https://test.netlify.app/`.
2. Fills in Name, Email, Phone, Company, and Website.
3. Changes the **Number of Employees** dropdown from `1-10` to `51-500`.
4. Saves a full-page screenshot to `screenshots/` before clicking submit.
5. Clicks **Request a call back**.
6. Waits for the Thank You confirmation page/message and logs it to the console.
7. Asserts the success state (URL or body text contains *thank you / success*).

## Artefacts

| Artefact | Location |
|---|---|
| Pre-submission screenshots | `screenshots/` |
| Playwright HTML report | `playwright-report/` |
| Failure traces | `test-results/` |

## Known Environment Note (Node 22 + Playwright 1.61 Compatibility)

During setup under **Node v22.17.0** and **Playwright v1.61.0**, a known upstream environment bug may trigger (`context.conditions.includes is not a function`). 

If encountered, this can be quickly bypassed by running the test with the `--no-esm` loader flag or by pinning the Node version to v20 (LTS). Alternatively, a temporary patch can be applied to `node_modules/playwright/lib/common/index.js` to handle `context.conditions` as a Set. In a production pipeline, this would be locked cleanly using `patch-package`.