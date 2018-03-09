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