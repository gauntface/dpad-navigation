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

`DpadController`'s Enter/Space handling calls `preventDefault()` and routes
to `FocusableItem#onItemClickStateChange`, which is a no-op unless you
supply a custom `FocusableItem`. That means a focused `<button>` does *not*
activate on Enter the way native browser focus normally would — the library
only manages *movement*, not *activation*. `useDpadLifecycle` restores the
expected behavior generically: on Enter/Space keyup, if
`document.activeElement` is `.dpad-focusable`, it gets `.click()`'d. Real
apps using this library will want the same bridge (or a `FocusableItem`
subclass wired to their own activation semantics).
