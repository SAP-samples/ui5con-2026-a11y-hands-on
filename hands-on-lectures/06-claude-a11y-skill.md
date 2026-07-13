# Exercise 6 — Let the UI5 accessibility skill sweep the codebase

> ⏱ **Duration:** ~15 minutes
> 🛠 **You'll edit:** none directly — Claude proposes the diffs, you review and accept
> 🤖 **Claude needed?** **Yes** — this exercise depends on Claude Code being installed (see [prerequisites](prerequisites.md)) plus the **`ui5-best-practices-accessibility`** plugin (installed in step 1 below).

> [!NOTE]
> The steps below are written for the **Claude Code CLI**. If you set up the claude.ai web chat in the [prerequisites](prerequisites.md#step-6--set-up-claude-for-exercise-6) instead, use your Project's custom instructions to paste in the same skill guidance — a facilitator will share the paste-in text at the start of this exercise.

## What you'll learn

How a *skill* — a small, focused instruction file distributed via a Claude Code plugin — can teach Claude Code the same UI5 a11y patterns you just learned in Exercises 1–5, and apply them to code you haven't touched yet. You'll see how skills compare to one-shot prompting: faster, more consistent, and reusable across teammates because the rules ship as a versioned plugin rather than a copy-pasted prompt.

## The problem

Exercises 1–5 fixed the issues we *knew about*. A real UI5 codebase will have many more — a half-finished feature branch, a copy-pasted dialog from a year ago, a control that was added before the team had an a11y reviewer. Hand-fixing each one is slow and easy to forget; running them past a generic "make this accessible" prompt misses the UI5-specific patterns (e.g. `ariaLabelledBy` vs. `tooltip`, `PageAccessibleLandmarkInfo` for landmarks, `sap.ui.core.IFormContent`, the right way to set headings on `Title` / `Panel`, `InvisibleMessage` for status announcements).

The fix is to give the AI a **skill**: a versioned cheat sheet that says *"in this codebase, on this framework, here is what 'accessible' actually means."* — and to ship that skill as a **plugin** so every teammate gets the same one with a single install command.

## The fix

The `ui5-best-practices-accessibility` skill lives in a separate plugin repository, not in this workshop repo. You install the plugin once into your Claude Code config and it becomes available in every UI5 project you open. It contains the same patterns you just applied by hand — accessible dialog labelling, heading hierarchy, image alt text, form labels, landmarks — plus icon-only button names, the document `lang` attribute, `InvisibleMessage` announcements for status changes, and other UI5 a11y rules, written as instructions Claude follows when invoked.

### 1. Install the plugin

The `ui5-best-practices-accessibility` plugin is published in the **`claude-plugins-official`** marketplace on GitHub. Installing it is a two-step flow: first add the marketplace to your Claude Code config (once per machine), then install the plugin from it.

**b. Install the plugin from the marketplace:**

```
/plugin install ui5@claude-plugins-official ui5-best-practices-accessibility
```

The `ui5@claude-plugins-official` piece names the *category* inside the marketplace; `ui5-best-practices-accessibility` is the plugin itself. Claude Code will download the plugin, register its skill, and reload your slash-command list.

> 💡 **If `/plugin` isn't a command your Claude Code recognises**, your CLI is too old for the marketplace flow. Update it (`npm i -g @anthropic-ai/claude-code`) and restart the session. If you can't update on the conference Wi-Fi, a facilitator will help you side-load the skill from a USB / local folder.

**c. Verify the skill is registered.** In the same session, type:

```
/help
```

Scroll to the **Skills** section — you should see `ui5-best-practices-accessibility` listed. If it isn't there, quit Claude Code (`Ctrl-C` twice) and reopen it so the plugin is picked up on startup.

### 2. Invoke the skill on the codebase

In the same Claude Code session, ask Claude to sweep the app using the newly installed skill. A short, plain-language prompt is enough — Claude will pick up `ui5-best-practices-accessibility` from the available skills list because the request matches its description. Paste this in:

```
Use the /ui5-best-practices-accessibility skill to sweep webapp/ for any accessibility issues. For each finding, show me the file + line, explain the WCAG / UI5 pattern it violates, and propose a diff. Don't apply anything yet — I want to review each fix before you edit.
```

Claude will:

1. Load the `ui5-best-practices-accessibility` skill.
2. Scan `webapp/` for the a11y patterns the skill documents.
3. List every place a fix is needed, with file + line numbers.
4. Propose a diff for each one (it will *not* edit silently — you approve each change).

On this codebase, expect the skill to flag at least:

- **Icon-only Buttons with no `tooltip`** on the product cards (heart / share) and in the app header (notification bell). Icon-only Buttons have no visible text, so without `tooltip` UI5 has nothing to map onto `aria-label` — screen readers announce "button" with no name. Fix: add `tooltip="{i18n>...}"`.
- **The header `Avatar`** rendered with initials but no `tooltip` / no `ariaLabelledBy`. Same failure mode — a nameless interactive-looking element. Fix: add a `tooltip` (or an associated `Label`) that describes the signed-in user.

The icon-only Buttons and the header `Avatar` in `webapp/view/Main.view.xml` are the main anchors the skill should surface. If it also proposes fixes elsewhere, that's fine; the skill enforces the same patterns wherever they apply.

> 💡 The skill's own description tells Claude *when* to activate — you don't have to name it every time. In future sessions, asking "make this dialog accessible" or "check the headings on this view" is usually enough for Claude to pull the skill in on its own. Naming it explicitly (as in the prompt above) is the reliable form for a workshop, where you want everyone to get the same behaviour.

### 3. Review and accept the diffs

For each proposed change:

- **Match against what you learned.** If the skill suggests adding `tooltip` to an icon-only button, that should look familiar from the `tooltip → aria-label` mapping discussed in Exercises 1–5.
- **Reject anything you don't understand.** The skill is a starting point, not an oracle. Spot-check at least one fix in each category against the corresponding hand-fix lecture.
- **Accept the diff** if it matches the pattern. Once you're happy with the full set, ask Claude to apply them:

```
Looks good — apply all the fixes we just reviewed.
```

### 4. Re-run axe DevTools

Reload the app and open axe DevTools. The remaining violations — if any — are either *false positives* (rare) or *gaps in the skill* (more likely; this is where you'd contribute back to the plugin repo).

## Why this scales

A skill distributed as a plugin means:

- **One install, every project.** `/plugin install` once; the skill is available in every UI5 codebase you open with Claude Code afterwards.
- **Versioned, reviewable, owned.** The plugin lives in its own git repo. Rule changes ship as PRs and tagged releases — you can pin a version, roll back a regression, and PR-review a change to "what accessible means" the same way you review code.
- **No drift across teammates.** Everyone running `/plugin install <same-url>` gets the same rules — no shared prompt to copy-paste, no Slack thread of "what was that snippet again?"
- **Composes with the rest of your CI.** The skill catches what the framework can't enforce at compile time; axe / ui5-linter / your own QUnit a11y tests catch what slips past the skill. Defence in depth.

## When *not* to use it

- **First time learning a pattern.** Do the hand-fix lecture first. Skills are great at applying a rule consistently; they're a worse teacher than reading why the rule exists.
- **Net-new controls.** If you're inventing a control, no skill knows what *accessible* means for it yet. Design the a11y story first, then contribute it back to the plugin so the next person doesn't have to.

## What to take home

- The five hand-fix exercises covered the *patterns*.
- This exercise covered the *enforcement loop*.
- Together they're how a UI5 team keeps a11y from regressing: humans learn the patterns, the plugin's skill applies them at scale, axe / linter / tests catch the gaps.

---

[← Previous: Exercise 5 — Landmarks](05-fix-landmarks.md) · [Back to README](../README.md) · [Next: Exercise 7 — Keyboard shortcut →](07-fix-keyboard-shortcut.md)
