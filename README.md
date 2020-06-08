# D-Pad Navigation Library

![alt text](http://i.imgur.com/1LcHG7j.png "D-Pad Navigation Library Demo Image")

This library makes it quick and easy to support D-Pad Navigation in a web app.

## Install

```shell
npm install @gauntface/dpad-nav --save-dev
```

Alternatively, you can use a CDN to import one of the following:

**DPad Helper & (Optional) Debugger Helper**

```html
<script src="https://unpkg.com/@gauntface/dpad-nav@2.0.1/build/cdn/bootstrap/dpad.js" async defer></script>
<script src="https://unpkg.com/@gauntface/dpad-nav@2.0.1/build/cdn/bootstrap/dpad-debugger.js" async defer></script>
```

**DPad Library & (Optional) Debugger Library**

```html
<script src="https://unpkg.com/@gauntface/dpad-nav@2.0.1/build/cdn/lib/dpad-controller.js" async defer></script>
<script src="https://unpkg.com/@gauntface/dpad-nav@2.0.1/build/cdn/lib/debug-controller.js" async defer></script>
```


## Usage

To support D-Pad navigation with this library, you need to do the following:

  - Add a `tabindex` and `class="dpad-focusable"` for any element you want to be focusable.
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

With this, you're ready to support D-Pad navigation.

## Events

This library will trigger a regular focus and click event.

```js
element.addEventListener('focus', function(e) {
        console.log('Element Focused');
});

element.addEventListener('click', function() {
        console.log('Element Clicked');
});
```

## Adding and Removing DOM Elements

The library works is that on page load or page resize, it will calculate the graph of where each node's closest neighbors are, based purely on each element's position in the viewport.

What the library does not do, is recalculate the graph if you add or remove elements. To update the graph when elements are added or removed from the DOM call `update()` like so:

```js
window.dpad.update();
```

## Tabindex and Browser Focus

With the tabindex property, you can determine the order of which view is focused when the user presses the tab key. This library ignores the tabindex order but requires it to ensure the browser allows an element to gain focus.

## Debugging

If you add the debug library to your web page you can toggle debug mode like so:

```js
window.dpaddebug.toggleDebugMode();
```

![alt text](http://i.imgur.com/7PT6tAa.png "D-Pad Navigation Library Demo Debug Mode Image")

