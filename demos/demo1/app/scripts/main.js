function setFocusEvent(element) {
	'use strict';

	element.addEventListener('focus', function(e) {
		e.target.scrollIntoView(false);
	}, true);

	element.addEventListener('click', function() {
		console.log('Element Clicked');
	}, true);
}

window.addEventListener('load', function() {
	'use strict';

	var gridItems = document.querySelectorAll('.grid-item');
	for(var i = 0; i < gridItems.length; i++) {
		setFocusEvent(gridItems[i]);
	}
}, true);