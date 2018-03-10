function basicRender(tagName, elemClassName, container, deleteIfExists) {
	if (elemClassName && container) {
		var oldElem = container.querySelector(elemClassName);
		if (oldElem) {
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
}