# Exercise 3 — Fix a missing form label

> ⏱ **Duration:** ~7 minutes
> 🛠 **You'll edit:** `webapp/view/Main.view.xml`
> 🤖 **Claude needed?** No — this is a research-and-fix exercise.

## What you'll learn

Why every interactive form control needs a programmatic label, what UI5 does (and doesn't) do when you delete a `sap.m.Label`, and how to give a bare `sap.m.Select` an accessible name.

> [!NOTE]
> This exercise assumes the UI5 dev server is already running at <http://localhost:8080/index.html>. If you haven't started it yet, do [**Start the app**](../hands-on-lectures/start-the-app.md) first.

## See the issue with axe DevTools

1. **Open the app** at <http://localhost:8080/index.html>.
2. **Open DevTools** (F12) and switch to the **axe DevTools** tab.
3. Click **Scan ALL of my page**.

You should see an issue flagged that looks roughly like this:

> **Form elements must have labels**
> *Element location:* `<div id="…--idSortSelect" role="combobox" …>`
> *Issue description:* Element does not have an accessible name.

Or, depending on the axe ruleset, a related rule may fire instead:

> **ARIA input fields must have an accessible name**

Click the issue to expand it — axe highlights the sort dropdown at the top-right of the product grid.

Now try it with a screen reader if you have one to hand:

- **VoiceOver (macOS)** — `Cmd+F5`, Tab until you reach the sort dropdown. You'll hear something like *"pop up button, Relevance"* — you get the current value, but no clue what the dropdown *controls*.
- **NVDA (Windows)** — same story: it reads the selected item but has no field name.

Sighted users see the *"Sort by:"* text … oh wait — do they? Look at the toolbar again. There is no visible *"Sort by:"* label either. The dropdown is completely unnamed for everyone; screen-reader users just have less context to guess from.

## The problem

Open `webapp/view/Main.view.xml` and find the sort toolbar (search for `idSortSelect`). You should see something roughly like:

```xml
<OverflowToolbar>
    <Text text="{ … productCountText …}" />
    <ToolbarSpacer />
    <Select id="idSortSelect" selectedKey="{catalog>/sortKey}" change=".onSortChange">
        <core:Item key="relevance" text="Relevance" />
        <core:Item key="price-asc" text="Price: Low to High" />
        <core:Item key="price-desc" text="Price: High to Low" />
        <core:Item key="rating" text="Rating" />
    </Select>
</OverflowToolbar>
```

Something is missing right before the `<Select>`. There used to be a `sap.m.Label` there that named the dropdown; someone deleted it. The rendered `<div role="combobox">` now has no `aria-labelledby`, no `aria-label`, and no `<label for="…">` — hence axe's complaint.

The `<Select>` in the source has no label right above it — that's what's wrong. Don't jump to the answer yet — first look up how UI5 exposes form labels in the ARIA layer.

## Research prompts

Rather than paste a fix, we want you to work out the right one. Start here:

- **UI5 API doc for `sap.m.Label`** — <https://sdk.openui5.org/api/sap.m.Label>. Look at the `labelFor` property. What DOM attribute does it produce, and how does that reach `sap.m.Select`?
- **UI5 API doc for `sap.m.Select`** — <https://sdk.openui5.org/api/sap.m.Select>. Look at the `ariaLabelledBy` association. When would you use it *instead* of a `Label`?
- **WCAG 3.3.2 Labels or Instructions** — <https://www.w3.org/WAI/WCAG22/Understanding/labels-or-instructions.html>. Why does a visible label matter, not just a hidden `aria-label`?

There is more than one correct fix here. Pick one, apply it, and be ready to explain the trade-off in the debrief.

## Verify the fix

Re-run axe (**Scan ALL of my page**). The *"Form elements must have labels"* / *"ARIA input fields must have an accessible name"* violation should be gone.

Then inspect the `Select` root in DevTools. Look for one of these in the `<div role="combobox">`:

- `aria-labelledby="…"` pointing at an id whose element contains readable text (`"Sort by:"`, or similar); **or**
- `aria-label="…"` with a short, descriptive string.

If you used a `sap.m.Label` with `labelFor`, you should also see a visible *"Sort by:"* rendered to the left of the dropdown — that's the accessible fix *and* a usability improvement for sighted users.

## Takeaway

`sap.m.Select` (and every UI5 form control — `Input`, `ComboBox`, `DatePicker`, `MultiComboBox`, `CheckBox`, `RadioButton`, …) needs an accessible name from one of three sources, in preference order:

1. **A visible `sap.m.Label` with `labelFor="<controlId>"`** — best: sighted users and screen-reader users get the same information.
2. **`ariaLabelledBy="<id of some other visible text>"`** — second-best: still hooks to visible text, but requires the text to already exist somewhere sensible.
3. **`ariaLabel="…"` (a plain string)** — last resort: invisible to sighted users. Fine for icon-only buttons; a smell for form fields.

The bug pattern in this app — dropping the label because *"the current value is visible anyway"* — is one of the most common regressions on Fiori toolbars. Every icon-only Select, `SearchField`, and `DatePicker` in the wild is one careless refactor away from becoming this bug.

---

[← Previous: Exercise 2 — Image alt text](02-fix-image-alt.md) · [Back to README](../README.md) · [Next: Exercise 4 — Dialog accessibility →](04-fix-dialog.md)
