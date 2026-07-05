# Exercise 7 — Add a keyboard shortcut to order the focused card

> 🚧 **TBD — may be cut.** Two reasons: (1) the `ui5-accessibility` skill in Exercise 6 doesn't address keyboard shortcuts — it's a *missing-affordance* problem rather than a missing-ARIA one, so it doesn't fit the "skill sweep" demo. (2) It's unclear whether wiring a custom keyboard shortcut is the right scope for a hands-on workshop at all — it leans more into general UX/keyboard-power-user territory than into the UI5 a11y patterns the rest of the workshop teaches.

> ⏱ **Duration:** ~10 minutes
> 🛠 **You'll edit:** `webapp/controller/Main.controller.ts` and `webapp/view/Main.view.xml`
> 🤖 **Claude needed?** No — this is a research-and-implement exercise.

## What you'll learn

How to register a keyboard shortcut that does the same thing as a button click, why power-keyboard users expect this in dense list / grid UIs, and how to advertise the shortcut visually so sighted keyboard users can discover it.

## The problem

This isn't a missing-ARIA defect; it's a *missing affordance* one. The app has dozens of *Order Now* buttons, one per product card. A keyboard user has to:

1. Tab into the catalog area.
2. Tab through the wishlist / share / Order Now buttons of every card to reach the one they want.
3. Press *Enter* on the right *Order Now* button.

That's a lot of tabs to order any product past the first few.

A power user would expect: *focus a card → press **Alt + O** → that card's order dialog opens.* Today there's no such shortcut.

## The goal

Add an `Alt+O` shortcut that:

1. Finds the currently focused product card (walk up from `document.activeElement` — the *Order Now* buttons have `productId` written to the DOM via `core:CustomData writeToDom="true"`; look for it).
2. Opens the order dialog for that product.

Plus update the *Order Now* button's `tooltip` so sighted keyboard users can *see* the shortcut exists.

Look for the `GAP — Exercise 7 (keyboard shortcut)` comment in `onInit` — it lists two valid registration approaches (plain DOM `keydown` vs. UI5's `sap/ui/core/Shortcut`). Pick one.

## Research prompts

- **UI5 API doc for `sap.ui.core.Shortcut`** — <https://sdk.openui5.org/api/sap.ui.core.Shortcut>. Note the `register(oScope, sShortcut, fnHandler)` signature. What's the advantage of scoping to a view vs. a global `document.addEventListener`?
- **MDN — KeyboardEvent.key** — <https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key>. Why should you never use `keypress` or `event.which`?
- **WCAG 2.1.1 Keyboard** — <https://www.w3.org/WAI/WCAG22/Understanding/keyboard.html>. Note that shortcuts are a *supplement* to keyboard-reachable buttons, not a replacement.
- **WCAG 2.1.4 Character Key Shortcuts** — <https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html>. Why is *bare-letter* (unmodified) shortcut assignment risky, and how does adding `Alt` avoid the problem?

## Verify the fix

1. Tab into the catalog. Focus lands on a wishlist / share / Order Now button inside the first card.
2. With focus anywhere inside a card, press **Alt + O**.
3. The order dialog opens for that product.
4. Hover the *Order Now* button — the tooltip now reads something like *"Order this product (Alt+O)"*.

## Things to be careful about

- **`preventDefault` matters.** Without it, your shortcut competes with the browser's own `Alt+letter` shortcuts (e.g. Firefox's *Open new tab* on some platforms).
- **Don't use `keypress`.** It's deprecated and doesn't fire for `Alt` combos in most browsers. Always `keydown`.
- **Always advertise the shortcut.** Hidden shortcuts are an a11y *anti-pattern* — they help keyboard pros at the expense of everyone else. A tooltip showing *"(Alt+O)"* is the minimum; a help dialog or `?` overlay is even better for apps with several shortcuts.
- **Avoid `Ctrl+letter` / `Cmd+letter` shortcuts that clash with the browser/OS.** `Alt + letter` and bare letters (with focus management) are the safest custom-shortcut space.
- **Clean up on exit.** If you attach a global `document`-level listener, remove it in the controller's `onExit` — otherwise it survives navigations and leaks.

## Takeaway

A keyboard shortcut is a *performance optimisation* for keyboard users. It does not replace the underlying tab-reachable button — it sits *alongside* it. The same product action needs to be reachable two ways:

1. The slow path: tab to the *Order Now* button → Enter.
2. The fast path: focus the card → Alt+O.

Both must work; both must be discoverable.

---

[← Previous: Exercise 6 — UI5 accessibility skill](06-claude-a11y-skill.md) · [Back to README](../README.md)
