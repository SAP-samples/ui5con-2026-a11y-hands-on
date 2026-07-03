![OpenUI5 logo](http://openui5.org/images/OpenUI5_new_big_side.png)

# Fixing Accessibility Issues in UI5 Apps

> **UI5con 2026 Hands-on Workshop:** Identify and fix accessibility (a11y) issues in a UI5 application — a series of guided hand-fixes covering the most common defects you'll see in real UI5 apps.

<!--- Register repository https://api.reuse.software/register, then add REUSE badge:
[![REUSE status](https://api.reuse.software/badge/github.com/SAP-samples/ui5con-2026-a11y-hands-on)](https://api.reuse.software/info/github.com/SAP-samples/ui5con-2026-a11y-hands-on)
-->

## Description

This repository contains the demo project for the **Accessibility Hands-On** at [UI5con 2026](https://openui5.org/ui5con/). You will work with a small UI5 application that contains several intentional accessibility issues — broken heading hierarchy, missing image alt text, unlabelled form controls, missing dialog labels, missing page landmarks, and more — and fix them step by step.

> [!IMPORTANT]
> This project **intentionally contains accessibility issues** for educational purposes. Attendees will identify and fix these issues step-by-step during the workshop.

## Prerequisites

Before you arrive at the workshop, please complete the setup steps in:

📄 **[hands-on-lectures/prerequisites.md](hands-on-lectures/prerequisites.md)**

> [!IMPORTANT]
> Do this **before** you arrive at the conference. Conference Wi-Fi is slow — installing Node.js, cloning the repo, and setting up Claude on-site will eat into your hands-on time.

The prerequisites cover:

- **Node.js** (`^20.17.0` or `>=22.9.0`) and **npm** (`>=8`) — to run the UI5 dev server
- **Git** — to clone this repo
- A modern browser (Chrome / Edge / Firefox)
- **axe DevTools** browser extension — to scan the app for a11y violations
- **HeadingsMap** browser extension — to visualise the page's heading outline
- **Claude Code CLI** *or* **claude.ai web chat** — for the AI-assisted exercise

See [hands-on-lectures/prerequisites.md](hands-on-lectures/prerequisites.md) for the full step-by-step setup.

## Known Issues

No known issues.

## How to obtain support

[Create an issue](https://github.com/SAP-samples/ui5con-2026-a11y-hands-on/issues) in this repository if you find a bug or have questions about the content.

For additional support, [ask a question in SAP Community](https://answers.sap.com/questions/ask.html).

## Contributing

If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License

Copyright 2026 SAP SE or an SAP affiliate company and ui5con-2026-a11y-hands-on contributors. Please see our [LICENSE](LICENSE) for copyright and license information. Detailed information including third-party components and their licensing/copyright information is available [via the REUSE tool](https://api.reuse.software/info/github.com/SAP-samples/ui5con-2026-a11y-hands-on).
