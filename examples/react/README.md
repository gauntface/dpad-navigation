# React demo

The same four-screen `SpatialExplorer` demo as `examples/static-html` and
`examples/svelte`, this time as a React 19 + Vite + TypeScript SPA
(hash-routed, no router dependency, CSS Modules for per-page styles),
consuming `@gauntface/dpad-nav` as a real npm dependency (`file:../..`).

## Running it

```sh
npm install
npm run dev      # dev server
npm run build    # tsc -b && vite build, output to dist/
```

## How it's wired

`src/lib/dpad.ts` creates a single `DpadController`/`DebugController` pair
for the app's lifetime and exposes:

- `refreshDpad()` / `focusInitial()` — called from `useDpadLifecycle(route)`
  in a `useLayoutEffect` after every route change, once React has committed
  the new page's DOM
- `useDebugOn()` / `useFocusedNode()` — tiny external stores (subscribed via
  `useSyncExternalStore`) that `TopBar`, `Grid`, `Settings` and `DebugHud`
  read from; `toggleDebug()` is the one place that should ever flip debug
  mode, so every consumer (the top bar's bug icon *and* the settings page's
  "Show Focus Vectors" button) stays in sync

### A note on keyboard activation

Enter/Space activating whatever's focused is handled by the library itself
([#67](https://github.com/gauntface/dpad-navigation/pull/67)) — this demo
used to bridge it manually in `useDpadLifecycle` because that behavior had
regressed during the library's TypeScript rewrite, but that workaround is
no longer needed (and would double-fire clicks if kept alongside the
library's own fix). If you need different press/release semantics, subclass
`FocusableItem` and override `onItemClickStateChange`.
