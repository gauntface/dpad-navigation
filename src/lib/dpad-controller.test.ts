import {afterEach, describe, expect, it} from 'vitest';

import {DpadController} from './dpad-controller';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

function addFocusableElement(rect: Rect): HTMLElement {
  const element = document.createElement('div');
  element.className = 'dpad-focusable';
  element.setAttribute('tabindex', '0');
  element.getBoundingClientRect = () => ({
    ...rect,
    right: rect.left + rect.width,
    bottom: rect.top + rect.height,
    x: rect.left,
    y: rect.top,
    toJSON: () => ({}),
  });
  document.body.appendChild(element);
  return element;
}

// 3x3 grid of 80x80 items on a 100px grid, indexed in DOM/row-major order:
// 0 1 2
// 3 4 5
// 6 7 8
function buildGrid(): HTMLElement[] {
  const elements: HTMLElement[] = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      elements.push(addFocusableElement({left: col * 100, top: row * 100, width: 80, height: 80}));
    }
  }
  return elements;
}

describe('DpadController neighbor detection', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('finds the nearest neighbor in each direction from the center of a 3x3 grid', () => {
    buildGrid();
    const dpad = new DpadController();
    dpad.update();

    const center = dpad.getFocusableItem(4)!;
    expect(center.getTopFocusItemIndex()).toBe(1);
    expect(center.getBottomFocusItemIndex()).toBe(7);
    expect(center.getLeftFocusItemIndex()).toBe(3);
    expect(center.getRightFocusItemIndex()).toBe(5);
  });

  it('finds the nearest neighbor in each direction from a grid corner', () => {
    buildGrid();
    const dpad = new DpadController();
    dpad.update();

    const topLeft = dpad.getFocusableItem(0)!;
    expect(topLeft.getTopFocusItemIndex()).toBeNull();
    expect(topLeft.getLeftFocusItemIndex()).toBeNull();
    expect(topLeft.getBottomFocusItemIndex()).toBe(3);
    expect(topLeft.getRightFocusItemIndex()).toBe(1);
  });

  it('picks the closer of two candidates in the same direction', () => {
    // Three items stacked directly above the origin item, at increasing
    // distance; the nearest one should win.
    addFocusableElement({left: 0, top: 0, width: 80, height: 80});
    addFocusableElement({left: 0, top: -100, width: 80, height: 80});
    addFocusableElement({left: 0, top: -300, width: 80, height: 80});

    const dpad = new DpadController();
    dpad.update();

    const origin = dpad.getFocusableItem(0)!;
    expect(origin.getTopFocusItemIndex()).toBe(1);
  });

  it('treats left/right pairs with no vertical neighbors as having null top/bottom', () => {
    addFocusableElement({left: 0, top: 0, width: 80, height: 80});
    addFocusableElement({left: 100, top: 0, width: 80, height: 80});

    const dpad = new DpadController();
    dpad.update();

    const left = dpad.getFocusableItem(0)!;
    const right = dpad.getFocusableItem(1)!;
    expect(left.getRightFocusItemIndex()).toBe(1);
    expect(left.getTopFocusItemIndex()).toBeNull();
    expect(left.getBottomFocusItemIndex()).toBeNull();
    expect(right.getLeftFocusItemIndex()).toBe(0);
  });

  it('does not treat an item as its own neighbor', () => {
    addFocusableElement({left: 0, top: 0, width: 80, height: 80});

    const dpad = new DpadController();
    dpad.update();

    const only = dpad.getFocusableItem(0)!;
    expect(only.getTopFocusItemIndex()).toBeNull();
    expect(only.getBottomFocusItemIndex()).toBeNull();
    expect(only.getLeftFocusItemIndex()).toBeNull();
    expect(only.getRightFocusItemIndex()).toBeNull();
  });

  it('excludes elements that are not dpad-focusable', () => {
    addFocusableElement({left: 0, top: 0, width: 80, height: 80});
    const plainDiv = document.createElement('div');
    plainDiv.setAttribute('tabindex', '0');
    plainDiv.style.position = 'absolute';
    plainDiv.getBoundingClientRect = () => ({
      left: 0, top: -100, width: 80, height: 80, right: 80, bottom: -20, x: 0, y: -100, toJSON: () => ({}),
    });
    document.body.appendChild(plainDiv);

    const dpad = new DpadController();
    dpad.update();

    expect(dpad.getFocusableItems()).toHaveLength(1);
    expect(dpad.getFocusableItem(0)!.getTopFocusItemIndex()).toBeNull();
  });
});
