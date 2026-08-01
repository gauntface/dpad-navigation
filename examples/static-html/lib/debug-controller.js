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

  // src/lib/debug-controller.ts
  var debug_controller_exports = {};
  __export(debug_controller_exports, {
    DebugController: () => DebugController
  });

  // src/lib/_calc-distance.ts
  function calcDistance(x, y) {
    return Math.floor(Math.sqrt(x * x + y * y));
  }

  // src/lib/debug-controller.ts
  var DBEUG_LINE_CLASSNAME = "dpad-debugger-line";
  var DEBUG_LINE_SELECTOR = `.${DBEUG_LINE_CLASSNAME}`;
  var MARKER_COLORS = [
    "#1abc9c",
    "#2ecc71",
    "#3498db",
    "#9b59b6",
    "#34495e",
    "#f1c40f",
    "#e67e22",
    "#e74c3c",
    "#ecf0f1",
    "#95a5a6"
  ];
  var DebugController = class {
    constructor(dpad) {
      this.clearDisplay = function() {
        const debugLines = document.querySelectorAll(DEBUG_LINE_SELECTOR);
        for (const dl of debugLines) {
          dl.remove();
        }
      };
      if (!dpad) {
        console.error(`Unable to debug since the dpad controller is not defined.`);
      }
      this.dpad = dpad;
      this.debugMode = false;
    }
    setDebugMode(d) {
      this.debugMode = d;
      this.updateDisplay();
    }
    toggleDebugMode() {
      this.debugMode = !this.debugMode;
      this.updateDisplay();
    }
    updateDisplay() {
      this.clearDisplay();
      if (!this.debugMode) {
        return;
      }
      const items = this.dpad.getFocusableItems();
      for (let i = 0; i < items.length; i++) {
        const fi = items[i];
        if (!fi.isFocusable()) {
          continue;
        }
        this.printDebugLinesForItem(i, fi);
      }
    }
    printDebugLinesForItem(index, focusableItem) {
      const markerIndex = index % MARKER_COLORS.length;
      const markerColor = MARKER_COLORS[markerIndex];
      const currentItemMetrics = focusableItem.getMetrics();
      const topIndex = focusableItem.getTopFocusItemIndex();
      if (topIndex !== null) {
        const topMetrics = this.dpad.getFocusableItem(topIndex).getMetrics();
        const xDist = topMetrics.center.x - currentItemMetrics.center.x;
        const yDist = currentItemMetrics.top - topMetrics.center.y;
        const angle = Math.atan2(xDist, yDist) * 180 / Math.PI + 180;
        this.printDebugLine(calcDistance(xDist, yDist), currentItemMetrics.center.x - 5, currentItemMetrics.top, markerColor, angle);
      }
      const bottomIndex = focusableItem.getBottomFocusItemIndex();
      if (bottomIndex !== null) {
        const bottomMetrics = this.dpad.getFocusableItem(bottomIndex).getMetrics();
        const xDist = currentItemMetrics.center.x - bottomMetrics.center.x;
        const yDist = bottomMetrics.center.y - currentItemMetrics.bottom;
        const angle = Math.atan2(xDist, yDist) * 180 / Math.PI + 360;
        this.printDebugLine(calcDistance(xDist, yDist), currentItemMetrics.center.x + 5, currentItemMetrics.bottom, markerColor, angle);
      }
      const leftIndex = focusableItem.getLeftFocusItemIndex();
      if (leftIndex !== null) {
        const leftMetrics = this.dpad.getFocusableItem(leftIndex).getMetrics();
        const xDist = leftMetrics.center.x - currentItemMetrics.left;
        const yDist = currentItemMetrics.center.y - leftMetrics.center.y;
        const angle = Math.atan2(xDist, yDist) * 180 / Math.PI + 180;
        this.printDebugLine(calcDistance(xDist, yDist), currentItemMetrics.left, currentItemMetrics.center.y + 5, markerColor, angle);
      }
      const rightIndex = focusableItem.getRightFocusItemIndex();
      if (rightIndex !== null) {
        const rightMetrics = this.dpad.getFocusableItem(rightIndex).getMetrics();
        const xDist = rightMetrics.center.x - currentItemMetrics.right;
        const yDist = currentItemMetrics.center.y - rightMetrics.center.y;
        const angle = Math.atan2(xDist, yDist) * 180 / Math.PI + 180;
        this.printDebugLine(calcDistance(xDist, yDist), currentItemMetrics.right, currentItemMetrics.center.y - 5, markerColor, angle);
      }
    }
    printDebugLine(length, startX, startY, color, angle) {
      const lineElement = document.createElement("div");
      lineElement.classList.add(DBEUG_LINE_CLASSNAME);
      lineElement.classList.add("marker");
      lineElement.classList.add("start");
      lineElement.style.position = "absolute";
      lineElement.style.width = "5px";
      lineElement.style.height = length + "px";
      lineElement.style.left = startX + "px";
      lineElement.style.top = startY + "px";
      lineElement.style.backgroundColor = color;
      lineElement.style.transform = "rotate(" + angle + "deg)";
      lineElement.style.transformOrigin = "0% 0%";
      document.body.appendChild(lineElement);
    }
  };
  return __toCommonJS(debug_controller_exports);
})();
window.gauntface = window.gauntface || {};
window.gauntface.dpad = Object.assign(window.gauntface.dpad || {}, __dpadBundleExports);
