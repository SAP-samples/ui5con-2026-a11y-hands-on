# Exercise 6 — Fallback prompt for **free** claude.ai users

> Use this if you don't have a Claude subscription and can't install the Claude Code CLI plugin.

The free version of [claude.ai](https://claude.ai) **cannot read files from your machine** — there's no `webapp/…` path Claude can open, no MCP, no plugins. You have to hand it the source. This exercise shows you the fastest way to do that in one message.

## Step 1 — Open a new chat on claude.ai

Go to <https://claude.ai>, sign in with a free account, and start a **new chat**. Free tier is enough for this exercise as long as you stick to a single message (see the token tip at the bottom).

## Step 2 — Attach the three files you'll review

These are the only files with issues the workshop covers:

| File | What's in it |
| --- | --- |
| `webapp/view/Main.view.xml` | Page layout — landmarks, headings, images, form inputs |
| `webapp/view/OrderDialog.fragment.xml` | The dialog — labelling and focus |
| `webapp/controller/Main.controller.ts` | Handlers — `MessageToast`, filter, order → where `InvisibleMessage` announcements belong |

You have three options, from best to worst:

### Option A — Drag & drop the files into the chat (recommended)

1. Open your file explorer (Finder / Explorer) at the workshop repo root.
2. Select all three files above (Cmd/Ctrl-click to multi-select).
3. **Drag them onto the claude.ai chat input box.** You'll see them appear as attachments above the text field.
4. Type or paste the prompt (below) *underneath* the attachments and send.

Claude reads each attachment as text, so you don't need to paste the file contents into the message body — this keeps the prompt short and leaves more room in the daily quota.

### Option B — Paste the file contents inline

If drag-and-drop is blocked on conference Wi-Fi or the attach button is greyed out on your account:

1. In your editor, open each of the three files and copy the whole contents.
2. Paste the prompt (below) into claude.ai.
3. At the bottom of the prompt (where you see `<paste file contents here>`), replace each placeholder with the actual file contents between the `===== filename =====` markers.
4. Send.

### Option C — Bundle all three files into one paste

Run this in your terminal at the repo root — it prints all three files with headers ready to paste:

```bash
for f in webapp/view/Main.view.xml webapp/view/OrderDialog.fragment.xml webapp/controller/Main.controller.ts; do
  echo ""; echo "===== $f ====="; cat "$f"
done | pbcopy   # macOS — copies to clipboard
# Linux: replace `pbcopy` with `xclip -selection clipboard`
# Windows PowerShell: pipe to `Set-Clipboard` instead of `pbcopy`
```

Then paste the prompt into claude.ai, delete the three `<paste file contents here>` placeholders, and paste the clipboard where they were.

## Step 3 — Send the prompt (once)

Whichever option you picked, you should now have **one message** containing:

- The prompt from the next section, **and**
- The three files (as attachments or as inline text).

Send it. Claude replies with a grouped list of findings + minimal diffs.

## Step 4 — Apply the diffs

For each finding: open the named file at the named line in your editor, apply the snippet from the "Fix" block, save. Reload the app in the browser and re-run **axe DevTools** to confirm the violation is gone.

> **Token-budget tip.** The free tier has a rolling daily message limit that resets every few hours. Keep the review to *one* turn: send the prompt + files together, read the reply, apply the diffs offline. If a fix confuses you, ask a follow-up about **that one finding** — don't re-paste the files. Re-attaching the three files costs the same tokens every time.

---

## The prompt

````
You are reviewing a small SAPUI5 application for accessibility issues. I'll paste the
source of a few views/fragments/controllers below. Your job is to find every a11y gap
and propose the minimal fix for each — nothing more.

Use the UI5 rules on this checklist. For each rule, if the code violates it, output a
finding; if it doesn't, stay silent (don't pad the report).

### Checklist — UI5 accessibility rules

1. **Heading hierarchy**
   - Every `<Title>` must have an explicit `level` (H1, H2, …).
   - The page must have exactly one H1, and levels must not skip (H1 → H3 is wrong).
   - `Panel`'s header title inherits from `headerText` — set `level` via `<headerToolbar><Title level="H2" …/>` when nested.

2. **Image alt text**
   - `<Image>` that carries meaning needs a non-empty `alt`.
   - Purely decorative images must set `decorative="true"` (and no `alt`).
   - `<core:Icon>` used standalone (not inside a Button) needs `alt` or `decorative="true"`.

3. **Form labeling**
   - Every `Input`, `Select`, `ComboBox`, `DatePicker`, `TextArea`, `CheckBox`, `RadioButton`
     outside a `SimpleForm` needs a `<Label labelFor="inputId">`.
   - Inside `SimpleForm` / `Form`, the `<Label>` is enough — no `labelFor` needed.
   - `Table` needs `ariaLabelledBy` pointing to a visible title, OR a `headerToolbar` with a `<Title>`.
   - **Icon-only `Button`** (has `icon=` but no `text=`) needs a `tooltip` — the tooltip becomes the accessible name.

