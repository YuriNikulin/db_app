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

function showNotification(text, timer, important) {
	var nContainer = document.createElement('div'),
		nText = document.createElement('p'),
		oldNotification = document.querySelectorAll('.notification');

	nContainer.className = 'notification';
	nContainer.appendChild(nText);

	if (important) {
		nContainer.classList.add('important');
	}

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

function showOverlay() {
	var overlay = basicRender('div', 'overlay', body);
	showElem(overlay);
	return overlay;
}

function hideOverlay() {
	var elems = body.querySelectorAll('.overlay'); 

	for (var i = 0; i < elems.length; i++) {
		hideElem(elems[i]);
	}
}

function showPopup(content, containerClass) {
	var overlay = showOverlay();
	var container = basicRender('div', containerClass + ' popup', body);
	container.appendChild(content);

	if (content.querySelector('.focus')) {
		content.querySelector('.focus').focus();
	}

	overlay.addEventListener('click', function() {
		hidePopup(container);
	})

	showElem(container);
	return container;
}

function hidePopup(elem) {
	if (!elem) {
		return 0;
	}

	hideOverlay();
	hideElem(elem, true);
}

function inputNavigation(input) {
	var eventObj;
	input.addEventListener('keydown', function(event) {
		if (event.code == 'ShiftLeft' || event.key == 'Shift' || event.keyCode == 16) {
			input.isShifted = true;
		}
		if (input.isShifted) {
			if (event.code == 'ArrowRight' || event.key == 'ArrowRight' || event.keyCode == 39) {
				inputNavigate('right', input);
			} else if (event.code == 'ArrowLeft' || event.key == 'ArrowLeft' || event.keyCode == 37) {
				inputNavigate('left', input);
			} else if (event.code == 'ArrowUp' || event.key == 'ArrowUp' || event.keyCode == 38) {
				inputNavigate('up', input);
			} else if (event.code == 'ArrowDown' || event.key == 'ArrowDown' || event.keyCode == 40) {
				inputNavigate('down', input);
			} 
		}
	})

	input.addEventListener('keyup', function() {
		if (event.code == 'ShiftLeft' || event.key == 'Shift' || event.keyCode == 16) {
			input.isShifted = false;
		}
	})
}

function inputNavigate(mode, input) {
	var elem;
	try {
		if (mode == 'left') {
			elem = input.parentNode.previousSibling.querySelector('input');
		} else if (mode == 'right') {
			elem = input.parentNode.nextSibling.querySelector('input');
		} else if (mode == 'up' || mode == 'down') {
			var td = input.parentNode,
				tr = td.parentNode,
				countNumber;

			for (var i = 0; i < tr.childNodes.length; i++) {
				if (tr.childNodes[i] == td) {
					countNumber = i;
				}
			}

			if (mode == 'up') {
				elem = tr.previousSibling.childNodes[countNumber].querySelector('input');
			} else {
				elem = tr.nextSibling.childNodes[countNumber].querySelector('input');
			}
		}

		if (elem) {
			elem.focus();
			elem.isShifted = true;
		}
	} catch(error) {
		return 0;
	}
}

function inputNavigateRight(input) {
	try {
		var rightInput = input.parentNode.nextSibling.querySelector('input');
		if (rightInput) {
			rightInput.focus();
		}
	} catch(error) {
		return 0;
	}
}

function createDatabase() {
	var mainContainer = basicRender('div', ''),
		inputContainer = basicRender('div', 'input-container', mainContainer),
		label = basicRender('label', 'input-label title h3', inputContainer),
		input = basicRender('input', 'input focus', inputContainer),
		buttonsContainer = basicRender('div', 'input-container', mainContainer),
		create = basicRender('a', 'btn btn--success', buttonsContainer),
		cancel = basicRender('a', 'btn btn--warning ml', buttonsContainer),
		answer;

	label.innerHTML = 'Enter name for database';
	create.innerHTML = 'Create';
	cancel.innerHTML = 'Cancel';

	var popup = showPopup(mainContainer, 'create-db');	

	cancel.onclick = function() {
		hidePopup(popup);
	}

	create.onclick = function() {
		var parameters = '?script=query.php&mode=write&sql=CREATE DATABASE ' + input.value;
		xmlhttp = new XMLHttpRequest();

		xmlhttp.onload = function() {
			answer = JSON.parse(this.response);
			if (answer.success) {
				fetchAllDb();
			} else {
				showNotification(answer.msg, 4000);
			}

		hidePopup(popup);
	}

	xmlhttp.open("GET", 'func.php' + parameters, true);
	xmlhttp.send();
	}
}

function sendSql(sql, mode, use, successCallback) {
	var parameters = '?script=query.php&mode=' + mode + '&sql=' + sql;
	if (use) {
		parameters += '&use=' + use;
	}
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open("GET", 'func.php' + parameters, true);
	xmlhttp.send();

	xmlhttp.onload = function() {
		console.log(this.response);

		try {
			var answer = JSON.parse(this.response);
			if (answer.success) {
				successCallback();
			} else {
				showNotification(answer.msg, 3000);
			}
		} catch(error) {
			console.log(error);
			return 0;
		}
	}
}

function getUserAcception(msg, func) {
	var mainContainer = basicRender('div', ''),
		text = basicRender('h3', 'h3 mb fwn', mainContainer),
		buttonsContainer = basicRender('div', 'input-container tac', mainContainer),
		accept = basicRender('a', 'btn btn--success', buttonsContainer),
		cancel = basicRender('a', 'btn btn--warning ml', buttonsContainer),
		popup = showPopup(mainContainer);

	text.innerHTML = msg;
	accept.innerHTML = 'Accept';
	cancel.innerHTML = 'Cancel';

	cancel.onclick = function() {
		hidePopup(popup);
	}

	accept.onclick = function() {
		hidePopup(popup);
		func();
	}
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
						dbCreate = basicRender('a', 'btn btn--success db__create action action__create-db', dbCreateContainer);

					title.innerHTML = 'Databases';
					dbCreate.innerHTML = 'Create database';	
					dbCreate.onclick = function() {
						createDatabase();
					}

					fixHeight(dbListContainer);
					renderRightContainer(true);

					for (var i = 0; i < fadAnswer.db_list.length; i++) {
						renderDb(fadAnswer.db_list[i], dbListContainer);
					}
				}
			}
		
		xmlhttp.open("GET", 'func.php' + fadParameters, true);
		xmlhttp.send();
}

