/* jshint undef: false */
window.addEventListener('load', function() {
	'use strict';

	window.dpadFocusController = new FocusController(false);

	var focusableItems = document.querySelectorAll('.dpad-focusable');

	for(var i = 0; i < focusableItems.length; i++) {
		window.dpadFocusController.addFocusableItem(
			new GenericFocusableItem(focusableItems[i])
		);
	}

	window.dpadFocusController.updateFocusGraph();

	if(focusableItems.length > 0) {
		window.dpadFocusController.setCurrentFocusItem(0);
	}
}, true);

window.addEventListener('resize', function() {
	'use strict';

	if(!window.dpadFocusController) {
		return;
	}

	window.dpadFocusController.updateFocusGraph();
}, false);