4. **Dialog / Popover labeling & focus**
   - `<Dialog>` with `showHeader="false"` must have `ariaLabelledBy` pointing to a visible text inside it.
   - `<Dialog>` with a header (`title=` set) is labelled automatically — don't double-label.
   - If the first focusable control isn't the right one to focus on open, set `initialFocus="controlId"`.
   - Confirmation buttons (`beginButton`/`endButton`) don't need extra tooltips — `text` is enough.

5. **Landmarks**
   - The root `<Page>` / `<DynamicPage>` needs `<landmarkInfo>` with a `PageAccessibleLandmarkInfo`
     entry setting `rootRole="Main"` **and** `rootLabel="…"` (label is required whenever role is set).
   - Repeated regions (header nav, side panel, footer) need their own role + label:
     `headerRole="Banner"` + `headerLabel`, `subHeaderRole="Navigation"` + `subHeaderLabel`,
     `footerRole="ContentInfo"` + `footerLabel`.
   - `Panel` that groups a distinct section can use `accessibleRole="Region"` — but only if it also
     has a heading (`headerText` or a `Title` in the header toolbar).

6. **Invisible messaging (screen-reader announcements)**
   - When the controller shows a `MessageToast`, updates a status, or filters a list based on user
     action, add `InvisibleMessage.getInstance().announce(text, InvisibleMessageMode.Polite)` in the
     handler. `MessageToast` alone is *visual only* — screen readers won't hear it.
   - Import: `sap/ui/core/InvisibleMessage` and `sap/ui/core/library` (for the mode enum).

7. **Keyboard shortcuts**
   - Primary actions (save, submit, delete, order) that users would expect to trigger with a
     shortcut should use `<dependents><core:CommandExecution command="Save" execute=".onSave"/></dependents>`
     wired to a `<commands>` entry in the view. Don't hand-roll `keydown` listeners.

8. **Reading order & target size**
   - Don't reorder controls with CSS `order:` / absolute positioning if it puts them out of the XML sequence.
   - `<Link>`, `<ObjectIdentifier>`, `<ObjectStatus>`, `<ObjectNumber>` inside a dense list/table
     row should set `reactiveAreaMode="Overlay"` so the tap target reaches 24×24 CSS px (WCAG 2.5.8).

### Report format

Group findings by rule number (1–8). For each finding output:

- **File & line** — `webapp/view/Main.view.xml:42`
- **Issue** — one line: control + missing property
- **Impact** — `critical` / `serious` / `moderate` / `minor`
- **Why** — one sentence on the user impact (what a screen-reader / keyboard user experiences)
- **Fix** — the *minimal* corrected XML/JS snippet (only the changed lines, not the whole file)

End with a one-line summary: `X critical, Y serious, Z moderate, N minor`.

If a rule has no violations in the pasted code, skip it — don't say "no issues in rule N".

Do **not** invent controls that aren't in the pasted files. Do **not** propose refactors
outside the checklist (styling, TypeScript conversion, unrelated cleanups).

---

Here are the files:

===== webapp/view/Main.view.xml =====
<paste file contents here>

===== webapp/view/OrderDialog.fragment.xml =====
<paste file contents here>

===== webapp/controller/Main.controller.ts =====
<paste file contents here>
````

---

## After the reply

- Compare each finding against what you learned in Exercises 1–5. If a fix looks unfamiliar,
  cross-check it against the corresponding exercise before you apply it.
- Apply the diffs one at a time, reload the app, and re-run **axe DevTools**.
- Anything axe still flags is either a gap in the prompt above (contribute back!) or
  a false positive — check the WCAG rule the violation cites and decide.

## Why the prompt is shorter than the skill

The real `ui5-best-practices-accessibility` skill also loads eight *topic files* on demand
(`references/landmark.md`, `references/labeling.md`, …) with wrong/correct code pairs and
API detail. The free-tier prompt above collapses those into one-line rules to fit in a
single message. That means:

- **You still catch the common gaps** the workshop covers.
- **You may miss edge cases** — e.g. `sap.ui.core.IFormContent`, custom controls, or the
  exact enum for `landmarkInfo` sub-regions. If Claude's fix looks off, ask a follow-up
  naming the specific control and the framework version you're on.

---

[← Previous: Exercise 5 — Landmarks](05-fix-landmarks.md) · [Back to README](../README.md) · [Next: Exercise 6 — Skill sweep (CLI) →](06-claude-a11y-skill.md)
