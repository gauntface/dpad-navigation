# D-Pad Navigation Library

![alt text](http://i.imgur.com/1LcHG7j.png "D-Pad Navigation Library Demo Image")

This library makes it quick and easy to support D-Pad Navigation in a web app.

## Details

This library is broken up into two parts, the **library** itself and some **helpers**.

The **library** contains the logic for the dpad navigation and debugging.

The **helpers** are lightweight wrappers that can be dropped into a web page and provide
the common logic / make it east to add d-pad navigation with little to no Javascript
needing to be written. Add these JavaScript files to your HTML page, and away you go.

The helpers are the easiest way to try out this library, but may not be appropriate if:

1. You have a build process, and you'd like to make this library a part of it
1. Your web app is a single-page app, and you need this library to follow it's lifecycle.

The sections below will cover these options as necessary.

## Usage

To support D-Pad navigation with this library, you need to do the following:

  - Add a `tabindex` and `class="dpad-focusable"` for any element you want to be focusable
    via the d-pad.
    For Example:

```html
<div class="dpad-focusable" tabindex="0">Example</div>
```

  - Apply styling in your css for the focus pseudo class.
```css  
.grid-item:focus {
        outline: none;
        background-color: rgb(149, 165, 166);
} 
```

With this alone, you should be able to use the "tab" key to test the styles
and navigation of your site without this library.

With this, you're ready to add the D-Pad navigation library.

## Using the Helpers

With the HTML setup, you can use the helper library by adding the following to your
HTML pages:

```html
<script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/helper/helper/dpad.js" async defer></script>
<script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/helper/helper/dpad-debugger.js" async defer></script>
```

These scripts will add listeners to apply the dpad library to your pages and the `dpad-debugger.js` will
give your debug UI so you can see what the navigation will be and remove it once everything is working
as you'd expect.

You can interact with the library via `window.dpad` and `window.dpaddebug` which are instances of
a `DpadController` and `DebugController`, which are discussing in the "Library API" section below.

### Using the helpers via NPM

If you want to use the helper files but prefer to self-host the files, you can get them from npm via:

```shell
npm install @gauntface/dpad-nav --save-dev
cp ./node_modules/@gauntface/dpad-nav/build/helper/*.js ./src/third_party/dpad-nav/
```

## Using the library

If you want to use the library directly and avoid the helpers, you can take one of the following options:

### Using the library via CDN

Use a CDN hosted copy of the library:

```html
<script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/browser/dpad-controller.js" async defer></script>
<script src="https://unpkg.com/@gauntface/dpad-nav@3.0.1/build/browser/debug-controller.js" async defer></script>
```

The libraries will be accesible via `window.gauntface.dpad.DpadController` and `window.gauntface.dpad.DebugController`;

### Using the library via NPM

If you use NPM to manage your JavaScript dependencies, you can install and use this
library as an npm module:

```shell
npm install @gauntface/dpad-nav --save-dev
```

Then include the scripts like so:

```javascript
const {DpadController, DebugController} = require('@gauntface/dpad-nav');
```

## Library API

Typical usage of the library API would look like so:

```javascript
// Create a new dpad controller
const dpad = new DpadController();
// Call update to get the focusable items in the DOM
dpad.update();

// To enable debugging, create debug controller
const debug = new DebugController(dpad);
// Turn on debugging
debug.setDebugMode(true);
```

If your DOM changes, you can call `<DpadController>.update()` and 
`<DebugController>.updateDisplay()` to force the controllers to handle
the changes.

## Events

This library will trigger normal focus and click events for your focusable
elemens, so adding event listeners can be useful if you want to listen for
events:

```js
element.addEventListener('focus', function(e) {
        console.log('Element Focused');
});

element.addEventListener('click', function() {
        console.log('Element Clicked');
});
```

## Tabindex and Browser Focus

With the tabindex property, you can determine the order of which view is focused when the user presses the tab key. This library ignores the tabindex order but requires it to ensure the browser allows an element to gain focus.

## Debugging

If you add the debug library to your web page you can toggle debug mode like so:

```js
window.dpaddebug.toggleDebugMode();
```

![alt text](http://i.imgur.com/7PT6tAa.png "D-Pad Navigation Library Demo Debug Mode Image")

