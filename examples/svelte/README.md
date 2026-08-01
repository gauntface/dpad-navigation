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

Enter/Space activating whatever's focused is handled by the library itself
([#67](https://github.com/gauntface/dpad-navigation/pull/67)) — this demo
used to bridge it manually here in `dpad.ts` because that behavior had
regressed during the library's TypeScript rewrite, but that workaround is
no longer needed (and would double-fire clicks if kept alongside the
library's own fix). If you need different press/release semantics, subclass
`FocusableItem` and override `onItemClickStateChange`.
