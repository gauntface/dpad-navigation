# Static HTML demo

A four-screen "10-foot UI" demo — `SpatialExplorer`, a fictional streaming
app — built with plain HTML/CSS/JS and wired up to the real
`DpadController` / `DebugController` from this library (no framework, no
build step).

- `index.html` — home page with a hero and two horizontal shelves
- `grid.html` — "Navigation Lab", an irregular 5-column grid (wide/tall/
  spanning nodes) designed to stress-test the spatial nearest-neighbor logic
- `lists.html` — a vertical categories list next to a vertical content list
- `settings.html` — form controls (buttons, a switch, checkboxes) including
  a "Show Focus Vectors" checkbox that toggles the library's own debug
  overlay (`DebugController`)

## Running it

Any static file server works, e.g. from this directory:

```sh
npx serve .
```

Then open the printed URL and navigate with arrow keys (or an actual D-pad
input device).

## How it's wired

`lib/dpad-controller.js` and `lib/debug-controller.js` are vendored copies
of this repo's own `build/browser/*.js` output (see the root `README.md`'s
"Using the library via CDN" section for the supported way to load them from
a CDN once published — self-hosting like this is the alternative it
documents). Regenerate them after making library changes with:

```sh
npm run build --prefix ../.. && cp ../../build/browser/{dpad-controller,debug-controller}.js lib/
```

`lib/app.js` is demo glue, not part of the library: it instantiates
`DpadController`/`DebugController` once per page, sets initial focus on the
element marked `data-dpad-initial-focus`, and drives the debug HUD panel in
the corner. Every actual focus-navigation behavior — which element is "up",
"down", "left", "right" of the current one — comes from the library itself,
as does Enter/Space activating whatever's currently focused (see [#67](https://github.com/gauntface/dpad-navigation/pull/67), which restored that after it regressed during the TypeScript rewrite).
