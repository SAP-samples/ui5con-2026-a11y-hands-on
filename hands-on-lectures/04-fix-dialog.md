# Exercise 4 — Fix dialog accessibility

> ⏱ **Duration:** ~10 minutes
> 🛠 **You'll edit:** `webapp/view/OrderDialog.fragment.xml`
> 🤖 **Claude needed?** No — this is a research-and-fix exercise.

## What you'll learn

How `sap.m.Dialog` derives its accessible name, what happens when you suppress its built-in header, and how to give the dialog a real, screen-reader-readable title back.

## See the issue with axe DevTools

Before we touch any code, let axe show you what's wrong.

1. **Open the app** at <http://localhost:8080/index.html>.
2. **Open the order dialog** — press **Order Now** on any product card. Leave the dialog open.
3. **Open DevTools** (F12 or right-click → *Inspect*) and switch to the **axe DevTools** tab.
4. Click **Scan ALL of my page**.

You should see an issue flagged that looks roughly like this:

> **ARIA dialog and alertdialog nodes should have an accessible name**
> *Element location:* `<div role="dialog" …>`
> *Issue description:* `aria-labelledby` attribute does not exist, references elements that do not exist, or references elements that are empty.

Click the issue to expand it — axe highlights the offending `<div role="dialog">` element in the page, and the **Issue description** explains *why* the dialog has no accessible name.

Keep the axe panel open — we'll re-scan after the fix to confirm the violation is gone.

## The problem

Open `webapp/view/OrderDialog.fragment.xml` in your IDE. The current dialog looks like this:

```xml
<Dialog id="idOrderDialog" contentWidth="22rem" showHeader="false" …>
    <content>
        <Text text="Are you sure you want to order …?" />
    </content>
    <beginButton><Button text="Confirm" type="Emphasized" press=".onSubmitOrder" /></beginButton>
    <endButton><Button text="Cancel" press=".onCancelOrder" /></endButton>
</Dialog>
```

Two things are off:

1. **`showHeader="false"`** tells UI5: *don't render a header bar for this dialog*. The Dialog's `title` property is therefore unused, and UI5 has no header element to point `aria-labelledby` at.
2. **There is no title text anywhere on the dialog** — only a confirmation sentence in the body. Even visually, a sighted user only learns this is an "order" dialog by reading the question and the *Confirm* button. For a screen-reader user there's literally nothing identifying what the modal is for.

Inspect the dialog root in DevTools while it's open — you'll see something like:

```html
<div role="dialog" data-sap-ui="…" …>
    <!-- no aria-labelledby, no aria-label -->
</div>
```

That's why axe reports *"ARIA dialog … should have an accessible name"*. There genuinely isn't one — UI5 didn't render a header, no `title` was set, and there is no `ariaLabelledBy` reference either. A screen-reader user opening the modal would hear just *"dialog"* — no idea what it's for.

## Research prompts

There is more than one correct fix. Start here:

- **UI5 API doc for `sap.m.Dialog`** — <https://sdk.openui5.org/api/sap.m.Dialog>. Look at `title`, `showHeader`, `customHeader`, and the `ariaLabelledBy` association. Which combination gives the dialog an accessible name?
- **UI5 samples — dialog with a custom header** — search the UI5 explored samples for `sap.m.Dialog customHeader`. Note when the sample sets `ariaLabelledBy` explicitly and when it doesn't.
- **WCAG 4.1.2 Name, Role, Value** — <https://www.w3.org/WAI/WCAG22/Understanding/name-role-value.html>. Why does an unlabelled modal fail this criterion?

Pick the simplest fix that gives the dialog a visible, readable header — then be ready to explain in the debrief what the *other* valid fixes are and when you'd reach for them.

## Verify the fix

Re-run axe (**Scan ALL of my page** with the dialog still open). The *"ARIA dialog and alertdialog nodes should have an accessible name"* violation should be gone.

Then inspect the Dialog root in the **Elements** panel — you should see either:

```html
<div role="dialog" aria-labelledby="…--idOrderDialog-title" …>
    <header class="sapMDialogHeader …">
        <h1 id="…--idOrderDialog-title" …>Confirm order</h1>
    </header>
    …
</div>
```

…or an equivalent structure where `aria-labelledby` (or `aria-label`) resolves to real, readable text.

## When you'd need a different fix

The "cleanest" fix here works because the dialog never needed a custom header. In real Fiori apps you sometimes can't do that — the title bar must contain badges, status icons, or extra action buttons. In those cases:

- Use `<customHeader>` with a real heading control (`sap.m.Title level="H1|H2|…"`) inside it.
- Set `ariaLabelledBy="<id of the Title>"` on the Dialog to wire the reference manually.

Forgetting either half — using a `customHeader` without a heading, or without `ariaLabelledBy` — is one of the most common a11y regressions in Fiori dialogs.

---

[← Previous: Exercise 3 — Labeling](03-fix-labeling.md) · [Back to README](../README.md) · [Next: Exercise 5 — Landmarks →](05-fix-landmarks.md)
