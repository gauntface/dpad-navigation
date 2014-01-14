D-Pad Navigation Library
=========

![alt text](http://i.imgur.com/1LcHG7j.png "D-Pad Navigation Library Demo Image")

This library is designed to make it quick a simple to support D-Pad Navigation in a web app.

Usage
-----

To support D-Pad navigation with this library, you need to do the following:

  - Download the library’s javascript file from here: https://raw.github.com/gauntface/dpad-navigation/master/build/dpad-nav-lib.min.js
  - Import the javascript file into your page:
```html
<script src="./scripts/dpad-nav-lib.min.js" />
```
  - Add a tabindex and class name dpad-focusable for any element you want to be     focusable.
    For Example:
```html
<div class="grid-item dpad-focusable" tabindex="0">
        <img class="thumb" src="./images/thumbs/thumb01.jpg" />
        <div class="title">Item 1</div>
</div>
```

  - Apply styling in your css for the focus pseudo class.
```css  
.grid-item:focus {
        outline: none;
        background-color: rgb(149, 165, 166);
} 
```

  - Apply styling for when the user clicks on a focused element via the clickdown class.
```css  
.grid-item.clickdown {
        background-color: rgb(189, 195, 199);
}
```

You should now be supporting D-Pad navigation.

Events
------

This library will trigger a normal focus and click event.

```js
element.addEventListener('focus', function(e) {
        console.log('Element Focused');
}, true);

element.addEventListener('click', function() {
        console.log('Element Clicked');
}, true);
```

Adding and Removing DOM Elements
--------------------------------

The way the library works is that on page load or page resize, it will calculate the graph of where each nodes closest neighbours are, based purely on each elements position in the viewport.

What the library does not do, is recalculate the graph if you add or remove elements. To support this, you need to update the elements in the graph and their connections, which is done by calling:

```js
window.dpadFocusController.reset();
```

Tabindex and Browser Focus
---------------------------

With the tabindex property you can determine the order in which a view is focused when you hit the tab key. The ordering is ignored by this library, tabindex is needed to ensure the browser allows an element to gain focus, however the order will still be applied if you hit tab on the keyboard.

Debugging
---------

There is a debug option to display lines which indicate the link between each node.

```js
window.dpadFocusController.toggleDebugMode();
```

![alt text](http://i.imgur.com/7PT6tAa.png "D-Pad Navigation Library Demo Debug Mode Image")

