function basicRender(tagName, elemClassName, container, deleteIfExists) {
	if (elemClassName && container) {
		var oldElemClass = '.' + elemClassName.replace(/\s/g, '.');
		var oldElem = container.querySelector(oldElemClass);
		if (oldElem && deleteIfExists) {
			oldElem.parentNode.removeChild(oldElem);
		}
	}

	var elem = document.createElement(tagName);
	if (elemClassName) {
		elem.className = elemClassName;
	}
	if (container) {
		container.appendChild(elem);
	}
	return elem;
}

function renderMainContainer() {
	var mainContainer = basicRender('div', 'content clearfix', body, true);
	calcContentHeight(mainContainer);
	return mainContainer;
}

function emptyContent() {
	var content = document.querySelector('.content');
	content.parentNode.removeChild(content);
}

function renderRightContainer(toRenderTabs, dbName, tableName) {
	var mainContent = document.querySelector('.content'),
		rightContainer = basicRender('div', 'content-right', mainContent, true);

	if (dbName && tableName) {
		var rightTopPanel = basicRender('div', 'content__title content-panel', rightContainer, true),
			dbSpan = basicRender('h3', 'h3 content-panel-item__parameter title', rightTopPanel),
			dbValue = basicRender('h3', 'h3 content-panel-item__value', rightTopPanel),
			tbSpan = basicRender('h3', 'h3 content-panel-item__parameter title', rightTopPanel),
			tbValue = basicRender('h3', 'h3 content-panel-item__value', rightTopPanel);

		dbSpan.innerHTML = 'Database: ';
		dbValue.innerHTML = dbName;
		tbSpan.innerHTML = 'Table: ';
		tbValue.innerHTML = tableName;	
	}

	if (toRenderTabs) {	
		var	rightHeader = basicRender('div', 'tabs', rightContainer),
			tabContainer = basicRender('div', 'tab-container', rightContainer),
			tableStructure = basicRender('div', 'table-structure tab-content', tabContainer),
			tableContent = basicRender('div', 'table-content tab-content', tabContainer),
			tabTableStructure = basicRender('h3', 'h3 content__title title tabs__tab tabs__structure', rightHeader),
			tabTableContent = basicRender('h3', 'h3 content__title title tabs__tab tabs__content', rightHeader);
		
		tabTableStructure.innerHTML = 'Table structure';	
		tabTableContent.innerHTML = 'Table content';

		new Tabs([
			{
				tab: tabTableStructure,
				content: tableStructure
			}, 

			{
				tab: tabTableContent,
				content: tableContent
			}
		]);	
	} else {
		var tabContainer = basicRender('div', 'tab-container', rightContainer);
	}

	var rightFooter = basicRender('div', 'db__create-container tar content-right-footer', rightContainer),
		logOut = basicRender('a', 'btn btn--primary logout', rightFooter);

	logOut.innerHTML = 'Log out';
	logOut.addEventListener('click', endSession);
	fixHeight(tabContainer);
}

function renderDb(db, container) {
	var dbContainer,
		dbTitle,
		dbTables,
		dbDrop;

	dbContainer = basicRender('div', 'db', container);
	dbContainer.dataset.db = db;

	dbTitle = basicRender('a', 'db__title', dbContainer);
	dbTitle.innerHTML = db;

	dbDrop = basicRender('a', 'db__drop', dbTitle);
	dbDrop.innerHTML = 'Drop database';

	dbDrop.onclick = function(event) {
		event.stopPropagation();
		var db = findParent(this, 'db').dataset.db;
		var msg = 'Are you sure you want to drop database '  + db + '?';

		getUserAcception(msg, function() {
			sendSql('DROP DATABASE ' + db, 'write');
			fetchAllDb();
		});
	}

	new Accordion(dbTitle, 300);
	dbTitle.addEventListener('click', function() {
		fetchAllTables(this);
	})

	dbTables = basicRender('div', 'db-tables', dbContainer);
}

function renderTable(table, container) {
	var elem = basicRender('a', 'table', container);
	elem.innerHTML = table;
	elem.dataset.table = table;

	elem.addEventListener('click', function() {
		fetchTable(this.dataset.table, findParent(this, 'db').dataset.db);
	})
}

