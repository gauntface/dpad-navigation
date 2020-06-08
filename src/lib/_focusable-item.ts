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

import {Point} from "./_point";

export class FocusableItem {
  private element: HTMLElement;
  private focusState: boolean = false;

  private neighbors: Neighbors;

  constructor(ele: HTMLElement) {
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
      right: null,
    };
  };

  setTopFocusItemIndex(index: number) {
    this.neighbors.top = index;
  };

  getTopFocusItemIndex(): number {
    return this.neighbors.top;
  };

  setBottomFocusItemIndex(index: number) {
    this.neighbors.bottom = index;
  };

  getBottomFocusItemIndex(): number {
    return this.neighbors.bottom;
  };

  setLeftFocusItemIndex(index: number) {
    this.neighbors.left = index;
  };

  getLeftFocusItemIndex(): number {
    return this.neighbors.left;
  };

  setRightFocusItemIndex(index: number) {
    this.neighbors.right = index;
  };

  getRightFocusItemIndex(): number {
    return this.neighbors.right;
  };

  isFocusable(): boolean {
    if(this.element.style.display === 'none' || this.element.style.visibility === 'hidden') {
      return false;
    }

    let tabIndexAttr = this.element.getAttribute('tabindex');
    if (!tabIndexAttr) {
      return false
    }
    
    try {
      const tabIndex = parseInt(tabIndexAttr, 10)
      return tabIndex > -1;
    } catch (err) {
      // NOOP
    }

    return false;
  }

  getMetrics(): Metrics {
    var clientRect = this.element.getBoundingClientRect();
    return {
      width: clientRect.width,
      height: clientRect.height,
      left: clientRect.left,
      right: clientRect.left + clientRect.width,
      top: clientRect.top,
      bottom: clientRect.top + clientRect.height,
      center: {
        x: clientRect.left + (clientRect.width / 2),
        y: clientRect.top + (clientRect.height / 2)
      }
    };
  }

  onItemClickStateChange(isDown: boolean) {
    // NOOP
  }
}

export interface Neighbors {
  top: number|null;
  bottom: number|null;
  left: number|null;
  right: number|null;
}

export interface Metrics {
  width: number
  height: number
  left: number
  right: number
  top: number
  bottom: number
  center: Point
}