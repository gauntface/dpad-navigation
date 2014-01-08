window.onload = function() {
	var focusController = new FocusController();
	var focusableItems = document.querySelectorAll('.dpad-focusable');

	console.log('Found '+focusableItems.length+' focusable items.');
	console.log('=================================');

	for(var i = 0; i < focusableItems.length; i++) {
		focusController.addFocusableItem(
			new GenericFocusableItem(focusableItems[i])
		);
	}

	focusController.updateFocusGraph();

	if(focusableItems.length > 0) {
		focusController.handleFocusChangeToItem(0);
	}
};