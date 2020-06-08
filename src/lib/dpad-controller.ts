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

const FOCUSABLE_ITEM_SELECTOR = '.dpad-focusable';

export class DPadController {
  private focusableItems: Array<FocusableItem> = [];
  private currentlyFocusedItem: FocusableItem|null = null;

  constructor() {
    this.focusableItems = [];

    this.findFocusableItems();

    if(this.focusableItems.length > 0) {
      this.setCurrentFocusItem(0);
    }

    this.updateFocusGraph();

    // Set up binding to listen for key presses
    document.addEventListener('keydown', (e) => {
      this.onKeyDown(e);
    });

    document.addEventListener('keyup', (e) => {
        this.onKeyUp(e);
    });
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

  updateFocusGraph() {
    for(const fi of this.focusableItems) {
        // If the element can't be focused, skip it.
        if(!fi.isFocusable()) {
            continue;
        }

        this.updateNeighbors(fi);
    }
  }

  updateNeighbors(fi: FocusableItem) {
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

  getTopDistance(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Up
    if (toMetrics.bottom > fromMetrics.top) {
      return null;
    }

    const left = Math.abs(fromMetrics.center.x - toMetrics.left);
    const right = Math.abs(fromMetrics.center.x - toMetrics.right);

    const x = Math.min(
      Math.abs(fromMetrics.center.x - toMetrics.left),
      Math.abs(fromMetrics.center.x - toMetrics.center.x),
      Math.abs(fromMetrics.center.x - toMetrics.right),
    );
    const y = fromMetrics.center.y - toMetrics.center.y;

    const angleLeft = Math.atan(y / left) * (180/Math.PI);
    const angleRight = Math.atan(y / right) * (180/Math.PI);
    // If the angle is too shallow it's not really up
    if(!(angleLeft >= 0 && angleRight <= 180)) {
        return null;
    }

    return this.calcDistance(x, y);
  }

  getBottomDistance(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Down
    if (fromMetrics.bottom > toMetrics.top) {
      return null;
    }

    const left = Math.abs(fromMetrics.center.x - toMetrics.left);
    const right = Math.abs(fromMetrics.center.x - toMetrics.right);

    const x = Math.min(
      Math.abs(fromMetrics.center.x - toMetrics.left),
      Math.abs(fromMetrics.center.x - toMetrics.center.x),
      Math.abs(fromMetrics.center.x - toMetrics.right),
    );
    const y = toMetrics.center.y - fromMetrics.center.y;

    const angleLeft = Math.atan(y / left) * (180/Math.PI);
    const angleRight = Math.atan(y / right) * (180/Math.PI);
    // If the angle is too shallow it's not really up
    if(!(angleLeft >= 0 && angleRight <= 180)) {
        return null;
    }

    return this.calcDistance(x, y);
  }

  getLeftDistance = function(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Left
    if (toMetrics.right > fromMetrics.left) {
      return null;
    }

    const top = Math.abs(fromMetrics.center.y - toMetrics.top);
    const bottom = Math.abs(fromMetrics.center.y - toMetrics.bottom);

    const x = fromMetrics.center.x - toMetrics.center.x;
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

    return this.calcDistance(x, y);
  }

  getRightDistance = function(fromMetrics: Metrics, toMetrics: Metrics) {
    // Move Right
    if (fromMetrics.right > toMetrics.left) {
      return null;
    }

    const top = Math.abs(fromMetrics.center.y - toMetrics.top);
    const bottom = Math.abs(fromMetrics.center.y - toMetrics.bottom);

    const x = toMetrics.center.x - fromMetrics.center.x;
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

    return this.calcDistance(x, y);
  }

  calcDistance(x: number, y: number): number {
    return Math.floor(Math.sqrt((x * x) + (y * y)));
  }

  onKeyDown(event: KeyboardEvent) {
    'use strict';

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
            // Enter
            event.preventDefault();
            if(this.currentlyFocusedItem) {
                this.currentlyFocusedItem.onItemClickStateChange(true);
            }
            break;
    }
  }

  onKeyUp(event: KeyboardEvent) {
    switch(event.keyCode) {
        case 13:
            // Enter
            event.preventDefault();
            if(this.currentlyFocusedItem) {
                this.currentlyFocusedItem.onItemClickStateChange(false);
            }
            break;
    }
};

  moveFocus(direction: Point) {
    // We need an item to move down from
    // TODO: Should initialise focus if not initialised...
    if(!this.currentlyFocusedItem) {
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
}

interface Point {
  x: number
  y: number
}