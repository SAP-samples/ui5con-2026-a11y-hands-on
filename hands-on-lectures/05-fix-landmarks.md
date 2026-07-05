# Exercise 5 — Fix page landmarks

> ⏱ **Duration:** ~12 minutes
> 🛠 **You'll edit:** `webapp/view/Main.view.xml`
> 🤖 **Claude needed?** No — this is a research-and-fix exercise.

## What you'll learn

Why every page needs a `<main>` landmark and at least one other labelled landmark to be navigable by screen-reader rotor, how `sap.m.Page` renders its `content` / `customHeader` / `subHeader` aggregations *without* landmark roles by default, and how `PageAccessibleLandmarkInfo` and `sap.m.Panel`'s `accessibleRole` property let you add real HTML landmarks (including `<nav>` for a breadcrumb bar) without touching the DOM directly.

## Background — what landmarks are for

Screen-reader users don't read a page top-to-bottom. They jump between **landmarks** — regions of the page tagged with roles like `banner`, `navigation`, `main`, `complementary`, `contentinfo`. In VoiceOver you press `Ctrl+Opt+U` and pick "Landmarks"; in NVDA you press `D` to move between them. If a page has no landmarks — or has only unlabelled generic ones — that whole navigation mode is broken and the user has to Tab through every focusable control instead.

Two axe rules enforce this:

- **`landmark-one-main`** — every page must have exactly one `<main>` (or `role="main"`) landmark.
- **`region`** — all page content should be contained inside a landmark. A `<div>` full of buttons that isn't inside `<main>`, `<aside>`, `<nav>`, etc. is "orphan content" and gets flagged.

## See the issue with axe DevTools

1. **Open the app** at <http://localhost:8080/index.html>.
2. **Open DevTools** (F12) and switch to the **axe DevTools** tab.
3. Click **Scan ALL of my page**.

You should see two related issues flagged:

> **Page should contain a level-one landmark**
> *Element location:* `<body …>`
> *Issue description:* Document does not have a main landmark.

> **All page content should be contained by landmarks**
> *Element location:* `<div id="…--idFilterPanel" …>` (and others — sub-header breadcrumbs, filter sidebar, product catalog, sort toolbar)
> *Issue description:* Some page content is not contained by landmarks.

Click each to expand — axe highlights the sub-header breadcrumb bar, the filter sidebar, and the product region as orphan content, and points at `<body>` for the missing `main`.

## The problem

Open `webapp/view/Main.view.xml`. There are **four** landmark defects in this file — three GAP comments call them out. All four come together to leave the app with zero landmarks.

### 1. No `main` (or `banner`) landmark on the Page

`sap.m.Page` does **not** emit a `<main>` element for its `content` aggregation by default. It emits a generic `<section>` (rendered as a `<div>` or `<section>` with no ARIA role). And its `customHeader` renders as a generic Bar, not a `<header role="banner">`. To get real `<main>` and `<banner>` landmarks you have to fill in the `Page`'s `landmarkInfo` aggregation.

Look at the `<Page id="idMainPage" …>` opening tag. It has no `<landmarkInfo>` child. Inspect the page in DevTools — search the DOM for `role="main"` or a `<main>` element. **There isn't one.** The header, sub-header breadcrumbs, filters, and product grid all live inside a generic `<div>`.

### 2. Sub-header breadcrumbs are not `<nav>`

Right under the app header sits a **sub-header** hosting `sap.m.Breadcrumbs` — the *All Products / Laptops / Monitors / Peripherals* trail. Semantically that's the *primary category navigation* of the page: click a crumb, the product list filters. It should be inside a `<nav>` landmark, so screen-reader rotor users can jump to it with *"navigation"*.

Look at the GAP comment above the `<subHeader>` block (search: *"Exercise 5 (landmarks) part C"*). Today the breadcrumbs sit inside a generic Bar with no landmark role — they're orphan content.

`sap.m.Bar` itself doesn't have an `accessibleRole` property, but `sap.m.Page`'s `PageAccessibleLandmarkInfo` has a `subHeaderRole` / `subHeaderLabel` pair that wraps the sub-header in the role you pick. Which value produces `<nav>`?

### 3. Filter Panel has no `accessibleRole`

Further down, the filter sidebar `Panel`:

```xml
<Panel
    id="idFilterPanel"
    headerText="Filters"
    expandable="false"
    class="workshop-filter-panel"
    width="260px">
```

Look at the GAP comment above it (search: *"Exercise 5 (landmarks) part A"*). The `accessibleRole` property is missing. Without it, `sap.m.Panel` renders a generic `<div>` and nothing tells assistive tech "this is a side panel of filters, distinct from the main product list."

### 4. Product-catalog Panel has no `accessibleRole` either

