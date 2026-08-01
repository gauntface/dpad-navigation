var __dpadBundleExports = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/lib/dpad-controller.ts
  var dpad_controller_exports = {};
  __export(dpad_controller_exports, {
    DpadController: () => DpadController
  });

  // src/lib/_focusable-item.ts
  var FocusableItem = class {
    constructor(ele) {
      this.focusState = false;
      this.element = ele;
      this.resetNeighbors();
    }
    getElement() {
      return this.element;
    }
    focus() {
      this.element.focus();
    }
    resetNeighbors() {
      this.neighbors = {
        top: null,
        bottom: null,
        left: null,
        right: null
      };
    }
    setTopFocusItemIndex(index) {
      this.neighbors.top = index;
    }
    getTopFocusItemIndex() {
      return this.neighbors.top;
    }
    setBottomFocusItemIndex(index) {
      this.neighbors.bottom = index;
    }
    getBottomFocusItemIndex() {
      return this.neighbors.bottom;
    }
    setLeftFocusItemIndex(index) {
      this.neighbors.left = index;
    }
    getLeftFocusItemIndex() {
      return this.neighbors.left;
    }
    setRightFocusItemIndex(index) {
      this.neighbors.right = index;
    }
    getRightFocusItemIndex() {
      return this.neighbors.right;
    }
    isFocusable() {
      if (this.element.style.display === "none" || this.element.style.visibility === "hidden") {
        return false;
      }
      let tabIndexAttr = this.element.getAttribute("tabindex");
      if (!tabIndexAttr) {
        return false;
      }
      try {
        const tabIndex = parseInt(tabIndexAttr, 10);
        return tabIndex > -1;
      } catch (err) {
      }
      return false;
    }
    getMetrics() {
      var clientRect = this.element.getBoundingClientRect();
      return {
        width: clientRect.width,
        height: clientRect.height,
        left: clientRect.left,
        right: clientRect.left + clientRect.width,
        top: clientRect.top,
        bottom: clientRect.top + clientRect.height,
        center: {
          x: clientRect.left + clientRect.width / 2,
          y: clientRect.top + clientRect.height / 2
        }
      };
    }
    onItemClickStateChange(isDown) {
      if (!isDown) {
        this.element.click();
      }
    }
  };

  // src/lib/_calc-distance.ts
  function calcDistance(x, y) {
    return Math.floor(Math.sqrt(x * x + y * y));
  }

  // src/lib/dpad-controller.ts
  var FOCUSABLE_ITEM_SELECTOR = ".dpad-focusable";
  var DpadController = class {
    constructor() {
      this.focusableItems = [];
      this.currentlyFocusedItem = null;
      this.enabled = false;
      this.getRightDistance = function(fromMetrics, toMetrics) {
        return this.horizontalDistance(fromMetrics, toMetrics, fromMetrics, toMetrics);
      };
      this.focusableItems = [];
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      this.enable();
    }
    disable() {
      if (!this.enabled) {
        return;
      }
      document.removeEventListener("keydown", this.onKeyDown);
      document.removeEventListener("keyup", this.onKeyUp);
      this.enabled = false;
    }
    enable() {
      if (this.enabled) {
        return;
      }
      document.addEventListener("keydown", this.onKeyDown);
      document.addEventListener("keyup", this.onKeyUp);
      this.enabled = true;
    }
    findFocusableItems() {
      const focusableItems = document.querySelectorAll(FOCUSABLE_ITEM_SELECTOR);
      for (const fi of focusableItems) {
        this.addFocusableItem(new FocusableItem(fi));
      }
    }
    addFocusableItem(i) {
      this.focusableItems.push(i);
    }
    getFocusableItems() {
      return this.focusableItems;
    }
    getFocusableItem(index) {
      if (index >= this.focusableItems.length || index < 0) {
        return null;
      }
      return this.focusableItems[index];
    }
    setCurrentFocusItem(i) {
      const fi = this.getFocusableItem(i);
      this.currentlyFocusedItem = fi;
      if (!this.currentlyFocusedItem) {
        return;
      }
      this.currentlyFocusedItem.focus();
    }
    update() {
      this.focusableItems = [];
      this.findFocusableItems();
      const previouslyFocusedItem = this.currentlyFocusedItem;
      this.currentlyFocusedItem = null;
      for (const fi of this.focusableItems) {
        if (!fi.isFocusable()) {
          continue;
        }
        if (previouslyFocusedItem && fi.getElement() == previouslyFocusedItem.getElement()) {
          this.currentlyFocusedItem = fi;
        }
        this.updateNeighbors(fi);
      }
    }
    moveFocus(direction) {
      if (!this.currentlyFocusedItem) {
        if (this.focusableItems.length > 0) {
          this.setCurrentFocusItem(0);
        }
        return;
      }
      var nextItemIndex = null;
      if (direction.y === 0) {
        if (direction.x > 0) {
          nextItemIndex = this.currentlyFocusedItem.getRightFocusItemIndex();
        } else {
          nextItemIndex = this.currentlyFocusedItem.getLeftFocusItemIndex();
        }
      } else if (direction.x === 0) {
        if (direction.y > 0) {
          nextItemIndex = this.currentlyFocusedItem.getTopFocusItemIndex();
        } else {
          nextItemIndex = this.currentlyFocusedItem.getBottomFocusItemIndex();
        }
      }
      if (nextItemIndex !== null) {
        this.setCurrentFocusItem(nextItemIndex);
      }
    }
    updateNeighbors(fi) {
      const metrics = fi.getMetrics();
      const itemCount = this.focusableItems.length;
      let minTopElementDist;
      let minBottomElementDist;
      let minLeftElementDist;
      let minRightElementDist;
      for (var i = 0; i < itemCount; i++) {
        var newItem = this.getFocusableItem(i);
        if (!newItem.isFocusable() || newItem === fi) {
          continue;
        }
        const newItemMetrics = newItem.getMetrics();
        const distanceTop = this.getTopDistance(metrics, newItemMetrics);
        const distanceBottom = this.getBottomDistance(metrics, newItemMetrics);
        const distanceLeft = this.getLeftDistance(metrics, newItemMetrics);
        const distanceRight = this.getRightDistance(metrics, newItemMetrics);
        if (distanceTop !== null && (typeof minTopElementDist === "undefined" || minTopElementDist > distanceTop)) {
          minTopElementDist = distanceTop;
          fi.setTopFocusItemIndex(i);
        }
        if (distanceBottom !== null && (typeof minBottomElementDist === "undefined" || minBottomElementDist > distanceBottom)) {
          minBottomElementDist = distanceBottom;
          fi.setBottomFocusItemIndex(i);
        }
        if (distanceLeft !== null && (typeof minLeftElementDist === "undefined" || minLeftElementDist > distanceLeft)) {
          minLeftElementDist = distanceLeft;
          fi.setLeftFocusItemIndex(i);
        }
        if (distanceRight !== null && (typeof minRightElementDist === "undefined" || minRightElementDist > distanceRight)) {
          minRightElementDist = distanceRight;
          fi.setRightFocusItemIndex(i);
        }
      }
    }
    verticalDistance(fromMetrics, toMetrics, higher, lower) {
      if (higher.bottom > lower.top) {
        return null;
      }
      const left = Math.abs(fromMetrics.center.x - toMetrics.left);
      const right = Math.abs(fromMetrics.center.x - toMetrics.right);
      const x = Math.min(
        Math.abs(fromMetrics.center.x - toMetrics.left),
        Math.abs(fromMetrics.center.x - toMetrics.center.x),
        Math.abs(fromMetrics.center.x - toMetrics.right)
      );
      const y = lower.center.y - higher.center.y;
      const angleLeft = Math.atan(y / left) * (180 / Math.PI);
      const angleRight = Math.atan(y / right) * (180 / Math.PI);
      if (!(angleLeft >= 0 && angleRight <= 180)) {
        return null;
      }
      return calcDistance(x, y);
    }
    getTopDistance(fromMetrics, toMetrics) {
      return this.verticalDistance(fromMetrics, toMetrics, toMetrics, fromMetrics);
    }
    getBottomDistance(fromMetrics, toMetrics) {
      return this.verticalDistance(fromMetrics, toMetrics, fromMetrics, toMetrics);
    }
    horizontalDistance(fromMetrics, toMetrics, lefter, righter) {
      if (lefter.right > righter.left) {
        return null;
      }
      const top = Math.abs(fromMetrics.center.y - toMetrics.top);
      const bottom = Math.abs(fromMetrics.center.y - toMetrics.bottom);
      const x = righter.center.x - lefter.center.x;
      const y = Math.min(
        Math.abs(fromMetrics.center.y - toMetrics.top),
        Math.abs(fromMetrics.center.y - toMetrics.center.y),
        Math.abs(fromMetrics.center.y - toMetrics.bottom)
      );
      var angleTop = Math.atan(x / top) * (180 / Math.PI);
      var angleBottom = Math.atan(x / bottom) * (180 / Math.PI);
      if (!(angleTop >= 0 && angleBottom <= 180)) {
        return null;
      }
      return calcDistance(x, y);
    }
    getLeftDistance(fromMetrics, toMetrics) {
      return this.horizontalDistance(fromMetrics, toMetrics, toMetrics, fromMetrics);
    }
    onKeyDown(event) {
      switch (event.keyCode) {
        case 9:
          break;
        case 37:
          event.preventDefault();
          this.moveFocus({ x: -1, y: 0 });
          break;
        case 38:
          event.preventDefault();
          this.moveFocus({ x: 0, y: 1 });
          break;
        case 39:
          event.preventDefault();
          this.moveFocus({ x: 1, y: 0 });
          break;
        case 40:
          event.preventDefault();
          this.moveFocus({ x: 0, y: -1 });
          break;
        case 13:
        case 32:
          event.preventDefault();
          if (this.currentlyFocusedItem) {
            this.currentlyFocusedItem.onItemClickStateChange(true);
          }
          break;
      }
    }
    onKeyUp(event) {
      switch (event.keyCode) {
        case 13:
        case 32:
          event.preventDefault();
          if (this.currentlyFocusedItem) {
            this.currentlyFocusedItem.onItemClickStateChange(false);
          }
          break;
      }
    }
  };
  return __toCommonJS(dpad_controller_exports);
})();
window.gauntface = window.gauntface || {};
window.gauntface.dpad = Object.assign(window.gauntface.dpad || {}, __dpadBundleExports);
