function getScript(name) {
	return pathPhpFunc + name + '.php';
}

function getWindowHeight() {
	windowHeight = window.innerHeight;
	return windowHeight;
}

function login() {
	var lContainer = document.querySelector('.login'),
		lSubmit = lContainer.querySelector('#login_submit'),
		lUsername = lContainer.querySelector('#login_username'),
		lPassword = lContainer.querySelector('#login_password'),
		lParameters, lAnswer, lAnim, unloginButton;

	showElem(lContainer);	

	lSubmit.addEventListener('click', function() {
		lParameters = '?username=' + lUsername.value + '&password=' + lPassword.value + '&script=connect.php';
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onload = function() {
			lAnswer = JSON.parse(this.response);
			lAnim = lAnswer.timer || notificationDuration;
			showNotification(lAnswer.msg, lAnim);
			if (lAnswer.success) {
				fetchAllDb();
				hideElem(lContainer);
			}
		}
		
		xmlhttp.open("GET", 'func.php' + lParameters, true);
		xmlhttp.send();
	})	
}

function endSession() {
	var parameters = '?script=unlogin.php',
		answer;

	xmlhttp = new XMLHttpRequest();
		xmlhttp.onload = function() {
			answer = JSON.parse(this.response);
			if (answer.success) {
				emptyContent();
				login();
			}
		}
		
		xmlhttp.open("GET", 'func.php' + parameters, true);
		xmlhttp.send();
}

function calcContentHeight(elem) {
	if (!elem) {
		return 0;
	}
	elem.style.height = getWindowHeight() + 'px';

	window.addEventListener('resize', function() {
		elem.style.height = getWindowHeight() + 'px';
	})
}

function fixHeight(elem) {
	var parent = elem.parentNode,
		siblings = parent.childNodes,
		siblingsHeight;

	function calc() {
		siblingsHeight = 0;
		for (var i = 0; i < siblings.length; i++) {
			if (siblings[i] != elem) {
				siblingsHeight += siblings[i].offsetHeight;
			}
		}

		elem.style.height = parent.offsetHeight - siblingsHeight + 'px';
	}

	calc();

	window.addEventListener('resize', calc);
}

function showNotification(text, timer) {
	var nContainer = document.createElement('div'),
		nText = document.createElement('p'),
		oldNotification = document.querySelectorAll('.notification');

	nContainer.className = 'notification';
	nContainer.appendChild(nText);

	nText.className = 'notification__text';
	nText.innerHTML = text ? text : 'OK';

	if (oldNotification) {
		for (var i = 0; i < oldNotification.length; i++) {
			hideElem(oldNotification[i], true);
		}
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
						title = basicRender('h3', 'title h3 content__title', container),
						dbListContainer = basicRender('div', 'db-list', container),
						dbCreateContainer = basicRender('div', 'tac db__create-container', container),
						dbCreate = basicRender('a', 'btn btn--primary db__create action action__create-db', dbCreateContainer);


					title.innerHTML = 'Databases';
					dbCreate.innerHTML = 'Create database';	

					fixHeight(dbListContainer);
					renderRightContainer();

					for (var i = 0; i < fadAnswer.db_list.length; i++) {
						renderDb(fadAnswer.db_list[i], dbListContainer);
					}
				}
			}
		
		xmlhttp.open("GET", 'func.php' + fadParameters, true);
		xmlhttp.send();
}

function fetchAllTables(elem) {
	var dbElem = elem.parentNode;

	if (dbElem.classList.contains('db--tables-rendered')) {
		return 0;
	}	

	var db = dbElem.dataset.db,
		fatContainer = dbElem.querySelector('.db-tables'),
		fatScript = '?script=query.php',
		fatSql = 'SHOW TABLES FROM ' + db,
		fatParameters = fatScript + '&sql=' + fatSql,
		fatAnswer;

	xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function() {
		fatAnswer = JSON.parse(this.response);
		if (fatAnswer.success) {
			dbElem.classList.add('db--tables-rendered');
			var tablesContainer = basicRender('div', 'tables', fatContainer);
			var search = basicRender('input', 'mini-search', tablesContainer);
			search.placeholder = 'Find table';

			new MiniSearch(search, tablesContainer);

			showElem(tablesContainer);
			for (var i = 0; i < fatAnswer.msg.length; i++) {
				renderTable(fatAnswer.msg[i], tablesContainer);
			}
		}
	}
	xmlhttp.open("GET", 'func.php' + fatParameters, true);
	xmlhttp.send();
}