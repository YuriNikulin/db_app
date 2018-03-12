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

function renderRightContainer(dbName, tableName) {
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
		
	var	rightHeader = basicRender('div', 'tabs', rightContainer),
		tabContainer = basicRender('div', 'tab-container', rightContainer),
		tableStructure = basicRender('div', 'table-structure tab-content', tabContainer),
		tableContent = basicRender('div', 'table-content tab-content', tabContainer),
		tabTableStructure = basicRender('h3', 'h3 content__title title tabs__tab tabs__structure', rightHeader),
		tabTableContent = basicRender('h3', 'h3 content__title title tabs__tab tabs__content', rightHeader),
		rightFooter = basicRender('div', 'db__create-container tar content-right-footer', rightContainer),
		logOut = basicRender('a', 'btn btn--primary logout', rightFooter);
	
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

	logOut.innerHTML = 'Log out';
	logOut.addEventListener('click', endSession);
	fixHeight(tabContainer);
}

function renderDb(db, container) {
	var dbContainer,
		dbTitle,
		dbTables;

	dbContainer = basicRender('div', 'db', container);
	dbContainer.dataset.db = db;

	dbTitle = basicRender('a', 'db__title', dbContainer);
	dbTitle.innerHTML = db;
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

function renderChangingButtons(container) {
	var newButton = basicRender('a', 'btn btn--primary ml mt', container),
		enableButton = basicRender('a', 'btn btn--primary ml mt', container),
		removeButton = basicRender('a', 'btn btn--warning ml mt', container),
		saveButton = basicRender('a', 'btn btn--success disabled ml mt', container);

	newButton.innerHTML = 'Add row';
	enableButton.innerHTML = 'Enable changing mode';
	removeButton.innerHTML = 'Enable deleting mode';
	saveButton.innerHTML = 'Save changes';

	return {'change': enableButton, 'save': saveButton, 'remove': removeButton, 'add': newButton};
}

function renderTableDescription(data, tableName, db) {

	var fields = getFields(data),
		mainContainer = document.querySelector('.table-structure'),
		changingButtons = renderChangingButtons(mainContainer),
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
			fieldsInput.value = data[i][fields[j]];
			fieldsInput.dataset.value = data[i][fields[j]];
			fieldsInput.dataset.parameter = fields[j];
			fieldsInput.disabled = true;
		}
	}

	altering(changingButtons, tableContent, tableName, fields);
}

function renderNewRow(container, fields) {
	var newRow = basicRender('tr', 'add', container),
		td, input;

	for (var i = 0; i < fields.length; i++) {
		td = basicRender('td', '', newRow);
		input = basicRender('input', '', td);
		input.dataset.parameter = fields[i];
	}	

	return newRow;
}