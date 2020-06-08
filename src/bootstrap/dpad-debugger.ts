import {DPadController} from '../lib/dpad-controller';
import {DebugController} from '../lib/debug-controller';

declare global {
  interface Window {
    dpad: DPadController|null;
    dpaddebug: DebugController;
  }
}

window.addEventListener('load', () => {
  window.dpaddebug = window.dpaddebug || new DebugController(window.dpad);
  window.dpaddebug.setDebugMode(true);
});

window.addEventListener('resize', () => {
	if(!window.dpaddebug) {
		return;
	}
	window.dpaddebug.updateDisplay();
});