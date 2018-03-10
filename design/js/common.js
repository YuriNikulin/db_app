var pathPhpFunc = 'app/functions/fn_',
	body = document.querySelector('body'),
	animDuration = 300,
	windowHeight,
	windowWidth,
	notificationDuration = 4000;

var Accordion = function(elem, height) {
	elem.open = function() {
		var content = elem.nextSibling;
		if (!content) return 0;
		elem.classList.add('open');
		content.classList.add('open');
		content.style.height = height + 'px';
	}

	elem.close = function() {
		var content = elem.nextSibling;
		if (!content) return 0;
		elem.classList.remove('open');
		content.classList.remove('open');
		content.style.height = 0;
	}

	elem.addEventListener('click', function() {
		if (elem.classList.contains('open')) {
			elem.close();
		} else {
			elem.open();
		}
	});	
}
