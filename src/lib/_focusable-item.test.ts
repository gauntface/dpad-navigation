// Test for FocusableItem.isFocusable() with computed styles
// This test demonstrates the bug and verifies the fix

import { FocusableItem } from './_focusable-item';
import * as assert from 'assert';

describe('FocusableItem.isFocusable() - Unit Tests', () => {
  let styleSheet: HTMLStyleElement;

  beforeEach(() => {
    styleSheet = document.createElement('style');
    document.head.appendChild(styleSheet);
  });

  afterEach(() => {
    if (styleSheet.parentNode) {
      document.head.removeChild(styleSheet);
    }
  });

  function addCSSRule(selector: string, cssText: string) {
    const sheet = styleSheet.sheet as CSSStyleSheet;
    if (sheet) {
      sheet.insertRule(`${selector} { ${cssText} }`, sheet.cssRules.length);
    }
  }

  describe('basic visibility and tabindex', () => {
    it('should have an isFocusable method', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('tabindex', '0');
      const item = new FocusableItem(mockElement);
      assert.strictEqual(typeof item.isFocusable, 'function');
    });

    it('should return false for elements without tabindex', () => {
      const mockElement = document.createElement('div');
      const item = new FocusableItem(mockElement);
      assert.strictEqual(item.isFocusable(), false);
    });

    it('should return false for elements with negative tabindex', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('tabindex', '-1');
      const item = new FocusableItem(mockElement);
      assert.strictEqual(item.isFocusable(), false);
    });

    it('should return true for visible elements with valid tabindex', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('tabindex', '0');
      const item = new FocusableItem(mockElement);
      assert.strictEqual(item.isFocusable(), true);
    });

    it('should return false for elements with inline display: none', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('tabindex', '0');
      mockElement.style.display = 'none';
      const item = new FocusableItem(mockElement);
      assert.strictEqual(item.isFocusable(), false);
    });

    it('should return false for elements with inline visibility: hidden', () => {
      const mockElement = document.createElement('div');
      mockElement.setAttribute('tabindex', '0');
      mockElement.style.visibility = 'hidden';
      const item = new FocusableItem(mockElement);
      assert.strictEqual(item.isFocusable(), false);
    });
  });

  describe('CSS class hiding (the bug)', () => {
    it('should return false for elements with display: none via CSS class', () => {
      addCSSRule('.hidden', 'display: none');
      const el = document.createElement('div');
      el.classList.add('hidden');
      el.setAttribute('tabindex', '0');
      document.body.appendChild(el);
      const item = new FocusableItem(el);
      assert.strictEqual(
        item.isFocusable(),
        false,
        'Element hidden via CSS class should not be focusable'
      );
      document.body.removeChild(el);
    });

    it('should return false for elements with visibility: hidden via CSS class', () => {
      addCSSRule('.invisible', 'visibility: hidden');
      const el = document.createElement('div');
      el.classList.add('invisible');
      el.setAttribute('tabindex', '0');
      document.body.appendChild(el);
      const item = new FocusableItem(el);
      assert.strictEqual(
        item.isFocusable(),
        false,
        'Element with visibility hidden via CSS class should not be focusable'
      );
      document.body.removeChild(el);
    });

    it('should return false for elements hidden by CSS utility class .d-none', () => {
      addCSSRule('.d-none', 'display: none');
      const el = document.createElement('div');
      el.classList.add('d-none');
      el.setAttribute('tabindex', '0');
      document.body.appendChild(el);
      const item = new FocusableItem(el);
      assert.strictEqual(
        item.isFocusable(),
        false,
        'Element with .d-none class should not be focusable'
      );
      document.body.removeChild(el);
    });

    it('should handle multiple CSS classes where one hides the element', () => {
      addCSSRule('.base', 'color: red');
      addCSSRule('.hidden', 'display: none');
      const el = document.createElement('div');
      el.classList.add('base');
      el.classList.add('hidden');
      el.setAttribute('tabindex', '0');
      document.body.appendChild(el);
      const item = new FocusableItem(el);
      assert.strictEqual(
        item.isFocusable(),
        false,
        'Element with multiple classes including hidden should not be focusable'
      );
      document.body.removeChild(el);
    });

    it('should handle CSS class overriding inline style with !important', () => {
      addCSSRule('.show-override', 'display: block !important');
      const el = document.createElement('div');
      el.classList.add('show-override');
      el.style.display = 'none'; // inline style says hidden
      el.setAttribute('tabindex', '0');
      document.body.appendChild(el);
      const item = new FocusableItem(el);
      // The computed style should be 'block' due to !important, so should be focusable
      assert.strictEqual(
        item.isFocusable(),
        true,
        'Element with CSS class overriding inline style should respect computed style'
      );
      document.body.removeChild(el);
    });

    it('should handle CSS class removing hidden state', () => {
      addCSSRule('.hidden', 'display: none');
      addCSSRule('.unhide', 'display: block !important');
      const el = document.createElement('div');
      el.classList.add('hidden');
      el.classList.add('unhide');
      el.setAttribute('tabindex', '0');
      document.body.appendChild(el);
      const item = new FocusableItem(el);
      // The !important unhide should win
      assert.strictEqual(
        item.isFocusable(),
        true,
        'Element with unhiding class should be focusable'
      );
      document.body.removeChild(el);
    });
  });

  describe('edge cases', () => {
    it('should return false for elements with invalid tabindex attribute', () => {
      const el = document.createElement('div');
      el.setAttribute('tabindex', 'not-a-number');
      const item = new FocusableItem(el);
      assert.strictEqual(item.isFocusable(), false);
    });

    it('should return false for elements with both display: none and visibility: hidden via CSS', () => {
      addCSSRule('.super-hidden', 'display: none; visibility: hidden');
      const el = document.createElement('div');
      el.classList.add('super-hidden');
      el.setAttribute('tabindex', '0');
      document.body.appendChild(el);
      const item = new FocusableItem(el);
      assert.strictEqual(item.isFocusable(), false);
      document.body.removeChild(el);
    });

    it('should handle high tabindex values', () => {
      const el = document.createElement('div');
      el.setAttribute('tabindex', '32767');
      const item = new FocusableItem(el);
      assert.strictEqual(item.isFocusable(), true);
    });
  });
});
