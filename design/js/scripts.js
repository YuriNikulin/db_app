function getScript(name) {
	return pathPhpFunc + name + '.php';
}

function showNotification(text, timer) {
	var nContainer = document.createElement('div'),
		nText = document.createElement('p'),
		oldNotification = document.querySelector('.notification');

	nContainer.className = 'notification';
	nContainer.appendChild(nText);

	nText.className = 'notification__text';
	nText.innerHTML = text ? text : 'OK';

	if (oldNotification) {
		hideElem(oldNotification, true);
	}

	body.appendChild(nContainer);
	showElem(nContainer);

	if (timer) {
		nContainer.hideTimer = setTimeout(function() {
			hideElem(nContainer, true);
		}, timer);
	}

	return nContainer;
}

function showElem(elem) {
	elem.style.display = 'block';
	setTimeout(function() {
		elem.classList.add('shown');
	}, 10);
}

function hideElem(elem, deleteElem) {
	elem.classList.remove('shown');

	if (elem.removalTimer) {

		clearTimeout(elem.removalTimer);
	}

	elem.removalTimer = setTimeout(function() {
		if (deleteElem && elem) {
			if (!elem.parentNode) {
				body.appendChild(elem);
			} 

			elem.parentNode.removeChild(elem);
		} else {
			elem.style.display = 'none';
		}
	}, animDuration)
}

function fetchAllDb() {
	var mainContainer = renderMainContainer(),
		fadParameters, fadAnswer;

	fadParameters = '?script=get_databases.php';
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onload = function() {
			fadAnswer = JSON.parse(this.response);
				if (fadAnswer.success) {
					var container = basicRender('div', 'content-left', mainContainer),
						dbListContainer = basicRender('div', 'db-list', container),
						dbCreate = basicRender('a', 'db__create action action__create-db', container);

					dbCreate.innerHTML = 'Create database';	

					for (var i = 0; i < fadAnswer.db_list.length; i++) {
						renderDb(fadAnswer.db_list[i], dbListContainer);
					}
				}
			}
		
		xmlhttp.open("GET", 'func.php' + fadParameters, true);
		xmlhttp.send();
}

function fetchAllTables() {
	
}