function renderChangingButtons(container, data) {
	var obj = {};

	if (data['add']) {
		var addButton = basicRender('a', 'btn btn--primary ml mt', container);
		addButton.innerHTML = 'Add row';
		obj['add'] = addButton;
	}
	if (data['alter']) {
		var alterButton = basicRender('a', 'btn btn--primary ml mt', container);
		alterButton.innerHTML = 'Enable changing mode';
		obj['change'] = alterButton;
	}
	if (data['remove']) {
		var removeButton = basicRender('a', 'btn btn--warning ml mt', container);
		removeButton.innerHTML = 'Enable deleting mode';
		obj['remove'] = removeButton;
	}
	if (data['save']) {
		var saveButton = basicRender('a', 'btn btn--success disabled ml mt', container);
		saveButton.innerHTML = 'Save changes';
		obj['save'] = saveButton;
	}
	
	return obj;
}

function renderNewTableInterface(db, tableName) {
	var container = document.querySelector('.table-structure'),
		changingButtons = renderChangingButtons(container, {'add': true, 'save': true}),
		tableContainer = basicRender('div', 'e-table-container', container),
		tableContent = basicRender('table', 'e-table', tableContainer),
		columnsToAlter, changingMode, fieldsTh, fieldsTr, fieldsTbody, fieldsInput, td, inputs;

	fields = columnParameters;
	
	fieldsTh = basicRender('thead', '', tableContent);
	fieldsTr = basicRender('tr', '', fieldsTh);
	for (var i in fields) {
		td = basicRender('th', '', fieldsTr);
		td.innerHTML = i;
	}

	var alteringObj = altering(changingButtons, tableContent, tableName, Object.keys(fields), saveAndGenerateSqlNewTable, db);
	alteringObj.changingButtons.add.click();
}

function renderTableDescription(data, tableName, db) {

	var fields = getFields(data),
		mainContainer = document.querySelector('.table-structure'),
		changingButtons = renderChangingButtons(mainContainer, {'add': true, 'alter': true, 'remove': true, 'save': true}),
		tableContainer = basicRender('div', 'e-table-container', mainContainer),
		tableContent = basicRender('table', 'e-table', tableContainer),
		activeTab = document.querySelector('.tabs__structure'),
		fieldsTh, fieldsTr, fieldsTbody, fieldsInput, td, inputs,
		columnsToAlter = {},
		changingMode;

	tableContent.dataset.db = db;
	activeTab.parent.open();

	fieldsTh = basicRender('thead', '', tableContent);
	fieldsTr = basicRender('tr', '', fieldsTh);
	for (var i in fields) {
		td = basicRender('th', '', fieldsTr);
		td.innerHTML = i;
	}
	
	fields = Object.keys(fields);
	fieldsTbody = basicRender('tbody', '', tableContent);

	for (i in data) {
		fieldsTr = basicRender('tr', '', fieldsTbody);
		fieldsTr.dataset.column = data[i][fields[0]];

		for (var j = 0; j < fields.length; j++) {
			fieldsTd = basicRender('td', '', fieldsTr);
			fieldsInput = basicRender('input', '', fieldsTd);
			inputNavigation(fieldsInput);
			fieldsInput.value = data[i][fields[j]];
			fieldsInput.dataset.value = data[i][fields[j]];
			fieldsInput.dataset.parameter = fields[j];
			fieldsInput.disabled = true;
		}
	}

	if (tableName && db) {
		var dropTableButton = basicRender('a', 'btn btn--warning flr mr mb', mainContainer);
			dropTableButton.innerHTML = 'Drop table 	' + tableName;
			dropTableButton.onclick = function() {
				getUserAcception('Are you sure you want to drop table ' + tableName, function() {
					sendSql('DROP TABLE ' + tableName, 'write');
					var dbItem = document.querySelector('[data-db=' + db + '].db'),
						dbTitle = dbItem.querySelector('.db__title'),
						dbOld = dbItem.querySelector('.db-tables'),
						dbOldItems = dbOld.childNodes;

					dbItem.classList.remove('db--tables-rendered');
					for (var i = 0; i < dbOldItems.length; i++) {
						dbOldItems[i].parentNode.removeChild(dbOldItems[i]);
					}

					fetchAllTables(dbTitle);

				renderRightContainer();
				});
			}
		}

	

	altering(changingButtons, tableContent, tableName, fields, saveAndGenerateSqlStructure);
}

function renderNewRow(container, fields) {
	var newRow = basicRender('tr', 'add', container),
		td, input;

	for (var i = 0; i < fields.length; i++) {
		td = basicRender('td', '', newRow);
		input = basicRender('input', '', td);
		inputNavigation(input);
		input.dataset.parameter = fields[i];
	}	

	return newRow;
}