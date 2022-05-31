// Copyright 2013 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {FocusableItem, Metrics} from './_focusable-item';
import {calcDistance} from './_calc-distance';

const FOCUSABLE_ITEM_SELECTOR = '.dpad-focusable';

export class DpadController {
  private focusableItems: Array<FocusableItem> = [];
  private currentlyFocusedItem: FocusableItem|null = null;
  private enabled: boolean = false;

  constructor() {
    this.focusableItems = [];
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.enable()
  }

  disable() {
    if (!this.enabled) {
      return
    }

    document.removeEventListener('keydown', this.onKeyDown);
    document.removeEventListener('keyup', this.onKeyUp);

    this.enabled = false;
  }

  enable() {
    if (this.enabled) {
      return
    }

    // Set up binding to listen for key presses
    document.addEventListener('keydown', this.onKeyDown);
    document.addEventListener('keyup', this.onKeyUp);

    this.enabled = true;
  }

  findFocusableItems() {
    const focusableItems: NodeListOf<HTMLElement> = document.querySelectorAll(FOCUSABLE_ITEM_SELECTOR);
    for(const fi of focusableItems) {
      this.addFocusableItem(new FocusableItem(fi));
    }
  }

  addFocusableItem(i: FocusableItem) {
    this.focusableItems.push(i);
  }

  getFocusableItems(): Array<FocusableItem> {
    return this.focusableItems;
  }

  getFocusableItem(index: number) {
    if(index >= this.focusableItems.length || index < 0) {
        return null;
    }

    return this.focusableItems[index];
  }

  setCurrentFocusItem(i: number) {
    const fi = this.getFocusableItem(i);
    this.currentlyFocusedItem = fi;
    if(!this.currentlyFocusedItem) {
      return
    }
    this.currentlyFocusedItem.focus();
  }

  update() {
    // Reset focusable items array so it doesn't have duplicates
    // added to it with every update call
    this.focusableItems = [];
    this.findFocusableItems();

    // Need to reset currently focused item so that we can replace it
    // with the new FocusableItem in the focusableItems array
    const previouslyFocusedItem: FocusableItem = this.currentlyFocusedItem;
    this.currentlyFocusedItem = null;

    for(const fi of this.focusableItems) {
        // If the element can't be focused, skip it.
        if(!fi.isFocusable()) {
            continue;
        }

        // Check if the element that was the focused item still exists
        // and set it as the currentlyFocusedItem if so
        if(previouslyFocusedItem && fi.getElement() == previouslyFocusedItem.getElement()){
          this.currentlyFocusedItem = fi;
        }

        this.updateNeighbors(fi);
    }
  }

  moveFocus(direction: Point) {
    // We need an item to move down from
    if(!this.currentlyFocusedItem) {
        if (this.focusableItems.length > 0) {
          this.setCurrentFocusItem(0);
        }
        return;
    }

    var nextItemIndex = null;
    if(direction.y === 0) {
        if(direction.x > 0) {
            // Move Right
            nextItemIndex = this.currentlyFocusedItem.getRightFocusItemIndex();
        } else {
            // Move Left
            nextItemIndex = this.currentlyFocusedItem.getLeftFocusItemIndex();
        }
    } else if(direction.x === 0) {
        if(direction.y > 0) {
            // Move Up
            nextItemIndex = this.currentlyFocusedItem.getTopFocusItemIndex();
        } else {
            // Move Down
            nextItemIndex = this.currentlyFocusedItem.getBottomFocusItemIndex();
        }
    }

    if(nextItemIndex !== null) {
        this.setCurrentFocusItem(nextItemIndex);
    }
  }

