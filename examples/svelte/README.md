# Svelte demo

The same four-screen `SpatialExplorer` demo as `examples/static-html`, this
time as a Svelte 5 + Vite + TypeScript SPA (hash-routed, no router
dependency), consuming `@gauntface/dpad-nav` as a real npm dependency
(`file:../..`, i.e. this repo itself) instead of vendored script tags.

## Running it

```sh
npm install
npm run dev      # dev server
npm run build    # production build to dist/
npm run check    # svelte-check (TS + a11y lint)
```

## How it's wired

`src/lib/dpad.ts` creates a single `DpadController`/`DebugController` pair
for the app's lifetime and exposes:

- `refreshDpad()` — call after any DOM change that adds/removes
  `.dpad-focusable` elements (the root `App.svelte` calls this after every
  route change, once Svelte has finished patching the DOM)
- `focusInitial()` — focuses whichever element on the new page is marked
  `data-dpad-initial-focus`
- `debugOn` / `toggleDebug()` — a store wrapping `DebugController`'s debug
  overlay
- `focusedNode` — a store updated on every focus event, driving the debug
  HUD panel (demo glue, not part of the library)

### A note on keyboard activation

`DpadController`'s Enter/Space handling calls `preventDefault()` and routes
to `FocusableItem#onItemClickStateChange`, which is a no-op unless you
supply a custom `FocusableItem`. That means a focused `<button>` does *not*
activate on Enter the way native browser focus normally would — the library
only manages *movement*, not *activation*. `dpad.ts` restores the expected
behavior generically: on Enter/Space keyup, if `document.activeElement` is
`.dpad-focusable`, it gets `.click()`'d. Real apps using this library will
want the same bridge (or a `FocusableItem` subclass wired to their own
activation semantics).
