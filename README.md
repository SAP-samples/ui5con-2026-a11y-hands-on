![OpenUI5 logo](http://openui5.org/images/OpenUI5_new_big_side.png)

# Fixing Accessibility Issues in UI5 Apps

> **UI5con 2026 Hands-on Workshop:** Identify and fix accessibility (a11y) issues in a UI5 application — a series of guided hand-fixes covering the most common defects you'll see in real UI5 apps.

[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/ui5con-2026-a11y-hands-on)](https://api.reuse.software/info/github.com/SAP-samples/ui5con-2026-a11y-hands-on)

## Description

This repository contains the demo project for the **Accessibility Hands-On** at [UI5con 2026](https://openui5.org/ui5con/). You will work with a small UI5 application that contains several intentional accessibility issues — broken heading hierarchy, missing image alt text, unlabelled form controls, missing dialog labels, missing page landmarks, and more — and fix them step by step.

The workshop is **research-driven**: each exercise shows you the defect (with axe DevTools, HeadingsMap, or a screen reader) and points you at the UI5 docs and WCAG criteria you need to work out the fix. We'll debrief the fixes together — you get more out of *finding* the right property than out of copy-pasting one.

> [!IMPORTANT]
> This project **intentionally contains accessibility issues** for educational purposes. Attendees will identify and fix these issues step-by-step during the workshop.

## Workshop Flow

Work through the steps below in order. The first two are setup (do them *before* the session); the rest are the hands-on exercises (~45–60 min total during the session, depending on how deep the debrief goes).

### Step 1 — Prerequisites

📄 [hands-on-lectures/prerequisites.md](hands-on-lectures/prerequisites.md)

> [!IMPORTANT]
> Do this **before** you arrive at the conference. Conference Wi-Fi is slow.

### Step 2 — Start the app *(2 min)*

📄 [hands-on-lectures/start-the-app.md](hands-on-lectures/start-the-app.md)

Install dependencies with `npm install` and start the UI5 dev server with `npm start`. **Leave the server running for the rest of the workshop** — every exercise scans the live app at <http://localhost:8080/index.html>.

### Step 3 — Exercise 1: Fix heading hierarchy *(7 min)*

📄 [hands-on-lectures/01-fix-headings.md](hands-on-lectures/01-fix-headings.md)

Research-and-fix — use HeadingsMap and axe DevTools to see that `Main.view.xml` has no `<h1>` and a flat `<h2>` outline underneath. Work out how `sap.m.Title.level` and `sap.m.Panel.headerLevel` compose into a proper `<h1>` → `<h2>` → `<h3>` hierarchy.

### Step 4 — Exercise 2: Fix image alt text *(5 min)*

📄 [hands-on-lectures/02-fix-image-alt.md](hands-on-lectures/02-fix-image-alt.md)

Research-and-fix — the product photos have `decorative="false"` but no `alt`, so screen readers announce the image URL. Work out the right `sap.m.Image` property combination for a content image.

### Step 5 — Exercise 3: Fix a missing form label *(7 min)*

📄 [hands-on-lectures/03-fix-labeling.md](hands-on-lectures/03-fix-labeling.md)

Research-and-fix — the "Sort by" `sap.m.Select` has no accessible name after its `Label` was deleted. Work out which of `sap.m.Label` / `ariaLabelledBy` / `ariaLabel` you should reach for and why.

### Step 6 — Exercise 4: Fix dialog accessibility *(10 min)*

📄 [hands-on-lectures/04-fix-dialog.md](hands-on-lectures/04-fix-dialog.md)

Research-and-fix — the order confirmation dialog has `showHeader="false"` and no title, so screen readers announce only *"dialog"*. Work out how `sap.m.Dialog` derives its accessible name and pick the cleanest of several valid fixes.

### Step 7 — Exercise 5: Fix page landmarks *(12 min)*

📄 [hands-on-lectures/05-fix-landmarks.md](hands-on-lectures/05-fix-landmarks.md)

Research-and-fix — the app has zero landmarks: no `<main>`, no `<nav>` around the sub-header breadcrumbs, no `<aside>` for the filters, no `<section>` for the product catalog. Work out how `PageAccessibleLandmarkInfo` (header + sub-header + content roles) and `sap.m.Panel.accessibleRole` compose into a properly-navigable landmark tree.

### Step 8 — Exercise 6: Let the UI5 accessibility skill sweep the codebase *(15 min)*

📄 [hands-on-lectures/06-claude-a11y-skill.md](hands-on-lectures/06-claude-a11y-skill.md)

AI-assisted — install the `ui5-accessibility` Claude Code plugin and let its skill find and fix the remaining a11y issues across the codebase, applying the same patterns you learned in Exercises 1–5. Runs in either the Claude Code CLI or the claude.ai web chat — set up whichever you prefer in the [prerequisites](hands-on-lectures/prerequisites.md#step-6--set-up-claude-for-exercise-6).

### Step 9 — Exercise 7: Add a keyboard shortcut to order the focused card *(10 min)* — *optional*

📄 [hands-on-lectures/07-fix-keyboard-shortcut.md](hands-on-lectures/07-fix-keyboard-shortcut.md)

Research-and-implement — bonus exercise. Add an `Alt+O` shortcut that opens the order dialog for the focused product card, then advertise it in the button tooltip.

## Known Issues

No known issues.

## How to obtain support

[Create an issue](https://github.com/SAP-samples/ui5con-2026-a11y-hands-on/issues) in this repository if you find a bug or have questions about the content.

For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing

If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License

Copyright 2026 SAP SE or an SAP affiliate company and ui5con-2026-a11y-hands-on contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP-samples/ui5con-2026-a11y-hands-on).