  private updateNeighbors(fi: FocusableItem) {
    const metrics = fi.getMetrics();

    const itemCount = this.focusableItems.length;

    let minTopElementDist;
    let minBottomElementDist;
    let minLeftElementDist;
    let minRightElementDist;

    for(var i = 0; i < itemCount; i++) {
      var newItem = this.getFocusableItem(i);
      // If the element can't be focused, or is the current element,
      // skip it.
      if(!newItem.isFocusable() || newItem === fi) {
          continue;
      }

      const newItemMetrics = newItem.getMetrics();
      const distanceTop = this.getTopDistance(metrics, newItemMetrics);
      const distanceBottom = this.getBottomDistance(metrics, newItemMetrics);
      const distanceLeft = this.getLeftDistance(metrics, newItemMetrics);
      const distanceRight = this.getRightDistance(metrics, newItemMetrics);

      if(distanceTop !== null && (typeof minTopElementDist === 'undefined' || minTopElementDist > distanceTop)) {
          minTopElementDist = distanceTop;

          fi.setTopFocusItemIndex(i);
      }

      if(distanceBottom !== null && (typeof minBottomElementDist === 'undefined' || minBottomElementDist > distanceBottom)) {
          minBottomElementDist = distanceBottom;

          fi.setBottomFocusItemIndex(i);
      }

      if(distanceLeft !== null && (typeof minLeftElementDist === 'undefined' || minLeftElementDist > distanceLeft)) {
          minLeftElementDist = distanceLeft;

          fi.setLeftFocusItemIndex(i);
      }

      if(distanceRight !== null && (typeof minRightElementDist === 'undefined' || minRightElementDist > distanceRight)) {
          minRightElementDist = distanceRight;

          fi.setRightFocusItemIndex(i);
      }
    }
  }

  private verticalDistance(fromMetrics: Metrics, toMetrics: Metrics, higher: Metrics, lower: Metrics) {
    if (higher.bottom > lower.top) {
      return null;
    }

    const left = Math.abs(fromMetrics.center.x - toMetrics.left);
    const right = Math.abs(fromMetrics.center.x - toMetrics.right);

    const x = Math.min(
      Math.abs(fromMetrics.center.x - toMetrics.left),
      Math.abs(fromMetrics.center.x - toMetrics.center.x),
      Math.abs(fromMetrics.center.x - toMetrics.right),
    );
    const y = lower.center.y - higher.center.y;

    const angleLeft = Math.atan(y / left) * (180/Math.PI);
    const angleRight = Math.atan(y / right) * (180/Math.PI);
    // If the angle is too shallow it's not really up
    if(!(angleLeft >= 0 && angleRight <= 180)) {
        return null;
    }

    return calcDistance(x, y);
  }

  private getTopDistance(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Up
    return this.verticalDistance(fromMetrics, toMetrics, toMetrics, fromMetrics);
  }

  private getBottomDistance(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Down
    return this.verticalDistance(fromMetrics, toMetrics, fromMetrics, toMetrics);
  }

  private horizontalDistance(fromMetrics: Metrics, toMetrics: Metrics, lefter: Metrics, righter: Metrics) {
    if (lefter.right > righter.left) {
      return null;
    }

    const top = Math.abs(fromMetrics.center.y - toMetrics.top);
    const bottom = Math.abs(fromMetrics.center.y - toMetrics.bottom);

    const x = righter.center.x - lefter.center.x;
    const y = Math.min(
      Math.abs(fromMetrics.center.y - toMetrics.top),
      Math.abs(fromMetrics.center.y - toMetrics.center.y),
      Math.abs(fromMetrics.center.y - toMetrics.bottom),
    );

    var angleTop = Math.atan(x / top) * (180/Math.PI);
    var angleBottom = Math.atan(x / bottom) * (180/Math.PI);
    // If the angle is too shallow it's not really up
    if(!(angleTop >= 0 && angleBottom <= 180)) {
        return null;
    }

    return calcDistance(x, y);
  }

  private getLeftDistance(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Left
    return this.horizontalDistance(fromMetrics, toMetrics, toMetrics, fromMetrics);
  }

  private getRightDistance = function(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Right
    return this.horizontalDistance(fromMetrics, toMetrics, fromMetrics, toMetrics);
  }

  private onKeyDown(event: KeyboardEvent) {
    switch(event.keyCode) {
        case 9:
            // Tab
            break;
        case 37:
            // Left
            event.preventDefault();
            this.moveFocus({x: -1, y: 0});
            break;
        case 38:
            // Up
            event.preventDefault();
            this.moveFocus({x: 0, y: 1});
            break;
        case 39:
            // Right
            event.preventDefault();
            this.moveFocus({x: 1, y: 0});
            break;
        case 40:
            // Down
            event.preventDefault();
            this.moveFocus({x: 0, y: -1});
            break;
        case 13:
        case 32:
            // Enter
            event.preventDefault();
            if(this.currentlyFocusedItem) {
                this.currentlyFocusedItem.onItemClickStateChange(true);
            }
            break;
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    switch(event.keyCode) {
        case 13:
            // Enter
            event.preventDefault();
            if(this.currentlyFocusedItem) {
                this.currentlyFocusedItem.onItemClickStateChange(false);
            }
            break;
    }
  }
}

interface Point {
  x: number
  y: number
}