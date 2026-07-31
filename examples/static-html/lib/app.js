// Wires up the real @gauntface/dpad-nav library (vendored in ./lib/ from
// this repo's own build/browser output -- see lib/README.md) against
// whatever `.dpad-focusable[tabindex]` elements exist on the page, plus a
// small debug HUD that isn't part of the library itself.
(function () {
  const {DpadController, DebugController} = window.gauntface.dpad;

  const dpad = new DpadController();
  const debug = new DebugController(dpad);
  dpad.update();

  window.dpadNavDemo = {dpad, debug};

  const initial = document.querySelector('[data-dpad-initial-focus]');
  if (initial) {
    const items = dpad.getFocusableItems();
    const index = items.findIndex((item) => item.getElement() === initial);
    if (index > -1) {
      dpad.setCurrentFocusItem(index);
    }
  }

  const hud = document.getElementById('debug-hud');
  const hudId = document.getElementById('debug-hud-id');
  const hudTabindex = document.getElementById('debug-hud-tabindex');
  const hudCoords = document.getElementById('debug-hud-coords');

  document.querySelectorAll('.dpad-focusable').forEach((el) => {
    el.addEventListener('focus', () => {
      if (!hud) return;
      const rect = el.getBoundingClientRect();
      hud.classList.add('visible');
      hudId.textContent = el.dataset.nodeId || el.tagName.toLowerCase();
      hudTabindex.textContent = el.tabIndex;
      hudCoords.textContent = `${Math.round(rect.x)}, ${Math.round(rect.y)}`;

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

      const currentPos = document.querySelector('[data-current-pos]');
      if (currentPos) {
        currentPos.textContent = el.dataset.nodeId || `tabindex ${el.tabIndex}`;
      }
    });
  });

  let debugOn = false;
  const debugToggleEls = document.querySelectorAll('[data-dpad-debug-toggle]');
  const syncDebugToggles = () => {
    debugToggleEls.forEach((btn) => {
      btn.classList.toggle('active', debugOn);
      if (btn.dataset.dpadDebugToggle === 'checkbox') {
        btn.checked = debugOn;
      }
    });
    const label = document.querySelector('[data-dpad-debug-label]');
    if (label) {
      label.textContent = debugOn ? 'ON' : 'OFF';
    }
  };
  debugToggleEls.forEach((btn) => {
    btn.addEventListener('click', () => {
      debug.toggleDebugMode();
      debugOn = !debugOn;
      syncDebugToggles();
    });
  });
  syncDebugToggles();

  document.querySelectorAll('[data-dpad-reset]').forEach((btn) => {
    btn.addEventListener('click', () => {
      dpad.update();
      dpad.setCurrentFocusItem(0);
    });
  });
})();
