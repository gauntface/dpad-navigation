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
function resetFocusController() {
	window.dpadFocusController.removeAllFocusableItems();

	var focusableItems = document.querySelectorAll('.dpad-focusable');

	for(var i = 0; i < focusableItems.length; i++) {
		window.dpadFocusController.addFocusableItem(
			new GenericFocusableItem(focusableItems[i])
		);
	}

	window.dpadFocusController.updateFocusGraph();

	console.log('Found '+focusableItems.length+' focusable items');

	if(focusableItems.length > 0) {
		window.dpadFocusController.setCurrentFocusItem(0);
	}
}

/* jshint undef: false */
window.addEventListener('load', function() {
	'use strict';

	window.dpadFocusController = new FocusController();
	window.dpadFocusController.reset = resetFocusController;
	window.dpadFocusController.reset();

	window.dpadFocusController.toggleDebugMode();
}, true);

window.addEventListener('resize', function() {
	'use strict';

	if(!window.dpadFocusController) {
		return;
	}

	window.dpadFocusController.updateFocusGraph();
}, false);