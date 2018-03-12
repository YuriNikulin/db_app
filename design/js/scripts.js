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
				hideElem(lContainer);
				fetchAllDb();
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
			renderTableDescription(ftAnswer.msg, table);
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

function sqlATDC(data, table) {
	var sql = 'ALTER TABLE ' + table + ' ',
		tables = Object.keys(data);

	sql += 'DROP COLUMN ' + tables[0];
		
	for (var i = 1; i < tables.length; i++) {
		sql += ', DROP COLUMN ' + tables[i];
	}

	return sql;
}

function saveAndGenerateSqlStructure(data, mode, table) {
	var localData = data,
		mode,
		sScript = '?script=query.php',
		sSql, sMode, sParameters, sAnswer;

	if (mode == 'drop') {
		sSql = sqlATDC(data, table);
		sMode = 'write';
	}

	sParameters = sScript + '&sql=' + sSql + '&mode=' + sMode,
	console.log(sParameters);

	xmlhttp = new XMLHttpRequest();

	xmlhttp.onload = function() {
		// sAnswer = JSON.parse(this.response);
		sAnswer = this.response;
		console.log(sAnswer);
		if (sAnswer.success) {
			
		}
	}

	xmlhttp.open("GET", 'func.php' + sParameters, true);
	xmlhttp.send();
}

function altering(changingButtons, tableContent, tableName) {
	var changingMode = false,
		rows,
		columnsToAlter = {};

	inputs = tableContent.querySelectorAll('input');
	rows = tableContent.querySelectorAll('tbody tr');	

	for (var i in changingButtons) {
		changingButtons[i].addEventListener('click', function() {
			

			if (this == changingButtons.change && changingMode != 'alter') {
				this.innerHTML = 'Disable altering mode';
				changingMode = 'alter';
				tableContent.classList.add('altering');
				changingButtons.save.classList.remove('disabled');
				resetDeleting(rows, tableContent);

				for (i = 0; i < inputs.length; i++) {
					inputs[i].disabled = false;
					inputs[i].onkeyup = function() {
						var column = this.parentNode.parentNode;
						columnsToAlter[column.dataset.column] = column;
					}
				}

			} else if (this == changingButtons.remove && changingMode != 'drop') {
				changingMode = 'drop';
				this.innerHTML = 'Disable deleting mode';
				tableContent.classList.add('deleting');
				changingButtons.save.classList.remove('disabled');
				resetAltering(inputs, tableContent);

				for (i = 0; i < rows.length; i++) {
					rows[i].onclick = function() {
						if (this.classList.contains('delete')) {
							this.classList.remove('delete');
							delete columnsToAlter[this.dataset.column];
						} else {
							this.classList.add('delete');
							columnsToAlter[this.dataset.column] = this;
						}
					}
				}

			} else if (this == changingButtons.save) {
				saveAndGenerateSqlStructure(columnsToAlter, changingMode, tableName);
				changingMode = false;
				changingButtons.save.classList.add('disabled');
				resetAltering(inputs, tableContent);
				resetDeleting(rows, tableContent);

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
		changingButtons.change.innerHTML = 'Enable altering mode';
		container.classList.remove('altering');
		columnsToAlter = {};
	}

	function resetDeleting(items, container) {
		for (var i = 0; i < items.length; i++) {
			items[i].classList.remove('delete');
		}
		changingButtons.remove.innerHTML = 'Enable deleting mode';	
		container.classList.remove('deleting');
		columnsToAlter = {};
	}
}