function newTableInterface(db) {
	var popupContent = basicRender('div'),
		popupTitleContainer = basicRender('div', 'input-container', popupContent),
		popupTitle = basicRender('label', 'h3 title', popupTitleContainer),
		popupInputContainer = basicRender('div', 'input-container', popupContent),
		popupInput = basicRender('input', 'input focus', popupInputContainer),
		popupButtonsContainer = basicRender('div', 'input-container', popupContent),
		createButton = basicRender('a', 'btn btn--success', popupButtonsContainer),
		cancelButton = basicRender('a', 'btn btn--warning ml', popupButtonsContainer);

	popupTitle.innerHTML = 'Enter name for new table';
	createButton.innerHTML = 'Create';
	cancelButton.innerHTML = 'Cancel';

	var popup = showPopup(popupContent);	

	cancelButton.onclick = function() {
		hidePopup(popup);
		return 0;
	};

	createButton.onclick = function() {
		var tableName = popupInput.value.match(/[^\s]/g);
		if (!tableName) {
			showNotification('You have entered an invalid name for table', 3000, true);
		} else {
			tableName = tableName.join('');
			hidePopup(popup);
			renderRightContainer(true, db, tableName);
			renderNewTableInterface(db, tableName);
			document.querySelector('.tabs__structure').parent.open();
		}
	}
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
		try {	
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
				var newTableContainer = basicRender('div', 'tac mt mb table__create-container', tablesContainer),
					newTable = basicRender('a', 'table__create btn btn--success', newTableContainer);
				newTable.innerHTML = 'Create a new table';
				newTable.onclick = function() {
					newTableInterface(findParent(this, 'db').dataset.db);
				}
			}
		} catch(error) {
			console.log(this.response);
		}
	}	
	xmlhttp.open("GET", 'func.php' + fatParameters, true);
	xmlhttp.send();
}

