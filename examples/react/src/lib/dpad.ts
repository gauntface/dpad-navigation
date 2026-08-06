import {DebugController, DpadController} from '@gauntface/dpad-nav';
import {useEffect, useLayoutEffect, useSyncExternalStore} from 'react';

// One controller pair for the whole app lifetime -- components just need
// to call refreshDpad() (via useDpadRefresh below) after their focusable
// elements render.
export const dpad = new DpadController();
export const debugController = new DebugController(dpad);

export function refreshDpad() {
  dpad.update();
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

export function toggleDebug() {
  debugController.toggleDebugMode();
  debugOnStore.set(!debugOnStore.get());
}

// --- Minimal external stores, subscribed to via useSyncExternalStore -----

function createStore<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

export type FocusedNode = {id: string; tabindex: number; x: number; y: number} | null;

const debugOnStore = createStore(false);
const focusedNodeStore = createStore<FocusedNode>(null);

export function useDebugOn() {
  return useSyncExternalStore(debugOnStore.subscribe, debugOnStore.get);
}

export function useFocusedNode() {
  return useSyncExternalStore(focusedNodeStore.subscribe, focusedNodeStore.get);
}

/** Call once, at the app root, to keep the dpad-nav graph and focus HUD in sync with the DOM. */
export function useDpadLifecycle(route: string) {
  useLayoutEffect(() => {
    refreshDpad();
    focusInitial();
  }, [route]);

  useEffect(() => {
    const onFocus = (event: FocusEvent) => {
      const el = event.target as HTMLElement;
      if (!el.classList?.contains('dpad-focusable')) return;
      const rect = el.getBoundingClientRect();
      focusedNodeStore.set({
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
    };

    document.addEventListener('focus', onFocus, true);
    return () => {
      document.removeEventListener('focus', onFocus, true);
    };
  }, []);
}
