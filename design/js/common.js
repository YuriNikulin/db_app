var pathPhpFunc = 'app/functions/fn_',
	body = document.querySelector('body'),
	animDuration = 300,
	windowHeight,
	windowWidth,
	notificationDuration = 4000;

var MiniSearch = function(search, container) {
	var elems, i;
	search.onfocus = function() {
		elems = container.childNodes;
		console.log(elems);
	}
	search.onkeyup = function() {
		var searchPhrase = this.value,
			searchMask = new RegExp('.*' + searchPhrase + '.*');
		for (i = 0; i < elems.length; i++) {
			if (elems[i] == search) {
				continue;
			}

			if (!elems[i].innerHTML.match(searchMask)) {
				elems[i].style.display = 'none';
			}  else {
				elems[i].removeAttribute('style');
			}
		}
	}
} 	

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