function fetchTable(table, db, activeTab) {
	var ftScript = '?script=query.php',
		ftSql = ' DESCRIBE ' + table,
		ftMode = '&mode=read',
		ftParameters = ftScript + '&use=' + db + '&sql=' + ftSql + ftMode,
		ftAnswer;

	if (!activeTab) {
		activeTab = 'structure';
	}	

	xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function() {
		try {
			ftAnswer = JSON.parse(this.response);
			if (ftAnswer.success) {
				renderRightContainer(true, db, table);
				renderTableDescription(ftAnswer.msg, table, db, document.querySelector('.table-structure'), saveAndGenerateSqlStructure, activeTab);
				fetchTableContent(table, db, ftAnswer.msg);
			}
		} catch(error) {
			return 0;
		}
		
	}

	xmlhttp.open("GET", 'func.php' + ftParameters, true);
	xmlhttp.send();
}

function fetchTableContent(table, db, structure) {
	var ftcScript = '?script=query.php',
		ftcSql = ' SELECT * FROM ' + table,
		ftcMode = '&mode=read',
		ftcParameters = ftcScript + '&use=' + db + '&sql=' + ftcSql + ftcMode,
		ftcAnswer;	

	xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function() {
		try {
			var container = document.querySelector('.table-content');
			container.PK = getPKFrom(structure);
			ftcAnswer = JSON.parse(this.response);
			console.log(container.PK);
			if (ftcAnswer.success) {
				renderTableDescription(ftcAnswer.msg, table, db, container, saveAndGenerateSqlContent);
			}
		} catch(error) {
			console.log(this.response);
			return 0;
		}
		
	}

	xmlhttp.open("GET", 'func.php' + ftcParameters, true);
	xmlhttp.send();	
}

