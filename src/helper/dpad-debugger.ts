import {DpadController} from '../lib/dpad-controller';
import {DebugController} from '../lib/debug-controller';

declare global {
  interface Window {
    dpad: DpadController|null;
    dpaddebug: DebugController;
  }
}

window.addEventListener('load', () => {
  window.dpaddebug = window.dpaddebug || new DebugController(window.dpad);
});

window.addEventListener('resize', () => {
	if(!window.dpaddebug) {
		return;
	}
	window.dpaddebug.updateDisplay();
});