import {DebugController, DpadController} from '@gauntface/dpad-nav';
import {writable} from 'svelte/store';

// One controller pair for the whole app lifetime -- re-created components
// just need to call refreshDpad() after their focusable elements render.
export const dpad = new DpadController();
export const debugController = new DebugController(dpad);

export const debugOn = writable(false);
export const focusedNode = writable<{id: string; tabindex: number; x: number; y: number} | null>(null);

export function refreshDpad() {
  dpad.update();
}

export function toggleDebug() {
  debugController.toggleDebugMode();
  debugOn.update((v) => !v);
}

export function focusInitial() {
  const el = document.querySelector<HTMLElement>('[data-dpad-initial-focus]');
  if (!el) return;
  const items = dpad.getFocusableItems();
  const index = items.findIndex((item) => item.getElement() === el);
  if (index > -1) {
    dpad.setCurrentFocusItem(index);
  }
}

// DpadController.onKeyDown preventDefaults Enter/Space and routes to
// FocusableItem#onItemClickStateChange, which is a no-op unless you supply
// your own FocusableItem subclass -- so out of the box, a focused <button>
// does NOT activate on Enter the way native browser focus normally would.
// Restore that expectation generically: whatever's focused, click it.
document.addEventListener('keyup', (event) => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  const el = document.activeElement;
  if (el instanceof HTMLElement && el.classList.contains('dpad-focusable')) {
    el.click();
  }
});

document.addEventListener(
  'focus',
  (event) => {
    const el = event.target as HTMLElement;
    if (!el.classList?.contains('dpad-focusable')) return;
    const rect = el.getBoundingClientRect();
    focusedNode.set({
      id: el.dataset.nodeId || el.tagName.toLowerCase(),
      tabindex: el.tabIndex,
      x: Math.round(rect.x),
      y: Math.round(rect.y),
    });

    const rail = el.closest('.rail');
    if (rail) {
      const railRect = rail.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      if (elRect.right > railRect.right - 80) {
        rail.scrollBy({left: 320, behavior: 'smooth'});
      } else if (elRect.left < railRect.left + 80) {
        rail.scrollBy({left: -320, behavior: 'smooth'});
      }
    }
  },
  true,
);
