var pathPhpFunc = 'app/functions/fn_',
	body = document.querySelector('body'),
	animDuration = 300,
	windowHeight,
	windowWidth,
	notificationDuration = 4000,
	columnParameters = {
		'Field': 1,
		'Type': 1,
		'Null': 1,
		'Key': 1,
		'Default': 1,
		'Extra': 1
	};

var MiniSearch = function(search, container) {
	var elems, i;
	search.onfocus = function() {
		elems = container.childNodes;
	}
	search.onkeyup = function() {
		var searchPhrase = this.value,
			searchMask = new RegExp('.*' + searchPhrase + '.*', 'i');
		for (i = 0; i < elems.length; i++) {
			if (elems[i] == search || elems[i].classList.contains('table__create-container')) {
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

var Tabs = function(data) {
	for (var i in data) {
		var elem = data[i]
			elem.tab.parent = elem;

		elem.tab.addEventListener('click', function() {
			if (!this.classList.contains('active')) {
				this.parent.open();
			}
		})

		elem.open = function() {
			for (var j in data) {
				data[j].close();
			}

			this.tab.classList.add('active');
			this.content.classList.add('shown');
			this.content.style.display = 'block';
		}

		elem.close = function() {
			this.tab.classList.remove('active');
			this.content.classList.remove('shown');
			this.content.style.display = 'none';
		}
	}
}
