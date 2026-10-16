import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { DpadController } from './dpad-controller';
import { FocusableItem } from './_focusable-item';

describe('DpadController - Space and Enter key handling', () => {
  let container: HTMLElement;
  let button1: HTMLElement;
  let button2: HTMLElement;
  let controller: DpadController;

  beforeEach(() => {
    // Set up DOM
    container = document.createElement('div');
    button1 = document.createElement('button');
    button1.className = 'dpad-focusable';
    button1.tabIndex = 0;
    button1.textContent = 'Button 1';
    
    button2 = document.createElement('button');
    button2.className = 'dpad-focusable';
    button2.tabIndex = 1;
    button2.textContent = 'Button 2';
    
    container.appendChild(button1);
    container.appendChild(button2);
    document.body.appendChild(container);

    // Create controller and find focusable items
    controller = new DpadController();
    controller.findFocusableItems();
    controller.update();
    controller.setCurrentFocusItem(0);
  });

  afterEach(() => {
    controller.disable();
    document.body.removeChild(container);
  });

  describe('Space key (keyCode 32)', () => {
    it('should call onItemClickStateChange(true) on keydown', () => {
      const focusedItem = controller.getFocusableItem(0);
      const spy = vi.spyOn(focusedItem, 'onItemClickStateChange');

      const event = new KeyboardEvent('keydown', {
        keyCode: 32,
        bubbles: true,
      } as any);
      
      document.dispatchEvent(event);
      
      expect(spy).toHaveBeenCalledWith(true);
      spy.mockRestore();
    });

    it('should call onItemClickStateChange(false) on keyup', () => {
      const focusedItem = controller.getFocusableItem(0);
      const spy = vi.spyOn(focusedItem, 'onItemClickStateChange');

      const keydownEvent = new KeyboardEvent('keydown', {
        keyCode: 32,
        bubbles: true,
      } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', {
        keyCode: 32,
        bubbles: true,
      } as any);
      document.dispatchEvent(keyupEvent);
      
      expect(spy).toHaveBeenCalledWith(false);
      spy.mockRestore();
    });

    it('should trigger element.click() on Space key release', () => {
      const clickSpy = vi.spyOn(button1, 'click');

      const keydownEvent = new KeyboardEvent('keydown', {
        keyCode: 32,
        bubbles: true,
      } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', {
        keyCode: 32,
        bubbles: true,
      } as any);
      document.dispatchEvent(keyupEvent);
      
      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });

  describe('Enter key (keyCode 13)', () => {
    it('should call onItemClickStateChange(true) on keydown', () => {
      const focusedItem = controller.getFocusableItem(0);
      const spy = vi.spyOn(focusedItem, 'onItemClickStateChange');

      const event = new KeyboardEvent('keydown', {
        keyCode: 13,
        bubbles: true,
      } as any);
      
      document.dispatchEvent(event);
      
      expect(spy).toHaveBeenCalledWith(true);
      spy.mockRestore();
    });

    it('should call onItemClickStateChange(false) on keyup', () => {
      const focusedItem = controller.getFocusableItem(0);
      const spy = vi.spyOn(focusedItem, 'onItemClickStateChange');

      const keydownEvent = new KeyboardEvent('keydown', {
        keyCode: 13,
        bubbles: true,
      } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', {
        keyCode: 13,
        bubbles: true,
      } as any);
      document.dispatchEvent(keyupEvent);
      
      expect(spy).toHaveBeenCalledWith(false);
      spy.mockRestore();
    });

    it('should trigger element.click() on Enter key release', () => {
      const clickSpy = vi.spyOn(button1, 'click');

      const keydownEvent = new KeyboardEvent('keydown', {
        keyCode: 13,
        bubbles: true,
      } as any);
      document.dispatchEvent(keydownEvent);

      const keyupEvent = new KeyboardEvent('keyup', {
        keyCode: 13,
        bubbles: true,
      } as any);
      document.dispatchEvent(keyupEvent);
      
      expect(clickSpy).toHaveBeenCalled();
      clickSpy.mockRestore();
    });
  });

  describe('Symmetric behavior between Space and Enter', () => {
    it('should have identical press/release behavior', () => {
      const focusedItem = controller.getFocusableItem(0);
      const spy = vi.spyOn(focusedItem, 'onItemClickStateChange');

      // Test Space key
      const spaceDown = new KeyboardEvent('keydown', {
        keyCode: 32,
        bubbles: true,
      } as any);
      const spaceUp = new KeyboardEvent('keyup', {
        keyCode: 32,
        bubbles: true,
      } as any);

      document.dispatchEvent(spaceDown);
      expect(spy).toHaveBeenCalledWith(true);
      spy.mockClear();

      document.dispatchEvent(spaceUp);
      expect(spy).toHaveBeenCalledWith(false);
      spy.mockClear();

      // Test Enter key - should have same sequence
      const enterDown = new KeyboardEvent('keydown', {
        keyCode: 13,
        bubbles: true,
      } as any);
      const enterUp = new KeyboardEvent('keyup', {
        keyCode: 13,
        bubbles: true,
      } as any);

      document.dispatchEvent(enterDown);
      expect(spy).toHaveBeenCalledWith(true);
      spy.mockClear();

      document.dispatchEvent(enterUp);
      expect(spy).toHaveBeenCalledWith(false);

      spy.mockRestore();
    });
  });

  describe('onItemClickStateChange behavior', () => {
    it('should not click on press (isDown=true)', () => {
      const focusableItem = new FocusableItem(button1);
      const clickSpy = vi.spyOn(button1, 'click');

      focusableItem.onItemClickStateChange(true);
      
      expect(clickSpy).not.toHaveBeenCalled();
      clickSpy.mockRestore();
    });

    it('should click on release (isDown=false)', () => {
      const focusableItem = new FocusableItem(button1);
      const clickSpy = vi.spyOn(button1, 'click');

      focusableItem.onItemClickStateChange(false);
      
      expect(clickSpy).toHaveBeenCalledTimes(1);
      clickSpy.mockRestore();
    });
  });
});
