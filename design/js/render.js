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

function renderRightContainer() {
	var mainContent = document.querySelector('.content'),
		rightContainer = basicRender('div', 'content-right', mainContent, true),
		rightHeader = basicRender('div', 'tabs', rightContainer),
		tabContainer = basicRender('div', 'tab-container', rightContainer),
		tableStructure = basicRender('div', 'table-structure tab-content', tabContainer),
		tableContent = basicRender('div', 'table-content tab-content', tabContainer),
		tabTableStructure = basicRender('h3', 'h3 content__title title tabs__tab', rightHeader),
		tabTableContent = basicRender('h3', 'h3 content__title title tabs__tab', rightHeader),
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

	})
}