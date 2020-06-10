import {DpadController} from './dpad-controller';
import { FocusableItem } from './_focusable-item';
import {calcDistance} from './_calc-distance';

const DBEUG_LINE_CLASSNAME = 'dpad-debugger-line'
const DEBUG_LINE_SELECTOR = `.${DBEUG_LINE_CLASSNAME}`;

const MARKER_COLORS = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#ecf0f1',
  '#95a5a6'
];

export class DebugController {
  private dpad: DpadController;
  private debugMode: boolean;

  constructor(dpad: DpadController|null) {
    if (!dpad) {
      console.error(`Unable to debug since the dpad controller is not defined.`);    
    }
    this.dpad = dpad;
    this.debugMode = false;
  }

  setDebugMode(d: boolean) {
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
      return
    }

    const items = this.dpad.getFocusableItems();
    for(let i = 0; i < items.length; i++) {
      const fi = items[i];
      // If the element can't be focused, skip it.
      if(!fi.isFocusable()) {
          continue;
      }

      this.printDebugLinesForItem(i, fi);
    }
  }

  private clearDisplay = function() {
    const debugLines = document.querySelectorAll(DEBUG_LINE_SELECTOR);
    for(const dl of debugLines) {
      dl.remove();
    }
  }

  private printDebugLinesForItem(index: number, focusableItem: FocusableItem) {
    const markerIndex = index % MARKER_COLORS.length;
    const markerColor = MARKER_COLORS[markerIndex];

    const currentItemMetrics = focusableItem.getMetrics();

    const topIndex = focusableItem.getTopFocusItemIndex();
    if(topIndex !== null) {
      const topMetrics = this.dpad.getFocusableItem(topIndex).getMetrics();
      const xDist = topMetrics.center.x - currentItemMetrics.center.x;
      const yDist = currentItemMetrics.top - topMetrics.center.y;

      const angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 180;

      this.printDebugLine(calcDistance(xDist, yDist), (currentItemMetrics.center.x-5), currentItemMetrics.top, markerColor, angle);
    }

    const bottomIndex = focusableItem.getBottomFocusItemIndex(); 
    if(bottomIndex !== null) {
        const bottomMetrics = this.dpad.getFocusableItem(bottomIndex).getMetrics();
        const xDist = currentItemMetrics.center.x - bottomMetrics.center.x;
        const yDist = bottomMetrics.center.y - currentItemMetrics.bottom;

        const angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 360;

        this.printDebugLine(calcDistance(xDist, yDist), (currentItemMetrics.center.x+5), currentItemMetrics.bottom, markerColor, angle);
    }

    const leftIndex = focusableItem.getLeftFocusItemIndex();
    if(leftIndex !== null) {
        const leftMetrics = this.dpad.getFocusableItem(leftIndex).getMetrics();
        
        const xDist = leftMetrics.center.x - currentItemMetrics.left;
        const yDist = currentItemMetrics.center.y - leftMetrics.center.y;

        const angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 180;

        this.printDebugLine(calcDistance(xDist, yDist), currentItemMetrics.left, currentItemMetrics.center.y + 5, markerColor, angle);
    }

    const rightIndex = focusableItem.getRightFocusItemIndex();
    if(rightIndex !== null) {
      const rightMetrics = this.dpad.getFocusableItem(rightIndex).getMetrics();
      const xDist = rightMetrics.center.x - currentItemMetrics.right;
      const yDist = currentItemMetrics.center.y - rightMetrics.center.y;

      const angle = ((Math.atan2(xDist, yDist) * 180) / Math.PI) + 180;

      this.printDebugLine(calcDistance(xDist, yDist), currentItemMetrics.right, currentItemMetrics.center.y - 5, markerColor, angle);
    }
  }

  private printDebugLine(length: number, startX: number, startY: number, color: string, angle: number) {
    const lineElement = document.createElement('div');
    lineElement.classList.add(DBEUG_LINE_CLASSNAME);
    lineElement.classList.add('marker');
    lineElement.classList.add('start');
    lineElement.style.position = 'absolute';
    lineElement.style.width = 5+'px';
    lineElement.style.height = length+'px';
    lineElement.style.left = startX+'px';
    lineElement.style.top = startY+'px';
    lineElement.style.backgroundColor = color;
    lineElement.style.transform = 'rotate('+angle+'deg)';
    lineElement.style.transformOrigin = '0% 0%';
    document.body.appendChild(lineElement);
  }
}