function getPKFrom(data) {
	var PK;

	for (var i = 0; i < data.length; i++) {
		if (data[i]['Key'] == 'PRI' || data[i]['Key'] == 'PRIMARY KEY') {
			PK = data[i]['Field'];
			return PK;
		}
	}

	return 0;
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

function sqlCT(data, table) {
	if (!data.length) {
		return 0;
	}
	
	var sql = 'CREATE TABLE ' + table + '(',
		isFirst = true;

	for (var i = 0; i < data.length; i++) {
		sql += generate(data[i]);
		if (data.length - i > 1) {
			sql += ', ';
		}
	}

	sql += ')';

	function generate(data) {
		var localSql = '';

		for (var i in data) {
			if (data[i]) {
				if ((i == 'Null' && data[i] == 'NO')) {
					localSql += 'NOT NULL ';

				} else if (i == 'Null' && data[i] == 'YES') {
					localSql += 'NULL ';

				} else if (i == 'Default') {
					localSql += 'DEFAULT ' + "'" + data[i] + "'" + ' ';

				} else {
					localSql += data[i] + ' ';
				}
			}
		}
		return localSql;
	}

	return sql;
}

function sqlATM(data, table) {
	var rowsToReplace = [],
		sql = '', 
		rowsToMove = [];

	if (!data.length) {
		return 0;
	}
	
	for (var i in data) {
		if (data[i].oldPK != data[i]['Field']) {
			rowsToReplace.push(data[i]);
		}
	}

	if (rowsToReplace.length) {
		sql += 'ALTER TABLE ' + table + ' ';
		for (i = 0; i < rowsToReplace.length; i++) {
			data.splice(data.indexOf(rowsToReplace[i]), 1);
			sql += 'DROP COLUMN ' + rowsToReplace[i].oldPK;
			if (rowsToReplace.length - i > 1) {
				sql += ', '
			}
		}
		sql += '; ';
		sql += sqlATA(rowsToReplace, table) + '; ';
	}

	if (data.length) {
		sql += 'ALTER TABLE ' + table + ' ';

		for (i = 0; i < data.length; i++) {
			sql += generate(data[i]);
			if (data.length - i > 1) {
				sql += ', ';
			}
		}

		sql += ';';
	}

	function generate(data) {
		var localSql = 'MODIFY ';

		for (var i in data) {
			localSql += sqlExceptions(data[i], i);
		}

		return localSql;
	}

	return sql;
}

function sqlATA(data, table) {
	if (!data.length) {
		return 0;
	}

	var sql = 'ALTER TABLE ' + table + ' ',
		isFirst = true;

	sql += generate(data[0]);
	isFirst = false;
	
	for (var i = 1; i < data.length; i++) {
		sql += generate(data[i]);
	}

	function generate(data) {
		var localSql = 'ADD COLUMN ';

		if (!isFirst) {
			localSql = ', ' + localSql;
		}

		for (var i in data) {
			localSql += sqlExceptions(data[i], i);
		}

		return localSql;
	}

	return sql;
}

function sqlExceptions(data, i) {
	var localSql = '';
	if (data && i) {
		if (i == 'oldPK') {
			return '';
		}
		if ((i == 'Null' && data == 'NO')) {
			localSql += 'NOT NULL ';
		} else if (i == 'Null' && data == 'YES') {
			localSql += 'NULL ';
		} else if (i == 'Default') {
			localSql += 'DEFAULT ' + "'" + data + "'" + ' ';
		} else if (i == 'Key' && data == 'PRI') {
			localSql += 'PRIMARY KEY ';
		} else {
			localSql += data + ' ';
		}
	}
	return localSql;
}

function parseTr(data, savePK) {
	var addedRows = [],
		count = 0,
		parameter;
	for (var i in data) {
		var items = data[i].childNodes;
		addedRows[count] = {};
		for (var j = 0; j < items.length; j++) {
			var input = items[j].firstChild,
				parameter = input.dataset.parameter;
				addedRows[count][parameter] = input.value; 
		}
		if (savePK) {
			addedRows[count]['oldPK'] = i;
		}
		count++;
	}
	return addedRows;
}

function saveAndGenerateSqlNewTable(data, mode, table, db) {
		var addedRows = parseTr(data),
			sql = sqlCT(addedRows, table);

	sendSql(sql, 'write', db, function() {
		var dbItem = document.querySelector('[data-db=' + db + '].db'),
			dbTitle = dbItem.querySelector('.db__title'),
			dbOld = dbItem.querySelector('.db-tables'),
			dbOldItems = dbOld.childNodes;
		dbItem.classList.remove('db--tables-rendered');
		for (var i = 0; i < dbOldItems.length; i++) {
			dbOldItems[i].parentNode.removeChild(dbOldItems[i]);
		}

		fetchAllTables(dbTitle);
		fetchTable(table, db);
	});


}

function sqlD(data, table, PK) {
	if (PK) {
		var sql = 'DELETE FROM ' + table + ' WHERE ';
		for (var i = 0; i < data.length; i++) {
			sql += PK + ' = ' + data[i][PK];

			if (data.length - i > 1) {
				sql += ' OR ';
			}
		}
		sql += ';';
	}

	else {
		var sql = 'DELETE FROM ' + table + ' WHERE ';

		for (var i = 0; i < data.length; i++) {
			var isFirst = true;

			for (var j in data[i]) {
				if (data[i][j]) {
					if (!isFirst) {
						sql += 'AND ';
					}

					isFirst = false;
					sql += j + ' = \'' + data[i][j] + '\' ';
				}
			}

			if (data.length - i > 1) {
				sql += 'OR ';
			}
		}
	}

	return sql;
}

function sqlI(data, table, PK) {
	if (PK) {
		for (var i = 0; i < data.length; i++) {
			delete data[i][PK];
		}
	}

	var sql = 'INSERT INTO ' + table + ' (',
		fields = Object.keys(getFields(data));

	for (var i = 0; i < fields.length; i++) {
		sql += fields[i];
		if (fields.length - i > 1) {
			sql += ', ';
		}
	}

	sql += ') VALUES ';

	for (i = 0; i < data.length; i++) {
		sql += '(';
		var isFirst = true;

		for (var j in data[i]) {
			if (!isFirst) {
				sql += ', ';
			}
			sql += '\'' + data[i][j] + '\' ';
			isFirst = false;
		}
		sql += ')';
		if (data.length - i > 1) {
			sql += ', ';
		}
	}
	sql += ';';
	
	return sql;
}

function saveAndGenerateSqlContent(data, mode, table, db) {
	var sScript = '?script=query.php',
		container = document.querySelector('.table-content'),
		PK = container.PK,
		sSql, sMode, sParameters, sAnswer, addedRows;

	if (mode == 'drop') {
		addedRows = parseTr(data);
		sSql = sqlD(addedRows, table, PK);
	} else if (mode == 'add') {
		addedRows = parseTr(data);
		sSql = sqlI(addedRows, table, PK);
	}

	sParameters = sScript + '&scl=' + sSql + '&mode=' + sMode;
	sendSql(sSql, sMode, null, function() {
		fetchTable(table, db, 'content');
	})
}

function saveAndGenerateSqlStructure(data, mode, table, db) {
	var localData = data,
		mode,
		sScript = '?script=query.php',
		sSql, sMode, sParameters, sAnswer;


	if (mode == 'drop') {
		sSql = sqlATDC(data, table);
		sMode = 'write';

	} else if (mode == 'add') {
		var addedRows = [],
			count = 0;

		addedRows = parseTr(data);
		sSql = sqlATA(addedRows, table);
		sMode = 'write';
	} else if (mode == 'alter') {
		addedRows = parseTr(data, true);
		sMode = 'write';
		sSql = sqlATM(addedRows, table);
	}

	sParameters = sScript + '&sql=' + sSql + '&mode=' + sMode;

	xmlhttp = new XMLHttpRequest();

	xmlhttp.onload = function() {
		sAnswer = JSON.parse(this.response);
		console.log(sAnswer);
		if (!sAnswer.success) {
			showNotification(sAnswer.msg, 6000);
		} else if(table && db) {
			fetchTable(table, db)
		}
	}
	xmlhttp.open("GET", 'func.php' + sParameters, true);
	xmlhttp.send();
}

function altering(changingButtons, tableContent, tableName, fields, alteringFunc, additionalData) {
	var changingMode = false,
		rows,
		columnsToAlter = {},
		newCount = 0,
		db = tableContent.dataset.db, 
		inputs;

	tableContent.changingButtons = changingButtons;

	inputs = tableContent.querySelectorAll('input');
	rows = tableContent.querySelectorAll('tbody tr');	

	for (var i in changingButtons) {
		changingButtons[i].addEventListener('click', function() {

			if (this == changingButtons.change && changingMode != 'alter') {
				this.innerHTML = 'Disable changing mode';
				changingMode = 'alter';
				tableContent.classList.add('altering');
				changingButtons.save.classList.remove('disabled');
				resetDeleting(rows, tableContent);
				resetAdding(tableContent);

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
				resetAdding(tableContent);

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

			} else if (this == changingButtons.add) {
				if (changingMode != 'add') {
					resetAltering(inputs, tableContent);
					resetDeleting(rows, tableContent);
				}
				changingMode = 'add';
				changingButtons.save.classList.remove('disabled');
				columnsToAlter[newCount] = renderNewRow(tableContent, fields);
				newCount++;
			} 

			else if (this == changingButtons.save) {
				if (!additionalData && db) {
					additionalData = db;
				}
				alteringFunc(columnsToAlter, changingMode, tableName, additionalData);
				
				changingMode = false;
				changingButtons.save.classList.add('disabled');
				resetAltering(inputs, tableContent);
				resetDeleting(rows, tableContent);

			} else {
				changingMode = false;
				changingButtons.save.classList.add('disabled');
				resetAltering(inputs, tableContent);
				resetDeleting(rows, tableContent);
				resetAdding(tableContent);
			}
		}) 	
	}

	function resetAltering(items, container) {
		if (!changingButtons.change) {
			return 0;
		}
		for (var i = 0; i < items.length; i++) {
			items[i].disabled = true;
			if (items[i].dataset.value != 'null'){
				items[i].value = items[i].dataset.value;
			} else {
				items[i].value = '';
			}
		}
		changingButtons.change.innerHTML = 'Enable changing mode';
		container.classList.remove('altering');
		columnsToAlter = {};
	}

	function resetDeleting(items, container) {
		if (!changingButtons.remove) {
			return 0;
		}
		for (var i = 0; i < items.length; i++) {
			items[i].classList.remove('delete');
		}
		changingButtons.remove.innerHTML = 'Enable deleting mode';	
		container.classList.remove('deleting');
		columnsToAlter = {};
	}

	function resetAdding(container) {
		if (!changingButtons.add) {
			return 0;
		}
		var items = container.querySelectorAll('.add');
		for (var i = 0; i < items.length; i++) {
			items[i].parentNode.removeChild(items[i]);
		}
	}

	return tableContent;

}