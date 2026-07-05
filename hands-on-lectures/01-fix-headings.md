# Exercise 1 — Fix heading hierarchy

> ⏱ **Duration:** ~8 minutes
> 🛠 **You'll edit:** `webapp/view/Main.view.xml`
> 🔍 **Main tool:** the **HeadingsMap** browser extension
> 🤖 **Claude needed?** No — this is a research-and-fix exercise.

## What you'll learn

How to read a page's heading outline with **HeadingsMap**, how `sap.m.Title` resolves its heading level when you don't set one, why every page needs exactly one `<h1>`, and how to nest section headings correctly inside a `Panel`.

> [!NOTE]
> This exercise — and every one after it — assumes the UI5 dev server is already running at <http://localhost:8080/index.html>. If you haven't started it yet, do [**Start the app**](start-the-app.md) first (≈2 min), then come back here.

## See the issue with HeadingsMap

Headings are the *outline* of a page — screen-reader users navigate a page by jumping between them (press `H` in NVDA, or open the rotor in VoiceOver). If the outline is broken, that whole navigation mode is broken. **HeadingsMap** is the fastest way to *see* the outline: it renders every `<h1>`–`<h6>` in a side panel, with indentation showing nesting, and flags problems in red.

1. **Open the app** at <http://localhost:8080/index.html>.
2. Click the **HeadingsMap** extension icon in your browser toolbar. A side panel opens showing the page's heading tree.

You'll see something like this — with HeadingsMap marking problems in red:

```
🔴 (no H1 found on this page)
H2 — IT Equipment Catalog     ← the app title. Should be H1.
H2 — Filters                  ← Panel header
H2 — Brand                    ← should nest under Filters (H3)
H2 — Price Range              ← same
H2 — Availability             ← same
H2 — Product catalog          ← Panel header
H2 — <product name>           ← should nest under Product catalog (H3)
H2 — <product name>           ← same
…
```

HeadingsMap is telling you two things at once:

1. **There is no `<h1>` anywhere.** The extension shows a red warning at the top — most heading-outline validators treat "no `<h1>`" as a first-order defect.
2. **Everything else is `<h2>`.** No `<h3>`, no nesting. The app title, the two section-panel headers, and the section subheadings *inside* those panels all sit at the same level. Sighted users can't tell that from CSS alone — the visual sizing differs — but the *DOM* outline is flat.

A screen-reader user pressing `H` gets a big undifferentiated list of `<h2>`s and can't tell which is the page title, which are section headers, and which are items inside a section.

## The problem

Open `webapp/view/Main.view.xml`. Three GAP comments call out the heading defects:

- **Part A (missing `<h1>`)** — near the top of the file, inside the `customHeader`. The `<Title id="idAppTitle" text="IT Equipment Catalog" />` used to declare `level="H1"`. That property is gone.
- **Part B (flat outline in the filter sidebar)** — inside the filter Panel, above `<Title text="Brand" />` and its siblings.
- **Part B (flat outline in the product cards)** — inside the product-card template, above the product-name `<Title text="{catalog>name}" …>`.

All three are the same defect with the same cause. Read on before you touch anything.

`sap.m.Title` has a `level` property. When you don't set it, it defaults to `Auto`, which UI5 resolves to `<h2>`. So *every* Title you write without `level` becomes an `<h2>` — regardless of whether it's the app title, a section header, or a card subtitle. That's what's flattened this outline: five Title controls in a row, all falling back to `<h2>`, with no explicit level to tell UI5 how they should nest.

## Research prompts

Rather than paste a fix, work out the right one yourself. Start here:

- **UI5 API doc for `sap.m.Title`** — <https://sdk.openui5.org/api/sap.m.Title>. Look at the `level` property.
- **UI5 API doc for `sap.m.Panel`** — <https://sdk.openui5.org/api/sap.m.Panel>. What level does `headerText` render at, and can you change it?
- **WCAG 1.3.1 Info and Relationships** — <https://www.w3.org/WAI/WCAG22/Understanding/info-and-relationships.html>. Why does the outline matter for screen-reader users, not just visual sighted users?
- **MDN — Heading levels** — <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Heading_Elements#usage_notes>. Why should a page have exactly one `<h1>`?

Work out three things:

1. Which `Title` becomes the page's single `<h1>`?
2. What levels do the two Panel headers (*Filters*, *Product catalog*) need?
3. What levels do the sub-section titles (*Brand*, *Price Range*, *Availability*, and each product-card title) need to sit under those panels?

While you're at it, look at the product-card `<Title text="{catalog>name}" …>` — there's a second defect there beyond the missing level: `wrapping` is unset (defaults to `false`), so long product names get clipped by CSS ellipsis with no tooltip fallback. What's the two-property fix?

**Tip:** keep HeadingsMap open in a side panel while you edit. Every time you save and the UI5 dev server hot-reloads, the outline re-renders — you'll see the tree grow into shape one Title at a time. It's the tightest possible feedback loop for this kind of fix.

## Verify the fix

Re-open **HeadingsMap**. The red *"no H1"* warning should be gone, and the outline should now look correctly nested, with exactly one `<h1>` at the top:

```
H1 — IT Equipment Catalog
├─ H2 — Filters
│  ├─ H3 — Brand
│  ├─ H3 — Price Range
│  └─ H3 — Availability
└─ H2 — Product catalog
   ├─ H3 — <product name>
   ├─ H3 — <product name>
   └─ …
```

If HeadingsMap shows any level jumps (`H1` → `H3`, or two `H2`s stacked where you meant a parent/child), fix those before moving on — the outline needs to be *strictly* increasing.

## Takeaway

`sap.m.Title` defaults to `level="Auto"` (which UI5 currently resolves to `<h2>`). That default is fine for **exactly zero** of the Title controls in this app — every one of them needs an explicit `level` if you want a proper outline. **Always set `level` explicitly** whenever a Title's role in the outline matters — which is basically always, unless it's a decorative eyebrow or subtitle.

Two rules of thumb:

1. **Exactly one `<h1>` per page.** Usually the app / view title. Everything else nests under it.
2. **If you can't draw the heading outline on a napkin, users can't navigate it either.** HeadingsMap is the napkin — keep it open while you refactor.

---

[← Previous: Start the app](start-the-app.md) · [Back to README](../README.md) · [Next: Exercise 2 — Image alt text →](02-fix-image-alt.md)
