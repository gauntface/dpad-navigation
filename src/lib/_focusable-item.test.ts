import {describe, expect, it} from 'vitest';

import {FocusableItem} from './_focusable-item';

function createElement(attrs: {tabindex?: string; display?: string; visibility?: string; className?: string} = {}): HTMLElement {
  const element = document.createElement('div');
  if (attrs.tabindex !== undefined) {
    element.setAttribute('tabindex', attrs.tabindex);
  }
  if (attrs.display !== undefined) {
    element.style.display = attrs.display;
  }
  if (attrs.visibility !== undefined) {
    element.style.visibility = attrs.visibility;
  }
  if (attrs.className !== undefined) {
    element.className = attrs.className;
  }
  return element;
}

describe('FocusableItem.isFocusable', () => {
  it('returns false when the element has no tabindex attribute', () => {
    const item = new FocusableItem(createElement());
    expect(item.isFocusable()).toBe(false);
  });

  it('returns false when tabindex is negative', () => {
    const item = new FocusableItem(createElement({tabindex: '-1'}));
    expect(item.isFocusable()).toBe(false);
  });

  it('returns true when tabindex is 0', () => {
    const item = new FocusableItem(createElement({tabindex: '0'}));
    expect(item.isFocusable()).toBe(true);
  });

  it('returns true when tabindex is a positive number', () => {
    const item = new FocusableItem(createElement({tabindex: '5'}));
    expect(item.isFocusable()).toBe(true);
  });

  it('returns false when tabindex is not a number', () => {
    const item = new FocusableItem(createElement({tabindex: 'not-a-number'}));
    expect(item.isFocusable()).toBe(false);
  });

  it('returns false when hidden via inline display:none, even with a valid tabindex', () => {
    const item = new FocusableItem(createElement({tabindex: '0', display: 'none'}));
    expect(item.isFocusable()).toBe(false);
  });

  it('returns false when hidden via inline visibility:hidden, even with a valid tabindex', () => {
    const item = new FocusableItem(createElement({tabindex: '0', visibility: 'hidden'}));
    expect(item.isFocusable()).toBe(false);
  });

  it('known gap: does not detect elements hidden via a CSS class rather than inline style', () => {
    // isFocusable() only inspects element.style (inline styles), so an
    // element hidden by a stylesheet rule (e.g. `.hidden { display: none }`)
    // is currently treated as focusable. This test documents today's
    // behavior so a future fix (checking computed style) is a deliberate,
    // visible change rather than an incidental one.
    const element = createElement({tabindex: '0', className: 'hidden'});
    const item = new FocusableItem(element);
    expect(item.isFocusable()).toBe(true);
  });
});
