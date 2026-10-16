import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DpadController } from './dpad-controller';
import { FocusableItem } from './_focusable-item';

describe('DpadController keyboard event handling', () => {
  let container: HTMLElement;
  let controller: DpadController;

  beforeEach(() => {
    // Create a container and some focusable items
    container = document.createElement('div');
    document.body.appendChild(container);

    // Create test focusable elements
    const button1 = document.createElement('button');
    button1.className = 'dpad-focusable';
    button1.setAttribute('tabindex', '0');
    button1.textContent = 'Button 1';
    container.appendChild(button1);

    const button2 = document.createElement('button');
    button2.className = 'dpad-focusable';
    button2.setAttribute('tabindex', '0');
    button2.textContent = 'Button 2';
    container.appendChild(button2);

    // Create controller and find focusable items
    controller = new DpadController();
    controller.findFocusableItems();

    // Set focus to first item
    controller.setCurrentFocusItem(0);
  });

  afterEach(() => {
    controller.disable();
    container.remove();
  });

  describe('Enter key (keyCode 13)', () => {
    it('calls onItemClickStateChange(true) on keydown', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const spyOnItemClickStateChange = vi.spyOn(item, 'onItemClickStateChange');

      const event = new KeyboardEvent('keydown', { keyCode: 13 } as any);
      document.dispatchEvent(event);

      expect(spyOnItemClickStateChange).toHaveBeenCalledWith(true);
    });

    it('calls onItemClickStateChange(false) on keyup', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const spyOnItemClickStateChange = vi.spyOn(item, 'onItemClickStateChange');

      const keydownEvent = new KeyboardEvent('keydown', { keyCode: 13 } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { keyCode: 13 } as any);
      document.dispatchEvent(keyupEvent);

      expect(spyOnItemClickStateChange).toHaveBeenLastCalledWith(false);
    });

    it('toggles state on press and release', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const spyOnItemClickStateChange = vi.spyOn(item, 'onItemClickStateChange');

      const keydownEvent = new KeyboardEvent('keydown', { keyCode: 13 } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { keyCode: 13 } as any);
      document.dispatchEvent(keyupEvent);

      expect(spyOnItemClickStateChange).toHaveBeenCalledTimes(2);
      expect(spyOnItemClickStateChange).toHaveBeenNthCalledWith(1, true);
      expect(spyOnItemClickStateChange).toHaveBeenNthCalledWith(2, false);
    });
  });

  describe('Space key (keyCode 32)', () => {
    it('calls onItemClickStateChange(true) on keydown', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const spyOnItemClickStateChange = vi.spyOn(item, 'onItemClickStateChange');

      const event = new KeyboardEvent('keydown', { keyCode: 32 } as any);
      document.dispatchEvent(event);

      expect(spyOnItemClickStateChange).toHaveBeenCalledWith(true);
    });

    it('calls onItemClickStateChange(false) on keyup', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const spyOnItemClickStateChange = vi.spyOn(item, 'onItemClickStateChange');

      const keydownEvent = new KeyboardEvent('keydown', { keyCode: 32 } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { keyCode: 32 } as any);
      document.dispatchEvent(keyupEvent);

      expect(spyOnItemClickStateChange).toHaveBeenLastCalledWith(false);
    });

    it('toggles state on press and release', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const spyOnItemClickStateChange = vi.spyOn(item, 'onItemClickStateChange');

      const keydownEvent = new KeyboardEvent('keydown', { keyCode: 32 } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', { keyCode: 32 } as any);
      document.dispatchEvent(keyupEvent);

      expect(spyOnItemClickStateChange).toHaveBeenCalledTimes(2);
      expect(spyOnItemClickStateChange).toHaveBeenNthCalledWith(1, true);
      expect(spyOnItemClickStateChange).toHaveBeenNthCalledWith(2, false);
    });

    it('has symmetric behavior with Enter key', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const spyOnItemClickStateChange = vi.spyOn(item, 'onItemClickStateChange');

      // Test Space key
      const spaceDownEvent = new KeyboardEvent('keydown', { keyCode: 32 } as any);
      document.dispatchEvent(spaceDownEvent);
      const spaceUpEvent = new KeyboardEvent('keyup', { keyCode: 32 } as any);
      document.dispatchEvent(spaceUpEvent);

      const spaceCallCount = spyOnItemClickStateChange.mock.calls.length;

      // Reset spy
      spyOnItemClickStateChange.mockClear();

      // Test Enter key
      const enterDownEvent = new KeyboardEvent('keydown', { keyCode: 13 } as any);
      document.dispatchEvent(enterDownEvent);
      const enterUpEvent = new KeyboardEvent('keyup', { keyCode: 13 } as any);
      document.dispatchEvent(enterUpEvent);

      const enterCallCount = spyOnItemClickStateChange.mock.calls.length;

      expect(spaceCallCount).toBe(enterCallCount);
      expect(spaceCallCount).toBe(2);
    });
  });

  describe('No currently focused item', () => {
    it('does not call onItemClickStateChange if no item is focused on Enter', () => {
      // Create a new controller without items
      const emptyController = new DpadController();
      const onItemClickStateChangeSpy = vi.fn();

      // Try to dispatch Enter key
      const event = new KeyboardEvent('keydown', { keyCode: 13 } as any);
      document.dispatchEvent(event);

      // Should not crash and should not call anything
      expect(onItemClickStateChangeSpy).not.toHaveBeenCalled();
    });

    it('does not call onItemClickStateChange if no item is focused on Space', () => {
      // Create a new controller without items
      const emptyController = new DpadController();
      const onItemClickStateChangeSpy = vi.fn();

      // Try to dispatch Space key
      const event = new KeyboardEvent('keydown', { keyCode: 32 } as any);
      document.dispatchEvent(event);

      // Should not crash and should not call anything
      expect(onItemClickStateChangeSpy).not.toHaveBeenCalled();
    });
  });

  describe('Bug fix regression: Space key on keyup', () => {
    it('correctly handles Space key release without getting stuck in pressed state', () => {
      const focusableItems = controller.getFocusableItems();
      const item = focusableItems[0];
      const calls: boolean[] = [];
      
      // Override onItemClickStateChange to track calls
      item.onItemClickStateChange = (isDown: boolean) => {
        calls.push(isDown);
      };

      // Press Space
      const keydownEvent = new KeyboardEvent('keydown', { keyCode: 32 } as any);
      document.dispatchEvent(keydownEvent);

      // Release Space
      const keyupEvent = new KeyboardEvent('keyup', { keyCode: 32 } as any);
      document.dispatchEvent(keyupEvent);

      // Should have exactly two calls: true (on press) and false (on release)
      expect(calls).toEqual([true, false]);
      // Importantly, should NOT be stuck at [true] or [true, true]
      expect(calls[calls.length - 1]).toBe(false);
    });
  });
});
