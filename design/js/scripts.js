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

function findParent(elem, parentClass) {
	var parent = elem.parentNode;
	while (parent != body) {
		if (parent.classList.contains(parentClass)) {
			return parent;
		}
		elem = parent;
		parent = elem.parentNode;
	}
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
		fatScript = '?script=get_tables.php',
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

function fetchTable(table, db) {
	var ftScript = '?script=query.php',
		ftSql = ' DESCRIBE ' + table,
		ftMode = '&mode=read',
		ftParameters = ftScript + '&use=' + db + '&sql=' + ftSql + ftMode,
		ftAnswer;

	xmlhttp = new XMLHttpRequest();

	xmlhttp.onload = function() {
		ftAnswer = JSON.parse(this.response);
		if (ftAnswer.success) {
			renderRightContainer(db, table);
			renderTableDescription(ftAnswer.msg);
		}
	}

	xmlhttp.open("GET", 'func.php' + ftParameters, true);
	xmlhttp.send();
}

function getFields(data) {
	var fields = [];
	for (var i in data) {
		fields.push(Object.keys(data[i]));
	}
	return unionOfArrays(fields);
}

function unionOfArrays(data) {
	var obj = {};
	
	for (i = 0; i < data.length; i++) {
		for (var j = 0; j < data[i].length; j++) {
			obj[data[i][j]] = 1;
		}
	}
	
	return obj;
}

function saveAndGenerateSqlStructure(data) {
	var localData = data;
	console.log(localData);
}

function altering(changingButtons, tableContent, fields) {
	var changingMode = false,
		rows,
		columnsToAlter = {

			'alter': {},
			'drop': {},
			'add': {},
			'pushInto': function(row, mode) {
				columnsToAlter[mode][row.dataset.column] = {};
			}
		};

	inputs = tableContent.querySelectorAll('input');
	rows = tableContent.querySelectorAll('tbody tr');	

	for (var i in changingButtons) {
		changingButtons[i].addEventListener('click', function() {
			

			if (this == changingButtons.change && changingMode != 'alter') {
				changingMode = 'alter';
				tableContent.classList.add('altering');
				changingButtons.save.classList.remove('disabled');
				resetDeleting(rows, tableContent);

				for (i = 0; i < inputs.length; i++) {
					inputs[i].disabled = false;
					inputs[i].onkeyup = function() {
						columnsToAlter.pushInto(this.parentNode.parentNode, 'alter');
					}
				}

			} else if (this == changingButtons.remove && changingMode != 'drop') {
				changingMode = 'drop';
				tableContent.classList.add('deleting');
				changingButtons.save.classList.remove('disabled');
				resetAltering(inputs, tableContent);

				for (i = 0; i < rows.length; i++) {
					rows[i].onclick = function() {
						columnsToAlter.pushInto(this, 'drop');
					}
				}

			} else if (this == changingButtons.save) {
				saveAndGenerateSqlStructure(columnsToAlter);
				changingMode = false;
				changingButtons.save.classList.add('disabled');

			} else {
				changingMode = false;
				changingButtons.save.classList.add('disabled');
				resetAltering(inputs, tableContent);
				resetDeleting(rows, tableContent);
			}
		}) 	
	}

	function resetAltering(items, container) {
		for (var i = 0; i < items.length; i++) {
			items[i].disabled = true;
			items[i].value = items[i].dataset.value;
		}
		container.classList.remove('altering');
		columnsToAlter['alter'] = {};
	}

	function resetDeleting(items, container) {
		for (var i = 0; i < items.length; i++) {
			items[i].classList.remove('delete');
		}
		container.classList.remove('deleting');
		columnsToAlter['drop'] = {};
	}
}