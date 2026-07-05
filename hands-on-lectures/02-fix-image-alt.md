# Exercise 2 — Fix image alt text

> ⏱ **Duration:** ~5 minutes
> 🛠 **You'll edit:** `webapp/view/Main.view.xml`
> 🤖 **Claude needed?** No — this is a research-and-fix exercise.

## What you'll learn

How `sap.m.Image`'s `decorative` and `alt` properties together control whether an image is exposed to assistive technology — and what to set them to for a *content* image like a product photo.

## See the issue with axe DevTools

1. **Open the app** at <http://localhost:8080/index.html>.
2. **Open DevTools** (F12) and switch to the **axe DevTools** tab.
3. Click **Scan ALL of my page**.

You should see an issue flagged that looks roughly like this:

> **Images must have alternate text**
> *Element location:* `<img src="…/thinkpad/400/280" …>`
> *Issue description:* Element does not have an `alt` attribute and is not marked as decorative.

axe flags every product image on the page.

Try it with a screen reader if you have one to hand — VoiceOver will announce something like *"image, thinkpad slash 400 slash 280"*, reading the src URL character by character. Useless.

## The problem

Open `webapp/view/Main.view.xml` and find the product-card image (search for the GAP comment *"Exercise 2 (image alt text)"*):

```xml
<Image
    src="{catalog>image}"
    decorative="false"
    densityAware="false"
    width="100%"
    height="180px"
    class="sapUiTinyMarginBottom" />
```

Two things to notice:

1. `decorative="false"` is set explicitly. That tells UI5: *this image is meaningful, expose it to assistive technology.*
2. `alt` is **not** set.

That combination — "expose to AT, but I haven't given you a name" — is the worst of both worlds. The image lands in the accessibility tree with no accessible name, and screen readers fall back to reading the `src`.

## Research prompts

- **UI5 API doc for `sap.m.Image`** — <https://sdk.openui5.org/api/sap.m.Image>. Look at both the `alt` property and the `decorative` property. What does UI5 render in the DOM for each combination?
- **WCAG 1.1.1 Non-text Content** — <https://www.w3.org/WAI/WCAG22/Understanding/non-text-content.html>. What distinguishes a *decorative* image from a *content* image? Which one is a product photo?
- **The W3C alt decision tree** — <https://www.w3.org/WAI/tutorials/images/decision-tree/>. Walk through it with a product photo in mind.

Then decide: what should `alt` be, and how do you plug the product name in per row?

## Verify the fix

Re-run axe. The *"Images must have alternate text"* violations should be gone.

Inspect one of the product images in DevTools — the `<img>` should now have a real `alt` attribute containing the product name, e.g.:

```html
<img alt="ThinkPad X1 Carbon Gen 11 Ultra-Light Business Laptop" src="…/thinkpad/400/280" />
```

## Takeaway

`sap.m.Image` has three states; pick deliberately:

| Goal | `decorative` | `alt` |
| --- | --- | --- |
| **Decoration** (icons inside a labelled control, separators) | `true` (default) | leave empty — image is hidden from AT |
| **Meaningful but already labelled** (e.g. an icon next to a Label that says the same thing) | `false` | leave empty + use `aria-labelledby` |
| **Content image** (this exercise — product photos) | `false` | a short, descriptive string, usually a binding |

The bug pattern here — `decorative="false"` *with* no `alt` — is the worst of all worlds. Watch for it any time you see `decorative="false"` without a paired `alt` in a code review.

---

[← Previous: Exercise 1 — Heading hierarchy](01-fix-headings.md) · [Back to README](../README.md) · [Next: Exercise 3 — Labeling →](03-fix-labeling.md)