And the same defect on the inner product-catalog Panel — the GAP comment there is labelled *"Exercise 5 (landmarks) part B"*. Without a role, the entire product area is *also* orphan content.

That's the compound break. Fixing only one of the four still leaves violations; you need all four.

## Research prompts

Rather than paste a fix, work out the right one yourself. Start here:

- **UI5 API doc for `sap.m.Page`** — <https://sdk.openui5.org/api/sap.m.Page>. Look at the `landmarkInfo` aggregation. Which control fills that slot?
- **UI5 API doc for `sap.m.PageAccessibleLandmarkInfo`** — <https://sdk.openui5.org/api/sap.m.PageAccessibleLandmarkInfo>. Note the `contentRole`, `contentLabel`, `headerRole`, `headerLabel`, `subHeaderRole`, `subHeaderLabel` properties. Which combination gives you a `<main>`, a `<banner>`, *and* a `<nav>` around the breadcrumbs?
- **UI5 API doc for `sap.m.Panel`** — <https://sdk.openui5.org/api/sap.m.Panel>. Look at the `accessibleRole` property. What values does the `sap.m.PanelAccessibleRole` enum accept, and which one produces `<aside>` (complementary) semantics vs. a labelled generic region?
- **WCAG 2.4.1 Bypass Blocks** — <https://www.w3.org/WAI/WCAG22/Understanding/bypass-blocks.html>. Why does the rotor / landmark navigation matter for keyboard-only users too, not just screen-reader users?
- **ARIA Landmarks role reference** — <https://www.w3.org/WAI/ARIA/apg/practices/landmark-regions/>. Which role applies to a breadcrumb trail?

## Verify the fix

Re-run axe (**Scan ALL of my page**). Both violations should be gone:

- ✅ *"Page should contain a level-one landmark"*
- ✅ *"All page content should be contained by landmarks"*

Then inspect the DOM in the Elements panel. You should see roughly this shape:

```html
<header role="banner" aria-label="…">
    <!-- customHeader Bar -->
</header>
<nav role="navigation" aria-label="Categories">
    <!-- subHeader Bar with the Breadcrumbs -->
</nav>
<main role="main" aria-label="…">
    <aside role="complementary" aria-labelledby="…--idFilterPanel-header">
        <!-- Filters panel -->
    </aside>
    <section role="region" aria-labelledby="…--idProductRegion-header">
        <!-- Product catalog panel -->
    </section>
</main>
```

Four landmarks, all labelled: `banner`, `navigation`, `main`, and `complementary` + `region`. A screen-reader user pressing `D` (NVDA) or `Ctrl+Opt+U → Landmarks` (VoiceOver) can now jump directly between the header, the category breadcrumbs, the filter sidebar, and the product catalog.

## Common mistakes to avoid

Landmarks are easy to *add* and easy to *misuse*. A few anti-patterns you'll see in real Fiori code:

| Anti-pattern | Why it's wrong |
| --- | --- |
| Marking the header as `contentRole="Main"` | The banner and the main content are two different regions. Screen readers will announce the wrong one. |
| Two Panels both with `accessibleRole="Complementary"` and no distinguishing `headerText` | The rotor announces *"complementary… complementary…"* with no way to tell them apart. Always label. |
| Setting `role="main"` on a `<div>` via `sap.ui.core.CustomData writeToDom="true"` | UI5 owns the ARIA layer — use `PageAccessibleLandmarkInfo`. Manual overrides break when the control re-renders. |
| Multiple `Banner` or `ContentInfo` landmarks on one page | HTML spec allows only one of each at the top level. Two banners = axe violation. |
| `<nav>` without a label when there's more than one on the page | Rotor announces *"navigation… navigation…"*. If you have breadcrumbs *and* a main menu, label both. |

## Takeaway

`sap.m.Page` gives you `<main>`, `<banner>`, and `<nav>` **only if you ask for them** via `<landmarkInfo><PageAccessibleLandmarkInfo …/></landmarkInfo>`. Silently, most UI5 pages ship without any of those, and every content region gets a generic role. **Landmark information is a first-class part of a Fiori page's a11y layer — treat it like you treat headings and labels.**

Two rules of thumb:

1. **Every full-page view needs at least a `main` landmark.** Add it via `PageAccessibleLandmarkInfo` (or, for detail pages inside a `sap.m.FlexibleColumnLayout`, on the innermost page).
2. **Every landmark needs a label** if you have more than one of its kind. Two unlabelled `Region`s (or two `<nav>`s) is worse for screen-reader users than one unlabelled `Region`, because the user now hears "region… region…" and has no way to pick.

---

[← Previous: Exercise 4 — Dialog accessibility](04-fix-dialog.md) · [Back to README](../README.md) · [Next: Exercise 6 — UI5 accessibility skill →](06-claude-a11y-skill.md)
