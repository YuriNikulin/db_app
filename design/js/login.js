window.addEventListener('load', function() {
	var lContainer = document.querySelector('.login'),
		lSubmit = lContainer.querySelector('#login_submit'),
		lUsername = lContainer.querySelector('#login_username'),
		lPassword = lContainer.querySelector('#login_password'),
		lParameters, lAnswer, lAnim;

	lSubmit.addEventListener('click', function() {
		lParameters = '?username=' + lUsername.value + '&password=' + lPassword.value + '&script=connect.php';
		xmlhttp = new XMLHttpRequest();
		xmlhttp.onload = function() {
			lAnswer = JSON.parse(this.response);
			lAnim = lAnswer.timer || notificationDuration;
			showNotification(lAnswer.msg, lAnim);
		}
		
		xmlhttp.open("GET", 'func.php' + lParameters, true);
		xmlhttp.send();
	})	
})


