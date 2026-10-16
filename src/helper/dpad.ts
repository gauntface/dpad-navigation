// Copyright 2013 Google Inc. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import {DpadController} from '../lib/dpad-controller';

declare global {
  interface Window { dpad: DpadController; }
}

const initializeDpad = () => {
	window.dpad = window.dpad || new DpadController();
	window.dpad.update();
};

// Check if page has already loaded before registering the listener.
// If the script loads after the page has finished loading (e.g., with async/defer
// attributes or dynamic injection), the load event will never fire. In this case,
// we initialize immediately. Otherwise, we wait for the load event.
if (document.readyState === 'complete') {
	initializeDpad();
} else {
	window.addEventListener('load', initializeDpad);
}

window.addEventListener('resize', () => {
	if(!window.dpad) {
		return;
	}
	window.dpad.update();
});